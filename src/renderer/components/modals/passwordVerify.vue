<template>
  <div class="modal fade modalForce" id="passwordVerify" tabindex="-1" role="dialog" aria-labelledby="passwordVerify" aria-hidden="true" data-backdrop="false">
  <div class="modal-dialog modal-dialog-centered" role="document">
    <div v-if="dataPassword" class="modal-content">
      <div class="modal-header bg-primario">
        <h5 class="modal-title">{{dataPassword.title}}</h5>
        <button type="button" class="close text-white" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
        <div class="d-flex row flex-wrap">
          <div v-if="dataPassword.input" class="form-group col-12">
            <label :for="dataPassword.input.id">{{dataPassword.input.label}}</label>
            <input :id="dataPassword.input.id" :type="dataPassword.input.type" class="form-control" :placeholder="dataPassword.input.label" v-model="dataPassword.input.v_model" @keyup.enter="sendInfo">
          </div>
          <div v-else class="form-group col-12">
            <label for="password">Contraseña</label>
            <input id="password" type="password" class="form-control" placeholder="Contraseña" v-model="input_data" @keyup.enter="sendInfo">
          </div>
        </div>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn bg-secundario text-white" data-dismiss="modal">
          Cerrar
        </button>
        <button type="button" class="btn bg-primario text-white" @click="sendInfo">
          Confirmar
        </button>
      </div>
    </div>
  </div>
</div>
</template>

<script>
export default {
  data(){
    return{
      input_data: null,
    }
  },
  props:['value'],
  computed:{
    dataPassword:{
      get(){ return this.value; },
      set(value){ this.$emit('input', value) }
    }
  },
  methods:{
    sendInfo(){
      if(this.dataPassword.input){
        if(this.dataPassword.input.v_model != this.dataPassword.verify){
          this.$awn.alert(this.dataPassword.message);
          return;
        }
        this.dataPassword.input.v_model = null;
      }else{
        if(this.input_data != this.dataPassword.verify){
          this.$awn.alert(this.dataPassword.message);
          return;
        }
        this.input_data = null;
      }
      this.$emit('success', true, true);
      $('#passwordVerify').modal('hide');
    },
  },
}
</script>
