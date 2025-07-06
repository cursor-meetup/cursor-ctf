-- 创建排行榜视图
CREATE OR REPLACE VIEW user_rankings AS
WITH user_stats AS (
  SELECT 
    u.username,
    u.total_score,
    COUNT(uf.flag_key) as solved_flags,
    MAX(uf.created_at) as last_submission_time
  FROM users u
  LEFT JOIN user_flags uf ON u.username = uf.username
  GROUP BY u.username, u.total_score
)
SELECT 
  username,
  total_score,
  solved_flags,
  last_submission_time,
  RANK() OVER (
    ORDER BY total_score DESC, 
    last_submission_time ASC
  ) as rank
FROM user_stats;

-- 创建排行榜更新触发器
CREATE OR REPLACE FUNCTION notify_ranking_update()
RETURNS TRIGGER AS $$
BEGIN
  PERFORM pg_notify(
    'ranking_updates',
    json_build_object(
      'type', TG_OP,
      'record', row_to_json(NEW)
    )::text
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 为用户分数更新创建触发器
DROP TRIGGER IF EXISTS user_score_update_trigger ON users;
CREATE TRIGGER user_score_update_trigger
  AFTER UPDATE OF total_score
  ON users
  FOR EACH ROW
  EXECUTE FUNCTION notify_ranking_update();

-- 为新提交的 flag 创建触发器
DROP TRIGGER IF EXISTS flag_submission_trigger ON user_flags;
CREATE TRIGGER flag_submission_trigger
  AFTER INSERT
  ON user_flags
  FOR EACH ROW
  EXECUTE FUNCTION notify_ranking_update(); 