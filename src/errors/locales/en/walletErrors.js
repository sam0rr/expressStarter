module.exports = {
    address: {
        required: 'Wallet address is required.',
        pattern: 'Invalid wallet address format.'
    },
    balance: {
        minimum: 'Balance cannot be negative.'
    }
};
