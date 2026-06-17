import { create } from 'zustand';
import type { Agreement, Signature } from '@/types';
import { mockAgreements } from '@/mock/agreements';
import { getStorage, setStorage } from '@/utils/storage';
import { generateId } from '@/utils/format';

interface AgreementState {
  agreements: Agreement[];
  
  getAgreements: () => Agreement[];
  getAgreementById: (id: string) => Agreement | undefined;
  getAgreementByApplicationId: (applicationId: string) => Agreement | undefined;
  
  createAgreement: (applicationId: string, franchiseeName: string, city: string, investmentAmount: number) => Agreement;
  
  signAgreement: (
    id: string, 
    signer: 'hq' | 'franchisee', 
    name: string, 
    signatureData: string
  ) => boolean;
  
  rejectAgreement: (id: string, reason: string) => void;
}

const generateAgreementContent = (name: string, city: string, amount: number) => `
甲方（总部）：XX品牌连锁有限公司
地址：上海市浦东新区XX路XX号
法定代表人：XXX

乙方（加盟商）：${name}
身份证号：XXXXXXXXXXXXXXXXXX
联系地址：${city}

鉴于甲方拥有XX品牌的商标、商号、经营模式等经营资源，乙方希望获得甲方授权在${city}开设加盟店，双方经友好协商，达成如下协议：

第一条 授权内容
1.1 甲方授权乙方在${city}开设XX品牌加盟店，使用甲方的商标、商号、经营模式等经营资源。
1.2 授权期限为3年，自本协议签订之日起计算。

第二条 加盟费用
2.1 乙方应向甲方支付品牌使用费人民币${Math.round(amount * 0.1)}元。
2.2 乙方应向甲方支付履约保证金人民币${Math.round(amount * 0.06)}元。
2.3 乙方应向甲方支付首批物料费人民币${Math.round(amount * 0.2)}元。

第三条 甲方权利与义务
3.1 甲方有权对乙方的经营活动进行监督和管理。
3.2 甲方应向乙方提供经营指导、技术培训、物流配送等服务。
3.3 甲方应持续进行品牌宣传和产品研发。

第四条 乙方权利与义务
4.1 乙方有权使用甲方的经营资源开展经营活动。
4.2 乙方应遵守甲方的经营规范和管理制度。
4.3 乙方应按时支付各项费用。
4.4 乙方应维护品牌形象，不得从事任何损害品牌利益的行为。

第五条 协议的变更与解除
5.1 经双方协商一致，可以变更或解除本协议。
5.2 一方严重违约的，另一方有权解除本协议。

第六条 争议解决
因本协议引起的争议，双方应友好协商解决；协商不成的，提交甲方所在地人民法院诉讼解决。

第七条 其他条款
7.1 本协议一式两份，双方各执一份，具有同等法律效力。
7.2 本协议自双方签字盖章之日起生效。

（以下为签署页）
`;

export const useAgreementStore = create<AgreementState>((set, get) => ({
  agreements: getStorage<Agreement[]>('agreements', mockAgreements),

  getAgreements: () => get().agreements,

  getAgreementById: (id) => get().agreements.find(a => a.id === id),

  getAgreementByApplicationId: (applicationId) => 
    get().agreements.find(a => a.applicationId === applicationId),

  createAgreement: (applicationId, franchiseeName, city, investmentAmount) => {
    const now = new Date().toISOString();
    const newAgreement: Agreement = {
      id: generateId('agr-'),
      applicationId,
      templateId: 'tpl-001',
      content: generateAgreementContent(franchiseeName, city, investmentAmount),
      status: 'pending',
      createdAt: now
    };
    
    const updated = [...get().agreements, newAgreement];
    set({ agreements: updated });
    setStorage('agreements', updated);
    return newAgreement;
  },

  signAgreement: (id, signer, name, signatureData) => {
    const agreement = get().agreements.find(a => a.id === id);
    if (!agreement) return false;
    
    const now = new Date().toISOString();
    const signature: Signature = {
      name,
      signatureData,
      signedAt: now,
      ip: '127.0.0.1'
    };
    
    let newStatus = agreement.status;
    if (signer === 'hq') {
      if (agreement.status === 'pending' || agreement.status === 'draft') {
        newStatus = 'signed_hq';
      }
    } else if (signer === 'franchisee') {
      if (agreement.status === 'signed_hq') {
        newStatus = 'signed_both';
      } else if (agreement.status === 'pending') {
        newStatus = 'pending';
        return false;
      }
    }
    
    const updated = get().agreements.map(a =>
      a.id === id
        ? {
            ...a,
            status: newStatus,
            hqSignature: signer === 'hq' ? signature : a.hqSignature,
            franchiseeSignature: signer === 'franchisee' ? signature : a.franchiseeSignature,
            signedAt: newStatus === 'signed_both' ? now : a.signedAt
          }
        : a
    );
    
    set({ agreements: updated });
    setStorage('agreements', updated);
    return true;
  },

  rejectAgreement: (id, reason) => {
    const updated = get().agreements.map(a =>
      a.id === id ? { ...a, status: 'rejected' as const } : a
    );
    set({ agreements: updated });
    setStorage('agreements', updated);
  }
}));
