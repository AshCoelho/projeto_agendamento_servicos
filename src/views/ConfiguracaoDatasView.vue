<template>
  <div class="flex min-h-screen bg-[#f8f9fd] font-sans text-[#2d3748]">
    <AdminConfig />

    <main class="flex-1 flex flex-col">
      <header
        class="flex items-center justify-between bg-white border-b border-gray-100 px-8 py-3 mb-5 shadow-sm"
      >
        <div class="flex items-center gap-2 text-[13px] font-bold">
          <span class="text-gray-400">Gestão</span>
          <i class="pi pi-angle-right text-[10px] text-gray-300"></i>
          <span class="text-[#1e3a8a]">Monitor Operacional</span>
        </div>

        <div class="relative w-1/4 max-w-md">
          <i class="pi pi-search absolute left-4 top-1/2 -translate-y-1/2 text-blue-400"></i>
          <input
            v-model="filtroTexto"
            type="text"
            placeholder="Localizar senha ou cidadão..."
            class="w-full bg-[#f1f4f9] border-none rounded-full py-2 pl-11 text-xs placeholder-gray-400 focus:ring-1 focus:ring-blue-200 outline-none transition-all"
          />
        </div>

        <div class="flex items-center gap-6">
          <div class="text-right leading-tight">
            <div class="text-[11px] font-bold text-gray-400 uppercase tracking-tighter">
              {{ labelLocalTrabalho }}
              <span class="text-[18px] text-blue-600 ml-1">{{ displayLocalAtendimento }}</span>
            </div>
            <div class="text-gray-500 text-[12px] font-medium">
              {{ relogio }}
            </div>
          </div>

          <div class="h-10 w-[1px] bg-gray-100"></div>

          <div class="flex items-center gap-3 text-right">
            <div class="leading-tight">
              <p class="text-sm font-medium text-gray-800 whitespace-nowrap">
                {{ usuario?.nome || 'Nome desconhecido' }}
              </p>
              <p class="text-[10px] font-medium text-blue-600 uppercase tracking-widest text-right">
                {{ usuario?.perfil || 'Perfil desconhecido' }}
              </p>
            </div>

            <div
              class="w-10 h-10 bg-blue-50 border border-blue-100 rounded-full flex items-center justify-center text-blue-600 shadow-sm"
            >
              <i class="pi pi-user text-lg"></i>
            </div>
          </div>

          <button
            @click="handleLogout"
            class="flex items-center gap-2 px-3 py-2 text-red-500 hover:text-gray-400 font-bold text-[11px] uppercase tracking-tighter transition-all"
          >
            <span>Sair</span>
          </button>
        </div>
      </header>

      <v-container class="pa-0 mx-4 my-3" fluid>
        <v-card variant="flat" class="px-3 w-100">
          <!-- Título -->
          <v-row align="center" class="mb-4">
            <v-col cols="6" class="py-8">
              <v-title>
                <span>Gerenciar Datas de Atendimento</span>
              </v-title>
              <div class="flex gap-6 mb-6">
                <v-select
                  label="Setor"
                  v-model="setorSelecionado"
                  :items="setores"
                  item-title="nome"
                  item-value="id"
                  variant="outlined"
                  density="compact"
                  style="width: 300px"
                  @update:modelValue="buscarConfiguracoes"
                />

                <v-select
                  label="Configuração"
                  v-model="configSelecionada"
                  :items="configuracoes"
                  item-title="descricao"
                  item-value="id"
                  variant="outlined"
                  density="compact"
                  style="width: 400px"
                  @update:modelValue="buscarDatasConfiguracao"
                />
              </div>

              <!-- CALENDARIO -->
              <div class="calendar">
                <!-- header -->
                <div class="flex items-center mb-4">
                  <v-btn icon="mdi-chevron-left" @click="mesAnterior" />

                  <h2 class="mx-4 font-bold">{{ nomeMes }} / {{ anoAtual }}</h2>

                  <v-btn icon="mdi-chevron-right" @click="proximoMes" />
                </div>

                <!-- dias semana -->
                <div class="grid grid-cols-7 mb-2 text-center text-sm">
                  <div v-for="d in diasSemana" :key="d">
                    {{ d }}
                  </div>
                </div>

                <!-- dias -->
                <div class="grid grid-cols-7 gap-2">
                  <div v-for="(dia, index) in diasCalendario" :key="index">
                    <div v-if="!dia"></div>

                    <v-card
                      v-else
                      class="text-center py-3 cursor-pointer"
                      :color="isSelecionado(dia) ? 'green-lighten-4' : 'white'"
                      @click="toggleDia(dia)"
                    >
                      {{ dia }}
                    </v-card>
                  </div>
                </div>
              </div>

              <!-- BOTÃO -->
              <div class="mt-6">
                <v-btn color="primary" @click="salvarDatas"> Salvar Alterações </v-btn>
              </div>
            </v-col>
          </v-row>

          <v-divider class="mb-4"></v-divider>
        </v-card>
      </v-container>
    </main>
  </div>
