# STAKEHOLDER REQUIREMENTS SPECIFICATION (StRS)

**Document Status:** Draft  
**Version:** 1.0  
**Date:** 2026-04-13  

---

## 1.0 REQUIREMENT METADATA

- **StRS ID:** STAKE-JOBAGENCY-001
- **Title:** Secure Multi-Stage Job Application, Payment & Administration Platform
- **Author:** Product Owner / Business Analyst
- **Stakeholder(s):** CEO, Head of Operations, Compliance Officer, Growth Lead, IT Operations Lead
- **Domain Context:** Job Application, Recruitment Processing, Payment Collection & Verification, Identity & Authentication, Notifications (Email & Push), Admin Operations, CV Management, Cryptocurrency Payments
- **Target Concurrent User Capacity:** 80 simultaneous users (Applicants + Admins)

---

## 2.0 GUARDRAILS & BOUNDARIES

### 2.1 Target Personas

| Persona | Description | Expected Share |
|---------|-------------|----------------|
| **First-time international job applicant** | High scam sensitivity, unfamiliar with agency processes, needs guidance and trust signals at every step | ~90% of 80 concurrent users |
| **Returning applicant** | Has an existing account, managing multiple applications, tracking payment stages | ~5% of 80 concurrent users |
| **Admin / Agency operator** | Manages job listings, processes payments, verifies documents, communicates with applicants | ~5% of 80 concurrent users |

### 2.2 Priority Level

- **MUST HAVE** — All features described herein are essential for launch.

### 2.3 Dependencies

| Dependency | Purpose |
|------------|---------|
| Payment Verification System | Screenshot upload, manual admin verification of fiat payments |
| Cryptocurrency Wallet Infrastructure | Receiving crypto payments via admin-configured wallets |
| Bank Account Management | Two-tier beneficiary system (Open Beneficiary < $4,999; Normal ≥ $5,000) |
| Email Service (SMTP / Transactional) | Applicant notifications, stage transitions, payment confirmations |
| Push Notification Service | Real-time alerts for applicants on stage changes, payment status updates |
| Authentication Provider (Google OAuth 2.0 & Email/Password) | Applicant registration and login |
| Server Health Monitoring | Admin dashboard for server and database health checks |
| File Upload Service | CV document uploads and payment screenshot uploads |

### 2.4 Explicitly OUT OF SCOPE

- Automated job placement guarantee
- AI-based CV rewriting or scoring
- Live chat support (future iteration)
- Blockchain escrow for payments (future)
- Third-party job board aggregation
- Automated payment gateway integration (Stripe, PayPal — payments are manual/screenshot-verified)
- Applicant-to-applicant messaging
- Multi-language / localisation support (future)

---

## 3.0 THE CORE REQUIREMENTS

### 3.1 Admin Domain Requirements

#### 3.1.1 Bank Account Management

- **STK-ADM-BANK-001:** The system shall allow Admin to Create, Read, Update, and Delete bank accounts used for receiving applicant payments.
- **STK-ADM-BANK-002:** Bank accounts shall be classified into two types:
  - **Open Beneficiary** — for receiving payments of amounts less than $4,999.
  - **Normal** — for receiving payments of $5,000 and above.
- **STK-ADM-BANK-003:** The system shall display the appropriate bank account type to the applicant based on the payment amount required at each application stage.
- **STK-ADM-BANK-004:** The system shall validate that at least one bank account of each type exists before any payment-bearing application stage can be activated.

#### 3.1.2 Crypto Wallet Management

- **STK-ADM-CRYPTO-001:** The system shall allow Admin to Create, Read, Update, and Delete cryptocurrency wallet addresses for receiving crypto payments.
- **STK-ADM-CRYPTO-002:** Each crypto wallet entry shall capture: wallet address, cryptocurrency type (e.g., BTC, ETH, USDT), network, and display label.
- **STK-ADM-CRYPTO-003:** Active crypto wallets shall be presented to applicants as an alternative payment method during payment stages.

#### 3.1.3 Job Listing Category / Industry Management

- **STK-ADM-CAT-001:** The system shall allow Admin to Create, Read, Update, and Delete job listing categories and industries.
- **STK-ADM-CAT-002:** Each category shall have a unique name and optional description.
- **STK-ADM-CAT-003:** Categories shall be used to organise and filter job listings on both admin and public-facing views.

#### 3.1.4 Job Listing Management

- **STK-ADM-JOB-001:** The system shall allow Admin to Create, Read, Update, and Delete job listings.
- **STK-ADM-JOB-002:** Each job listing shall be associated with exactly one category/industry.
- **STK-ADM-JOB-003:** Job listings shall include: title, description, location, employment type, requirements, and associated category.
- **STK-ADM-JOB-004:** Job listings shall be displayable on the public homepage job list.
- **STK-ADM-JOB-005:** Admin shall be able to activate or deactivate job listings to control their public visibility.

#### 3.1.5 Job Listing Benefits Management

