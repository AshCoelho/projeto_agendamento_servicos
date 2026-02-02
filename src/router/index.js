import { createRouter, createWebHistory } from 'vue-router';
import AtendenteView from '../views/AtendenteView.vue';
import LoginView from '../views/LoginView.vue';

const routes = [
  { path: '/atendente', name: 'atendente', component: AtendenteView },
  { path: '/tv', name: 'painel-tv', component: () => import('../views/PainelTvView.vue')},
  { path: '/login', name: 'login', component: LoginView }

];

const router = createRouter({
  history: createWebHistory(),
  routes
});



export default router;