import { supabase } from '../config/supabase';

export interface RankingItem {
  username: string;
  total_score: number;
  rank: number;
}

class RankingService {
  private static instance: RankingService;

  private constructor() {}

  public static getInstance(): RankingService {
    if (!RankingService.instance) {
      RankingService.instance = new RankingService();
    }
    return RankingService.instance;
  }

  // 获取排行榜数据
  async getRankings(): Promise<RankingItem[]> {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('username, total_score')
        .order('total_score', { ascending: false });

      if (error) {
        console.error('获取排行榜失败:', error);
        throw new Error('获取排行榜数据失败');
      }

      return data.map((item, index) => ({
        ...item,
        rank: index + 1
      }));
    } catch (error) {
      console.error('获取排行榜失败:', error);
      throw error;
    }
  }

  // 获取用户排名
  async getUserRanking(username: string): Promise<RankingItem | null> {
    try {
      // 获取用户数据
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('username, total_score')
        .eq('username', username)
        .single();

      if (userError) {
        if (userError.code === 'PGRST116') { // 没有找到记录
          return null;
        }
        console.error('获取用户排名失败:', userError);
        throw new Error('获取用户排名失败');
      }

      // 获取排名（计算有多少人的分数比当前用户高）
      const { count: higherScores } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true })
        .gt('total_score', userData.total_score);

      return {
        ...userData,
        rank: (higherScores ?? 0) + 1
      };
    } catch (error) {
      console.error('获取用户排名失败:', error);
      throw error;
    }
  }

  // 订阅排行榜更新
  subscribeToRankingUpdates(callback: (payload: any) => void) {
    return supabase
      .channel('ranking_updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'users',
          filter: 'total_score=gt.0'
        },
        callback
      )
      .subscribe();
  }
}

export const rankingService = RankingService.getInstance(); 