- **STK-ADM-BEN-001:** The system shall allow Admin to Create, Read, Update, and Delete job listing benefits.
- **STK-ADM-BEN-002:** Benefits shall include types such as: salary per annum, paid time off, health insurance, relocation assistance, and other configurable benefit types.
- **STK-ADM-BEN-003:** Each benefit shall be associable with one or more job listings.
- **STK-ADM-BEN-004:** Benefits shall be displayed on the job detail view for applicants.

#### 3.1.6 Job Listing Conditions Management

- **STK-ADM-COND-001:** The system shall allow Admin to Create, Read, Update, and Delete job listing conditions.
- **STK-ADM-COND-002:** Conditions represent prerequisites, terms, or constraints associated with a job listing (e.g., visa requirements, minimum experience, educational qualifications).
- **STK-ADM-COND-003:** Conditions shall be displayed on the job detail view for applicants.

#### 3.1.7 Application Stage Management

- **STK-ADM-STAGE-001:** The system shall allow Admin to Create, Read, Update, and Delete application stages for each job listing.
- **STK-ADM-STAGE-002:** Each application stage shall indicate whether it requires a payment from the applicant.
- **STK-ADM-STAGE-003:** For payment-bearing stages, the system shall capture: amount, currency, payment instructions, and deadline (if applicable).
- **STK-ADM-STAGE-004:** Each stage shall have an option for Admin to trigger push notification and/or email to the applicant upon stage creation, update, or status change.
- **STK-ADM-STAGE-005:** Stages shall be ordered sequentially so that the applicant's progress is clearly defined.

#### 3.1.8 Application Stage Payment Verification

- **STK-ADM-PAY-001:** The system shall allow Admin to mark an application stage payment as **Paid** or **Unpaid**.
- **STK-ADM-PAY-002:** When marking payment status, Admin shall have the option to send a push notification and/or email to the applicant confirming the change.
- **STK-ADM-PAY-003:** The system shall provide Admin a view of all **unpaid** application stage payments across all applicants.
- **STK-ADM-PAY-004:** The system shall provide Admin a view of all **unverified** application stage payments (payments where a screenshot has been uploaded but not yet confirmed).

#### 3.1.9 Application Views & Communication

- **STK-ADM-APP-001:** The system shall provide Admin a view of **new applications** that have been completed from the applicant's end.
- **STK-ADM-APP-002:** The system shall provide Admin a view of **application drafts** (partial/incomplete applications).
- **STK-ADM-APP-003:** The system shall allow Admin to send mail directly to any applicant from the admin panel.
- **STK-ADM-APP-004:** Admin shall have the option to send mail and/or push notification to the applicant during all appropriate CRUD operations across the platform.

#### 3.1.10 Server & Database Health

- **STK-ADM-HEALTH-001:** The system shall provide Admin a dashboard view showing real-time server health (CPU, memory, uptime).
- **STK-ADM-HEALTH-002:** The system shall provide Admin a dashboard view showing database health (connection pool status, query latency, storage usage).
- **STK-ADM-HEALTH-003:** Health check endpoints shall respond within 500ms under normal operating conditions.

### 3.2 Applicant Domain Requirements

#### 3.2.1 Authentication & Onboarding

- **STK-APP-AUTH-001:** The system shall route unauthenticated visitors to the **Home page** displaying a header introducing the agency and a list of available jobs.
- **STK-APP-AUTH-002:** The system shall route authenticated applicants to the **Dashboard**.
- **STK-APP-AUTH-003:** Clicking "Apply Now" on a job card shall navigate to the login/sign-up page if not authenticated.
- **STK-APP-AUTH-004:** The system shall support applicant registration and login via:
  - Google OAuth 2.0
  - Email and password
- **STK-APP-AUTH-005:** After successful authentication, the system shall redirect the applicant to the job application page for the selected job (or the Dashboard if no specific job was selected).

#### 3.2.2 Dashboard

- **STK-APP-DASH-001:** The applicant dashboard shall display:
  - Pending application stages requiring action
  - Current unpaid payments across all applications
  - Full job listings available for new applications
- **STK-APP-DASH-002:** The dashboard shall support managing multiple concurrent job applications.
- **STK-APP-DASH-003:** The dashboard shall display real-time status updates for all active applications.

#### 3.2.3 Job Application Flow

- **STK-APP-APPLY-001:** The applicant shall be able to view full job details including benefits and conditions before applying.
- **STK-APP-APPLY-002:** The system shall guide the applicant through sequential application stages as defined by Admin.
- **STK-APP-APPLY-003:** The system shall clearly indicate which stages require payment and the amount due.
- **STK-APP-APPLY-004:** The applicant shall be able to create multiple job applications simultaneously.
- **STK-APP-APPLY-005:** The system shall save application progress, allowing applicants to resume from where they left off.

#### 3.2.4 CV Management

- **STK-APP-CV-001:** The system shall allow applicants to Create, Read, Update, and Delete their CV documents.
- **STK-APP-CV-002:** CV uploads shall support common document formats (PDF, DOCX).
- **STK-APP-CV-003:** The system shall enforce a maximum file size of 5MB per CV upload.
- **STK-APP-CV-004:** Applicants shall be able to associate a CV with one or more job applications.

