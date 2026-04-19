import nodemailer from 'nodemailer';

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
            body { font-family: 'Inter', system-ui, sans-serif; background-color: #f8fafc; margin: 0; padding: 0; }
            .container { max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 24px; overflow: hidden; box-shadow: 0 20px 25px -5px rgba(30, 58, 138, 0.05); border: 1px solid #e2e8f0; }
            .header { background-color: #1e3a8a; padding: 40px; text-align: center; }
            .logo { color: #ffffff; font-size: 24px; font-weight: 900; letter-spacing: 0.1em; text-transform: uppercase; font-style: italic; }
            .content { padding: 40px; color: #1e293b; line-height: 1.6; }
            .footer { padding: 30px; text-align: center; color: #64748b; font-size: 11px; border-top: 1px solid #f1f5f9; background-color: #fcfcfc; }
            h1 { color: #1e3a8a; font-size: 18px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 24px; border-bottom: 2px solid #3b82f6; display: inline-block; padding-bottom: 8px; }
            p { margin-bottom: 20px; }
            .cta-block { margin-top: 30px; text-align: center; }
            .button { display: inline-block; padding: 14px 30px; background-color: #1e3a8a; color: #ffffff !important; text-decoration: none; border-radius: 12px; font-weight: bold; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; box-shadow: 0 10px 15px -3px rgba(30, 58, 138, 0.2); }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <div class="logo">JobNexe</div>
            </div>
            <div class="content">
                <h1>${subject}</h1>
                <div style="font-size: 14px; font-weight: 500;">
                    ${content}
                </div>
            </div>
            <div class="footer">
                &copy; 2026 JobNexe Infrastructure. All rights reserved.<br>
                <span style="font-weight: 700; color: #1e3a8a; margin-top: 10px; display: block;">SECURE RECRUITMENT PIPELINE PROTOCOL</span>
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

// Backward compatibility or generic usage
export const sendEmail = sendInfoEmail;
