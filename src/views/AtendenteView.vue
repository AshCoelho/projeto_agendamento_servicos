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
        class="flex justify-between bg-white border-b border-black items-center px-8 mb-5 py-4"
      >
        <div class="text-[13px] font-bold text-gray-400">
          Gestão / <span class="text-gray-900">Monitor Operacional</span>
        </div>

        <div class="relative w-1/3">
          <i class="pi pi-search absolute left-4 top-1/2 -translate-y-1/2 text-gray-300"></i>
          <input
            v-model="filtroTexto"
            type="text"
            placeholder="Localizar senha ou cidadão..."
            class="w-full bg-[#f1f4f9] border-none rounded-full py-2.5 pl-12 text-xs placeholder-gray-400 focus:ring-1 outline-none"
          />
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

      <ChamarSenhas @senha-chamada="onSenhaChamadaPelosBotoes"></ChamarSenhas>

      <div class="px-8 pb-8">
        <div class="bg-white rounded-[15px] shadow-sm border-b-4 border-transparent p-4">
          <div class="flex justify-between">
            <div class="flex justify-start gap-6 mb-4 px-4">
              <button
                @click="mudarAba('AGUARDANDO')"
                :class="
                  abaAtiva === 'AGUARDANDO'
                    ? 'bg-[#2563eb] text-white rounded-[7px] p-1 shadow-blue-100'
                    : 'bg-transparent text-gray-400 hover:bg-gray-50 hover:text-gray-600'
                "
                class="text-xs font-black border-b-2 p-2 uppercase "
              >
                Fila Geral<sup
                  class="ml-0.5 bg-gray-400 text-white font-bold inline-flex items-center justify-center w-4 h-4 rounded-full text-[10px]"
                  >{{ agendamentosAguardando }}</sup
                >
              </button>

              <button
                @click="mudarAba('PRIORIDADES')"
                :class="
                  abaAtiva === 'PRIORIDADES'
                    ? 'bg-[#2563eb] text-white rounded-[7px] p-1 shadow-blue-100'
                    : 'bg-transparent text-gray-400 hover:bg-gray-50 hover:text-gray-600'
                "
                class="text-xs font-black border-b-2 p-2 uppercase tracking-widest"
              >
                Prioridades<sup class="ml-0.5 bg-gray-400 text-white font-bold inline-flex items-center justify-center w-4 h-4 rounded-full text-[10px]"">{{ totalPrioridadeFila }}</sup>
              </button>

              <button
                @click="mudarAba('ATENDIMENTO')"
                :class="
                  abaAtiva === 'ATENDIMENTO'
                    ? 'bg-[#2563eb] text-white rounded-[7px] p-1 shadow-blue-100'
                    : 'bg-transparent text-gray-400 hover:bg-gray-50 hover:text-gray-600'
                "
                class="text-xs font-black border-b-2 p-2 uppercase tracking-widest"
              >
                Em Atendimento<sup class="ml-0.5 bg-gray-400 text-white font-bold inline-flex items-center justify-center w-4 h-4 rounded-full text-[10px]">{{ agendamentosEmAtendimento }}</sup>
              </button>

              <button
                @click="mudarAba('CANCELADOS')"
                :class="
                  abaAtiva === 'CANCELADOS'
                    ? 'bg-[#2563eb] text-white rounded-[7px] p-1 shadow-blue-100'
                    : 'bg-transparent text-gray-400 hover:bg-gray-50 hover:text-gray-600'
                "
                class="text-xs font-black border-b-2 p-2 uppercase tracking-widest"
              >
                Ausentes<sup class="ml-0.5 bg-gray-400 text-white font-bold inline-flex items-center justify-center w-4 h-4 rounded-full text-[10px]"">{{ agendamentosCancelados }}</sup>
              </button>

              <button
                @click="mudarAba('FINALIZADOS')"
                :class="
                  abaAtiva === 'FINALIZADOS'
                    ? 'bg-[#2563eb] text-white rounded-[7px] p-1 shadow-blue-100'
                    : 'bg-transparent text-gray-400 hover:bg-gray-50 hover:text-gray-600'
                "
                class="text-xs font-black border-b-2 p-2 uppercase tracking-widest"
              >
                Atendidos<sup class="ml-0.5 bg-gray-400 text-white font-bold inline-flex items-center justify-center w-4 h-4 rounded-full text-[10px]"">{{ agendamentosFinalizados }}</sup>
              </button>

              <div
                v-if="mostrarModalEspontaneo"
                class="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm"
              >
                <div class="bg-white w-full max-w-md rounded-[12px] p-8 shadow-2xl">
                  <div class="d-flex align-center justify-space-between mb-6">
                    <h2
                      class="text-[#1e3a8a] text-lg font-black uppercase"
                      style="line-height: 1; justify-content: center"
                    >
                      Cadastro de Senha Espontânea
                    </h2>
                    <v-btn
                      @click="mostrarModalEspontaneo = false"
                      icon
                      size="small"
                      class="bg-transparent elevation-0"
                    >
                      <v-icon> mdi-close </v-icon>
                    </v-btn>
                  </div>
                  <form @submit.prevent="salvarEspontaneo" class="space-y-4">
                    <div>
                      <label class="block text-[10px] font-black text-gray-400 uppercase mb-2 ml-1"
                        >Nome do Cidadão</label
                      >
                      <v-text-field
                        v-model="novoAgendamento.nomeCidadao"
                        type="text"
                        rounded="12px"
                        variant="solo"
                        density="compact"
                        class="w-full border-none text-xs font-bold ring-gray-500 focus:ring-gray-500"
                        required
                      />
                    </div>

                    <div>
                      <label class="block text-[10px] font-black text-gray-400 uppercase mb-2 ml-1"
                        >Secretaria</label
                      >
                      <v-text-field
                        :model-value="
                          usuario?.secretarias?.find((s) => s.id == secretariaTrabalhoId)?.nome ||
                          'Não identificada'
                        "
                        density="compact"
                        rounded="12px"
                        variant="solo"
                        bg-color="transparent"
                        class=""
                        required
                        readonly
                      >
                      </v-text-field>
                    </div>

                    <div>
                      <label class="block text-[10px] font-black text-gray-400 uppercase mb-2 ml-1"
                        >Setor</label
                      >
                      <v-text-field
                        v-model="enderecoEstatico"
                        density="compact"
                        rounded-2xl
                        variant="solo"
                        bg-color="transparent"
                        class=""
                        required
                        readonly
                      >
                      </v-text-field>
                    </div>

                    <div>
                      <label class="block text-[10px] font-black text-gray-400 uppercase mb-2 ml-1"
                        >Tipo de Atendimento</label
                      >
                      <v-select
                        v-model="novoAgendamento.tipoAtendimentoId"
                        :items="tiposAtendimento"
                        item-title="nome"
                        item-value="id"
                        density="compact"
                        variant="solo"
                        required
                      ></v-select>
                    </div>

                    <div>
                      <label class="block text-[10px] font-black text-gray-400 uppercase mb-2 ml-1"
                        >Serviço</label
                      >
                      <v-select
                        v-model="novoAgendamento.servico"
                        :items="servicos"
                        item-title="nome"
                        item-value="id"
                        density="compact"
                        rounded-2xl
                        variant="solo"
                        bg-color="transparent"
                        class=""
                        required
                      >
                      </v-select>
                    </div>
                    <div>
                      <v-btn
                        color="primary"
                        @click="salvarEspontaneo"
                        class="text-capitalize w-100"
                      >
                        Cadastrar
                      </v-btn>
                    </div>
                  </form>
                </div>
              </div>

              <div
                v-if="mostrarModalEdicao"
                class="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm"
              >
                <div class="bg-white w-full max-w-md rounded-[12px] p-8 shadow-2xl">
                  <div class="d-flex align-center justify-space-between mb-6">
                    <h2
                      class="text-[#1e3a8a] text-lg font-black uppercase"
                      style="line-height: 1; justify-content: center"
                    >
                      Edição de Senha Espontânea
                    </h2>
                    <v-btn
                      @click="mostrarModalEdicao = false"
                      icon
                      size="small"
                      class="bg-transparent elevation-0"
                    >
                      <v-icon> mdi-close </v-icon>
                    </v-btn>
                  </div>
                  <form @submit.prevent="atualizarEspontaneo" class="space-y-4">
                    <div>
                      <label class="block text-[10px] font-black text-gray-400 uppercase mb-2 ml-1"
                        >Nome do Cidadão</label
                      >
                      <v-text-field
                        v-model="selectedItem.usuarioNome"
                        type="text"
                        rounded="12px"
                        variant="solo"
                        density="compact"
                        class="w-full border-none text-xs font-bold ring-gray-500 focus:ring-gray-500"
                        required
                      />
                    </div>

                    <div>
                      <label class="block text-[10px] font-black text-gray-400 uppercase mb-2 ml-1"
                        >Secretaria</label
                      >
                      <v-text-field
                        v-model="selectedItem.secretariaNome"
                        density="compact"
                        rounded="12px"
                        variant="solo"
                        bg-color="transparent"
                        class=""
                        required
                        readonly
                      >
                      </v-text-field>
                    </div>

                    <div>
                      <label class="block text-[10px] font-black text-gray-400 uppercase mb-2 ml-1"
                        >Setor</label
                      >
                      <v-text-field
                        v-model="enderecoEstatico"
                        density="compact"
                        rounded-2xl
                        variant="solo"
                        bg-color="transparent"
                        class=""
                        required
                        readonly
                      >
                      </v-text-field>
                    </div>

                    <div>
                      <label class="block text-[10px] font-black text-gray-400 uppercase mb-2 ml-1"
                        >Tipo de Atendimento</label
                      >
                      <v-select
                        v-model="novoAgendamento.tipoAtendimentoId"
                        :items="tiposAtendimento"
                        item-title="nome"
                        item-value="id"
                        label="Tipo de Atendimento"
                        density="compact"
                        variant="solo"
                        required
                      ></v-select>
                    </div>

                    <div>
                      <label class="block text-[10px] font-black text-gray-400 uppercase mb-2 ml-1"
                        >Serviço</label
                      >
                      <v-select
                        v-model="selectedItem.servicoId"
                        :items="servicos"
                        item-title="nome"
                        item-value="id"
                        label="Serviço"
                        density="compact"
                        variant="solo"
                        required
                      ></v-select>
                    </div>
                    <div>
                      <v-btn
                        color="primary"
                        @click="atualizarEspontaneo"
                        class="text-capitalize w-100"
                      >
                        Atualizar
                      </v-btn>
                    </div>
                  </form>
                </div>
              </div>
            </div>
            <div v-if="abaAtiva === 'AGUARDANDO'" class="flex justify-end mb-4 mr-4">
              <button
                @click="mostrarModalEspontaneo = true"
                class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-xs font-bold uppercase transition-all shadow-sm flex items-center gap-2"
              >
                <i class="pi pi-plus"></i>
                Nova Senha
              </button>
            </div>
          </div>

          <div
            class="max-h-[450px] overflow-y-auto custom-scrollbar relative rounded-b-[10px] border-t border-gray-100"
          >
            <table class="w-full relative">
              <thead
                class="text-[10px] font-bold text-gray-400 uppercase tracking-widest bg-white sticky top-0 z-10 shadow-sm"
              >
                <tr>
                  <th class="px-6 py-4 text-left">Editar</th>
                  <th class="px-6 py-4 text-left">Senha</th>
                  <th class="px-6 py-4 text-left">Cidadão</th>
                  <th class="px-6 py-4 text-left">Serviço</th>
                  <th class="px-6 py-4 text-left">Situação</th>
                  <th class="px-6 py-4 text-left">Tipo</th>
                  <th class="px-6 py-4 text-left">Data/Hora</th>
                  <th class="px-6 py-4 text-left">Tempo de Espera</th>
                  <th class="px-6 py-4 text-right pr-10">Ações</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-50">
                <tr
                  v-for="(item, index) in agendamentosFiltrados"
                  :key="index"
                  class="group hover:bg-gray-50 transition-colors"
                >
                  <td class="px-6 text-sm font-bold text-gray-500">
                    <v-btn
                      icon
                      class="bg-transparent elevation-0"
                      @click="agendamentoSelecionado(item)"
                    >
                      <v-icon color="success"> mdi-pencil-outline </v-icon>
                    </v-btn>
                  </td>
                  <td class="px-6 py-4">
                    <div class="flex items-center gap-3">
                      <div
                        :class="[
                          isPrioridade(item.senha)
                            ? 'bg-red-500 shadow-red-100'
                            : 'bg-blue-600 shadow-blue-100'
                        ]"
                        class="w-7 h-7 rounded-xl flex items-center justify-center text-white shadow-lg"
                      >
                        <i
                          :class="isPrioridade(item.senha) ? 'pi pi-bolt' : 'pi pi-user'"
                        ></i>
                      </div>

                      <span
                        :class="isPrioridade(item.senha) ? 'text-red-700' : 'text-blue-800'"
                        class="font-black text-base leading-none"
                      >
                        {{ item.senha }}
                      </span>
                    </div>
                  </td>
                  <td class="px-6 text-sm font-bold text-gray-500">{{ item.usuarioNome }}</td>
                  <td class="px-6 text-[11px] font-black text-gray-400 uppercase tracking-tighter">
                    {{ item.servicoNome }} - {{ usuario?.secretaria?.sigla }}
                  </td>
                  <td class="px-6">
                    <span
                      class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-[#2563eb] text-[10px] font-black rounded-lg uppercase tracking-tight"
                    >
                      <i class="pi pi-calendar text-[10px]"></i> {{ item.situacao }}
                    </span>
                  </td>

                  <td class="px-6">
                    <span
                      :class="[
                        item.tipoAtendimento === 'PRIORIDADE' 
                          ? 'bg-orange-50 text-orange-600'
                          : 'bg-gray-100 text-gray-500',
                      ]"
                      class="inline-flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-black rounded-lg uppercase tracking-tight"
                    >
                      <i
                        :class="item.tipoAtendimento === 'PRIORIDADE' ? 'pi pi-bolt' : 'pi pi-user'"
                        class="text-[10px]"
                      ></i>
                      {{ item.tipoAtendimento }}
                    </span>
                  </td>
                  <td class="px-6 text-xs font-bold text-gray-400 whitespace-nowrap">
                    {{ formatarDataHora(item.horaAgendamento) }}
                  </td>
                  <td class="px-6">
                    <span
                      class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 text-amber-600 text-[10px] font-black rounded-lg uppercase tracking-tight shadow-sm whitespace-nowrap"
                    >
                      <i class="pi pi-clock text-[10px]"></i>
                      {{ calcularTempoEspera(item.horaAgendamento, item.situacao) }}
                    </span>
                  </td>
                  <td class="px-6 text-right pr-6 py-4 flex gap-2 justify-end">
                    <v-btn
                      v-if="['AGENDADO', 'EM_ATENDIMENTO', 'FALTOU'].includes(item.situacao)"
                      color="#2563eb"
                      size="small"
                      class="text-white text-[10px] font-black"
                      @click="handleChamar(item.senha)"
                      >Chamar</v-btn
                    >

                    <v-btn
                      v-if="['CHAMADO', 'EM_ATENDIMENTO'].includes(item.situacao)"
                      color="green-darken-3"
                      size="small"
                      class="text-white text-[10px] font-black"
                      @click="handleFinalizar(item.agendamentoId)"
                      >Atendido</v-btn
                    >
                    <v-btn
                      v-if="abaAtiva === 'ATENDIMENTO'"
                      color="#e61919"
                      size="small"
                      class="text-white text-[10px] font-black"
                      @click="handleCancelar(item.agendamentoId)"
                      >Ausente</v-btn
                    >
                  </td>
                </tr>
                <tr v-if="agendamentosFiltrados.length === 0">
                  <td
                    colspan="9"
                    class="px-6 py-10 text-center text-gray-300 font-bold uppercase text-xs"
                  >
                    Nenhum agendamento encontrado
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import ChamarSenhas from '@/components/ChamarSenhas.vue'
import NavBar from '@/components/NavBar.vue';
import { AgendamentoService } from '@/services/agendamento.service'
import { AtendenteApi } from '@/services/atendente.api'
import 'primeicons/primeicons.css'

