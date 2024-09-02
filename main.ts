import Vue from 'vue';
import App from './App.vue';
import vuetify from './plugins/vuetify'; // If you are using Vuetify for styling

Vue.config.productionTip = false;

new Vue({
  vuetify, // Attach Vuetify to the Vue instance if you are using it for styling
  render: (h) => h(App),
}).$mount('#app');
