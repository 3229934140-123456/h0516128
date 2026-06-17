import { create } from 'zustand';
import type { User, UserRole } from '@/types';
import { mockUsers } from '@/mock/users';
import { setStorage, getStorage, removeStorage } from '@/utils/storage';

interface AuthState {
  currentUser: User | null;
  users: User[];
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  registerApplicant: (data: Partial<User>) => User;
  updateUser: (id: string, data: Partial<User>) => void;
  hasRole: (roles: UserRole[]) => boolean;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  currentUser: getStorage<User | null>('currentUser', null),
  users: getStorage<User[]>('users', mockUsers),

  login: async (username: string, password: string) => {
    const { users } = get();
    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
      set({ currentUser: user });
      setStorage('currentUser', user);
      return true;
    }
    return false;
  },

  logout: () => {
    set({ currentUser: null });
    removeStorage('currentUser');
  },

  registerApplicant: (data) => {
    const { users } = get();
    const newUser: User = {
      id: `user-${Date.now()}`,
      username: data.phone || `user_${Date.now()}`,
      password: data.password || '123456',
      role: 'applicant',
      name: data.name || '',
      phone: data.phone || '',
      email: data.email,
      createdAt: new Date().toISOString()
    };
    const updatedUsers = [...users, newUser];
    set({ users: updatedUsers });
    setStorage('users', updatedUsers);
    return newUser;
  },

  hasRole: (roles) => {
    const { currentUser } = get();
    return currentUser ? roles.includes(currentUser.role) : false;
  },

  updateUser: (id, data) => {
    const { users, currentUser } = get();
    const updatedUsers = users.map(u => 
      u.id === id ? { ...u, ...data } : u
    );
    set({ users: updatedUsers });
    setStorage('users', updatedUsers);
    
    if (currentUser?.id === id) {
      const updatedCurrentUser = { ...currentUser, ...data };
      set({ currentUser: updatedCurrentUser });
      setStorage('currentUser', updatedCurrentUser);
    }
  }
}));
