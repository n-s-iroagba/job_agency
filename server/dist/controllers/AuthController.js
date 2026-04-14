"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authController = exports.AuthController = void 0;
const AuthService_1 = require("../services/AuthService");
const constants_1 = require("../constants");
class AuthController {
    async register(req, res) {
        try {
            const { user, token } = await AuthService_1.authService.register(req.body);
            res.status(constants_1.CONSTANTS.HTTP_STATUS.CREATED).json({
                message: constants_1.CONSTANTS.SUCCESS_MESSAGES.REGISTER_SUCCESS,
                user: { id: user.id, email: user.email, role: user.role },
                token
            });
        }
        catch (error) {
            if (error.message === 'User already exists') {
                res.status(constants_1.CONSTANTS.HTTP_STATUS.BAD_REQUEST).json({ error: error.message });
                return;
            }
            res.status(constants_1.CONSTANTS.HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ error: constants_1.CONSTANTS.ERROR_MESSAGES.INTERNAL_ERROR });
        }
    }
    async login(req, res) {
        try {
            const { email, password } = req.body;
            const { user, token } = await AuthService_1.authService.login(email, password);
            res.status(constants_1.CONSTANTS.HTTP_STATUS.OK).json({
                message: constants_1.CONSTANTS.SUCCESS_MESSAGES.LOGIN_SUCCESS,
                user: { id: user.id, email: user.email, role: user.role },
                token
            });
        }
        catch (error) {
            if (error.message === constants_1.CONSTANTS.ERROR_MESSAGES.INVALID_CREDENTIALS) {
                res.status(constants_1.CONSTANTS.HTTP_STATUS.UNAUTHORIZED).json({ error: error.message });
                return;
            }
            res.status(constants_1.CONSTANTS.HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ error: constants_1.CONSTANTS.ERROR_MESSAGES.INTERNAL_ERROR });
        }
    }
}
exports.AuthController = AuthController;
exports.authController = new AuthController();
