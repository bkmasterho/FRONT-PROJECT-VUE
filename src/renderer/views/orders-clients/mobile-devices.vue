<template>
  <div class="product-bg d-flex flex-column p-3">
    <div class="mb-4 pl-4 d-flex row w-100">
      <div class="card title-card col-md-5 col-sm-7 col-12">
        <div class="card-body">
          <h5 class="font-weight-bold m-0">Gestion de ordenes</h5>
          <span>Lista de ordenes para dispositivos mobiles</span>
        </div>
      </div>
    </div>
    <div class="p-3">
      <div class="row mb-4">
        <div class="col-md-3 col-sm-4 col-12">
          <label for="search_bar">Buscar</label>
          <input
            id="search_bar" name="search_bar"
            :disabled="offOn"
            v-model="order"
            type="text"
            class="form-control"
            @keypress.enter="refreshData()"
          />
        </div>
        <div class="col-md-3 col-sm-4 col-12">
          <label>Rango de fechas</label>
          <date-picker  class="widthInput"
                        format="YYYY-MM-DD"
                        type="date"
                        v-model="rangeDate"
                        range placeholder="Fechas"
                        confirm>
          </date-picker>
        </div>
        <div class="col-md-6 col-sm-4 col-12 d-flex align-items-end">
          <a @click="refreshData()" :class="['btn mx-1 mt-1 mb-0 bg-primario btnPersonalice',{'disabled': offOn}]" href="#">
            <span class="">Buscar</span>
          </a>
          <a @click="refreshData(1, true)" :class="['btn mx-1 mt-1 mb-0 bg-primario btnPersonalice',{'disabled': offOn}]" href="#">
            <i class="fas fa-calendar-day"></i>
            <span class="">Hoy</span>
          </a>
          <a @click="refreshData(1, null, true)" :class="['btn mx-1 mt-1 mb-0 bg-primario btnPersonalice',{'disabled': offOn}]" href="#">
            <i class="fas fa-list-alt"></i>
            <span class="">Todas</span>
          </a>
        </div>
      </div>
      <!-- Lista de ordenes -->
      <div v-if="orders" ref="loaderOrders" class="vld-parent p-0 m-0">
        <custom-table v-model="jsonTable" @orderBy="orderBy" v-slot="props">
          <a @click="openDetails(props.item)" class="py-1 px-2 text-center btn bg-secundario" href="#">
            <i class="fas fa-eye"></i>
          </a>
          <!-- <a v-if="permissionRemoveOrder" class="py-1 px-2 text-center btn bg-primario" href="#" @click="openVerify(props.item)">
            <i class="fas fa-trash-alt"></i>
          </a> -->
        </custom-table>

        <!-- Paginacion -->
        <nav v-if="orders" aria-label="Page navigation example">
          <paginate
            v-if="(orders && orders.pages > 1)"
            v-model="orders"
            :offOn="offOn"
            @getPage="refreshData"
          />
        </nav>
      </div>
      <div v-else ref="loaderOrders"  class="vld-parent box-false d-flex flex-center text-center p-2">
        <h2>No existen ordenes registradas</h2>
      </div>
    </div>
    <mobileOrderDetail
        :dataDetail="dataDetail"
        @refreshData="refreshData"
        :clientFromModal="client"
    />
    <modalClient @sendInfo="editarCliente" :rutUser="rutUser" />
    <Verifymodal :propVerify="propVerify" @refreshData="refreshData" />
  </div>
</template>

<script>
// components
import paginate from  '@/components/MPage.vue';
import mobileOrderDetail from '@/components/modals/client_orders/mobileOrderDetail.vue';
import Verifymodal from '@/components/modals/verifyDelete.vue';
import modalClient from '@/components/modals/client.vue';
import customTable from '@/components/tables/table.vue';
// helpers
import ConfigHelper from '@/helpers/ConfigHelper.js';
import FormatNumber from '@/helpers/FormatNumber.js';
import Loader from '@/helpers/Loader';
import moment from 'moment';
import $ from 'jquery';

