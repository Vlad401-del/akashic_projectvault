# Production release — 22 November 2026

- User explicitly approved replacing Production and closing direct contact access.
- Production: https://akashic-projectvault.vercel.app/
- Deployment: dpl_D8msR9s99jJmqysKtKKEstYwmsTc, READY, source redeployed from tested Preview dpl_FcacmCbi56X9zuwpbzoNLX9WuWSJ using Production environment.
- Vercel CLI upload failed twice with fetch failed. Vercel connector successfully rebuilt the exact Preview source via deploymentId. Git metadata still references d23a7f1; uncommitted source changes are included in the uploaded Preview/redeployment. No Git commit or push was performed.
- Applied migration 20261122093313_restrict_direct_profile_contacts after the new deployment became READY and owned the Production domain.
- Verified anon and authenticated cannot SELECT contacts directly; read_visible_profiles still works, including owner lookup. Earlier transaction test confirmed hidden public contacts are empty while owner retains them.
- Live checks: homepage, team board, public profile, forgot-password return 200. Protected profile settings resolves to login for anonymous visitor.
- Rollback to an older build using SELECT * on profiles is incompatible with restricted contact access. Prefer a forward fix; do not restore broad SELECT merely to roll back application code.
- Not covered by live checks: authenticated browser login, reset email delivery on Production, or actual upload on Production. Local user tests passed earlier. Resend domain verification and leaked password protection remain separate outstanding work.
