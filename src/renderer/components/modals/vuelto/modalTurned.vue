<template>
  <div class="modal fade modalForce" id="modalTurned" tabindex="-1" role="dialog" aria-labelledby="modalTurned" aria-hidden="false" data-backdrop="false">
    <div class="modal-dialog modal-dialog-centered" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Vuelto al cliente</h5>
        </div>

        <div class="modal-body">
          <div class="w-100">
            <h4 class="text-center mb-2">Seleccione el monto pagado por el cliente</h4>

            <div class="row">
              <div v-for="(item, index) in defaultValues" :key="index" class="">
                {{item.label}}
              </div>
            </div>

            <div v-if="defaultValues.length > 0" class="d-flex row flex-wrap flex-center scrollWaiters">
              <div class="col-md-4 col-6" v-for="(item, index) in defaultValues" :key="index" @click="getTurned">
                <cardBtn v-model="client_pay" :waiter="item" />
              </div>
            </div>

            <div class="form-group w-100 px-1">
              <label for="balance">Otro monto</label>
              <input type="text" class="form-control" placeholder="Total" v-model="client_pay" id="balance" @keyup.enter="getTurned" @keypress="validaInputNum($event)">
            </div>
          </div>
          <div class="w-100">
            <h4 class="text-center">Vuelto del cliente</h4>

            <h1 class="text-center text-primario mt-3 mb-4">${{formatNumber(turned)}}</h1>
          </div>
        </div>

        <div class="modal-footer">
          <!-- Recalcular o salir -->
          <button type="button" class="btn bg-secundario text-white" @click="closeModal">Salir</button>
          

          <!-- Generar vuelto -->
          
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// components
import cardBtn from '@/components/cards/waiterCard.vue';
// Helpers
import ConfigHelper from '@/helpers/ConfigHelper.js';
import FormatNumber from '@/helpers/FormatNumber.js';

export default {
  data(){
    return{
      turned: false,
      client_pay: null,
      defaultValues:[
        {name: '2.000', id: 2000},
        {name: '3.000', id: 3000},
        {name: '5.000', id: 5000},
        {name: '10.000', id: 10000},
        {name: '15.000', id: 15000},
        {name: '20.000', id: 20000},
        {name: '25.000', id: 25000},
        {name: '30.000', id: 30000},
        {name: '50.000', id: 50000}
      ]
    }
  },
  components:{ cardBtn },
  props:['value'],
  computed:{
    sell_total:{
      get(){ return this.$store.getters['main/getSellTotal'] },
      set(val){ this.$store.commit('main/setProperty', {key:'sell_total', data: val})}
    }
  },
  methods:{
    closeModal(){
      $('#modalTurned').modal('hide');
      this.resetFilds();
      this.$emit('focusInput');
    },
    resetFilds(){
      this.turned = false;
      this.client_pay = null;
    },
    getTurned(){
      console.log(parseFloat(this.client_pay));
      console.log(parseFloat(this.sell_total));
      this.turned = parseFloat(this.client_pay) - parseFloat(this.sell_total);
      console.log(this.turned);
    },
    validaInputNum($event){
      var ch = String.fromCharCode($event.which);

      if(!(/[0-9,.]/.test(ch))){
        $event.preventDefault();
      }
      setTimeout(() => {
        this.getTurned()
      },1)
      
    },
    formatNumber(number){
      return FormatNumber.format(number);
    },
  }
}
</script>


<style scoped media="screen">
  .scrollWaiters{
    padding: 0px 40px;
    min-height: 60px;
    max-height: 300px;
    overflow-y: auto;
  }
  @media (max-width: 767px){
    .scrollWaiters{
      padding: 0px 10px;
    }
  }
</style>