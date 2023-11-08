<template>
  <div class="modal fade modalForce" id="detailPhoneOrder" tabindex="-1" role="dialog" aria-labelledby="detailPhoneOrder" aria-hidden="true" data-backdrop="false">
    <div class="modal-dialog modal-lg modal-dialog-centered" role="document">
      <div class="modal-content">
        <div class="modal-header bg-primario">
          <h5 class="modal-title">Detalle de orden</h5>
          <button type="button" class="text-white close" @click="$emit('closeModal')" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div v-if="dataDetail" class="modal-body">
          <div class="row">
            <div class="col-md-4 col-12 row">
              <div v-if="(dataDetail.client && clientInstalled)" class="col-12">
                <!-- Data client -->
                <div class="text-center">
                  <h5 class="mt-2 text-capitalize">Cliente</h5>
                  <span class="mt-2 text-capitalize">
                    <b>{{dataDetail.client.name}} {{dataDetail.client.lastname}}</b>
                  </span>
                  <div class="p-3 circleStyle">
                    <img src="../../../assets/person.jpg" class="user-img img-fluid img-circle">
                  </div>
                  <span class="mt-2 text-capitalize">
                    <b>Rut</b> {{dataDetail.client.rut}}
                  </span>
                </div>
                <hr class="w-95 m-3" style="border: 0.5px solid rgba(0,0,0,0.2);">
                <ul class="list-group client_list">
                  <li v-if="(dataDetail.client.phone && this.clientsPhone)" class="list-group-item-border">
                    <i class="fas fa-mobile mr-2"></i> {{dataDetail.client.phone}}
                  </li>
                  <li v-if="(dataDetail.client.city && dataDetail.client.comuna)" class="list-group-item-border">
                    <i class="fas fa-route mr-2"></i> {{dataDetail.client.city}} - {{dataDetail.client.comuna}}
                  </li>
                  <li v-if="dataDetail.client.razon_social" class="list-group-item-border">
                    <i class="fas fa-edit mr-2"></i> {{dataDetail.client.razon_social}}
                  </li>
                </ul>
              </div>
              <!-- Data user -->
              <div class="col-12" v-if="dataDetail.technician">

                <!-- Data user -->
                <div class="text-center">
                  <h5 class="mt-2 text-capitalize">Tecnico</h5>
                  <span class="mt-2 text-capitalize">
                    <b>{{dataDetail.technician.fullname}}</b>
                  </span>
                  <div class="p-3 circleStyle">
                    <img :src="getImage(dataDetail.technician.avatar)" class="user-img img-fluid img-circle">
                  </div>
                </div>

                <hr class="w-95 m-3" style="border: 0.5px solid rgba(0,0,0,0.2);">
              </div>
            </div>

            <!-- Order details -->
            <div class="col-md-8 col-12 row">
              <div class="col-12 mt-2">
                <div class="px-3">
                  <h5>Detalles de la orden</h5>
                </div>
                <div class="list-group px-3">
                  <span><b>ID</b> {{ dataDetail.id }}</span>
                  <span><b>Modelo</b> {{ dataDetail.device_model }}</span>
                  <span v-if="dataDetail && dataDetail.device_condition"><b>Condicion</b>
                    <div>
                      <ul>
                        <template v-for="(condition, conditionIndex) in device_conditions" >
                          <li v-if="JSON.parse(dataDetail.device_condition).includes(conditionIndex)" :key="'condition-option-i' + conditionIndex">
                            {{ condition }}
                          </li>
                        </template>
                      </ul>
                    </div>
                  </span>
                  <span><b>Falla</b> {{ dataDetail.device_failure }}</span>
                  <span><b>Imei</b> {{ dataDetail.device_imei }}</span>
                  <span><b>Cotraseña</b> {{ dataDetail.device_password }}</span>
                  <span><b>Observacion</b> {{ dataDetail.observations }}</span>
                  <span><b>Presupuesto</b> {{ dataDetail.budget }}</span>
                  <span><b>Email de contacto</b> {{ dataDetail.contact_email }}</span>
                  <span v-if="allowPhone"><b>Telefono de contacto</b> {{ dataDetail.contact_phone }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button"
            class="btn bg-secundario text-white"
            v-if="(dataDetail)" @click="editarCliente(null)"
          >
            Editar Cliente
          </button>
          <button type="button"
            class="btn bg-secundario text-white"
            v-if="dataDetail && allowPhone"
            @click="mensajeWhatsapp()"
          >
            Mensaje Whatsapp
          </button>
          <button type="button"
            class="btn bg-dark text-white text-capitalize"
            v-if="dataDetail"
            @click="print()"
          >
            Imprimir
          </button>
          <!--<button type="button" class="btn bg-primario text-white" data-dismiss="modal">Cerrar</button>-->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ConfigHelper from '@/helpers/ConfigHelper.js';
import FormatNumber from '@/helpers/FormatNumber.js';
import Connection from '@/helpers/Connection.js';
import AllErrors from '@/helpers/AllErrors.js';
import BaseUrl from '@/helpers/baseUrl.js';
import Print from '@/helpers/Print.js';
import Loader from '@/helpers/Loader';
const fs = require('fs');
const { shell } = require("electron");

export default {
  name: 'mobileOrderDetail',
  data(){
    return{
      type: null,
    }
  },
  props:[
    'dataDetail',
    'clientFromModal'
  ],
  components:{},
  methods:{
    // Mensaje de Whatsapp
    mensajeWhatsapp() {
      const shopName = this.name_shop_public_orders;
      const message = `Hola somos ${shopName} su equipo número de guía *${this.dataDetail.id}* está listo para retirar
       Gracias por preferirnos`;
      /*window.open('https://wa.me/'+this.dataDetail.contact_phone+'?text='+message,'newwindow');*/
      shell.openExternal(/*event.target.href*/
        'https://wa.me/'+this.dataDetail.contact_phone+'?text='+message
      );
    },
    // Imprimir
    async print() {
      Loader.fullPage();
      const request = await this.$store.dispatch("client_orders/mobile_devices/print", {
          id: this.dataDetail.id
      });
      if (request.success) {
        const printPDF = await Print.printBase64(request.data);
      }else{
        console.log('Error x x x', request.data)
        AllErrors.getError(request.data);
      }
      Loader.hide();
    },
    // Editar cliente
    async editarCliente(client) {
      if (!client) {
        $('#clientCreate').modal('show');
        return;
      }
      $('#clientCreate').modal('hide');
      Loader.fullPage();

      var thing = new FormData();
      for (let key in client){
        if (client[key]){
          thing.append(key, client[key]);
        }
      }
      var request = await this.$store.dispatch("clients/editClient", {
          data: thing,
          id: this.dataDetail.client.id
      });
      Loader.hide();
      if (request.success) {
        this.$awn.success('Cliente editado exitosamente',{labels:{success:'CORRECTO'}});
        this.$emit('refreshData', false, null, false, false, this.dataDetail.id);
      }else{
        console.log('Error x x x', request.data)
        //this.$awn.alert(request.data);
        AllErrors.getError(request.data);
      }
    },
    // Otras funciones
    formatNumber(number){
      return FormatNumber.format(number);
    },
    deFormatNumber(number, backend = true){
      if (backend) {
        return FormatNumber.deFormatBackend(number);
      }else{
        return FormatNumber.deFormat(number);
      }
    },
    getImage(image){
      return BaseUrl.getUrl('images/'+image);
    },
  },
  computed:{
    clientsPhone:{ get(){ return ConfigHelper.ConfStr('modulos.ventas.submodulos.clientes.ajustes.cliente_telefono'); } },
    clientInstalled:{ get(){ return ConfigHelper.ConfStr('modulos.ventas.submodulos.clientes'); } },
    // Everioments
    envs: { get() {
      const envs = this.$store.getters['main/getEnvs'];
      if (envs) return envs;
      return {
        client_orders_device_models: { value: '{}' },
        client_orders_device_conditions: { value: '{}' }
      }
    } },
    device_models: { get() { return JSON.parse(this.envs.client_orders_device_models.value); } },
    device_conditions: { get() { return JSON.parse(this.envs.client_orders_device_conditions.value); } },
    // name_shop_public_orders
    name_shop_public_orders: { get() { return this.envs.name_shop_public_orders.value; } },
    // Allow Phones
    allowPhone: { get() { return ConfigHelper.ConfStr('modulos.ventas.submodulos.clientes.ajustes.cliente_telefono'); } }
  },
  watch: {
    clientFromModal: {
      handler(val) {
        console.log(val);
        if (val) {
          this.editarCliente(val);
        }
      }
    },
  },
}
</script>

<style scoped>
  .client_list{
    height: 100% !important;
    max-height: 140px !important;
  }
  .list-group{
    overflow-y: scroll;
    overflow: auto;
  }
  ::-webkit-scrollbar{
    width:4px;
  }
  ::-webkit-scrollbar-track{
    background:#c0c0c0;
    border-radius:50px;
  }
  ::-webkit-scrollbar-thumb{
    background:#000000;
    border-radius:50px;
  }
  .list-group-item-action{
    border: none !important;
  }
  .list-group-item-border{
    border-bottom: 1px solid #e2e2e2 !important;
    padding: 12px 15px;
  }
  /* .list-group-item-action:hover{
    z-index: 2 !important;
    color: #ffffff !important;
    background-color: #007bff !important;
    border-color: #007bff !important;
  } */
  @media (max-width: 768px){
    .list-group{
      height: 250px !important;
    }
  }
  @media (min-width: 576px){
    .modal-dialog {
      max-width: 800px !important;
    }
  }

  .user-img {
    width: 100px;
    height: 100px;
  }
</style>
