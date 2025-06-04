-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Without this policy anders wil not be able to update
CREATE POLICY superintendent_safeguard_select ON users
	FOR SELECT
  	TO anders
	USING (true);

-- Create policy for insert to only allow adding tenants, for user anders
CREATE POLICY superintendent_safeguard_insert ON users
	FOR INSERT
	TO anders
	WITH CHECK ("role" = 'tenant');

-- Create policy for update to allow anders to update any row
CREATE POLICY superintendent_safeguard_update ON users
	FOR UPDATE
	TO anders
	USING (true);

