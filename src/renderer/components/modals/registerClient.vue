<template>
  <div class="modal fade" id="clientCreate2" tabindex="-1" role="dialog" aria-labelledby="clientCreate" aria-hidden="true" data-backdrop="false">
    <div class="modal-dialog modal-md modal-dialog-centered" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" >Datos del cliente</h5>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body row">
          <h1>asdasd</h1>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn bg-secundario text-white" data-dismiss="modal">Cerrar</button>
          <button type="button" class="btn bg-primario text-white" @click="newClient" :disabled="waitResponse">Crear</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import $ from 'jquery';
import BaseUrl from '@/helpers/baseUrl.js';
import ConfigHelper from '@/helpers/ConfigHelper.js';
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
  methods:{
    async serchClient(){
      // Busqueda local
      Loader.fullPage();
      var req = await this.$store.dispatch('main/serchItem', {keyState: 'clients', data: {key: 'rut', value: this.rut}});
      if(!req){
        // Busqueda en el backend
        req = await this.$store.dispatch('sells/getClient', this.rut);
        Loader.hide();

        if(!req.success) return this.$awn.info('Cliente no registrado');

        req = req.data;
      }
      Loader.hide();
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
      this.$awn.success('Cliente encontrado',{labels:{success:'CORRECTO'}});
    },

    async newClient(){
      this.waitResponse = true;
      if(this.clientsObligatorio){
        var fields = ['name','lastname','rut','city','comuna','razon_social'];
        if (this.clientsPhone) {
          fields.push('phone');
        }
        if (this.siiInstalado) {
          fields.push('direction');
          fields.push('giro');
        }
        for (var field of fields) {
          if (!this[field] || this[field] == ' '){
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
      console.log('Data cliente: ', data);
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
