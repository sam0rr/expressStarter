const { z } = require('zod');
const { StatusCodes } = require('http-status-codes');
const AppError = require('../errors/AppError');

const createUserSchema = z.object({
    name:  z.string()
        .min(1, 'Name is required')
        .max(50, 'Name must be less than 50 characters'),
    email: z.string()
        .email('Invalid email address')
});

class UserValidator {
    static validateUser(req, res, next) {
        const result = createUserSchema.safeParse(req.body);
        if (!result.success) {
            const details = result.error.flatten().fieldErrors;
            return next(
                new AppError('Validation error', StatusCodes.BAD_REQUEST, details)
            );
        }
        req.body = result.data;
        next();
    }
}

module.exports = UserValidator;
