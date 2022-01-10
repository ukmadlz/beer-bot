'use strict';

const DotEnv = require('dotenv');
const Hapi = require('@hapi/hapi');

DotEnv.config();

// App includes
const Auth = require('./auth');

const init = async () => {

    const server = Hapi.server({
        port: process.env.POST || 3000,
        host: 'localhost'
    });
    await Auth(server);

    await server.start();
    console.log('Server running on %s', server.info.uri);
};

process.on('unhandledRejection', (err) => {
    console.log(err);
    process.exit(1);
});

init();