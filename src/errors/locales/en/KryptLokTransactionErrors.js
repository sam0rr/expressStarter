module.exports = {
    from: {
        required:     'Sender address is required.',
        pattern:      'Sender address must be a 40-hex string.'
    },
    to: {
        required:     'Recipient address is required.',
        pattern:      'Recipient address must be a 40-hex string.'
    },
    amount: {
        required:     'Amount is required.',
        minimum:      'Amount must be a positive number.'
    },
    previousHash: {
        required:     'Previous block hash is required.',
        pattern:      'Previous hash must be a 64-hex string.'
    },
    hash: {
        pattern:      'Computed hash must be a 64-hex string.'
    },
    status: {
        enum:         'Status must be one of success or failed.'
    }
};
