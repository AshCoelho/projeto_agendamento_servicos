<template>
  <div class="flex min-h-screen bg-[#f8f9fd] font-sans text-[#2d3748]">
    <NavBar
      :sidebar-aberta="sidebarAberta"
      @update:sidebar-aberta="sidebarAberta = $event"
      :usuario="usuario"
      @logout="handleLogout"
    />
    <main class="flex-1 overflow-x-hidden">
      <header
        class="flex justify-between bg-white border-b border-black items-center px-8 mb-5 py-[22px]"
      >
        <div class="text-[13px] font-bold text-gray-400">
          Gestão / <span class="text-gray-900">Monitor Operacional</span>
        </div>
        <div class="flex items-center gap-8">
          <div class="text-right">
            <span class="text-[16px] text-sm font-bold">GUICHÊ: </span>
            <span class="text-[16px] text-sm font-bold">
              {{ usuario?.guiche || '--' }}
            </span>
          </div>
          <div class="text-[#1e3a8a] text-[16px] text-sm font-bold">
            {{ relogio }}
          </div>
        </div>
      </header>
      <div class="px-8 grid grid-cols-4 gap-6 mb-5">
        <div
          class="bg-white p-6 rounded-[15px] shadow-sm flex justify-between items-start border-b-4 border-transparent"
        >
          <div>
            <p class="text-[12px] font-bold text-gray-400 uppercase mb-1">Atendimentos Hoje</p>
            <h3 class="text-3xl font-black text-gray-800">{{ totalRegistradosHoje }}</h3>
            <span class="inline-block w-8 h-1 bg-blue-grey-darken-4 rounded-full"></span>
            <div class="flex gap-2 mt-2">
              <span class="text-[11px] font-bold text-blue-500 uppercase">
                {{ totalNormalGeral }} Normal
              </span>
              <span class="text-[11px] font-bold text-orange-500 uppercase">
                {{ totalPrioridadeGeral }} Prioridade
              </span>
            </div>
          </div>
          <div
            class="w-10 h-10 bg-gray-100 rounded-[10px] flex items-center justify-center text-gray"
          >
            <i class="pi pi-calendar"></i>
          </div>
        </div>
        <div
          class="bg-white p-6 rounded-[15px] shadow-sm flex justify-between items-start border-b-4 border-transparent"
        >
          <div>
            <p class="text-[12px] font-bold text-gray-400 uppercase mb-1">Pessoas na Fila</p>
            <h3 class="text-3xl font-black text-gray-800">{{ agendamentosAguardando }}</h3>
            <span class="inline-block w-8 h-1 bg-amber-lighten-2 rounded-full"></span>
            <div class="flex gap-2 mt-2">
              <span class="text-[11px] font-bold text-blue-500 uppercase">
                {{ totalNormalFila }} Normal
              </span>
              <span class="text-[11px] font-bold text-orange-500 uppercase">
                {{ totalPrioridadeFila }} Prioridade
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
          class="bg-white p-6 rounded-[15px] shadow-sm flex justify-between items-start border-b-4 border-transparent"
        >
          <div>
            <p class="text-[12px] font-bold text-gray-400 uppercase mb-1">Atendidos</p>
            <h3 class="text-3xl font-black text-gray-800">{{ agendamentosFinalizados }}</h3>
            <span class="inline-block w-8 h-1 bg-green-600 rounded-full"></span>
          </div>
          <div
            class="w-10 h-10 bg-gray-100 rounded-[10px] flex items-center justify-center text-gray"
          >
            <i class="pi pi-verified"></i>
          </div>
        </div>
        <div
          class="bg-white p-6 rounded-[15px] shadow-sm flex justify-between items-start border-b-4 border-transparent"
        >
          <div>
            <p class="text-[12px] font-bold text-gray-400 uppercase mb-1">Ausentes</p>
            <h3 class="text-3xl font-black text-gray-800">{{ agendamentosCancelados }}</h3>
            <span class="inline-block w-8 h-1 bg-red-600 rounded-full"></span>
          </div>
          <div
            class="w-10 h-10 bg-gray-100 rounded-[10px] flex items-center justify-center text-gray"
          >
            <i class="pi pi-times-circle"></i>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import NavBar from '@/components/NavBar.vue'
import { AtendenteApi } from '@/services/atendente.api'
import 'primeicons/primeicons.css'

