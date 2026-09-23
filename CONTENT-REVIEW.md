# Content review

## 2026-09-18: signup and billing

Reviewed against `innflow-ai/innflow` origin/main commit `7c55d9e58e9927b9f728a7bdf18054a6a007d7b4` and the public https://innflow.ai/pricing page.

- `src/features/auth/components/register-form.tsx` and `auth-primitives.tsx`: signup uses email verification codes and Google; removed the GitHub signup claim and linked directly to `/signup`.
- `src/config/pricing-tiers.ts`: current paid plans are Pro ($19.99/month, 10,000 credits) and Business ($199.99/month, 140,000 credits). Annual commitments are billed monthly at $16.99/$169.99. The public pricing page agrees.
- Removed obsolete Basic plan sizes and associated seat counts. Current entitlement limits are in `src/features/subscriptions/lib/subscription-limits.ts`.
- Free allowance discrepancy remains unresolved: latest origin/main specifies 500 credits, while the public pricing page advertises 1,200. Docs refer readers to their account allowance instead of choosing an unverified live value. Removed the old $5 and 400-credit claims.

This is a focused review, not an accuracy audit of all documentation. The custom domain was transferred to the replacement on 2026-09-18; Mintlify now tracks the preserved archive/mintlify branch.


## 2026-09-23: tool catalog and behavior alignment

See [CONTENT-ALIGNMENT.md](CONTENT-ALIGNMENT.md) for the larger change list and
source evidence. The update adds a generated universal-search reference, aligns
53 guide operation lists, and corrects trigger setup, execution semantics, output
paths, Copilot/Assistant behavior, hidden nodes, and plan terminology. Slack
Create Canvas is explicitly documented as currently rejected by Innflow's
implementation. Source coverage is distinct from live provider validation.
