<template>
  <div class="default-bg p-2 d-flex flex-column align-items-end pt-md-5 main-container">
    <div class="actionsCocina">
      <button :disabled="someLoadingOrders" @click="getOrdersKitchenManually()" type="button" class="m-1 btn-width btn bg-secundario text-white text-capitalize">
        <i class="fas fa-sync-alt"></i>
        Refrescar
      </button>
    </div>
    <!-- title -->
    <div class="w-100">
      <h3 class="text-primario">Ordenes de cocina</h3>
      <hr class="borderTitleCafeteria" />
    </div>
    <!-- Lista de mesas -->
    <template v-if="ordersKitchen.length">
        <div v-if="useKanbanKitchen" class="kitchen-kanban-container">
          <div class="kanban-row shadow-down">
            <div class="kanban-column kanban-column-head">
              <span class="head-text">Pendiente</span>
            </div>
            <div class="kanban-column kanban-column-head">
              <span class="head-text">En proceso</span>
            </div>
            <div class="kanban-column kanban-column-head">
              <span class="head-text">Completado</span>
            </div>
          </div>
          <div class="kanban-row">
            <div class="kanban-column kanban-column-body">
              <draggable v-model="ordersCards.pending" @change="changePending" 
              group="kanbanKitchen" class="draggabble-content-area" @start="drag=true" @end="drag=false">
                <div v-for="(order) in ordersCards.pending" v-bind:key="'kitchen-order-'+order.id">
                  <kitchenCard :order="order" />
                </div>
              </draggable>
            </div>
            <div class="kanban-column kanban-column-body">
              <draggable v-model="ordersCards.process" @change="changeProcess" 
              group="kanbanKitchen" class="draggabble-content-area" @start="drag=true" @end="drag=false">
                <div v-for="(order) in ordersCards.process" v-bind:key="'kitchen-order-'+order.id">
                  <kitchenCard :order="order" />
                </div>
              </draggable>
            </div>
            <div class="kanban-column kanban-column-body">
              <draggable v-model="ordersCards.complete" @change="changeComplete" 
              group="kanbanKitchen" class="draggabble-content-area" @start="drag=true" @end="drag=false">
                <div v-for="(order) in ordersCards.complete" v-bind:key="'kitchen-order-'+order.id">
                  <kitchenCard :order="order" />
                </div>
              </draggable>
            </div>
          </div>
        </div>
        <div v-else class="kitchen-no-kanban-container">
            <kitchenCard 
              v-for="(order) in ordersKitchen"
              v-bind:key="'kitchen-order-notkanban-'+order.id"
              :order="order"
              :notKanbanKitchen="true"
            />
        </div>
    </template>
    <template v-else>
      <div class="vld-parent box-false d-flex flex-center text-center p-2 w-100">
        <h2>No existen ordenes actualmente</h2>
      </div>
    </template>

  </div>
</template>

<script>
// Helpers
import ConfigHelper from '@/helpers/ConfigHelper.js';
import Loader from '@/helpers/Loader';
import moment from 'moment';
import draggable from 'vuedraggable'
import kitchenCard from '@/components/kitchenMode/kitchen-card.vue';
import './kitchen-full-height.css';

const INTERVAL_MINUTE = 60 * 1000;

