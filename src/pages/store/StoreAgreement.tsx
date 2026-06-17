import React, { useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  FileText, 
  CheckCircle, 
  Clock, 
  User,
  Download,
  AlertTriangle,
  Building2,
  Calendar
} from 'lucide-react';
import { useAgreementStore } from '@/store/useAgreementStore';
import { useApplicationStore } from '@/store/useApplicationStore';
import { useAuthStore } from '@/store/useAuthStore';
import { SignPad } from '@/components/business/SignPad';
import { formatDate, formatDateTime } from '@/utils/date';
import { formatCurrency } from '@/utils/format';
import { useState } from 'react';

export const StoreAgreement: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const getAgreementById = useAgreementStore(state => state.getAgreementById);
  const agreements = useAgreementStore(state => state.agreements);
  const signAgreement = useAgreementStore(state => state.signAgreement);
  const getApplicationById = useApplicationStore(state => state.getApplicationById);
  const advanceStage = useApplicationStore(state => state.advanceStage);
  const applications = useApplicationStore(state => state.applications);
  const currentUser = useAuthStore(state => state.currentUser);
  
  const [showSignPad, setShowSignPad] = useState(false);
  
  const myApplications = currentUser 
    ? applications.filter(a => a.phone === currentUser.phone)
    : [];
  const myApplication = myApplications[0];
  
  const myAgreements = myApplication 
    ? agreements.filter(a => a.applicationId === myApplication.id)
    : [];

  let agreement;
  if (id) {
    agreement = getAgreementById(id);
  } else if (myAgreements.length > 0) {
    agreement = myAgreements[0];
  }

  const application = agreement ? getApplicationById(agreement.applicationId) : myApplication;

  if (!agreement) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <FileText className="w-16 h-16 text-gray-300 mb-4" />
        <p className="text-gray-500 mb-2">暂无加盟协议</p>
        <p className="text-gray-400 text-sm">资质审核通过后，系统将自动生成加盟协议</p>
      </div>
    );
  }

  const getStatusInfo = () => {
    switch (agreement.status) {
      case 'draft':
        return { label: '待签署', color: 'bg-gray-100 text-gray-600' };
      case 'pending':
        return { label: '待总部签署', color: 'bg-yellow-100 text-yellow-700' };
      case 'signed_hq':
        return { label: '待您签署', color: 'bg-orange-100 text-orange-700' };
      case 'signed_both':
        return { label: '双方已签署', color: 'bg-green-100 text-green-700' };
      case 'rejected':
        return { label: '已拒绝', color: 'bg-red-100 text-red-700' };
      default:
        return { label: '未知状态', color: 'bg-gray-100 text-gray-600' };
    }
  };

  const statusInfo = getStatusInfo();
  const canSign = agreement.status === 'signed_hq' && currentUser?.role === 'franchisee';

  const handleSign = (signatureData: string) => {
    if (!currentUser || !agreement) return;
    
    const willBeBothSigned = agreement.status === 'signed_hq';
    const success = signAgreement(
      agreement.id,
      'franchisee',
      currentUser.name,
      signatureData
    );
    
    if (success && willBeBothSigned && application) {
      advanceStage(application.id, '加盟协议已签署，进入开店筹备阶段');
    }
    
    setShowSignPad(false);
  };

  const handleDownload = () => {
    const blob = new Blob([agreement.content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `加盟协议-${application?.applicantName || '协议'}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/store/dashboard')}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-gray-800" style={{ fontFamily: 'Noto Serif SC, serif' }}>
              加盟协议
            </h1>
            <span className={`px-3 py-1 text-sm font-medium rounded-full ${statusInfo.color}`}>
              {statusInfo.label}
            </span>
          </div>
          <p className="text-gray-500 mt-1">
            协议编号：{agreement.id} · 创建时间：{formatDateTime(agreement.createdAt)}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleDownload}
            className="flex items-center gap-2 px-4 py-2 border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 transition-colors"
          >
            <Download className="w-4 h-4" />
            下载协议
          </button>
          {canSign && (
            <button
              onClick={() => setShowSignPad(true)}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all shadow-lg shadow-orange-500/25"
            >
              <CheckCircle className="w-4 h-4" />
              签署协议
            </button>
          )}
        </div>
      </div>

      {agreement.status === 'pending' && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 flex items-center gap-3">
          <Clock className="w-5 h-5 text-yellow-500 flex-shrink-0" />
          <p className="text-yellow-700">
            协议已生成，等待总部签署完成后，您即可进行签署。
          </p>
        </div>
      )}
      
      {agreement.status === 'signed_hq' && (
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-orange-500 flex-shrink-0" />
          <p className="text-orange-700">
            总部已完成签署，请您尽快完成签署。签署后协议正式生效。
          </p>
        </div>
      )}

      {agreement.status === 'signed_both' && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3">
          <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
          <p className="text-green-700">
            双方已完成签署，协议正式生效。签署时间：{formatDateTime(agreement.signedAt || '')}
          </p>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-8" style={{ fontFamily: 'Noto Serif SC, serif' }}>
            品牌加盟合作协议
          </h2>
          
          <div className="whitespace-pre-wrap text-gray-700 leading-relaxed font-serif text-base leading-8">
            {agreement.content}
          </div>

          <div className="mt-12 pt-8 border-t-2 border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-6 text-center">签署页</h3>
            
            <div className="grid grid-cols-2 gap-8">
              <div className="p-6 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-2 mb-4">
                  <Building2 className="w-5 h-5 text-blue-500" />
                  <h4 className="font-semibold text-gray-800">甲方（总部）</h4>
                </div>
                <p className="text-sm text-gray-600 mb-2">XX品牌连锁有限公司</p>
                
                {agreement.hqSignature ? (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-sm text-gray-600">已签署</span>
                    </div>
                    <div className="bg-white p-3 rounded-lg">
                      <img 
                        src={agreement.hqSignature.signatureData} 
                        alt="总部签名" 
                        className="h-16 mx-auto"
                      />
                    </div>
                    <div className="mt-2 text-sm text-gray-500">
                      <p>签署人：{agreement.hqSignature.name}</p>
                      <p>签署时间：{formatDateTime(agreement.hqSignature.signedAt)}</p>
                    </div>
                  </div>
                ) : (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="h-20 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                      <span className="text-gray-400">待签署</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="p-6 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-2 mb-4">
                  <User className="w-5 h-5 text-orange-500" />
                  <h4 className="font-semibold text-gray-800">乙方（加盟商）</h4>
                </div>
                <p className="text-sm text-gray-600 mb-2">{application?.applicantName || '加盟商'}</p>
                <p className="text-sm text-gray-500">{application?.city}</p>
                
                {agreement.franchiseeSignature ? (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-sm text-gray-600">已签署</span>
                    </div>
                    <div className="bg-white p-3 rounded-lg">
                      <img 
                        src={agreement.franchiseeSignature.signatureData} 
                        alt="加盟商签名" 
                        className="h-16 mx-auto"
                      />
                    </div>
                    <div className="mt-2 text-sm text-gray-500">
                      <p>签署人：{agreement.franchiseeSignature.name}</p>
                      <p>签署时间：{formatDateTime(agreement.franchiseeSignature.signedAt)}</p>
                    </div>
                  </div>
                ) : (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="h-20 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                      <span className="text-gray-400">
                        {agreement.status === 'pending' ? '待总部先签署' : '待签署'}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {application && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">相关信息</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-gray-500">加盟商</p>
              <p className="font-medium text-gray-800">{application.applicantName}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">加盟城市</p>
              <p className="font-medium text-gray-800">{application.city}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">投资金额</p>
              <p className="font-medium text-orange-600">{formatCurrency(application.investmentAmount)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">申请时间</p>
              <p className="font-medium text-gray-800">{formatDate(application.createdAt)}</p>
            </div>
          </div>
        </div>
      )}

      {showSignPad && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <SignPad
            signerName={currentUser?.name || ''}
            onSave={handleSign}
            onCancel={() => setShowSignPad(false)}
          />
        </div>
      )}
    </div>
  );
};
