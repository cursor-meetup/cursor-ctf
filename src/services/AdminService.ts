import { supabase } from '../config/supabase';
import flagConfig from '../config/flag.json';

interface User {
  username: string;
  total_score: number;
  has_claimed_prize: boolean;
  created_at: string;
  updated_at: string;
}

class AdminService {
  // 获取所有用户列表
  async getAllUsers(): Promise<User[]> {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('total_score', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('获取用户列表失败:', error);
      throw error;
    }
  }

  // 搜索用户
  async searchUsers(searchTerm: string): Promise<User[]> {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .ilike('username', `%${searchTerm}%`)
        .order('total_score', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('搜索用户失败:', error);
      throw error;
    }
  }

  // 为用户添加flag
  async addFlagToUser(username: string, flagKey: string): Promise<void> {
    try {
      // 验证flag是否存在
      const flagInfo = flagConfig.flags.find(flag => flag.key === flagKey);
      if (!flagInfo) {
        throw new Error(`Flag key "${flagKey}" 不存在`);
      }

      // 检查用户是否存在
      const { data: user, error: userError } = await supabase
        .from('users')
        .select('username')
        .eq('username', username)
        .single();

      if (userError || !user) {
        throw new Error(`用户 "${username}" 不存在`);
      }

      // 使用unlock_flag函数添加flag
      const { error: unlockError } = await supabase.rpc('unlock_flag', {
        p_username: username,
        p_flag_key: flagKey,
        p_points: flagInfo.points
      });

      if (unlockError) {
        if (unlockError.message.includes('already unlocked')) {
          throw new Error(`用户 "${username}" 已经获得过 "${flagKey}" flag`);
        }
        throw unlockError;
      }
    } catch (error) {
      console.error('添加flag失败:', error);
      throw error;
    }
  }

  // 获取用户的flag列表
  async getUserFlags(username: string) {
    try {
      const { data, error } = await supabase
        .from('user_flags')
        .select('flag_key, points, unlocked_at')
        .eq('username', username)
        .order('unlocked_at', { ascending: false });

      if (error) throw error;
      
      return data?.map(item => {
        const flagInfo = flagConfig.flags.find(flag => flag.key === item.flag_key);
        return {
          ...item,
          description: flagInfo?.description || '未知标志'
        };
      }) || [];
    } catch (error) {
      console.error('获取用户flag失败:', error);
      throw error;
    }
  }

  // 获取所有可用的flags
  getAllFlags() {
    return flagConfig.flags;
  }
}

export const adminService = new AdminService();
export default AdminService;