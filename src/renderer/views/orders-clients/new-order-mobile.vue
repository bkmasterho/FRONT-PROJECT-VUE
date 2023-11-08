<template>
  <div class="product-bg d-flex flex-column p-3">
      <div class="w-100">
        <div class="row">
          <div class="col-12 col-md-10">
            <h3 class="text-primario w-100">{{(!this.edit) ? 'Nueva orden de dispositivo' : 'Editar orden de dispositivo'}}</h3>
            <hr class="borderTitleCafeteria" />
          </div>
          <div class="col-12 col-md-2">
            <div class="w-100 flexEndRowBotton">
              <button type="button" class="btn bg-primario text-white" @click="newOrderMobile" :disabled="waitResponse">
                {{(!this.edit) ? 'Crear' : 'Editar'}}
              </button>
            </div>
          </div>
        </div>
      </div>
      <div class="row">
        <!-- DATOS DEL CLIENTE -->
        <div class="col-md-6 col-12 my-2">
          <div class="col-12 w-100">
            <div class="card-container w-100">
              <div class="card-header">
                <h4>Datos del cliente</h4>
              </div>
              <div class="card-container-body">
                <div class="d-flex row flex-wrap">
                  <div class="form-group col-md-6 col-12">
                    <label>Rut</label>
                    <input type="text" class="form-control" placeholder="Rut" :disabled="waitResponse"
                    v-model="data.order.client.rut" @keyup.enter="newOrderMobile"
                    @change="getClientByRut">
                  </div>
                  <div class="form-group col-md-6 col-12">
                    <label>Email</label>
                    <input type="text" class="form-control" placeholder="Email" :disabled="waitResponse"
                    v-model="data.order.client.email" @keyup.enter="newOrderMobile">
                  </div>
                  <div class="form-group col-md-6 col-12">
                    <label>Nombre</label>
                    <input type="text" class="form-control" placeholder="Nombre" :disabled="waitResponse"
                    v-model="data.order.client.name" @keyup.enter="newOrderMobile">
                  </div>
                  <div class="form-group col-md-6 col-12">
                    <label >Apellido</label>
                    <input type="text" class="form-control" placeholder="Apellido" :disabled="waitResponse"
                    v-model="data.order.client.lastname" @keyup.enter="newOrderMobile">
                  </div>
                  <div class="form-group col-md-6 col-12" v-if="allowPhone">
                    <label >Telefono</label>
                    <input type="text" class="form-control" placeholder="Telefono" :disabled="waitResponse"
                    v-model="data.order.client.phone" @keyup.enter="newOrderMobile">
                  </div>
                </div>
              </div>
            </div>
          </div>
          <!-- DATOS DE LA ORDEN -->
          <div class="col-12 mt-3 w-100">
            <div class="card-container w-100">
              <div class="card-header">
                <h4>Datos de la orden</h4>
              </div>
              <div class="card-container-body">
                <div class="d-flex row flex-wrap">
                  <div class="form-group col-md-6 col-12">
                    <label >Tecnico</label>
                    <select class="browser-default custom-select" v-model="data.technician_id">
                      <option selected disabled value="">Tecnico</option>
                        <template
                          :v-if="allUsers && allUsers.length && tecnico"
                          v-for="(tecnico) in allUsers"
                        >
                          <template v-if="tecnico && tecnico.id">
                            <option
                              :v-if="tecnico && tecnico.id"
                              :value="tecnico.id"
                              class="text-capitalize"
                              :key="'tecnico-option-i' + tecnico.id"
                            >
                              {{ tecnico.fullname }}
                            </option>
                          </template>
                        </template>
                    </select>
                  </div>
                  <div class="form-group col-md-6 col-12">
                    <label>Presupuesto</label>
                    <input type="text" class="form-control" placeholder="Presupuesto" :disabled="waitResponse"
                    v-model="data.budget" @keyup.enter="newOrderMobile">
                  </div>
                </div>
              </div>
            </div>
          </div>
          <!--/ DATOS DE LA ORDEN -->
        </div>
        <!--/ DATOS DEL CLIENTE -->
        <!-- DATOS DEL EQUIPO -->
        <div class="col-md-6 col-12 my-2">
          <div class="card-container">
            <div class="card-header">
              <h4>Datos del equipo</h4>
            </div>
            <div class="card-container-body">
              <div class="d-flex row flex-wrap">
                <div class="form-group col-md-6 col-12">
                  <label>Imei del equipo</label>
                  <input type="text" class="form-control" placeholder="Imei del equipo" :disabled="waitResponse"
                  v-model="data.device_imei" @keyup.enter="newOrderMobile"
                  @change="getDeviceByImei">
                </div>
                <div class="form-group col-md-6 col-12">
                  <label>Falla del equipo</label>
                  <input type="text" class="form-control" placeholder="Falla del equipo" :disabled="waitResponse"
                  v-model="data.device_failure" @keyup.enter="newOrderMobile">
                </div>
                <div class="form-group col-md-6 col-12">
                  <label>Contraseña</label>
                  <input type="text" class="form-control" placeholder="Contraseña" :disabled="waitResponse"
                  v-model="data.device_password" @keyup.enter="newOrderMobile">
                </div>
                <div class="form-group col-md-6 col-12">
                  <label >Modelo del equipo</label>
                  <select class="browser-default custom-select" v-model="data.device_model">
                    <option selected disabled value="">Modelos</option>
                      <option
                        :value="modelIndex" v-for="(model, modelIndex) in device_models"
                        class="text-capitalize"
                        :key="'model-option-i' + modelIndex"
                      >
                        {{ model }}
                      </option>
                  </select>
                </div>
              </div>
              <div class="d-flex row flex-wrap">
                <div class="form-group col-md-6 col-12">
                  <label >Condicion del equipo</label>
                  <div v-for="(condition, conditionIndex) in device_conditions" :key="'condition-option-i' + conditionIndex">
                    <input
                            v-model="data.device_condition"
                            type="checkbox"
                            :id="'condition_option_' + conditionIndex"
                            :value="conditionIndex"
                    />
                    <span>{{ condition }}</span>
                  </div>
                </div>
                <div class="form-group col-md-6 col-12">
                  <label >Observaciones</label>
                  <textarea rows="4" cols="80" style="width: 100%;"
                            class="form-control" placeholder="Observaciones"
                            :disabled="waitResponse"
                            v-model="data.observations"
                            >
                  </textarea>
                </div>
              </div>
              <div class="d-flex row flex-wrap" v-if="deviceData">
                <div class="col-12">
                  <label>Informacion adicional del equipo</label><br/>
                </div>
                <div class="form-group col-12">
                  <p>{{ deviceData.description }}</p>
                  <br />
                </div>
                <div class="form-group col-12" v-if="deviceData">
                  <span v-for="(item, index_item) in deviceData.json" :key="'key-data-device-' + index_item">
                    <b>{{ item[0] }}</b> {{ item[1] }}
                    <br />
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!--/ DATOS DEL EQUIPO -->
      </div>
      <div class="footer">
      </div>
  </div>
