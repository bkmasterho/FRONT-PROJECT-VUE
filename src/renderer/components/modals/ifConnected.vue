<template>
<div class="modal fade modalForce" id="ifConnected" tabindex="-1" role="dialog" aria-labelledby="ifConnected" aria-hidden="true" data-backdrop="false">
  <div class="modal-dialog modal-dialog-centered" role="document">
    <div class="modal-content">
      <div class="modal-header bg-red">
        <h5 class="modal-title" v-if="">Sin conexión a internet</h5>
      </div>
      <div class="modal-body text-justify pb-3 px-md-4 px-2">
        <div class="d-flex flex-center text-center py-3">
          <i class="icon-alert text-red fas fa-exclamation-triangle" ></i>
        </div>
        <h6 class="text-expired">
           Se registra que no posee conexión a internet o esta presentando caidas momentaneas. Por favor revise su conexion a internet y presione recargar.
        </h6>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn bg-red text-white" @click="refresh">
          Recargar
        </button>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import Loader from '@/helpers/Loader';
export default {
  methods:{
    refresh(){
      if(window.navigator.onLine){
        $('#ifConnected').modal('hide');
        this.$emit('refresh', true);
      }else{
        this.$awn.alert('Verifica tu conexión a internet');
      }
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
