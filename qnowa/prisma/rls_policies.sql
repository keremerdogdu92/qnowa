
-- Enable RLS on all tables
ALTER TABLE "Organization" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "User" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Account" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Session" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "VerificationToken" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Fatura" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "FaturaSatir" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Cari" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "YevmiyeFisi" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "YevmiyeSatir" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "HesapPlani" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Outbox" ENABLE ROW LEVEL SECURITY;

-- Create a function to get current user ID from session variable
CREATE OR REPLACE FUNCTION current_user_id() RETURNS TEXT AS $$
BEGIN
  RETURN current_setting('app.current_user_id', true);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a function to get current org ID from session variable
CREATE OR REPLACE FUNCTION current_org_id() RETURNS TEXT AS $$
BEGIN
  RETURN current_setting('app.current_org_id', true);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- POLICIES

-- Organization:
-- Users can see their own organization
CREATE POLICY "Users can view their own organization" ON "Organization"
  FOR SELECT
  USING ("id" = current_org_id());

-- Policy for User table
CREATE POLICY "Users can view themselves" ON "User"
  FOR SELECT
  USING ("id" = current_user_id());

-- Policy for Fatura (Invoice)
CREATE POLICY "Users can view organization invoices" ON "Fatura"
  FOR ALL
  USING ("orgId" = current_org_id());

-- Policy for Cari
CREATE POLICY "Users can view organization parties" ON "Cari"
  FOR ALL
  USING ("orgId" = current_org_id());

-- Policy for Accounting
CREATE POLICY "Users can view organization journals" ON "YevmiyeFisi"
  FOR ALL
  USING ("orgId" = current_org_id());

-- Policy for Outbox
CREATE POLICY "Users can insert into outbox" ON "Outbox"
  FOR INSERT
  WITH CHECK (true); 
