import React, { useState } from 'react';
import { Check, ChevronRight, Clock, AlertCircle } from 'lucide-react';
import type { ApplicationStage, StageRecord } from '@/types';
import { STAGE_ORDER, STAGE_LABELS } from '@/types';
import { formatDate } from '@/utils/date';

interface StageTimelineProps {
  currentStage: ApplicationStage;
  stageHistory: StageRecord[];
  isDelayed?: boolean;
  onAdvance?: (note: string) => void;
  canEdit?: boolean;
}

export const StageTimeline: React.FC<StageTimelineProps> = ({
  currentStage,
  stageHistory,
  isDelayed = false,
  onAdvance,
  canEdit = false
}) => {
  const [showModal, setShowModal] = useState(false);
  const [note, setNote] = useState('');

  const currentIndex = STAGE_ORDER.indexOf(currentStage);

  const handleAdvance = () => {
    if (note.trim() && onAdvance) {
      onAdvance(note);
      setNote('');
      setShowModal(false);
    }
  };

  return (
    <div className="relative">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-800">申请进度</h3>
        {isDelayed && (
          <span className="flex items-center gap-1 text-orange-500 text-sm font-medium">
            <AlertCircle className="w-4 h-4" />
            跟进延迟
          </span>
        )}
      </div>
      
      <div className="relative">
        {STAGE_ORDER.slice(0, -1).map((stage, index) => {
          const isCompleted = index < currentIndex;
          const isCurrent = index === currentIndex;
          const isLast = index === STAGE_ORDER.length - 2;
          const historyRecord = stageHistory.find(h => h.stage === stage);
          
          return (
            <div key={stage} className="relative flex items-start mb-6 last:mb-0">
              <div className="flex flex-col items-center mr-4">
                <div 
                  className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-500 ${
                    isCompleted 
                      ? 'bg-green-500 border-green-500 text-white' 
                      : isCurrent 
                        ? isDelayed 
                          ? 'bg-orange-500 border-orange-500 text-white animate-pulse'
                          : 'bg-blue-500 border-blue-500 text-white'
                        : 'bg-white border-gray-300 text-gray-400'
                  }`}
                >
                  {isCompleted ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    <span className="text-sm font-semibold">{index + 1}</span>
                  )}
                </div>
                {!isLast && (
                  <div 
                    className={`w-0.5 h-12 transition-all duration-500 ${
                      isCompleted ? 'bg-green-500' : 'bg-gray-200'}`}
                  />
                )}
              </div>
              
              <div className="flex-1 pt-1">
                <div className="flex items-center gap-2">
                  <h4 className={`font-semibold ${
                    isCurrent || isCompleted ? 'text-gray-800' : 'text-gray-400'
                  }`}>
                    {STAGE_LABELS[stage]}
                  </h4>
                  {isCurrent && (
                    <span className="flex items-center gap-1 text-xs text-blue-500">
                      <Clock className="w-3 h-3" />
                      进行中
                    </span>
                  )}
                </div>
                {historyRecord && (
                  <p className="text-sm text-gray-500 mt-1">
                    {historyRecord.note}
                  </p>
                )}
                {historyRecord?.startedAt && (
                  <p className="text-xs text-gray-400 mt-1">
                    {formatDate(historyRecord.startedAt)}
                    {historyRecord.completedAt && ` → ${formatDate(historyRecord.completedAt)}`}
                  </p>
                )}
                
                {isCurrent && canEdit && !isLast && (
                  <button
                    onClick={() => setShowModal(true)}
                    className="mt-3 inline-flex items-center gap-1 px-3 py-1.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm font-medium rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 active:scale-95"
                  >
                    推进到下一阶段
                    <ChevronRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md animate-in fade-in zoom-in duration-300">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">推进阶段</h3>
            <p className="text-sm text-gray-600 mb-4">
              确定要推进到下一阶段：<strong>{STAGE_LABELS[STAGE_ORDER[currentIndex + 1]]}</strong>
            </p>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="请填写本阶段工作总结..."
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              rows={3}
            />
            <div className="flex gap-3 mt-4">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 px-4 py-2 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleAdvance}
                disabled={!note.trim()}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                确认推进
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
