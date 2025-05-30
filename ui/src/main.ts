import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import vuetify from './plugins/vuetify';
import { createPinia } from 'pinia';
import 'vue-toastification/dist/index.css';
import Toast from 'vue-toastification';
import './assets/main.css';

const app = createApp(App);
app.use(router);
app.use(vuetify);
app.use(createPinia());
app.use(Toast);
app.mount('#app');