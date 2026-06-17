import { create } from 'zustand';
import type { Resource, ResourceType } from '@/types';
import { mockResources } from '@/mock/resources';
import { getStorage, setStorage } from '@/utils/storage';

interface ResourceState {
  resources: Resource[];
  
  getResources: () => Resource[];
  getResourceById: (id: string) => Resource | undefined;
  getResourcesByType: (type: ResourceType) => Resource[];
  
  downloadResource: (id: string) => void;
}

export const useResourceStore = create<ResourceState>((set, get) => ({
  resources: getStorage<Resource[]>('resources', mockResources),

  getResources: () => get().resources,

  getResourceById: (id) => get().resources.find(r => r.id === id),

  getResourcesByType: (type) => get().resources.filter(r => r.type === type),

  downloadResource: (id) => {
    const updated = get().resources.map(r =>
      r.id === id ? { ...r, downloads: r.downloads + 1 } : r
    );
    set({ resources: updated });
    setStorage('resources', updated);
  }
}));
