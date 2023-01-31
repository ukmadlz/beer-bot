import Fetch from 'node-fetch';

interface UntappdConfig {
    clientId?: string;
    clientSecret?: string;
    baseUrl?: string;
}

export default class Untappd {
    private clientId: string;
    private clientSecret: string;
    private baseUrl: string;

    constructor(config: UntappdConfig) {
        this.clientId = config.clientId || String(process.env.UNTAPPD_CLIENT_ID);
        this.clientSecret = config.clientSecret || String(process.env.UNTAPPD_CLIENT_SECRET);
        this.baseUrl = config.baseUrl || 'https://api.untappd.com/v4/';
    }

    private async fetch(method: string, path: string, body?: Object) {
        try {
            const response = await Fetch(`${this.baseUrl}${path}?client_id=${this.clientId}&client_secret=${this.clientSecret}`, {
                method,
                body: body ? JSON.stringify(body) : undefined,
            });
            return await response.json();
        } catch (error) {
            console.error('Error fetching Untappd data');
            console.log(error);
            throw error
        }
    }
    async currentBeerStatement (user: string) {
        const untappedResult: any = await this.fetch('GET', `user/checkins/${user}`);
        return untappedResult.response.checkins.items[0];
        // return `${user}'s current beer was a ${beer_name} it's a ${beer_style} from ${brewery_name} in ${country_name}`
    }
    async lastBeerStatement(user: string) {
        const untappedResult: any = await this.fetch('GET', `user/checkins/${user}`);
        return  untappedResult.response.checkins.items[1];
        // return `${user}'s last beer was a ${beer_name} it's a ${beer_style} from ${brewery_name} in ${country_name}`
    }
}