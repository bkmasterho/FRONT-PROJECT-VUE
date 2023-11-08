<template>
  <div class="modal fade" id="modalWaiters" tabindex="-1" role="dialog" aria-labelledby="modalWaiters" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered" role="document">
    <div class="modal-content">
      <div class="modal-header bg-primario">
        <h5 class="modal-title">{{(waiter != null) ? 'Editar Mesero': 'Nuevo Mesero'}}</h5>
        <button type="button" class="close text-white" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
        <div class="d-flex row flex-wrap">
          <div class="form-group col-12">
            <label for="fullname">Nombre</label>
            <input id="fullname" type="text" class="form-control" placeholder="Nombre Completo" v-model="name" @keyup.enter="sendInfo">
          </div>
          <!-- <div class="form-group col-12">
            <label for="users">Usuario</label>
            <select id="users" class="browser-default custom-select" v-model="user_id">
              <option selected disabled value="">Usuarios</option>
              <option :value="user.id" v-for="user in users" class="text-capitalize">{{user.fullname}}</option>
            </select>
          </div> -->
        </div>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn bg-secundario text-white" data-dismiss="modal">
          Cerrar
        </button>
        <button type="button" class="btn bg-primario text-white" @click="sendInfo">
          {{(waiter != null) ? 'Editar': 'Crear'}}
        </button>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import Loader from '@/helpers/Loader';

export default {
  data(){
    return{
      name: null,
      // user_id: null,
    }
  },
  props:{
    value:{
      type: [Object, Array],
      default: null
    }
  },
  methods:{
    // Actualizar modal
    refreshData(){
      if(this.waiter != null){
        // this.user_id = this.waiter.user_id;
        this.name = this.waiter.name;
      }else{
        // this.user_id = null;
        this.name = null;
      }
    },
    // Guardar o editar mesero
    async sendInfo(){
      let fields = ['name'];
      let data = new FormData();
      for (var field of fields) {
        if (this[field] == null || this[field] == '' || this[field] == ' '){
          this.$awn.alert('Todos los campos son obligatorios');
          return;
        }
        data.append(field, this[field]);
      }

      // Iniciando carga
      Loader.fullPage();
      // Iniciando tipo de peticion
      if (this.waiter != null) var request = await this.$store.dispatch("waiters/update",{id:this.waiter.id,data});
      else var request = await this.$store.dispatch("waiters/store",data);

      Loader.hide();
      if (request.success){
        $('#modalWaiters').modal('hide');
        this.name = null;
        // this.user_id = null;
        if (this.waiter != null) this.$awn.success('Mesero Editado Exitosamente',{labels:{success:'CORRECTO'}});
        else this.$awn.success('Mesero Creado Exitosamente',{labels:{success:'CORRECTO'}});
        this.$emit('refresh', false, true);
      }else{
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
    },
  },
  computed:{
    // v-model
    waiter: {
      get() { return this.value },
      set(value) { this.$emit('input',value) }
    },
    users:{ get(){ return this.$store.getters['main/allUsers'] } },
    waitersModify:{ get(){ return ConfigHelper.HavePermission('gestionar_meseros'); } },
  },
  watch: {
    value: {
      handler(val){
        this.refreshData();
      }
    },
  }
}
</script>
