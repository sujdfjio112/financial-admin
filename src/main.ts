import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import { createPinia } from 'pinia';
import './styles/index.css'; // 你可以使用自己的样式或 Tailwind

const app = createApp(App);
app.use(createPinia());
app.use(router);
app.mount('#app');