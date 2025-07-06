import { supabase } from '../config/supabase';

interface User {
  username: string;
  total_score: number;
  has_claimed_prize: boolean;
  created_at: string;
  updated_at: string;
}

interface UserFlag {
  id: number;
  username: string;
  flag_key: string;
  points: number;
  unlocked_at: string;
}

interface LeaderboardEntry {
  username: string;
  total_score: number;
  has_claimed_prize: boolean;
  flags_count: number;
  rank: number;
  updated_at: string;
}

class SupabaseService {
  private static instance: SupabaseService;

  private constructor() {}

  public static getInstance(): SupabaseService {
    if (!SupabaseService.instance) {
      SupabaseService.instance = new SupabaseService();
    }
    return SupabaseService.instance;
  }

  // 用户相关操作
  async createUser(username: string, password: string): Promise<User> {
    try {
      const { data, error } = await supabase
        .from('users')
        .insert({
          username,
          password, // 注意：实际应用中应该使用加密密码
          total_score: 0,
          has_claimed_prize: false
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  async getUser(username: string): Promise<User | null> {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('username', username)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return data;
    } catch (error) {
      console.error('Error fetching user:', error);
      throw error;
    }
  }

  async updateUserPrizeStatus(username: string, hasClaimed: boolean): Promise<void> {
    try {
      const { error } = await supabase
        .from('users')
        .update({ has_claimed_prize: hasClaimed })
        .eq('username', username);

      if (error) throw error;
    } catch (error) {
      console.error('Error updating user prize status:', error);
      throw error;
    }
  }

  // Flag 相关操作
  async unlockFlag(username: string, flagKey: string, points: number): Promise<void> {
    try {
      const { error } = await supabase
        .from('user_flags')
        .insert({
          username,
          flag_key: flagKey,
          points
        });

      if (error) throw error;
    } catch (error) {
      console.error('Error unlocking flag:', error);
      throw error;
    }
  }

  async getUserFlags(username: string): Promise<UserFlag[]> {
    try {
      const { data, error } = await supabase
        .from('user_flags')
        .select('*')
        .eq('username', username)
        .order('unlocked_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching user flags:', error);
      throw error;
    }
  }

  async checkFlagUnlocked(username: string, flagKey: string): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('user_flags')
        .select('id')
        .eq('username', username)
        .eq('flag_key', flagKey)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return !!data;
    } catch (error) {
      console.error('Error checking flag status:', error);
      throw error;
    }
  }

  // 排行榜相关操作
  async getLeaderboard(limit: number = 10): Promise<LeaderboardEntry[]> {
    try {
      const { data, error } = await supabase
        .from('leaderboard')
        .select('*')
        .limit(limit);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
      throw error;
    }
  }

  async getUserRank(username: string): Promise<LeaderboardEntry | null> {
    try {
      const { data, error } = await supabase
        .from('leaderboard')
        .select('*')
        .eq('username', username)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return data;
    } catch (error) {
      console.error('Error fetching user rank:', error);
      throw error;
    }
  }

  // 实时订阅
  subscribeToLeaderboard(callback: (entries: LeaderboardEntry[]) => void) {
    return supabase
      .channel('leaderboard_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'users'
        },
        async () => {
          const { data } = await this.getLeaderboard();
          if (data) callback(data);
        }
      )
      .subscribe();
  }
}

export const supabaseService = SupabaseService.getInstance(); 