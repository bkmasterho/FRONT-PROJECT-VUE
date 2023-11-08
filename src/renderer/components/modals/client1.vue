<template>
  <div style="z-index: 99999999999999999999999999" class="modal fade" id="clientCreate1" tabindex="-1" role="dialog" aria-labelledby="clientCreate1" aria-hidden="true" data-backdrop="false">
    <div class="modal-dialog modal-md modal-dialog-centered" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" >Datos del cliente</h5>
          <button type="button" class="close" @click="closeModal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body row">
          <div class="col-12 d-flex flex-column align-items-center py-4">
            <img class="img-fluid" style="width: 150px; height:150px;" src="@/assets/person.jpg">
          </div>
          <div class="form-group col-md-6 col-12">
            <label for="rut">Rut del cliente</label>
            <input id="rut" @change="serchClient(false)" type="text" :class="['form-control', (rut != '' || rut != null) ? 'text-uppercase' : ''] " placeholder="Rut del cliente" :disabled="waitResponse"
            v-model="rut" @keyup.enter="newClient" maxlength="10">
          </div>
          <div class="form-group col-md-6 col-12">
            <label for="name">Nombre de cliente</label>
            <input id="name" type="text" class="form-control" placeholder="Nombre de cliente" :disabled="waitResponse"
            v-model="name" @keyup.enter="newClient" maxlength="32">
          </div>
          <div class="form-group col-md-6 col-12">
            <label for="lastname">Apellido del cliente</label>
            <input id="lastname" type="text" class="form-control" placeholder="Apellido del cliente" :disabled="waitResponse"
            v-model="lastname" @keyup.enter="newClient" maxlength="32">
          </div>
          <div v-if="clientsPhone" class="form-group col-12">
            <label for="phone">Telefono</label>
            <input id="phone" type="text" class="form-control" placeholder="Telefono" :disabled="waitResponse"
            v-model="phone" @keyup.enter="newClient" maxlength="20">
          </div>
          <div class="form-group col-md-6 col-12">
            <label for="razon_social">Razon social</label>
            <input id="razon_social" type="text" class="form-control" placeholder="Razon social" :disabled="waitResponse"
            v-model="razon_social" @keyup.enter="newClient" maxlength="100">
          </div>
          <div class="form-group col-md-6 col-12" v-if="siiInstalado">
            <label for="direction">Dirección</label>
            <input id="direction" type="text" class="form-control" placeholder="Dirección" :disabled="waitResponse"
            v-model="direction" @keyup.enter="newClient" maxlength="70">
          </div>
          <div class="form-group col-md-6 col-12" v-if="siiInstalado">
            <label for="giro">Giro del receptor</label>
            <input id="giro" type="text" class="form-control" placeholder="Giro del receptor" :disabled="waitResponse"
            v-model="giro" @keyup.enter="newClient" maxlength="80">
          </div>
          <div class="form-group col-md-6 col-12">
            <label for="city">Ciudad</label>
            <input id="city" type="text" class="form-control" placeholder="Ciudad" :disabled="waitResponse"
            v-model="city" @keyup.enter="newClient" maxlength="20">
          </div>
          <div class="form-group col-md-6 col-12">
            <label for="comuna">Comuna</label>
            <input id="comuna" type="text" class="form-control" placeholder="Comuna" :disabled="waitResponse"
            v-model="comuna" @keyup.enter="newClient" maxlength="20">
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn bg-secundario text-white" @click="closeModal">Cerrar</button>
          <button type="button" class="btn bg-primario text-white" @click="newClient" :disabled="waitResponse">{{(rutUser != null) ? 'Guardar' : 'Crear' }}</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import $ from 'jquery';
