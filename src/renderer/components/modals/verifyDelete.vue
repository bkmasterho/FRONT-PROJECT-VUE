<template>
  <div class="modal fade" id="verifyDelete" tabindex="-1" role="dialog" aria-labelledby="verifyDelete" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered" role="document">
      <div class="modal-content">
        <div class="modal-header bg-primario">
          <h5 class="modal-title text-capitalize">
            <i class="text-white fas fa-exclamation-triangle"></i>
            <span v-if="propVerify" class="pl-1 pt-1">{{propVerify.title}}</span>
          </h5>
        </div>
        <div class="modal-body px-0 pt-2">
          <h5 v-if="propVerify" class="px-3 py-4">
            {{propVerify.text}}
          </h5>
          <div class="text-right px-3">
            <button type="button" class="btn bg-secundario text-white" data-dismiss="modal">Cerrar</button>
            <button type="button" class="btn bg-primario text-white" @click="removeData">Confirmar</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Loader from '@/helpers/Loader';

export default {
  props:[
    'propVerify',
  ],
  methods:{
    async removeData(){
      $('#verifyDelete').modal('hide');
      // Inicializando
      Loader.dinamic();
      // Iniciando peticion
      var request = await this.$store.dispatch(this.propVerify.store, this.propVerify.params);
      Loader.hide();
      // Validando respuesta
      if(request.success){
        this.$awn.success(this.propVerify.success,{labels:{success:'CORRECTO'}});
        this.$emit('refreshData', request.data, true);
      }else{
        if(request.data.id){
          this.$awn.success(this.propVerify.success,{labels:{success:'CORRECTO'}});
          this.$emit('refreshData', request.data, true);
        }
        console.log(request.data);
        let allErrors = request.data;
        if (typeof(allErrors) == 'object') {
          for (var errorkey in allErrors) {
            if (allErrors[errorkey]){
              for (var error of allErrors[errorkey]) {
                this.$awn.alert(error);
              }
            }
          }
        }else{
          this.$awn.alert(allErrors);
        }
      }
    }
  },
}
</script>

<style scoped>
  .modal-md{
    width: 40vw !important;
  }
  @media (max-width: 1000px){
    .modal-md{
      width: 60vw !important;
    }
  }
  @media (max-width: 650px){
    .modal-md{
      width: 100vw !important;
      margin: 0px !important;
    }
  }
</style>
