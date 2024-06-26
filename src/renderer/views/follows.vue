<template>
  <div class="product-bg p-3">
    <!-- Filtros y acciones para los clientes -->
    <div class="d-flex w-100 h-100 flex-column justify-content-center align-items-center">
      <!-- Acciones para los clientes -->
      <div class="pl-2 d-flex row w-100">
        <div class="card title-card col-md-5 col-sm-7 col-12">
          <div class="card-body">
            <h5 class="font-weight-bold m-0">Gestion de seguimientos de ventas</h5>
            <span>Clientes ultimas compras</span>
          </div>
        </div>
      </div>

      <!-- Filtros de clientes -->
      <div class="d-flex row w-100 pt-4">
        <div class="col-md-4 col-sm-6 col-12">
          <label for="searchOfClient">Buscar por R.U.T</label>
          <input id="searchOfClient" v-model="searchOfClient" type="text" class="form-control" @keypress.enter="getClients" />
        </div>
      </div>
    </div>

    <!-- Listado de clientes-->
    <div ref="loaderClient" v-if="(clients && clients.items.length > 0)" class="vld-parent px-2 mt-2">
      <!-- tabla -->
      <customTable v-if="clients" v-model="jsonTable" v-slot="props">
        <a @click="selectClient(props.item)" class="py-1 px-2 text-center btn bg-secundario">
          <i class="fas fa-eye"></i>
        </a>
      </customTable>
      <!-- Paginacion -->
      <paginate
        v-if="(clients && clients.pages > 1)"
        v-model="clients"
        :offOn="offOn"
        @getPage="getClients"
      />
    </div>
    <div ref="loaderClient" v-else class="vld-parent px-2 mt-2">
      <div class="box-false d-flex flex-center text-center p-2 w-100">
        <h2>No existen clientes actualmente</h2>
      </div>
    </div>

    <div class="modal fade" id="detailSell" tabindex="-1" role="dialog" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered modal-lg" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title"><b>Detalles de productos comprados</b></h5>
              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">
              <div class="d-flex flex-column px-2" ref="loaderDetailProduct" v-if="(products && products.length > 0)">              
                <customTable v-model="jsonTableProducts" v-slot="props">
                </customTable>
                <div class="md-12">
                  <button type="button" data-dismiss="modal" class="btn bg-secundario btn-sm text-white float-right">Cerrar</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  </div>
</template>

<script>
// Components
import paginate from  '@/components/MPage.vue';
import customTable from '@/components/tables/table.vue';
import clients from '@/components/modals/clients.vue';

// Helpers
import ConfigHelper from '@/helpers/ConfigHelper.js';
import BaseUrl from '@/helpers/baseUrl.js';
import Loader from '@/helpers/Loader';
import Print from '@/helpers/Print.js';

export default {
  data(){
    return{
      oldPage: 1,
      clients: null,
      searchOfClient: null,
      products: null,
      jsonTable: {
        btn: true,
        items: null,
        rows:[
          {key:'id', class:'text-center d-none-1', permission:'default'},
          {key:'fecha', class:'', permission:'default'},
          {key:'razon_social', class:'', permission:'clientsInstaller'},
          {key:'rut', class:'', permission:'default'},
          {key:'total', class:'d-none-2', permission:'default'},
        ],
        titles:[
          {label:'Id', class:'th-xs text-center d-none-1', permission:'default', type:false},
          {label:'Fecha', class:'th-sm', permission:'default', type:'orderBy', orderBy: false},
          {label:'Cliente', class:'th-sm', permission:'clientsInstaller', type:false},
          {label:'Rut de cliente', class:'th-md', permission:'clientsInstaller', type:false},
          {label:'Total venta', class:'d-none-2', permission:'default', type:false},
          {label:'Detalles', class:'th-sm text-center', permission:'default', type:false},
        ]
      },
      jsonTableProducts: {
        items: null,
        rows:[
          {key:'name', class:'', permission:'default'},
          {key:'quantity', class:'', permission:'default'},
          {key:'totalPrice', class:'', permission:'default'},
          {key:'unitary_price', class:'d-none-2', permission:'default'},
        ],
        titles:[
          {label:'Producto', class:'th-sm', permission:'default', type:'false'},
          {label:'Cantidad', class:'th-sm', permission:'clientsInstaller', type:false},
          {label:'Precio unitario', class:'d-none-2', permission:'default', type:false},
          {label:'Precio Total', class:'d-none-2', permission:'default', type:false},
        ]
      }
    }
  },
  async mounted(){
    //HavePermission
    this.refreshData(true);
  },
  components: {
    paginate,
    customTable,
    clients
  },
  props:{
    value: {
      type: Boolean,
      default: false
    }
  },
  methods:{
    // Refrescando clientes
    async refreshData(loading = false){
      // Iniciando refrescamiento (carga y botones disabled)
      this.offOn = true;
      if(loading) Loader.containe(this.$refs.loaderClient);
      else Loader.dinamic();
      await this.getClients(this.oldPage, true);
      // Culminando la funcion
      Loader.hide();
      this.offOn = false;
    },
    // Traer clientes y parametros de clientes
    async getClients(page = false, isRefresh = false){
      if(!isRefresh){
        Loader.containe(this.$refs.loaderClient);
      }

      // Parametros para la ruta
      var params = '?params=true';
      if(page && this.oldPage != page) this.oldPage = page;
      params += '&page=' + this.oldPage;


      if (this.searchOfClient != null && this.searchOfClient != '') params += '&searchOfClient=' + this.searchOfClient;

      // Iniciando peticion
      var request = await this.$store.dispatch("products/getSellFollows", params);
      // Verificando respuesta
      if(!request.success) this.$awn.alert('Error al obtener los clientes');
      else{
        this.clients = (request.data.items.length == 0) ? false : request.data;
        this.jsonTable.items = this.clients.items;
      }

      if(!isRefresh){
        Loader.hide();
      }
    },

    // Seleccionar cliente a editar
    selectClient(data){
        this.products = data.products;
        this.jsonTableProducts.items = data.products;
        $('#detailSell').modal('show');
    },
  },
  computed:{
    // v-model
    offOn: {
      get() { return this.value },
      set(offOn) { this.$emit('input',offOn) }
    },
  }
}
</script>

<style lang="scss">
  .clients{
    &__col{
      flex: 0 0 20%;
      width: 20%;
    }
    @media (max-width: 1150px){
      &__col{
        flex: 0 0 25%;
        width: 25%;
      }
    }
    @media (max-width: 900px){
      &__col{
        flex: 0 0 33.3333%;
        width: 33.3333%;
      }
    }
    @media (max-width: 767px){
      &__col{
        flex: 0 0 50%;
        width: 50%;
      }
    }
    @media (max-width: 500px){
      &__col{
        flex: 0 0 100%;
        width: 100%;
      }
    }
  }
</style>