export default {
  components: {
    ChamarSenhas,
    NavBar
  },

  data: () => ({
    // UI/Controle
    abaAtiva: 'AGUARDANDO',
    relogio: '--:--:--',
    mostrarModalEdicao: false,
    mostrarModalEspontaneo: false,
    sidebarAberta: false,

    // Dados
    filtroTexto: '',
    usuario: null,
    setorTrabalhoId: null,
    secretariaTrabalhoId: null,
    enderecoEstatico: null,
    agendamentosPorSetor: [],
    selectedItem: null,
    idsChamadosManualmente: [],
    servicos: [],
    tiposAtendimento: [],
    horaAtual: new Date(),

    // Formulários
    novoAgendamento: { nomeCidadao: '', servico: null, tipoAtendimentoId: null },
  }),

  watch: {
    mostrarModalEspontaneo(novoValor) {
      const acao = novoValor ? 'addEventListener' : 'removeEventListener'
      window[acao]('keydown', this.handleEsc)
    },
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

    agendamentosFiltrados() {
      const meuId = this.usuario?.id || localStorage.getItem('usuarioId')

      let lista = AgendamentoService.filtrarAgendamentos(
        this.agendamentosPorSetor,
        this.abaAtiva,
        this.idsChamadosManualmente,
        meuId,
      )

      if (this.filtroTexto && this.filtroTexto.trim() !== '') {
        const termo = this.filtroTexto.toLowerCase()
        lista = lista.filter((item) => {
          const senha = item.senha ? item.senha.toLowerCase() : ''
          const nome = item.usuarioNome ? item.usuarioNome.toLowerCase() : ''
          return senha.includes(termo) || nome.includes(termo)
        })
      }

      return lista
    },

    agendamentosAguardando() {
      return this.agendamentosPorSetor.filter(
        (a) => a.situacao === 'AGENDADO' && ['AGENDADO', 'ESPONTANEO'].includes(a.tipoAgendamento),
      ).length
    },

    agendamentosEmAtendimento() {
      const meuId = Number(this.usuario?.id || localStorage.getItem('usuarioId'))
      return this.agendamentosPorSetor.filter(
        (a) =>
          ['CHAMADO', 'EM_ATENDIMENTO'].includes(a.situacao) &&
          Number(a.gerenciadorId || a.usuarioId) === meuId
      ).length
    },

    agendamentosFinalizados() {
      const meuId = Number(this.usuario?.id || localStorage.getItem('usuarioId'))
      return this.agendamentosPorSetor.filter(
        (a) => 
          a.situacao === 'ATENDIDO' && 
          Number(a.gerenciadorId || a.usuarioId) === meuId
      ).length
    },

    agendamentosCancelados() {
      const meuId = Number(this.usuario?.id || localStorage.getItem('usuarioId'))
      return this.agendamentosPorSetor.filter(
        (a) => 
          a.situacao === 'FALTOU' && 
          Number(a.gerenciadorId || a.usuarioId) === meuId
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
    isPrioridade(senha) {
      return senha?.startsWith('P')
    },
    // 🟢 MÉTODO NOVO QUE FALTAVA (Reage ao clique dos botões gigantes)
    onSenhaChamadaPelosBotoes(idChamado) {
      // Pula para a aba Em Atendimento na mesma hora
      this.abaAtiva = 'ATENDIMENTO'

      // Altera o status na tabela visualmente sem esperar a internet
      if (idChamado) {
        const meuId = Number(this.usuario?.id || localStorage.getItem('usuarioId'))
        const index = this.agendamentosPorSetor.findIndex(
          (a) => (a.agendamentoId || a.id) === idChamado,
        )

        if (index !== -1) {
          this.agendamentosPorSetor[index].situacao = 'CHAMADO'
          this.agendamentosPorSetor[index].gerenciadorId = meuId
          this.idsChamadosManualmente.push(idChamado)
        }
      }
    },

    mudarAba(novaAba) {
      this.abaAtiva = novaAba
    },
    handleEsc(e) {
      if (e.key === 'Escape') this.mostrarModalEspontaneo = false
    },
    agendamentoSelecionado(item) {
      this.selectedItem = item
      this.mostrarModalEdicao = true
    },

    atualizarRelogioLocal() {
      this.horaAtual = new Date()
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

    calcularTempoEspera(horaAgendamento, situacao) {
      if (!horaAgendamento) return '--'

      if (['ATENDIDO', 'FINALIZADOS', 'FALTOU', 'CANCELADO'].includes(situacao)) {
        return '--'
      }

      const dataCriacao = new Date(horaAgendamento).getTime()
      const agora = this.horaAtual.getTime()
      let diffMs = agora - dataCriacao

      if (diffMs < 0) diffMs = 0

      const minutosTotal = Math.floor(diffMs / 60000)
      const horas = Math.floor(minutosTotal / 60)
      const minRestantes = minutosTotal % 60

      if (horas > 0) {
        return `${horas}h ${String(minRestantes).padStart(2, '0')}m`
      }
      return `${minutosTotal} min`
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

        // 🔴 APAGUE O ROUTER.PUSH
        // this.$router.push({ name: 'login' })

        // 🟢 USE ISSO: Faz o papel de um "F5" e manda pro login com a memória limpa!
        window.location.href = '/'
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
        }
      } catch (e) {
        console.error('Erro ao buscar agendamentos:', e)
      }
    },

    async handleChamar(senha) {
      const itemClicado = this.agendamentosPorSetor.find((a) => a.senha === senha)
      if (!itemClicado) return

      const statusClicado = itemClicado.situacao?.toUpperCase()
      const meuId = Number(this.usuario?.id || localStorage.getItem('usuarioId'))
      const donoDoItemClicado = Number(itemClicado.gerenciadorId || itemClicado.usuarioId)

      const ehMinhaSenhaAtual =
        (statusClicado === 'EM_ATENDIMENTO' || statusClicado === 'CHAMADO') &&
        donoDoItemClicado === meuId

      if (this.temAtendimentoAtivo && !ehMinhaSenhaAtual) {
        alert('Você já possui um atendimento em aberto. Finalize-o antes de chamar outra senha.')
        return
      }

      try {
        const res = await AtendenteApi.chamarPorSenha(senha, this.usuario.id, this.setorTrabalhoId)

        if (res.status === 200) {
          if (itemClicado) {
            // 🟢 Atualização Otimista Direta
            this.idsChamadosManualmente.push(itemClicado.agendamentoId || itemClicado.id)
            itemClicado.situacao = 'CHAMADO'
            itemClicado.gerenciadorId = meuId
          }

          // Muda a aba instantaneamente
          this.abaAtiva = 'ATENDIMENTO'
        }
      } catch (e) {
        alert(e?.response?.data?.mensagem || 'Falha na chamada.')
      }
    },

    async handleCancelar(id) {
      if (!confirm('Deseja realmente cancelar?')) return
      try {
        const token = localStorage.getItem('token')
        await AtendenteApi.cancelarAtendimento(id, token)

        this.idsChamadosManualmente = this.idsChamadosManualmente.filter((itemId) => itemId !== id)

        const index = this.agendamentosPorSetor.findIndex((a) => (a.agendamentoId || a.id) === id)
        if (index !== -1) {
          this.agendamentosPorSetor[index].situacao = 'FALTOU'
        }

        // Volta pra Fila Geral na hora
        this.abaAtiva = 'AGUARDANDO'
      } catch (e) {
        alert('Erro ao cancelar.')
      }
    },

    async handleFinalizar(id) {
      if (!confirm('Deseja finalizar?')) return
      try {
        await AtendenteApi.finalizarAtendimento(id)

        this.idsChamadosManualmente = this.idsChamadosManualmente.filter((itemId) => itemId !== id)

        const index = this.agendamentosPorSetor.findIndex((a) => (a.agendamentoId || a.id) === id)
        if (index !== -1) {
          this.agendamentosPorSetor[index].situacao = 'ATENDIDO'
        }

        this.mostrarModalEdicao = false

        // Volta pra Fila Geral na hora
        this.abaAtiva = 'AGUARDANDO'
      } catch (e) {
        console.error('Erro ao finalizar:', e)
        alert('Erro ao finalizar atendimento.')
      }
    },

    async salvarEspontaneo() {
      try {
        if (!this.novoAgendamento.nomeCidadao || this.novoAgendamento.nomeCidadao.trim() === '') {
          alert('Por favor, informe o nome do cidadão.')
          return
        }

        if (!this.novoAgendamento.servico) {
          alert('Por favor, selecione um serviço para o atendimento.')
          return
        }

        const payload = {
          nomeCidadao: this.novoAgendamento.nomeCidadao,
          tipoAtendimentoId: Number(this.novoAgendamento.tipoAtendimentoId),
          servicoId: Number(this.novoAgendamento.servico),
          setorId: Number(this.setorTrabalhoId),
          situacao: 'AGENDADO',
        }

        const res = await AtendenteApi.salvarEspontaneo(this.secretariaTrabalhoId, payload)

        if (res.status === 200 || res.status === 201) {
          const senhaGerada = res.data?.senha || ''

          this.mostrarModalEspontaneo = false
          this.novoAgendamento = { nomeCidadao: '', servico: null, tipoAtendimentoId: null }

          await this.buscarAgendamentos()
          await this.carregarTiposAtendimento()

        }
      } catch (e) {
        console.error('Erro ao salvar:', e)
        const msgErro = e.response?.data?.mensagem || e.message || 'Erro de comunicação'
        alert('Erro: ' + msgErro)
      }
    },

    async atualizarEspontaneo() {
      try {
        const idServico = this.selectedItem.servicoId || this.selectedItem.servico?.id
        const payload = { nomeCidadao: this.selectedItem.usuarioNome, servicoId: Number(idServico) }
        const token = localStorage.getItem('token')
        await AtendenteApi.atualizarEspontaneo(this.selectedItem.agendamentoId, payload, token)
        this.mostrarModalEdicao = false
        await this.buscarAgendamentos()
      } catch (e) {
        alert('Erro ao atualizar.')
      }
    },

    async carregarServicos() {
      try {
        const res = await AtendenteApi.carregarServicos(this.secretariaTrabalhoId)
        this.servicos = res.data
      } catch (e) {
        console.error(e)
      }
    },

    async carregarTiposAtendimento() {
      try {
        const { data } = await AtendenteApi.carregarTiposAtendimento(this.secretariaTrabalhoId)
        this.tiposAtendimento = data

        if (data.length > 0 && !this.novoAgendamento.tipoAtendimentoId) {
          const padrao = data.find((t) => t.nome.toUpperCase() === 'NORMAL')
          if (padrao) this.novoAgendamento.tipoAtendimentoId = padrao.id
        }
      } catch (error) {
        console.error('Erro ao carregar tipos:', error)
      }
    },
  },

  async mounted() {
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

    if (this.usuario?.setores) {
      const setorAtual = this.usuario.setores.find((s) => s.id == this.setorTrabalhoId)
      this.enderecoEstatico = setorAtual ? `Unidade: ${setorAtual.nome}` : 'Unidade de Atendimento'
    }
  },
}
</script>

<style scoped>
/* CSS para customizar a barra de rolagem e deixá-la elegante */
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: #f8f9fd;
  border-radius: 8px;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 8px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
</style>
