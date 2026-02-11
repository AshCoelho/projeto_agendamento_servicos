import { createRouter, createWebHistory } from 'vue-router';
import AtendenteView from '../views/AtendenteView.vue'
import LoginView from '../views/LoginView.vue'
import AdministradorView from '@/views/AdministradorView.vue'
import ConfiguracaoView from '@/views/ConfiguracaoView.vue'

const routes = [
  // 🔓 Rotas públicas
  { path: '/login', name: 'login', component: LoginView },
  {path: '/tv/:enderecoId', name: 'painel-tv', component: () => import('../views/PainelTvView.vue'), props: true},
  

  {
    path: '/atendente',
    name: 'atendente',
    component: AtendenteView,
    meta: { requiresAuth: true }
  },
  {
    path: '/configuracao',
    name: 'configuracao',
    component: ConfiguracaoView,
    meta: { requiresAuth: true }
  },


  {
    path: '/administrador',
    name: 'administrador',
    component: AdministradorView,
    meta: {
      requiresAuth: true,
      requiredPerfil: 'ADMINISTRADOR'
    }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})


router.beforeEach((to, from, next) => {
  const usuarioStr = localStorage.getItem('usuario')
  const usuario = usuarioStr ? JSON.parse(usuarioStr) : null


  if (!to.meta.requiresAuth) {
    return next()
  }


  if (!usuario) {
    return next({ name: 'login' })
  }


  if (to.meta.requiredPerfil && usuario.perfil !== to.meta.requiredPerfil) {
    return next({ name: 'atendente' }) 
  }


  next()
})




export default router;

