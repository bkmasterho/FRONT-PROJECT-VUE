<template>
  <div class="landing-bg">
    <div class="d-flex w-100 h-100 flex-column align-items-center py-2 justify-content-center">
      <div class="text-center mb-xl-4">
        <img src="@/assets/logo.png" alt="Logo" class="brand-image2">
        <h4 class="logo-text">Sincronizacion de aplicaciones</h4>
      </div>
      <div class="shadow-down card mt-4 mb-xl-4">
        <div class="card-body d-flex flex-column w-100 align-items-center">
          <h5>Serial de la aplicacion</h5>
          <div class="form-group w-100 px-3 mt-2">
            <input type="text" class="form-control text-center" v-model="serial"
            @keyup.enter="sendSerial" :disabled="waitResponse" id="serialInput">
          </div>
          <button type="button" class="mt-2 btn btn-serial" @click="sendSerial" :disabled="waitResponse">Establecer</button>
        </div>
      </div>
      <div class="shadow-down border-r mt-4 info-card p-3 d-flex align-items-center">
        <div class="col-7 text-center">
          <span>Introduzca el serial asignado para sincronizar su cliente local con su aplicacion en la nube</span>
        </div>
        <div class="col-5 text-center">
          <i class="fas fa-cloud cloud-icon"></i>
        </div>
      </div>
      <br />
      <div class="gray-text-version" v-if="true">
        App in {{ appInProduction }} || Versión {{ version }}
      </div>
    </div>
  </div>
</template>

<script>

import ConfigHelper from '../helpers/ConfigHelper.js';
import Loader from '@/helpers/Loader';

const remote = require('electron').remote;
const Inputmask = require('inputmask');
const $ = require('jquery');

export default {
  name: 'landing-page',
  components: { },
  data(){
    return{
      serial: '',
      w: remote.getCurrentWindow(),
      waitResponse: false,
      appInProduction: process.env.NODE_ENV
    }
  },
  props:['version'],
  created(){

    ConfigHelper.readAppFile((err, data) => {
      if(err) return;
      //Si el archivo se leyo correctamente, saltar al login
      ConfigHelper.ConfigHandler(false, JSON.parse(data), false);
    });
  },
  mounted(){
    var serialInput = document.getElementById("serialInput");
    var im = new Inputmask("****-****-****-****-****");
    im.mask(serialInput);
  },
  methods: {
    async sendSerial(){
      this.waitResponse = true;
      Loader.fullPage();
      let request = await this.$store.dispatch("main/sendSerial",this.serial);
      console.log(request);
      if (request.success) {
        ConfigHelper.writeFile(request.data, 'aplication.json', (err) => {
          if(err){
            this.$awn.alert(err);
            return;
          }
          // console.log(request.data);
          this.$awn.success('Archivo creado',{labels:{success:'CORRECTO'}});
          this.w.reload();
        });
      }else{
        Loader.hide();
        this.waitResponse = false;
        this.$awn.alert(request.data);
      }
    }
  }
}
</script>

<style media="screen">
  .gray-text-version {
    color: gray;
  }
</style>
