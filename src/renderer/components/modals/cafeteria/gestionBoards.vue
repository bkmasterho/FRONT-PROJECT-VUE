<template>
  <div class="modal fade" id="modalBoards" tabindex="-1" role="dialog" aria-labelledby="modalBoards" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered" role="document">
    <div class="modal-content">
      <div class="modal-header bg-primario">
        <h5 class="modal-title">{{(board != null) ? 'Editar Mesa': 'Nuevo Mesa'}}</h5>
        <button type="button" class="close text-white" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
        <div class="d-flex row flex-wrap">
          <div class="form-group col-12">
            <label for="fullname">Nombre de la mesa</label>
            <input id="fullname" type="text" class="form-control" placeholder="Nombre Completo" v-model="name" @keyup.enter="sendInfo">
          </div>
          <div class="form-group col-12" v-if="boardsChangeColor">
            <label for="users">Estilo de mesa</label>
            <select id="users" class="browser-default custom-select" v-model="color">
              <option selected disabled value="">Estilo de mesa</option>
              <option :value="option.value" v-for="option in optionsColor" v-bind:key="option.value + 'key'" 
                      class="text-capitalize"
              >
                {{ option.label }}
              </option>
            </select>
          </div>
          <!-- <div class="form-group col-12">
            <label for="users">Usuario</label>
            <select id="users" class="browser-default custom-select" v-model="user_id">
              <option selected disabled value="">Usuarios</option>
              <option :value="user.id" v-for="user in users.items" class="text-capitalize">{{user.fullname}}</option>
            </select>
          </div> -->
        </div>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn bg-secundario text-white" data-dismiss="modal">
          Cerrar
        </button>
        <button type="button" class="btn bg-primario text-white" @click="sendInfo">
          {{(board != null) ? 'Editar': 'Crear'}}
        </button>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import Loader from '@/helpers/Loader';
import ConfigHelper from '@/helpers/ConfigHelper.js';

export default {
  data(){
    return{
      name: null,
      color: null,
      optionsColor: [
        { value: null, label: 'Default' },
        { value: 'verde', label: 'Verde' },
        { value: 'piel', label: 'Piel' }
      ],
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
      if(this.board != null){
        this.name = this.board.name;
        if (this.boardsChangeColor)
          this.color = this.board.color;
      }else{
        this.name = null;
        if (this.boardsChangeColor)
          this.color = null;
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

      if (this.boardsChangeColor) data.append('color', this.color);

      // Iniciando carga
      Loader.fullPage();
      // Iniciando tipo de peticion
      if (this.board != null) var request = await this.$store.dispatch("boards/update",{id:this.board.id,data});
      else var request = await this.$store.dispatch("boards/store",data);

      Loader.hide();
      if (request.success){
        $('#modalBoards').modal('hide');
        this.user = null;
        this.name = null;
        if (this.board != null) this.$awn.success('Mesa Editada Exitosamente',{labels:{success:'CORRECTO'}});
        else this.$awn.success('Mesa Creada Exitosamente',{labels:{success:'CORRECTO'}});
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
    board: {
      get() { return this.value },
      set(value) { this.$emit('input',value) }
    },
    boardsModify: { get(){ return ConfigHelper.HavePermission('gestionar_mesas'); } },
    boardsChangeColor: { get(){ return ConfigHelper.ConfStr('modulos.cafeteria.ajustes.change_board_color'); } },
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