export default {
  components: { draggable, kitchenCard },
  data(){
    return {
      loadingOrders: false,
      backgroundLevel: {
        loadingOrders: false
      },
      ordersKitchen: [],
      ordersCards: {
        pending: [],
        process: [],
        complete: [],
        cancelled: []
      },
      drag: false,
      intervalTimer: null,
    }
  },
  mounted() {
    moment.locale('es');
    this.getOrdersKitchen();
    this.defineNewInterval();
    this.$store.dispatch('main/getEnvs');
  },
  unmounted() {
    console.log('unmounted');
    clearTimeout(this.intervalTimer);
  },
  beforeDestroy() {
    console.log('beforeDestroy');
    clearTimeout(this.intervalTimer);
  },
  methods: {
    defineNewInterval() {
      clearTimeout(this.intervalTimer);
      this.intervalTimer = setTimeout(() => {
        console.log('EXECUTE INTERVAL');
        if (!this.cantExecuteLoad) {
          // PODEMOS ejecutar el get
          this.getOrdersKitchenBackground();
        }
        this.defineNewInterval();
      }, INTERVAL_MINUTE / 4);
    },
    async getOrdersKitchenManually(){
      Loader.dinamic();
      this.loadingOrders = true;
      await this.getOrdersKitchen();
      this.loadingOrders = false;
      Loader.hide();
    },
    async getOrdersKitchenBackground(){
      Loader.dinamic();
      this.backgroundLevel.loadingOrders = true;
      await this.getOrdersKitchen();
      this.backgroundLevel.loadingOrders = false;
      Loader.hide();
    },
    async getOrdersKitchen(){
      const result = await this.$store.dispatch('cafeteria/kitchen/getPendingOrders');
      console.log('ORDERS KITCHEN GET', result);
      if (result && result.success) {
        this.setOrders(result.data);
      }
    },
    setOrders(newOrders) {
      this.ordersKitchen = [ ...newOrders ];
      const ordersCards = {
        pending: [],
        process: [],
        complete: [],
        cancelled: []
      };
      for (const order of this.ordersKitchen) {
        ordersCards[order.kitchen_state].push(order);
      }
      this.ordersCards = ordersCards;
    },
    changePending(changedValue) {
      console.log('changePending', changedValue);
      if (changedValue.added && changedValue.added.element) {
        this.markOrderAs(changedValue.added.element, 'pending');
      }
    },
    changeProcess(changedValue) {
      console.log('changeProcess', changedValue);
      if (changedValue.added && changedValue.added.element) {
        this.markOrderAs(changedValue.added.element, 'process');
      }
    },
    changeComplete(changedValue) {
      console.log('changeComplete', changedValue);
      if (changedValue.added && changedValue.added.element) {
        this.markOrderAs(changedValue.added.element, 'complete');
      }
    },
    async markOrderAs(order, kitchenState) {
      Loader.dinamic();
      const result = await this.$store.dispatch('cafeteria/kitchen/markAsState', {
        kitchenState,
        id: order.id,
      });
      console.log('ORDERS KITCHEN UPDATED ORDERS GET', result);
      if (result && result.success && result.data && result.data.orders) {
        this.setOrders(result.data.orders);
      }
      Loader.hide();
    }
  },
  computed: {
    someLoadingOrders: { get() { return this.loadingOrders || this.backgroundLevel.loadingOrders } },
    cantExecuteLoad: { get() { return this.loadingOrders || this.backgroundLevel.loadingOrders || this.drag } },
    useMoment: { get() { return moment; } },
    useKanbanKitchen: { get() { return !ConfigHelper.ConfStr('modulos.cafeteria.submodulos.modo_cocina.ajustes.no_kanban_cocina') } },
    envs: { get(){ return this.$store.getters['main/getEnvs'] }},
  },
}

</script>

<style lang="scss">
.wrapper, html, body {
    height: 100%;
    margin: 0;
}
.wrapper {
    display: flex;
    flex-direction: column;
}

  .main-container {
    display: flex;
    flex-direction: column;
    height: 100%;
  }

  .shadow-down {
    -webkit-box-shadow: 1px 4px 4px 1px rgba(0,0,0,0.64); 
    box-shadow: 1px 4px 4px 1px rgba(0,0,0,0.64);
  }
  .kitchen-no-kanban-container {
    flex-direction: row;
    width: 100%;
    flex-wrap: wrap;
    justify-content: flex-start;
    display: flex;
  }

  .kitchen-kanban {
    &-container {
      flex: 1;
      width: 100%;
      background: #e6e6e6;
      border-radius: 2px;
      height: 100%;
      display: flex;
      flex-direction: column;
      .kanban-row {
        display: flex;
        flex-direction: row;
        .kanban-column {
          height: 100%;
          flex: 1;
          &.kanban-column-head {
            background: var(--primary);
            padding: 5px;
            display: flex;
            justify-content: center;
            .head-text {
              text-align: center;
              font-size: 16px;
              color: white;
            }
          }
          &.kanban-column-body {
            padding: 5px;
            flex: 1;
            height: 100%;
          }
        }
      }
    }
  }
  .draggabble-content-area {
    height: 100%;
  }
</style>
