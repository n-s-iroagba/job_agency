# SCREEN INVENTORY

**Document Status:** Draft  
**Version:** 1.0  
**Date:** 2026-04-13  
**Conformance:** ISO/IEC/IEEE 29148:2018 — Traceability practices; ISO 9241-210:2019 — Human-centred design  
**Upstream Document:** [strs.md](file:///home/udorakpuenyi/job_agency/docs/strs.md) (StRS STAKE-JOBAGENCY-001)

---

## 1.0 PURPOSE & SCOPE

This document provides a **complete inventory of every user-facing screen** in the Job Agency platform. Each screen is assigned a unique Screen ID (SCR-xxx) and traced **backward** to the StRS requirements (STK-xxx), design mandates (DM-xxx), trust requirements (TRUST-xxx), non-functional requirements (NFR-xxx), and operational scenarios that necessitate it.

**Traceability direction:** Screen → StRS Requirement(s) (backward traceability per ISO/IEC/IEEE 29148:2018 §6.6).

---

## 2.0 SCREEN ID CONVENTION

```
SCR-{DOMAIN}-{MODULE}-{NNN}

  DOMAIN  = PUB (Public/Unauthenticated) | APP (Applicant) | ADM (Admin)
  MODULE  = abbreviated functional module
  NNN     = sequential number within module
```

---

## 3.0 INVENTORY SUMMARY

| Domain | Screen Count | Description |
|--------|-------------|-------------|
| Public (PUB) | 5 | Unauthenticated visitor screens |
| Applicant (APP) | 14 | Authenticated applicant screens |
| Admin (ADM) | 22 | Admin panel screens |
| Shared / System | 4 | Error pages, loading states, notification overlays |
| **Total** | **45** | |

---

## 4.0 PUBLIC DOMAIN SCREENS (Unauthenticated)

### SCR-PUB-HOME-001 — Homepage

| Attribute | Value |
|-----------|-------|
| **Route** | `/` |
| **Description** | Landing page for unauthenticated visitors. Displays agency header introduction, trust indicators, and a scrollable/paginated list of active job listings with "Apply Now" CTA on each card. |
| **Primary User** | Unauthenticated visitor |
| **Key UI Elements** | Agency header with branding and credentials; job card list (title, location, category, employment type); "Apply Now" button per card; category filter; search bar; footer with contact info, privacy policy link, social media links |
| **Backward Traceability** | |

| Traced Requirement | Rationale |
|--------------------|-----------|
| STK-APP-AUTH-001 | System routes unauthenticated users to Home page with header and job list |
| STK-APP-AUTH-003 | "Apply Now" on job card navigates to login/signup |
| STK-ADM-JOB-004 | Job listings displayed on public homepage |
| STK-ADM-CAT-003 | Categories used to filter job listings on public-facing views |
| DM-002 | Verified platform indicators — trust badges and professional branding |
| DM-008 | Admin legitimacy visibility — agency credentials and contact info |
| TRUST-002 | Agency certifications, registration numbers, office address, contact info |
| TRUST-006 | Privacy policy link accessible from every page |
| TRUST-009 | All costs disclosed on job detail before applying |
| TRUST-010 | Support email/phone number displayed |
| NFR-PERF-002 | Homepage loads in ≤ 2 seconds on 4G |

---

### SCR-PUB-JOBDETAIL-001 — Job Detail Page

| Attribute | Value |
|-----------|-------|
| **Route** | `/jobs/:jobId` |
| **Description** | Full detail view of a single job listing including benefits, conditions, application stages overview, and cost disclosure. |
| **Primary User** | Unauthenticated visitor / Authenticated applicant |
| **Key UI Elements** | Job title, description, location, employment type; benefits list; conditions list; application stages summary (with payment indicators); total cost disclosure; "Apply Now" CTA; back navigation; trust indicators |
| **Backward Traceability** | |

| Traced Requirement | Rationale |
|--------------------|-----------|
| STK-APP-APPLY-001 | Applicant views full job details including benefits and conditions before applying |
| STK-ADM-BEN-004 | Benefits displayed on job detail view |
| STK-ADM-COND-003 | Conditions displayed on job detail view |
| STK-APP-APPLY-003 | Clearly indicate which stages require payment and amount due |
| DM-004 | All application stages and requirements visible upfront |
| DM-005 | Payment transparency — display cost breakdown before action |
| TRUST-009 | All costs disclosed upfront on job detail page |
| TRUST-006 | Privacy policy link accessible |

---

### SCR-PUB-LOGIN-001 — Login Page

| Attribute | Value |
|-----------|-------|
| **Route** | `/login` |
| **Description** | Authentication page supporting Google OAuth and email/password login. Redirects to dashboard or specific job application upon success. |
| **Primary User** | Unauthenticated visitor |
| **Key UI Elements** | Email input; password input (with show/hide toggle); "Login" button; "Sign up with Google" button; "Forgot Password" link; "Create Account" link; error messaging area; trust indicators; rate-limit warning display |
| **Backward Traceability** | |

| Traced Requirement | Rationale |
|--------------------|-----------|
| STK-APP-AUTH-003 | "Apply Now" navigates to login/signup when not authenticated |
| STK-APP-AUTH-004 | Login via Google OAuth 2.0 and email/password |
| STK-APP-AUTH-005 | After authentication, redirect to job application or dashboard |
| NFR-SEC-008 | Failed login rate limiting — 5 attempts per 15 minutes per IP |
| DM-002 | Verified platform indicators on login page |

---

### SCR-PUB-REGISTER-001 — Registration Page

| Attribute | Value |
|-----------|-------|
| **Route** | `/register` |
| **Description** | Account creation for new applicants. Supports Google OAuth and email/password registration with password policy enforcement. |
| **Primary User** | New unauthenticated visitor |
| **Key UI Elements** | Full name input; email input; password input (policy indicator); confirm password input; "Register" button; "Sign up with Google" button; "Already have an account? Login" link; password strength indicator; terms & privacy policy checkbox; error messaging |
| **Backward Traceability** | |

| Traced Requirement | Rationale |
|--------------------|-----------|
| STK-APP-AUTH-004 | Registration via Google OAuth 2.0 and email/password |
| STK-APP-AUTH-005 | After registration, redirect to job application or dashboard |
| NFR-SEC-002 | Passwords hashed with bcrypt (policy enforcement on client) |
| TRUST-006 | Privacy policy acceptance during registration |
| REG-002 | Data protection compliance — consent collection |

---

### SCR-PUB-PRIVACY-001 — Privacy Policy Page

| Attribute | Value |
|-----------|-------|
| **Route** | `/privacy` |
| **Description** | Static page displaying the platform's privacy policy, data collection practices, and data deletion request process. |
| **Primary User** | Any visitor |
| **Key UI Elements** | Privacy policy content; data collection summary; data deletion request instructions; contact information |
| **Backward Traceability** | |

| Traced Requirement | Rationale |
|--------------------|-----------|
| TRUST-006 | Clear privacy policy link accessible from every page |
| REG-002 | Data protection compliance (GDPR / local regulations) |
| REG-004 | Right to data deletion — process documented |

---

## 5.0 APPLICANT DOMAIN SCREENS (Authenticated)

### SCR-APP-DASH-001 — Applicant Dashboard

| Attribute | Value |
|-----------|-------|
| **Route** | `/dashboard` |
| **Description** | Primary authenticated landing page. Displays pending stages, unpaid payments, active application summaries, and available job listings. |
| **Primary User** | Authenticated applicant |
| **Key UI Elements** | Pending stages widget; unpaid payments widget; active applications list with progress trackers; available jobs list; notification bell icon; profile/account menu; support contact info |
| **Backward Traceability** | |

| Traced Requirement | Rationale |
|--------------------|-----------|
| STK-APP-AUTH-002 | Authenticated applicants routed to dashboard |
| STK-APP-DASH-001 | Dashboard displays pending stages, unpaid payments, job listings |
| STK-APP-DASH-002 | Support managing multiple concurrent applications |
| STK-APP-DASH-003 | Real-time status updates for all active applications |
| DM-001 | Clear progress tracker per application |
| DM-007 | Progress motivation indicators |
| TRUST-005 | Percentage completion bar, celebratory messaging |
| TRUST-010 | Support email/phone on dashboard |
| NFR-PERF-003 | Dashboard renders in ≤ 3 seconds |

---

### SCR-APP-JOBAPPLY-001 — Job Application Page

| Attribute | Value |
|-----------|-------|
| **Route** | `/dashboard/applications/:jobId/apply` |
| **Description** | Sequential application form displaying current stage, stage requirements, and progress. Allows stage-by-stage completion. |
| **Primary User** | Authenticated applicant |
| **Key UI Elements** | Stage progress tracker (step indicator); current stage form/instructions; stage payment indicator; "Complete Stage" CTA; "Save Draft" button; job summary sidebar; previous stages status; next stages preview |
| **Backward Traceability** | |

| Traced Requirement | Rationale |
|--------------------|-----------|
| STK-APP-AUTH-005 | Redirect to job application page after auth |
| STK-APP-APPLY-002 | Sequential application stages guided flow |
| STK-APP-APPLY-003 | Clearly indicate payment stages and amounts |
| STK-APP-APPLY-004 | Multiple simultaneous applications |
| STK-APP-APPLY-005 | Save progress / resume later |
| DM-001 | Clear progress tracker |
| DM-004 | Step-by-step flow — no hidden stages |
| DM-007 | Progress motivation indicators |
| TRUST-005 | "X of Y stages complete" indicators |

---

### SCR-APP-APPLIST-001 — My Applications List

| Attribute | Value |
|-----------|-------|
| **Route** | `/dashboard/applications` |
| **Description** | List of all the applicant's current and past job applications with status, progress, and actions. |
| **Primary User** | Authenticated applicant |
| **Key UI Elements** | Application cards (job title, status, progress bar, last updated, pending actions); filter by status (active, draft, completed); sort options |
| **Backward Traceability** | |

| Traced Requirement | Rationale |
|--------------------|-----------|
| STK-APP-DASH-002 | Managing multiple concurrent applications |
| STK-APP-APPLY-004 | Multiple simultaneous applications |
| STK-APP-APPLY-005 | Resume from where left off (link to draft) |
| DM-001 | Clear progress tracker per application |

---

### SCR-APP-APPDETAIL-001 — Application Detail / Timeline

| Attribute | Value |
|-----------|-------|
| **Route** | `/dashboard/applications/:applicationId` |
| **Description** | Detailed view of a single application showing all stages, payments, timeline of events, and current status. |
| **Primary User** | Authenticated applicant |
| **Key UI Elements** | Stage list with statuses; payment status per stage; audit trail timeline (chronological events with timestamps); current action required; stage completion dates; notification history |
| **Backward Traceability** | |

| Traced Requirement | Rationale |
|--------------------|-----------|
| STK-APP-DASH-003 | Real-time status updates for active applications |
| STK-APP-APPLY-002 | Sequential stages with status |
| DM-006 | Audit trail visibility — timeline of all actions with timestamps |
| TRUST-004 | Chronological timeline of all application events |
| TRUST-005 | Progress motivation indicators |

---

### SCR-APP-PAYMENT-001 — Payment Instructions Page

| Attribute | Value |
|-----------|-------|
| **Route** | `/dashboard/applications/:applicationId/stages/:stageId/payment` |
| **Description** | Displays payment details for a payment-bearing stage: amount, bank account (type-appropriate), crypto wallets, and upload interface for payment proof. |
| **Primary User** | Authenticated applicant |
| **Key UI Elements** | Payment amount and currency; payment purpose explanation; bank account details (Open Beneficiary or Normal based on amount); crypto wallet addresses; payment instructions; "Upload Payment Proof" button; estimated verification timeline; support contact info |
| **Backward Traceability** | |

| Traced Requirement | Rationale |
|--------------------|-----------|
| STK-APP-PAY-001 | Display appropriate bank account and/or crypto wallet details |
| STK-ADM-BANK-002 | Open Beneficiary vs Normal based on amount |
| STK-ADM-BANK-003 | Display appropriate bank account type based on payment amount |
| STK-ADM-CRYPTO-003 | Crypto wallets presented as alternative payment method |
| DM-005 | Payment transparency — what for, exact amount, methods, timeline |
| TRUST-001 | Payment purpose, amount, methods, timeline, refund policy |
| TRUST-007 | Estimated verification turnaround time |
| TRUST-010 | Support contact on payment pages |

---

### SCR-APP-PAYUPLOAD-001 — Payment Proof Upload Page

| Attribute | Value |
|-----------|-------|
| **Route** | `/dashboard/applications/:applicationId/stages/:stageId/payment/upload` |
| **Description** | Dedicated upload interface for payment screenshot submission including file validation and confirmation. |
| **Primary User** | Authenticated applicant |
| **Key UI Elements** | File upload dropzone (drag & drop + browse); accepted formats indicator (JPEG, PNG, PDF); file size limit indicator (10MB max); preview of selected file; "Submit Proof" CTA; upload progress bar; confirmation message with queue position and estimated turnaround |
| **Backward Traceability** | |

| Traced Requirement | Rationale |
|--------------------|-----------|
| STK-APP-PAY-002 | Upload payment screenshot as proof |
| STK-APP-PAY-003 | Support JPEG, PNG, PDF; 10MB max |
| DM-003 | Real-time confirmation on upload |
| TRUST-003 | Immediate visual feedback on action |
| TRUST-007 | Immediate confirmation that screenshot received, queue position, estimated turnaround |

---

### SCR-APP-PAYSTATUS-001 — Payment Status View

| Attribute | Value |
|-----------|-------|
| **Route** | (Inline within SCR-APP-APPDETAIL-001 or standalone at `/dashboard/applications/:applicationId/stages/:stageId/payment/status`) |
| **Description** | Displays the current verification status of a submitted payment (Pending, Verified, Rejected) with re-upload option if rejected. |
| **Primary User** | Authenticated applicant |
| **Key UI Elements** | Status badge (Pending/Verified/Rejected); timestamp of submission; timestamp of last status change; rejection reason (if applicable); "Re-upload" button (if rejected); notification history for this payment |
| **Backward Traceability** | |

| Traced Requirement | Rationale |
|--------------------|-----------|
| STK-APP-PAY-004 | Display current payment verification status (Pending, Verified, Rejected) |
| STK-APP-PAY-005 | Notify applicant when payment status changes |
| DM-003 | Real-time confirmations |
| TRUST-003 | Immediate visual feedback |

---

### SCR-APP-CV-001 — CV Management Page

| Attribute | Value |
|-----------|-------|
| **Route** | `/dashboard/cv` |
| **Description** | CRUD interface for applicant CVs. Supports upload, preview, update, and deletion of CV documents. |
| **Primary User** | Authenticated applicant |
| **Key UI Elements** | Upload area (drag & drop + browse); accepted formats (PDF, DOCX); size limit (5MB); list of existing CVs with filename, upload date, file size; preview/download action; update (replace) action; delete action with confirmation; application association display |
| **Backward Traceability** | |

| Traced Requirement | Rationale |
|--------------------|-----------|
| STK-APP-CV-001 | CRUD CV documents |
| STK-APP-CV-002 | Support PDF, DOCX formats |
| STK-APP-CV-003 | Maximum 5MB per upload |
| STK-APP-CV-004 | Associate CV with job applications |

---

### SCR-APP-NOTIF-001 — Notifications Centre

| Attribute | Value |
|-----------|-------|
| **Route** | `/dashboard/notifications` |
| **Description** | Centralised view of all applicant notifications (email and push) with read/unread status and links to relevant application context. |
| **Primary User** | Authenticated applicant |
| **Key UI Elements** | Notification list (chronological, paginated); notification type indicator (stage, payment, admin message); read/unread toggle; click-through to relevant application/stage; mark all as read; notification preferences link |
| **Backward Traceability** | |

| Traced Requirement | Rationale |
|--------------------|-----------|
| STK-APP-NOTIF-001 | Email notifications for stage transitions, payment events, admin comms |
| STK-APP-NOTIF-002 | Push notifications for same events |
| TRUST-008 | Multi-channel communication visibility |

---

### SCR-APP-PROFILE-001 — Applicant Profile / Account Settings

| Attribute | Value |
|-----------|-------|
| **Route** | `/dashboard/profile` |
| **Description** | Account management page for applicant: profile details, password change, notification preferences, data deletion request. |
| **Primary User** | Authenticated applicant |
| **Key UI Elements** | Name, email (read-only if Google OAuth); password change form (with policy indicator); notification preferences (email/push toggles); "Request Data Deletion" button; connected Google account indicator; logout button |
| **Backward Traceability** | |

| Traced Requirement | Rationale |
|--------------------|-----------|
| STK-APP-AUTH-004 | Google OAuth and email/password auth display |
| REG-004 | Right to data deletion — request mechanism |
| REG-002 | Data protection compliance |
| TRUST-006 | Privacy policy link |

---

### SCR-APP-JOBLIST-001 — Browse Jobs (Authenticated)

| Attribute | Value |
|-----------|-------|
| **Route** | `/dashboard/jobs` |
| **Description** | Authenticated job browsing — same listing as homepage but within the dashboard context, with direct "Apply" action (no redirect to login). |
| **Primary User** | Authenticated applicant |
| **Key UI Elements** | Job card list; category filter; search; "Apply" CTA (direct application); job detail expansion/link |
| **Backward Traceability** | |

| Traced Requirement | Rationale |
|--------------------|-----------|
| STK-APP-DASH-001 | Full job listings available for new applications on dashboard |
| STK-ADM-JOB-004 | Job listings displayable |
| STK-ADM-CAT-003 | Categories for filtering |
| STK-APP-APPLY-004 | Create multiple applications simultaneously |

---

### SCR-APP-JOBDETAIL-002 — Job Detail (Authenticated)

| Attribute | Value |
|-----------|-------|
| **Route** | `/dashboard/jobs/:jobId` |
| **Description** | Authenticated version of job detail with "Start Application" CTA instead of "Apply Now → Login". |
| **Primary User** | Authenticated applicant |
| **Key UI Elements** | Same as SCR-PUB-JOBDETAIL-001 but with "Start Application" button; indicator if already applied |
| **Backward Traceability** | |

| Traced Requirement | Rationale |
|--------------------|-----------|
| STK-APP-APPLY-001 | View full job details before applying |
| STK-ADM-BEN-004 | Benefits displayed |
| STK-ADM-COND-003 | Conditions displayed |
| DM-004 | All stages visible upfront |
| TRUST-009 | All costs disclosed upfront |

---

## 6.0 ADMIN DOMAIN SCREENS

### SCR-ADM-DASH-001 — Admin Dashboard

| Attribute | Value |
|-----------|-------|
| **Route** | `/admin` |
| **Description** | Admin overview dashboard showing summary widgets: new applications count, unpaid payments, unverified payments, draft applications, system health summary. |
| **Primary User** | Admin |
| **Key UI Elements** | Summary cards (new apps, unpaid payments, unverified payments, drafts); quick-action links to each section; recent activity feed; server health mini-widget |
| **Backward Traceability** | |

| Traced Requirement | Rationale |
|--------------------|-----------|
| STK-ADM-APP-001 | View new applications |
| STK-ADM-APP-002 | View application drafts |
| STK-ADM-PAY-003 | View unpaid payments |
| STK-ADM-PAY-004 | View unverified payments |
| STK-ADM-HEALTH-001 | Server health summary |
| NFR-PERF-004 | Bulk views paginate at 20, load in ≤ 1 second |

---

### SCR-ADM-BANK-001 — Bank Account Management

| Attribute | Value |
|-----------|-------|
| **Route** | `/admin/bank-accounts` |
| **Description** | CRUD list view for managing bank accounts. Displays account type (Open Beneficiary / Normal), bank name, account details, and status. |
| **Primary User** | Admin |
| **Key UI Elements** | Data table (bank name, account number, type badge, status); "Add Bank Account" button; edit/delete actions per row; type filter (Open Beneficiary / Normal) |
| **Backward Traceability** | |

| Traced Requirement | Rationale |
|--------------------|-----------|
| STK-ADM-BANK-001 | CRUD bank accounts |
| STK-ADM-BANK-002 | Two types: Open Beneficiary (<$4,999) and Normal (≥$5,000) |
| STK-ADM-BANK-004 | Validation that at least one of each type exists |
| NFR-DATA-001 | Financial records immutable — versioned updates |

---

### SCR-ADM-BANKFORM-001 — Bank Account Create/Edit Form

| Attribute | Value |
|-----------|-------|
| **Route** | `/admin/bank-accounts/new` or `/admin/bank-accounts/:id/edit` |
| **Description** | Form for creating or editing a bank account with type selection. |
| **Primary User** | Admin |
| **Key UI Elements** | Bank name input; account number input; account type selector (Open Beneficiary / Normal); routing/sort code; currency; additional instructions textarea; save/cancel buttons; validation messages |
| **Backward Traceability** | |

| Traced Requirement | Rationale |
|--------------------|-----------|
| STK-ADM-BANK-001 | Create and update bank accounts |
| STK-ADM-BANK-002 | Type selection for Open Beneficiary / Normal |
| NFR-SEC-009 | Audit log entry generated on create/update |

---

### SCR-ADM-CRYPTO-001 — Crypto Wallet Management

| Attribute | Value |
|-----------|-------|
| **Route** | `/admin/crypto-wallets` |
| **Description** | CRUD list view for managing cryptocurrency wallets. |
| **Primary User** | Admin |
| **Key UI Elements** | Data table (display label, crypto type, network, wallet address truncated, status); "Add Wallet" button; edit/delete actions; crypto type filter |
| **Backward Traceability** | |

| Traced Requirement | Rationale |
|--------------------|-----------|
| STK-ADM-CRYPTO-001 | CRUD crypto wallet addresses |
| STK-ADM-CRYPTO-002 | Wallet address, crypto type, network, display label |
| NFR-DATA-001 | Financial records immutable |

---

### SCR-ADM-CRYPTOFORM-001 — Crypto Wallet Create/Edit Form

| Attribute | Value |
|-----------|-------|
| **Route** | `/admin/crypto-wallets/new` or `/admin/crypto-wallets/:id/edit` |
| **Description** | Form for creating or editing a cryptocurrency wallet entry. |
| **Primary User** | Admin |
| **Key UI Elements** | Display label input; cryptocurrency type selector (BTC, ETH, USDT, etc.); network input; wallet address input; active/inactive toggle; save/cancel buttons |
| **Backward Traceability** | |

| Traced Requirement | Rationale |
|--------------------|-----------|
| STK-ADM-CRYPTO-001 | Create and update crypto wallets |
| STK-ADM-CRYPTO-002 | Capture wallet address, crypto type, network, display label |

---

### SCR-ADM-CAT-001 — Category / Industry Management

| Attribute | Value |
|-----------|-------|
| **Route** | `/admin/categories` |
| **Description** | CRUD list for job listing categories/industries. |
| **Primary User** | Admin |
| **Key UI Elements** | Data table (name, description, associated listings count); "Add Category" button; edit/delete actions; search |
| **Backward Traceability** | |

| Traced Requirement | Rationale |
|--------------------|-----------|
| STK-ADM-CAT-001 | CRUD categories/industries |
| STK-ADM-CAT-002 | Unique name and optional description |
| STK-ADM-CAT-003 | Categories organise and filter job listings |

---

### SCR-ADM-CATFORM-001 — Category Create/Edit Form

| Attribute | Value |
|-----------|-------|
| **Route** | `/admin/categories/new` or `/admin/categories/:id/edit` |
| **Description** | Form for creating or editing a job listing category. |
| **Primary User** | Admin |
| **Key UI Elements** | Category name input (unique validation); description textarea; save/cancel buttons |
| **Backward Traceability** | |

| Traced Requirement | Rationale |
|--------------------|-----------|
| STK-ADM-CAT-001 | Create and update categories |
| STK-ADM-CAT-002 | Unique name, optional description |

---

### SCR-ADM-JOB-001 — Job Listing Management

| Attribute | Value |
|-----------|-------|
| **Route** | `/admin/jobs` |
| **Description** | CRUD list for all job listings with activation toggle, category filter, and status indicators. |
| **Primary User** | Admin |
| **Key UI Elements** | Data table (title, category, location, employment type, status active/inactive, date created); "Add Job" button; edit/delete actions; activate/deactivate toggle; category filter; search |
| **Backward Traceability** | |

| Traced Requirement | Rationale |
|--------------------|-----------|
| STK-ADM-JOB-001 | CRUD job listings |
| STK-ADM-JOB-002 | Category association |
| STK-ADM-JOB-005 | Activate/deactivate public visibility |
| NFR-PERF-004 | Paginated, loads in ≤ 1 second |

---

### SCR-ADM-JOBFORM-001 — Job Listing Create/Edit Form

| Attribute | Value |
|-----------|-------|
| **Route** | `/admin/jobs/new` or `/admin/jobs/:id/edit` |
| **Description** | Comprehensive form for creating/editing a job listing with all associated data. |
| **Primary User** | Admin |
| **Key UI Elements** | Title input; description rich-text editor; location input; employment type selector; category selector; requirements textarea; active/inactive toggle; benefits association (multi-select or inline add); conditions association; application stages builder (see SCR-ADM-STAGEBUILDER-001) |
| **Backward Traceability** | |

| Traced Requirement | Rationale |
|--------------------|-----------|
| STK-ADM-JOB-001 | Create and update job listings |
| STK-ADM-JOB-002 | Category association |
| STK-ADM-JOB-003 | Title, description, location, employment type, requirements, category |
| STK-ADM-JOB-005 | Active/inactive toggle |

---

### SCR-ADM-BEN-001 — Job Benefits Management

| Attribute | Value |
|-----------|-------|
| **Route** | `/admin/benefits` |
| **Description** | CRUD list for job listing benefits. |
| **Primary User** | Admin |
| **Key UI Elements** | Data table (benefit type, description, associated listings count); "Add Benefit" button; edit/delete actions |
| **Backward Traceability** | |

| Traced Requirement | Rationale |
|--------------------|-----------|
| STK-ADM-BEN-001 | CRUD job listing benefits |
| STK-ADM-BEN-002 | Benefit types (salary, PTO, health insurance, etc.) |
| STK-ADM-BEN-003 | Associable with multiple job listings |

---

### SCR-ADM-BENFORM-001 — Benefit Create/Edit Form

| Attribute | Value |
|-----------|-------|
| **Route** | `/admin/benefits/new` or `/admin/benefits/:id/edit` |
| **Description** | Form for creating or editing a job listing benefit. |
| **Primary User** | Admin |
| **Key UI Elements** | Benefit type selector/input; description input; value input (optional, e.g., "$60,000/yr"); job listing association multi-select; save/cancel |
| **Backward Traceability** | |

| Traced Requirement | Rationale |
|--------------------|-----------|
| STK-ADM-BEN-001 | Create and update benefits |
| STK-ADM-BEN-002 | Benefit types |
| STK-ADM-BEN-003 | Associate with job listings |

---

### SCR-ADM-COND-001 — Job Conditions Management

| Attribute | Value |
|-----------|-------|
| **Route** | `/admin/conditions` |
| **Description** | CRUD list for job listing conditions. |
| **Primary User** | Admin |
| **Key UI Elements** | Data table (condition name, description, associated listings count); "Add Condition" button; edit/delete actions |
| **Backward Traceability** | |

| Traced Requirement | Rationale |
|--------------------|-----------|
| STK-ADM-COND-001 | CRUD job listing conditions |
| STK-ADM-COND-002 | Conditions: prerequisites, terms, constraints |

---

### SCR-ADM-CONDFORM-001 — Condition Create/Edit Form

| Attribute | Value |
|-----------|-------|
| **Route** | `/admin/conditions/new` or `/admin/conditions/:id/edit` |
| **Description** | Form for creating or editing a job listing condition. |
| **Primary User** | Admin |
| **Key UI Elements** | Condition name input; description textarea; job listing association multi-select; save/cancel |
| **Backward Traceability** | |

| Traced Requirement | Rationale |
|--------------------|-----------|
| STK-ADM-COND-001 | Create and update conditions |
| STK-ADM-COND-002 | Conditions represent prerequisites, terms, constraints |

---

### SCR-ADM-STAGE-001 — Application Stage Management

| Attribute | Value |
|-----------|-------|
| **Route** | `/admin/jobs/:jobId/stages` |
| **Description** | Ordered list of application stages for a specific job listing, with drag-to-reorder, payment indicators, and notification options. |
| **Primary User** | Admin |
| **Key UI Elements** | Ordered stage list (drag-to-reorder); stage name, description, payment flag, amount (if applicable); "Add Stage" button; edit/delete per stage; notification options (email/push) per stage operation |
| **Backward Traceability** | |

| Traced Requirement | Rationale |
|--------------------|-----------|
| STK-ADM-STAGE-001 | CRUD application stages per job listing |
| STK-ADM-STAGE-002 | Payment requirement indicator |
| STK-ADM-STAGE-003 | Amount, currency, instructions, deadline for payment stages |
| STK-ADM-STAGE-004 | Notification trigger options |
| STK-ADM-STAGE-005 | Sequential ordering |
| STK-ADM-APP-004 | Option for mail/push during CRUD |

---

### SCR-ADM-STAGEFORM-001 — Application Stage Create/Edit Form

| Attribute | Value |
|-----------|-------|
| **Route** | `/admin/jobs/:jobId/stages/new` or `/admin/jobs/:jobId/stages/:stageId/edit` |
| **Description** | Form for creating or editing an application stage. |
| **Primary User** | Admin |
| **Key UI Elements** | Stage name input; description textarea; requires payment toggle; amount input (conditional); currency selector (conditional); payment instructions textarea (conditional); deadline date picker (conditional); notification options (send email/push on create); order position; save/cancel |
| **Backward Traceability** | |

| Traced Requirement | Rationale |
|--------------------|-----------|
| STK-ADM-STAGE-001 | Create and update stages |
| STK-ADM-STAGE-002 | Payment toggle |
| STK-ADM-STAGE-003 | Amount, currency, instructions, deadline |
| STK-ADM-STAGE-004 | Notification trigger options |

---

### SCR-ADM-NEWAPPS-001 — New Applications View

| Attribute | Value |
|-----------|-------|
| **Route** | `/admin/applications/new` |
| **Description** | Paginated list of applications that have been completed by applicants and are ready for admin processing. |
| **Primary User** | Admin |
| **Key UI Elements** | Data table (applicant name, job title, submission date, current stage, payment status); applicant detail link; sort by date/job; search by applicant; pagination (20 per page) |
| **Backward Traceability** | |

| Traced Requirement | Rationale |
|--------------------|-----------|
| STK-ADM-APP-001 | View new completed applications |
| NFR-PERF-004 | Paginated at 20, loads in ≤ 1 second |

---

### SCR-ADM-DRAFTS-001 — Application Drafts View

| Attribute | Value |
|-----------|-------|
| **Route** | `/admin/applications/drafts` |
| **Description** | Paginated list of incomplete/draft applications. |
| **Primary User** | Admin |
| **Key UI Elements** | Data table (applicant name, job title, last activity date, completion %, current stage); sort/filter; pagination |
| **Backward Traceability** | |

| Traced Requirement | Rationale |
|--------------------|-----------|
| STK-ADM-APP-002 | View application drafts |
| NFR-PERF-004 | Paginated at 20, loads in ≤ 1 second |

---

### SCR-ADM-UNPAID-001 — Unpaid Payments View

| Attribute | Value |
|-----------|-------|
| **Route** | `/admin/payments/unpaid` |
| **Description** | Paginated list of all unpaid application stage payments across all applicants. |
| **Primary User** | Admin |
| **Key UI Elements** | Data table (applicant name, job title, stage, amount, deadline, days overdue); "Mark as Paid" action with notification option; applicant contact email link; sort/filter; pagination |
| **Backward Traceability** | |

| Traced Requirement | Rationale |
|--------------------|-----------|
| STK-ADM-PAY-001 | Mark payment as Paid/Unpaid |
| STK-ADM-PAY-002 | Notification option on status change |
| STK-ADM-PAY-003 | View all unpaid payments |
| STK-ADM-APP-004 | Mail/push option during operations |
| NFR-PERF-004 | Paginated at 20, loads in ≤ 1 second |

---

### SCR-ADM-UNVERIFIED-001 — Unverified Payments View

| Attribute | Value |
|-----------|-------|
| **Route** | `/admin/payments/unverified` |
| **Description** | Paginated list of payments where applicant has uploaded a screenshot but admin has not yet confirmed. Includes screenshot preview and verification actions. |
| **Primary User** | Admin |
| **Key UI Elements** | Data table (applicant name, job title, stage, amount, upload date, screenshot thumbnail); "View Screenshot" modal/lightbox; "Verify (Mark as Paid)" action with notification option; "Reject (Mark as Unpaid)" action with note field and notification option; high-value flag (≥$5,000); pagination |
| **Backward Traceability** | |

| Traced Requirement | Rationale |
|--------------------|-----------|
| STK-ADM-PAY-001 | Mark as Paid or Unpaid |
| STK-ADM-PAY-002 | Notification option on status change |
| STK-ADM-PAY-004 | View unverified payments (screenshot uploaded, not confirmed) |
| STK-ADM-APP-004 | Mail/push option |
| NFR-SEC-006 | Payment screenshots accessed via signed URL |
| NFR-PERF-004 | Paginated at 20, loads in ≤ 1 second |

---

### SCR-ADM-MAIL-001 — Mail Applicant Composer

| Attribute | Value |
|-----------|-------|
| **Route** | `/admin/mail/compose` or modal overlay |
| **Description** | Email composition interface for admin to send mail directly to an applicant. |
| **Primary User** | Admin |
| **Key UI Elements** | Applicant selector (search by name/email); subject line input; rich-text body editor; push notification toggle (also send push); "Send" button; "Save Draft" button; send confirmation |
| **Backward Traceability** | |

| Traced Requirement | Rationale |
|--------------------|-----------|
| STK-ADM-APP-003 | Send mail directly to any applicant |
| STK-ADM-APP-004 | Option for mail and/or push notification |
| TRUST-008 | Multi-channel communication |

---

### SCR-ADM-HEALTH-001 — System Health Dashboard

| Attribute | Value |
|-----------|-------|
| **Route** | `/admin/health` |
| **Description** | Real-time system health dashboard showing server metrics, database metrics, and service connectivity status. |
| **Primary User** | Admin |
| **Key UI Elements** | Server health: CPU %, memory %, uptime; Database health: connection pool (used/max), query latency, storage usage; Service connectivity: email service status, push notification service status, file storage status, cache (Redis) status; threshold indicators (normal/warning/critical); auto-refresh interval |
| **Backward Traceability** | |

| Traced Requirement | Rationale |
|--------------------|-----------|
| STK-ADM-HEALTH-001 | Server health (CPU, memory, uptime) |
| STK-ADM-HEALTH-002 | Database health (connection pool, query latency, storage) |
| STK-ADM-HEALTH-003 | Health check responds in ≤ 500ms |
| NFR-OBS-004 | Health endpoints expose: uptime, DB, cache, notification, file storage connectivity |
| NFR-OBS-005 | Alert thresholds from §6.6 |

---

## 7.0 SHARED / SYSTEM SCREENS

### SCR-SYS-ERROR-001 — Error Page (404)

| Attribute | Value |
|-----------|-------|
| **Route** | `/*` (catch-all) |
| **Description** | Page not found error screen with navigation back to homepage or dashboard. |
| **Key UI Elements** | Error illustration; "Page Not Found" heading; "Go Home" / "Go to Dashboard" CTA |
| **Backward Traceability** | DM-002 (professional branding), TRUST-003 (real-time feedback) |

---

### SCR-SYS-ERROR-002 — Error Page (500 / Server Error)

| Attribute | Value |
|-----------|-------|
| **Route** | (Rendered on server error) |
| **Description** | Server error screen with retry option and support contact. |
| **Key UI Elements** | Error illustration; "Something went wrong" heading; "Try Again" button; support contact info |
| **Backward Traceability** | TRUST-003 (real-time feedback), TRUST-010 (support info), NFR-AVAIL-003 (RTO 15 min) |

---

### SCR-SYS-LOADING-001 — Global Loading State

| Attribute | Value |
|-----------|-------|
| **Route** | (Overlay/skeleton on any screen during data fetch) |
| **Description** | Loading skeleton/spinner displayed during data fetching or navigation transitions. |
| **Key UI Elements** | Content skeleton (shimmer); loading spinner; progress indicator for file uploads |
| **Backward Traceability** | TRUST-003 (immediate visual feedback within 500ms), DM-003 (real-time confirmations) |

---

### SCR-SYS-TOAST-001 — Notification Toast / Overlay

| Attribute | Value |
|-----------|-------|
| **Route** | (Global overlay on any screen) |
| **Description** | Toast notification system for in-app feedback: success, error, warning, and info messages. Also renders push notification popups. |
| **Key UI Elements** | Toast container (top-right or bottom-right); success/error/warning/info variants; auto-dismiss timer; dismiss button; push notification popup with action link |
| **Backward Traceability** | DM-003 (real-time confirmations), TRUST-003 (immediate feedback), STK-APP-NOTIF-002 (push notifications) |

---

## 8.0 BACKWARD TRACEABILITY MATRIX (Screen → StRS)

This matrix provides a complete reverse mapping from every StRS requirement to the screen(s) that realise it.

| StRS Requirement ID | Screen ID(s) |
|---------------------|-------------|
| STK-ADM-BANK-001 | SCR-ADM-BANK-001, SCR-ADM-BANKFORM-001 |
| STK-ADM-BANK-002 | SCR-ADM-BANK-001, SCR-ADM-BANKFORM-001, SCR-APP-PAYMENT-001 |
| STK-ADM-BANK-003 | SCR-APP-PAYMENT-001 |
| STK-ADM-BANK-004 | SCR-ADM-BANK-001 |
| STK-ADM-CRYPTO-001 | SCR-ADM-CRYPTO-001, SCR-ADM-CRYPTOFORM-001 |
| STK-ADM-CRYPTO-002 | SCR-ADM-CRYPTO-001, SCR-ADM-CRYPTOFORM-001 |
| STK-ADM-CRYPTO-003 | SCR-APP-PAYMENT-001 |
| STK-ADM-CAT-001 | SCR-ADM-CAT-001, SCR-ADM-CATFORM-001 |
| STK-ADM-CAT-002 | SCR-ADM-CAT-001, SCR-ADM-CATFORM-001 |
| STK-ADM-CAT-003 | SCR-PUB-HOME-001, SCR-ADM-CAT-001, SCR-APP-JOBLIST-001 |
| STK-ADM-JOB-001 | SCR-ADM-JOB-001, SCR-ADM-JOBFORM-001 |
| STK-ADM-JOB-002 | SCR-ADM-JOB-001, SCR-ADM-JOBFORM-001 |
| STK-ADM-JOB-003 | SCR-ADM-JOBFORM-001 |
| STK-ADM-JOB-004 | SCR-PUB-HOME-001, SCR-APP-JOBLIST-001 |
| STK-ADM-JOB-005 | SCR-ADM-JOB-001, SCR-ADM-JOBFORM-001 |
| STK-ADM-BEN-001 | SCR-ADM-BEN-001, SCR-ADM-BENFORM-001 |
| STK-ADM-BEN-002 | SCR-ADM-BEN-001, SCR-ADM-BENFORM-001 |
| STK-ADM-BEN-003 | SCR-ADM-BENFORM-001 |
| STK-ADM-BEN-004 | SCR-PUB-JOBDETAIL-001, SCR-APP-JOBDETAIL-002 |
| STK-ADM-COND-001 | SCR-ADM-COND-001, SCR-ADM-CONDFORM-001 |
| STK-ADM-COND-002 | SCR-ADM-COND-001, SCR-ADM-CONDFORM-001 |
| STK-ADM-COND-003 | SCR-PUB-JOBDETAIL-001, SCR-APP-JOBDETAIL-002 |
| STK-ADM-STAGE-001 | SCR-ADM-STAGE-001, SCR-ADM-STAGEFORM-001 |
| STK-ADM-STAGE-002 | SCR-ADM-STAGE-001, SCR-ADM-STAGEFORM-001 |
| STK-ADM-STAGE-003 | SCR-ADM-STAGEFORM-001 |
| STK-ADM-STAGE-004 | SCR-ADM-STAGE-001, SCR-ADM-STAGEFORM-001 |
| STK-ADM-STAGE-005 | SCR-ADM-STAGE-001 |
| STK-ADM-PAY-001 | SCR-ADM-UNPAID-001, SCR-ADM-UNVERIFIED-001 |
| STK-ADM-PAY-002 | SCR-ADM-UNPAID-001, SCR-ADM-UNVERIFIED-001 |
| STK-ADM-PAY-003 | SCR-ADM-UNPAID-001, SCR-ADM-DASH-001 |
| STK-ADM-PAY-004 | SCR-ADM-UNVERIFIED-001, SCR-ADM-DASH-001 |
| STK-ADM-APP-001 | SCR-ADM-NEWAPPS-001, SCR-ADM-DASH-001 |
| STK-ADM-APP-002 | SCR-ADM-DRAFTS-001, SCR-ADM-DASH-001 |
| STK-ADM-APP-003 | SCR-ADM-MAIL-001 |
| STK-ADM-APP-004 | SCR-ADM-MAIL-001, SCR-ADM-STAGE-001, SCR-ADM-UNPAID-001, SCR-ADM-UNVERIFIED-001 |
| STK-ADM-HEALTH-001 | SCR-ADM-HEALTH-001, SCR-ADM-DASH-001 |
| STK-ADM-HEALTH-002 | SCR-ADM-HEALTH-001 |
| STK-ADM-HEALTH-003 | SCR-ADM-HEALTH-001 |
| STK-APP-AUTH-001 | SCR-PUB-HOME-001 |
| STK-APP-AUTH-002 | SCR-APP-DASH-001 |
| STK-APP-AUTH-003 | SCR-PUB-HOME-001, SCR-PUB-LOGIN-001 |
| STK-APP-AUTH-004 | SCR-PUB-LOGIN-001, SCR-PUB-REGISTER-001 |
| STK-APP-AUTH-005 | SCR-PUB-LOGIN-001, SCR-PUB-REGISTER-001, SCR-APP-JOBAPPLY-001 |
| STK-APP-DASH-001 | SCR-APP-DASH-001, SCR-APP-JOBLIST-001 |
| STK-APP-DASH-002 | SCR-APP-DASH-001, SCR-APP-APPLIST-001 |
| STK-APP-DASH-003 | SCR-APP-DASH-001, SCR-APP-APPDETAIL-001 |
| STK-APP-APPLY-001 | SCR-PUB-JOBDETAIL-001, SCR-APP-JOBDETAIL-002 |
| STK-APP-APPLY-002 | SCR-APP-JOBAPPLY-001 |
| STK-APP-APPLY-003 | SCR-APP-JOBAPPLY-001, SCR-APP-PAYMENT-001 |
| STK-APP-APPLY-004 | SCR-APP-APPLIST-001, SCR-APP-JOBLIST-001 |
| STK-APP-APPLY-005 | SCR-APP-JOBAPPLY-001, SCR-APP-APPLIST-001 |
| STK-APP-CV-001 | SCR-APP-CV-001 |
| STK-APP-CV-002 | SCR-APP-CV-001 |
| STK-APP-CV-003 | SCR-APP-CV-001 |
| STK-APP-CV-004 | SCR-APP-CV-001 |
| STK-APP-PAY-001 | SCR-APP-PAYMENT-001 |
| STK-APP-PAY-002 | SCR-APP-PAYUPLOAD-001 |
| STK-APP-PAY-003 | SCR-APP-PAYUPLOAD-001 |
| STK-APP-PAY-004 | SCR-APP-PAYSTATUS-001 |
| STK-APP-PAY-005 | SCR-APP-PAYSTATUS-001, SCR-SYS-TOAST-001 |
| STK-APP-NOTIF-001 | SCR-APP-NOTIF-001 |
| STK-APP-NOTIF-002 | SCR-APP-NOTIF-001, SCR-SYS-TOAST-001 |
| STK-APP-NOTIF-003 | SCR-SYS-TOAST-001 |
| DM-001 | SCR-APP-DASH-001, SCR-APP-JOBAPPLY-001, SCR-APP-APPLIST-001, SCR-APP-APPDETAIL-001 |
| DM-002 | SCR-PUB-HOME-001, SCR-PUB-LOGIN-001, SCR-SYS-ERROR-001 |
| DM-003 | SCR-APP-PAYUPLOAD-001, SCR-APP-PAYSTATUS-001, SCR-SYS-LOADING-001, SCR-SYS-TOAST-001 |
| DM-004 | SCR-PUB-JOBDETAIL-001, SCR-APP-JOBDETAIL-002, SCR-APP-JOBAPPLY-001 |
| DM-005 | SCR-PUB-JOBDETAIL-001, SCR-APP-PAYMENT-001 |
| DM-006 | SCR-APP-APPDETAIL-001 |
| DM-007 | SCR-APP-DASH-001, SCR-APP-JOBAPPLY-001, SCR-APP-APPDETAIL-001 |
| DM-008 | SCR-PUB-HOME-001 |
| TRUST-001 | SCR-APP-PAYMENT-001 |
| TRUST-002 | SCR-PUB-HOME-001 |
| TRUST-003 | SCR-SYS-LOADING-001, SCR-SYS-TOAST-001, SCR-APP-PAYUPLOAD-001, SCR-APP-PAYSTATUS-001, SCR-SYS-ERROR-002 |
| TRUST-004 | SCR-APP-APPDETAIL-001 |
| TRUST-005 | SCR-APP-DASH-001, SCR-APP-JOBAPPLY-001, SCR-APP-APPDETAIL-001 |
| TRUST-006 | SCR-PUB-HOME-001, SCR-PUB-PRIVACY-001, SCR-PUB-REGISTER-001, SCR-APP-PROFILE-001 |
| TRUST-007 | SCR-APP-PAYUPLOAD-001, SCR-APP-PAYMENT-001 |
| TRUST-008 | SCR-ADM-MAIL-001, SCR-APP-NOTIF-001 |
| TRUST-009 | SCR-PUB-HOME-001, SCR-PUB-JOBDETAIL-001, SCR-APP-JOBDETAIL-002 |
| TRUST-010 | SCR-PUB-HOME-001, SCR-APP-DASH-001, SCR-APP-PAYMENT-001, SCR-SYS-ERROR-002 |
| NFR-PERF-002 | SCR-PUB-HOME-001 |
| NFR-PERF-003 | SCR-APP-DASH-001 |
| NFR-PERF-004 | SCR-ADM-DASH-001, SCR-ADM-NEWAPPS-001, SCR-ADM-DRAFTS-001, SCR-ADM-UNPAID-001, SCR-ADM-UNVERIFIED-001, SCR-ADM-JOB-001 |
| NFR-SEC-004 | All SCR-ADM-* screens |
| NFR-SEC-006 | SCR-ADM-UNVERIFIED-001 |
| NFR-SEC-008 | SCR-PUB-LOGIN-001 |
| NFR-SEC-009 | SCR-ADM-BANKFORM-001, SCR-ADM-UNPAID-001, SCR-ADM-UNVERIFIED-001 |
| NFR-DATA-001 | SCR-ADM-BANK-001, SCR-ADM-CRYPTO-001 |
| NFR-OBS-004 | SCR-ADM-HEALTH-001 |
| NFR-OBS-005 | SCR-ADM-HEALTH-001 |
| REG-002 | SCR-PUB-REGISTER-001, SCR-PUB-PRIVACY-001, SCR-APP-PROFILE-001 |
| REG-004 | SCR-PUB-PRIVACY-001, SCR-APP-PROFILE-001 |

---

## 9.0 COVERAGE VERIFICATION

### 9.1 Orphan Analysis

**Orphan Screens (screens with no StRS trace):** None — all 45 screens trace to at least one StRS requirement.

**Orphan Requirements (StRS requirements with no screen):** The following non-functional and infrastructure requirements do not manifest as distinct screens but are embedded into system-wide behaviour:

| Requirement | Reason not screen-bound |
|-------------|------------------------|
| NFR-PERF-001, NFR-PERF-005 | System-wide performance — validated via load testing, not a UI screen |
| NFR-AVAIL-001..004 | Infrastructure availability — no UI surface; monitored via SCR-ADM-HEALTH-001 |
| NFR-SEC-001, 002, 003, 005, 007 | Backend security controls — no direct UI screen; enforced server-side |
| NFR-SCALE-001..003 | Architecture scalability — no UI surface; infrastructure concern |
| NFR-OBS-001, 002, 003 | Logging and metrics — backend observability; no UI screen |
| NFR-DATA-002..005 | Backup policies — operational; no UI screen |
| REG-001, 003 | Compliance enforcement — backend; no UI screen |
| STK-CAP-001..005 | Capacity engineering — backend; no UI screen |
| STK-ADM-HEALTH-003 | Response time constraint — validated via SCR-ADM-HEALTH-001 performance |
| STK-APP-NOTIF-003 | Delivery latency SLA — no dedicated screen; validated via testing |
| TRUST-008 | Multi-channel delivery — backend concern; visibility in SCR-APP-NOTIF-001 |

All 70+ StRS requirements are accounted for — either bound to a specific screen or identified as backend/infrastructure requirements with no UI surface.

---

## 10.0 DOCUMENT REVISION HISTORY

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-04-13 | System | Initial screen inventory — 45 screens, full backward traceability |
