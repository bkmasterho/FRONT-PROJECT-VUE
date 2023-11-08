<template>
  <div class="modal fade" id="quantityProduct" tabindex="-1" role="dialog" aria-labelledby="quantityProduct" aria-hidden="true" data-backdrop="false">
    <div class="modal-dialog modal-md modal-dialog-centered" role="document">
      <div class="modal-content">
        <div class="modal-header bg-primario" v-if="productQuantity">
          <h5 class="modal-title text-capitalize">{{productQuantity.name}}</h5>
        </div>
        <div class="modal-body">
          <div class="form-group w-100">
            <label for="quantity">Cantidad de productos a añadir</label>
            <input id="quantity" type="number" class="form-control" min="1" placeholder="Añadir cantidad" v-model="quantity" @keyup.enter="sendInfo" />
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn bg-secundario text-white" @click="closeModal">Cerrar</button>
          <button type="button" class="btn bg-primario text-white" @click="sendInfo">Confirmar</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import $ from 'jquery';
import ConfigHelper from '@/helpers/ConfigHelper.js';
export default {
  name: 'quantityProduct',
  data(){
    return{
      quantity: 1,
    }
  },
  props:[
    'productQuantity'
  ],
  computed:{
    cecinaInstalled:{
      get(){
        return ConfigHelper.ConfStr('modulos.productos.ajustes.permitir_cecina');
      }
    },
  },
  methods:{
    closeModal(){
      this.$emit('closeModal');
      $('#quantityProduct').modal('hide');
    },
    sendInfo(){
      if(this.quantity == null || this.quantity == ''){
        this.$awn.alert("Por favor inserte una cantidad valida");
        return false;
      }
      var price = 0;
      if(this.productQuantity.prices){
        if (this.productQuantity.prices.length) {
          var precios = this.productQuantity.prices;
          for (var i = 0; i < precios.length; i++) {
            if (precios[i+1]) {
              if (parseFloat(this.quantity) >= parseFloat(precios[i].cantidad) && parseFloat(this.quantity) < parseFloat(precios[i+1].cantidad)) {
                price = precios[i].precio;
                break;
              }
            }else{
              price = precios[i].precio;
            }
          }
        }else{
          price = this.productQuantity.price;
        }
      }else{
        price = this.productQuantity.price;
      }
      var product = {
        id: this.productQuantity.id,
        name: this.productQuantity.name,
        price: price,
        quantity: this.quantity,
        prices: this.productQuantity.prices,
        cecina: (this.productQuantity.cecina)?true:false,
        ganancia: this.productQuantity.ganancia
      };
      this.$emit("quantityAdd", product);
      this.quantity = 1;
    },
  },
}
</script>

<style scoped>
  .modal-md{
    width: 30vw;
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