#### 3.2.5 Payment & Payment Proof

- **STK-APP-PAY-001:** When an application stage requires payment, the system shall display the appropriate bank account details (Open Beneficiary or Normal based on amount) and/or crypto wallet addresses.
- **STK-APP-PAY-002:** The applicant shall be able to upload a payment screenshot as proof of payment.
- **STK-APP-PAY-003:** Payment screenshot uploads shall support JPEG, PNG, and PDF formats with a maximum file size of 10MB.
- **STK-APP-PAY-004:** The system shall display the current payment verification status to the applicant (Pending, Verified, Rejected).
- **STK-APP-PAY-005:** The system shall notify the applicant via email and/or push notification when their payment status changes.

#### 3.2.6 Notifications

- **STK-APP-NOTIF-001:** The applicant shall receive email notifications for: stage transitions, payment confirmations, payment rejections, and general admin communications.
- **STK-APP-NOTIF-002:** The applicant shall receive push notifications for: stage transitions, payment confirmations, payment rejections, and urgent updates.
- **STK-APP-NOTIF-003:** Notifications shall be delivered within 30 seconds of the triggering event under normal operating conditions.

---

## 4.0 EMOTION & HUMAN CENTRICITY

### 4.1 Emotional Journey

| Phase | Current Emotion (As-Is) | Target Emotion (To-Be) |
|-------|------------------------|----------------------|
| Discovering the platform | Suspicious, cautious | Curious, intrigued |
| Browsing job listings | Overwhelmed, doubtful | Informed, interested |
| Signing up / logging in | Anxious about data safety | Secure, trusting |
| Applying for a job | Confused about process | Guided, confident |
| Making a payment | Fearful of scam | Assured, transparent |
| Waiting for verification | Anxious, uncertain | Calm, informed |
| Receiving stage updates | Hopeless, forgotten | Hopeful, engaged |
| Completing the process | Doubtful of outcome | Accomplished, valued |

### 4.2 Design Mandates

- **DM-001:** Clear progress tracker — A visual step-by-step indicator showing the applicant exactly where they are in the application process and what stages remain.
- **DM-002:** Verified platform indicators — Trust badges, secure connection indicators, and professional branding throughout the interface.
- **DM-003:** Real-time confirmations — Immediate feedback on every action (form submission, payment upload, stage completion) via on-screen, email, and push notification.
- **DM-004:** Step-by-step flow — No hidden stages. All application stages and their requirements (including payments) are visible upfront before the applicant commits.
- **DM-005:** Payment transparency — Before any payment action, the system shall display: what the payment is for, the exact amount, accepted payment methods, and the verification timeline.
- **DM-006:** Audit trail visibility — Applicants shall have access to a timeline view of all actions taken on their application including timestamps.
- **DM-007:** Progress motivation indicators — Visual and textual cues that celebrate stage completions and encourage continued progress (e.g., "Stage 3 of 5 complete — you're almost there!").
- **DM-008:** Admin legitimacy visibility — The platform shall clearly display agency credentials, contact information, and verification markers that establish legitimacy.

---

## 5.0 BUSINESS CONSTRAINTS & KPIs

### 5.1 Regulatory & Legal

- **REG-001:** Compliance with applicable KYC/AML regulations for payment processing.
- **REG-002:** Data protection compliance (GDPR / applicable local regulations) for all personally identifiable information (PII) — including applicant names, emails, CVs, and payment details.
- **REG-003:** Secure storage and transmission of payment screenshots and financial data.
- **REG-004:** Right to data deletion — applicants shall be able to request account and data deletion.

### 5.2 Operational Volumetrics (80 Concurrent Users)

| Metric | Target | Rationale |
|--------|--------|-----------|
| **Concurrent users** | 80 simultaneous sessions | Peak operating capacity |
| **Applicant sessions** | Up to 72 concurrent | ~90% of user base |
| **Admin sessions** | Up to 8 concurrent | ~10% of user base |
| **Applications per day** | 200–500 | Based on 80-user throughput |
| **Payment transactions per day** | 50–150 | Subset of active applications reaching payment stages |
| **Email notifications per hour** | Up to 200 | Stage transitions, payment confirmations, admin comms |
| **Push notifications per hour** | Up to 200 | Mirroring email notification volume |
| **File uploads per hour** | Up to 50 | CVs and payment screenshots combined |
| **API requests per minute** | Up to 500 | Aggregate across all users and admin operations |

### 5.3 Success Metrics (KPIs)

| KPI | Target | Measurement Method |
|-----|--------|--------------------|
| Payment completion rate | ≥ 80% | Completed payments / Total payment stages initiated |
| Application abandonment rate | ≤ 15% | Abandoned applications / Total applications started |
| Application submission rate | ≥ 70% | Completed applications / Total applications started |
| Average time from start to submission | ≤ 48 hours | Timestamp difference between first stage and completion |
| Payment verification turnaround | ≤ 4 hours | Time from screenshot upload to admin verification |
| Notification delivery rate | ≥ 99% | Successfully delivered / Total dispatched |
| Notification delivery latency | ≤ 30 seconds | Time from trigger event to delivery confirmation |
| System uptime | ≥ 99.5% | Monthly availability measurement |
| User satisfaction (trust) | ≥ 4.0/5.0 | Post-process survey score |

