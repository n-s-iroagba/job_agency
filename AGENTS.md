There are two types of Applicants and jobs

1. Normal Applicants and joblistings  
2. Apex Network Applicants and joblistings open to only apex Network Applicants

Also implement the following

1. Apex Network (JobNexe Apex Network) Invitation Mail for a fee of $503  
   With the following clearly listed perks.  
1. High priority placements for Apex Network Jobs  guaranteed within a 3weeks.(Apex Network jobs command higher pay and benefits)  
2. **Asymmetric Market Intelligence**

   Standard users guess what a company is willing to pay. Apex members *know*.

* **The "Black Box" Dashboard:** Provide Apex members with aggressive data sets. Show them the true budget ceiling for a role, the turnover rate of the company's engineering team, and the time-to-hire metrics.  
* **Shadow Roles:** They get access to unlisted, confidential roles. Many high-level tech and executive positions are never posted publicly because companies don't want their competitors (or their current staff) knowing they are upgrading.  
3. **The Power-Flipped Pipeline (Zero Applications)**

   Elite talent does not submit CVs into a void.

* **Inbound Pitching Only:** Apex members cannot "apply" for jobs. Instead, their profiles are visible to a heavily vetted list of employers who must use "Pitch Credits" to request a conversation. The company has to explain to the Apex member why the role is worth their time.  
* **Bypass HR:** Apex candidates bypass standard HR screeners entirely. Their introductions go straight to the technical decision-makers (CTOs, VPs of Engineering, Founders).  
4. **High-Stakes Deal Structuring & Escrow**

   Elite developers and engineers don't just want a salary; they want equity, performance bonuses, or high-value contract terms.

* **Fractional Leverage:** Offer a framework for Apex members to negotiate "fractional" roles (e.g., acting as a Fractional CTO for two different startups).  
* **Integrated Escrow Protocol:** For high-level contractors, Jobnexe Apex handles the financial governance. Offer a secure escrow service where the employer deposits funds based on architectural milestones or project deliverables. This guarantees the Apex member gets paid and protects them from corporate budget freezes.

Implementation Note: Be creative make it exclusive yet realistic and exciting, users invitee applicants should not have a reason not to pay.

2. JobStages requiring payment should also have a fee type i.e refundable, onetime-non refundable, for refundable fees, there should be a refund message and for all the stages fee should have a description of free if  not implemented.  
3. **System Role:** Act as a Lead UI/UX Designer and Product Architect.  
   **Objective:** Design and map out the frontend implementation for a dual-tier job board. The standard tier is for general users, and the "Apex" tier is highly restricted. Your goal is to build an interface that leverages exclusivity, reverse psychology, and FOMO (Fear Of Missing Out) to convert high-value standard users into Apex applicants.  
   **Instructions:** Do not soften the user experience. Implement the following three psychological frameworks exactly as described, ensuring no details, copy, or UI behaviors are omitted.  
1.  **The "Velvet Rope" UI (Visible but Inaccessible)**

   Do not hide the Apex features. Place them directly in front of standard users, but make it structurally clear they are currently locked out.

   **The Ghost Toggle:** \* **UI Element:** On the main job search bar, implement a prominent toggle switch with two options: `[ Standard Search ]` and `[ Apex Search (Locked) ]`.

   1. **Behavior:** If a standard user attempts to click the Apex side, the screen must immediately dim.  
   2. **Modal Copy:** Trigger a pop-up modal that states exactly: *"Access Denied: Apex Network is restricted to the top 1% of vetted talent. By invitation or rigorous audit only."*  
2.  **The Ego-Bait Challenge (Reverse Psychology)**

   Abandon traditional "sign up now" marketing. Treat the user with skepticism to challenge their competence and force self-selection.

1. **The Micro-Commitment Trap:** \* **UI Element:** Next to the standard primary "Upload CV" button, place a secondary, less visually prominent link.  
   1. **Copy:** The link must read either *"Overqualified for these roles?"* or *"Request an Apex Audit."*  
2. **The Warning Label:** \* **UI Element:** Clicking the micro-commitment link must direct the user to a stark, text-heavy landing page devoid of flashy marketing or graphics.  
   1. **Copy:** Present the raw reality with this exact text: *"95% of applicants do not pass the Apex verification. We scrutinize your past impact, not just your resume. Do not proceed if your track record cannot be verified."*  
3.  **Asymmetric Information (Shifting the Power Dynamic)**

   Ensure standard users are constantly reminded of the tangible disadvantages they face compared to Apex members.

1. **The "Skip the Line" Tease:** \* **UI Element:** Modify the post-application confirmation screen for standard users.  
   1. **Copy:** Display the following message: *"Application submitted. You are currently \#42 in the queue. (Apex members bypass this queue and go directly to the hiring manager. \[Learn why\])"*

      **Market Data Teasers:** \* **UI Element:** Add a locked dashboard widget to the user's profile page.

   2. **Copy:** The widget must state: *"You are currently viewing basic market data. Apex members are currently tracking live salary negotiations and hiring manager metrics for this role."*  
4. New Applicant registration and application or application for Apex Network should be directed to the admin notification email stored in the .env file as jobnexe@gmail.com  
5. Admin should be able select the mail they are sending from when trying to mail between auth mail and info mail.  
6. Implement and expression of interest form, users fill form and add roles they want to get hired for, skills they possess( with add/remove skill button), qualifications they have(remov/add buttons) experience(add/ remove), stored in database as Interest  
   Admin can view interests and mail applicant based off expression of interest  
7. Sign up form should collect country of residence and phone number at sign up  
8. Implement an expression of interest email with an expression of interest button that navigates the expression of interest form for that applicant.  
9. Implement an apex nav on the applicant dashboard, for non apex members it should display the message ‘Sorry you can not view this page as this is only for JobNexe Apex Network Member Applicants, you’d be granted access after you’re invited’, for apex members it should show ‘Apex membership application processing’  
10. The bio should have a languages spoken and level spoken field  
11. Send them a welcome mail after email verification and ask them to fill their biodata and cv by following a template, template file shall be attached to the prompt, screen the cv uploads against the template and alert them on any discripancies also send the template in the email  
    

