import { createRouter, createWebHistory } from 'vue-router'
import AtendenteView from '../views/AtendenteView.vue'
import LoginView from '../views/LoginView.vue'
import AdministradorView from '@/views/AdminPainelView.vue'
import ConfiguracaoView from '@/views/ConfiguracaoView.vue'
import CadastroEndereco from '@/views/CadastroEnderecoView.vue'
import CadastroSetor from '@/views/CadastroSetorView.vue'
import CadastroAtendente from '@/views/CadastroAtendenteView.vue'
import ModalGuiche from '@/views/ModalGuiche.vue'
import AgendamentoExternoView from '@/views/AgendamentoExternoView.vue'
import ConfiguracaoDatasView from '@/views/ConfiguracaoDatasView.vue'
import MetricasView from '@/views/MetricasView.vue'
import RelatoriosView from '@/views/RelatoriosView.vue'
import UsuarioView from '@/views/UsuarioView.vue'

const routes = [
  // 🔓 Rotas públicas
  { path: '/', name: 'login', component: LoginView },

  {
    path: '/tv/:setorId',
    name: 'painel-tv',
    component: () => import('../views/PainelTvView.vue'),
    props: true
  },

  {
    path: '/externo',
    name: 'externo',
    component: AgendamentoExternoView
  },

  // Atendente
  {
    path: '/atendente',
    name: 'atendente',
    component: AtendenteView,
    meta: { requiresAuth: true }
  },

  {
  path: '/atendente/metricas',
    name: 'metricas',
    component: MetricasView,
    meta: { requiresAuth: true }
  },

  {
    path: '/guiche',
    name: 'guiche',
    component: ModalGuiche,
    meta: { requiresAuth: true }
  },



  // Administrador
  {
    path: '/administrador',
    name: 'admin-painel',
    component: AdministradorView,
    meta: {
      requiresAuth: true,
      requiredPerfil: ['ADMIN', 'SUPERADMIN']
    }
  },

  {
    path: '/administrador/relatorios',
    name: 'relatorios',
    component: RelatoriosView,
    meta: {
      requiresAuth: true,
      requiredPerfil: ['ADMIN', 'SUPERADMIN']
    }
  },

  {
    path: '/administrador/configuracao',
    name: 'admin-config',
    component: ConfiguracaoView,
    meta: {
      requiresAuth: true,
      requiredPerfil: ['ADMIN', 'SUPERADMIN']
    }
  },


  {
    path: '/administrador/configuracao-datas',
    name: 'configuracao-datas',
    component: ConfiguracaoDatasView,
    meta: {
      requiresAuth: true,
      requiredPerfil: ['ADMIN', 'SUPERADMIN']
    }
  },

  // Cadastros
  {
    path: '/cadastro/endereco',
    name: 'cadastro-endereco',
    component: CadastroEndereco,
    meta: { requiresAuth: true }
  },

  {
    path: '/cadastro/setor',
    name: 'cadastro-setor',
    component: CadastroSetor,
    meta: { requiresAuth: true }
  },

  {
    path: '/cadastro/atendente',
    name: 'cadastro-atendente',
    component: CadastroAtendente,
    meta: { requiresAuth: true }
  },

  {
    path: '/usuario',
    name: 'usuario',
    component: UsuarioView,
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const usuarioStr = localStorage.getItem('usuario')
  const usuario = usuarioStr ? JSON.parse(usuarioStr) : null

  // 1. Rota pública? Pode passar.
  if (!to.meta.requiresAuth) {
    return next()
  }

  // 2. Não está logado? Login.
  if (!usuario) {
    return next({ name: 'login' })
  }

  // 3. Verificação de Perfil
  if (to.meta.requiredPerfil) {
    // Transformamos em array caso tenha vindo como string simples
    const perfisPermitidos = Array.isArray(to.meta.requiredPerfil) 
      ? to.meta.requiredPerfil 
      : [to.meta.requiredPerfil]

    // DEBUG: Descomente a linha abaixo se persistir o erro para ver no console
    // console.log(`Perfil Usuário: ${usuario.perfil} | Permitidos:`, perfisPermitidos)

    if (!perfisPermitidos.includes(usuario.perfil)) {
      console.warn("Acesso negado: Perfil insuficiente")
      return next({ name: 'atendente' }) // Redireciona para o painel básico em vez de deslogar
    }
  }

  next()
})

export default router