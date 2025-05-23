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
        minimum: 'Age must be at least 1.',
        maximum: 'Age must be at most 150.'
    }
};
