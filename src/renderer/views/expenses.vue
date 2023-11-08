<template>
  <div class="product-bg p-3">
    <div class="d-flex w-100 h-100 flex-column justify-content-center align-items-center">
      <div class="pl-2 d-flex row w-100">
        <div class="card title-card col-md-5 col-sm-7 col-12">
          <div class="card-body">
            <h5 class="font-weight-bold m-0">Gestion de Gastos</h5>
            <span>Agrega o elimina gastos del dia</span>
          </div>
        </div>
        <div class="offset-md-4 offset-sm-1 col-md-3 col-sm-4 col-12 d-flex flex-column">
          <button :disabled="offOn" type="button" class="m-1 btn bg-primario text-white text-capitalize" data-toggle="modal" data-target="#newExpenseModal">
            Añadir Gasto
          </button>
          <button :disabled="offOn" type="button" class="m-1 btn bg-secundario text-white text-capitalize" @click="getExpenses(1)">
            Refrescar
          </button>
        </div>
      </div>
    </div>

    <div v-if="expenses && expenses.items.length > 0" ref="loaderExpenses" class="vld-parent px-2 mt-4">
      <customTable v-model="jsonTable" v-slot="props">
        <a @click="openVerify(props.item)" class="py-1 px-2 text-center btn bg-primario" href="#">
          <i class="fas fa-trash-alt"></i>
        </a>
      </customTable>

      <!-- Paginacion -->
      <paginate
        v-if="(expenses && expenses.pages > 1)"
        v-model="expenses"
        :offOn="offOn"
        @getPage="getExpenses"
      />
    </div>
    <div v-else ref="loaderExpenses" class="vld-parent px-2 mt-2">
      <div class="box-false d-flex flex-center text-center p-2 w-100">
        <h2>No existen gastos actualmente</h2>
      </div>
    </div>

    <!-- Modals -->
    <verify-modal :propVerify="propVerify" @refreshData="getExpenses" />
    <new-expense @refresh="getExpenses" ref="newExpense"/>
  </div>
</template>

<script>
// Components
import paginate from  '@/components/MPage.vue';
import verifyModal from '@/components/modals/verifyDelete.vue';
import newExpense from '@/components/modals/newExpense.vue';
import customTable from '@/components/tables/table.vue';

// Helpers
import ConfigHelper from '@/helpers/ConfigHelper.js';
import BaseUrl from '@/helpers/baseUrl.js';
import Loader from '@/helpers/Loader';

export default {
  data(){
    return{
      oldPage: '&page=1',
      expenses: null,
      propVerify: null,
      jsonTable: {
        btn: true,
        items: null,
        rows:[
          {key:'name', class:'', permission:'default'},
          {key:'balance', class:'', permission:'default'},
        ],
        titles:[
          {label:'Nombre', class:'', permission:'default', type:false},
          {label:'Total', class:'', permission:'default', type:false},
          {label:'Acciones', class:'th-sm text-center', permission:'default', type:false},
        ]
      }
    }
  },
  async mounted(){
    //HavePermission
    this.getExpenses(false);
  },
  components: {
    verifyModal,
    paginate,
    customTable,
    newExpense
  },
  props:{
    value: {
      type: Boolean,
      default: false
    }
  },
  methods:{
    async getExpenses(page = false){

      var params = '?params=true';
      if(page !== false) this.oldPage = '&page='+page;
      params += this.oldPage;

      // Iniciando peticion
      this.offOn = true;
      Loader.containe(this.$refs.loaderExpenses);
      var request = await this.$store.dispatch("expenses/getExpenses", params);
      Loader.hide();
      this.offOn = false;
      // Verificando respuesta
      if(!request.success) return this.$awn.alert(request.data);

      this.expenses = request.data;
      this.jsonTable.items = request.data.items;
    },
    openVerify(expense){
      this.propVerify = {
        params: expense.id,
        title: 'Eliminar gasto',
        text: '¿Usted esta seguro de querer eliminar el gasto '+ expense.name + '?',
        store: 'expenses/removeExpense',
        success: 'Gasto eliminado exitosamente'
      };
      $('#verifyDelete').modal('show');
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
