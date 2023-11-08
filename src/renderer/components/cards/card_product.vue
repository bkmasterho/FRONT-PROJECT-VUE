<template>
  <div class="wrapper">
    <div v-if="product" class="card_container">
      <div class="top" :style="getImage(product.image)"></div>
      <div class="bottom">
        <div class="left">
          <div class="details">
            <h5>{{product.name}}</h5>
            <p>
              <span class="color-money">
                ${{formatNumber(deFormatNumber(product.price))}}
                <span v-if="product.cecina && cecinaInstalled">/KG</span>
              </span>
            </p>
          </div>
          <div @click="$emit('edit', product)" class="card_edit" data-toggle="modal" data-target="#newProductModal">
            <i class="fa fa-pencil-alt text-white"></i>
          </div>
        </div>
      </div>
    </div>

    <!-- INFORMACION ADICIONAL -->
    <div class="inside">
      <div class="icon">
        <i class="fa fa-info-circle text-white"></i>
      </div>
      <div class="contents_card">
        <h5 class="text-capitalize text-white">{{product.name}}</h5>
        <table v-if="(categoriesInstalled || stockInstalled)">
          <tr>
            <th v-if="categoriesInstalled">Categoria</th>
            <th v-if="stockInstalled">Stock</th>
          </tr>
          <tr>
            <td class="text-capitalize" v-if="categoriesInstalled">{{ product.category_name }}</td>
            <td v-if="stockInstalled">{{ (product.stock) ? product.stock : 0 }}</td>
          </tr>
        </table>
        <div class="text-white text-center" v-else>
          Adquiera mas modulos para ver otros detalles
        </div>
        <div @click="$emit('remove', product)" class="btn_remove_product">
          <i class="fa fa-trash text-white"></i>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// Helpers
import BaseUrl from '@/helpers/baseUrl.js';
import ConfigHelper from '@/helpers/ConfigHelper.js';
import FormatNumber from '@/helpers/FormatNumber.js';
export default {
  name: 'card_product',
  props:{
    product:{
      type: Object,
      default: null
    }
  },
  methods:{
    // Obtener URL
    getImage(image){
      var backgroundImage = 'url(../assets/img_prueba.jpg)';
      if(image) backgroundImage = 'url('+ BaseUrl.getUrl('images/'+image); +')';

      return {backgroundImage};
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
  },
  computed:{
    stockInstalled:{ get(){ return ConfigHelper.ConfStr('modulos.productos.ajustes.permitir_stock'); } },
    cecinaInstalled:{ get(){ return ConfigHelper.ConfStr('modulos.productos.ajustes.permitir_cecina'); } },
    categoriesInstalled:{ get(){ return ConfigHelper.ConfStr('modulos.productos.submodulos.categorias'); } }
  }
}
</script>

<style lang="scss">
// rgb(41, 47, 54)
.btn_remove_product{
  position: absolute;
    bottom: 0px;
    right: 0px;
    background: rgb(108, 207, 246);
    width: 29%;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 11px 20px;
    border: 1px solid rgb(108, 207, 246);
    cursor: pointer;
    font-size: 20px;
}
.btn_remove_product:hover{
  background: #6ccff6e0;
  border: 1px solid #6ccff6e0;
}
  .wrapper{
    width: 100%;
    height: 240px;
    background: white;
    margin: auto;
    position: relative;
    overflow: hidden;
    border-radius: 10px 10px 10px 10px;
    box-shadow: 0;
    transform: scale(0.95);
    transition: box-shadow 0.5s, transform 0.5s;
    &:hover{
      transform: scale(1);
      box-shadow: 5px 20px 30px rgba(0,0,0,0.2);
    }

    .card_container{
      width:100%;
      height:100%;
      .top{
        height: 82%;
        width:100%;
        background-repeat: no-repeat;
        background-position: center center;
        -webkit-background-size: 100%;
        -moz-background-size: 100%;
        -o-background-size: 100%;
        background-size: 100%;
      }
      .bottom{
        width: 200%;
        height: 18%;
        transition: transform 0.5s;
        &.clicked{
          transform: translateX(-50%);
        }
        .left{
          height:100%;
          width: 50%;
          background: #f4f4f4;
          position:relative;
          float:left;
          .details{
            padding: 5px 10px 0px 10px;
            float: left;
            width: calc(70%);
            h5{
              font-size: 17px;
              margin: 0px;
              text-transform: capitalize;
              position: absolute;
              bottom: 42px;
              right: 0px;
              background-color: rgb(11, 79, 108);
              color: #fff;
              width: 100%;
              padding: 7px 5px;
            }
            p{
              margin: 0px;
              margin-top: 2px;
              font-weight: bold;
              font-size: 17px;
            }
          }
          .card_edit{
            float: right;
            width: calc(30% - 2px);
            height: 100%;
            background: rgb(11, 79, 108);
            transition: .4s all ease;
            cursor: pointer;
            font-size: 20px;
            display: flex;
            justify-content: center;
            align-items: center;
            &:hover{
              background-color: rgba(11, 79, 108, .7);
            }
          }
        }
      }
    }
    .inside{
      z-index:9;
      background: #0B4F6C;
      width:140px;
      height:140px;
      position: absolute;
      top: -70px;
      right: -70px;
      border-radius: 0px 0px 150px 150px;
      transition: all 0.5s, border-radius 2s, top 1s;
      overflow: hidden;
      .icon{
        font-size: 23px;
        position: absolute;
        right: 85px;
        top: 82px;
        color: white;
        opacity: 1;
        transition: .4s all ease;
      }
      &:hover{
        right: 0;
        top: 0;
        width: 100%;
        height: 100%;
        border-radius: 0;
        // background: #292F36;
        .icon{
          opacity: 0;
          right:15px;
          top:15px;
        }
        .contents_card{
          opacity: 1;
          transform: scale(1);
          transform: translateY(0);
          height: 100%;
          max-height: 100%;
          overflow: auto;
        }
      }
      .contents_card{
        padding: 5%;
        opacity: 0;
        transform: scale(0.5);
        transform: translateY(-200%);
        transition: opacity 0.2s, transform 0.8s;
        table{
          text-align:left;
          width:100%;
        }
        h1, p, table{
          color: white;
        }
        p{
          font-size:13px;
        }
      }
    }
  }
</style>