### 5.4 Technical Boundaries

| Constraint | Specification |
|------------|--------------|
| All actions timestamped | Every CRUD operation, payment event, notification, and login/logout shall carry an ISO 8601 UTC timestamp |
| Real-time notifications | Push notifications delivered via WebSocket or SSE; email via transactional provider |
| Session management | JWT-based with refresh tokens; session timeout at 30 minutes of inactivity |
| Password policy | Minimum 8 characters, at least 1 uppercase, 1 lowercase, 1 digit, 1 special character |
| Rate limiting | API rate limiting at 100 requests/minute per authenticated user; 30 requests/minute for unauthenticated endpoints |
| CORS policy | Strict origin whitelist; no wildcard origins in production |
| HTTPS enforcement | TLS 1.2+ required for all connections |
| File upload limits | CV: 5MB max (PDF, DOCX); Payment screenshot: 10MB max (JPEG, PNG, PDF) |

---

## 6.0 CAPACITY PLANNING FOR 80 CONCURRENT USERS

### 6.1 Infrastructure Sizing

| Component | Minimum Specification | Recommended Specification |
|-----------|-----------------------|---------------------------|
| **Application Server (Express 5)** | 2 vCPU, 4GB RAM | 4 vCPU, 8GB RAM |
| **Next.js Frontend Server** | 2 vCPU, 4GB RAM | 4 vCPU, 8GB RAM |
| **Database (PostgreSQL/MongoDB)** | 2 vCPU, 4GB RAM, 50GB SSD | 4 vCPU, 8GB RAM, 100GB SSD |
| **File Storage** | 20GB initial | 50GB with auto-scaling |
| **Redis (Session/Cache)** | 1 vCPU, 1GB RAM | 2 vCPU, 2GB RAM |
| **Load Balancer** | Not required at 80 users | Recommended for failover |

### 6.2 Database Connection Pooling

| Parameter | Value | Rationale |
|-----------|-------|-----------|
| **Minimum pool size** | 10 connections | Baseline for low-traffic periods |
| **Maximum pool size** | 30 connections | Accommodates 80 concurrent users with headroom (not all users hit DB simultaneously) |
| **Connection idle timeout** | 30 seconds | Frees unused connections promptly |
| **Connection acquire timeout** | 10 seconds | Prevents indefinite waiting |
| **Statement timeout** | 30 seconds | Prevents long-running queries from blocking the pool |

### 6.3 API Response Time Requirements

| Endpoint Category | P50 Latency | P95 Latency | P99 Latency |
|-------------------|-------------|-------------|-------------|
| Authentication (login/register) | ≤ 300ms | ≤ 800ms | ≤ 1,500ms |
| Job listing queries (read) | ≤ 150ms | ≤ 400ms | ≤ 800ms |
| CRUD operations (create/update/delete) | ≤ 250ms | ≤ 600ms | ≤ 1,200ms |
| File uploads (CV, payment screenshots) | ≤ 1,000ms | ≤ 3,000ms | ≤ 5,000ms |
| Health check endpoints | ≤ 100ms | ≤ 300ms | ≤ 500ms |
| Dashboard aggregation queries | ≤ 500ms | ≤ 1,200ms | ≤ 2,000ms |
| Notification dispatch (async) | ≤ 200ms API response; delivery ≤ 30s | — | — |

### 6.4 Caching Strategy

| Cache Layer | Technology | Purpose | TTL |
|-------------|-----------|---------|-----|
| **Job listing cache** | Redis | Cache active job listings for homepage | 5 minutes |
| **Category cache** | Redis | Cache job categories/industries | 15 minutes |
| **Session cache** | Redis | JWT session storage and refresh tokens | 30 minutes |
| **Benefits & conditions cache** | Redis | Cache per-job benefits and conditions | 10 minutes |
| **Health check cache** | In-memory | Prevent excessive health check DB queries | 30 seconds |
| **Dashboard aggregation cache** | Redis | Cache applicant dashboard summary data | 2 minutes |

### 6.5 Concurrent Request Handling

- **STK-CAP-001:** The Express 5 server shall be configured with cluster mode (Node.js cluster module) utilising all available CPU cores to handle concurrent requests.
- **STK-CAP-002:** The application shall implement request queuing for file upload endpoints to prevent memory exhaustion under concurrent upload scenarios (max 10 concurrent uploads).
- **STK-CAP-003:** Database queries shall use parameterised prepared statements to maximise connection reuse and minimise query compilation overhead.
- **STK-CAP-004:** WebSocket/SSE connections for push notifications shall be limited to 1 per authenticated session, with automatic reconnection on disconnect.
- **STK-CAP-005:** The system shall implement graceful degradation — if notification services are temporarily unavailable, application processing shall continue, and notifications shall be queued for retry.

