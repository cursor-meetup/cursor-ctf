-- 清除Flag数据脚本
-- 此脚本只清除flag记录，保留用户账户信息

-- 1. 清除所有用户flag记录
DELETE FROM user_flags;

-- 2. 将所有用户的总分重置为0，并重置奖励领取状态为未领取
UPDATE users SET 
    total_score = 0,
    has_claimed_prize = false,
    updated_at = NOW()
WHERE total_score > 0 OR has_claimed_prize = true;

-- 3. 重置序列
ALTER SEQUENCE IF EXISTS user_flags_id_seq RESTART WITH 1;

-- 4. 验证清除结果
SELECT 'user_flags表记录数:' as table_name, COUNT(*) as count FROM user_flags
UNION ALL
SELECT 'users表记录数:' as table_name, COUNT(*) as count FROM users
UNION ALL
SELECT '总分大于0的用户数:' as table_name, COUNT(*) as count FROM users WHERE total_score > 0
UNION ALL
SELECT '已领取奖励的用户数:' as table_name, COUNT(*) as count FROM users WHERE has_claimed_prize = true;

-- 执行完成提示
SELECT '✅ Flag数据已清除完成，用户账户保留，奖励领取状态已重置' as result; 