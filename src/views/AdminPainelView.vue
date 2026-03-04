<template>
  <div class="flex min-h-screen bg-[#f8f9fd] font-sans text-[#2d3748]">
    <aside class="w-64 bg-white border-r border-gray-100 flex flex-col items-center py-6">
      <div class="flex items-center gap-2 mb-10 self-start px-6">
        <div
          class="w-10 h-10 bg-[#2563eb] rounded-[13px] flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-blue-200"
        >
          SA
        </div>
        <div class="leading-3">
          <p class="text-[12px] font-medium text-[#1e3a8a] uppercase">Sistema de</p>
          <p class="text-[12px] font-black text-[#1e3a8a] tracking-tighter uppercase">
            Agendamento
          </p>
        </div>
      </div>

      <nav class="w-full px-4 space-y-2">
        <!-- Painel -->
        <router-link
          to="/admin"
          class="flex items-center gap-3 px-4 py-3 rounded-[13px] transition-all text-gray-500 hover:bg-gray-100"
          active-class="bg-[#2563eb] text-white shadow-xl shadow-blue-100"
        >
          <i class="pi pi-objects-column"></i>
          <span class="text-sm font-bold">Painel</span>
        </router-link>

        <!-- Configuração -->
        <router-link
          to="/admin/config"
          class="flex items-center gap-3 px-4 py-3 rounded-[13px] transition-all text-gray-500 hover:bg-gray-100"
          active-class="bg-[#2563eb] text-white shadow-xl shadow-blue-100"
        >
          <i class="pi pi-cog"></i>
          <span class="text-sm font-bold">Configuração</span>
        </router-link>

        <!-- Relatórios -->
        <router-link
          to="/admin/relatorios"
          class="flex items-center gap-3 px-4 py-3 rounded-[13px] transition-all text-gray-500 hover:bg-gray-100"
          active-class="bg-[#2563eb] text-white shadow-xl shadow-blue-100"
        >
          <i class="pi pi-file"></i>
          <span class="text-sm font-bold">Relatórios</span>
        </router-link>

        <!-- Cadastros Toggle -->
        <div
          @click="abrirCadastros = !abrirCadastros"
          class="flex items-center justify-between px-4 py-3 rounded-[13px] cursor-pointer transition-all hover:bg-gray-100"
        >
          <div class="flex items-center gap-3 text-gray-600">
            <i class="pi pi-plus-circle"></i>
            <span class="text-sm font-bold">Cadastros</span>
          </div>

          <i
            class="pi pi-chevron-down transition-transform duration-300"
            :class="{ 'rotate-180': abrirCadastros }"
          ></i>
        </div>

        <!-- Submenu Cadastros -->
        <div v-if="abrirCadastros" class="ml-2 space-y-2 mt-2">
          <router-link
            v-for="item in cadastros"
            :key="item.id"
            :to="item.rota"
            class="flex items-center gap-3 px-4 py-3 rounded-[13px] transition-all text-gray-500 hover:bg-gray-100"
            active-class="bg-[#2563eb] text-white shadow-xl shadow-blue-100"
          >
            <i :class="['pi', item.icon]"></i>
            <span class="text-sm font-bold">{{ item.nome }}</span>
          </router-link>
        </div>
      </nav>

      <div class="mt-auto w-full px-6 pb-4">
        <div class="flex items-center gap-3 bg-gray-50 p-3 rounded-2xl mb-4 border border-gray-100">
          <div
            class="w-10 h-10 bg-[#2563eb] rounded-full flex items-center justify-center text-white font-bold shadow-sm"
          >
            {{ usuario?.nome?.charAt(0).toUpperCase() || 'U' }}
          </div>
          <div class="leading-tight">
            <p class="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">
              {{ usuario?.perfil || 'Atendente' }}
            </p>
            <p class="text-sm font-black text-[#1e3a8a] truncate w-32">
              {{ usuario?.nome || 'Usuário' }}
            </p>
          </div>
        </div>
        <button
          @click="handleLogout"
          class="flex items-center gap-2 text-red-500 font-bold text-xs uppercase tracking-tight"
        >
          <i class="pi pi-sign-out"></i> Sair do Sistema
        </button>
      </div>
    </aside>

    <main class="flex-1">
      <header
        class="flex justify-between bg-white border-b border-black items-center px-8 mb-5 py-4"
      >
        <div class="text-[13px] font-bold text-gray-400">
          Gestão / <span class="text-gray-900">Monitor Operacional</span>
        </div>
      </header>

      <div class="px-8 grid grid-cols-3 gap-6 mb-5">
        <div
          class="bg-white p-6 rounded-[15px] shadow-sm flex justify-between items-start border-b-4 border-transparent hover:border-[#9E9E9E] transition-all"
        >
          <div>
            <p class="text-[12px] font-bold text-gray-400 uppercase mb-1">Atendimentos Hoje</p>
            <h3 class="text-3xl font-black text-gray-800">{{ agendamentosPorSec.length }}</h3>
            <span class="inline-block w-8 h-1 bg-blue-grey-darken-4 rounded-full"></span>
          </div>
          <div
            class="w-10 h-10 bg-gray-100 rounded-[10px] flex items-center justify-center text-gray"
          >
            <i class="pi pi-calendar"></i>
          </div>
        </div>

        <div
          class="bg-white p-6 rounded-[15px] shadow-sm flex justify-between items-start border-b-4 border-transparent hover:border-[#FFD54F] transition-all"
        >
          <div>
            <p class="text-[12px] font-bold text-gray-400 uppercase mb-1">Pessoas na Fila</p>
            <h3 class="text-3xl font-black text-gray-800">
              {{ agendamentosPorSec.length }}
            </h3>
            <span class="inline-block w-8 h-1 bg-amber-lighten-2 rounded-full"></span>

            <div class="flex gap-2 mt-2">
              <span class="text-[11px] font-bold text-blue-500 uppercase">
                {{ totalNormal }} Normal
              </span>
              <span class="text-[11px] font-bold text-orange-500 uppercase">
                {{ totalPrioridade }} Prioridade
              </span>
            </div>
          </div>

          <div
            class="w-10 h-10 bg-gray-100 rounded-[10px] flex items-center justify-center text-gray"
          >
            <i class="pi pi-users text-lg"></i>
          </div>
        </div>

        <div
          class="bg-white p-6 rounded-[15px] shadow-sm flex justify-between items-start border-b-4 border-transparent hover:border-[#4CAF50] transition-all"
        >
          <div>
            <p class="text-[12px] font-bold text-gray-400 uppercase mb-1">Finalizados</p>
            <h3 class="text-3xl font-black text-gray-800">{{ agendamentosFinalizados }}</h3>
            <span class="inline-block w-8 h-1 bg-green-600 rounded-full"></span>
          </div>
          <div
            class="w-10 h-10 bg-gray-100 rounded-[10px] flex items-center justify-center text-gray"
          >
            <i class="pi pi-verified"></i>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import api from '@/services/api'
