import nodemailer from 'nodemailer';
import path from 'path';

const createTransporter = (user: string | undefined, pass: string | undefined) => {
    return nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT || '465', 10),
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
            user: user,
            pass: pass,
        },
    });
};

const authTransporter = createTransporter(process.env.SMTP_AUTH_USER, process.env.SMTP_AUTH_PASS);
const infoTransporter = createTransporter(process.env.SMTP_INFO_USER, process.env.SMTP_INFO_PASS);

// Self-Diagnostic: Verify connection on startup
authTransporter.verify((error, success) => {
    if (error) {
        console.error('[EmailUtil] Auth Transporter Connection Error:', error);
    } else {
        console.log('[EmailUtil] Auth Transporter ready to dispatch.');
    }
});

infoTransporter.verify((error, success) => {
    if (error) {
        console.error('[EmailUtil] Info Transporter Connection Error:', error);
    } else {
        console.log('[EmailUtil] Info Transporter ready to dispatch.');
    }
});

console.log(`[EmailUtil] SMTP Decoupled Transporters Initialized.`);

const getStandardEmailTemplate = (subject: string, content: string) => {
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body { font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f4f7fb; margin: 0; padding: 0; -webkit-font-smoothing: antialiased; }
            .container { max-width: 600px; margin: 60px auto; background-color: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 25px 50px -12px rgba(12, 59, 139, 0.15); border: 1px solid #eef2f6; }
            .header { background-color: #0b3486; margin: 0; padding: 0; line-height: 0; font-size: 0; text-align: center; } /* elegant deep blue fallback */
            .header img { display: block; width: 100%; height: auto; max-width: 600px; margin: 0 auto; outline: none; border: none; text-decoration: none; }
            .content { padding: 50px; color: #334155; line-height: 1.7; font-size: 15px; }
            .footer { padding: 35px 50px; text-align: center; color: #94a3b8; font-size: 12px; border-top: 1px solid #f8fafc; background-color: #fcfdfe; line-height: 1.6; }
            h1 { color: #0b3486; font-size: 22px; font-weight: 900; text-transform: uppercase; letter-spacing: 1.5px; margin-top: 0; margin-bottom: 30px; border-bottom: 2px solid #e2e8f0; display: inline-block; padding-bottom: 12px; }
            p { margin-bottom: 24px; color: #475569; font-weight: 500; }
            .cta-block { margin-top: 45px; text-align: center; margin-bottom: 15px; }
            .button { display: inline-block; padding: 18px 40px; background-color: #0b3486; color: #ffffff !important; text-decoration: none; border-radius: 12px; font-weight: 800; font-size: 13px; text-transform: uppercase; letter-spacing: 1.2px; box-shadow: 0 10px 20px -5px rgba(11, 52, 134, 0.35); transition: background-color 0.2s ease; }
            .button:hover { background-color: #08296a; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <img src="${process.env.CLIENT_URL || 'http://localhost:3000'}/email-logo.jpg" alt="JobNexe Curated Career" />
            </div>
            <div class="content">
                <h1>${subject}</h1>
                <div style="font-size: 15px; font-weight: 500;">
                    ${content}
                </div>
            </div>
            <div class="footer">
                &copy; 2026 JobNexe Infrastructure. All rights reserved.<br>
                <span style="font-weight: 800; color: #0b3486; margin-top: 12px; display: block; letter-spacing: 1px;">SECURE RECRUITMENT PIPELINE PROTOCOL</span>
            </div>
        </div>
    </body>
    </html>
    `;
};

export const sendAuthEmail = async (to: string, subject: string, content: string, attachments: any[] = []): Promise<void> => {
    try {
        await authTransporter.sendMail({
            from: process.env.SMTP_AUTH_FROM || '"JobNexe Authentication" <donotreply@jobnexe.com>',
            to,
            subject,
            html: getStandardEmailTemplate(subject, content),
            attachments,
        });
        console.log(`[EmailUtil] Auth email dispatched to: ${to}`);
    } catch (error: any) {
        console.error(`[EmailUtil] Auth email failed to ${to}:`, {
            message: error.message,
            code: error.code,
            command: error.command,
            responseCode: error.responseCode
        });
        throw new Error('Auth email dispatch failed');
    }
};

export const sendInfoEmail = async (to: string, subject: string, content: string, attachments: any[] = []): Promise<void> => {
    try {
        await infoTransporter.sendMail({
            from: process.env.SMTP_INFO_FROM || '"JobNexe Infrastructure" <info@jobnexe.com>',
            to,
            subject,
            html: getStandardEmailTemplate(subject, content),
            attachments,
        });
        console.log(`[EmailUtil] Info email dispatched to: ${to}`);
    } catch (error) {
        console.error(`[EmailUtil] Info email failed:`, error);
        throw new Error('Info email dispatch failed');
    }
};

export const sendEmailFrom = async (fromType: 'auth' | 'info', to: string, subject: string, content: string, attachments: any[] = []): Promise<void> => {
    const transporter = fromType === 'auth' ? authTransporter : infoTransporter;
    const from = fromType === 'auth' 
        ? (process.env.SMTP_AUTH_FROM || '"JobNexe Authentication" <donotreply@jobnexe.com>')
        : (process.env.SMTP_INFO_FROM || '"JobNexe Infrastructure" <info@jobnexe.com>');

    try {
        await transporter.sendMail({
            from,
            to,
            subject,
            html: getStandardEmailTemplate(subject, content),
            attachments,
        });
        console.log(`[EmailUtil] ${fromType} email dispatched to: ${to}`);
    } catch (error: any) {
        console.error(`[EmailUtil] ${fromType} email failed:`, error);
        throw new Error(`${fromType} email dispatch failed`);
    }
};

// Apex Invitation Template
export const sendApexInvitationEmail = async (to: string, userName: string): Promise<void> => {
    const subject = 'Invitation to the JobNexe Apex Network';
    const content = `
        <p>Dear ${userName},</p>
        <p>Based on our initial audit of your professional node and market impact, you have been shortlisted for the <strong>JobNexe Apex Network</strong>.</p>
        <p>Apex is not a job board; it is a high-stakes professional ecosystem restricted to the top 1% of vetted talent. Membership grants you immediate access to:</p>
        <ul style="margin-bottom: 30px;">
            <li><strong>High Priority Placement:</strong> Guaranteed placement within 3 weeks for Apex-exclusive roles commanding higher pay.</li>
            <li><strong>Asymmetric Market Intelligence:</strong> Access to the "Black Box" Dashboard—see the true budget ceiling, team turnover rates, and time-to-hire metrics.</li>
            <li><strong>Shadow Roles:</strong> Access to unlisted, confidential executive and high-level tech positions.</li>
            <li><strong>The Power-Flipped Pipeline:</strong> You don't apply. Vetted employers pitch to you using credits.</li>
            <li><strong>Bypass HR:</strong> Direct introductions to CTOs, VPs of Engineering, and Founders.</li>
            <li><strong>High-Stakes Deal Structuring:</strong> Expert support for equity, performance bonuses, and fractional role negotiations with integrated escrow protection.</li>
        </ul>
        <p>Activation of your Apex status requires a one-time vetting and infrastructure fee of <strong>$503</strong>.</p>
        <div class="cta-block">
            <a href="${process.env.CLIENT_URL || 'http://localhost:3000'}/apex/activate" class="button">Accept Invitation & Activate</a>
        </div>
        <p style="margin-top: 30px; font-size: 13px; color: #64748b;">Do not share this invitation. Membership is non-transferable and subject to continuous performance auditing.</p>
    `;
    await sendAuthEmail(to, subject, content);
};

// Expression of Interest Template
export const sendEOIEmail = async (to: string): Promise<void> => {
    const subject = 'Expression of Interest: JobNexe Apex Audit';
    const content = `
        <p>Thank you for expressing interest in the JobNexe Apex Network.</p>
        <p>To begin your rigorous audit, we require detailed information regarding your career trajectory, technical impact, and professional aspirations.</p>
        <div class="cta-block">
            <a href="${process.env.CLIENT_URL || 'http://localhost:3000'}/expression-of-interest" class="button">Complete Audit Form</a>
        </div>
        <p style="margin-top: 20px;">95% of applicants do not pass the Apex verification. Ensure your data is accurate and verifiable.</p>
    `;
    await sendAuthEmail(to, subject, content);
};

// Backward compatibility or generic usage
export const sendEmail = sendInfoEmail;

