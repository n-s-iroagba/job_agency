import jwt from 'jsonwebtoken';
import { CONSTANTS } from '../constants';

const JWT_SECRET = process.env.JWT_SECRET || 'secret';

export const generateToken = (payload: object): string => {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: '1d' });
};

export const verifyToken = (token: string): object | string => {
    return jwt.verify(token, JWT_SECRET);
};
