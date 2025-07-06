-- 清除用户数据脚本
-- 警告：此脚本将删除所有用户数据，请谨慎使用

-- 1. 清除所有用户flag记录
DELETE FROM user_flags;

-- 2. 清除所有用户记录
DELETE FROM users;

-- 3. 重置序列（如果需要）
ALTER SEQUENCE IF EXISTS user_flags_id_seq RESTART WITH 1;

-- 4. 验证清除结果
SELECT 'user_flags表记录数:' as table_name, COUNT(*) as count FROM user_flags
UNION ALL
SELECT 'users表记录数:' as table_name, COUNT(*) as count FROM users;

-- 执行完成提示
SELECT '✅ 数据库用户数据已清除完成' as result; 