export default {
  components: {
    NavBar,
  },
  data: () => ({
    abaAtiva: 'AGUARDANDO',
    relogio: '--:--:--',
    sidebarAberta: false,
    agendamentosPorSetor: [],
  }),

  computed: {
    // 1. CRIAMOS UM FILTRO MESTRE BLINDADO
    meusAgendamentos() {
      const meuId = Number(this.usuario?.id || localStorage.getItem('usuarioId'))

      // INÍCIO DO DEBUG
      console.group('🔍 DEBUG: Meus Agendamentos')
      console.log('👤 Meu ID (Guichê Logado):', meuId)
      console.log('📦 Total no Setor (Cru do Banco):', this.agendamentosPorSetor.length)

      return this.agendamentosPorSetor.filter((a) => {
        const idAtendente = Number(a.gerenciadorId)
        const status = a.situacao ? a.situacao.toUpperCase() : ''

        // Só conta como "Seu" se você efetivamente chamou para o seu guichê
        const jaSaiuDaFila = ['CHAMADO', 'EM_ATENDIMENTO', 'ATENDIDO', 'FALTOU'].includes(status)

        return idAtendente === meuId && jaSaiuDaFila
      })
    },

    // 2. PAINEL "ATENDIMENTOS HOJE": (Agora é 100% a sua produtividade)
    totalRegistradosHoje() {
      return this.meusAgendamentos.filter((a) => a.situacao === 'ATENDIDO').length
    },
    totalNormalGeral() {
      return this.meusAgendamentos.filter((a) => a.tipoAtendimento === 'NORMAL').length
    },
    totalPrioridadeGeral() {
      return this.meusAgendamentos.filter((a) => a.tipoAtendimento.includes('PRIORIDADE')).length
    },

    // 3. PAINÉIS DE RESULTADO: Apenas os seus atendidos e ausentes
    agendamentosFinalizados() {
      return this.meusAgendamentos.filter((a) => a.situacao === 'ATENDIDO').length
    },
    agendamentosCancelados() {
      return this.meusAgendamentos.filter((a) => a.situacao === 'FALTOU').length
    },

    // 4. PAINEL "PESSOAS NA FILA": Fila geral de quem está aguardando lá fora
    agendamentosAguardando() {
      return this.agendamentosPorSetor.filter(
        (a) => a.situacao === 'AGENDADO' && ['AGENDADO', 'ESPONTANEO'].includes(a.tipoAgendamento),
      ).length
    },
    totalNormalFila() {
      return this.agendamentosPorSetor.filter(
        (a) => a.situacao === 'AGENDADO' && a.tipoAtendimento === 'NORMAL',
      ).length
    },
    totalPrioridadeFila() {
      return this.agendamentosPorSetor.filter(
        (a) => a.situacao === 'AGENDADO' && a.tipoAtendimento.includes('PRIORIDADE'),
      ).length
    },
  },

  methods: {
    mudarAba(novaAba) {
      this.abaAtiva = novaAba
      this.paginaAtual = 1
    },

    atualizarRelogioLocal() {
      this.horaAtual = new Date() // Mantemos um objeto Date fresco
      this.relogio = this.horaAtual.toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      })
    },

    formatarDataHora(data) {
      if (!data) return ''
      return new Date(data).toLocaleString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    },

    async handleLogout() {
      const token = localStorage.getItem('token')
      const usuarioId = this.usuario?.id || localStorage.getItem('usuarioId')

      console.log('Iniciando processo de saída para o usuário:', usuarioId)

      try {
        if (usuarioId && token) {
          await AtendenteApi.deslogarGuiche(usuarioId)
          console.log('Banco de dados atualizado: Guichê liberado.')
        } else {
          console.warn('Aviso: usuarioId ou token não encontrados para limpar guichê.')
        }
      } catch (error) {
        console.error('Erro técnico ao deslogar guichê:', error.response?.data || error.message)
      } finally {
        console.log('Limpando dados locais e redirecionando...')
        localStorage.clear()
        this.usuario = null
        this.$router.push({ name: 'login' })
      }
    },

    async getUsuarioLogado() {
      try {
        const token = localStorage.getItem('token')
        this.setorTrabalhoId = localStorage.getItem('setorTrabalhoId')
        this.secretariaTrabalhoId = localStorage.getItem('secretariaTrabalhoId')

        if (!token || !this.setorTrabalhoId) return this.$router.push({ name: 'login' })

        const { data } = await AtendenteApi.getUsuarioLogado()
        this.usuario = data

        if (data.id) {
          localStorage.setItem('usuarioId', data.id)
        }
      } catch (error) {
        localStorage.clear()
        this.$router.push({ name: 'login' })
      }
    },

    async buscarAgendamentos() {
      try {
        if (!this.usuario?.id) await this.getUsuarioLogado()
        if (this.setorTrabalhoId) {
          const data = await AtendenteApi.buscarAgendamentosPorSetor(this.setorTrabalhoId)
          this.agendamentosPorSetor = [...data]

          // LINHA PARA DEBUG
          console.log('MEU ID:', this.usuario.id)
          console.log(
            'LISTA DO BANCO:',
            this.agendamentosPorSetor.map((a) => ({
              senha: a.senha,
              status: a.situacao,
              idAtendenteNoObjeto:
                this.usuario.id || a.atendenteId || (a.usuario ? a.usuario.id : 'NULO'),
            })),
          )
        }
      } catch (e) {
        console.error('Erro ao buscar agendamentos:', e)
      }
    },
  },

  async mounted() {
    await this.getUsuarioLogado()

    await this.buscarAgendamentos()

    setInterval(() => {
      this.buscarAgendamentos()
    }, 3000)

    this.atualizarRelogioLocal()
    setInterval(this.atualizarRelogioLocal, 1000)
  },
}
</script>
