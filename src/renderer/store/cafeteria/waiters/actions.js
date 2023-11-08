import Connection from '../../../helpers/Connection.js';
import BaseUrl from '../../../helpers/baseUrl.js';

export async function store(context, data) {
  let url = BaseUrl.getUrl('api/local/waiter');
  const request = await Connection.request('post',url, data);
  return request;
}

export async function update(context, data) {
  let url = BaseUrl.getUrl('api/local/waiter/' + data.id);
  const request = await Connection.request('put',url, data.data);
  return request;
}

export async function remove(context, id) {
  let url = BaseUrl.getUrl('api/local/waiter/' + id);
  const request = await Connection.request('delete',url);
  return request;
}

export async function newAddtionJob(context, data) {
  let url = BaseUrl.getUrl('api/local/addtion/waiter');
  const request = await Connection.request('post',url,data);
  return request;
}

export async function getWaiters(context, params) {
  let url = BaseUrl.getUrl('api/local/waiters' + params);
  const request = await Connection.request('get',url);
  if(request.success) context.commit('setProperty', { key: 'waiters', data: request.data });
  return request;
}

export async function getAllWaiters(context) {
  let url = BaseUrl.getUrl('api/local/all/waiters');
  const request = await Connection.request('get',url);
  if(request.success) context.commit('setProperty', { key: 'allWaiters', data: request.data });
  return request;
}
