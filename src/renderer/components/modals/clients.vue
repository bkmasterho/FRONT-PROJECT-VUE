<template>
  <div class="modal fade" id="clientModal" tabindex="-1" role="dialog" aria-labelledby="ClientModal" aria-hidden="true" data-backdrop="false">
  <div class="modal-dialog modal-dialog-centered" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title">{{(!this.edit) ? 'Nuevo cliente' : 'Editar cliente'}}</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close" @click="selectClient">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
        <div class="d-flex flex-wrap row">
            <div class="form-group col-12">
                <label for="name">Nombre</label>
                <input id="name" type="text" class="form-control" placeholder="Nombre" :disabled="waitResponse" v-model="name">
            </div>
            <div class="form-group col-12">
                <label for="lastname">Apellido</label>
                <input id="lastname" type="text" class="form-control" placeholder="Apellido" :disabled="waitResponse" v-model="lastname">
            </div>
            <div class="form-group col-12">
                <label for="rut">R.U.T</label>
                <input id="rut" type="text" class="form-control" placeholder="R.U.T" :disabled="waitResponse" v-model="rut">
            </div>
            <div class="form-group col-12">
                <label for="city">Ciudad</label>
                <input id="city" type="text" class="form-control" placeholder="Cuidad" :disabled="waitResponse" v-model="city">
            </div>
            <div class="form-group col-12">
                <label for="comuna">Comuna</label>
                <input id="comuna" type="text" class="form-control" placeholder="Comuna" :disabled="waitResponse" v-model="comuna">
            </div>
            <div class="form-group col-12">
                <label for="razon_social">Razon Social</label>
                <input id="razon_social" type="text" class="form-control" placeholder="Razon Social" :disabled="waitResponse" v-model="razon_social">
            </div>
            <div class="form-group col-12">
                <label for="phone">Telefono</label>
                <input id="phone" type="text" class="form-control" placeholder="Telefono" :disabled="waitResponse" v-model="phone">
            </div>
            <div class="form-group col-12">
                <label for="direction">Direccion</label>
                <input id="direction" type="text" class="form-control" placeholder="Direccion" :disabled="waitResponse" v-model="direction">
            </div>
            <div class="form-group col-12">
                <label for="giro">Giro</label>
                <input id="giro" type="text" class="form-control" placeholder="Giro" :disabled="waitResponse" v-model="giro">
            </div>
            <div class="form-group col-12">
                <label for="email">Email</label>
                <input id="email" type="text" class="form-control" placeholder="Email" :disabled="waitResponse" v-model="email">
            </div>
        </div>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn bg-secundario text-white" data-dismiss="modal" @click="selectClient">Cerrar</button>
        <button type="button" class="btn bg-primario text-white" :disabled="waitResponse"
        @click="Client">{{(!this.edit) ? 'Crear' : 'Editar'}}</button>
      </div>
    </div>
  </div>
  </div>
</template>

<script>
//ConfigHelper.ConfStr
import $ from 'jquery';
import BaseUrl from '@/helpers/baseUrl.js';
import ConfigHelper from '@/helpers/ConfigHelper.js';
import Loader from '@/helpers/Loader';

const Inputmask = require('inputmask');
import FormatNumber from '@/helpers/FormatNumber.js';
export default {
  data(){
    return{
      id: null,
      name:"",
      lastname:"",
      rut:"",
      city:"",
      comuna:"",
      razon_social:"",
      phone:"",
      direction:"",
      giro:"",
      email:"",
      preview: '',
      waitResponse:false,
      edit: false,
      fields:['name', 'lastname', 'rut', 'city', 'comuna', 'razon_social', 'phone', 'direction', 'giro', 'email']
    }
  },
  computed:{
  },
  mounted(){
  },
  methods:{
    selectClient(){
    this.edit = false;
    this.$emit('closeEdit');
    },
    refreshData(client){
        this.id = client ? client.id : null;
        for (var field of this.fields){
            if(client) { 
                this.edit = true;
                this[field] = client[field];
                
            } else {
                this[field] = '';
                this.edit = false;
            }
        }
    },
    async Client(){
        this.waitResponse = true;
        Loader.fullPage();
        let fd = new FormData();

        for (var field of this.fields){
            fd.append(field, this[field]);
        }
        if (this.edit){
            var request = await this.$store.dispatch("clients/editClients",{id:this.id,data:fd});
        } else { 
            var request = await this.$store.dispatch("clients/editClients",{id:this.id,data:fd});
        }
        Loader.hide();
        if (request.success) {
            if (this.edit){
                this.$awn.success('Cliente Editado Exitosamente',{labels:{success:'CORRECTO'}});
            }else{
                this.$awn.success('Cliente Creado Exitosamente',{labels:{success:'CORRECTO'}});
            }
            this.selectClient();
            this.$emit('refresh');
            $('#clientModal').modal('hide');
        }else {
            let allErrors = request.data;
            if (typeof(allErrors) == 'object') {
                for (var errorkey in allErrors) {
                    if (allErrors[errorkey]){
                        for (var error of allErrors[errorkey]) {
                            this.$awn.alert(error);
                        }
                    }
                }
            }else{
                this.$awn.alert(allErrors);
            }
        }
        this.waitResponse = false;
    }
  }
}
</script>
<style scoped>
.img-lg-custom {
  width: 140px;
  height: 140px;
}
.img-user-edit{
  position: absolute;
  top: 40px;
  width: 140px;
  height: 140px;
  cursor: pointer;
  background: none;
}
.img-user-edit:hover{
  background-image: url('../../assets/iconeditwhite.png');
  image-resolution: snap;
  background-color: rgba(0,0,0,.3);
  background-position: center;
  background-repeat: no-repeat;
  background-size: 60px;
  transition: all .3s ease-out;
}
</style>
