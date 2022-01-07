const Database = require('./helpers/database');
const Comfy = require('comfy.js');

const Untappd = require('./helpers/untapped');

const sayQueue = [];

Database('twitch_users').where({
  }).select('id', 'login', 'token').then((rows) => {
    Comfy.Init(rows[0].login, rows[0].token, rows.map(row => {
      return row.login;
    }), true);
    Comfy.onCommand = ( user, command, message, flags, extra ) => {
      sayQueue.push({
        user,
        command,
        message,
        flags,
        extra
      })
    }
    setInterval(async () => {
      if(sayQueue.length) {
        const { user, command, message, flags, extra } = sayQueue.pop();
        switch(command) {
          case 'beer':
          case 'currentbeer':
            Comfy.Say( await Untappd.currentBeerStatement() );
            break;
          case 'lastbeer':
            Comfy.Say( await Untappd.lastBeerStatement() );
            break;
          default:
            console.log('No command found for ', command);
        }
      }
    }, 2000);
  });
