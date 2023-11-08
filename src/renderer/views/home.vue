<template>
  <div class="bg-home">
    <div :class="['bg-parallax-home', (feeds != 'Failed to fetch' && feeds && feeds.length > 0) ? '' : 'bg-full-height']">
      <div class="rgbaBlack d-flex flex-column justify-content-center align-items-center py-5">
        <img class="home_logo" src="../assets/logo.png" alt="easy-erp">
        <h2 class="text-bienvenida">
          Bienvenido a tu mejor aplicación de gestión en negocios
        </h2>
      </div>
    </div>

    <div v-if="feeds != 'Failed to fetch' && feeds && feeds.length > 0" class="pt-5 pb-3 px-3 px-sm-5">
      <h4 class="mb-4">Ultimas notícias</h4>

      <div class="mx-sm-2 m-0 p-0" v-for="(feed, index) in feeds" :key="index">
        <feed-card :feed="feed" />
      </div>
    </div>
  </div>
</template>

<script>
import feedCard from '@/components/cards/feedCard.vue';
import Loader from '@/helpers/Loader';

export default {
  name:'home',
  props:['value','feedsWatch'],
  components:{ feedCard },
  async mounted(){
    if(this.feedsWatch){
      this.offOn = true;
      Loader.dinamic();
        await this.$store.dispatch('main/getFeeds');
      Loader.hide();
      this.offOn = false;
    }else{
      this.feeds = null;
    }
  },
  computed:{
    offOn: {
      get() { return this.value },
      set(offOn) { this.$emit('input',offOn) }
    },
    feeds:{
      get(){ return this.$store.getters['main/getFeeds'] },
      set(val){ return this.$store.commit('main/setProperty', {key:'feeds', data: val}) }
    }
  },
  watch:{
    async feedsWatch(val){
      if(val) {
        this.offOn = true;
          await this.$store.dispatch('main/getFeeds');
        this.offOn = false;
      }
    }
  }
}
</script>
