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
  components: { AdminConfig },
  data: () => ({
    usuario: null,
    agendamentosPorSec: [],
    relogio: '--:--:--',
  }),

  computed: {
    totalHoje() {
      return this.agendamentosPorSec.length
    },
    totalNaFila() {
      // Filtra quem ainda não foi atendido ou cancelado
      return this.agendamentosPorSec.filter(a => ['AGUARDANDO', 'CHAMADO'].includes(a.situacao)).length
    },
    agendamentosFinalizados() {
      return this.agendamentosPorSec.filter(a => a.situacao === 'ATENDIDO').length
    },
    totalNormal() {
      return this.agendamentosPorSec.filter(a => a.tipoAtendimento === 'NORMAL' && a.situacao === 'AGUARDANDO').length
    },
    totalPrioridade() {
      return this.agendamentosPorSec.filter(a => a.tipoAtendimento !== 'NORMAL' && a.situacao === 'AGUARDANDO').length
    },
  },

  methods: {
    async getUsuarioLogado() {
      try {
        const res = await api.get('/gerenciador/usuario-logado')
        this.usuario = res.data
        
        // Se for admin e tiver vários setores, buscamos todos
        if (this.usuario?.setores?.length > 0) {
          this.carregarDadosDeTodosOsSetores(this.usuario.setores)
        }
      } catch (error) {
        console.error('Erro ao buscar usuário logado', error)
      }
    },

    async carregarDadosDeTodosOsSetores(setores) {
      try {
        // Cria uma lista de promessas (uma busca para cada setor)
        const buscas = setores.map(s => api.get(`/agendamentos/setor/${s.id}`))
        
        // Aguarda todas as respostas
        const resultados = await Promise.all(buscas)
        
        // Junta todos os arrays de agendamentos em um só
        const todosAgendamentos = resultados.reduce((acc, res) => {
          return acc.concat(Array.isArray(res.data) ? res.data : [])
        }, [])

        this.agendamentosPorSec = todosAgendamentos
        console.log('Total consolidado de agendamentos:', this.agendamentosPorSec.length)
      } catch (e) {
        console.error("Erro ao consolidar dados dos setores:", e)
      }
    },

    atualizarRelogioLocal() {
      this.relogio = new Date().toLocaleTimeString('pt-BR')
    },
  },

  mounted() {
    this.getUsuarioLogado()
    this.atualizarRelogioLocal()
    setInterval(this.atualizarRelogioLocal, 1000)
    
    // Polling opcional para atualizar os cards automaticamente
    setInterval(() => {
      if (this.usuario?.secretaria?.id) {
        this.buscarAgendamentos(this.usuario.secretaria.id)
      }
    }, 5000)
  },
}
</script>
