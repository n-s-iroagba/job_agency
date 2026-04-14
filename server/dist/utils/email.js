"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const transporter = nodemailer_1.default.createTransport({
    host: process.env.SMTP_HOST || 'smtp.example.com',
    port: parseInt(process.env.SMTP_PORT || '587', 10),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});
const sendEmail = async (to, subject, html) => {
    try {
        await transporter.sendMail({
            from: process.env.SMTP_FROM || '"Job Agency" <noreply@jobagency.com>',
            to,
            subject,
            html,
        });
    }
    catch (error) {
        // In a production environment, this should be logged using the logger utility
        console.error(`Failed to send email to ${to}:`, error);
        // Depending on the strictness of the requirement, we either throw or swallow the error.
        // StRS STK-ADM-APP-004 requires resilient queuing, so throwing helps the service layer retry.
        throw new Error('Email dispatch failed');
    }
};
exports.sendEmail = sendEmail;
