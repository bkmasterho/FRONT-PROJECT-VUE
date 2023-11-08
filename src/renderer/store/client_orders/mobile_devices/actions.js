import Connection from '../../../helpers/Connection.js';
import BaseUrl from '../../../helpers/baseUrl.js';

export async function store(context, payload) {
  const url = BaseUrl.getUrl('api/local/client-orders/mobile-devices');
  return await Connection.request('post', url, payload);
}

export async function update(context, payload) {
  const url = BaseUrl.getUrl('api/local/client-orders/mobile-devices/' + payload.id);
  return await Connection.request('put', url, payload.payload);
}

export async function find(context, payload) {
  const url = BaseUrl.getUrl('api/local/client-orders/mobile-devices/' + payload.id);
  return await Connection.request('get', url);
}

export async function print(context, payload) {
  const url = BaseUrl.getUrl('api/local/client-orders/mobile-devices/print/' + payload.id);
  return await Connection.request('get', url);
}

export async function paginate(context, payload = "") {
  const url = BaseUrl.getUrl('api/local/client-orders/mobile-devices/paginate' + payload);
  return await Connection.request('get', url);
}

export async function fetchDevice(context, imei = "") {
  const url = BaseUrl.getUrl('api/local/client-orders/mobile-devices/fetch-device/' + imei);
  console.log('URL', url);
  return await Connection.request('get', url);
}
