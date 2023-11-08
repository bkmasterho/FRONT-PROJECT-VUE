import Connection from '../../helpers/Connection.js';
import BaseUrl from '../../helpers/baseUrl.js';

export async function editClient(context, data) {
  let url = BaseUrl.getUrl('api/local/directly-client/'+data.id);
  const request = await Connection.request('put',url,data.data);
  return request;
}

export async function editClients(context, data) {
  let url = BaseUrl.getUrl('api/local/clients/'+data.id);
  const request = await Connection.request('put',url,data.data);
  return request;
}

export async function retrieveClient(context, rut) {
  let url = BaseUrl.getUrl('api/local/retrieve-client/' + rut);
  const request = await Connection.request('get',url);
  return request;
}

export async function getClients(context, data = "",) {
  let url = BaseUrl.getUrl('api/local/clients' + data);
  const request = await Connection.request('get',url);
  return request;
}
