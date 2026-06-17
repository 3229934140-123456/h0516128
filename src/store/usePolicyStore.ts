import { create } from 'zustand';
import type { Policy, PolicyType } from '@/types';
import { mockPolicies } from '@/mock/policies';
import { getStorage, setStorage } from '@/utils/storage';
import { generateId } from '@/utils/format';

interface PolicyState {
  policies: Policy[];
  
  getPolicies: () => Policy[];
  getPolicyById: (id: string) => Policy | undefined;
  getPublishedPolicies: (type?: PolicyType) => Policy[];
  
  createPolicy: (data: {
    title: string;
    type: PolicyType;
    content: string;
    coverImage?: string;
  }) => Policy;
  
  updatePolicy: (id: string, data: Partial<Policy>) => void;
  deletePolicy: (id: string) => void;
  togglePublish: (id: string) => void;
}

export const usePolicyStore = create<PolicyState>((set, get) => ({
  policies: getStorage<Policy[]>('policies', mockPolicies),

  getPolicies: () => get().policies,

  getPolicyById: (id) => get().policies.find(p => p.id === id),

  getPublishedPolicies: (type) => {
    return get().policies.filter(p => 
      p.isPublished && (!type || p.type === type)
    );
  },

  createPolicy: (data) => {
    const now = new Date().toISOString();
    const newPolicy: Policy = {
      id: generateId('policy-'),
      title: data.title,
      type: data.type,
      content: data.content,
      coverImage: data.coverImage,
      isPublished: false,
      createdAt: now,
      updatedAt: now
    };
    
    const updated = [...get().policies, newPolicy];
    set({ policies: updated });
    setStorage('policies', updated);
    return newPolicy;
  },

  updatePolicy: (id, data) => {
    const updated = get().policies.map(p =>
      p.id === id ? { ...p, ...data, updatedAt: new Date().toISOString() } : p
    );
    set({ policies: updated });
    setStorage('policies', updated);
  },

  deletePolicy: (id) => {
    const updated = get().policies.filter(p => p.id !== id);
    set({ policies: updated });
    setStorage('policies', updated);
  },

  togglePublish: (id) => {
    const updated = get().policies.map(p =>
      p.id === id ? { ...p, isPublished: !p.isPublished, updatedAt: new Date().toISOString() } : p
    );
    set({ policies: updated });
    setStorage('policies', updated);
  }
}));
