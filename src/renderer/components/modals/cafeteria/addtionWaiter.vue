<template>
  <div class="modal fade" id="addtionWaiter" tabindex="-1" role="dialog" aria-labelledby="addtionWaiter" aria-hidden="true" data-backdrop="true">
  <div class="modal-dialog modal-dialog-centered" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title">Agrega una adición</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
        <div class="form-group w-100">
          <label for="name">Descripcion del trabajo (opcional)</label>
          <input id="name" type="text" class="form-control" placeholder="Descripción corta" v-model="name" @keyup.enter="newAddtion">
        </div>
        <div v-if="envs && envs.default_value_addtion" class="form-group w-100">
          <label for="balance">Total ganado</label>
          <input disabled type="text" class="form-control" placeholder="Total" v-model="envs.default_value_addtion.value" id="balance" @keyup.enter="newAddtion" @keypress="validaInputNum($event)">
        </div>
        <div class="form-group w-100">
          <label for="balance">Cantidad de adiciones</label>
          <input type="number" class="form-control" placeholder="Total" v-model="quantity" id="balance" @keyup.enter="newAddtion">
        </div>

        <div class="form-group w-100">
          <label for="category">Meser@</label>
          <select id="category" class="browser-default custom-select" v-model="waiter" >
            <option value="" selected disabled>Escoja un meser@</option>
            <option :value="waiter.id" v-for="waiter in waiters" class="text-capitalize">{{waiter.name}}</option>
          </select>
        </div>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn bg-secundario text-white" data-dismiss="modal">Cerrar</button>
        <button type="button" class="btn bg-primario text-white" @click="newAddtion">Crear adición</button>
      </div>
    </div>
  </div>
  </div>
</template>

<script>
// Helpers
import ConfigHelper from '@/helpers/ConfigHelper.js';
import Loader from '@/helpers/Loader';
import FormatNumber from '@/helpers/FormatNumber.js';
import Print from '@/helpers/Print.js';

export default {
  data(){
    return{
      name: null,
      balance: null,
      waiter: null,
      quantity: 1
    }
  },
  computed:{
    waiters:{ get() { return this.$store.getters['waiters/getAllWaiters']; }},
    envs:{ get(){return this.$store.getters['main/getEnvs']} },
  },
  methods:{
    async newAddtion(){
      this.balance = this.envs.default_value_addtion.value;
      let fields = ['balance','waiter', 'quantity'];
      let fd = new FormData();

      for (var field of fields) {
        if (this[field] == null || this[field] == '') return this.$awn.alert('Debes llenar todos los campos');
        fd.append(field, this[field]);
      }
      fd.append(name, this.name);

      Loader.fullPage();
      var request = await this.$store.dispatch("waiters/newAddtionJob", fd);
      Loader.hide();

      if (request.success) {
        this.$awn.success('Trabajo adicional guardado exitosamente',{labels:{success:'CORRECTO'}});
        this.name =  null;
        this.balance =  null;
        this.waiter =  null;
        $('#addtionWaiter').modal('hide');
        await Print.printBase64(request.data);
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
    },
    validaInputNum($event){
      var ch = String.fromCharCode($event.which);

      if(!(/[0-9,.]/.test(ch))){
        $event.preventDefault();
      }
    },
    formatNumber(number){
      return FormatNumber.format(number);
    },
    deFormatNumber(number,backend = true){
      if (backend) {
        return FormatNumber.deFormatBackend(number);
      }else{
        return FormatNumber.deFormat(number);
      }
    },
  }
}
</script>
