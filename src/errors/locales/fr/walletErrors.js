module.exports = {
    address: {
        required: "L'adresse du portefeuille est requise.",
        pattern: "Format de l'adresse invalide."
    },
    balance: {
        minimum: "Le solde ne peut pas être négatif."
    }
};
