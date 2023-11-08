<template>
<div class="modal fade modalForce" id="expired" tabindex="-1" role="dialog" aria-labelledby="expired" aria-hidden="true" data-backdrop="false">
  <div class="modal-dialog modal-dialog-centered" role="document">
    <div class="modal-content">
      <div class="modal-header bg-primario">
        <h6 class="modal-title text-capitalize" v-if="(dataExpired && dataExpired.titleExpired)">{{dataExpired.titleExpired}}</h6>
      </div>
      <div class="modal-body text-justify pb-3 px-md-4 px-2">
        <div class="d-flex flex-center text-center py-3">
          <i class="icon-alert text-primario fas fa-exclamation-triangle" ></i>
        </div>
        <h6 class="text-expired" v-if="(dataExpired && dataExpired.propExpired)">
           {{dataExpired.propExpired}}
        </h6>
        <h6>
          Saludos Cordiales
          <br/>
          Jimmy Arriagada
        </h6>
        <div class="btn-ws mt-2" v-if="(dataExpired && dataExpired.link)" @click="goNavigation()">
          <img class="img-ws" src="../../assets/ws.png" alt="ws">
          Envia un mensaje haciendo click aquí
        </div>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn bg-primario text-white" @click="$emit('refreshApp')">
          Recargar
        </button>
      </div>
    </div>
  </div>
</div>
</template>

<script>
const { shell } = require('electron');
import $ from 'jquery';
import BaseUrl from '@/helpers/baseUrl.js';
export default {
  data(){
    return{
    }
  },
  props:['value'],
  computed:{
    dataExpired:{
      get(){ return this.value },
      set(value){ this.$emit('input', value) }
    }
  },
  methods:{
    goNavigation(){
      shell.openExternal(this.dataExpired.link);
    }
  }
}
</script>


<style scoped>
  .modal-footer{
    border: none;
    padding-top: 0px;
  }
  .icon-alert{
    font-size: 60px;
  }
  .img-ws{
    width: 30px;
    height: 30px;
  }
  .btn-ws{
    color: #01c023;
    font-size: 16px;
    font-weight: bold;
    cursor: pointer;
  }
  .text-expired{
    line-height: 20px;
    margin-bottom: 30px;
  }
</style>
