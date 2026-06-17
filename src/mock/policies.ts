import type { Policy } from '@/types';

export const mockPolicies: Policy[] = [
  {
    id: 'policy-001',
    title: '品牌故事与企业文化',
    type: 'brand',
    content: `<h2>品牌故事</h2>
<p>我们的品牌创立于2010年，源于对品质生活的执着追求。经过十余年的发展，已成为行业领军品牌，在全国拥有超过500家门店。</p>
<h3>企业文化</h3>
<ul>
<li><strong>使命：</strong>让每一位顾客都能享受到优质的产品和服务</li>
<li><strong>愿景：</strong>成为行业最受尊敬的连锁品牌</li>
<li><strong>价值观：</strong>诚信、创新、共赢、责任</li>
</ul>
<h3>品牌优势</h3>
<p>✓ 强大的品牌影响力 ✓ 成熟的运营模式 ✓ 全方位的培训支持 ✓ 持续的产品创新</p>`,
    coverImage: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=modern%20brand%20office%20building%20with%20company%20logo%20professional%20photography&image_size=landscape_16_9',
    isPublished: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-06-01T00:00:00Z'
  },
  {
    id: 'policy-002',
    title: '加盟费用与政策说明',
    type: 'policy',
    content: `<h2>加盟费用明细</h2>
<table>
<tr><th>项目</th><th>标准店</th><th>旗舰店</th></tr>
<tr><td>品牌使用费</td><td>5万元/3年</td><td>8万元/3年</td></tr>
<tr><td>履约保证金</td><td>3万元</td><td>5万元</td></tr>
<tr><td>首批物料费</td><td>8-10万元</td><td>15-20万元</td></tr>
<tr><td>装修设计费</td><td>2万元</td><td>3万元</td></tr>
<tr><td>预估总投资</td><td>30-50万元</td><td>60-100万元</td></tr>
</table>
<h3>费用说明</h3>
<p>1. 品牌使用费：合同期内使用品牌商标、VI系统、运营体系等</p>
<p>2. 履约保证金：合同期满无违约无息退还</p>
<p>3. 首批物料费：开业所需的设备、原料、包装等</p>
<h3>利润分析</h3>
<p>平均毛利率：60%-65%</p>
<p>投资回收期：12-18个月</p>`,
    coverImage: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=business%20financial%20planning%20investment%20analysis%20charts&image_size=landscape_16_9',
    isPublished: true,
    createdAt: '2024-01-15T00:00:00Z',
    updatedAt: '2024-06-15T00:00:00Z'
  },
  {
    id: 'policy-003',
    title: '总部全方位支持政策',
    type: 'support',
    content: `<h2>八大加盟支持</h2>
<h3>1. 品牌形象支持</h3>
<p>提供统一的VI视觉识别系统、店面装修设计方案、宣传物料设计。</p>
<h3>2. 开店筹备支持</h3>
<p>专业团队协助选址评估、店面装修指导、设备采购指导、人员招聘培训。</p>
<h3>3. 系统培训支持</h3>
<p>✓ 产品技术培训 ✓ 运营管理培训 ✓ 营销推广培训 ✓ 服务规范培训</p>
<h3>4. 物流配送支持</h3>
<p>全国统一的物流配送体系，确保原料和物料及时、准确送达。</p>
<h3>5. 营销推广支持</h3>
<p>全国性品牌宣传、区域性营销策划、节假日促销活动方案。</p>
<h3>6. 运营管理支持</h3>
<p>提供标准化运营手册、定期巡店指导、经营数据分析、问题诊断与解决方案。</p>
<h3>7. 产品研发支持</h3>
<p>持续的产品创新，每季度推出新品，保持市场竞争力。</p>
<h3>8. 区域保护支持</h3>
<p>严格的区域保护政策，确保加盟商独享区域市场。</p>`,
    coverImage: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=business%20team%20support%20collaboration%20professional%20meeting&image_size=landscape_16_9',
    isPublished: true,
    createdAt: '2024-02-01T00:00:00Z',
    updatedAt: '2024-06-01T00:00:00Z'
  },
  {
    id: 'policy-004',
    title: '加盟条件与申请流程',
    type: 'policy',
    content: `<h2>加盟条件</h2>
<h3>基本要求</h3>
<ul>
<li>认同品牌文化和经营理念</li>
<li>具备良好的商业信誉和投资意识</li>
<li>有充足的资金实力和抗风险能力</li>
<li>愿意接受总部的统一管理和培训</li>
<li>无犯罪记录，具有合法资格的法人或自然人</li>
</ul>
<h3>资金要求</h3>
<p>自有资金30万元以上，具备良好的资金信用。</p>
<h3>店面要求</h3>
<p>选址：商业中心、步行街、大型社区等客流量大的地段</p>
<p>面积：标准店60-120㎡，旗舰店120-200㎡</p>
<h2>申请流程</h2>
<p>1. 在线提交申请 → 2. 资格审核 → 3. 邀约面谈 → 4. 签订意向 → 5. 店面评估 → 6. 正式签约 → 7. 店面装修 → 8. 培训筹备 → 9. 正式开业</p>`,
    coverImage: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=business%20process%20flow%20chart%20application%20steps&image_size=landscape_16_9',
    isPublished: true,
    createdAt: '2024-02-15T00:00:00Z',
    updatedAt: '2024-06-10T00:00:00Z'
  }
];
