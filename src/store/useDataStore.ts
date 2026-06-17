import { create } from 'zustand';
import type { DashboardStats, MonthlyTrend, StageConversion, CityDistribution } from '@/types';
import { STAGE_ORDER, STAGE_LABELS } from '@/types';
import { useApplicationStore } from './useApplicationStore';

interface DataState {
  getDashboardStats: () => DashboardStats;
}

export const useDataStore = create<DataState>(() => ({
  getDashboardStats: () => {
    const applications = useApplicationStore.getState().applications;
    
    const now = new Date();
    const thisMonth = now.getMonth();
    const thisYear = now.getFullYear();
    
    const signedThisMonth = applications.filter(a => {
      if (a.currentStage !== 'preparation' && a.currentStage !== 'completed') return false;
      const d = new Date(a.lastProgressAt || a.updatedAt);
      return d.getMonth() === thisMonth && d.getFullYear() === thisYear;
    }).length;
    
    const pendingReview = applications.filter(a => 
      a.currentStage === 'review' || a.currentStage === 'initial'
    ).length;
    
    const completedCount = applications.filter(a => a.currentStage === 'completed').length;
    const conversionRate = applications.length > 0 ? completedCount / applications.length : 0;
    
    const cityMap = new Map<string, number>();
    applications.forEach(a => {
      cityMap.set(a.city, (cityMap.get(a.city) || 0) + 1);
    });
    const cityDistribution: CityDistribution[] = Array.from(cityMap.entries())
      .map(([city, count]) => ({ city, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
    
    const stageConversion: StageConversion[] = STAGE_ORDER.slice(0, -1).map((stage, index) => {
      const stageCount = applications.filter(a => 
        STAGE_ORDER.indexOf(a.currentStage) >= index
      ).length;
      const nextStageCount = applications.filter(a => 
        STAGE_ORDER.indexOf(a.currentStage) >= index + 1
      ).length;
      const rate = stageCount > 0 ? nextStageCount / stageCount : 0;
      return {
        stage: STAGE_LABELS[stage],
        count: stageCount,
        rate
      };
    });
    
    const monthlyTrend: MonthlyTrend[] = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(thisYear, thisMonth - i, 1);
      const monthStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      const monthApps = applications.filter(a => {
        const ad = new Date(a.createdAt);
        return ad.getMonth() === d.getMonth() && ad.getFullYear() === d.getFullYear();
      });
      const monthSignings = monthApps.filter(a => 
        a.currentStage === 'preparation' || a.currentStage === 'completed'
      ).filter(a => {
        const sd = new Date(a.lastProgressAt || a.updatedAt);
        return sd.getMonth() === d.getMonth() && sd.getFullYear() === d.getFullYear();
      }).length;
      monthlyTrend.push({
        month: monthStr,
        applications: monthApps.length,
        signings: monthSignings
      });
    }
    
    const delayedApplications = applications
      .filter(a => a.isDelayed)
      .sort((a, b) => new Date(a.lastProgressAt).getTime() - new Date(b.lastProgressAt).getTime());
    
    return {
      totalApplications: applications.length,
      pendingReview,
      signedThisMonth,
      conversionRate,
      cityDistribution,
      stageConversion,
      monthlyTrend,
      delayedApplications
    };
  }
}));
