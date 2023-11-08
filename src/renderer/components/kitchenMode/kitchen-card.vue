<template>
    <div :class="['kitchen-card', (notKanbanKitchen) ? 'not-kanban-kitchen': '', kitchenFontClass, kitchenBlackAndWhiteClass]">
        <div v-if="mostrarAntiguedad" class="kitchen-obsoletismo">
            <div>
                Antiguedad
            </div>
            <div>
                <b>{{ useMoment(order.created_at).fromNow() }}</b>
            </div>
        </div>
        <div :class="['kitchen-card-header', kitchenBlackAndWhiteClass]" :style="'background-color:'+randomColor">
            <span>#{{ order.id }}</span>
            <span>|</span>
            <span>{{ useMoment(order.created_at).format('DD/MM/YYYY HH:mm') }}</span>
            <template v-if="order.order_id">
            <span>|</span>
            <span>Ticket #{{ order.order_id }}</span>
            </template>
            <template v-if="order.sell_id">
            <span>|</span>
            <span>Venta #{{ order.sell_id }}</span>
            </template>
        </div>

        <div v-if="settingNombreMesa || settingNombreGarzon" 
            :class="['kitchen-card-header', kitchenBlackAndWhiteClass]" :style="'background-color:'+randomColor">
            <template v-if="settingNombreMesa && order.order && order.order.board">
            <span>Mesa: {{ order.order.board.name }}</span>
            </template>
            <template v-if="settingNombreGarzon && order.order && order.order.waiter_assigned">
            <span>Garzon: {{ order.order.waiter_assigned.name }}</span>
            </template>
        </div>

        <div :class="['kitchen-card-body', kitchenBlackAndWhiteClass]">
            <div 
            v-for="(product, index) in order.productos" 
            class="kitchen-card-body-product"
            v-bind:key="'kitchen-order-product-'+order.id+'-'+index+'-'+product.id"
            >
            <div class="quantity-container" :style="'background-color:'+randomColor" :class="['kitchen-card-body', kitchenBlackAndWhiteClass]">
                <span v-if="xCantidadCocina">x</span>
                {{ product.quantity }}
            </div>
            <div>
                {{ product.name }}
            </div>
            </div>
        </div>
        <div :class="['kitchen-card-body', kitchenBlackAndWhiteClass]" v-if="settingOrderDescription">
            <p class="description0Margin" > {{ order.order.description }} </p>
        </div>

        <div :class="['kitchen-card-header', kitchenBlackAndWhiteClass]" v-if="order.completed_at" :style="'background-color:'+order.random_color">
            <span>Completado ✅ {{ useMoment(order.completed_at).format('DD/MM/YYYY HH:mm') }}</span>
        </div>
    </div>
</template>

<script>

// Helpers
import ConfigHelper from '@/helpers/ConfigHelper.js';
import moment from 'moment';

export default {
  props: ['order', 'notKanbanKitchen'],
  computed: {
    useMoment: { get() { return moment; } },
    settingNombreMesa:{ get(){ return ConfigHelper.ConfStr('modulos.cafeteria.submodulos.modo_cocina.ajustes.coc_nombre_mesa'); } },
    settingNombreGarzon:{ get(){ return ConfigHelper.ConfStr('modulos.cafeteria.submodulos.modo_cocina.ajustes.coc_nombre_garzon'); } },
    settingOrderDescription:{ get(){ return ConfigHelper.ConfStr('modulos.cafeteria.submodulos.modo_cocina.ajustes.kit_o_descripcion'); } },
    settingAllBlackAndWhite:{ get(){ return ConfigHelper.ConfStr('modulos.cafeteria.submodulos.modo_cocina.ajustes.all_blanco_y_negro'); } },
    xCantidadCocina:{ get(){ return ConfigHelper.ConfStr('modulos.cafeteria.submodulos.modo_cocina.ajustes.x_cocina_cantidad'); } },
    mostrarAntiguedad: {
        get() {
            if (!ConfigHelper.ConfStr('modulos.cafeteria.submodulos.modo_cocina.ajustes.antiguedad_tarjetas')) return false;
            var now = moment(new Date()); //todays date
            var end = moment(this.order.created_at); // another date
            var duration = moment.duration(now.diff(end));
            var minutes = duration.asMinutes();
            if (minutes > 30) return true;
            return false;
        }
    },
    envs: { get(){ return this.$store.getters['main/getEnvs'] }},
    kitchenFontClass: {
        get() {
            //console.log('size_letra_cocina_kanban', this.envs)
            if (!this.envs || !this.envs.size_letra_cocina_kanban || !this.envs.size_letra_cocina_kanban.value) return '';
            switch (parseInt(this.envs.size_letra_cocina_kanban.value)) {
                case 0: return 'cocina-font-default'; break;
                case 1: return 'cocina-font-medium'; break;
                case 2: return 'cocina-font-large'; break;
                case 3: return 'cocina-font-extra-large'; break;
            }
            return '';
        }
    },
    kitchenBlackAndWhiteClass: {
        get() {
            if (this.settingAllBlackAndWhite) return 'blackAndWhiteBg';
            return '';
        }
    },
    randomColor: {
        get() {
            if (this.settingAllBlackAndWhite) return '#000000';
            return this.order.random_color;
        }
    },
  }
}
</script>

<style lang="scss">

    .blackAndWhiteBg {
        background: black;
        color: white;
    }

    .cocina-font-default {
        font-size: 16px;
    }
    .cocina-font-medium {
        font-size: 18px;
    }
    .cocina-font-large {
        font-size: 20px;
    }
    .cocina-font-extra-large {
        font-size: 22px;
    }

    .kitchen-card {
    background: white;
    margin: 8px 1px;
    position:relative;
    display: flex;
    flex-direction: column;
    -webkit-box-shadow: 0px 2px 4px 0px rgba(0,0,0,0.5); 
    box-shadow: 0px 2px 4px 0px rgba(0,0,0,0.5);
    border-radius: 2px;
    &-header {
        background: var(--primary);
        padding: 5px;
        display: flex;
        color: white;
        flex-direction: row;
        justify-content: space-between;
    }
    &-body {
        padding: 5px;
        display: flex;
        flex-direction: column;
        &-product {
        width: 100%;
        display: flex;
        justify-content: space-between;
        padding: 2px;
        .quantity-container {
            background: var(--secondary);
            border-radius: 100%;
            width: 24px;
            height: 24px;
            color: white;
            display: flex;
            justify-content: center;
        }
        }
    }
    }

    .kitchen-obsoletismo {
        position: absolute; 
        color: white; 
        width: 100%;
        height: 100%;
        text-align: center;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        background: rgba(0,0,0,.80);
        flex: 1;
    }

    .description0Margin {
       margin: 0px; 
    }

    .not-kanban-kitchen {
        margin: 5px;
        flex: 0.25;
        min-width: 280px;
        max-width: 400px;
    }
</style>
