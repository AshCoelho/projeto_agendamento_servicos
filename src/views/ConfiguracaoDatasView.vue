<template>
  <div class="flex min-h-screen bg-[#f8f9fd] font-sans text-[#2d3748]">
    <AdminConfig />

    <main class="flex-1 flex flex-col">
      <header
        class="flex justify-between bg-white border-b border-black items-center px-4 mb-5 py-4"
      >
        <div class="text-[13px] font-bold text-gray-400">
          Administração /
          <span class="text-gray-900">Configuração de Datas</span>
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
import api from '@/services/api' // Usando sua instância padronizada
import { AppWindow } from 'lucide-vue-next'

export default {
  components: { AdminConfig },
  data() {
    return {
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
    }
  },

  computed: {
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
  },

  methods: {
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
