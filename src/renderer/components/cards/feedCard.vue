<template>
  <div v-if="feed" :class="['feed_card', getMyColor(feed.app_id)]">
    <div class="feed_card_head">
      <img class="feed_card_head_img" :src="getImage(feed.app_id)" alt="N">
      <h6 class="m-0 pl-2">{{(feed.app_id) ? 'Notícia para mí' : 'Notícia general' }}</h6>
    </div>
    <div class="feed_card_body">
      <h5>{{(feed.title) ? feed.title : 'Sin titulo' }}</h5>
      <p class="m-0 text-justify">
        {{feed.desc}}
      </p>
    </div>
  </div>
</template>

<script>
import BaseUrl from '../../helpers/baseUrl'
export default {
  name: 'feedCard',
  props:['feed'],
  methods:{
    getMyColor(type){
      if(type == null) return '';
      else return 'feed_card_my';
    },
    getImage(type){
      if(type == null) return BaseUrl.getUrl('images/feed.png');
      else return BaseUrl.getUrl('images/feed-white.png');
    }
  }
}
</script>

<style lang="scss">
  .feed_card{
    background: #fff;
    color: #000;
    width: 100%;
    border-radius: 4px;
    box-shadow: 0 2px 5px 0 rgba(0,0,0,0.16), 0 2px 10px 0 rgba(0,0,0,0.12);
    margin: 10px 0px;
    &_my{
      background: var(--primary);
      color: #fff;
    }
    &_head{
      padding: 7px 10px;
      display: flex;
      align-items: center;
      border-bottom: 1px solid #ccc;
      &_img{
        width: 20px;
        height: 20px;
        border-radius: 50%;
      }
    }
    &_body{
      padding: 15px 20px 17px 20px;
      text-align: justify;
    }
  }
</style>
