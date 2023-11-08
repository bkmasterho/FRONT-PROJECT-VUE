import store from '../store/main';

export default class BaseUrl {
  static getUrl(route){
    return store.state.apiUrl + '/' + route;
  }
}
