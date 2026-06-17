export type UserRole = 'admin' | 'agent' | 'applicant' | 'franchisee';

export interface User {
  id: string;
  username: string;
  password: string;
  role: UserRole;
  name: string;
  phone: string;
  email?: string;
  avatar?: string;
  province?: string;
  city?: string;
  createdAt: string;
}

export type ApplicationStage = 'initial' | 'review' | 'contract' | 'preparation' | 'completed' | 'rejected';
export type StageStatus = 'pending' | 'processing' | 'completed' | 'delayed';

export const STAGE_LABELS: Record<ApplicationStage, string> = {
  initial: '初步接触',
  review: '资质审核',
  contract: '签约阶段',
  preparation: '开店筹备',
  completed: '已完成',
  rejected: '已拒绝'
};

export const STAGE_ORDER: ApplicationStage[] = ['initial', 'review', 'contract', 'preparation', 'completed'];

export interface StageRecord {
  stage: ApplicationStage;
  status: StageStatus;
  startedAt: string;
  completedAt?: string;
  note: string;
  operatorId: string;
}

export type CommunicationType = 'phone' | 'meeting' | 'email' | 'other';

export const COMMUNICATION_LABELS: Record<CommunicationType, string> = {
  phone: '电话沟通',
  meeting: '会议面谈',
  email: '邮件往来',
  other: '其他方式'
};

export interface CommunicationRecord {
  id: string;
  applicationId: string;
  agentId: string;
  agentName?: string;
  content: string;
  type: CommunicationType;
  nextFollowUp?: string;
  attachments?: string[];
  createdAt: string;
}

export interface Application {
  id: string;
  applicantName: string;
  phone: string;
  email: string;
  idCard: string;
  city: string;
  province: string;
  investmentAmount: number;
  experience: string;
  storeArea?: number;
  currentStage: ApplicationStage;
  stageStatus: StageStatus;
  assignedAgentId: string;
  assignedAgentName?: string;
  stageHistory: StageRecord[];
  communicationRecords: CommunicationRecord[];
  agreementId?: string;
  createdAt: string;
  updatedAt: string;
  isDelayed: boolean;
  lastProgressAt: string;
}

export interface Signature {
  name: string;
  signatureData: string;
  signedAt: string;
  ip: string;
}

export type AgreementStatus = 'draft' | 'pending' | 'signed_hq' | 'signed_both' | 'rejected';

export interface Agreement {
  id: string;
  applicationId: string;
  templateId: string;
  content: string;
  status: AgreementStatus;
  hqSignature?: Signature;
  franchiseeSignature?: Signature;
  signedAt?: string;
  createdAt: string;
}

export type NotificationType = 'system' | 'policy' | 'training' | 'urgent';
export type NotificationTargetType = 'all' | 'region' | 'specified';

export interface Notification {
  id: string;
  title: string;
  content: string;
  type: NotificationType;
  targetType: NotificationTargetType;
  targetRegions?: string[];
  targetUserIds?: string[];
  publisherId: string;
  publisherName?: string;
  publishAt: string;
  readCount: number;
  totalCount: number;
  readBy?: string[];
}

export type PolicyType = 'brand' | 'policy' | 'support';

export interface Policy {
  id: string;
  title: string;
  type: PolicyType;
  content: string;
  coverImage?: string;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

export type ResourceType = 'material' | 'training' | 'manual';

export interface Resource {
  id: string;
  title: string;
  type: ResourceType;
  category: string;
  fileUrl: string;
  fileSize: number;
  downloads: number;
  createdAt: string;
}

export interface CityDistribution {
  city: string;
  count: number;
}

export interface StageConversion {
  stage: string;
  count: number;
  rate: number;
}

export interface MonthlyTrend {
  month: string;
  applications: number;
  signings: number;
}

export interface DashboardStats {
  totalApplications: number;
  pendingReview: number;
  signedThisMonth: number;
  conversionRate: number;
  cityDistribution: CityDistribution[];
  stageConversion: StageConversion[];
  monthlyTrend: MonthlyTrend[];
  delayedApplications: Application[];
}
