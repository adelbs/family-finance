import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'

Vue.config.productionTip = false

Vue.filter('money', function (value) {
    let strValue = String(value).split('.');
    let cents = strValue.length == 2 ? strValue[1] : '0';
    cents = cents.length == 1 ? cents + '0' : cents;
    return `R$ ${strValue[0]},${cents}`;
});

Vue.filter('date', function (value) {
    return `${value.substring(8, 10)}/${value.substring(5, 7)}/${value.substring(0, 4)}`;
});

new Vue({
    router,
    store,
    vuetify,
    render: function (h) { return h(App) }
}).$mount('#app')
