import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Phone, 
  Mail, 
  MapPin, 
  DollarSign, 
  Calendar,
  MessageSquare,
  Plus,
  X,
  AlertTriangle,
  FileText,
  User,
  Clock,
  Building,
  Ban,
  CheckCircle
} from 'lucide-react';
import { useApplicationStore } from '@/store/useApplicationStore';
import { useAuthStore } from '@/store/useAuthStore';
import { useAgreementStore } from '@/store/useAgreementStore';
import { StageTimeline } from '@/components/business/StageTimeline';
import { StageBadge } from '@/components/business/StageBadge';
import { formatDate, formatDateTime, formatRelativeTime } from '@/utils/date';
import { formatCurrency, maskPhone, maskIdCard } from '@/utils/format';
import type { CommunicationType } from '@/types';
import { COMMUNICATION_LABELS, STAGE_LABELS } from '@/types';

export const ApplicationDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const application = useApplicationStore(state => state.getApplicationById(id || ''));
  const advanceStage = useApplicationStore(state => state.advanceStage);
  const addCommunicationRecord = useApplicationStore(state => state.addCommunicationRecord);
  const rejectApplication = useApplicationStore(state => state.rejectApplication);
  const currentUser = useAuthStore(state => state.currentUser);
  const { createAgreement, agreements } = useAgreementStore();

  const [showCommModal, setShowCommModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [commContent, setCommContent] = useState('');
  const [commType, setCommType] = useState<CommunicationType>('phone');
  const [nextFollowUp, setNextFollowUp] = useState('');
  const [rejectReason, setRejectReason] = useState('');
  const [activeTab, setActiveTab] = useState<'info' | 'communication'>('info');

  useEffect(() => {
    if (id) {
      useApplicationStore.getState().setCurrentApplication(id);
    }
  }, [id]);

  if (!application) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <AlertTriangle className="w-16 h-16 text-gray-300 mb-4" />
        <p className="text-gray-500 mb-4">申请记录不存在</p>
        <button
          onClick={() => navigate('/hq/applications')}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          返回列表
        </button>
      </div>
    );
  }

  const existingAgreement = agreements.find(a => a.applicationId === application.id);

  const handleAdvanceStage = (note: string) => {
    if (id) {
      const success = advanceStage(id, note);
      if (success && application.currentStage === 'review') {
        const newAgreement = createAgreement(id, application.applicantName, application.city, application.investmentAmount);
        navigate(`/hq/agreements/${newAgreement.id}`);
      }
    }
  };

  const handleAddCommunication = () => {
    if (commContent.trim() && currentUser) {
      addCommunicationRecord(
        application.id,
        commContent,
        commType,
        currentUser.id,
        currentUser.name,
        nextFollowUp || undefined
      );
      setCommContent('');
      setCommType('phone');
      setNextFollowUp('');
      setShowCommModal(false);
    }
  };

  const handleReject = () => {
    if (rejectReason.trim() && id) {
      rejectApplication(id, rejectReason);
      setShowRejectModal(false);
      setRejectReason('');
    }
  };

  const handleCreateAgreement = () => {
    if (existingAgreement) {
      navigate(`/hq/agreements/${existingAgreement.id}`);
    } else {
      const newAgreement = createAgreement(
        application.id,
        application.applicantName,
        application.city,
        application.investmentAmount
      );
      navigate(`/hq/agreements/${newAgreement.id}`);
    }
  };

  const isTerminalStage = application.currentStage === 'completed' || application.currentStage === 'rejected';

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/hq/applications')}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-gray-800" style={{ fontFamily: 'Noto Serif SC, serif' }}>
              {application.applicantName} 的申请
            </h1>
            <StageBadge 
              stage={application.currentStage} 
              status={application.isDelayed ? 'delayed' : application.stageStatus} 
              size="lg"
            />
            {application.isDelayed && (
              <span className="px-3 py-1 bg-orange-100 text-orange-600 text-sm font-medium rounded-full animate-pulse">
                跟进延迟
              </span>
            )}
          </div>
          <p className="text-gray-500 mt-1">
            申请编号：{application.id} · 提交时间：{formatDateTime(application.createdAt)}
          </p>
        </div>
        {!isTerminalStage && (
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowRejectModal(true)}
              className="flex items-center gap-2 px-4 py-2 border border-red-200 text-red-600 rounded-xl hover:bg-red-50 transition-colors"
            >
              <Ban className="w-4 h-4" />
              拒绝申请
            </button>
            <button
              onClick={() => setShowCommModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all shadow-lg shadow-blue-500/25"
            >
              <Plus className="w-4 h-4" />
              记录沟通
            </button>
          </div>
        )}
      </div>

      {application.isDelayed && (
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-orange-500 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-orange-700 font-medium">
              该申请已超过 7 天未推进，最后跟进时间：{formatRelativeTime(application.lastProgressAt)}
            </p>
          </div>
          <button
            onClick={() => setShowCommModal(true)}
            className="px-4 py-1.5 bg-orange-500 text-white rounded-lg text-sm font-medium hover:bg-orange-600"
          >
            立即跟进
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <User className="w-5 h-5 text-blue-500" />
              申请人信息
            </h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-lg font-bold">
                  {application.applicantName.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold text-gray-800">{application.applicantName}</p>
                  <p className="text-sm text-gray-500">意向加盟商</p>
                </div>
              </div>
              <div className="pt-4 border-t border-gray-100 space-y-3">
                <InfoRow icon={Phone} label="联系电话" value={maskPhone(application.phone)} />
                <InfoRow icon={Mail} label="电子邮箱" value={application.email} />
                <InfoRow icon={FileText} label="身份证号" value={maskIdCard(application.idCard)} />
                <InfoRow icon={MapPin} label="所在地区" value={`${application.province} ${application.city}`} />
                <InfoRow icon={DollarSign} label="可投入资金" value={formatCurrency(application.investmentAmount)} />
                {application.storeArea && (
                  <InfoRow icon={Building} label="意向店铺面积" value={`${application.storeArea} ㎡`} />
                )}
                <InfoRow icon={Calendar} label="申请时间" value={formatDate(application.createdAt)} />
                <InfoRow icon={Clock} label="最后跟进" value={formatRelativeTime(application.lastProgressAt)} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <User className="w-5 h-5 text-orange-500" />
              负责专员
            </h3>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-semibold">
                {application.assignedAgentName?.charAt(0)}
              </div>
              <div>
                <p className="font-medium text-gray-800">{application.assignedAgentName}</p>
                <p className="text-sm text-gray-500">招商专员</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">行业经验</h3>
            <p className="text-gray-600 leading-relaxed">
              {application.experience || '未填写相关经验'}
            </p>
          </div>

          {application.currentStage === 'contract' && (
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl border border-orange-200 p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <FileText className="w-5 h-5 text-orange-500" />
                加盟协议
              </h3>
              {existingAgreement ? (
                <div>
                  <p className="text-sm text-gray-600 mb-3">
                    协议状态：
                    <span className={`font-medium ${
                      existingAgreement.status === 'signed_both' ? 'text-green-600' :
                      existingAgreement.status === 'signed_hq' ? 'text-blue-600' : 'text-orange-600'
                    }`}>
                      {existingAgreement.status === 'signed_both' ? '双方已签署' :
                       existingAgreement.status === 'signed_hq' ? '等待加盟商签署' : '待签署'}
                    </span>
                  </p>
                  <Link
                    to={`/hq/agreements/${existingAgreement.id}`}
                    className="block w-full py-2.5 text-center bg-orange-500 text-white rounded-xl font-medium hover:bg-orange-600 transition-colors"
                  >
                    查看协议详情
                  </Link>
                </div>
              ) : (
                <div>
                  <p className="text-sm text-gray-600 mb-3">
                    资质审核已通过，系统将自动生成加盟协议
                  </p>
                  <button
                    onClick={handleCreateAgreement}
                    className="w-full py-2.5 bg-orange-500 text-white rounded-xl font-medium hover:bg-orange-600 transition-colors"
                  >
                    生成加盟协议
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <StageTimeline
              currentStage={application.currentStage}
              stageHistory={application.stageHistory}
              isDelayed={application.isDelayed}
              onAdvance={handleAdvanceStage}
              canEdit={!isTerminalStage}
            />
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
            <div className="border-b border-gray-100">
              <div className="flex">
                <button
                  onClick={() => setActiveTab('info')}
                  className={`px-6 py-4 font-medium transition-colors ${
                    activeTab === 'info'
                      ? 'text-blue-600 border-b-2 border-blue-500'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  阶段历史
                </button>
                <button
                  onClick={() => setActiveTab('communication')}
                  className={`px-6 py-4 font-medium transition-colors flex items-center gap-2 ${
                    activeTab === 'communication'
                      ? 'text-blue-600 border-b-2 border-blue-500'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  沟通记录
                  <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full">
                    {application.communicationRecords.length}
                  </span>
                </button>
              </div>
            </div>

            <div className="p-6">
              {activeTab === 'info' ? (
                <div className="space-y-4">
                  {application.stageHistory.map((record, index) => (
                    <div key={index} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className={`w-3 h-3 rounded-full ${
                          record.status === 'completed' ? 'bg-green-500' : 'bg-blue-500'
                        }`} />
                        {index < application.stageHistory.length - 1 && (
                          <div className="w-0.5 flex-1 bg-gray-200 my-1" />
                        )}
                      </div>
                      <div className="flex-1 pb-4">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-gray-800">
                            {STAGE_LABELS[record.stage]}
                          </span>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${
                            record.status === 'completed' ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'
                          }`}>
                            {record.status === 'completed' ? '已完成' : '进行中'}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{record.note}</p>
                        <p className="text-xs text-gray-400 mt-2">
                          {formatDateTime(record.startedAt)}
                          {record.completedAt && ` → ${formatDateTime(record.completedAt)}`}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {application.communicationRecords.length === 0 ? (
                    <div className="text-center py-12 text-gray-400">
                      <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-50" />
                      <p>暂无沟通记录</p>
                    </div>
                  ) : (
                    application.communicationRecords.slice().reverse().map((record) => (
                      <div key={record.id} className="p-4 bg-gray-50 rounded-xl">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className={`px-2.5 py-0.5 text-xs font-medium rounded-full ${
                              record.type === 'phone' ? 'bg-blue-100 text-blue-600' :
                              record.type === 'meeting' ? 'bg-purple-100 text-purple-600' :
                              record.type === 'email' ? 'bg-green-100 text-green-600' :
                              'bg-gray-100 text-gray-600'
                            }`}>
                              {COMMUNICATION_LABELS[record.type]}
                            </span>
                            <span className="text-sm font-medium text-gray-800">
                              {record.agentName}
                            </span>
                          </div>
                          <span className="text-xs text-gray-400">
                            {formatDateTime(record.createdAt)}
                          </span>
                        </div>
                        <p className="text-gray-600">{record.content}</p>
                        {record.nextFollowUp && (
                          <div className="mt-2 pt-2 border-t border-gray-200">
                            <p className="text-sm text-orange-600 flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              下次跟进：{record.nextFollowUp}
                            </p>
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {showCommModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg animate-in fade-in zoom-in duration-300">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-800">记录沟通内容</h3>
              <button
                onClick={() => setShowCommModal(false)}
                className="p-1 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  沟通方式
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {Object.entries(COMMUNICATION_LABELS).map(([value, label]) => (
                    <button
                      key={value}
                      onClick={() => setCommType(value as CommunicationType)}
                      className={`py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                        commType === value
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  沟通内容
                </label>
                <textarea
                  value={commContent}
                  onChange={(e) => setCommContent(e.target.value)}
                  placeholder="请详细记录本次沟通内容..."
                  rows={5}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  下次跟进时间 <span className="text-gray-400 font-normal">(可选)</span>
                </label>
                <input
                  type="date"
                  value={nextFollowUp}
                  onChange={(e) => setNextFollowUp(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowCommModal(false)}
                className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleAddCommunication}
                disabled={!commContent.trim()}
                className="flex-1 px-4 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                保存记录
              </button>
            </div>
          </div>
        </div>
      )}

      {showRejectModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md animate-in fade-in zoom-in duration-300">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                <Ban className="w-5 h-5 text-red-500" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800">拒绝申请</h3>
                <p className="text-sm text-gray-500">此操作不可撤销</p>
              </div>
            </div>
            <p className="text-gray-600 mb-4">
              确定要拒绝 <strong>{application.applicantName}</strong> 的加盟申请吗？
            </p>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                拒绝原因
              </label>
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="请填写拒绝原因..."
                rows={3}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
              />
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowRejectModal(false)}
                className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleReject}
                disabled={!rejectReason.trim()}
                className="flex-1 px-4 py-2.5 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                确认拒绝
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

interface InfoRowProps {
  icon: React.ElementType;
  label: string;
  value: string;
}

const InfoRow: React.FC<InfoRowProps> = ({ icon: Icon, label, value }) => (
  <div className="flex items-center gap-3">
    <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
      <Icon className="w-4 h-4 text-gray-500" />
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-xs text-gray-500">{label}</p>
      <p className="text-sm text-gray-800 font-medium truncate">{value}</p>
    </div>
  </div>
);
