import Connection from '../../helpers/Connection.js';
import BaseUrl from '../../helpers/baseUrl.js';


export async function getRoles(context) {
  let url = BaseUrl.getUrl('api/local/typeUser');
  const request = await Connection.request('get',url);
  context.commit('setProperty', { key: 'roles', data: request.data });
  return request;
}
export async function newRole(context, data) {
  let url = BaseUrl.getUrl('api/local/typeUser');
  const request = await Connection.request('post',url,data);
  return request;
}

export async function editRole(context, data) {
  let url = BaseUrl.getUrl('api/local/typeUser/' + data.id);
  const request = await Connection.request('put', url, data.data);
  return request;
}

export async function deleteRole(context, id) {
  let url = BaseUrl.getUrl('api/local/typeUser/'+id+'/delete');
  const request = await Connection.request('put',url);
  return request;
}
