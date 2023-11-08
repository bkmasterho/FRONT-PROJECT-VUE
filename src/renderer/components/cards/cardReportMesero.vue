<template>
  <div ref="loaderTable"  class="vld-parent card card-widget elevation-1">
    <div class="card-header d-flex justify-content-between bg-primario">
      <div class="">
        <span class="text-bold form-inline">Mesero {{cardTitle}}
            <select class = "form-control" @change="$root.$emit('getOneWaiter', $event)" id="select-report-mesero">
                <option :value="waiter_id" selected>Seleccionado: {{cardTitle}}</option>
                <option v-for="(waiter, index) in waiters" :key="index" :value = "waiter.id">{{waiter.name}}</option>
                
            </select>
        </span>
      </div>

      <div class="ml-auto">
        <button type="button" @click="descargarExcel" class="btn btn-tool elevation-0 bg-light">
          Exportar a Excel
        </button>
        <button type="button" class="btn btn-tool elevation-0" data-toggle="collapse" :data-target="'#'+idTarget" aria-expanded="false" :aria-controls="idTarget">
          <i class="fas fa-minus"></i>
        </button>
      </div>
    </div>
    <div v-if="tr.length != 0" class="px-3 collapse show scrollTableReport" :id="idTarget">
      <table class="table m-0 mb-1">
        <thead>
          <tr>
            <th v-for="(titles, index) in th" :key="index" scope="col" :class="(center && index != 0) ? 'text-center' : ''">
              {{titles}}
            </th>
            <th v-if="(details || remove)" scope="col">

            </th>
          </tr>
        </thead>
        <tbody :key="tr.length" id = "tabla-mesero-report-content">
          <tr v-for="(data,index) in tr" :key="index" >
            <!-- datos que vienen de mis props -->
            <td v-for="(dataTd, index2) in data" :key="index2" class="pa-auto py-2 text-capitallize" :class="((center && index2 != 0)) ? 'text-center' : ''" >
              {{dataTd}}
            </td>

            <!-- botones -->
            <td class="p-1 text-center" v-if="(details || remove)">
              <a v-if="details" @click="openDetails(data[0])" class="py-1 px-2 text-center btn bg-secundario">
                <i class="fas fa-eye"></i>
              </a>
              <a v-if="remove" class="py-1 px-2 text-center btn btn-danger">
                <i class="fas fa-trash-alt"></i>
              </a>
            </td>
          </tr>
        </tbody>
      </table>
      <!-- <nav v-if="pages" aria-label="Page navigation example">
        <ul class="pagination d-flex justify-content-center">
          <li v-if="pages.pages != 1" class="page-item" style="background: rgba(0,0,0,.1) !important;" v-for="(page,index) in pages.paginate.pages" :key="index">
            <a :id="'page'+page.page" @click="changePages(page.page)" class="page-link" :class="('page'+page.page == 'page1') ? 'active': ''">{{page.page}}</a>
          </li>
        </ul>
      </nav> -->
    </div>
    <detailSell :dataDetail="dataDetail" />
  </div>
</template>

<script>
import detailSell from '@/components/modals/detailSell.vue';
import Loader from '@/helpers/Loader';
import $ from 'jquery';
import exportFromJSON from 'export-from-json'

export default {
  name: 'cardTable',
  data(){
    return{
      dataDetail: null,
      fileName: null,
    }
  },
  mounted() {
    this.$store.dispatch('waiters/getAllWaiters');
  },
  components:{
    detailSell
  },
  props:['pages','th','tr','details','remove','cardTitle','idTarget','center', 'waiter_id'],
  methods:{
    // changePages(val){
    //   for (var i = 0; i <= this.pages.pages; i++) {
    //     $('#page'+i).removeClass('active');
    //   }
    //   $('#page'+val).addClass('active');
    //
    //   this.$emit("getSells", val, 'loaderReportPage');
    // },
    descargarExcel(){
      var fields = [];
      var arrayTh = this.th;
      var arrayTr = this.tr;

      var fields = []
      arrayTr.forEach( function(tr, trval) {
          fields.push({});
          arrayTh.forEach( function(th, thval) {
              fields[trval][th] = tr[thval];
          })
      });

      const data = fields;
      const fileName = this.cardTitle;
      const exportType = exportFromJSON.types.xls;
      exportFromJSON({data, fileName, exportType});
    },
    async openDetails(id){
      Loader.containe(this.$refs.loaderTable);
        var request = await this.$store.dispatch('sells/getSell', id);
        console.log(request);
        if(!request.success){
          this.$awn.alert('Error al buscar las ventas');
        }
        this.dataDetail = request.data;
        $('#detailSell').modal('show');
      Loader.hide();
    },
  },
  computed: {
    waiters: { get(){ return this.$store.getters['waiters/getAllWaiters'] }}
  }
}
</script>
<style media="screen">
  th{
    font-weight: bold !important;
  }
  td{
    font-weight: 600 !important;
  }
  .pa-auto{
    padding: auto !important;
  }
  .scrollTableReport{
    overflow-y: auto;
    max-height: 300px;
  }
</style>