import BaseUrl from '@/helpers/baseUrl.js';
import ConfigHelper from '@/helpers/ConfigHelper.js';
import RegexSii from '@/classes/RegexSii.js';
import Loader from '@/helpers/Loader';
export default {
  data(){
    return{
      name:'',
      lastname:'',
      rut: '',
      direction: '',
      giro: '',
      city:'',
      comuna:'',
      razon_social: '',
      phone: '',
      waitResponse: false,
    }
  },
  props:{
    rutUser:{
      type: [String, Number],
      default: null
    }
  },
  watch:{
    rutUser(value){
      this.rut = value;
      this.serchClient(true);
    }
  },
  methods:{
    closeModal(){
      $('#clientCreate1').modal('hide');
    },
    async serchClient(loader = false){
      // Busqueda local
      if(!loader) Loader.fullPage();
      var req = await this.$store.dispatch('main/serchItem', {keyState: 'clients', data: {key: 'rut', value: this.rut}});
      if(!req){
        // Busqueda en el backend
        req = await this.$store.dispatch('sells/getClient', this.rut);
        Loader.hide();

        if(!req.success && !loader) return this.$awn.info('Cliente no registrado');

        req = req.data;
      }
      if(!loader){
        Loader.hide();
        this.$awn.success('Cliente encontrado',{labels:{success:'CORRECTO'}});
      }
      // Asignando datos
      this.name = req.name;
      this.lastname = req.lastname;
      this.rut = req.rut;
      this.city = req.city;
      this.comuna = req.comuna;
      this.razon_social = req.razon_social;
      this.phone = req.phone;
      this.direction = req.direction;
      this.giro = req.giro;
    },
    async newClient(){
      this.myClient = null;
      // if(!RegexSii.testRut(this.rut)) {
      //   this.$awn.alert("El rut del cliente esta mal construido");
      //   return false;
      // }
      this.waitResponse = true;
      if(this.clientsObligatorio){
        var fields = ['name','lastname','rut','city','comuna','razon_social'];
        if (this.clientsPhone) {
          if(!RegexSii.testPhone(this.phone)) {
            this.$awn.alert("El telefono no existe, asegurate de escribir solo caracteres numericos");
            return false;
          }
          fields.push('phone');
        }
        if (this.siiInstalado) {
          fields.push('direction');
          fields.push('giro');
        }
        for (var field of fields) {
          if (!this[field] || this[field] == '' || this[field] == null){
            this.$awn.alert('Debes llenar todos los campos');
            this.waitResponse = false;
            return;
          }
        }
      }

      var fields = ['name','lastname','rut','city','comuna','razon_social','phone','direction','giro'];
      for (var field of fields) {
        if(this[field] == null || this[field] == '')
        this[field] = '';
      }

      var data = {
        name: this.name,
        lastname: this.lastname,
        rut: this.rut,
        city: this.city,
        comuna: this.comuna,
        razon_social: this.razon_social,
        phone: this.phone,
        direction: this.direction,
        giro: this.giro
      }
      // Actualizando store
      this.$store.commit('main/updateItem', {key: 'clients', data: data});
      this.$emit('sendInfo', data);

      for (var field of fields) {
        this[field] = '';
      }

      this.waitResponse = false;
      // Gurdando datos en local
      var verify = this.$store.dispatch('main/serchItem', {keyState: 'clients', data: {key: 'rut', value: data.rut}});
      if(!verify) this.$store.commit('main/addItem', {key: 'clients', data: data});
      $('#clientCreate1').modal('hide');
    }
  },
  computed:{
    clientsObligatorio:{
      get(){
        return ConfigHelper.ConfStr('modulos.ventas.submodulos.clientes.ajustes.cliente_obligatorio');
      }
    },
    clientsPhone:{
      get(){
        if (!ConfigHelper.ConfStr('modulos.ventas.submodulos.clientes')) return false
        return ConfigHelper.ConfStr('modulos.ventas.submodulos.clientes.ajustes.cliente_telefono');
      }
    },
    siiInstalado:{
      get(){
        if (!ConfigHelper.ConfStr('modulos.ventas.submodulos.clientes')) return false
        return ConfigHelper.ConfStr('modulos.ventas.submodulos.sii');
      }
    },
  }
}
</script>

<style scoped>
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
