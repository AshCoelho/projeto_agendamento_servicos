<template>
  <div class="flex min-h-screen bg-[#f8f9fd] font-sans text-[#2d3748]">
    <AdminConfig></AdminConfig>

    <main class="flex-1">
      <header
        class="flex justify-between bg-white border-b border-black items-center px-8 mb-5 py-4"
      >
        <div class="text-[13px] font-bold text-gray-400">Administração /</div>
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
import AdminConfig from '@/components/AdminConfig.vue'
import 'primeicons/primeicons.css'

export default {
  components: {
    AdminConfig,
  },
  data: () => ({
    usuario: null,
    fila: [],
    agendamentosPorSec: [],
    abaAtiva: 'AGUARDANDO',
    relogio: '--:--:--',
    filtroTexto: '',
  }),
  methods: {
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
