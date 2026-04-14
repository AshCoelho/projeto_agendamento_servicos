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
                      @dblclick="abrirModalHorarios(formatarData(dia))"
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

      <v-dialog v-model="modalHorarios" max-width="500px">
        <v-card>
          <v-card-title class="bg-blue-darken-2 text-white d-flex justify-space-between align-center">
            <div class="d-flex flex-column">
              <span class="text-h6">Horários Disponíveis</span>
              <span class="text-caption">{{ dataSelecionadaFormatada }}</span>
            </div>
            <v-btn icon="mdi-close" variant="text" @click="modalHorarios = false"></v-btn>
          </v-card-title>

          <v-card-text class="pa-4">
            <div v-if="carregandoHorarios" class="text-center py-8">
              <v-progress-circular indeterminate color="primary" size="50"></v-progress-circular>
              <p class="mt-4 text-grey">Buscando horários...</p>
            </div>

            <div v-else-if="horariosDia.length === 0" class="text-center py-8">
              <v-icon size="64" color="grey-lighten-1">mdi-clock-alert-outline</v-icon>
              <p class="text-grey-darken-1 mt-2">Nenhum horário gerado.</p>
            </div>

            <div v-else>
              <p class="text-caption mb-3 text-grey-darken-1">
                <v-icon size="small" color="blue-darken-2">mdi-information-outline</v-icon>
                Clique para selecionar os horários que deseja <strong>remover</strong>:
              </p>

              <div class="d-flex flex-wrap justify-start">
                <v-chip
                  v-for="(h, i) in horariosDia"
                  :key="i"
                  
                  :color="isParaExcluir(h.hora) ? 'red-darken-4' : 'blue-darken-2'"
                  variant="flat"
                  size="large"
                  class="ma-1 font-weight-bold"
                  
                  theme="dark"
                  @click="toggleHorarioExclusao(h.hora)"
                >
                  <v-icon start :icon="isParaExcluir(h.hora) ? 'mdi-delete-sweep' : 'mdi-clock-outline'"></v-icon>
                  
                  {{ h.hora.substring(0, 5) }}
                  
                  <span class="ml-2 text-[10px] font-weight-regular opacity-80">
                    {{ isParaExcluir(h.hora) ? 'EXCLUIR' : '(' + h.vagas + ' v)' }}
                  </span>
                </v-chip>
              </div>
            </div>
          </v-card-text>

          <v-divider></v-divider>

          <v-card-actions class="pa-4">
            <v-btn
              v-if="horariosParaExcluir.length > 0"
              color="error"
              variant="elevated"
              prepend-icon="mdi-delete"
              @click="excluirHorariosSelecionados"
            >
              Excluir {{ horariosParaExcluir.length }} selecionado(s)
            </v-btn>
            <v-spacer></v-spacer>
            <v-btn color="grey-darken-1" variant="text" @click="modalHorarios = false">Fechar</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

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
      filtroTexto: '',
      allConfigs: [],
      setores: [], // Agora será preenchido pelos setores do Admin
      configuracoes: [],
      setorSelecionado: null,
      configSelecionada: null,
      datasBackend: [],
      datasSelecionadas: [],
      diasSemana: ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'],
      dataAtual: new Date(),
      diasCalendario: [],
      relogio: '--:--:--',
      agendamentosPorSetor: [],
      modalHorarios: false,
      carregandoHorarios: false,
      horariosDia: [],
      dataSelecionadaFormatada: '',
      horariosParaExcluir: [],
      dataAbertaNoModal: null // Precisamos disso para o DELETE saber o dia
    }
  },

  computed: {
    // ... (suas computeds displayLocalAtendimento, labelLocalTrabalho, etc permanecem iguais)
    nomeMes() {
      const meses = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro']
      return meses[this.dataAtual.getMonth()]
    },
    anoAtual() {
      return this.dataAtual.getFullYear()
    },
  },

  async mounted() {
    this.gerarCalendario()
    this.atualizarRelogioLocal()
    setInterval(this.atualizarRelogioLocal, 1000)

    try {
      // 1. Carrega o usuário primeiro para saber os setores permitidos
      await this.carregarDadosUsuario() 
      // 2. Não precisamos mais do carregarSetores() com ID fixo 5
      await this.getAllConfigs()
    } catch (e) {
      console.error("Erro no carregamento inicial:", e)
    }
  },

  methods: {

    isParaExcluir(hora) {
      return this.horariosParaExcluir && this.horariosParaExcluir.includes(hora);
    },

    async carregarDadosUsuario() {
      try {
        const { data } = await api.get('/gerenciador/usuario-logado')
        this.usuario = data
        // Preenche o select de setores com os setores que o Admin possui
        this.setores = data.setores || []
        
        // Opcional: pré-selecionar o primeiro setor
        if (this.setores.length > 0) {
          this.setorSelecionado = this.setores[0].id
          this.buscarConfiguracoes()
        }
      } catch (e) {
        console.error("Erro ao carregar usuário", e)
      }
    },

    atualizarRelogioLocal() {
      this.relogio = new Date().toLocaleTimeString('pt-BR')
    },

    async buscarConfiguracoes() {
      if (!this.setorSelecionado) return
      try {
        // Chamando a nova rota de ativos que criamos no Java
        const { data } = await api.get(`/configuracoes-atendimento/setor/${this.setorSelecionado}/ativos`)
        
        this.configuracoes = data.map((c) => ({
          ...c,
          descricao: `${c.tipoRegra === 'POR_QUANTIDADE' ? 'Qtd' : 'Intervalo'} (${c.horaInicio} - ${c.horaFim})`,
        }))
        
        this.configSelecionada = null
        this.datasBackend = []
        this.datasSelecionadas = []
      } catch (e) {
        console.error('Erro ao buscar configurações ativas', e)
      }
    },

    async buscarDatasConfiguracao() {
      if (!this.configSelecionada) return
      try {
        const { data } = await api.get(`/configuracoes-atendimento/${this.configSelecionada}`)
        // Mapeia as datas que já existem no banco para o calendário
        this.datasBackend = data.datasAtendimento || []
        this.datasSelecionadas = [...this.datasBackend]
      } catch (e) {
        console.error('Erro ao buscar datas', e)
      }
    },

    async salvarDatas() {
      if (!this.configSelecionada) return

      const novas = this.datasSelecionadas.filter((d) => !this.datasBackend.includes(d))
      const removidas = this.datasBackend.filter((d) => this.datasBackend.includes(d) && !this.datasSelecionadas.includes(d))

      try {
        if (novas.length) {
          await api.post(`/configuracoes-atendimento/${this.configSelecionada}/datas`, { datas: novas })
        }

        if (removidas.length) {
          await api.delete(`/configuracoes-atendimento/${this.configSelecionada}/datas`, { 
            data: removidas 
          })
        }

        alert('Configurações de datas salvas!')
        await this.buscarDatasConfiguracao()
      } catch (e) {
        // Pega a mensagem de erro vinda do @RestController do Java
        const msgErro = e.response?.data?.mensagem || e.response?.data || e.message
        
        console.error("Erro na requisição:", msgErro)
        
        // Exibe o motivo real (ex: "Não é possível desvincular a data...") no alert
        alert(msgErro)
      }
    },

    // Métodos do Calendário
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
      
      if (index > -1) {
        this.datasSelecionadas.splice(index, 1)
      } else {
        this.datasSelecionadas.push(data)
      }
    },

    async abrirModalHorarios(dataISO) {
      this.dataAbertaNoModal = dataISO; // SALVA A DATA PARA O DELETE
      this.dataSelecionadaFormatada = dataISO.split('-').reverse().join('/');
      this.modalHorarios = true;
      this.carregandoHorarios = true;
      this.horariosDia = [];
      this.horariosParaExcluir = []; // Limpa seleções anteriores

      try {
        const { data } = await api.get(`/slots/horarios-do-dia`, {
          params: {
            setorId: this.setorSelecionado,
            configuracaoId: this.configSelecionada,
            data: dataISO
          }
        });
        this.horariosDia = data || [];
      } catch (e) {
        console.error("Erro ao buscar horários", e);
      } finally {
        this.carregandoHorarios = false;
      }
    },

    formatarData(dia) {
      const ano = this.dataAtual.getFullYear()
      const mes = (this.dataAtual.getMonth() + 1).toString().padStart(2, '0')
      const d = dia.toString().padStart(2, '0')
      return `${ano}-${mes}-${d}`
    },

    toggleHorarioExclusao(hora) {
      const index = this.horariosParaExcluir.indexOf(hora);
      if (index > -1) {
        this.horariosParaExcluir.splice(index, 1);
      } else {
        this.horariosParaExcluir.push(hora);
      }
    },

    async excluirHorariosSelecionados() {
      const qtd = this.horariosParaExcluir.length;
      if (!confirm(`Deseja realmente excluir estes ${qtd} horário(s)?`)) return;

      this.carregandoHorarios = true;
      const dataISO = this.dataAbertaNoModal; 

      try {
        // Mapeia cada exclusão para uma chamada ao seu endpoint Java
        const exclusoes = this.horariosParaExcluir.map(hora => {
          return api.delete('/slots/horarios-do-dia', {
            params: {
              setorId: this.setorSelecionado,
              configuracaoId: this.configSelecionada,
              data: dataISO,
              hora: hora // O Java espera LocalTime (HH:mm:ss)
            }
          });
        });

        await Promise.all(exclusoes);
        alert(`${qtd} horário(s) removido(s)!`);
        
        this.horariosParaExcluir = [];
        await this.abrirModalHorarios(dataISO); // Recarrega a lista
        
      } catch (e) {
        const msg = e.response?.data?.mensagem || e.message || "Erro ao excluir horários";
        alert(msg);
      } finally {
        this.carregandoHorarios = false;
      }
    },

    async getAllConfigs() {
      try {
        const { data } = await api.get('/configuracoes-atendimento')
        this.allConfigs = data
      } catch (e) {
        console.error("Endpoint geral não disponível:", e)
      }
    }
  }
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
