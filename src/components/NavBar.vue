<template>
  <aside
    :class="[sidebarAberta ? 'w-64' : 'w-20']"
    class="bg-white border-r border-gray-100 flex flex-col items-center py-6 transition-all duration-300 relative"
  >
    <button
      @click="sidebarAberta = !sidebarAberta"
      class="absolute -right-3 top-10 bg-white border border-gray-100 rounded-full w-6 h-6 flex items-center justify-center shadow-sm hover:bg-gray-50 z-50"
    >
      <i
        :class="['pi', sidebarAberta ? 'pi-chevron-left' : 'pi-chevron-right']"
        style="font-size: 0.7rem"
      ></i>
    </button>

    <div
      :class="[sidebarAberta ? 'px-6' : 'px-0']"
      class="flex items-center gap-2 mb-10 w-full transition-all duration-300 justify-center"
    >
      <div
        class="min-w-[40px] w-10 h-10 bg-[#2563eb] rounded-[13px] flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-blue-200"
      >
        SA
      </div>
      <div v-if="sidebarAberta" class="flex flex-col justify-start mr-15 leading-tight">
        <span class="text-[11px] font-medium text-blue-800 uppercase tracking-wide">
          Sistema de
        </span>

        <span class="text-[14px] font-extrabold text-blue-900 uppercase tracking-tight">
          Agendamento
        </span>
      </div>
    </div>

    <nav class="w-full px-4 space-y-2 overflow-y-auto flex-1 transition-all duration-300">
      <router-link
        to="/atendente"
        class="flex items-center gap-3 px-4 py-3 rounded-[13px] transition-all text-gray-500 hover:bg-gray-50 group"
        :class="[!sidebarAberta ? 'justify-center px-0' : '']"
        active-class="bg-[#2563eb] text-white shadow-xl shadow-blue-100"
      >
        <i class="pi pi-objects-column"></i>
        <span v-if="sidebarAberta" class="text-sm font-bold whitespace-nowrap"
          >Painel de Senhas</span
        >
      </router-link>

      <router-link
        to="/atendente/metricas"
        class="flex items-center gap-3 px-4 py-3 rounded-[13px] transition-all text-gray-500 hover:bg-gray-50"
        :class="[!sidebarAberta ? 'justify-center px-0' : '']"
        active-class="bg-[#2563eb] text-white shadow-xl shadow-blue-100"
      >
        <i class="pi pi-cog"></i>
        <span v-if="sidebarAberta" class="text-sm font-bold whitespace-nowrap">Métricas</span>
      </router-link>
    </nav>

    <div class="mt-auto w-full px-4 pb-4">
      <div
        :class="[sidebarAberta ? 'p-3' : 'p-0 bg-transparent border-none shadow-none']"
        class="flex items-center gap-3 bg-gray-50 rounded-2xl mb-4 border border-gray-100 transition-all duration-300 justify-center"
      >
        <div
          class="min-w-[40px] w-10 h-10 bg-[#2563eb] rounded-full flex items-center justify-center text-white font-bold shadow-sm"
        >
          {{ usuario?.nome?.charAt(0).toUpperCase() || 'U' }}
        </div>
        <div v-if="sidebarAberta" class="leading-tight whitespace-nowrap overflow-hidden">
          <p class="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">
            {{ usuario?.perfil || 'Atendente' }}
          </p>
          <p class="text-sm font-black text-[#1e3a8a] truncate w-24">
            {{ usuario?.nome || 'Usuário' }}
          </p>
        </div>
      </div>

      <button
        @click="handleLogout"
        :class="[sidebarAberta ? 'justify-start px-2' : 'justify-center px-0']"
        class="flex items-center gap-2 w-full text-red-500 font-bold text-xs uppercase tracking-tight transition-all duration-300"
      >
        <i class="pi pi-sign-out"></i>
        <span v-if="sidebarAberta">Sair</span>
      </button>
    </div>
  </aside>
</template>

<script>
import api from '@/services/api'
import 'primeicons/primeicons.css'

export default {
  data: () => ({
    usuario: null,
    fila: [],
    agendamentosPorSec: [],
    abaAtiva: 'AGUARDANDO',
    relogio: '--:--:--',
    filtroTexto: '',
    abrirCadastros: false,
    menuAtivo: 'painel',
    sidebarAberta: false,
  }),
  methods: {
    selecionarMenu(id) {
      this.menuAtivo = id

      if (!id.startsWith('cadastro')) {
        this.abrirCadastros = false
      } else {
        this.abrirCadastros = true
      }
    },
    async buscarAgendamentos() {
      try {
        const resposta = await api.get('/agendamentos/secretaria/1')
        console.log('Dados recebidos no painel:', resposta.data)
        if (Array.isArray(resposta.data)) {
          this.agendamentosPorSec = resposta.data
        }
      } catch (e) {
        console.error(e)
      }
    },

    async getUsuarioLogado() {
      try {
        const usuario_logado = JSON.parse(localStorage.getItem('usuario'))
        const resposta = await api.get('/gerenciador/usuario-logado', {
          headers: { Authorization: `Bearer ${usuario_logado.token}` },
        })
        this.usuario = resposta.data
      } catch (error) {
        console.error('Erro ao buscar usuário logado', error)
      }
    },

    handleLogout() {
      localStorage.clear()
      this.$router.push({ name: 'login' })
    },
  },

  mounted() {
    this.buscarAgendamentos()
    this.getUsuarioLogado()
    this.atualizarRelogioLocal()
    setInterval(() => this.atualizarRelogioLocal(), 1000)
  },
}
</script>
