module.exports = {
    email: {
        required: 'L’adresse email est requise.',
        pattern: 'Le format de l’email est invalide.'
    },
    name: {
        required: 'Le nom est requis.',
        maxLength: 'Le nom est trop long.'
    },
    age: {
        required: 'L’âge est requis.',
        minimum: 'L’âge doit être au moins de 1.',
        maximum: 'L’âge doit être au plus de 150.'
    },
    password: {
        required: 'Le mot de passe est requis.',
        minLength: 'Le mot de passe doit contenir au moins 8 caractères.',
        maxLength: 'Le mot de passe doit contenir au maximum 100 caractères.',
        pattern: 'Le mot de passe doit contenir au moins une majuscule, une minuscule et un chiffre.'
    }
};
