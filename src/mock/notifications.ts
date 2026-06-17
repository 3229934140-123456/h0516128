import type { Notification } from '@/types';

export const mockNotifications: Notification[] = [
  {
    id: 'notif-001',
    title: '关于Q3新品上市的通知',
    content: '各位加盟商伙伴：\n\n2024年Q3新品将于7月15日正式上市，届时将有5款全新产品与大家见面。请各门店提前做好准备工作，参加总部组织的新品培训。\n\n培训时间：7月10日 14:00-16:00\n培训方式：线上直播\n\n请务必安排相关人员参加。',
    type: 'training',
    targetType: 'all',
    publisherId: 'admin-001',
    publisherName: '张总',
    publishAt: '2024-06-15T10:00:00Z',
    readCount: 8,
    totalCount: 12,
    readBy: ['store-001', 'store-002']
  },
  {
    id: 'notif-002',
    title: '重要：暑期营销活动方案发布',
    content: '各位加盟商伙伴：\n\n暑期营销活动方案已正式发布，活动时间为7月1日至8月31日。活动期间总部将提供全方位的营销支持，包括：\n\n1. 全国性广告投放\n2. 活动物料设计与配送\n3. 线上线下联动促销\n\n请各门店积极配合，抓住暑期销售旺季。',
    type: 'urgent',
    targetType: 'all',
    publisherId: 'admin-001',
    publisherName: '张总',
    publishAt: '2024-06-10T09:00:00Z',
    readCount: 12,
    totalCount: 12,
    readBy: ['store-001', 'store-002']
  },
  {
    id: 'notif-003',
    title: '华东区域加盟商座谈会通知',
    content: '华东区域的各位加盟商伙伴：\n\n为加强区域交流，提升运营水平，总部决定于7月5日在上海召开华东区域加盟商座谈会。\n\n会议地点：上海总部会议室\n参会人员：华东区域所有加盟商\n\n请各位提前安排好时间，准时参会。',
    type: 'system',
    targetType: 'region',
    targetRegions: ['上海', '江苏', '浙江', '安徽', '福建', '山东'],
    publisherId: 'admin-001',
    publisherName: '张总',
    publishAt: '2024-06-08T14:00:00Z',
    readCount: 3,
    totalCount: 5,
    readBy: ['store-001']
  },
  {
    id: 'notif-004',
    title: '供应链系统升级通知',
    content: '各位加盟商伙伴：\n\n为提升物流配送效率，总部将于6月20日进行供应链系统升级。升级期间（6月20日 22:00-6月21日 06:00）订货系统将暂停服务。\n\n请各位提前做好备货工作，避免影响正常营业。',
    type: 'system',
    targetType: 'all',
    publisherId: 'admin-001',
    publisherName: '张总',
    publishAt: '2024-06-12T16:00:00Z',
    readCount: 10,
    totalCount: 12,
    readBy: ['store-001', 'store-002']
  },
  {
    id: 'notif-005',
    title: '关于规范门店形象的通知',
    content: '各位加盟商伙伴：\n\n近期总部巡查发现部分门店存在形象不规范的问题，包括：\n\n1. 招牌破损未及时更换\n2. 店内宣传物料过期\n3. 员工着装不统一\n\n请各门店于6月30日前完成自查整改，总部将于7月上旬组织复查。',
    type: 'policy',
    targetType: 'all',
    publisherId: 'admin-001',
    publisherName: '张总',
    publishAt: '2024-06-05T11:00:00Z',
    readCount: 11,
    totalCount: 12,
    readBy: ['store-001', 'store-002']
  }
];
