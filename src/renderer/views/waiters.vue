<template>
  <div v-if="waitersGet" class="default-bg p-2 d-flex flex-column align-items-end pt-md-5">
    <div class="actionsCafeteria">
      <button :disabled="offOn" @click="openModal(null)" v-if="(waitersModify && usersGet)" type="button" class="m-1 btn-width btn bg-primario text-white text-capitalize" data-toggle="modal" data-target="#modalWaiters">
        Añadir Mesero
      </button>
      <button :disabled="offOn" @click="getWaiters(oldPage, true)" type="button" class="m-1 btn-width btn bg-secundario text-white text-capitalize">
        <i class="fas fa-sync-alt"></i>
        Refrescar
      </button>
    </div>
    <!-- title -->
    <div class="w-100">
      <h3 class="text-primario">Gestion de Meseros</h3>
      <hr class="borderTitleCafeteria" />
    </div>
    <!-- Lista de meseros -->
    <div ref="loaderMeseros" v-if="(waiters && waiters.items.length > 0)" class="vld-parent w-100 px-0 mt-2">
      <!-- tabla -->
      <customTable v-model="jsonTable" v-slot="props">
        <a @click="openModal(props.item)" class="py-1 px-2 text-center btn bg-secundario" href="#" data-toggle="modal" data-target="#modalWaiters">
          <i class="fas fa-edit"></i>
        </a>
        <a @click="openVerify(props.item)" class="py-1 px-2 text-center btn bg-primario" href="#">
          <i class="fas fa-trash"></i>
        </a>
      </customTable>

      <!-- Paginacion -->
      <paginate
        v-if="(waiters && waiters.pages > 1)"
        v-model="waiters"
        :offOn="offOn"
        @getPage="getWaiters"
      />
    </div>
    <div ref="loaderMeseros" v-else class="vld-parent box-false d-flex flex-center text-center p-2 w-100">
      <h2>No existen meseros actualmente</h2>
    </div>




    <verify-modal :propVerify="propVerify" @refreshData="getWaiters" />
    <gestion-waiters v-model="waiterToEdit" @refresh="getWaiters" />
  </div>
</template>

<script>
// components
import customTable from '@/components/tables/table.vue';
import paginate from  '@/components/MPage.vue';
import gestionWaiters from  '@/components/modals/cafeteria/gestionWaiters.vue';
import verifyModal from '@/components/modals/verifyDeleteCafeteria.vue';

// Helpers
import ConfigHelper from '@/helpers/ConfigHelper.js';
import Loader from '@/helpers/Loader';

export default {
  components: { customTable, paginate, gestionWaiters, verifyModal },
  data(){
    return{
      waiterToEdit: null,
      propVerify: {},
      oldPage: 1,
      jsonTable: {
        btn: false,
        items: null,
        rows:[
          {key:'id', class:'fieldCsafeteria text-center text-primario text-bold', permission:'default'},
          {key:'name', class:'fieldCsafeteria ', permission:'default'},
          {key:'state', class:'fieldCsafeteria text-center', permission:'default'},
        ],
        titles:[
          {label:'Id', class:'text-center', permission:'default', type:false},
          {label:'Mesero', class:'', permission:'default', type:false},
          {label:'Actualmente', class:'text-center', permission:'default', type:false},
        ]
      }
    }
  },
  mounted(){
    //HavePermission
    this.getWaiters(1, true);
    if(this.waitersModify && this.usersGet){
      this.jsonTable.btn = true;
      this.jsonTable.titles[this.jsonTable.titles.length] = {label:'Acciones', class:' text-center', permission:'default', type:false};
    }
  },
  props:{
    value: {
      type: Boolean,
      default: false
    }
  },
  methods:{
    // Traer todos los meseros
    async getWaiters(page = false, loading = false){
      if (!this.waitersGet) return this.$router.push('/inicio');
      // Iniciando refrescamiento (carga y botones disabled)
      this.offOn = true;
      if(loading === true){
        Loader.dinamic();
        if (this.usersGet) await this.$store.dispatch("main/getAllUsers");
        if (ConfigHelper.ConfStr('modulos.cafeteria.submodulos.garzon_mode')) {
          await this.$store.dispatch('cafeteria/getAllOrdersActives');
        }else{
          await this.$store.dispatch('boards/getBoardsActives');
        }
      }else{
        Loader.containe(this.$refs.loaderMeseros);
      }

      // Parametros en la ruta
      var params = '?params=true';
      if(page && this.oldPage != page) this.oldPage = page;
      params += '&page=' + this.oldPage;

      // Iniciando peticion
      var request = await this.$store.dispatch("waiters/getWaiters", params);
      // Verificando la respuesta
      if (!request.success) this.$awn.alert(request.data);

      Loader.hide();
      this.offOn = false;
    },

    // Modal gestion de meseros
    openModal(waiter){
      this.waiterToEdit = waiter;
    },

    // Modal Verify
    openVerify(waiter){
      this.propVerify = {
        params: waiter.id,
        title: 'Eliminar mesero',
        text: '¿Usted esta seguro de querer eliminar a '+ waiter.name +'?',
        store: 'waiters/remove',
        success: 'Mesero eliminado exitosamente'
      };
      $('#deleteVerifyCafeteria').modal('show');
    },
  },
  computed:{
    // v-model
    offOn: {
      get() { return this.value },
      set(offOn) { this.$emit('input',offOn) }
    },
    // my user
    me:{ get(){ return this.$store.getters['main/user']; } },
    // waiters
    waiters(){
      var waiters = this.$store.getters['waiters/getWaiters'];
      if(waiters && waiters.items) this.jsonTable.items = waiters.items;
      return waiters;
    },
    // Permisos de obtener meseros
    waitersGet:{ get(){ return ConfigHelper.HavePermission('obtener_meseros'); } },
    waitersModify:{ get(){ return ConfigHelper.HavePermission('gestionar_meseros'); } },
    // Others
    usersGet:{ get(){ return ConfigHelper.HavePermission('usuarios_obtener'); } },
  },
}
</script>
