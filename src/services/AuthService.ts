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

  // 检查并处理授权错误
  private handleAuthError(error: any): void {
    if (error?.code === 'PGRST301' || error?.message?.includes('JWT')) {
      // 如果是授权错误，自动登出
      this.logout();
      // 刷新页面以触发路由重定向
      window.location.href = '/login';
    }
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
        this.handleAuthError(checkError);
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
        this.handleAuthError(error);
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

  // 用户登录或注册
  async login(username: string, password: string): Promise<User> {
    try {
      // 首先尝试登录
      const { data: existingUser, error: loginError } = await supabase
        .from('users')
        .select('*')
        .eq('username', username)
        .eq('password', this.hashPassword(password))
        .single();

      if (existingUser) {
        // 用户存在且密码正确，直接登录
        localStorage.setItem('username', username);
        localStorage.setItem('isAuthenticated', 'true');
        return existingUser;
      }

      // 如果登录失败，检查是否是因为用户不存在
      if (loginError && loginError.code === 'PGRST116') {
        // 用户不存在，自动注册
        const { data: newUser, error: registerError } = await supabase
          .from('users')
          .insert({
            username,
            password: this.hashPassword(password),
            total_score: 0,
            has_claimed_prize: false
          })
          .select()
          .single();

        if (registerError) {
          // 可能是用户名冲突或其他错误
          if (registerError.code === '23505') {
            throw new Error('用户名已存在但密码错误');
          }
          this.handleAuthError(registerError);
          throw new Error('注册失败，请重试');
        }

        if (!newUser) {
          throw new Error('注册失败，请重试');
        }

        // 自动登录新注册的用户
        localStorage.setItem('username', username);
        localStorage.setItem('isAuthenticated', 'true');
        return newUser;
      }

      // 用户存在但密码错误
      throw new Error('用户名或密码错误');
    } catch (error) {
      console.error('Login/Register error:', error);
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

  // 验证用户会话有效性
  async validateSession(): Promise<boolean> {
    const username = this.getCurrentUser();
    if (!username) {
      return false;
    }

    try {
      const { data, error } = await supabase
        .from('users')
        .select('username')
        .eq('username', username)
        .single();

      if (error) {
        this.handleAuthError(error);
        return false;
      }

      return !!data;
    } catch (error) {
      console.error('Session validation error:', error);
      this.logout();
      return false;
    }
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

      if (checkError) {
        this.handleAuthError(checkError);
        throw new Error('旧密码错误');
      }

      if (!user) {
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
        this.handleAuthError(updateError);
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