import StatsCards from '@/components/atendente/StatsCards.vue'
import PainelComandos from '@/components/atendente/PainelComandos.vue'
import 'primeicons/primeicons.css'

export default {
  components: {
    StatsCards,
    PainelComandos,
  },
  data: () => ({
    usuario: null,
    fila: [],
    agendamentosPorSec: [],
    abaAtiva: 'AGUARDANDO',
    relogio: '--:--:--',
    filtroTexto: '',
    abrirCadastros: false,
    menuAtivo: 'painel',
    cadastros: [
      {
        id: 'cadastro-endereco',
        nome: 'Endereço',
        icon: 'pi-map-marker',
        rota: 'cadastro/endereco',
      },
      {
        id: 'cadastro-setor',
        nome: 'Setor',
        icon: 'pi-sitemap',
        rota: 'cadastro/setor',
      },
      {
        id: 'cadastro-atendente',
        nome: 'Atendente',
        icon: 'pi-user',
        rota: 'cadastro/atendente',
      },
    ],
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

    async handleChamarNormal() {
      const secretariaId = this.usuario?.secretaria?.id
      const gerenciadorId = this.usuario?.id

      if (!secretariaId || !gerenciadorId) {
        alert('Dados do usuário ou secretaria incompletos.')
        return
      }

      try {
        await api.post(`/agendamentos/chamar/normal/${secretariaId}/${gerenciadorId}`)
      } catch (e) {
        console.error(e)
      } finally {
        this.buscarAgendamentos()
      }
    },

    async handleChamarPrioridade(secretariaId) {
      try {
        if (!secretariaId) alert('Algum problema com gerenciador ou secretaria')
        await api.post(`/agendamentos/chamar/prioridade/${secretariaId}/${this.usuario.id}`)
      } catch (e) {
        console.error(e)
      } finally {
        this.buscarAgendamentos()
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

    atualizarRelogioLocal() {
      const agora = new Date()
      this.relogio = agora.toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      })
    },
  },

  computed: {
    agendamentosFinalizados() {
      return this.agendamentosPorSec.filter((a) => a.situacao === 'ATENDIDO').length
    },

    totalNormal() {
      return this.agendamentosPorSec.filter((a) => a.tipoAtendimento === 'NORMAL').length
    },
    totalPrioridade() {
      return this.agendamentosPorSec.filter((a) => a.tipoAtendimento !== 'NORMAL').length
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
