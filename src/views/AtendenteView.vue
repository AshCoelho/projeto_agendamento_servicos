<template>
  <div class="flex min-h-screen bg-[#f8f9fd] font-sans text-[#2d3748]">
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

      <nav class="w-full px-4 space-y-2">
        <a
          href="#"
          :class="[sidebarAberta ? 'justify-start px-4' : 'justify-center px-0']"
          class="flex items-center gap-3 py-3 bg-[#2563eb] text-white rounded-[13px] shadow-xl shadow-blue-100 transition-all duration-300"
        >
          <i class="pi pi-grid-view"></i>
          <span v-if="sidebarAberta" class="text-sm font-bold whitespace-nowrap">Painel</span>
        </a>
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

      <ChamarSenhas></ChamarSenhas>
      <div class="px-8">
        <div class="bg-white rounded-[15px] shadow-sm border-b-4 border-transparent p-4">
          <div class="flex justify-between">
            <div class="flex justify-start gap-6 mb-6 px-4">
              <button
                @click="mudarAba('AGUARDANDO')"
                :class="
                  abaAtiva === 'AGUARDANDO'
                    ? 'bg-[#2563eb] text-white rounded-[7px] p-1 shadow-blue-100'
                    : 'bg-transparent text-gray-400 hover:bg-gray-50 hover:text-gray-600'
                "
                class="text-xs font-black border-b-2 pb-1 uppercase tracking-widest"
              >
                Fila Geral
              </button>

              <button
                @click="mudarAba('PRIORIDADES')"
                :class="
                  abaAtiva === 'PRIORIDADES'
                    ? 'bg-[#2563eb] text-white rounded-[7px] p-1 shadow-blue-100'
                    : 'bg-transparent text-gray-400 hover:bg-gray-50 hover:text-gray-600'
                "
                class="text-xs font-black border-b-2 pb-1 uppercase tracking-widest"
              >
                Prioridades
              </button>

              <button
                @click="mudarAba('ATENDIMENTO')"
                :class="
                  abaAtiva === 'ATENDIMENTO'
                    ? 'bg-[#2563eb] text-white rounded-[7px] p-1 shadow-blue-100'
                    : 'bg-transparent text-gray-400 hover:bg-gray-50 hover:text-gray-600'
                "
                class="text-xs font-black border-b-2 pb-1 uppercase tracking-widest"
              >
                Em Atendimento
              </button>

              <button
                @click="mudarAba('CANCELADOS')"
                :class="
                  abaAtiva === 'CANCELADOS'
                    ? 'bg-[#2563eb] text-white rounded-[7px] p-1 shadow-blue-100'
                    : 'bg-transparent text-gray-400 hover:bg-gray-50 hover:text-gray-600'
                "
                class="text-xs font-black border-b-2 pb-1 uppercase tracking-widest"
              >
                Ausentes
              </button>

              <button
                @click="mudarAba('FINALIZADOS')"
                :class="
                  abaAtiva === 'FINALIZADOS'
                    ? 'bg-[#2563eb] text-white rounded-[7px] p-1 shadow-blue-100'
                    : 'bg-transparent text-gray-400 hover:bg-gray-50 hover:text-gray-600'
                "
                class="text-xs font-black border-b-2 pb-1 uppercase tracking-widest"
              >
                Atendidos
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
                        rounded-2xl
                        variant="solo"
                        bg-color="transparent"
                        class=""
                        required
                      >
                      </v-select>
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
                  <form @submit.prevent="salvarEspontaneo" class="space-y-4">
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

          <table class="w-full">
            <thead
              class="text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-50"
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
              <tr v-for="(item, index) in agendamentosPaginados" :key="index" class="group">
                <td class="px-6 text-sm font-bold text-gray-500">
                  <v-btn
                    icon
                    class="bg-transparent elevation-0"
                    @click="agendamentoSelecionado(item)"
                  >
                    <v-icon color="success"> mdi-pencil-outline </v-icon>
                  </v-btn>
                </td>
                <td class="px-6 py-6">
                  <div class="flex items-center gap-3">
                    <div
                      class="w-10 h-10 bg-[#2563eb] rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-100"
                    >
                      <i class="pi pi-bolt"></i>
                    </div>
                    <span class="font-black text-[#1e3a8a] text-base leading-none">{{
                      item.senha
                    }}</span>
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
                <td class="px-6 text-xs font-bold text-gray-400">
                  {{ formatarDataHora(item.horaAgendamento) }}
                </td>
                <td class="px-6">
                  <span
                    class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-[#2563eb] text-[10px] font-black rounded-lg uppercase tracking-tight"
                  >
                    <i class="pi pi-calendar text-[10px]"></i> {{ item.situacao }}
                  </span>
                </td>
                <td class="px-6 text-right pr-6 mt-6 flex gap-2 justify-end">
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
              <tr v-if="agendamentosPaginados.length === 0">
                <td
                  colspan="7"
                  class="px-6 py-10 text-center text-gray-300 font-bold uppercase text-xs"
                >
                  Nenhum agendamento encontrado
                </td>
              </tr>
            </tbody>
          </table>

          <div class="flex justify-between items-center px-6 py-4 border-t border-gray-50 mt-4">
            <span class="text-[10px] font-bold text-gray-400 uppercase">
              Página {{ paginaAtual }} de {{ totalPaginas }}
            </span>
            <div class="flex gap-2">
              <button
                @click="paginaAtual--"
                :disabled="paginaAtual === 1"
                class="px-4 py-2 bg-gray-100 rounded-lg text-[10px] font-black uppercase disabled:opacity-30"
              >
                Anterior
              </button>
              <button
                @click="paginaAtual++"
                :disabled="paginaAtual >= totalPaginas"
                class="px-4 py-2 bg-[#2563eb] text-white rounded-lg text-[10px] font-black uppercase disabled:opacity-30"
              >
                Próximo
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import ChamarSenhas from '@/components/ChamarSenhas.vue'
import { AgendamentoService } from '@/services/agendamento.service'
import { AtendenteApi } from '@/services/atendente.api'
import 'primeicons/primeicons.css'

export default {
  components: {
    ChamarSenhas,
  },

  data: () => ({
    // UI/Controle
    abaAtiva: 'AGUARDANDO',
    relogio: '--:--:--',
    paginaAtual: 1,
    itensPorPagina: 3,
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
        // 🟢 O campo que seu SQL preenche é o gerenciadorId
        const idNoBanco = Number(a.gerenciadorId)
        console.log(idNoBanco)

        const ocupado = status === 'CHAMADO' || status === 'EM_ATENDIMENTO'
        const ehMeu = idNoBanco === meuId

        return ocupado && ehMeu
      })
    },

    agendamentosFiltrados() {
      // 🟢 Pegamos o seu ID aqui
      const meuId = this.usuario?.id || localStorage.getItem('usuarioId')

      let lista = AgendamentoService.filtrarAgendamentos(
        this.agendamentosPorSetor,
        this.abaAtiva,
        this.idsChamadosManualmente,
        meuId, // 🟢 Enviamos o seu ID como 4º parâmetro
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

    agendamentosPaginados() {
      const inicio = (this.paginaAtual - 1) * this.itensPorPagina
      return this.agendamentosFiltrados.slice(inicio, inicio + this.itensPorPagina)
    },
    totalPaginas() {
      return Math.ceil(this.agendamentosFiltrados.length / this.itensPorPagina) || 1
    },
    agendamentosAguardando() {
      return this.agendamentosPorSetor.filter(
        (a) => a.situacao === 'AGENDADO' && ['AGENDADO', 'ESPONTANEO'].includes(a.tipoAgendamento),
      ).length
    },

    agendamentosFinalizados() {
      return this.agendamentosPorSetor.filter((a) => a.situacao === 'ATENDIDO').length
    },
    agendamentosCancelados() {
      return this.agendamentosPorSetor.filter((a) => a.situacao === 'FALTOU').length
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
    handleEsc(e) {
      if (e.key === 'Escape') this.mostrarModalEspontaneo = false
    },
    agendamentoSelecionado(item) {
      this.selectedItem = item
      this.mostrarModalEdicao = true
    },

    atualizarRelogioLocal() {
      this.horaAtual = new Date() // 🟢 Mantemos um objeto Date fresco
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
      // 1. Pegamos os dados ANTES de qualquer tentativa de limpeza
      const token = localStorage.getItem('token')
      const usuarioId = this.usuario?.id || localStorage.getItem('usuarioId')

      console.log('Iniciando processo de saída para o usuário:', usuarioId)

      try {
        if (usuarioId && token) {
          // 2. FORÇAMOS o await. O código vai PARAR aqui até o Java responder 200 OK.
          // Se não tiver await, o router.push muda a página e mata a requisição no meio.
          await AtendenteApi.deslogarGuiche(usuarioId)
          console.log('Banco de dados atualizado: Guichê liberado.')
        } else {
          console.warn('Aviso: usuarioId ou token não encontrados para limpar guichê.')
        }
      } catch (error) {
        // Se der erro (ex: token expirado), logamos mas não travamos o usuário na tela
        console.error('Erro técnico ao deslogar guichê:', error.response?.data || error.message)
      } finally {
        // 3. AGORA SIM, com o banco resolvido, limpamos o resto
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
        // Se falhar ao pegar o usuário, limpa tudo
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

          // 🔍 LINHA PARA DEBUG SEGURO
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

    async handleChamar(senha) {
      const itemClicado = this.agendamentosPorSetor.find((a) => a.senha === senha)
      if (!itemClicado) return

      const statusClicado = itemClicado.situacao?.toUpperCase()
      const meuId = Number(this.usuario?.id || localStorage.getItem('usuarioId'))
      const donoDoItemClicado = Number(itemClicado.gerenciadorId || itemClicado.usuarioId)

      // 🟢 O SEGREDO: Verifica se o botão clicado é da senha que você já está atendendo
      const ehMinhaSenhaAtual =
        (statusClicado === 'EM_ATENDIMENTO' || statusClicado === 'CHAMADO') &&
        donoDoItemClicado === meuId

      // 🛑 TRAVA: Se você está ocupado E tentou chamar uma senha DIFERENTE da atual, bloqueia.
      if (this.temAtendimentoAtivo && !ehMinhaSenhaAtual) {
        alert('Você já possui um atendimento em aberto. Finalize-o antes de chamar outra senha.')
        return
      }

      try {
        // Se passou pela trava (porque está livre OU porque está rechamando a própria senha), dispara para a API
        const res = await AtendenteApi.chamarPorSenha(senha, this.usuario.id, this.setorTrabalhoId)

        if (res.status === 200) {
          if (itemClicado)
            this.idsChamadosManualmente.push(itemClicado.agendamentoId || itemClicado.id)

          this.abaAtiva = 'ATENDIMENTO'
          await this.buscarAgendamentos()
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

        // Limpa o estado local imediatamente
        this.idsChamadosManualmente = this.idsChamadosManualmente.filter((itemId) => itemId !== id)

        // Força uma limpeza na lista local para evitar que o usuário clique de novo antes do refresh
        const index = this.agendamentosPorSetor.findIndex((a) => (a.agendamentoId || a.id) === id)
        if (index !== -1) this.agendamentosPorSetor[index].situacao = 'FALTOU'

        await this.buscarAgendamentos()
      } catch (e) {
        alert('Erro ao cancelar.')
      }
    },

    async handleFinalizar(id) {
      if (!confirm('Deseja finalizar?')) return
      try {
        // 1. Envia a finalização para o servidor
        await AtendenteApi.finalizarAtendimento(id)

        // 🟢 O SEGREDO: Remove o ID da lista de chamados manuais.
        // Se não remover, o "computed" do Vue acha que ele ainda está sendo chamado.
        this.idsChamadosManualmente = this.idsChamadosManualmente.filter((itemId) => itemId !== id)

        // 2. Delay levemente maior (400ms) para o banco de dados processar o commit
        await new Promise((resolve) => setTimeout(resolve, 400))

        // 3. Fecha o modal primeiro para melhorar a experiência do usuário (UX)
        this.mostrarModalEdicao = false

        // 4. Força a busca dos novos dados
        await this.buscarAgendamentos()

        // 5. Opcional: Se quiser que ele vá direto para a aba de finalizados após concluir
        // this.abaAtiva = 'FINALIZADO'
      } catch (e) {
        console.error('Erro ao finalizar:', e)
        alert('Erro ao finalizar atendimento.')
      }
    },

    async salvarEspontaneo() {
      try {
        if (!this.novoAgendamento.nomeCidadao || !this.novoAgendamento.servico) {
          alert('Preencha o nome e selecione o serviço.')
          return
        }

        const payload = {
          nomeCidadao: this.novoAgendamento.nomeCidadao,
          tipoAtendimentoId: Number(this.novoAgendamento.tipoAtendimentoId),
          servicoId: Number(this.novoAgendamento.servico),
          setorId: Number(this.setorTrabalhoId),
          situacao: 'AGENDADO',
        }

        // 1. Chamada para a API
        const res = await AtendenteApi.salvarEspontaneo(this.secretariaTrabalhoId, payload)

        // 2. Verificação robusta: 200 ou 201 são sucessos
        if (res.status === 200 || res.status === 201) {
          // Opcional: Pegar a senha gerada que vem no DTO de resposta
          const senhaGerada = res.data?.senha || ''

          this.mostrarModalEspontaneo = false

          // Reseta o formulário
          this.novoAgendamento = { nomeCidadao: '', servico: null, tipoAtendimentoId: null }

          // 3. Atualiza as listas
          await this.buscarAgendamentos()
          await this.carregarTiposAtendimento()

          alert(`Atendimento registrado! Senha: ${senhaGerada}`)
        }
      } catch (e) {
        // Se caiu aqui e o registro salvou, pode ser que o res.status veio diferente
        // ou a AtendenteApi lançou um erro ao tentar ler a resposta.
        console.error('Erro ao salvar:', e)

        // Verifique se o erro não é apenas um "undefined" na mensagem
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

        // 🟢 Substitui a lista antiga pelos dados reais do banco
        this.tiposAtendimento = data

        // Seleciona o 'NORMAL' automaticamente se disponível
        if (data.length > 0 && !this.novoAgendamento.tipoAtendimentoId) {
          const padrao = data.find((t) => t.nome.toUpperCase() === 'NORMAL')
          if (padrao) this.novoAgendamento.tipoAtendimentoId = padrao.id
        }
      } catch (error) {
        console.error('Erro ao carregar tipos:', error)
      }
    },

    //handleLogout() { localStorage.clear(); this.$router.push({ name: 'login' }) }
  },

  async mounted() {
    await this.getUsuarioLogado()
    // 🟢 1. CHAMA IMEDIATAMENTE: A tela carrega na hora!
    await this.buscarAgendamentos()

    // 🟢 2. LIGA O LOOP: Agora ele só atualiza o que mudou a cada 3 segundos
    setInterval(() => {
      this.buscarAgendamentos()
    }, 3000)
    this.carregarServicos()
    this.carregarTiposAtendimento()
    this.atualizarRelogioLocal()
    setInterval(this.atualizarRelogioLocal, 1000)

    // ✅ Define o texto do endereço/unidade com base no setor atual
    if (this.usuario?.setores) {
      const setorAtual = this.usuario.setores.find((s) => s.id == this.setorTrabalhoId)
      this.enderecoEstatico = setorAtual ? `Unidade: ${setorAtual.nome}` : 'Unidade de Atendimento'
    }
  },
}
</script>

<style scoped></style>
