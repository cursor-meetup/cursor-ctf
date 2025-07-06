import { supabase } from '../config/supabase';
import CryptoJS from 'crypto-js';

interface User {
  username: string;
  total_score: number;
  has_claimed_prize: boolean;
  created_at: string;
  updated_at: string;
}

class AuthService {
  private static instance: AuthService;

  private constructor() {}

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  // 密码加密
  private hashPassword(password: string): string {
    return CryptoJS.SHA256(password).toString();
  }

  // 用户注册
  async register(username: string, password: string): Promise<User> {
    try {
      // 检查用户名是否已存在
      const { data: existingUser, error: checkError } = await supabase
        .from('users')
        .select('username')
        .eq('username', username)
        .single();

      if (existingUser) {
        throw new Error('用户名已存在');
      }

      if (checkError && checkError.code !== 'PGRST116') { // PGRST116 表示没有找到记录
        throw checkError;
      }

      // 创建新用户
      const { data, error } = await supabase
        .from('users')
        .insert({
          username,
          password: this.hashPassword(password),
          total_score: 0,
          has_claimed_prize: false
        })
        .select()
        .single();

      if (error) {
        console.error('Registration error:', error);
        throw new Error('注册失败，请重试');
      }

      if (!data) {
        throw new Error('注册失败，请重试');
      }

      // 保存用户会话信息
      localStorage.setItem('username', username);
      localStorage.setItem('isAuthenticated', 'true');

      return data;
    } catch (error) {
      console.error('Registration error:', error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('注册失败，请重试');
    }
  }

  // 用户登录
  async login(username: string, password: string): Promise<User> {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('username', username)
        .eq('password', this.hashPassword(password))
        .single();

      if (error || !data) {
        throw new Error('用户名或密码错误');
      }

      // 保存用户会话信息
      localStorage.setItem('username', username);
      localStorage.setItem('isAuthenticated', 'true');

      return data;
    } catch (error) {
      console.error('Login error:', error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('登录失败，请重试');
    }
  }

  // 用户登出
  logout(): void {
    localStorage.removeItem('username');
    localStorage.removeItem('isAuthenticated');
  }

  // 检查用户是否已登录
  isAuthenticated(): boolean {
    return localStorage.getItem('isAuthenticated') === 'true';
  }

  // 获取当前登录用户名
  getCurrentUser(): string | null {
    return localStorage.getItem('username');
  }

  // 更新用户密码
  async updatePassword(username: string, oldPassword: string, newPassword: string): Promise<void> {
    try {
      // 验证旧密码
      const { data: user, error: checkError } = await supabase
        .from('users')
        .select('*')
        .eq('username', username)
        .eq('password', this.hashPassword(oldPassword))
        .single();

      if (checkError || !user) {
        throw new Error('旧密码错误');
      }

      // 更新密码
      const { error: updateError } = await supabase
        .from('users')
        .update({ 
          password: this.hashPassword(newPassword),
          updated_at: new Date().toISOString()
        })
        .eq('username', username);

      if (updateError) {
        throw updateError;
      }
    } catch (error) {
      console.error('Password update error:', error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('密码更新失败，请重试');
    }
  }
}

export const authService = AuthService.getInstance(); 