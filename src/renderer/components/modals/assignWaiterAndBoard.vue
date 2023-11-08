<template>
  <div class="modal fade modalForce" id="assignWaiterAndBoard" tabindex="-1" role="dialog" aria-labelledby="assignWaiterAndBoard" aria-hidden="true" data-backdrop="false">
  <div class="modal-dialog modal-dialog-centered" role="document">
    <div class="modal-content">
      <div class="modal-header bg-primario">
        <h5 class="modal-title">Nuevo ticket</h5>
        <button type="button" class="close text-white" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
        <div class="d-flex row flex-wrap">
          <div v-if="(waiters && waiters.length > 0)" class="form-group col-12">
            <label for="users">Asigne a un mesero</label>
            <select id="users" class="browser-default custom-select" v-model="waiter_id">
              <option selected disabled value="">Meseros</option>
              <option :value="waiter.id" v-for="(waiter, index) in waiters" :key="index" class="text-capitalize">
                {{waiter.name}}
              </option>
            </select>
          </div>
          <div v-if="(boards && boards.length > 0)" class="form-group col-12">
            <label for="users">Asigne a una mesa</label>
            <select id="users" class="browser-default custom-select" v-model="board_id">
              <option selected disabled value="">Mesas</option>
              <option :value="board.id" v-for="(board, index) in boards" :key="index" class="text-capitalize">
                {{board.name}}
              </option>
            </select>
          </div>
        </div>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn bg-secundario text-white" data-dismiss="modal">
          Cerrar
        </button>
        <button type="button" class="btn bg-primario text-white" @click="sendInfo">
          Crear
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
      waiter_id: null,
      board_id: null
    }
  },
  methods:{
    // Guardar o editar mesero
    async sendInfo(){
      if(this.waiter_id == null || this.waiter_id == '' || this.waiter_id == ' '){
        this.$awn.alert('El mesero es necesario');
        return;
      }
      if(this.board_id == null || this.board_id == '' || this.board_id == ' '){
        this.$awn.alert('La mesa es necesaria');
        return;
      }
      var data = {
        board_id: this.board_id,
        waiter_id: this.waiter_id
      }
      this.$emit('newTicket', true, data);
      this.board_id = null;
      this.waiter_id = null;
      $('#assignWaiterAndBoard').modal('hide');
    },
  },
  computed:{
    boards:{ get(){ return this.$store.getters['cafeteria/getBoardsFree'] } },
    waiters:{ get(){ return this.$store.getters['waiters/getAllWaiters'] } },
  },
}
</script>