### 6.6 Auto-Scaling Thresholds

| Metric | Warning Threshold | Critical Threshold | Action |
|--------|-------------------|-------------------|--------|
| CPU utilisation | 60% sustained for 5 min | 80% sustained for 2 min | Scale horizontally or vertically |
| Memory utilisation | 70% sustained for 5 min | 85% sustained for 2 min | Investigate memory leaks; scale if genuine load |
| DB connection pool usage | 70% of max pool | 90% of max pool | Increase pool size or add read replicas |
| API response time (P95) | > 1 second | > 3 seconds | Investigate bottlenecks; scale resources |
| Error rate (5xx) | > 1% of requests | > 5% of requests | Immediate investigation and remediation |
| Disk usage | 70% capacity | 85% capacity | Expand storage or archive old files |

---

## 7.0 NON-FUNCTIONAL REQUIREMENTS FOR 80 USERS

### 7.1 Performance

- **NFR-PERF-001:** The system shall handle 80 concurrent authenticated sessions without degradation below the response time thresholds defined in Section 6.3.
- **NFR-PERF-002:** The public homepage with job listing shall load in ≤ 2 seconds on a standard 4G connection (including server-side rendering by Next.js).
- **NFR-PERF-003:** The applicant dashboard shall render in ≤ 3 seconds, aggregating all application stages, payments, and job listings.
- **NFR-PERF-004:** Bulk admin views (unpaid payments, unverified payments, new applications, drafts) shall paginate at 20 items per page and load in ≤ 1 second.
- **NFR-PERF-005:** The system shall sustain 500 API requests per minute aggregate without error rate exceeding 0.5%.

### 7.2 Availability & Reliability

- **NFR-AVAIL-001:** The system shall maintain ≥ 99.5% uptime measured monthly.
- **NFR-AVAIL-002:** Planned maintenance shall not exceed 2 hours per month and shall be scheduled during off-peak hours with 24-hour advance notification.
- **NFR-AVAIL-003:** The system shall recover from unplanned outages within 15 minutes (RTO: 15 minutes).
- **NFR-AVAIL-004:** Data loss shall not exceed the last 5 minutes of transactions (RPO: 5 minutes) via continuous database replication.

### 7.3 Security

- **NFR-SEC-001:** All data in transit shall be encrypted via TLS 1.2 or higher.
- **NFR-SEC-002:** All passwords shall be hashed using bcrypt with a minimum work factor of 12.
- **NFR-SEC-003:** JWT tokens shall have a maximum expiry of 15 minutes; refresh tokens shall expire in 7 days.
- **NFR-SEC-004:** Admin endpoints shall be protected by role-based access control (RBAC) — only users with the Admin role shall access admin CRUD operations.
- **NFR-SEC-005:** File uploads shall be scanned for malware/viruses before storage.
- **NFR-SEC-006:** Payment screenshots shall be stored in a private storage bucket with signed URL access only.
- **NFR-SEC-007:** All API endpoints shall validate and sanitise input to prevent SQL injection, XSS, and CSRF attacks.
- **NFR-SEC-008:** Failed login attempts shall be rate-limited: 5 attempts per 15 minutes per IP; account lockout after 10 consecutive failures.
- **NFR-SEC-009:** Admin actions (payment verification, stage changes, user communications) shall generate immutable audit log entries.

### 7.4 Scalability

- **NFR-SCALE-001:** The architecture shall support horizontal scaling from 80 to 500 concurrent users by adding server instances behind a load balancer without application code changes.
- **NFR-SCALE-002:** The database schema shall use proper indexing strategies for all foreign keys, frequently queried fields (status, user ID, job listing ID, payment status), and timestamp fields.
- **NFR-SCALE-003:** File storage shall use cloud object storage (e.g., S3, GCS) with CDN for static assets, enabling unlimited horizontal scaling of storage.

### 7.5 Observability & Monitoring

- **NFR-OBS-001:** Application logs shall follow structured JSON format with fields: timestamp, level, service, traceId, userId, message, metadata.
- **NFR-OBS-002:** All API endpoints shall emit request/response metrics: method, path, status code, duration, user ID.
- **NFR-OBS-003:** Business-critical events shall emit dedicated metrics: application created, stage completed, payment uploaded, payment verified, payment rejected, notification sent.
- **NFR-OBS-004:** Health check endpoints shall expose: server uptime, database connectivity, cache connectivity, notification service connectivity, file storage connectivity.
- **NFR-OBS-005:** Alert rules shall be configured for all critical thresholds in Section 6.6.

### 7.6 Data Integrity & Backup

- **NFR-DATA-001:** All financial records (payments, payment verifications, bank accounts, crypto wallets) shall be treated as immutable — updates create new versioned records; originals are never deleted.
- **NFR-DATA-002:** Full database backups shall be performed daily with 30-day retention.
- **NFR-DATA-003:** Incremental backups shall be performed every 4 hours.
- **NFR-DATA-004:** Backup restoration shall be tested monthly and documented.
- **NFR-DATA-005:** All applicant-uploaded files (CVs, payment screenshots) shall be backed up with the same retention policy as the database.

