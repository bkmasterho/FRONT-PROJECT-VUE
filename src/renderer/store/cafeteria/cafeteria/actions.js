import Connection from '../../../helpers/Connection.js';
import BaseUrl from '../../../helpers/baseUrl.js';

export async function getCafeteria(context) {
  let url = BaseUrl.getUrl('api/local/cafeteria');
  const request = await Connection.request('get',url);
  if(request.success) context.commit('setProperty', { key: 'cafeteria', data: request.data });
  return request;
}

export async function editWaiter(context, data) {
  let url = BaseUrl.getUrl('api/local/change/waiter/' + data.id);
  const request = await Connection.request('put',url, data.data);
  return request;
}

export async function editBoard(context, data) {
  let url = BaseUrl.getUrl('api/local/change/board/' + data.id);
  const request = await Connection.request('put',url, data.data);
  return request;
}

export async function removeProduct(context, data) {
  let url = BaseUrl.getUrl('api/local/remove/product/' + data.id);
  const request = await Connection.request('put',url, data.data);
  return request;
}

export async function getBoard(context, id) {
  let url = BaseUrl.getUrl('api/local/board/' + id);
  const request = await Connection.request('get',url);
  if(request.success) context.commit('setProperty', { key: 'board', data: request.data });
}

export async function printOrderTotal(context, data) {
  let url = BaseUrl.getUrl('api/local/print/order/' + data.id+"?tip="+data.tip+"&discount="+data.discount);
  const request = await Connection.request('get',url);
  return request;
}

export async function printOrderTicket(context, data) {
  let url = BaseUrl.getUrl('api/local/print/order/ticket/' + data.id);
  const request = await Connection.request('get',url);
  return request;
}

export async function getAllOrdersActives(context) {
  console.log('PIDIENDO TODAS LAS ORDENES ACTIVAS')
  let url = BaseUrl.getUrl('api/local/orders/actives');
  const request = await Connection.request('get',url);
  console.log('TODAS LAS ORDENES ACTIVAS:', request.data);
  if(request.success) context.commit('setProperty', { key: 'ordersActives', data: request.data });
  return request;
}
