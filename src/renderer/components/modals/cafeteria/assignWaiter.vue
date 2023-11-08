<template>
<div class="modal fade modalForce" id="modalAssignWaiter" tabindex="-1" role="dialog" aria-labelledby="modalAssignWaiter" aria-hidden="true" data-backdrop="false">
  <div class="modal-dialog modal-dialog-centered modal-lg" role="document">
    <div class="modal-content">
      <div class="modal-header bg-primario">
        <h5 v-if="board" class="modal-title">{{board.name}}</h5>
        <button type="button" class="close text-white" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
        <div v-if="waiters" class="d-flex row flex-wrap flex-center scrollWaiters">
          <div v-if="waiters.length > 0" class="col-md-4 col-sm-6 col-12" v-for="(waiter, index) in waiters" :key="index">
            <waiter-card v-model="waiter_id" :waiter="waiter" />
          </div>
          <div v-if="waiters.length == 0" class="text-center col-12">
            <h4>No existen meseros actualmente</h4>
          </div>
        </div>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn bg-secundario text-white" data-dismiss="modal">
          Cerrar
        </button>
        <button v-if="board" type="button" class="btn bg-primario text-white" @click="sendInfo">
          {{(board.waiter && board.waiter.id) ? 'Cambiar' : 'Asignar' }}
        </button>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import waiterCard from '@/components/cards/waiterCard.vue';
import Loader from '@/helpers/Loader';
import ConfigHelper from '@/helpers/ConfigHelper.js';

export default {
  components:{waiterCard},
  data(){
    return{
      waiter_id: null,
    }
  },
  methods:{
    // Guardar o editar mesero
    async sendInfo(){
      if(this.waiter_id == null || this.waiter_id == '' || this.waiter_id == ' '){
        this.$awn.alert('El mesero es necesario');
        return;
      }
      if(this.board && this.board.waiter && this.board.waiter.id){
        var thing = new FormData();
        thing.append('waiter_id', this.waiter_id);
        Loader.fullPage();
        var request = await this.$store.dispatch("cafeteria/editWaiter", {data: thing, id: this.board.order.id});
        Loader.hide();
        if(!request.success){
          this.$awn.alert(request.data);
          return;
        }
        this.$awn.success("Mesero cambiado con exito",{labels:{success:'CORRECTO'}});
        $('#modalAssignWaiter').modal('hide');
        $('#completeOrder').modal('hide');
        Loader.dinamic();
          if (ConfigHelper.ConfStr('modulos.cafeteria.submodulos.garzon_mode')) {
            await this.$store.dispatch('cafeteria/getAllOrdersActives');
          }else{
            await this.$store.dispatch('boards/getBoardsActives');
          }
          await this.$store.dispatch("cafeteria/getCafeteria");
        Loader.hide();
      }else{
        this.$emit('success', this.board, this.waiter_id);
        this.waiter_id = null;
        $('#modalAssignWaiter').modal('hide');
      }
    },
  },
  computed:{
    board:{ get(){ return this.$store.getters['cafeteria/getBoard'] } },
    waiters:{
      get(){
        var allWaiters = this.$store.getters['waiters/getAllWaiters'];
        var waiters = [];
        if(allWaiters.length > 0 && this.board){
          allWaiters.map((waiter) => {
            if(this.board.waiter == null || (waiter && waiter.id != this.board.waiter.id)){
              waiters.push(waiter);
            }
          });
        }
        return waiters;
      }
    },
  },
}
</script>

<style media="screen">
  .scrollWaiters{
    min-height: 60px;
    max-height: 300px;
    overflow-y: auto;
  }
</style>
