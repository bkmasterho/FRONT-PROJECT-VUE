import Connection from '../../../helpers/Connection.js';
import BaseUrl from '../../../helpers/baseUrl.js';

export async function getPendingOrders(_context) {
  const url = BaseUrl.getUrl('api/local/cafeteria/modo_cocina/orders_kitchens');
  return await Connection.request('get', url);
}

export async function markAsState(_context, payload = {}) { // { id, kitchenState }
  const url = BaseUrl.getUrl('api/local/cafeteria/modo_cocina/orders_kitchens/'+ payload.id);
  const formData = new FormData();
  formData.append('kitchenState', payload.kitchenState);
  return await Connection.request('post', url, formData); // 'complete' | 'process' | 'pending'
}
