<template>
  <!-- Paginacion -->
  <ul v-if="data.pages > 1" class="pagination justify-content-center w-100 pg-blue mt-4">
    <li v-if="data.paginate.back != null" @click="$emit('getPage',data.paginate.back)" :class="['page-item', {'disabled': offOn}]">
      <a :class="['page-link',{'disabled': offOn}]"> < </a>
    </li>
    <li v-if="viewNumbers(data.page, page)" @click="$emit('getPage',page)" v-for="(page,index) in data.pages" :key="index" :class="['page-item', (page == data.page) ? 'disabled': '', {'disabled': offOn}]">
      <a :class="['page-link', (page == data.page) ? 'active disabled': '', {'disabled': offOn}]">{{ page }}</a>
    </li>

    <li v-if="data.paginate.next != null" @click="$emit('getPage',data.paginate.next)" :class="['page-item', {'disabled': offOn}]">
      <a :class="['page-link',{'disabled': offOn}]"> > </a>
    </li>
  </ul>
</template>

<script>

export default {
  name: 'MPage',
  props:{
    value:{
      type: Object,
      default: {}
    },
    offOn:{
      type: Boolean,
      default: false
    }
  },
  methods: {
    // Funcion para limitar un paginador
    viewNumbers(pageActive, pageWrite){
      if(pageActive == pageWrite || pageActive-1 == pageWrite || pageActive-2 == pageWrite || pageActive+1 == pageWrite || pageActive+2 == pageWrite) return true;
      else return false
    },
  },
  computed:{
    // v-model
    data: {
      get() { return this.value },
      set(value) { this.$emit('input',value) }
    },
  }
}
</script>


<style media="screen">
  .disabled{
    pointer-events: none !important;
  }
</style>
