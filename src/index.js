'use strict';

const DotEnv = require('dotenv');
const Hapi = require('@hapi/hapi');
const Bell = require('@hapi/bell');
const Cookie = require('@hapi/cookie');

DotEnv.config();

const init = async () => {

    const server = Hapi.server({
        port: 3000,
        host: 'localhost'
    });

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
    console.log(process.env.TWITCH_CALLBACK);
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
            scope: ["user:read:email"],
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
        // // implementation is broken in @hapi/bell, Client-ID header must be included in each request
        // provider: {
        // name: 'twitch',
        // protocol: 'oauth2',
        // useParamsAuth: true,
        // auth: 'https://id.twitch.tv/oauth2/authorize',
        // token: 'https://id.twitch.tv/oauth2/token',
        // headers: {
        //     'Client-ID': process.env.TWITCH_CLIENT_ID,
        // },
        // scope: ['user:read:email'],
        // scopeSeparator: ' ',
        // async profile(credentials, params, get) {
        //     const profileResponse = await get(
        //     'https://api.twitch.tv/helix/users',
        //     {},
        //     );
        //     console.log(profileResponse);
        //     credentials.profile = profileResponse.data[0];
        // },
        // },
        // password: process.env.TWITCH_COOKIE,
        // clientId: process.env.TWITCH_CLIENT_ID,
        // clientSecret: process.env.TWITCH_CLIENT_SECRET,
        // isSecure: false,
        // location: process.env.TWITCH_CALLBACK,
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
            const user = 'ukmadlz';
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
            try {
            request.cookieAuth.set(request.auth.credentials.profile);
            } catch (error) {
                console.log(error);
                request.cookieAuth.set(request.auth.credentials.profile);
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

    await server.start();
    console.log('Server running on %s', server.info.uri);
};

process.on('unhandledRejection', (err) => {
    console.log(err);
    process.exit(1);
});

init();