<template>
  <div v-if="waiter" @click="data = waiter.id" class="my-1">
    
    <div :class="[
                  'waiterCard',
                  (data == waiter.id) ? 'waiterCard_bg' : 'waiterCard_active',
                  (styleCaffeteria) ? 'caffeteriaStyles' : null
                ]">
        
      <div class="waiterCard_title">
        {{waiter.name}}
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'waiterCard',
  props:{
    value:{
      default: null
    },
    waiter:{
      type: Object,
      default: null
    },
    styleCaffeteria: {
      type: Boolean,
      default: false
    }
  },
  computed:{
    data:{
      get(){ return this.value; },
      set(value){ this.$emit('input', value) }
    }
  }
}
</script>

<style lang="scss">

  

.waiterCard{
  user-select: none;
  border-radius: 5px;
  padding: 10px 5px;
  text-align: center;
  min-height: 70px;
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
  }
  &_active{
    background: var(--dark);
    border: 1px solid var(--dark);
    color: #fff;
  }
  &_title{
    font-size: 16px;
    font-weight: bold;
    text-transform: capitalize;
    &.caffeteriaStyles {
      font-size: 18px;
    }
  }
  &_waiter{
    font-size: 14px;
    text-transform: capitalize;
  }
  &_order{
    font-size: 14px;
  }
  &.caffeteriaStyles {
    min-height: 120px;
  }
}
.waiterCard:hover{
  box-shadow: 0 0 11px 5px rgba(0, 0, 0, 0.5);
}
.waiterCard:active{
  box-shadow: none;
}

</style>
