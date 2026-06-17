import React from 'react';
import type { ApplicationStage, StageStatus } from '@/types';
import { STAGE_LABELS } from '@/types';
import { Clock, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';

interface StageBadgeProps {
  stage: ApplicationStage;
  status?: StageStatus;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const stageColors: Record<ApplicationStage, string> = {
  initial: 'bg-blue-100 text-blue-700',
  review: 'bg-purple-100 text-purple-700',
  contract: 'bg-orange-100 text-orange-700',
  preparation: 'bg-green-100 text-green-700',
  completed: 'bg-gray-100 text-gray-700',
  rejected: 'bg-red-100 text-red-700'
};

export const StageBadge: React.FC<StageBadgeProps> = ({ 
  stage, 
  status = 'processing',
  showLabel = true,
  size = 'md'
}) => {
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-1.5 text-base'
  };

  const StatusIcon = () => {
    if (stage === 'rejected') return <XCircle className="w-4 h-4" />;
    if (status === 'completed') return <CheckCircle className="w-4 h-4" />;
    if (status === 'delayed') return <AlertTriangle className="w-4 h-4 text-orange-500" />;
    return <Clock className="w-4 h-4 animate-pulse" />;
  };

  return (
    <span 
      className={`inline-flex items-center gap-1.5 rounded-full font-medium ${stageColors[stage]} ${sizeClasses[size]} transition-all duration-300`}
    >
      <StatusIcon />
      {showLabel && STAGE_LABELS[stage]}
    </span>
  );
};
