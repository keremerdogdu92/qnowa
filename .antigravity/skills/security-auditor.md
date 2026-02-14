# Skill: Security & Multi-tenancy Auditor

**Trigger:** Any database schema change or new API endpoint.

**Checklist:**
1. Is Row Level Security (RLS) applied to the new table?
2. Does the repository method explicitly require `orgId`?
3. Are sensitive fields (IBAN, GIB Passwords) encrypted?
4. Is there a Zod schema for input validation?
