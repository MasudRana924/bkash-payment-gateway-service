const axios = require('axios');
const globals = require('node-global-storage');

const bkashAuthMiddleware = async (req, res, next) => {
    globals.unset('id_token');

    try {
        const { data } = await axios.post(process.env.BKASH_GRANT_TOKEN_URL, {
            app_key: process.env.BKASH_API_KEY,
            app_secret: process.env.BKASH_SECRET_KEY,
        }, {
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                username: process.env.BKASH_USERNAME,
                password: process.env.BKASH_PASSWORD,
            },
        });

        globals.set('id_token', data.id_token, { protected: true });

        next();
    } catch (error) {
        return res.status(401).json({ error: error.message });
    }
};

module.exports = {
    bkashAuthMiddleware
};