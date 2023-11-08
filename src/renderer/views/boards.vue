<template>
  <div v-if="boardsGet" class="default-bg p-2 d-flex flex-column align-items-end pt-md-5">
    <div class="actionsCafeteria">
      <button :disabled="offOn" @click="openModal(null)" v-if="boardsModify" type="button" class="m-1 btn-width btn bg-primario text-white text-capitalize" data-toggle="modal" data-target="#modalBoards">
        Añadir Mesa
      </button>
      <button :disabled="offOn" @click="getBoards(oldPage, true)" type="button" class="m-1 btn-width btn bg-secundario text-white text-capitalize">
        <i class="fas fa-sync-alt"></i>
        Refrescar
      </button>

       
    </div>
    <!-- title -->
    <div class="w-100">
      <h3 class="text-primario">Gestion de Mesas</h3>
      <hr class="borderTitleCafeteria" />
    </div>
    <!-- Lista de mesas -->
    <div ref="loaderMesas" v-if="(boards && boards.items.length > 0)" class="vld-parent w-100 px-0 mt-2">
      <!-- tabla -->
      <customTable v-model="jsonTable" v-slot="props">
        <a @click="openModal(props.item)" class="py-1 px-2 text-center btn bg-secundario" href="#" data-toggle="modal" data-target="#modalBoards">
          <i class="fas fa-edit"></i>
        </a>
        <a @click="openVerify(props.item)" class="py-1 px-2 text-center btn bg-primario" href="#">
          <i class="fas fa-trash"></i>
        </a>
      </customTable>
      
      <!-- Paginacion -->
      <paginate
        v-if="(boards && boards.pages > 1)"
        v-model="boards"
        :offOn="offOn"
        @getPage="getBoards"
      />
    </div>
    <div ref="loaderMesas" v-else class="vld-parent box-false d-flex flex-center text-center p-2 w-100">
      <h2>No existen mesas actualmente</h2>
    </div>

    <gestion-boards v-model="boardToEdit" @refresh="getBoards" />
    <verify-modal :propVerify="propVerify" @refreshData="getBoards" />
  </div>
</template>

<script>
// components
import customTable from '@/components/tables/table.vue';
import paginate from  '@/components/MPage.vue';
import gestionBoards from '@/components/modals/cafeteria/gestionBoards.vue';
import verifyModal from '@/components/modals/verifyDeleteCafeteria.vue';

// Helpers
import ConfigHelper from '@/helpers/ConfigHelper.js';
import Loader from '@/helpers/Loader';

export default {
  components: { customTable, paginate, verifyModal, gestionBoards },
  data(){
    return{
      boardToEdit: null,
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
          {label:'Mesa', class:'', permission:'default', type:false},
          {label:'Actualmente', class:'text-center', permission:'default', type:false},
        ]
      }
    }
  },
  mounted(){
    //HavePermission
    this.getBoards(1, true);
    if (this.boardsChangeColor) {
      this.jsonTable.titles[this.jsonTable.titles.length] = {label:'Color', class:' text-center', permission:'default', type:false};
      this.jsonTable.rows[this.jsonTable.rows.length] = { key:'color', class:'fieldCsafeteria text-center', permission:'default' };
    }
    if(this.boardsModify){
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
    async getBoards(page = false, loading = false){
      if (!this.boardsGet) return this.$router.push('/inicio');
      // Iniciando refrescamiento (carga y botones disabled)
      this.offOn = true;
      if(loading === true){
        Loader.dinamic();
        if (ConfigHelper.ConfStr('modulos.cafeteria.submodulos.garzon_mode')) {
          await this.$store.dispatch('cafeteria/getAllOrdersActives');
        }else{
          await this.$store.dispatch('boards/getBoardsActives');
        }
      }else{
        Loader.containe(this.$refs.loaderMesas);
      }

      // Parametros en la ruta
      var params = '?params=true';
      if(page && this.oldPage != page) this.oldPage = page;
      params += '&page=' + this.oldPage;

      // Iniciando peticion
      var request = await this.$store.dispatch("boards/getBoards", params);
      // Verificando la respuesta
      if (!request.success) this.$awn.alert(request.data);

      Loader.hide();
      this.offOn = false;
    },

    // Modal gestion de meseros
    openModal(board){
      this.boardToEdit = board;
    },

    // Modal Verify
    openVerify(board){
      this.propVerify = {
        params: board.id,
        title: 'Eliminar mesa',
        text: '¿Usted esta seguro de querer eliminar a '+ board.name +'?',
        store: 'boards/remove',
        success: 'Mesa eliminada exitosamente'
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
    // boards
    boards(){
      var boards = this.$store.getters['boards/getBoards'];
      if(boards && boards.items) this.jsonTable.items = boards.items;
      return boards;
    },
    // Permisos de obtener meseros
    boardsGet:{ get(){ return ConfigHelper.HavePermission('obtener_mesas'); } },
    boardsModify:{ get(){ return ConfigHelper.HavePermission('gestionar_mesas'); } },
    boardsChangeColor: { get(){ return ConfigHelper.ConfStr('modulos.cafeteria.ajustes.change_board_color'); } }
  },
}
</script>