---

## 8.0 OPERATIONAL SCENARIOS

### Scenario 1: Happy Path — New Applicant Applies and Completes Payment

1. Unauthenticated user visits the homepage.
2. User browses the job list and clicks "Apply Now" on a job card.
3. System redirects to login/sign-up page.
4. User registers via Google OAuth or email/password.
5. System redirects user to the job application page for the selected job.
6. User views job details (benefits, conditions, stages) and confirms application.
7. System creates application in "Draft" status and displays first stage.
8. User completes each stage sequentially.
9. Upon reaching a payment-bearing stage, system displays:
   - Amount due
   - Bank account details (Open Beneficiary or Normal based on amount) and/or crypto wallet addresses
   - Payment instructions
10. User makes external payment and uploads payment screenshot.
11. System confirms upload and marks payment as "Pending Verification."
12. Admin receives notification of new unverified payment.
13. Admin verifies payment and marks as "Paid."
14. Applicant receives email and push notification confirming payment verification.
15. Application advances to next stage.
16. Process repeats until all stages are complete.

### Scenario 2: Expected Failure — Invalid Payment Proof

1. Applicant uploads a payment screenshot.
2. Admin reviews and determines the screenshot is invalid (wrong amount, wrong account, illegible).
3. Admin marks payment as "Unpaid" with an optional note.
4. Admin triggers email and push notification to applicant with rejection reason.
5. Applicant views rejection on dashboard with clear instructions for re-submission.
6. Applicant uploads corrected payment screenshot.
7. Admin re-verifies.

### Scenario 3: Edge Case — High-Value Payment ($5,000+)

1. Application reaches a payment stage with amount ≥ $5,000.
2. System automatically displays **Normal** bank account details (not Open Beneficiary).
3. Enhanced verification messaging is shown to the applicant explaining the higher-value payment process.
4. Admin is flagged with a high-value payment indicator for enhanced scrutiny.

### Scenario 4: Multiple Concurrent Applications

1. Authenticated applicant has 3 active job applications.
2. Dashboard displays all 3 applications with individual progress trackers.
3. Applicant has pending payments on Application 1 and a pending stage on Application 2.
4. Applicant addresses Application 1 payment, then switches to Application 2 stage.
5. System maintains independent state for each application without interference.

### Scenario 5: Admin Bulk Operations Under Load

1. 70 applicants are active concurrently.
2. Admin views "Unpaid Payments" list — paginated, loads within 1 second.
3. Admin verifies 5 payments in succession, each triggering an email and push notification.
4. System queues and dispatches all 10 notifications (5 email + 5 push) without blocking admin operations.
5. All notifications delivered within 30 seconds.

### Scenario 6: Applicant CV Management

1. Applicant navigates to CV management section.
2. Uploads a 3MB PDF CV.
3. System validates file type and size, stores successfully.
4. Applicant later updates CV with a newer version.
5. Old CV version is replaced; new CV is available for all linked applications.

### Scenario 7: Server Health Monitoring

1. Admin navigates to health dashboard.
2. Dashboard displays: server CPU at 45%, memory at 60%, database connections 18/30, uptime 14 days.
3. All indicators are within normal thresholds.
4. Admin confirms system is operating optimally for current 80-user load.

### Scenario 8: Peak Load — 80 Concurrent Users

1. 72 applicants and 8 admins are active simultaneously.
2. 15 applicants are browsing job listings (cached responses, sub-200ms).
3. 20 applicants are completing application stages (CRUD ops, sub-300ms).
4. 10 applicants are uploading payment screenshots (queued, sub-5s each).
5. 5 applicants are managing CVs (file uploads, sub-3s each).
6. 22 applicants are viewing dashboards (aggregation queries, sub-1s).
7. 5 admins are verifying payments and managing listings (CRUD ops, sub-300ms).
8. 3 admins are sending communications (email dispatch, async, sub-200ms API response).
9. System maintains all response time SLAs without error.

### Scenario 9: Notification Service Degradation

1. Email service experiences temporary outage.
2. Admin verifies a payment; system attempts to send notification.
3. Notification dispatch fails; system logs error and queues for retry.
4. Application processing continues uninterrupted.
5. Email service recovers; queued notifications are dispatched within 5 minutes.
6. Applicant receives delayed but accurate notification.

---

## 9.0 TRACEABILITY & TESTING

### 9.1 Traceability Matrix

