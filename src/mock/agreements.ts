import type { Agreement } from '@/types';

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

export const mockAgreements: Agreement[] = [
  {
    id: 'agr-001',
    applicationId: 'app-001',
    templateId: 'tpl-001',
    content: generateAgreementContent('张明', '上海', 500000),
    status: 'signed_both',
    hqSignature: {
      name: '张总',
      signatureData: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z/C/HgAGgwJ/lK3Q6wAAAABJRU5ErkJggg==',
      signedAt: '2024-06-01T10:00:00Z',
      ip: '192.168.1.1'
    },
    franchiseeSignature: {
      name: '张明',
      signatureData: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z/C/HgAGgwJ/lK3Q6wAAAABJRU5ErkJggg==',
      signedAt: '2024-06-02T14:30:00Z',
      ip: '192.168.1.2'
    },
    signedAt: '2024-06-02T14:30:00Z',
    createdAt: '2024-05-20T00:00:00Z'
  },
  {
    id: 'agr-002',
    applicationId: 'app-002',
    templateId: 'tpl-001',
    content: generateAgreementContent('李华', '广州', 800000),
    status: 'signed_hq',
    hqSignature: {
      name: '张总',
      signatureData: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z/C/HgAGgwJ/lK3Q6wAAAABJRU5ErkJggg==',
      signedAt: '2024-06-10T09:00:00Z',
      ip: '192.168.1.1'
    },
    createdAt: '2024-06-05T00:00:00Z'
  },
  {
    id: 'agr-003',
    applicationId: 'app-004',
    templateId: 'tpl-001',
    content: generateAgreementContent('陈伟', '成都', 600000),
    status: 'signed_both',
    hqSignature: {
      name: '张总',
      signatureData: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z/C/HgAGgwJ/lK3Q6wAAAABJRU5ErkJggg==',
      signedAt: '2024-05-10T10:00:00Z',
      ip: '192.168.1.1'
    },
    franchiseeSignature: {
      name: '陈伟',
      signatureData: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z/C/HgAGgwJ/lK3Q6wAAAABJRU5ErkJggg==',
      signedAt: '2024-05-12T16:00:00Z',
      ip: '192.168.1.3'
    },
    signedAt: '2024-05-12T16:00:00Z',
    createdAt: '2024-05-01T00:00:00Z'
  },
  {
    id: 'agr-004',
    applicationId: 'app-009',
    templateId: 'tpl-001',
    content: generateAgreementContent('吴涛', '济南', 700000),
    status: 'signed_both',
    hqSignature: {
      name: '张总',
      signatureData: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z/C/HgAGgwJ/lK3Q6wAAAABJRU5ErkJggg==',
      signedAt: '2024-05-25T11:00:00Z',
      ip: '192.168.1.1'
    },
    franchiseeSignature: {
      name: '吴涛',
      signatureData: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z/C/HgAGgwJ/lK3Q6wAAAABJRU5ErkJggg==',
      signedAt: '2024-05-26T13:30:00Z',
      ip: '192.168.1.4'
    },
    signedAt: '2024-05-26T13:30:00Z',
    createdAt: '2024-05-15T00:00:00Z'
  },
  {
    id: 'agr-005',
    applicationId: 'app-011',
    templateId: 'tpl-001',
    content: generateAgreementContent('黄磊', '重庆', 480000),
    status: 'pending',
    createdAt: '2024-06-12T00:00:00Z'
  }
];
