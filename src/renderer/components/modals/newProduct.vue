<template>
  <div class="modal fade" id="newProductModal" tabindex="-1" role="dialog" aria-labelledby="newProductModal" aria-hidden="true" data-backdrop="false">
  <div class="modal-dialog modal-dialog-centered" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title">{{(!this.edit) ? 'Nuevo producto' : 'Editar producto'}}</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close" @click="selectProduct">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">

        <div class="d-flex flex-wrap row">
          <div class="form-group col-12">
            <label for="name">Nombre</label>
            <input id="name" type="text" class="form-control" placeholder="Nombre" :disabled="waitResponse" :class="{ 'invalid-input': submitted && !isValidName}"
            v-model="name" @keyup.enter="newProduct">
          </div>
          <div><hr></div>
          <div class="form-group col-12" v-if="barcodeInstalled">
            <label for="barcode">Codigo de Barras</label>
            <input id="barcode" type="text" class="form-control" placeholder="Codigo de Barras" :disabled="waitResponse" :class="{ 'invalid-input': submitted && !isValidBarcode}"
            v-model="barcode" @keyup.enter="newProduct">
          </div>
          <div class="form-group  col-12" v-if="!precioVariante" >
            <label for="priceInput">Precio de Venta</label>
            <div class="input-group mb-3">
              <span class="input-group-text" id="basic-addon1">$</span>
              <input type="number" class="form-control" placeholder="Precio" :disabled="waitResponse" :class="{ 'invalid-input': submitted && !isValidPrice}"
              v-model="price" @keyup.enter="newProduct" id="priceInput" maxlength="15" v-if="!precioVariante" @keypress="pricesCalcToPrice">
            </div>
           
          </div>
          <div class="form-group col-md-6 col-12"  >
            <label for="priceInput">Precio de compra</label>
            <div class="input-group mb-3">
              <span class="input-group-text" id="basic-addon1">$</span>
              <input type="number" class="form-control" :class="{ 'invalid-input': submitted && !isValidCompra}" id="priceInput" maxlength="15"  v-model="compra"  @keypress="pricesCalcToCompra">
            </div>
          </div>
          <div class="form-group col-md-6 col-12" v-if="(!precioVariante && gananciaInstalled)">
            <label for="ganancia">Ganancia del Producto</label>
            <div class="input-group mb-3">
              <span class="input-group-text" id="basic-addon1">$</span>
              <input id="ganancia" type="number" class="form-control" placeholder="ganancia" :disabled="waitResponse" :class="{ 'invalid-input': submitted && !isValidGanancia }"
              v-model="ganancia" @keyup.enter="newProduct" maxlength="15" v-if="(!precioVariante && gananciaInstalled)" @keypress="pricesCalcToGanacia">
            </div>
          </div>

          <div><hr></div>

          <div class="form-group col-12" v-if="stockInstalled && productsStockModify">
            <label for="barcode">Stock</label>
            <input id="stock" type="number" class="form-control" placeholder="Stock" :disabled="waitResponse" :class="{ 'invalid-input': submitted && !isValidStock}"
            v-model="stock" @keyup.enter="newProduct">
          </div>
          <div class="form-group col-12" v-if="categoriesInstalled">
            <label for="category">Categoria</label>
            <select id="category" class="browser-default custom-select" v-model="category" >
              <option value="" selected disabled>Categoria</option>
              <option :value="category.id" v-for="category in categories" class="text-capitalize">{{category.name}}</option>
            </select>
          </div>
          <div class="form-group col-md-6 col-12" v-if="minQuantityInstalled">
            <label for="min_quantity">Cantidad Minima</label>
            <input id="min_quantity" type="text" class="form-control" placeholder="Cantidad Minima" :disabled="waitResponse"
            v-model="min_quantity" @keyup.enter="newProduct">
          </div>
          
          <div class="form-group col-md-6 col-12">
            <label for="priceInput">Precio por mayor</label>
            <div class="input-group mb-3">
              <span class="input-group-text" id="basic-addon1">$</span>
              <input type="number" class="form-control" placeholder="Precio por mayor"  id="priceMayorInput" maxlength="15"  v-model="mayor" :class="{ 'invalid-input': submitted && !isValidMayor}"
              @keypress="pricesCalcToGananciaMayor">
            </div>
          </div>
          <div class="form-group col-md-6 col-12">
            <label for="priceInput">Ganancia por mayor</label>
            <div class="input-group mb-3">
              <span class="input-group-text" id="basic-addon1">$</span>
              <input type="number" class="form-control" placeholder="Ganancia por mayor"  id="priceGananciaMayorInput" maxlength="15"  v-model="ganancia_mayor" :class="{ 'invalid-input': submitted && !isValidGananciaMayor}"
              @keypress="pricesCalcToMayor">
            </div>
          </div>
        </div>
        <div class="row w-100 px-2">
          <div class="custom-control custom-checkbox pb-3 mr-2" v-if="cecinaInstalled">
            <input type="checkbox" class="custom-control-input" id="cecina" v-model="cecina">
            <label class="custom-control-label" for="cecina">Cecina</label>
          </div>
          <div class="custom-control custom-checkbox pb-3" v-if="precioVarianteInstalled">
            <input type="checkbox" class="custom-control-input" id="precioVariante" v-model="precioVariante">
            <label class="custom-control-label" for="precioVariante">Precio Variante</label>
          </div>
        </div>
        <div class="d-flex w-100 flex-wrap" v-if="precioVarianteInstalled && precioVariante">
          <div class="form-group col-md-6 col-12 pt-2">
            <label for="nuevaCantidad">Cantidad</label>
            <input id="nuevaCantidad" type="text" class="form-control" style="height: 40px;" placeholder="Cantidad" :disabled="waitResponse || !prices.length" v-model="nuevaCantidad"
            @keyup.enter="newPriceField" @keypress="validaInputNum($event)">
          </div>
          <div class="form-group col-md-6 col-12 pt-2">
            <label for="nuevoPrecio">Precio</label>
            <input id="nuevoPrecio" type="text" class="form-control" style="height: 40px;" placeholder="Precio" :disabled="waitResponse" v-model="nuevoPrecio"
            @keyup.enter="newPriceField" @keypress="validaInputNum($event)">
          </div>
          <div v-if="gananciaInstalled" class="form-group col-md-6 col-12 pt-2">
            <label for="nuevaGanancia">Ganancia</label>
            <input id="nuevaGanancia" type="text" class="form-control" style="height: 40px;" placeholder="Ganancia" :disabled="waitResponse" v-model="nuevaGanancia"
            @keyup.enter="newPriceField" @keypress="validaInputNum($event)">
          </div>
          <div class="col-md-6 col-12" style="padding-top: 2px;">
            <button type="button" class="float-right btn btn-success px-3 text-capitalize" style="height: 40px;" @click="newPriceField">Añadir</button>
          </div>
          <table class="table table-striped">
            <thead>
              <tr>
                <th class="">
                  Cantidad
                </th>
                <th class="">
                  Precio
                </th>
                <th v-if="gananciaInstalled" class="">
                  Ganancia
                </th>
                <th class="text-right">

                </th>
              </tr>
            </thead>
            <tbody v-for="(price,k) in prices" :key="k">
              <tr class="">
                <td class="py-2">
                  <a>
                    {{price.cantidad}}
                  </a>
                </td>
                <td class="py-2">
                  <a>
                    {{price.precio}}
                  </a>
                </td>
                <td v-if="gananciaInstalled" class="py-2">
                  <a>
                    {{price.ganancia}}
                  </a>
                </td>
                <td class="text-right py-2">
                  <a class="" @click="removePrice(k)">
                    <button type="button" class="btn btn-tool">
                      <i class="shadow-icon-hover float-button fas fa-times-circle text-danger"></i>
                    </button>
                  </a>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn bg-secundario text-white" data-dismiss="modal" @click="selectProduct">Cerrar</button>
        <button type="button" class="btn bg-primario text-white" :disabled="waitResponse"
        @click="newProduct">{{(!this.edit) ? 'Crear' : 'Editar'}}</button>
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
      price:0,
      image: null,
      barcode: "",
      stock: "",
      min_quantity: "",
      category: "",
      cecina:false,
      preview: '',
      waitResponse:false,
      edit: false,
      precioVariante: false,
      nuevoPrecio:"",
      nuevaGanancia:"",
      nuevaCantidad:"",
      prices: [],
      ganancia: 0,
      compra:0,
      mayor:0,
      ganancia_mayor:0,
      // campos de utilidad
      utilidad:0,
      utilidad_porcentaje:0,
      submitted:false
    }
  },
  computed:{
    productsStockModify:{
      get(){
        return ConfigHelper.HavePermission('productos_modificar_stock');
      }
    },
    categories:{
      get() {
        return this.$store.getters['products/categories'];
      }
    },
    categoriesInstalled:{
      get(){
        return ConfigHelper.ConfStr('modulos.productos.submodulos.categorias');
      }
    },
    barcodeInstalled:{
      get(){
        return ConfigHelper.ConfStr('modulos.productos.ajustes.permitir_barcode');
      }
    },
    stockInstalled:{
      get(){
        return ConfigHelper.ConfStr('modulos.productos.ajustes.permitir_stock');
      }
    },
    minQuantityInstalled:{
      get(){
        return ConfigHelper.ConfStr('modulos.productos.ajustes.permitir_cantidad_minima');
      }
    },
    cecinaInstalled:{
      get(){
        return ConfigHelper.ConfStr('modulos.productos.ajustes.permitir_cecina');
      }
    },
    precioVarianteInstalled:{
      get(){
        return ConfigHelper.ConfStr('modulos.productos.ajustes.permitir_precio_variante');
      }
    },
    gananciaInstalled:{
      get(){
        return ConfigHelper.ConfStr('modulos.ventas.ajustes.permitir_ganancia');
      }
    },
    newProductSell:{ get(){ return ConfigHelper.HavePermission('crear_productos_nueva_venta'); } },
    
    isValidName: {
      get() {return this.name.length > 0}
    },
    isValidCompra: {
      get() {return this.compra > 0}
    },
    isValidGanancia: {
      get() {return this.ganancia >= 0}
    },
    isValidPrice: {
      get() {return this.price >= 0}
    },
    isValidBarcode: {
      get() {return this.barcode.length > 0}
    },
    isValidStock: {
      get() {return this.stock >= 0}
    },
    isValidMayor: {
      get() {return this.mayor >= 0}
    },
    isValidGananciaMayor: {
      get() {return this.ganancia_mayor >= 0}
    },

  },
  mounted(){
    // var priceInput = document.getElementById("priceInput");
    // var im = new Inputmask({'alias': 'numeric', 'prefix': '$', 'placeholder': '0'});
    // im.mask(priceInput);
  },
  methods:{
    validar_form(){
      if(this.isValidName && 
      this.isValidCompra && 
      this.isValidGanancia && 
      this.isValidPrice && 
      this.isValidBarcode &&
      this.isValidStock &&
      this.isValidMayor &&
      this.isValidGananciaMayor){
        return true
      }else{
        return true; //VALIDACIONES DESACTIVADAS
        // return false; 
      }
    },
    utilidad_porCantidad() {
      setTimeout(() => {
        this.price = parseInt(this.utilidad) + parseInt(this.ganancia);
        this.utilidad_porcentaje = this.utilidad * 100 / this.ganancia
      },1)
    },
    utilidad_porPorcentaje() {
      setTimeout(() => {
        this.utilidad = (this.ganancia*(this.utilidad_porcentaje/100));
        this.price = parseFloat(this.ganancia) + parseFloat(this.utilidad);
      }, 1)
    },
    utilidad_calcular() {
      setTimeout(() => {
        this.utilidad = parseFloat(this.price) - parseFloat(this.ganancia);
        this.utilidad_porcentaje = (this.utilidad * 100) / this.ganancia
      },1)
      //JC
    },pricesCalcToPrice(){
      setTimeout(() => {
        console.log("priceVentaStart",this.price,this.ganancia,this.compra)
        this.ganancia = parseFloat(this.price) - parseFloat(this.compra)
        if (this.ganancia < 0) {
          this.$awn.alert('La ganancia no puede ser negativa');
        }
        console.log("priceVentaEnd",this.price,this.ganancia,this.compra)
      },1)
    },  
    pricesCalcToGanacia(){
       setTimeout(() => {
      this.price  = (parseFloat( this.compra) + parseFloat(this.ganancia));
      if (this.price < 0) {
          this.$awn.alert('El precio de compra no puede ser negativo');
        }
    },1)
    },
    pricesCalcToMayor(){
       setTimeout(() => {
       this.mayor  = (parseFloat( this.compra) + parseFloat(this.ganancia));
       if (this.mayor < 0) {
          this.mayor = 0;
          this.$awn.alert('El precio de venta al mayor no puede ser negativo');
        }
    },1)
    },  
    pricesCalcToGananciaMayor(){
       setTimeout(() => {
      this.ganancia_mayor  = (parseFloat( this.mayor) - parseFloat(this.compra));
      if (this.ganancia_mayor < 0) {
          this.$awn.alert('La ganancia de venta al mayor no puede ser negativa');
        }
    },1)
    },  
    pricesCalcToCompra(){
      setTimeout(() => {
      this.ganancia  = (parseFloat( this.price) - parseFloat(this.compra));
      if (this.ganancia < 0){
        this.$awn.alert('La ganancia no puede ser negativa');
      }
    },1)
    },  

    
    validaInputNum($event){
      var ch = String.fromCharCode($event.which);

      if(!(/[0-9,.]/.test(ch))){
        $event.preventDefault();
      }
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
    newPriceField(){
      if (!this.prices.length && !this.nuevoPrecio){
        this.$awn.alert('Debes precisar un precio');
        return;
      }
      if (this.prices.length && (!this.nuevoPrecio || !this.nuevaCantidad)) {
        this.$awn.alert('Debes precisar un precio y una cantidad');
        return;
      }
      if (this.gananciaInstalled && !this.prices.length && !this.nuevaGanancia){
        this.$awn.alert('Debes precisar una ganancia');
        return;
      }
      if (this.prices.length && parseFloat(this.prices[this.prices.length-1].cantidad) >= parseFloat(this.nuevaCantidad)){
        this.$awn.alert('Debe ingresar una cantidad mayor a la anterior');
        return;
      }

      this.prices.push({
        precio: this.formatNumber(this.nuevoPrecio),
        cantidad: (this.prices.length)?this.nuevaCantidad:0,
        ganancia: (this.nuevaGanancia && this.gananciaInstalled)?this.formatNumber(this.nuevaGanancia):0,
      });
      this.nuevoPrecio = "";
      this.nuevaCantidad = "";
      this.nuevaGanancia = "";
    },
    removePrice(index){
      this.prices.splice(index, 1);
    },
    getImage(image){
      return BaseUrl.getUrl('images/'+image);
    },
    uploadFile(){
      console.log("[File] Change")
      let uploadFile=this.$refs.fileProduct.files[0];
      if(!uploadFile){
        console.log("[File] None")
        return;
      }
      this.image = uploadFile;
      this.preview = URL.createObjectURL(uploadFile);
      console.log(uploadFile);
    },
    selectProduct(){
      this.edit = false;
      this.$emit('closeEdit');
    },
    refreshData(product){
      // this.$refs.fileProduct.value = '';
      let fields = ['name','price', 'compra','mayor', 'ganancia_mayor','preview','image','id'];
      if (this.categoriesInstalled) {
        fields.push('category');
      }
      if (this.barcodeInstalled) {
        fields.push('barcode');
      }
      if (this.stockInstalled && this.productsStockModify) {
        fields.push('stock');
      }
      if (this.minQuantityInstalled) {
        fields.push('min_quantity');
      }
      if (this.cecinaInstalled) {
        fields.push('cecina');
      }
      if (this.gananciaInstalled) {
        fields.push('ganancia');
        fields.push('ganancia_mayor');
      }

      for (var field of fields){
        if (product){
          if ((field == 'price' || field == 'ganancia' || field == 'mayor' || field == 'compra' || field == 'ganancia_mayor') && product[field]) {
            this[field] = this.formatNumber(this.deFormatNumber(product[field]));
          }else{
            this[field] = product[field];
          }
          //this[field] = product[field];
          this.edit = true;
          if (field == 'image' && product[field]){
            this.preview = this.getImage(product[field]);
          }
        }else{
          this[field] = '';
          this.edit = false;
        }
      }
      if (this.precioVarianteInstalled) {
        if (product && product.prices && product.prices.length){
          this.prices = product.prices;
          for (var i = 0; i < this.prices.length; i++) {
            this.prices[i].precio = this.formatNumber(this.deFormatNumber(this.prices[i].precio));
            this.prices[i].ganancia = this.formatNumber(this.deFormatNumber(this.prices[i].ganancia));
          }
          this.precioVariante = true;
        }else{
          this.prices = [];
          if (this.price) {
            this.prices.push({
              precio: this.formatNumber(this.price),
              cantidad: (this.prices.length)?this.nuevaCantidad:0,
              ganancia: (this.ganancia && this.gananciaInstalled)?this.formatNumber(this.ganancia):0
            });
            console.log('Precios variantes: ',this.prices);
          }
          this.precioVariante = false;
        }
      }
    },
    async newProduct(){
      this.submitted = true;
      //VALIDAR QUE TODO ESTE BIEN ANTES DE ENVIAR
      if(this.validar_form()){
        let fields = ['name'];

        if (ConfigHelper.ConfStr('modulos.productos.submodulos.categorias')){
          if (!this.categories.length) {
            this.$awn.alert('Debe crear almenos una categoria');
            return;
          }
          fields.push('category');
        }
        if (this.barcodeInstalled) {
          fields.push('barcode');
        }
        if (this.stockInstalled && this.productsStockModify) {
          fields.push('stock');
        }
        if (this.minQuantityInstalled) {
          fields.push('min_quantity');
        }
        if (this.gananciaInstalled && !this.precioVariante ) {
          fields.push('ganancia');
          fields.push('ganancia_mayor');
        }
        if (this.mayor) {
          fields.push('mayor');
        }
        let fd = new FormData();
        
        fd.append('compra', this.compra); //aqui se envia la compra si o si 

        if (this.precioVarianteInstalled) {
          if (this.precioVariante) {
            if (!this.prices.length) {
              this.$awn.alert('Debe ingresar almenos 1 precio');
              return;
            }
            console.log("-------------------------hola",this.price)
            var prices = [];
            for (var i = 0; i < this.prices.length; i++) {
              prices.push({
                precio: this.deFormatNumber(this.prices[i].precio,false),
                ganancia: this.deFormatNumber(this.prices[i].ganancia,false),
                cantidad: this.prices[i].cantidad,

                compra: this.deFormatNumber(this.compra[i].ganancia,false),
              });
            }
            fd.append('prices', JSON.stringify(prices));
            console.log('prices',prices);
          }else {
            fd.append('prices', JSON.stringify([]));
            fields.push('price');
          }
        }else {
          fields.push('price');
        }
        for (var field of fields) {
          if (!this.edit){
            if (!this[field] || this[field] == ' '){
              if (field == 'barcode') {
                if (!this.cecina){
                  this.$awn.alert('Debes llenar todos los campos');
                  return;
                }
              }else {
                this.$awn.alert('Debes llenar todos los campos');
                return;
              }
            }
          }
          if (field == 'price' || field == 'ganancia' || field == 'mayor' || field == 'ganancia_mayor') {
            console.log('Precio: ', this[field]);
            console.log('Mayor: ', this[field]);
            console.log('Ganancia Mayor: ', this[field]);
            console.log('Precio despues: ', this.deFormatNumber(this[field],false));
            fd.append(field, this.deFormatNumber(this[field],false));
          }else{
            fd.append(field, this[field]);
          }
        }
        if (this.image){
          fd.append('image', this.image);
        }
        if (this.cecinaInstalled){
          fd.append('cecina', (this.cecina)?1:0);
        }
        this.waitResponse = true;
        Loader.fullPage();
        
        if (this.edit) var request = await this.$store.dispatch("products/editProduct",{id:this.id,data:fd});
        else{
          if(!this.newProductSell) var request = await this.$store.dispatch("products/newProduct",fd);
          else var request = await this.$store.dispatch("products/newProductSell",fd);
        }

        Loader.hide();
        // this.$refs.fileProduct.value = '';
        if (request.success) {
          if (this.edit){
            this.$awn.success('Producto Editado Exitosamente',{labels:{success:'CORRECTO'}});
            this.submitted = false;
          }else{
            this.$awn.success('Producto Creado Exitosamente',{labels:{success:'CORRECTO'}});
            this.submitted = false;
          }
          this.selectProduct();
          this.$emit('refresh');
          $('#newProductModal').modal('hide');
        }else {
          console.log(request.data);
          this.submitted = false;
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
            this.submitted = false;
          }
        }
        this.waitResponse = false;
        this.submitted = false;
      }else{
        this.$awn.alert('Hay errores en el formulario');
      }
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
.invalid-input{
  border-color: red;
}
.form-control{
  background-color: #ffffff;
  border-radius: 5px;
  border-radius: 5px;
  box-shadow: inset -1px 1px 20px 11px rgb(193 193 193 / 28%);
      /* border: 1px solid #ced4da; */
    /* border-radius: 0.25rem; */
    /* border: none; */
}
</style>