export default {
  name: 'ordersList',
  data() {
    return {
      dataDetail: null,
      rutUser: null,
      client: null,
      order: null,
      oldPage: 1,
      today: null,
      orders: false,
      propVerify: '',
      valAnterior: '',
      rangeDate: [],
      jsonTable: {
        btn: true,
        items: null,
        rows:[
          {key:'id',            class:'text-center d-none-1', permission:'default'},
          {key:'created_at',    class:'',                     permission:'default'},
          {key:'client_name',  class:'',                     permission:'clientsInstaller'},
          {key:'client_rut',   class:'',                     permission:'clientsInstaller'},
        ],
        titles:[
          {label:'Id',        class:'th-xs text-center d-none-1',   permission:'default',           type:false},
          {label:'Fecha',     class:'th-sm',                        permission:'default',           type:'orderBy', orderBy: false},
          {label:'Cliente',   class:'th-sm',                        permission:'clientsInstaller',  type:false},
          {label:'Rut',       class:'th-md',                        permission:'clientsInstaller',  type:false},
          {label:'Detalles',  class:'th-sm text-center',            permission:'default',           type:false},
        ]
      }
    }
  },
  mounted(){
    console.log('=============ORDERS CLIENTS================')
    //HavePermission
    this.refreshData();
  },
  components:{
    mobileOrderDetail,
    Verifymodal,
    paginate,
    customTable,
    modalClient
  },
  props:{
    value: {
      type: Boolean,
      default: false
    }
  },
  methods:{
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
    // Refrescando ventas
    async refreshData(page = false, today = null, allOrders = false, isLoader = true, id = false){
      // Iniciando refrescamiento (carga y botones disabled)
      this.offOn = true;
      if(isLoader) Loader.containe(this.$refs.loaderOrders);

      if (this.ordersGet) {
        // Parametros para la ruta
        var params = '?params=true';
        if(allOrders === false){
          // Busqueda especifica
          if(this.order != null && this.order != ''){
            params += '&searchInOrder=' + this.order;
            this.oldPage = 1;
            page = false;
          }

          // Fechas
          if (this.rangeDate && this.rangeDate.length > 0) {
            // Rango de fechas
            var startDate = moment(this.rangeDate[0]).format('YYYY-MM-DD') + ' ' + '00:00:00';
            var endDate = moment(this.rangeDate[1]).format('YYYY-MM-DD') + ' ' + '23:59:59';
            params += '&startDate=' + startDate;
            params += '&endDate=' + endDate;
          }else{
            // Ventas del dia
            this.today = today;
            if(this.today != null) params += '&todayOrders='+this.today;
          }
        }else{
          this.order = null;
          this.today = null;
          this.rangeDate = [];
        }
        // Paginacion
        if(page !== false) this.oldPage = page;
        params += '&page=' + this.oldPage;

        // Ordenamiento
        var orderBy = (this.jsonTable.titles[2].orderBy) ? 'asc' : 'desc';
        params += '&orderBy_date=' + orderBy;

        console.log("/////////////////// ",params);
        // Iniciando peticion
        var request = await this.$store.dispatch("client_orders/mobile_devices/paginate", params);
        // Verificando la respuesta
        if (!request.success) this.$awn.alert('Error al obtener las ordenes');
        else{
          this.orders = (request.data.items.length == 0) ? false : request.data;
          this.jsonTable.items = this.orders.items;
          if(!isLoader && id){
            this.dataDetail = this.jsonTable.items.find((item) => item.id == id);
          }
        }

      }
      // Culminando la funcion
      if(isLoader) Loader.hide();
      this.offOn = false;
    },
    // Modal de verificacion
    /*openVerify(order){
      this.propVerify = {
        params: order.id,
        title: 'Eliminar orden',
        text: '¿Usted esta seguro de querer eliminar la ordern #'+ order.id +'?',
        store: 'orders/removeOrder',
        success: 'Orden eliminada exitosamente'
      };
      $('#verifyDelete').modal('show');
    },*/
    // Abriendo modal de detalle
    openDetails(data){
      if(data && data.client) this.rutUser = data.client.rut;
      else this.rutUser = null;
      this.dataDetail = data;
      $('#detailPhoneOrder').modal('show');
    },
    // Ordenamiento de asc/desc
    orderBy(){
      this.jsonTable.titles[2].orderBy = !this.jsonTable.titles[2].orderBy;
      this.refreshData();
    },
    async editarCliente(client){
      this.client = client;
    }
  },
  computed:{
    // v-model
    offOn: {
      get() { return this.value },
      set(offOn) { this.$emit('input',offOn) }
    },
    // Permisos para obtener las ventas
    ordersGet:{ get(){ return ConfigHelper.HavePermission('gestionar_ventas'); } },
    //permissionRemoveOrder:{ get(){ return ConfigHelper.HavePermission('eliminar_venta'); }}
  }
}
</script>

<style>
  .widthInput{
    width: 100% !important;
  }
  .mx-input {
    height: 38px !important;
  }
  .mx-input-wrapper {
    height: 38px !important;
  }
  .page-link{
    font-size: 15px !important;
  }
  .btnPersonalice{
    border: none !important;
    text-transform: none !important;
    padding: 7px 20px;
    margin-bottom: 0px;
    display: inline !important;
  }
  .btnOrderBy{
    cursor: pointer;
  }
  @media (max-width: 885px) {
    .d-none-01{
      display: none;
    }
  }
  @media (max-width: 768px) {
    .d-none-0{
      display: none;
    }
  }
  @media (max-width: 660px) {
    .d-none-1{
      display: none;
    }
  }
  @media (max-width: 575px) {
    .btnPersonalice{
      display: block;
      width: 100%;
    }
  }
  @media (max-width: 520px) {
    .d-none-2{
      display: none !important;
    }
  }
</style>
