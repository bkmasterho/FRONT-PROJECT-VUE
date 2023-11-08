<template>
  <div style="" class="modal full-modal fade" id="clientCreate" tabindex="-1" role="dialog" aria-labelledby="clientCreate" aria-hidden="true" data-backdrop="false">
    <div class="modal-dialog full-modal-dialog modal-md modal-dialog-centered" role="document">
      <div class="modal-content full-modal-content">
        <div class="modal-header bg-success">
          <h5 class="modal-title" >Datos del cliente/factura</h5>
        </div>
        <div class="modal-body full-modal-body row">
          <!--(html)__( 'detalles de referencia' )_____________________________________________________________________________________________________________-->
          <div class="col-12">
            <div class="row">
                  <button type="button" class="btn btn-primary co-12 col-sm-6" value="0" @click="Jdetalles">Detalles de referenacia</button>

                <div class="row" v-if="detalle_referencia">
                  <div class="form-group col-md-6 col-12">
                    <label class="text-label" for="documento-referencia">Documento de Referencia</label>
                    <select class="form-control" id ="documento-referencia" v-model="documento_referencia">
                      <option value="801"  selected >Orden de Compra</option>
                      <option value="803">Contrato</option>
                      <option value="802">Nota de Pedido</option>
                      <option value="52">Guia de Despacho Electronico</option>
                      <option value="50">Guia de Despacho Manual</option>
                    </select>
                  </div>
                  <div  class="form-group col-md-6 col-12">
                    <label class="text-label" for="folio-ref">Orden de Compra (Opcional)</label>
                    <input id="folio-ref" type="text" class="form-control"  placeholder="Orden de Compra" :disabled="waitResponse"
                    v-model="comment" maxlength="18">
                  </div>
                 
                </div>
              </div> 
          </div>


          <div class="col-12"><hr class="text-success"></div>
           <!--(html)__( 'start rut del cliente' )_____________________________________________________________________________________________________________-->
           <div class="form-group col-12">
              <label class="text-label" for="rut">Rut del cliente</label>
              <input id="rut" @change="serchClient(false)" type="text" :class="['form-control form-control-border checked', (rut != '' || rut != null) ? 'text-uppercase' : ''] " placeholder="Rut del cliente" :disabled="waitResponse"
              v-model="rut" @keyup.enter="newClient" maxlength="10">
            </div>
          <!--(html)__( 'end rut del cliente' )_____________________________________________________________________________________________________________-->
          
          <!--(html)__( 'start fechas' )_____________________________________________________________________________________________________________-->
            <div class="form-group col-md-6 col-12">
              <label class="text-label" for="fecha-emision">Fecha de Emision</label>
              <date-picker class="widthInput" format="YYYY-MM-DD" type="date" v-model="fecha_emision" placeholder="Fecha Emision" confirm></date-picker>
            </div>
            <div class="form-group col-md-6 col-12">
              <label class="text-label" for="fecha-vencimiento">Fecha de Vencimiento</label>
              <date-picker class="widthInput" format="YYYY-MM-DD" type="date" v-model="fecha_vencimiento" placeholder="Fecha Vencimiento" confirm></date-picker>
            </div>
          <!--(html)__( 'end fechas' )_____________________________________________________________________________________________________________-->
         
          <div class="form-group col-md-6 col-12">
            <label class="text-label" for="forma-de-pago">Forma de pago</label>
            <select class="form-control" id ="forma-de-pago" v-model="forma">
              <option value="1" selected>Contado</option>
              <option value="2">Credito</option>
              <option value="3">Gratuito</option>
            </select>
          </div>
          <div class="form-group col-md-6 col-12">
            <label class="text-label" for="nro-transaccion">Nro Transaccion</label>
            <input id="nro-transaccion" type="text" class="form-control form-control-border"  placeholder="Nro Transaccion" :disabled="waitResponse"
            v-model="nro_transaccion" maxlength="100">
          </div>
          <div class="col-12"><hr></div>
          <!--(html)__( 'razon social' )_____________________________________________________________________________________________________________-->
            <div class="form-group col-12">
              <label class="text-label" for="razon_social">Razon social</label>
              <input id="razon_social" type="text" class="form-control form-control-border checked" placeholder="Razon social" :disabled="waitResponse"
              v-model="razon_social" @keyup.enter="newClient" maxlength="100">
            </div>
          <!--(html)__( 'end razon social' )_____________________________________________________________________________________________________________-->
          
          <div v-if="clientsPhone" class="form-group col-12">
            <label class="text-label" for="phone">Telefono</label>
            <input id="phone" type="text" class="form-control form-control-border" placeholder="Telefono" :disabled="waitResponse"
            v-model="phone" @keyup.enter="newClient" maxlength="20">
          </div>
          
          <div class="form-group col-md-6 col-12" v-if="siiInstalado">
            <label class="text-label" for="direction">Dirección</label>
            <input id="direction" type="text" class="form-control form-control-border checked" placeholder="Dirección" :disabled="waitResponse"
            v-model="direction" @keyup.enter="newClient" maxlength="70">
          </div>
          <div class="form-group col-md-6 col-12" v-if="siiInstalado">
            <label class="text-label" for="giro">Giro del receptor</label>
            <input id="giro" type="text" class="form-control form-control-border checked" placeholder="Giro del receptor" :disabled="waitResponse"
            v-model="giro" @keyup.enter="newClient" maxlength="80">
          </div>
          <div class="form-group col-md-6 col-12">
            <label class="text-label" for="city">Ciudad</label>
            <input id="city" type="text" class="form-control form-control-border checked" placeholder="Ciudad" :disabled="waitResponse"
            v-model="city" @keyup.enter="newClient" maxlength="20">
          </div>
          <div class="form-group col-md-6 col-12">
            <label class="text-label" for="comuna">Comuna</label>
            <input id="comuna" type="text" class="form-control form-control-border checked" placeholder="Comuna" :disabled="waitResponse"
            v-model="comuna" @keyup.enter="newClient" maxlength="20">
          </div>
          <div class="form-group col-12">
            <label class="text-label" for="observacion">Observacion</label>
            <input id="observacion" type="text" class="form-control form-control-border" placeholder="Observacion" :disabled="waitResponse"
            v-model="observacion" maxlength="20">
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-danger " @click="closeModal">Cerrar</button>
          <button type="button" class="btn btn-success " @click="newClient" :disabled="waitResponse">{{(rutUser != null) ? 'Guardar' : 'Crear' }}</button>
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
      observacion:'',
      forma:1,
      comment:'',
      nro_transaccion:'',
      documento_referencia:0,
      detalle_referencia:false,
      fecha_emision:new Date(), // moment(date[0]).format
      fecha_vencimiento:new Date(),
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
      $('#clientCreate').modal('hide');
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
      if(this.input_checked("checked"))
      {
        
      this.myClient = null;
      // if(!RegexSii.testRut(this.rut)) {
      //   this.$awn.alert("El rut del cliente esta mal construido");
      //   return false;
      // }
      this.waitResponse = true;
      if(this.clientsObligatorio){
        // SE VALIDAN LOS SIGUIENTES CAMPOS
        var fields = ['rut','city','comuna','razon_social'];
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
        // VALIDACION DE CAMPOS
        for (var field of fields) {
          if (!this[field] || this[field] == '' || this[field] == null){
            this.$awn.alert('Debes llenar todos los campos');
            this.waitResponse = false;
            return;
          }
        }
      }
      // ASIGNACION DE VALOR POR DEFECTO a ''
      var fields = ['name','lastname','rut','city','comuna','razon_social','phone','direction','giro','observacion', 'comment'];
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
        giro: this.giro,
        observacion: this.observacion,
        forma:this.forma,
        comment:this.comment,
        nro_transaccion:this.nro_transaccion,
        fecha_emision:this.formatFecha(this.fecha_emision),//this.fecha_emision.getFullYear()+"-"+(((this.fecha_emision.getMonth()+1) < 10) ? "0"+(this.fecha_emision.getMonth()+1) : (this.fecha_emision.getMonth()+1) )+"-"+((this.fecha_emision.getDate() < 10) ? "0"+this.fecha_emision.getDate() : this.fecha_emision.getDate()),
        fecha_vencimiento:this.formatFecha(this.fecha_vencimiento),
        documento_referencia:this.documento_referencia
      }
      // Actualizando store
      this.$store.commit('main/updateItem', {key: 'clients', data: data});
      // envio de datos al servidor
      /*
          // api/local/sell
          en el servidor
          SellsController@newSell
          SIIController@processFactura
          ServicesSII@processFactura_con_Data
          StringXML@facturaXML_con_Data
      */
      this.$emit('sendInfo', data);

      // LIMPIADO DE CAMPOS
      for (var field of fields) {
        this[field] = '';
      }

      this.waitResponse = false;
      // Gurdando datos en local
      var verify = this.$store.dispatch('main/serchItem', {keyState: 'clients', data: {key: 'rut', value: data.rut}});
      if(!verify) this.$store.commit('main/addItem', {key: 'clients', data: data});
      $('#clientCreate').modal('hide');
      }else{
        this.$awn.alert('Debes completar los campos selccionas');
      }
    },
    formatFecha(fecha) {
      return fecha.getFullYear()+"-"+(((fecha.getMonth()+1) < 10) ? "0"+(fecha.getMonth()+1) : (fecha.getMonth()+1) )+"-"+((fecha.getDate() < 10) ? "0"+fecha.getDate() : fecha.getDate())
    },
    __focused(id) { id.focus(); },
    __input_chek_string(id) {
        if (id.value.length > 0) {
            $(id).removeClass("border border-3 border-danger shadow is-invalid");
            //$(id).addClass("is-valid");

        } else {
            $(id).addClass("border border-3 border-danger shadow is-invalid");
            //$(id).removeClass("is-valid");
        }
    },
    Jdetalles() {
      this.detalle_referencia = !this.detalle_referencia
    },

    
    input_checked(classe) {
      
    let metaFocus = false
    let val = true;
    let tinput = $("." + String(classe))
    for (var i = 0; i < tinput.length; i++) {
        let newInput = tinput[i]

        if (newInput.value.length < 1) {
            if (val == true) { metaFocus = newInput }
            val = false;
            this.__input_chek_string(newInput);
        }
    }
    if (metaFocus != false) { this.__focused(metaFocus) }
    console.log("cheked",val)
    return val;
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
  
  .text-label{
    font-size: 12px;
    font-weight: lighter;
    color: rgb(23, 27, 53);
  }
  .text-uppercase{
    text-transform: uppercase;
  }

  
.full-modal {
    background-color: rgba(0, 0, 0, 0.212);
    /*efecto desenfoque*/
    /*-webkit-backdrop-filter: blur(1px);*/
    /*backdrop-filter: blur(1px);*/
    /*efecto desenfoque*/
    padding-left: 80px !important;
    /*shadow la derecha*/





}

.full-modal-dialog {

    height: 100% !important;
    margin: 0 !important;
    padding: 0 !important;
}

.full-modal-content {

    height: 100% !important;
    border: 0 !important;
    border-radius: 0 !important;
}

.full-modal-body {
    overflow-y: auto;
}
</style>
