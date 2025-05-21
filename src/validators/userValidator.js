const { z } = require('zod');

const createUserSchema = z.object({
    name: z.string().min(1, 'Name is required').max(50, 'Name must be less than 50 characters'),
    email: z.string().email('Invalid email address'),
});

function validateCreateUser(req, res, next) {
    const result = createUserSchema.safeParse(req.body);

    if (!result.success) {
        return res.status(400).json({
            error: 'Validation error',
            details: result.error.flatten().fieldErrors
        });
    }

    req.body = result.data;
    next();
}

const objectIdPattern = /^[0-9a-fA-F]{24}$/;

const userIdParamSchema = z.object({
    id: z.string().regex(objectIdPattern, 'Invalid MongoDB ObjectId')
});

function validateUserId(req, res, next) {
    const result = userIdParamSchema.safeParse(req.params);

    if (!result.success) {
        return res.status(400).json({
            error: 'Invalid ID parameter',
            details: result.error.flatten().fieldErrors
        });
    }

    req.params = result.data;
    next();
}

module.exports = {
    validateCreateUser,
    validateUserId
};
