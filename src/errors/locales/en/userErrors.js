module.exports = {
    email: {
        required: 'Email is required.',
        pattern: 'Invalid email format.'
    },
    name: {
        required: 'Name is required.',
        maxLength: 'Name is too long.'
    },
    age: {
        required: 'Age is required.',
        minimum: 'Age must be at least 1.',
        maximum: 'Age must be at most 150.'
    },
    password: {
        required: 'Password is required.',
        minLength: 'Password must be at least 8 characters.',
        maxLength: 'Password must be at most 100 characters.',
        pattern: 'Password must include at least one uppercase letter, one lowercase letter, and one number.'
    }
};
