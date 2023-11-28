<template>
    
    <div>
        <button type="button" class="m-1 btn bg-primario text-white text-capitalize" data-toggle="modal" data-target="#newRecetasModal">
            Añadir Receta
          </button>
        
          <new-receta/>
    </div>

</template>

<script>
    //Components

    import newReceta from '@/components/modals/newReceta.vue';
    export default{

        data(){
            return{
                recetas:[],
            }
        },

        components:{
            newReceta,
        }
    }


</script>