import Connection from '../../helpers/Connection.js';
import BaseUrl from '../../helpers/baseUrl.js';

export async function createExpense(context, data) {
  let url = BaseUrl.getUrl('api/local/expense');
  const request = await Connection.request('post',url,data);
  return request;
}

export async function removeExpense(context, id) {
  let url = BaseUrl.getUrl('api/local/expense/' + id);
  const request = await Connection.request('delete',url);
  return request;
}

export async function getExpenses(context, params) {
  let url = BaseUrl.getUrl('api/local/expenses' + params);
  const request = await Connection.request('get',url);
  return request;
}
