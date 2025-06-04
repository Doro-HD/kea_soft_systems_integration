-- Create view
CREATE OR REPLACE VIEW safe_users AS
	SELECT
  	users.id,
    "name",
    CASE
    	WHEN db_users.username = CURRENT_USER THEN social_security_number
      ELSE '***'
    END AS social_security_number,
    "role"
   FROM users
   LEFT JOIN db_users ON users.id = db_users.user_id;
   
-- Grant anders access to the view
GRANT SELECT ON safe_users TO anders;
