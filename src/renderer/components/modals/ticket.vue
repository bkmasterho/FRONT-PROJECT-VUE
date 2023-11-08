<template>
  <div class="modal fade" id="detailTicket" tabindex="-1" role="dialog" aria-labelledby="detailTicket" aria-hidden="true">
    <div class="modal-dialog modal-md modal-dialog-centered" role="document">
      <div class="modal-content">
        <div class="modal-header bg-primario">
          <h5 class="modal-title">Resumen de la orden</h5>
          <button type="button" class="close text-white" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body p-0">
          <custom-table v-model="jsonTable"/>
          <div class="footerTableTicket d-flex justify-content-between">
            <h5 class="">
              TOTAL
            </h5>
            <h5>
              {{formatNumber(this.total)}}$
            </h5>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn bg-secundario text-white" data-dismiss="modal">Cerrar</button>
          <button type="button" class="btn bg-primario text-white" @click="createTicket" data-dismiss="modal">Crear ticket</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import customTable from '@/components/tables/table.vue';
import FormatNumber from '@/helpers/FormatNumber.js';
// import BaseUrl from '@/helpers/baseUrl.js';

export default {
  data(){
    return{
      jsonTable: {
        btn: false,
        items: null,
        rows:[
          {key:'name', class:'', permission:'default'},
          {key:'quantity', class:'', permission:'default'},
          {key:'subtotal', class:'', permission:'default'},
        ],
        titles:[
          {label:'Nombre', class:'', permission:'default', type:false},
          {label:'Cantidad', class:'', permission:'default', type:false},
          {label:'Subtotal', class:'', permission:'default', type:false},
        ]
      }
    }
  },
  components:{ customTable },
  props:['products','total'],
  watch:{
    products(value){
      this.jsonTable.items = value;
    }
  },
  methods:{
    createTicket(){
      this.$emit('newTicket', true);
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
  },
}
</script>

<style scoped>
  .footerTableTicket{
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 10px 5px 10px;
    border-bottom: 1px solid #dee2e6;
    border-left: 1px solid #dee2e6;
    border-right: 1px solid #dee2e6;
    margin: 0px;
  }
  .modal-md{
    width: 50vw;
  }
  .text-uppercase{
    text-transform: uppercase;
  }
  @media (max-width: 1000px){
    .modal-md{
      width: 80vw;
    }
  }
  @media (max-width: 650px){
    .modal-md{
      width: 100vw;
      margin: 0px !important;
    }
  }
</style>