</template>

<script>
import AdminConfig from '@/components/AdminConfig.vue'
import api from '@/services/api'
import { AtendenteApi } from '@/services/atendente.api'

export default {
  components: { AdminConfig },
  data() {
    return {
      usuario: null,
      allConfigs: [],
      setores: [],
      configuracoes: [],
      setorSelecionado: null,
      configSelecionada: null,
      datasBackend: [],
      datasSelecionadas: [],
      diasSemana: ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'],
      dataAtual: new Date(),
      diasCalendario: [],
      relogio: '--:--:--',
    }
  },

  computed: {
    temAtendimentoAtivo() {
      const meuId = Number(this.usuario?.id || localStorage.getItem('usuarioId'))

      if (!this.agendamentosPorSetor.length) return false

      return this.agendamentosPorSetor.some((a) => {
        const status = a.situacao?.toUpperCase()
        const idNoBanco = Number(a.gerenciadorId)

        const ocupado = status === 'CHAMADO' || status === 'EM_ATENDIMENTO'
        const ehMeu = idNoBanco === meuId

        return ocupado && ehMeu
      })
    },
    displayLocalAtendimento() {
      const numero = Number(this.usuario?.guiche || '1')
      const secretariaNome = localStorage.getItem('secretariaNomeAtiva')?.toUpperCase() || ''

      if (secretariaNome.includes('SAÚDE') || secretariaNome.includes('SAUDE')) {
        // 🛡️ MAPEAMENTO MANUAL (DE-PARA)
        // O número da esquerda é o que está no BANCO (coluna 'numero')
        // O texto da direita é o que o usuário vai LER na tela
        const mapaSaude = {
          1: 'Classificação 01',
          2: 'Classificação 02',
          3: 'Recepção',
          4: 'Consultório 01', // No banco é 4, na tela é 01
          5: 'Consultório 02', // No banco é 5, na tela é 02
          // Adicione aqui conforme a bagunça do banco:
          // 10: "Consultório 03",
        }

        return mapaSaude[numero] || `Atendimento ${numero}`
      }

      // Padrão para outras secretarias (apenas o número com zero à esquerda)
      return String(numero).padStart(2, '0')
    },
    labelLocalTrabalho() {
      const secretariaNome = localStorage.getItem('secretariaNomeAtiva')?.toUpperCase() || ''
      const perfil = this.usuario?.perfil?.toUpperCase()

      // Se for saúde, usamos um termo mais genérico para o cabeçalho
      if (secretariaNome.includes('SAÚDE') || secretariaNome.includes('SAUDE')) {
        return 'Local de Atendimento'
      }

      if (perfil === 'MEDICO') return 'Consultório'
      if (perfil === 'TRIAGEM') return 'Sala'
      return 'Guichê'
    },

    nomeMes() {
      const meses = [
        'Janeiro',
        'Fevereiro',
        'Março',
        'Abril',
        'Maio',
        'Junho',
        'Julho',
        'Agosto',
        'Setembro',
        'Outubro',
        'Novembro',
        'Dezembro',
      ]
      return meses[this.dataAtual.getMonth()]
    },
    anoAtual() {
      return this.dataAtual.getFullYear()
    },
  },

  async mounted() {
    this.gerarCalendario()
    await this.carregarSetores() // Chama exatamente como na outra tela
    window.addEventListener('beforeunload', this.handleBeforeUnload)

    await this.getUsuarioLogado()
    await this.buscarAgendamentos()

    // Eu subi o intervalo para 2 segundos, pois 1 segundo afoga o servidor se houverem muitos atendentes
    setInterval(() => {
      this.buscarAgendamentos()
    }, 2000)

    this.carregarServicos()
    this.carregarTiposAtendimento()
    this.atualizarRelogioLocal()
    setInterval(this.atualizarRelogioLocal, 1000)
    setInterval(() => {
      this.enviarPing()
    }, 10000)

    if (this.usuario?.setores) {
      const setorAtual = this.usuario.setores.find((s) => s.id == this.setorTrabalhoId)
      this.enderecoEstatico = setorAtual ? `Unidade: ${setorAtual.nome}` : 'Unidade de Atendimento'
    }
  },

  methods: {
    atualizarRelogioLocal() {
      this.horaAtual = new Date()
      this.relogio = this.horaAtual.toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      })
    },
    formatarLocalAtendimento(numero) {
      const secretariaNome = localStorage.getItem('secretariaNomeAtiva')?.toUpperCase() || ''
      if (secretariaNome.includes('SAÚDE')) {
        const nomes = {
          1: 'Classificação 01',
          2: 'Classificação 02',
          3: 'Recepção',
          4: 'Consultório 01',
          5: 'Consultório 02',
        }
        return nomes[Number(numero)] || `Sala ${numero}`
      }
      return `Guichê ${numero}`
    },
    async handleLogout() {
      const token = localStorage.getItem('token')
      const usuarioId = this.usuario?.id || localStorage.getItem('usuarioId')

      try {
        if (usuarioId && token) {
          await AtendenteApi.deslogarGuiche(usuarioId)
        }
      } catch (error) {
        console.error('Erro técnico ao deslogar guichê:', error.response?.data || error.message)
      } finally {
        localStorage.clear()
        this.usuario = null

        window.location.href = '/'
      }
    },
    // PADRÃO IGUAL À OUTRA TELA:
    async carregarSetores() {
      try {
        // Removido o '/api' pois o SetorController não tem esse prefixo no Java
        // E adicionado o caminho que você confirmou que funciona
        const { data } = await api.get('/setores/por-secretaria/5')
        this.setores = data
      } catch (e) {
        console.error('Erro ao carregar setores', e)
      }
    },

    async buscarConfiguracoes() {
      if (!this.setorSelecionado) return
      try {
        // Aqui mantemos o /api/ porque ConfiguracaoAtendimentoController TEM o prefixo
        const { data } = await api.get(
          `/api/configuracoes-atendimento/setor/${this.setorSelecionado}?ativo=true`,
        )

        this.configuracoes = data.map((c) => ({
          ...c,
          descricao: `${c.tipoRegra === 'POR_QUANTIDADE' ? 'Qtd' : 'Intervalo'} (${c.horaInicio} - ${c.horaFim})`,
        }))

        this.configSelecionada = null
        this.datasBackend = []
        this.datasSelecionadas = []
      } catch (e) {
        console.error('Erro ao buscar configurações', e)
      }
    },

    async buscarDatasConfiguracao() {
      if (!this.configSelecionada) return
      try {
        const { data } = await api.get(`/api/configuracoes-atendimento/${this.configSelecionada}`)
        // Mapeia o campo do seu Model Java: datasAtendimento
        this.datasBackend = data.datasAtendimento || []
        this.datasSelecionadas = [...this.datasBackend]
      } catch (e) {
        console.error('Erro ao buscar datas', e)
      }
    },

    async salvarDatas() {
      if (!this.configSelecionada) return

      const novas = this.datasSelecionadas.filter((d) => !this.datasBackend.includes(d))
      const removidas = this.datasBackend.filter((d) => !this.datasSelecionadas.includes(d))

      try {
        if (novas.length) {
          await api.post(`/api/configuracoes-atendimento/${this.configSelecionada}/datas`, {
            datas: novas,
          })
        }

        if (removidas.length) {
          // O delete do seu Java recebe o Set<LocalDate> direto no corpo
          await api.delete(`/api/configuracoes-atendimento/${this.configSelecionada}/datas`, {
            data: removidas,
          })
        }

        alert('Configurações de datas salvas!')
        await this.buscarDatasConfiguracao()
      } catch (e) {
        alert('Erro ao salvar datas.')
      }
    },

    // Métodos do Calendário (mantidos)
    gerarCalendario() {
      const ano = this.dataAtual.getFullYear()
      const mes = this.dataAtual.getMonth()
      const primeiroDia = new Date(ano, mes, 1).getDay()
      const totalDias = new Date(ano, mes + 1, 0).getDate()
      const dias = []
      for (let i = 0; i < primeiroDia; i++) dias.push(null)
      for (let i = 1; i <= totalDias; i++) dias.push(i)
      this.diasCalendario = dias
    },
    mesAnterior() {
      this.dataAtual = new Date(this.dataAtual.getFullYear(), this.dataAtual.getMonth() - 1, 1)
      this.gerarCalendario()
    },
    proximoMes() {
      this.dataAtual = new Date(this.dataAtual.getFullYear(), this.dataAtual.getMonth() + 1, 1)
      this.gerarCalendario()
    },
    isSelecionado(dia) {
      if (!dia) return false
      return this.datasSelecionadas.includes(this.formatarData(dia))
    },
    toggleDia(dia) {
      const data = this.formatarData(dia)
      const index = this.datasSelecionadas.indexOf(data)
      if (index > -1) this.datasSelecionadas.splice(index, 1)
      else this.datasSelecionadas.push(data)
    },
    formatarData(dia) {
      const ano = this.dataAtual.getFullYear()
      const mes = (this.dataAtual.getMonth() + 1).toString().padStart(2, '0')
      const d = dia.toString().padStart(2, '0')
      return `${ano}-${mes}-${d}`
    },

    async getAllConfigs() {
      try {
        const { data } = await api.get('/api/configuracoes-atendimento')
        this.allConfigs = data
      } catch (e) {
        console.error(e)
      }
    },
    mounted() {
      this.getAllConfigs()
    },
  },
}
</script>

<style scoped>
.calendar-grid {
  border-top: 1px solid #e0e0e0;
  border-left: 1px solid #e0e0e0;
}
.day-card {
  border-radius: 8px !important;
  transition: all 0.2s;
}
.border-green {
  border: 2px solid #4caf50 !important;
}
.text-tiny {
  line-height: 1;
}
.gap-2 {
  gap: 8px;
}
</style>
