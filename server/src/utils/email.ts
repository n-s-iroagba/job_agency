import nodemailer from 'nodemailer';
import { CONSTANTS } from '../constants';

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '465', 10),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

console.log(`[EmailUtil] SMTP Transporter Initialized. Host: ${process.env.SMTP_HOST}, Port: ${process.env.SMTP_PORT}, User: ${process.env.SMTP_USER ? '***' : 'NONE'}`);

export const sendEmail = async (to: string, subject: string, html: string): Promise<void> => {
    console.log(`[EmailUtil] Attempting to dispatch email to: ${to} | Subject: ${subject}`);
    try {
        await transporter.sendMail({
            from: process.env.SMTP_FROM || '"Job Agency" <noreply@jobagency.com>',
            to,
            subject,
            html,
        });
        console.log(`[EmailUtil] Successfully dispatched email to: ${to}`);
    } catch (error) {
        console.error(`[EmailUtil] CRITICAL FAILURE sending email to ${to}:`, error);
        throw new Error('Email dispatch failed');
    }
};
