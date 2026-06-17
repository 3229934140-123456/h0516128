import { create } from 'zustand';
import type { 
  Application, 
  ApplicationStage, 
  CommunicationRecord, 
  CommunicationType,
  StageRecord,
  StageStatus
} from '@/types';
import { mockApplications } from '@/mock/applications';
import { getStorage, setStorage } from '@/utils/storage';
import { generateId } from '@/utils/format';
import { STAGE_ORDER } from '@/types';
import { isDelayed } from '@/utils/date';

interface ApplicationState {
  applications: Application[];
  currentApplication: Application | null;
  
  getApplications: () => Application[];
  getApplicationById: (id: string) => Application | undefined;
  setCurrentApplication: (id: string | null) => void;
  
  createApplication: (data: Partial<Application>) => Application;
  updateApplication: (id: string, data: Partial<Application>) => void;
  
  advanceStage: (id: string, note: string) => boolean;
  revertStage: (id: string, note: string) => boolean;
  rejectApplication: (id: string, reason: string) => void;
  
  addCommunicationRecord: (
    applicationId: string, 
    content: string, 
    type: CommunicationType,
    agentId: string,
    agentName: string,
    nextFollowUp?: string
  ) => void;
  
  checkDelayedApplications: () => Application[];
  markDelayed: (id: string) => void;
  
  getStats: () => {
    total: number;
    byStage: Record<ApplicationStage, number>;
    delayed: number;
    thisMonthSigned: number;
  };
}

