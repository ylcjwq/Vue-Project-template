import { createApp } from 'vue';
import App from './App.vue';
import router from './routers';
import { createPinia } from 'pinia';
import 'uno.css';

const pinia = createPinia();

createApp(App).use(router).use(pinia).mount('#app');
