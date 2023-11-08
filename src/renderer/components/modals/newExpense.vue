<template>
  <div class="modal fade" id="newExpenseModal" tabindex="-1" role="dialog" aria-labelledby="newExpenseModal" aria-hidden="true" data-backdrop="false">
  <div class="modal-dialog modal-dialog-centered" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title">Nuevo gasto</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
        <div class="form-group">
          <label for="name">Nombre</label>
          <input id="name" type="text" class="form-control" placeholder="Nombre" :disabled="waitResponse"
          v-model="name" @keyup.enter="newExpense">
        </div>
        <div class="form-group" >
          <label for="priceInput">Precio</label>
          <input type="text" class="form-control" placeholder="Precio" :disabled="waitResponse"
          v-model="balance" @keyup.enter="newExpense" id="priceInput" maxlength="15" @keypress="validaInputNum($event)">
        </div>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn bg-secundario text-white" data-dismiss="modal">Cerrar</button>
        <button type="button" class="btn bg-primario text-white" :disabled="waitResponse" @click="newExpense">Crear</button>
      </div>
    </div>
  </div>
  </div>
</template>

<script>
import ConfigHelper from '@/helpers/ConfigHelper.js';
import Loader from '@/helpers/Loader';
import FormatNumber from '@/helpers/FormatNumber.js';

export default {
  data(){
    return{
      name: null,
      balance: null,
      waitResponse: false
    }
  },
  methods:{
    async newExpense(){
      let fields = ['name', 'balance'];

      let fd = new FormData();
      for (var field of fields) {
        if (!this[field] || this[field] == ''){
          this.$awn.alert('Debes llenar todos los campos');
          return;
        }

        // if (field == 'price' || field == 'ganancia') {
        //   fd.append(field, this.deFormatNumber(this[field],false));
        // }else{
        // }
        fd.append(field, this[field]);
      }
      this.waitResponse = true;
      Loader.fullPage();
      var request = await this.$store.dispatch("expenses/createExpense",fd);
      Loader.hide();
      this.waitResponse = false;

      if (!request.success) {
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
        return;
      }

      this.$awn.success('Gasto creado exitosamente',{labels:{success:'CORRECTO'}});
      this.$emit('refresh');
      $('#newExpenseModal').modal('hide');
      this.name = null;
      this.balance = null;
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
