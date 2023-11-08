<template>
  <div class="panel_father">
    <div class="panel_title bg-primario">
      Ordenes activas
    </div>
    <template v-if="isGarzonModeEnabled">
      <!-- Ordenes activas -->
      <div v-if="(allOrdersActives && allOrdersActives.length > 0)" class="p-0" style="margin-top:46px;">
        <div @click="openOrderActive(item)" :class="['panel_items', (!item.board) ? 'no_hover' : '']" v-for="(item, index) in allOrdersActives" :key="index">
          <div>
            <span>#{{ item.id }}</span>
            <template v-if="!item.board">
              <br />
              <span style="cursor:default!important;user-select: all!important;">
                {{ item.barcode }}
              </span>
              <br />
            </template>
            <span class="panel_items_title text-bold text-capitalize">{{ item.waiter.name }}</span>
          </div>
          <div class="text-bold">
            ${{formatNumber(deFormatNumber( item.total ))}}
          </div>
        </div>
      </div>
      <div v-else style="margin-top:46px; padding: 15px 0px; text-align: center;">
        <h6>No existen ordenes activas</h6>
      </div>
    </template>
    <template v-else>
      <!-- SOLO Ordenes con MESA activas -->
      <div v-if="(boardsActives && boardsActives.length > 0)" class="p-0" style="margin-top:46px;">
        <div @click="openBoardActive(item)" :class="['panel_items']" v-for="(item, index) in boardsActives" :key="index">
          <div>
            <span>#{{item.order.id}}</span>
            <span class="panel_items_title text-bold text-capitalize">{{item.waiter.name}}</span>
          </div>
          <div class="text-bold">
            ${{ formatNumber(deFormatNumber(item.order.total)) }}
          </div>
        </div>
      </div>
      <div v-else style="margin-top:46px; padding: 15px 0px; text-align: center;">
        <h6>No existen ordenes activas</h6>
      </div>
    </template>

    <complete-order @refresh="refreshData" />
    <assing-waiter  @refresh="openBoard" @success="openBoard"/>
    <catalog        @refresh="refreshData"/>

  </div>
</template>

<script>
import ConfigHelper from '@/helpers/ConfigHelper.js';
import FormatNumber from '@/helpers/FormatNumber.js';
import Loader from '@/helpers/Loader';
// Modals
import assingWaiter from '@/components/modals/cafeteria/assignWaiter.vue';
import catalog from '@/components/modals/cafeteria/catalog.vue';
import completeOrder from '@/components/modals/cafeteria/completeOrder.vue';

export default {
  components:{ completeOrder, assingWaiter, catalog },
  props:{
    value: {
      type: Boolean,
      default: false
    }
  },
  methods:{
    async openBoardActive(board){
  
      if(this.offOn) return;
      this.offOn = true;
      Loader.dinamic();
        await this.$store.dispatch("cafeteria/getBoard", board.id);
      Loader.hide();
      this.offOn = false;
      
      $('#completeOrder').modal('show');
  //    completeOrder.show();
    },
    async openOrderActive(order){
      if (order.board) // Si tiene una mesa...
        this.openBoardActive(order.board);
      else {
        // Si no tiene una mesa
        console.log('Abriendo orden...', order)
        /*this.openBoardActive(null);*/
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

    // Traer todos los meseros
    async refreshData(loading = false){
      console.log('Refresh data boards actives')
      if (!this.cafeteriaInstalled) return this.$router.push('/inicio');
      // Iniciando refrescamiento (carga y botones disabled)
      this.offOn = true;
      if(loading){
        Loader.dinamic();

        console.log('get boards, garzon mode:', this.isGarzonModeEnabled)

        if (this.isGarzonModeEnabled) //Ordenes activas
          await this.$store.dispatch('cafeteria/getAllOrdersActives');
        else //Mesas activas
          await this.$store.dispatch('boards/getBoardsActives');

      }else{
        Loader.containe(this.$refs.loaderMesasOrder);
      }

      // Iniciando peticion
      var request = await this.$store.dispatch("cafeteria/getCafeteria");
      Loader.hide();
      this.offOn = false;
      // Verificando la respuesta
      if (!request.success) this.$awn.alert(request.data);
    },

    // Abrir mesa clickeada
    openBoard(board, waiter_id = false){
      this.board = board;
      if(this.board && (this.board.waiter == null || this.board.waiter.id == null)){
        if(!waiter_id){
          // Abriendo modal para asignar mesero
          this.openAssignWaiter();
        }else{
          // Abriendo modal de calogo
          this.board.waiter = { id: waiter_id }
          this.openCatalog();
        }
      }else{
        // Ir al modal de orden completa
        this.openCatalog();
      }
    },
    async openCatalog(){
      Loader.fullPage();
      await this.$store.dispatch("products/getCategories");
      Loader.hide();
      $('#modalCatalog').modal('show');
    },
    async openAssignWaiter(){
      Loader.fullPage();
      await this.$store.dispatch('waiters/getAllWaiters');
      Loader.hide();
      if(this.waiters && this.waiters.length == 0){
        this.$awn.alert("No existen meseros disponibles");
        return;
      }
      $('#modalAssignWaiter').modal('show');
    },
  },
  computed:{
    offOn: {
      get() { return this.value },
      set(offOn) { this.$emit('input',offOn) }
    },
    boardsActives:    { get(){ return this.$store.getters['boards/getBoardsActives'] } },
    allOrdersActives: { get(){ return this.$store.getters['cafeteria/getAllOrdersActives'] } },
    board:{
      get(){ return this.$store.getters['cafeteria/getBoard'] },
      set(value){ this.$store.commit('cafeteria/setProperty', {key: 'board', data: value}) }
    },
    // HavePermission
    cafeteriaInstalled:{ get(){ return ConfigHelper.ConfStr('modulos.cafeteria'); } },
    waiters:{ get(){ return this.$store.getters['waiters/getAllWaiters'] } },
    isGarzonModeEnabled:      { get(){ return ConfigHelper.ConfStr('modulos.cafeteria.submodulos.garzon_mode'); }}
  },
}
</script>

<style lang="scss">
  .panel_father{
    width: 100%;
    display: flex;
    flex-direction: column;
    padding: 0px;
    margin: 0px;
    border: 1px solid var(--primary);
    border-collapse: collapse;
    height: 100%;
    overflow: auto;
  }
  .panel_title{
    position:absolute;
    width: calc(100% - 17px);
    padding: 10px;
    border: 1px solid var(--primary);
    border: 1px solid var(--primary);
    text-align: center;
    font-weight: bold;
  }
  .panel_items{
    width: 100%;
    padding: 0px 10px;
    border: 1px solid var(--primary);
    text-align: center;
    cursor: auto;
    transition: .2s all ease;
    user-select: none;
    &_title{
      transition: .2s all ease;
      color: var(--primary);
    }
  }

  .panel_items:hover{
    cursor: pointer;
    color: #fff !important;
    background: var(--primary);
    padding: 10px;
    .panel_items_title{
      color: #fff;
    }
    &.no_hover {
      cursor: auto;
      padding: 0px 10px;
      color: inherit !important;
      .panel_items_title{
        color: inherit !important;
      }
      background: none;
    }
  }

  .panel_items_active{
    color: #fff !important;
    background: var(--primary);
    padding: 10px;
    .panel_items_title{
      color: #fff;
    }
  }
</style>
