# ALTA — Real Backend Integration & Architecture Blueprint

This document specifies the complete transition of the ALTA frontend to a secure, production-grade cloud architecture using **Supabase (PostgreSQL + Auth)**, **Server-Side LLM APIs (Gemini/Claude)**, and **Judge0 CE (Isolated Code Execution Sandbox)**.

---

## 1. External Services & Required Credentials

| Service | Purpose | Credentials Required | Environment Key |
| :--- | :--- | :--- | :--- |
| **Supabase** | PostgreSQL Database, Row-Level Security, GoTrue Auth, Realtime | Project URL, Public Anon Key, Service Role Secret | `VITE_SUPABASE_URL`<br>`VITE_SUPABASE_ANON_KEY`<br>`SUPABASE_SERVICE_ROLE_KEY` |
| **Server LLM (Gemini / Claude)** | Cognitive Diagnostics, Weakness Detection, Validated Task Generation | LLM API Secret Key | `GEMINI_API_KEY`<br>*(or `ANTHROPIC_API_KEY`)* |
| **Judge0 CE Sandbox** | Isolated Code Execution (Python, JS, C++, Java), Timeout & Memory Control | RapidAPI Key & Host URL | `JUDGE0_API_KEY`<br>`JUDGE0_API_HOST` |
| **Certificate Authority** | SHA-256 Digital Signature for unforgeable 90-Day honors | Cryptographic Salt | `CERTIFICATE_SIGNING_SECRET` |

---

## 2. Concise Phased Integration Plan

```
Phase A: Database & Auth Setup (Supabase)
  │  ├── Deploy schema.sql (18 Modules + Strict RLS)
  │  └── Connect User Sign-in & Profile Sync
  ▼
Phase B: Server-Side AI Pipeline
  │  ├── Socratic Diagnostic Discussion
  │  ├── Automated Task Validation (Syntax & Hidden Tests)
  │  └── Progressive 5-Tier Hint Generation
  ▼
Phase C: Isolated Code Execution (Judge0)
  │  ├── Sandbox Execution with 2.0s time limit & 128MB RAM
  │  └── Server-side validation against Hidden Test Cases
  ▼
Phase D: Security & Gamification Enforcers
  │  ├── Server-side Problem Unlock Validation (prevents skipping)
  │  ├── Idempotent Token Crediting & Anti-Cheat
  │  └── 90-Day Challenge Verification & SHA-256 Certificate Issuance
```

---

## 3. The 18 Database Modules (in `database/schema.sql`)

1. `profiles`: User info, rank, level, streak, XP, role.
2. `coding_problems`: Official catalog + custom problems with hidden test suites.
3. `learning_sessions`: Active student problem journeys.
4. `ai_conversations`: Step-by-step diagnostic dialog & detected cognitive gaps.
5. `skill_profiles`: Persistent mastery radar across algorithms and data structures.
6. `skill_assessments`: Bayesian/empirical mastery delta per session.
7. `generated_coding_tasks`: Server-validated atomic drills.
8. `task_dependencies`: Topological graph of prerequisite micro-skills.
9. `code_submissions`: User code, telemetry, verdict, execution stats.
10. `test_results`: Public results (detailed) and hidden test results (pass/fail only).
11. `hint_usages`: Hint progression audit without penalizing learners.
12. `learning_progress`: Verified completion status per task.
13. `token_wallets` & `token_transactions`: Server-calculated currency ledger.
14. `badges` & `user_badges`: Tiered achievements (Common, Rare, Epic, Legendary).
15. `leaderboard_cache`: Global, weekly, monthly rankings.
16. `daily_activities`: Active practice minutes, tasks solved, streaks.
17. `challenge_90_enrollments`: 12-week milestones & capstone defense tracking.
18. `certificates`: Cryptographically signed, publicly verifiable certificate records.

---

## 4. Security Principles Enforced

- **Task Validation:** Generated tasks are tested against hidden test cases and verified on the server before reaching the learner.
- **Isolated Code Runner:** Untrusted learner code never runs on the app host; it is sent to an isolated container with disabled networking, 2s wall-clock limit, and 128MB memory cap.
- **Unlock Guard:** The server strictly rejects requests to solve the original problem until all mandatory prerequisites have a verified `completed` verdict.
- **Anti-Cheat Tokens:** Tokens cannot be claimed via frontend requests; only server-side verified test completions emit credit transactions.
- **Certificates:** Minimum 75 active days, 60 foundational tasks, >70% independent solve rate, and capstone assessment required.