| StRS Requirement | Passes to Design | Passes to Logic | Passes to Test |
|------------------|-----------------|-----------------|----------------|
| STK-ADM-BANK-001..004 | Bank account management UI, Admin panel | CRUD services, amount-based type selection | Unit tests, integration tests, E2E CRUD flows |
| STK-ADM-CRYPTO-001..003 | Crypto wallet management UI | CRUD services, wallet display logic | Unit tests, integration tests |
| STK-ADM-CAT-001..003 | Category management UI, job filter UI | CRUD services, category association | Unit tests, filter integration tests |
| STK-ADM-JOB-001..005 | Job listing forms, public job cards, job detail view | CRUD services, activation toggle, homepage query | Unit tests, E2E listing lifecycle |
| STK-ADM-BEN-001..004 | Benefits configuration UI, job detail benefits section | CRUD services, job-benefit association | Unit tests, display integration tests |
| STK-ADM-COND-001..003 | Conditions configuration UI, job detail conditions section | CRUD services, job-condition association | Unit tests, display integration tests |
| STK-ADM-STAGE-001..005 | Stage builder UI, applicant stage tracker | CRUD services, payment flag, ordering, notification trigger | Unit tests, stage flow E2E tests |
| STK-ADM-PAY-001..004 | Payment verification UI, unpaid/unverified views | Payment status toggle, filtered queries, notification dispatch | Unit tests, payment flow E2E tests |
| STK-ADM-APP-001..004 | Application list views, mail composer | Filtered queries, mail service integration | Unit tests, E2E admin views |
| STK-ADM-HEALTH-001..003 | Health dashboard UI | Health check services, metric aggregation | Health endpoint tests, load tests |
| STK-APP-AUTH-001..005 | Home page, login page, signup page, redirect logic | Auth service, OAuth integration, session management | Auth flow E2E tests |
| STK-APP-DASH-001..003 | Dashboard layout, widgets | Aggregation queries, real-time updates | Dashboard load tests, E2E tests |
| STK-APP-APPLY-001..005 | Application form, stage tracker, job detail view | Application service, stage progression, draft persistence | Application flow E2E tests |
| STK-APP-CV-001..004 | CV upload UI, CV list | File service, validation, association logic | File upload tests, format validation tests |
| STK-APP-PAY-001..005 | Payment UI, upload UI, status display | Payment service, file service, notification service | Payment flow E2E tests |
| STK-APP-NOTIF-001..003 | Notification UI, email templates, push payloads | Notification service, event triggers, queue/retry | Notification delivery tests, latency tests |

### 9.2 UAT Test Plan

#### Test Suite 1: Applicant Registration & Authentication

1. Register with Google OAuth — verify redirect to dashboard.
2. Register with email/password — verify email validation and redirect.
3. Login with existing credentials — verify dashboard access.
4. Attempt login with wrong password — verify error messaging and rate limiting.
5. Session expiry — verify redirect to login after 30 minutes of inactivity.

#### Test Suite 2: Job Application Flow

1. Browse job listings on homepage (unauthenticated).
2. Click "Apply Now" — verify redirect to login/signup.
3. After authentication, verify redirect to job application page.
4. Complete all non-payment stages — verify progress tracker updates.
5. Reach payment stage — verify correct bank account type displayed based on amount.
6. Upload payment screenshot — verify upload confirmation and "Pending Verification" status.
7. Verify draft saving — partially complete application and return later.

#### Test Suite 3: Payment Verification

1. Admin views unverified payments — verify list accuracy and pagination.
2. Admin marks payment as "Paid" with notification — verify applicant receives email and push.
3. Admin marks payment as "Unpaid" with note — verify applicant sees rejection with instructions.
4. Verify high-value payment ($5,000+) shows Normal bank account only.
5. Verify low-value payment (< $4,999) shows Open Beneficiary bank account.

#### Test Suite 4: Admin CRUD Operations

1. Create, read, update, delete bank account — verify both types.
2. Create, read, update, delete crypto wallet — verify wallet details.
3. Create, read, update, delete job listing category.
4. Create, read, update, delete job listing with category association.
5. Create, read, update, delete job listing benefits and conditions.
6. Create, read, update, delete application stages — verify ordering and payment flag.
7. Send mail to applicant from admin panel — verify delivery.

#### Test Suite 5: CV Management

1. Upload CV (PDF, 3MB) — verify success.
2. Upload CV (DOCX, 4.5MB) — verify success.
3. Attempt upload of unsupported format (TXT) — verify rejection.
4. Attempt upload exceeding 5MB — verify rejection.
5. Update existing CV — verify replacement.
6. Delete CV — verify removal from all linked applications.

#### Test Suite 6: Capacity & Performance (80 Users)

1. Simulate 80 concurrent authenticated sessions — verify no degradation.
2. Execute 500 API requests/minute — verify error rate ≤ 0.5%.
3. Perform 10 concurrent file uploads — verify queuing and completion.
4. Verify dashboard aggregation under full load — response ≤ 3 seconds.
5. Verify homepage job list under full load — response ≤ 2 seconds.
6. Verify notification delivery latency under load — ≤ 30 seconds.
7. Run sustained 30-minute load test — verify no memory leaks or connection pool exhaustion.

#### Test Suite 7: Security Validation

1. Attempt SQL injection on login form — verify sanitisation.
2. Attempt XSS via job application text fields — verify escaping.
3. Access admin endpoints without admin role — verify 403 rejection.
4. Exceed login rate limit — verify account lockout messaging.
5. Verify HTTPS enforcement on all endpoints.
6. Verify JWT expiry and refresh token rotation.

---

## 10.0 ADDITIONAL TRUST REQUIREMENTS

