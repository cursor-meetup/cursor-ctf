-- 创建解锁 Flag 的函数
CREATE OR REPLACE FUNCTION unlock_flag(
    p_username TEXT,
    p_flag_key TEXT,
    p_points INTEGER
)
RETURNS VOID AS $$
BEGIN
    -- 检查用户是否存在
    IF NOT EXISTS (SELECT 1 FROM users WHERE username = p_username) THEN
        RAISE EXCEPTION 'User does not exist: %', p_username;
    END IF;
    
    -- 检查是否已经解锁过这个 flag
    IF EXISTS (
        SELECT 1 FROM user_flags 
        WHERE username = p_username AND flag_key = p_flag_key
    ) THEN
        RAISE EXCEPTION 'Flag already unlocked: %', p_flag_key;
    END IF;
    
    -- 插入新的 flag 记录
    INSERT INTO user_flags (username, flag_key, points)
    VALUES (p_username, p_flag_key, p_points);
    
    -- 触发器会自动更新用户总分
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 授予执行权限
GRANT EXECUTE ON FUNCTION unlock_flag TO anon, authenticated; 