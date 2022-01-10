const DotEnv = require('dotenv');
const Fetch = require('node-fetch');

DotEnv.config();

// https://api.untappd.com/v4/user/checkins/elsmore?client_id={}&client_secret={}&limit=1   

const baseUrl = 'https://api.untappd.com/v4/';

const untapped =  {
    currentBeerStatement: async (user) => {
        const untappedResult = await untapped.untappdFetch('GET', `user/checkins/${user}`);
        const { beer_name, beer_style } = untappedResult.response.checkins.items[0].beer;
        const { brewery_name, country_name } = untappedResult.response.checkins.items[0].brewery;
        return `${user}'s current beer was a ${beer_name} it's a ${beer_style} from ${brewery_name} in ${country_name}`
    },
    lastBeerStatement: async (user) => {
        const untappedResult = await untapped.untappdFetch('GET', `user/checkins/${user}`);
        const { beer_name, beer_style } = untappedResult.response.checkins.items[1].beer;
        const { brewery_name, country_name } = untappedResult.response.checkins.items[1].brewery;
        return `${user}'s last beer was a ${beer_name} it's a ${beer_style} from ${brewery_name} in ${country_name}`
    },
    untappdFetch: async (method, path, body) =>{
        try {
            const response = await Fetch(`${baseUrl}${path}?client_id=${process.env.UNTAPPD_CLIENT_ID}&client_secret=${process.env.UNTAPPD_CLIENT_SECRET}`, {
                method,
                body: body ? JSON.stringify(body) : undefined,
            });
            return await response.json();
        } catch (error) {
            console.error('Error fetching Untappd data');
            console.log(error);
        }
    }
}
module.exports = untapped;