- **TRUST-001:** Payment transparency — All payment requirements shall be clearly explained before the applicant is asked to take any action, including: purpose of payment, exact amount, accepted methods, estimated verification timeline, and refund policy (if applicable).
- **TRUST-002:** Admin legitimacy visibility — The platform shall prominently display agency certifications, registration numbers, office address, contact phone/email, and social media links.
- **TRUST-003:** Real-time feedback — Every user action shall produce immediate visual feedback (loading states, success confirmations, error messages) within 500ms.
- **TRUST-004:** Audit timeline — Each applicant shall have access to a chronological timeline of all events on their application: submission, stage transitions, payment uploads, payment verifications, notifications sent, and admin notes.
- **TRUST-005:** Progress motivation indicators — Visual elements that celebrate applicant progress (e.g., percentage completion bar, congratulatory messaging on stage completion, "X of Y stages complete").
- **TRUST-006:** Data protection assurance — Clear privacy policy link accessible from every page, explaining what data is collected, how it is used, and how it is protected.
- **TRUST-007:** Payment proof acknowledgement — Immediate, visible confirmation that a payment screenshot has been received and is in the verification queue, including an estimated turnaround time.
- **TRUST-008:** Multi-channel communication — All critical communications (payment verification, stage updates, application decisions) shall be delivered via both email AND push notification to minimise the risk of the applicant missing important updates.
- **TRUST-009:** No hidden fees — All costs associated with the job application process shall be disclosed upfront on the job detail page before the applicant begins the application.
- **TRUST-010:** Responsive support information — Prominent display of support email and/or phone number on the dashboard and all payment pages for applicants who need assistance.

---

## 11.0 GLOSSARY

| Term | Definition |
|------|-----------|
| **Open Beneficiary** | A bank account type used for receiving payments less than $4,999, typically with fewer verification requirements |
| **Normal (Bank Account)** | A bank account type used for receiving payments of $5,000 and above, typically requiring enhanced verification |
| **Application Stage** | A discrete step in the job application process, defined by Admin, which may or may not require payment |
| **Payment Screenshot** | A digital image or document uploaded by the applicant as proof of payment |
| **CRUD** | Create, Read, Update, Delete — the four basic data operations |
| **P50 / P95 / P99** | Percentile latency measurements — 50th, 95th, and 99th percentile response times |
| **RTO** | Recovery Time Objective — maximum acceptable downtime after a failure |
| **RPO** | Recovery Point Objective — maximum acceptable data loss measured in time |
| **SSE** | Server-Sent Events — a server push technology for real-time updates |
| **JWT** | JSON Web Token — a compact, URL-safe means of representing claims for authentication |
| **RBAC** | Role-Based Access Control — restricting system access based on user roles |

---

## APPENDIX A: REQUIREMENT CROSS-REFERENCE INDEX

| Requirement ID | Section | Category |
|---------------|---------|----------|
| STK-ADM-BANK-001..004 | 3.1.1 | Admin — Bank Account |
| STK-ADM-CRYPTO-001..003 | 3.1.2 | Admin — Crypto Wallet |
| STK-ADM-CAT-001..003 | 3.1.3 | Admin — Category/Industry |
| STK-ADM-JOB-001..005 | 3.1.4 | Admin — Job Listing |
| STK-ADM-BEN-001..004 | 3.1.5 | Admin — Benefits |
| STK-ADM-COND-001..003 | 3.1.6 | Admin — Conditions |
| STK-ADM-STAGE-001..005 | 3.1.7 | Admin — Application Stage |
| STK-ADM-PAY-001..004 | 3.1.8 | Admin — Payment Verification |
| STK-ADM-APP-001..004 | 3.1.9 | Admin — Application Views |
| STK-ADM-HEALTH-001..003 | 3.1.10 | Admin — Health Monitoring |
| STK-APP-AUTH-001..005 | 3.2.1 | Applicant — Authentication |
| STK-APP-DASH-001..003 | 3.2.2 | Applicant — Dashboard |
| STK-APP-APPLY-001..005 | 3.2.3 | Applicant — Application Flow |
| STK-APP-CV-001..004 | 3.2.4 | Applicant — CV Management |
| STK-APP-PAY-001..005 | 3.2.5 | Applicant — Payment |
| STK-APP-NOTIF-001..003 | 3.2.6 | Applicant — Notifications |
| STK-CAP-001..005 | 6.5 | Capacity — Concurrent Handling |
| NFR-PERF-001..005 | 7.1 | NFR — Performance |
| NFR-AVAIL-001..004 | 7.2 | NFR — Availability |
| NFR-SEC-001..009 | 7.3 | NFR — Security |
| NFR-SCALE-001..003 | 7.4 | NFR — Scalability |
| NFR-OBS-001..005 | 7.5 | NFR — Observability |
| NFR-DATA-001..005 | 7.6 | NFR — Data Integrity |
| DM-001..008 | 4.2 | Design Mandates |
| REG-001..004 | 5.1 | Regulatory |
| TRUST-001..010 | 10.0 | Trust Requirements |
