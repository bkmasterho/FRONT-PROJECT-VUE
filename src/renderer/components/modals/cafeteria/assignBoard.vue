<template>
<div class="modal fade modalForce" id="modalAssignBoard" tabindex="-1" role="dialog" aria-labelledby="modalAssignBoard" aria-hidden="true" data-backdrop="false">
  <div class="modal-dialog modal-dialog-centered" role="document">
    <div class="modal-content">
      <div class="modal-header bg-primario">
        <h5 class="modal-title">Cambiando de mesa</h5>
        <button type="button" class="close text-white" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
        <div v-if="boards" class="d-flex row flex-wrap flex-center scrollWaiters">
          <div v-if="boards.length > 0" class="col-md-4 col-sm-6 col-12" v-for="(board, index) in boards" :key="index">
            <waiter-card v-model="board_id" :waiter="board" />
          </div>
          <div v-if="boards.length == 0" class="text-center col-12">
            <h4>No existen mesas actualmente</h4>
          </div>
        </div>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn bg-secundario text-white" data-dismiss="modal">
          Cerrar
        </button>
        <button type="button" class="btn bg-primario text-white" @click="sendInfo">
          Cambiar
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
      board_id: null,
    }
  },
  methods:{
    // Guardar o editar mesero
    async sendInfo(){
      if(this.board_id == null || this.board_id == '' || this.board_id == ' '){
        this.$awn.alert('Seleccione una mesa valida');
        return;
      }
      var thing = new FormData();
      thing.append('board_id', this.board_id);

      Loader.fullPage();
      var request = await this.$store.dispatch("cafeteria/editBoard", {data: thing, id: this.board.order.id});
      Loader.hide();
      if(!request.success){
        this.$awn.alert(request.data);
        return;
      }
      this.$awn.success("Mesa cambiada con exito",{labels:{success:'CORRECTO'}});
      $('#modalAssignBoard').modal('hide');
      $('#completeOrder').modal('hide');
      Loader.dinamic();
        if (ConfigHelper.ConfStr('modulos.cafeteria.submodulos.garzon_mode')) {
          await this.$store.dispatch('cafeteria/getAllOrdersActives');
        }else{
          await this.$store.dispatch('boards/getBoardsActives');
        }
        await this.$store.dispatch("cafeteria/getCafeteria");
      Loader.hide();
    },
  },
  computed:{
    board:{ get(){ return this.$store.getters['cafeteria/getBoard'] } },
    boards:{
      get(){
        var allBoards = this.$store.getters['boards/getAllBoards'];
        var boards = [];
        if(allBoards && allBoards.length > 0 && this.board){
          allBoards.map((board) => {
            if(board.id != this.board.id){
              boards.push(board);
            }
          });
        }
        return boards;
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
