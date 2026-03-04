import { createRouter, createWebHistory } from 'vue-router';
import AtendenteView from '../views/AtendenteView.vue'
import LoginView from '../views/LoginView.vue'
import AdministradorView from '@/views/AdminPainelView.vue'
import ConfiguracaoView from '@/views/ConfiguracaoView.vue'
import CadastroEndereco from '@/views/CadastroEnderecoView.vue'
import CadastroSetor from '@/views/CadastroSetorView.vue'
import CadastroAtendente from '@/views/CadastroAtendenteView.vue'
import ModalGuiche from '@/views/ModalGuiche.vue'
import AgendamentoExternoView from '@/views/AgendamentoExternoView.vue'; 

const routes = [
  // 🔓 Rotas públicas
  { path: '/', name: 'login', component: LoginView },
  {path: '/tv/:setorId', name: 'painel-tv', component: () => import('../views/PainelTvView.vue'), props: true},

  {
    path: '/atendente',
    name: 'atendente',
    component: AtendenteView,
    meta: { requiresAuth: true }
  },

  {
    path: '/agendamento',
    name: 'agendamento',
    component: AgendamentoExternoView,
    meta: {requiresAuth: true }
  },

  {
    path: '/configuracao',
    name: 'configuracao',
    component: ConfiguracaoView,
    meta: { requiresAuth: true }
  },

  {
    path: '/guiche',
    name: 'guiche',
    component: ModalGuiche,
    meta: { requiresAuth: true }
  },

  {
  path: '/administrador',
  component: AdministradorView,
  meta: {
    requiresAuth: true,
    requiredPerfil: 'ADMINISTRADOR'
  },
  children: [
    {
      path: '',
      name: 'admin-painel',
      component: () => import('@/views/AdminPainelView.vue')
    },
    {
      path: 'configuracao',
      name: 'admin-config',
      component: ConfiguracaoView
    },
    {
      path: 'cadastro/endereco',
      name: 'cadastro-endereco',
      component: CadastroEndereco
    },
    {
      path: 'cadastro/setor',
      name: 'cadastro-setor',
      component: CadastroSetor
    },
    {
      path: 'cadastro/atendente',
      name: 'cadastro-atendente',
      component: CadastroAtendente
    }
  ]
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
    return next({ name: 'login' }) 
  }
  next()
})

export default router;

