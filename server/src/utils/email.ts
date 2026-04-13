import nodemailer from 'nodemailer';
import { CONSTANTS } from '../constants';

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.example.com',
    port: parseInt(process.env.SMTP_PORT || '587', 10),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

export const sendEmail = async (to: string, subject: string, html: string): Promise<void> => {
    try {
        await transporter.sendMail({
            from: process.env.SMTP_FROM || '"Job Agency" <noreply@jobagency.com>',
            to,
            subject,
            html,
        });
    } catch (error) {
        // In a production environment, this should be logged using the logger utility
        console.error(`Failed to send email to ${to}:`, error);
        // Depending on the strictness of the requirement, we either throw or swallow the error.
        // StRS STK-ADM-APP-004 requires resilient queuing, so throwing helps the service layer retry.
        throw new Error('Email dispatch failed');
    }
};
