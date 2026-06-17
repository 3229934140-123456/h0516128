import type { User } from '@/types';

export const mockUsers: User[] = [
  {
    id: 'admin-001',
    username: 'admin',
    password: 'admin123',
    role: 'admin',
    name: '张总',
    phone: '13800138000',
    email: 'admin@company.com',
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'agent-001',
    username: 'agent1',
    password: 'agent123',
    role: 'agent',
    name: '李经理',
    phone: '13800138001',
    email: 'li@company.com',
    createdAt: '2024-01-15T00:00:00Z'
  },
  {
    id: 'agent-002',
    username: 'agent2',
    password: 'agent123',
    role: 'agent',
    name: '王专员',
    phone: '13800138002',
    email: 'wang@company.com',
    createdAt: '2024-02-01T00:00:00Z'
  },
  {
    id: 'store-001',
    username: 'store1',
    password: 'store123',
    role: 'franchisee',
    name: '陈老板',
    phone: '13900139001',
    email: 'chen@email.com',
    createdAt: '2024-03-01T00:00:00Z'
  },
  {
    id: 'store-002',
    username: 'store2',
    password: 'store123',
    role: 'franchisee',
    name: '刘女士',
    phone: '13900139002',
    email: 'liu@email.com',
    createdAt: '2024-03-15T00:00:00Z'
  }
];