</template>

<script>
import $ from 'jquery';
import BaseUrl from '@/helpers/baseUrl.js';
import Loader from '@/helpers/Loader';
import AllErrors from '@/helpers/AllErrors.js';
import Print from '@/helpers/Print.js';
import ConfigHelper from '@/helpers/ConfigHelper.js';

export default {
  data(){
    return {
      data: {
        order: {
          client: {
            rut: '',
            name: '',
            lastname: '',
            email: '',
            phone: ''
          }
        },
        contact_email: '',
        contact_phone: '',
        device_model: '',
        device_condition: [],
        device_failure: '',
        device_imei: '',
        device_password: '',
        observations: '',
        technician_id: null,
        budget: 0
      },
      deviceData: null,
      waitResponse: false,
      edit: false,
      id: null
    }
  },
  async mounted(){
    this.initLoading();
    await this.getAllUsers();
    this.endLoading();
  },
  methods:{
    async getAllUsers() {
      await this.$store.dispatch("main/getAllUsers");
    },
    initLoading() {
      this.waitResponse = true;
      Loader.fullPage();
    },
    endLoading() {
      this.waitResponse = false;
      Loader.hide();
    },
    async createOrUpdateRequest(payload) {
      if (this.edit) return await this.$store.dispatch("client_orders/mobile_devices/update", {
          id:this.id,
          payload
      });
      return await this.$store.dispatch("client_orders/mobile_devices/store", payload);
    },
    getFormData() {
      const fields = [
        'order','device_model','device_condition','device_failure','device_imei',
        'device_password','observations','technician_id','budget'
      ];
      if (this.allowPhone) fields.push('phone');
      const fd = new FormData();
      for (var field of fields) {
        /*if (!this.edit && ((!this.data[field] || this.data[field] == ' '))) {
          this.$awn.alert('Debes llenar todos los campos');
          return;
        }*/
        if (field === 'order')
          fd.append(field, JSON.stringify(this.data[field]));
        else if (field === 'device_condition')
          fd.append(field, JSON.stringify(this.data[field]));
        else
          fd.append(field, this.data[field]);
      }
      if (this.data.order && this.data.order.client && this.data.order.client.email)
        fd.append('contact_email', this.data.order.client.email);
      if (this.data.order && this.data.order.client && this.data.order.client.phone)
        fd.append('contact_phone', this.data.order.client.phone)
      return fd;
    },
    sucessMessage() {
      if (this.edit) this.$awn.success('Orden Editada Exitosamente',{
        labels: { success:'CORRECTO' }
      });
      else this.$awn.success('Orden Creada Exitosamente',{
        labels: { success:'CORRECTO' }
      });
    },
    // Guardar o editar usuario
    async newOrderMobile(){
      // Obtener datos
      const payload = this.getFormData();

      // Iniciando carga
      this.initLoading();

      // Iniciando tipo de peticion
      const request = await this.createOrUpdateRequest(payload);

      Loader.hide();
      if (request.success){
        await this.$store.dispatch("main/checkAuth");
        console.log('SUCCESS', request);
        const printPDF = await Print.printBase64(request.data.printeable);
        this.sucessMessage();
        this.$emit('refresh');
        this.goToList();
      }else{
        console.log(request.data);
        AllErrors.getError(request.data);
      }
      this.endLoading();
    },
    // Ir a lista
    goToList() {
      this.$router.push('/inicio/client-orders/mobile-devices/lista');
    },
    // Obtener cliente
    async getClientByRut() {
      this.waitResponse = true;
      const req = await this.$store.dispatch('clients/retrieveClient', this.data.order.client.rut);
      if (req.success) {
        this.data.order.client = req.data;
      }else{
        console.log('Req Result:', req);
        this.$awn.info('Cliente no registrado');
      }
      this.waitResponse = false;
    },
    // Obtener equipo
    async getDeviceByImei() {
      this.waitResponse = true;
      const req = await this.$store.dispatch('client_orders/mobile_devices/fetchDevice', this.data.device_imei);
      if (req.success) {
        this.deviceData = req.data;
      }else{
        console.log('Req Result:', req);
        this.deviceData = null;
        this.$awn.info('Equipo no encontrado');
      }
      this.waitResponse = false;
    },
  },
  computed:{
    // Roles
    roles:{ get() { return this.$store.getters['roles/getterRoles']; } },
    // Everioments
    envs: { get() {
      const envs = this.$store.getters['main/getEnvs'];
      if (envs) return envs;
      return {
        client_orders_device_models: { value: '{}' },
        client_orders_device_conditions: { value: '{}' }
      }
    } },
    device_models: { get() { return JSON.parse(this.envs.client_orders_device_models.value); } },
    device_conditions: { get() { return JSON.parse(this.envs.client_orders_device_conditions.value); } },
    // Usuarios
    allUsers: { get() { return this.$store.getters['main/allUsers']; } },
    // Allow Phones
    allowPhone: { get() { return ConfigHelper.ConfStr('modulos.ventas.submodulos.clientes.ajustes.cliente_telefono'); } }
  }
}

</script>
<style scoped>
  .card-container {
    border-radius: 4px;
    box-shadow: 0px 0px 4px 3px rgba(0,0,0,.2);
    background: white;
  }
  .card-header {
    padding: 10px;
    padding-left: 15px;
    padding-right: 15px;
  }
  .card-header h4 {
    margin: auto;
  }
  .card-container-body {
    padding: 10px;
    padding-left: 15px;
    padding-right: 15px;
  }
  .flexEndRowBotton {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
  }
</style>
