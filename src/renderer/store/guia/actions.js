import Connection from '../../helpers/Connection.js';
import EchoHelper from '../../helpers/EchoHelper.js';
import BaseUrl from '../../helpers/baseUrl.js';
import store from '../main';


export async function newGuia(context, data) {
    let url = BaseUrl.getUrl('api/local/guia');
    const request = await Connection.request('post', url, data);
    //if(request.success)
      //context.commit('setProperty',{ key:'sellPast' , data: request.data.id });
    return request;
  }