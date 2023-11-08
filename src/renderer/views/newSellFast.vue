<template>
  <div class="bg-fastSell">
    <div class="rgbaBlack2 d-flex flex-column align-items-center justify-content-center">
      <h1 class="text-bienvenida text-white">
        Venta rapida
      </h1>
      <!-- Card -->
      <div class="card">
        <div class="card-body">
          <h4 class="card-title">
            Fije un monto
          </h4>

          <input class="input-sell" placeholder="Monto" type="text" v-model="total">

          <div class="text-right">
            <a @click="sendInfo()" href="#" class="btn bg-primario m-0 mt-3">Realizar venta</a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Loader from '../helpers/Loader.js';
import Print from '../helpers/Print.js'
import ConfigHelper from '../helpers/ConfigHelper.js';
export default {
  name:'sellFast',
  data(){
    return{
      total: null
    }
  },
  methods:{
    async sendInfo(){
      // Verificando datos
      if(this.total == null) return this.$awn.alert('Porfavor ingrese un monton de venta');
      Loader.fullPage();
      // Asignando datos
      var data = new FormData();
      data.append('total', this.total);
      data.append('type_sell', 'boleta');
      // Iniciando peticion
      var request = await this.$store.dispatch("sells/fastSell", data);
      console.log(request);

      await this.verifyResponse(request);
      Loader.hide();
    },

    async verifyResponse(request){
      // Verificando respuesta
      if (request.success) {
        this.total = null;
        this.$awn.success("Venta realizada con exito",{labels:{success:'CORRECTO'}});
        if(request.data.response_folio == 'boleta' || request.data.response_folio == 'factura') {
          this.$awn.info('El ajuste de '+ request.data.response_folio+' se encuentra desactivado');
        }else if (request.data.response_folio) {
          var printPDF = await Print.printBase64(request.data.response_folio);
        }
      }else{
        if(request.data.id){
          this.total = null;
          this.$awn.success("Venta realizada con exito",{labels:{success:'CORRECTO'}});
          this.$awn.alert(request.data.response_folio);
        }else{
          this.$awn.alert(request.data);
        }
      }
      return true;
    },
  },
}
</script>

<style media="screen" scoped>
.card{
  width: 100%;
  max-width: 500px;
}
.card-body{
  padding: 30px 1.25rem;
}
.bg-fastSell{
  background-image: url('../assets/fast_sell.jpg');
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  min-height: 100vh;
}
.rgbaBlack2{
  background: rgba(0,0,0,.8);
  min-height: 100vh;
}
.input-sell{
  width: 100%;
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 10px;
}
</style>
