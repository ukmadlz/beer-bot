const Database = require('./helpers/database');
const Comfy = require('comfy.js');

const Untappd = require('./helpers/untapped');

const sayQueue = [];

Database('twitch_users').where({
  }).select('id', 'login', 'token','untappd_user').then((rows) => {
    Comfy.Init(rows[0].login, rows[0].token, rows.map(row => {
      return row.login;
    }), true);
    Comfy.onCommand = async ( user, command, message, flags, extra ) => {
      const untappdUser = await Database('twitch_users').where({
        login: extra.channel,
      }).select('untappd_user');
      sayQueue.push({
        user,
        command,
        message,
        flags,
        extra,
        untappd_user: untappdUser[0].untappd_user,
      })
    }
    setInterval(async () => {
      if(sayQueue.length) {
        const { user, command, message, flags, extra, untappd_user } = sayQueue.pop();
        switch(command) {
          case 'beer':
          case 'currentbeer':
            Comfy.Say( await Untappd.currentBeerStatement(untappd_user) );
            break;
          case 'lastbeer':
            Comfy.Say( await Untappd.lastBeerStatement(untappd_user) );
            break;
          default:
            console.log('No command found for ', command);
        }
      }
    }, 2000);
  });
