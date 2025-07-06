-- 生成20个测试用户的脚本
-- 用户名: testuser1 到 testuser20
-- 密码: 123 (所有用户使用相同密码)
-- 积分: 10

-- 删除已存在的测试用户（如果有的话）
DELETE FROM user_flags WHERE username LIKE 'testuser%';
DELETE FROM users WHERE username LIKE 'testuser%';

-- 插入20个测试用户
INSERT INTO users (username, password, total_score, has_claimed_prize, created_at, updated_at) 
VALUES 
  ('testuser1', encode(digest('123', 'sha256'), 'hex'), 10, false, NOW(), NOW()),
  ('testuser2', encode(digest('123', 'sha256'), 'hex'), 10, false, NOW(), NOW()),
  ('testuser3', encode(digest('123', 'sha256'), 'hex'), 10, false, NOW(), NOW()),
  ('testuser4', encode(digest('123', 'sha256'), 'hex'), 10, false, NOW(), NOW()),
  ('testuser5', encode(digest('123', 'sha256'), 'hex'), 10, false, NOW(), NOW()),
  ('testuser6', encode(digest('123', 'sha256'), 'hex'), 10, false, NOW(), NOW()),
  ('testuser7', encode(digest('123', 'sha256'), 'hex'), 10, false, NOW(), NOW()),
  ('testuser8', encode(digest('123', 'sha256'), 'hex'), 10, false, NOW(), NOW()),
  ('testuser9', encode(digest('123', 'sha256'), 'hex'), 10, false, NOW(), NOW()),
  ('testuser10', encode(digest('123', 'sha256'), 'hex'), 10, false, NOW(), NOW()),
  ('testuser11', encode(digest('123', 'sha256'), 'hex'), 10, false, NOW(), NOW()),
  ('testuser12', encode(digest('123', 'sha256'), 'hex'), 10, false, NOW(), NOW()),
  ('testuser13', encode(digest('123', 'sha256'), 'hex'), 10, false, NOW(), NOW()),
  ('testuser14', encode(digest('123', 'sha256'), 'hex'), 10, false, NOW(), NOW()),
  ('testuser15', encode(digest('123', 'sha256'), 'hex'), 10, false, NOW(), NOW()),
  ('testuser16', encode(digest('123', 'sha256'), 'hex'), 10, false, NOW(), NOW()),
  ('testuser17', encode(digest('123', 'sha256'), 'hex'), 10, false, NOW(), NOW()),
  ('testuser18', encode(digest('123', 'sha256'), 'hex'), 10, false, NOW(), NOW()),
  ('testuser19', encode(digest('123', 'sha256'), 'hex'), 10, false, NOW(), NOW()),
  ('testuser20', encode(digest('123', 'sha256'), 'hex'), 10, false, NOW(), NOW());

-- 为每个用户添加一个flag记录以达到10分
INSERT INTO user_flags (username, flag_key, points, unlocked_at)
VALUES 
  ('testuser1', 'hzcursor2025', 10, NOW()),
  ('testuser2', 'hzcursor2025', 10, NOW()),
  ('testuser3', 'hzcursor2025', 10, NOW()),
  ('testuser4', 'hzcursor2025', 10, NOW()),
  ('testuser5', 'hzcursor2025', 10, NOW()),
  ('testuser6', 'hzcursor2025', 10, NOW()),
  ('testuser7', 'hzcursor2025', 10, NOW()),
  ('testuser8', 'hzcursor2025', 10, NOW()),
  ('testuser9', 'hzcursor2025', 10, NOW()),
  ('testuser10', 'hzcursor2025', 10, NOW()),
  ('testuser11', 'hzcursor2025', 10, NOW()),
  ('testuser12', 'hzcursor2025', 10, NOW()),
  ('testuser13', 'hzcursor2025', 10, NOW()),
  ('testuser14', 'hzcursor2025', 10, NOW()),
  ('testuser15', 'hzcursor2025', 10, NOW()),
  ('testuser16', 'hzcursor2025', 10, NOW()),
  ('testuser17', 'hzcursor2025', 10, NOW()),
  ('testuser18', 'hzcursor2025', 10, NOW()),
  ('testuser19', 'hzcursor2025', 10, NOW()),
  ('testuser20', 'hzcursor2025', 10, NOW());

-- 验证数据
SELECT 
  u.username, 
  u.total_score, 
  u.has_claimed_prize,
  COUNT(uf.id) as flag_count
FROM users u
LEFT JOIN user_flags uf ON u.username = uf.username
WHERE u.username LIKE 'testuser%'
GROUP BY u.username, u.total_score, u.has_claimed_prize
ORDER BY u.username;

-- 显示总计
SELECT COUNT(*) as total_test_users FROM users WHERE username LIKE 'testuser%'; 