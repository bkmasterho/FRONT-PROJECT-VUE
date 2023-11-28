<template>

    <div class="modal fade" id="newRecetasModal" tabindex="-1" role="dialog" aria-labelledby="newRecetasModal" aria-hidden="true" data-backdrop="false">
    <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
        <div class="modal-header">
            <h5 class="modal-title">{{(!this.edit) ? 'Nueva receta' : 'Editar receta'}}</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
            </button>
        </div>
        <div class="modal-body">

            <div class="d-flex flex-wrap row">

            <div class="form-group col-12">
                <label for="name">Nombre</label>
                <input id="name" type="text" class="form-control" placeholder="Nombre"
                v-model="nombreReceta" @keyup.enter="newRecetas">
            </div>
            <div><hr></div>
            
            
            <div class="form-group col-12">
                <label for="category">Ingredientes</label>
                <select id="category" class="browser-default custom-select">
                    <option value="" selected disabled>Productos</option>
                    <option v-for="product in products" :key="product.id" class="text-capitalize">{{product.name}}</option>
                </select>
            </div>

            <div class="form-group col-12">
                <label for="category">Unidad de Medida</label>
                <select id="category" class="browser-default custom-select">
                    <option value="" selected disabled>Medida</option>
                    <option value="">Kg</option>
                    <option value="">Ml</option>
                    <option value="">Onza</option>
                    <option value="">Lb(libra)</option>                  
                </select>
            </div>

            <div><hr></div>

            </div>
        </div>
        <div class="modal-footer">
            <button type="button" class="btn bg-secundario text-white" data-dismiss="modal">Cerrar</button>
            <button type="button" class="btn bg-primario text-white"
            @click="newRecetas">{{(!this.edit) ? 'Crear' : 'Editar'}}</button>
        </div>
        </div>
    </div>
    </div>

</template>


<script>

    export default{

        data(){ 
            return{

                nombreReceta:"",
                productosReceta:[],
                edit:false,
                products:[]
            }
        },

        methods:{
            newRecetas(){
                console.log("agg nueva receta");
            },

            async getProducts(){
                var params = '?params=true';
                params += '&orderBy_name=' + 'desc';
                var request = await this.$store.dispatch("products/getProducts", params);
                if(!request.success) console.log("Error en la peticion");
                this.products = (request.data.items.length == 0) ? false : request.data.items;
            }
        },

        mounted(){
            this.getProducts();
        },
    }


</script>