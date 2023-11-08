<template>
  <div class="modal fade" id="crudRoles" tabindex="-1" role="dialog" aria-labelledby="crudRoles" aria-hidden="true" data-backdrop="false">
    <div class="modal-dialog modal-dialog-centered" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">{{(dataEdit) ? 'Editar rol' : 'Crear rol' }}</h5>
          <button type="button" class="close" @click="$emit('closeModal')">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body modal-body-p-0">
          <form role="form" class="p-4">
            <div class="row">
              <div class="form-group col-12">
                <label for="name">Nombre del rol</label>
                <input v-model="name" type="text" :disabled="waitResponse" class="form-control" id="name" >
              </div>
              <div class="form-group col-12">
                <label for="keyname">Nombre clave</label>
                <input v-model="keyname" type="text" :disabled="waitResponse || edit" class="form-control" id="keyname" @keypress="validaInput($event)">
              </div>
              <div class="form-group col-12">
                <div class="custom-control custom-checkbox custom-control-inline">
                  <input v-model="permisoAdmin" type="checkbox" class="custom-control-input" id="defaultInline2">
                  <label class="custom-control-label" for="defaultInline2">Todos los permisos</label>
                </div>
              </div>

              <div v-if="!permisoAdmin" class="form-group col-12">
                <label class="typo__label">Permisos</label>
                <multiselect v-model="permission" tag-placeholder="Añadir" placeholder="Añade un permiso" label="name" track-by="code" :options="permisosApp" :multiple="true" :taggable="true" @tag="addTag"></multiselect>
              </div>
            </div>
          </form>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn text-white px-2 text-capitalize align-self-end" :class="(dataEdit) ? 'text-white bg-secundario' : 'btn-green'" :disabled="waitResponse" @click="sendInfo">
            {{(dataEdit) ? 'Editar' : 'Crear' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ConfigHelper from '@/helpers/ConfigHelper';
import Loader from '@/helpers/Loader';
export default {
  name: 'rolesEditCreate',
  data(){
    return{
      waitResponse:false,
      name:'',
      keyname:'',
      permission: [],
      optionP: [],
      permissionData: [],
      arrayBackend: [],
      permisoAdmin: false,
      edit: false,
    }
  },
  props:[
    'dataEdit'
  ],
  watch: {
   dataEdit: {
      handler(val) {
        console.log(val);
        if (val) {
          this.edit = true;
        }else {
          this.edit = false;
        }
        this.refreshData(val);
      }
    },
  },
  methods:{
    validaInput($event){
      var ch = String.fromCharCode($event.which);

      if((/[^A-Za-z0-9_]+/.test(ch))){
        $event.preventDefault();
      }
    },
    // Funcion de estilos que trae la libreria
    addTag (newTag) {
      const tag = newTag;
      this.permisosApp.push(tag)
      this.permission.push(tag)
    },
    // Funcion que adapta el modal para que edite los roles
    refreshData(data){
      if(data){
        this.name = data.name;
        this.keyname = data.keyname;

        if(data.permission == null){
          this.permisoAdmin = true;
          this.permission = [];
        }else{
          this.permisoAdmin = false;
          this.permission = [];

          var arrayData = JSON.parse(data.permission);
          if (arrayData) {
            for (var i = 0; i < arrayData.length; i++) {
              this.addTag({
                name: this.arrayBackend[ arrayData[i] ],
                code: arrayData[i]
              });
            }
          }
        }
      }else{
        this.name = null;
        this.keyname = null;
        this.permisoAdmin = false;
        this.permission = [];
      }
    },
    // Funcion para editar y crear roles
    async sendInfo(){
      this.waitResponse = true;
      Loader.fullPage();
        if(this.permission){
          this.permissionData = [];
          for (var i = 0; i < this.permission.length; i++) {
            this.permissionData.push(this.permission[i].code);
          }
        }
        if(this.permisoAdmin){
          const data = {
            name: this.name,
            keyname: this.keyname,
            permission: 'null',
          };
          var thing = new FormData();
          for (let key in data) if (data[key]) thing.append(key, data[key]);
        }else{
          const data = {
            name: this.name,
            keyname: this.keyname,
            permission: JSON.stringify(this.permissionData),
          };
          var thing = new FormData();
          for (let key in data) if (data[key]) thing.append(key, data[key]);
        }

        if(this.dataEdit) var request = await this.$store.dispatch("roles/editRole", {data:thing, id:this.dataEdit.id} );
        else var request = await this.$store.dispatch("roles/newRole",thing);
        Loader.hide();

        if(!request.success){
          console.log(request.data);
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
        }else{
          this.name = null;
          this.keyname = null;
          this.permission = [];
          this.permissionData = [];
          this.$awn.success(request.data,{labels:{success:'CORRECTO'}});
          var refreshApp = await this.$store.dispatch('main/refreshData');
          ConfigHelper.writeAppFile(refreshApp.data);
          ConfigHelper.readAppFile((err, data) => {
            if(err) { return; };
            //Si el archivo se leyo correctamente, saltar al login
            console.log('EJECUSION DE ConfigHandler DE ROLES');
            ConfigHelper.ConfigHandler(false, JSON.parse(data), false);

          });
          this.$emit('refreshData');
          this.$emit('closeModal');
        }
       this.waitResponse = false;
    },
  },
  computed:{
    permisosApp:{
      get() {
        var request = this.$store.getters['main/getterpermission'];
        this.arrayBackend = request;
        this.optionP = [];
        for (var key in request) {
          if (request.hasOwnProperty(key)) {
            this.optionP.push({
              name: request[key],
              code: key
            });
          }
        }
        return this.optionP;
      }
    }
  },
}
</script>
