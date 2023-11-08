<template>
  <div class="modal fade" id="categoriesCrudModal" tabindex="-1" role="dialog" aria-labelledby="categoriesCrudModal" aria-hidden="true" data-backdrop="false">
  <div class="modal-dialog modal-dialog-centered" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title">Categorias</h5>
        <button @click="closeModal" :disabled="waitResponse" type="button" class="close" aria-label="Close">
          <span >&times;</span>
        </button>
      </div>
      <div class="modal-body">
        <div class="d-flex flex-column px-2 mb-2">
          <h6 class="font-weight-bold">Añadir Categoria</h6>
          <div class="form-group my-1">
            <input type="text" class="form-control" placeholder="Nombre" :disabled="waitResponse" v-model="name" @keyup.enter="newCategory">
          </div>
        </div>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn bg-secundario text-white" @click="closeModal" :disabled="waitResponse">Cerrar</button>
        <button type="button" class="btn bg-primario px-2 align-self-end" :disabled="waitResponse" @click="newCategory">Añadir</button>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import Loader from '@/helpers/Loader';
import $ from 'jquery';
export default {
  data(){
    return{
      waitResponse:false,
      name:'',
    }
  },
  mounted(){
  },
  methods:{
    closeModal(){
      $('#categoriesCrudModal').modal('hide');
    },
    async newCategory(){
      let fields = ['name'];
      let fd = new FormData();
      for (var field of fields) {
        if (!this[field] || this[field] == ' '){
          this.$awn.alert('Debes llenar todos los campos');
          return;
        }
        fd.append(field, this[field]);
      }
      this.waitResponse = true;
      Loader.fullPage();
      var request = await this.$store.dispatch("products/newCategory",fd);
      console.log(request);
      if (request.success) {
        this.$awn.success('Categoria Creada Exitosamente',{labels:{success:'CORRECTO'}});
        for (var field of fields){
          this[field] = '';
        }
        $('#categoriesCrudModal').modal('hide');
        this.$emit('refresh');
      }else {
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
      this.waitResponse = false;
      Loader.hide();
    }
  },
}
</script>
