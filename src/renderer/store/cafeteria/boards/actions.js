import Connection from '../../../helpers/Connection.js';
import BaseUrl from '../../../helpers/baseUrl.js';

export async function store(context, data) {
  let url = BaseUrl.getUrl('api/local/board');
  const request = await Connection.request('post',url, data);
  return request;
}

export async function update(context, data) {
  let url = BaseUrl.getUrl('api/local/board/' + data.id);
  const request = await Connection.request('put',url, data.data);
  return request;
}

export async function remove(context, id) {
  let url = BaseUrl.getUrl('api/local/board/' + id);
  const request = await Connection.request('delete',url);
  console.log("board data:",request)
  return request;
}

export async function getBoards(context, params) {
  let url = BaseUrl.getUrl('api/local/boards' + params);
  const request = await Connection.request('get',url);
  if(request.success) context.commit('setProperty', { key: 'boards', data: request.data });
  return request;
}

export async function getAllBoards(context) {
  let url = BaseUrl.getUrl('api/local/boards/all');
  const request = await Connection.request('get',url);
  if(request.success) context.commit('setProperty', { key: 'allBoards', data: request.data });
  return request;
}


export async function getBoardsActives(context) {
  let url = BaseUrl.getUrl('api/local/boards/actives');
  const request = await Connection.request('get',url);
  if(request.success) context.commit('setProperty', { key: 'boardsActives', data: request.data });
  return request;
}
