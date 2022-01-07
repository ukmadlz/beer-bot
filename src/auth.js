const Bell = require('@hapi/bell');
const Cookie = require('@hapi/cookie');
const Database = require('./helpers/database');

module.exports = async (server) => {
    // Register Bell
    await server.register(Bell);
    await server.register(Cookie);
    server.auth.strategy('session', 'cookie', {
        cookie: {
            password: process.env.TWITCH_COOKIE,
            isSecure: false,
        },
        redirectTo: '/login',
        validateFunc: async (request, sesson) => ({ valid: true }),
    });
    server.auth.strategy('twitch', 'bell', {
        // twitch implementation is broken in @hapi/bell, Client-ID header must be included in each request
        provider: {
            name: "twitch",
            protocol: "oauth2",
            useParamsAuth: true,
            auth: "https://id.twitch.tv/oauth2/authorize",
            token: "https://id.twitch.tv/oauth2/token",
            headers: { 
            "Client-ID": process.env.TWITCH_CLIENT_ID,
            },
            scope: [
                "chat:edit",
                "chat:read",
                "channel:read:redemptions",
                "user:read:email"
            ],
            scopeSeparator: " ",
            profile: async function (credentials, params, get) {
            const profileResponse = await get(
                "https://api.twitch.tv/helix/users",
                {}
            );
            credentials.profile = profileResponse.data[0];
            },
        },
        password: process.env.TWITCH_COOKIE,
        clientId: process.env.TWITCH_CLIENT_ID,
        clientSecret: process.env.TWITCH_CLIENT_SECRET,
        isSecure: process.env.NODE_ENV === "production",
    });
    server.auth.default('session');

    // APIs
    server.route({
        method: ['GET', 'POST'], // Must handle both GET and POST
        path: '/login', // The callback endpoint registered with the provider
        options: {
        auth: {
            mode: 'try',
            strategy: 'twitch',
        },
        handler: async (request, h) => {
            if (!request.auth.isAuthenticated) {
                console.error(request.auth.error);
                return `Authentication failed due to: ${request.auth.error.message}`;
            }
            const {
                id,
                login,
                display_name,
                profile_image_url,
            } = request.auth.credentials.profile;
            const { token, refreshToken } = request.auth.credentials;
            try {
                await Database('twitch_users').insert({
                    id,
                    login,
                    display_name,
                    profile_image_url,
                    token,
                    refreshToken
                })
                request.cookieAuth.set(request.auth.credentials.profile);
            } catch (error) {
                console.log(error);
                request.cookieAuth.clear();
            }
            return h.redirect(`/`);
        },
        },
    });
    // Logout
    server.route({
        method: ['GET', 'POST'],
        path: '/logout',
        options: {
        handler: (request, h) => {
            request.cookieAuth.clear();
            return h.redirect('/');
        },
        },
    });
}