export const useApplicationStore = create<ApplicationState>((set, get) => ({
  applications: getStorage<Application[]>('applications', mockApplications),
  currentApplication: null,

  getApplications: () => get().applications,

  getApplicationById: (id) => get().applications.find(a => a.id === id),

  setCurrentApplication: (id) => {
    if (id) {
      const app = get().applications.find(a => a.id === id);
      set({ currentApplication: app || null });
    } else {
      set({ currentApplication: null });
    }
  },

  createApplication: (data) => {
    const now = new Date().toISOString();
    const newApp: Application = {
      id: generateId('app-'),
      applicantName: data.applicantName || '',
      phone: data.phone || '',
      email: data.email || '',
      idCard: data.idCard || '',
      city: data.city || '',
      province: data.province || '',
      investmentAmount: data.investmentAmount || 0,
      experience: data.experience || '',
      storeArea: data.storeArea,
      currentStage: 'initial',
      stageStatus: 'pending',
      assignedAgentId: 'agent-002',
      assignedAgentName: '王专员',
      stageHistory: [{
        stage: 'initial',
        status: 'pending',
        startedAt: now,
        note: '新申请待处理',
        operatorId: 'system'
      }],
      communicationRecords: [],
      createdAt: now,
      updatedAt: now,
      isDelayed: false,
      lastProgressAt: now
    };
    
    const updated = [...get().applications, newApp];
    set({ applications: updated });
    setStorage('applications', updated);
    return newApp;
  },

  updateApplication: (id, data) => {
    const updated = get().applications.map(a => 
      a.id === id ? { ...a, ...data, updatedAt: new Date().toISOString() } : a
    );
    set({ applications: updated });
    setStorage('applications', updated);
  },

  advanceStage: (id, note) => {
    const app = get().applications.find(a => a.id === id);
    if (!app) return false;
    
    const currentIndex = STAGE_ORDER.indexOf(app.currentStage);
    if (currentIndex >= STAGE_ORDER.length - 1) return false;
    
    const nextStage = STAGE_ORDER[currentIndex + 1];
    const now = new Date().toISOString();
    
    const newStageRecord: StageRecord = {
      stage: nextStage,
      status: 'processing',
      startedAt: now,
      note,
      operatorId: 'agent-001'
    };
    
    const updatedHistory = app.stageHistory.map((h, i) => 
      i === app.stageHistory.length - 1 
        ? { ...h, status: 'completed' as const, completedAt: now }
        : h
    );
    updatedHistory.push(newStageRecord);
    
    const updated = get().applications.map(a =>
      a.id === id
        ? {
            ...a,
            currentStage: nextStage,
            stageStatus: 'processing' as StageStatus,
            lastProgressAt: now,
            updatedAt: now,
            isDelayed: false,
            stageHistory: updatedHistory
          }
        : a
    );
    
    set({ applications: updated });
    setStorage('applications', updated);
    return true;
  },

  revertStage: (id, note) => {
    const app = get().applications.find(a => a.id === id);
    if (!app) return false;
    
    const currentIndex = STAGE_ORDER.indexOf(app.currentStage);
    if (currentIndex <= 0) return false;
    
    const prevStage = STAGE_ORDER[currentIndex - 1];
    const now = new Date().toISOString();
    
    const updatedHistory = app.stageHistory.slice(0, -1);
    updatedHistory[updatedHistory.length - 1].status = 'processing';
    updatedHistory[updatedHistory.length - 1].completedAt = undefined;
    
    const updated = get().applications.map(a =>
      a.id === id
        ? {
            ...a,
            currentStage: prevStage,
            stageStatus: 'processing' as StageStatus,
            lastProgressAt: now,
            updatedAt: now,
            stageHistory: updatedHistory
          }
        : a
    );
    
    set({ applications: updated });
    setStorage('applications', updated);
    return true;
  },

  rejectApplication: (id, reason) => {
    const now = new Date().toISOString();
    const updated = get().applications.map(a =>
      a.id === id
        ? {
            ...a,
            currentStage: 'rejected' as ApplicationStage,
            stageStatus: 'completed' as StageStatus,
            updatedAt: now,
            stageHistory: [...a.stageHistory, {
              stage: 'rejected' as ApplicationStage,
              status: 'completed' as StageStatus,
              startedAt: now,
              completedAt: now,
              note: reason,
              operatorId: 'agent-001'
            }]
          }
        : a
    );
    set({ applications: updated });
    setStorage('applications', updated);
  },

  addCommunicationRecord: (applicationId, content, type, agentId, agentName, nextFollowUp) => {
    const now = new Date().toISOString();
    const record: CommunicationRecord = {
      id: generateId('comm-'),
      applicationId,
      agentId,
      agentName,
      content,
      type,
      nextFollowUp,
      createdAt: now
    };
    
    const updated = get().applications.map(a =>
      a.id === applicationId
        ? {
            ...a,
            lastProgressAt: now,
            isDelayed: false,
            updatedAt: now,
            communicationRecords: [...a.communicationRecords, record]
          }
        : a
    );
    
    set({ applications: updated });
    setStorage('applications', updated);
  },

  checkDelayedApplications: () => {
    const delayed = get().applications.filter(a => 
      a.currentStage !== 'completed' && 
      a.currentStage !== 'rejected' && 
      isDelayed(a.lastProgressAt, 7)
    );
    
    if (delayed.length > 0) {
      const updated = get().applications.map(a =>
        delayed.some(d => d.id === a.id)
          ? { ...a, isDelayed: true }
          : a
      );
      set({ applications: updated });
      setStorage('applications', updated);
    }
    
    return delayed;
  },

  markDelayed: (id) => {
    const updated = get().applications.map(a =>
      a.id === id ? { ...a, isDelayed: true } : a
    );
    set({ applications: updated });
    setStorage('applications', updated);
  },

  getStats: () => {
    const apps = get().applications;
    const now = new Date();
    const thisMonth = now.getMonth();
    const thisYear = now.getFullYear();
    
    const byStage = apps.reduce((acc, app) => {
      acc[app.currentStage] = (acc[app.currentStage] || 0) + 1;
      return acc;
    }, {} as Record<ApplicationStage, number>);
    
    const thisMonthSigned = apps.filter(a => {
      const d = new Date(a.createdAt);
      return a.currentStage === 'completed' && 
             d.getMonth() === thisMonth && 
             d.getFullYear() === thisYear;
    }).length;
    
    return {
      total: apps.length,
      byStage,
      delayed: apps.filter(a => a.isDelayed).length,
      thisMonthSigned
    };
  }
}));
