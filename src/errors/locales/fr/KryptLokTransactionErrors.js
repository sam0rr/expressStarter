module.exports = {
    from: {
        required: 'L’adresse de l’expéditeur est requise.',
        pattern:  'L’adresse de l’expéditeur doit être une chaîne hexadécimale de 64 caractères.'
    },
    to: {
        required: 'L’adresse du destinataire est requise.',
        pattern:  'L’adresse du destinataire doit être une chaîne hexadécimale de 64 caractères.'
    },
    amount: {
        required: 'Le montant est requis.',
        minimum:  'Le montant doit être un nombre positif.'
    },
    previousHash: {
        required: 'Le hash du bloc précédent est requis.',
        pattern:  'Le hash précédent doit être une chaîne hexadécimale de 64 caractères.'
    },
    hash: {
        pattern: 'Le hash calculé doit être une chaîne hexadécimale de 64 caractères.'
    },
    status: {
        enum:    'Le statut doit être “pending”, “confirmed” ou “failed”.'
    }
};
