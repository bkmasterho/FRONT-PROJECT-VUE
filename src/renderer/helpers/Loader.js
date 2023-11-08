import Vue from 'vue';

export default class {

  loader = null;

  static fullPage(){
    this.loader = Vue.$loading.show({
      zIndex: 99999999,
      'lock-scroll': true,
      backgroundColor: 'rgba(0,0,0,.95)',
      color: 'rgb(243, 242, 242)',
    });
  }

  static containe(ref){
    this.loader = Vue.$loading.show({
      zIndex: 99999999,
      backgroundColor: 'rgba(0,0,0,.95)',
      color: 'rgb(243, 242, 242)',
      container: ref
    });
  }

  static dinamic(){
    this.loader = Vue.$loading.show({
      zIndex: 99999999,
      backgroundColor: '#292F36',
      color: 'rgb(243, 242, 242)',
      container: document.getElementById('loaderDinamic'),
      width: 30,
      height: 30,
      opacity: 1,
      transition: 'fade'
    });
  }

  static hide(){
    this.loader.hide();
  }
}
