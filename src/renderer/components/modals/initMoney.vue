<template>
  <div style="z-index: 99999999999999999999999999" class="modal fade modalForce" id="initMoney" tabindex="-1" role="dialog" aria-labelledby="initMoney" aria-hidden="true" data-backdrop="false">
    <div class="modal-dialog modal-md modal-dialog-centered" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Dinero inicial de la app</h5>
        </div>
        <div class="modal-body">
          <div class="form-group w-100">
            <label for="rut">Monto</label>
            <input id="money" type="number" class="form-control" v-model="init_money" @keyup.enter="sendInfo" min="0">
          </div>
        </div>
        <div class="modal-footer">
          <!-- <button type="button" class="btn bg-secundario text-white" @click="closeModal">Cerrar</button> -->
          <button type="button" class="btn bg-primario text-white" @click="sendInfo">Guardar</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import $ from 'jquery';
import ConfigHelper from '@/helpers/ConfigHelper.js';
import Loader from '@/helpers/Loader';
export default {
  data(){
    return{
      init_money: 0,
    }
  },
  methods:{
    closeModal(){
      $('#initMoney').modal('hide');
    },
    async sendInfo(){
      if(this.init_money == null && this.init_money == '') return this.$awn.alert('Valor de monto inicial incorrecto');

      let data = new FormData();
      data.append('init_money', this.init_money);

      Loader.fullPage();
      var request = await this.$store.dispatch('main/setInitMoney', data);
      console.log(request.data);
      Loader.hide();

      if (request.success){
        this.$awn.success('Monto inicial establecido exitosamente',{labels:{success:'CORRECTO'}});
      }else{
        let allErrors = request.data;
        if (typeof(allErrors) == 'object') {
          for (var errorkey in allErrors) {
            if (allErrors[errorkey]){
              for (var error of allErrors[errorkey]) {
                return this.$awn.alert(error);
              }
            }
          }
        }else{
          return this.$awn.alert(allErrors);
        }
      }

      $('#initMoney').modal('hide');
    }
  },
  computed:{
  }
}
</script>

<style scoped>
  .modal-md{
    width: 50vw;
  }
  .text-uppercase{
    text-transform: uppercase;
  }
  @media (max-width: 1000px){
    .modal-md{
      width: 80vw;
    }
  }
  @media (max-width: 650px){
    .modal-md{
      width: 100vw;
      margin: 0px !important;
    }
  }
</style>
