const normalizeEmail = (email) => {
    if (!email) return '';
    return email.toLowerCase().trim();
};

export { normalizeEmail };
