import Echo from 'laravel-echo';
import BaseUrl from './baseUrl';
import store from '../store/main';
import Connection from './Connection';

let currentSerialApp = '';

export const $pusher = require('pusher-js');
/*if (typeof window === 'undefined' || !window) {
    window = {};
}*/

global.Pusher = $pusher;

export const $echo = new Echo({
    broadcaster: 'pusher',
    key: '56ead46cf7e517e713e3',
    cluster: 'us3',
    forceTLS: true,
    host: (BaseUrl && BaseUrl.getUrl('')) ? BaseUrl.getUrl('') : '',
    authHost: (BaseUrl && BaseUrl.getUrl('')) ? BaseUrl.getUrl('') : '',
    authEndpoint: "api/broadcasting/auth",
    auth: {
      headers: {
        authorization: '',
        "App-Key": '',
        'X-Requested-With': 'XMLHttpRequest'
      },
    },
    authorizer: (channel, options) => {
        return {
            authorize: async (socketId, callback) => {
                const formData = new FormData();
                console.log('PUSHER AUTH HEADERS', options);
                formData.append('socket_id', socketId);
                formData.append('channel_name', channel.name);
                const headersCustom = {
                    //"X-Socket-ID": socketId,
                    "x-socket-id": $echo.socketId(),
                };
                const response = await Connection.request('POST', BaseUrl.getUrl(options.authEndpoint), formData, {
                    ...options.auth.headers,
                    ...headersCustom,
                })
                if (response.success) {
                    console.log('SUCCESSFUL IN PUSHER AUTHORIZATION', response);
                    callback(false, response.data);
                }else{
                    console.log('FAILED IN PUSHER AUTHORIZATION', response);
                    callback(true, error);
                }
            }
        };
    },
    //client: $pusher,
});

global.Echo = $echo;

class EchoHelper {

    static updateEchoUrl() {
        /*const url = BaseUrl.getUrl('api/broadcasting/auth');
        console.log('Estalecida URL de Pusher en:', url);
        $echo.connector.options.authEndpoint = url;
        $echo.connector.pusher.config.authEndpoint  = url;*/
        console.log('[PUSHER] Estalecida URL HOST de PUSHER en:', BaseUrl.getUrl(''));
        $echo.connector.options.authHost = BaseUrl.getUrl('');
        $echo.connector.options.host = BaseUrl.getUrl('');
        console.log('[PUSHER] PUSHER OPTIONS', $echo.connector.options);
        $echo.connector.setOptions($echo.connector.options);
    }

    static fillHeaders(token) {
        console.log('Datos de App establecidos en authorization EN PUSHER', token);
        $echo.connector.options.auth.headers['authorization'] = 'Bearer ' + token;
        EchoHelper.updateEchoUrl();
    }
    
    static desfillHeaders() {
        $echo.connector.options.auth.headers['authorization'] = '';
        EchoHelper.updateEchoUrl();
    }

    static fillAppHeader(token) {
        console.log('Datos de Serial establecidos en App-Key EN PUSHER', token);
        $echo.connector.options.auth.headers['App-Key'] = token;
        currentSerialApp = token;
        EchoHelper.updateEchoUrl();
    }

    static desFillAppHeader() {
        $echo.connector.options.auth.headers['App-Key'] = '';
        currentSerialApp = '';
        EchoHelper.updateEchoUrl();
    }

    /*fillHeaders(token) {
        EchoHelper.fillHeaders(token);
    }
    
    desfillHeaders() {
        EchoHelper.desfillHeaders();
    }

    fillAppHeader(token) {
        EchoHelper.fillAppHeader(token);
    }

    desFillAppHeader() {
        EchoHelper.desfillHeaders();
    }*/

    static private(route) {
        const pusherEnv = store.state.pusherEnv;
        const fullRoute = `${pusherEnv}-app.${currentSerialApp}.${route}`;
        const privateChannel = $echo.private(fullRoute);
        return privateChannel;
    }
}

export default EchoHelper;
