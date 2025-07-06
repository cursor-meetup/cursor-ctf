-- 删除现有的策略
DROP POLICY IF EXISTS "允许用户查看所有用户信息" ON users;
DROP POLICY IF EXISTS "只允许用户更新自己的信息" ON users;

-- 创建新的策略
-- 允许插入新用户（注册）
CREATE POLICY "允许注册新用户" ON users FOR INSERT
WITH CHECK (true);

-- 允许查看用户信息
CREATE POLICY "允许查看用户信息" ON users FOR SELECT
USING (true);

-- 允许用户更新自己的信息
CREATE POLICY "允许用户更新自己的信息" ON users FOR UPDATE
USING (auth.uid()::text = username);

-- 确保启用 RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY; 