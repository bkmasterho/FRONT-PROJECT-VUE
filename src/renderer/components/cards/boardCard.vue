<template>
  <div v-if="board" @click="$emit('clickEmit', board)" class="my-2 tiempo-flags">
    <div :class="tiempo_class+' tiempo-flag'"></div>
      <div class="tiempo-minutos">{{tiempo_minutos}} min.</div>    <div :class="['boradCard', showedBoardColor, (board.state == 'libre') ? 'boradCard_bg' : 'boradCard_active' ]">
      <div class="boradCard_title">
        {{board.name}}
      </div>
      <div v-if="(board.waiter && board.waiter.name)" class="boradCard_waiter">
        {{board.waiter.name}}
      </div>
      <div v-if="(board.order && board.order.id)" class="boradCard_order">
        Orden: #{{board.order.id}}
      </div>
    </div>
  </div>
</template>

<script>

import ConfigHelper from '@/helpers/ConfigHelper.js';
import moment from 'moment';

export default {
  name: 'boardCard',
  data() {
    return{
      tiempo_class:"tiempo-flag-0",
      tiempo_minutos:0
    }
  },
  props:{
    board:{
      type: Object,
      default: null
    }
  },
  
  methods: {
    tiempo_en_accion(board) {
      console.log("[BOARD]waiter:",board.waiter)
      if (board.waiter === null || (board && typeof(board.order.created_at) === null)) {
        this.tiempo_class = "tiempo-flag-0"
        return;
      }
      let time = board.order.created_at;
      console.log("[BOARD] time:",time)
      var tiempo_actual = new Date();
      var tiempo_mesa = new Date(time);
      var fecha1 = moment(tiempo_actual);
      var fecha2 = moment(tiempo_mesa);

      console.log((fecha1.diff(fecha2, 'minutes')), ' min de diferencia');
      var diffMins = fecha1.diff(fecha2, 'minutes');
      console.log("[BOARD] diffMins:",diffMins)
      this.tiempo_minutos = diffMins > 0 ? diffMins : 0;
      if (diffMins < 15) {
        this.tiempo_class = "tiempo-flag-1"
        return;
      } 

      if (diffMins < 30) {
        this.tiempo_class = "tiempo-flag-2"
        return;
      } 

       if (diffMins < 45) {
        this.tiempo_class = "tiempo-flag-3"
        return;
      } 

       this.tiempo_class = "tiempo-flag-4"
      
    }
  },
  mounted () {
    this.tiempo_en_accion(this.board)
  },
  computed: {
    boardsChangeColor: { get(){ return ConfigHelper.ConfStr('modulos.cafeteria.ajustes.change_board_color'); } },
    showedBoardColor: { get(){
      return (this.boardsChangeColor) ? (this.board.color) ? 'cc-'+this.board.color : '' : '';
    } }
  }
}
</script>

<style lang="scss">
.tiempo-flags{
  position:relative;
}
.tiempo-flag {
  position:absolute;
    top:10px;
    left:10px;
    height: 7px;
    width: 7px;
}
.tiempo-minutos {
    color: white;
    position: absolute;
    top: 10px;
    right: 0px;
    height: 5px;
    width: 40px;
    font-size: 10px;
    font-weight:bold;
}
.tiempo-flag-0 {
  background-color: black;
    color:black;
    
}
.tiempo-flag-1{
    background-color: greenyellow;
    color:greenyellow;
   
  }
  .tiempo-flag-2{
    background-color: lightblue;
    color:lightblue;
    
  }
  .tiempo-flag-3{
    background-color: yellow;
    color:yellow;
    
  }
  .tiempo-flag-4{
    background-color: red;
    color:red;
    
  }

.boradCard{
  user-select: none;
  border-radius: 5px;
  padding: 10px 5px;
  text-align: center;
  min-height: 120px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  cursor: pointer;
  transition: .4s all ease;
  box-shadow: 0 0 11px 2px rgba(0, 0, 0, .3);
  &_bg{
    background: var(--primary);
    border: 1px solid var(--primary);
    color: #fff;
    &.cc-verde {
      background: #206720;
      border: 1px solid #547350;
    }
    &.cc-piel {
      background: #e0b372;
      border: 1px solid #d6a45f;
    }
  }
  &_active{
    background: var(--dark);
    border: 1px solid var(--dark);
    color: #fff;
    &.cc-verde {
      background: #4ab94a;
      border: 1px solid #7eb977;
    }
    &.cc-piel {
      background: #b9771b;
      border: 1px solid #8d5b14;
    }
  }
  &_title{
    font-size: 18px;
    font-weight: bold;
    text-transform: capitalize;
  }
  &_waiter{
    font-size: 14px;
    text-transform: capitalize;
  }
  &_order{
    font-size: 14px;
  }
}
.boradCard:hover{
  box-shadow: 0 0 11px 5px rgba(0, 0, 0, 0.5);
}
.boradCard:active{
  box-shadow: none;
}
</style>
