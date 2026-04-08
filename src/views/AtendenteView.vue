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

      <ChamarSenhas @senha-chamada="onSenhaChamadaPelosBotoes"></ChamarSenhas>

      <div class="px-3">
        <div class="bg-white rounded-[15px] shadow-sm border-b-4 border-transparent p-4">
          <div class="flex justify-between">
            <div class="flex justify-start gap-6 mb-4 px-4">
              <button
                @click="mudarAba('AGUARDANDO')"
                :class="
                  abaAtiva === 'AGUARDANDO'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-400 border-b-2 border-transparent hover:text-gray-600 hover:border-gray-200'
                "
                class="flex items-center gap-1.5 px-4 py-2 -mb-[1px] text-[11px] font-black uppercase tracking-widest transition-all duration-150"
              >
                Fila Geral
                <span
                  :class="
                    abaAtiva === 'AGUARDANDO'
                      ? 'bg-blue-50 text-blue-600'
                      : 'bg-gray-100 text-gray-400'
                  "
                  class="text-[10px] font-bold px-1.5 py-0.5 rounded-full transition-all"
                >
                  {{ agendamentosAguardando }}
                </span>
              </button>

              <button
                @click="mudarAba('PRIORIDADES')"
                :class="
                  abaAtiva === 'PRIORIDADES'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-400 border-b-2 border-transparent hover:text-gray-600 hover:border-gray-200'
                "
                class="flex items-center gap-1.5 px-4 py-2 -mb-[1px] text-[11px] font-black uppercase tracking-widest transition-all duration-150"
              >
                Prioridades
                <span
                  :class="
                    abaAtiva === 'PRIORIDADES'
                      ? 'bg-blue-50 text-blue-600'
                      : 'bg-gray-100 text-gray-400'
                  "
                  class="text-[10px] font-bold px-1.5 py-0.5 rounded-full transition-all"
                >
                  {{ totalPrioridadeFila }}
                </span>
              </button>

              <button
                @click="mudarAba('ATENDIMENTO')"
                :class="
                  abaAtiva === 'ATENDIMENTO'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-400 border-b-2 border-transparent hover:text-gray-600 hover:border-gray-200'
                "
                class="flex items-center gap-1.5 px-4 py-2 -mb-[1px] text-[11px] font-black uppercase tracking-widest transition-all duration-150"
              >
                Em Atendimento
                <span
                  :class="
                    abaAtiva === 'ATENDIMENTO'
                      ? 'bg-blue-50 text-blue-600'
                      : 'bg-gray-100 text-gray-400'
                  "
                  class="text-[10px] font-bold px-1.5 py-0.5 rounded-full transition-all"
                >
                  {{ agendamentosEmAtendimento }}
                </span>
              </button>

              <button
                @click="mudarAba('CANCELADOS')"
                :class="
                  abaAtiva === 'CANCELADOS'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-400 border-b-2 border-transparent hover:text-gray-600 hover:border-gray-200'
                "
                class="flex items-center gap-1.5 px-4 py-2 -mb-[1px] text-[11px] font-black uppercase tracking-widest transition-all duration-150"
              >
                Ausentes
                <span
                  :class="
                    abaAtiva === 'CANCELADOS'
                      ? 'bg-blue-50 text-blue-600'
                      : 'bg-gray-100 text-gray-400'
                  "
                  class="text-[10px] font-bold px-1.5 py-0.5 rounded-full transition-all"
                >
                  {{ agendamentosCancelados }}
                </span>
              </button>

              <button
                @click="mudarAba('FINALIZADOS')"
                :class="
                  abaAtiva === 'FINALIZADOS'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-400 border-b-2 border-transparent hover:text-gray-600 hover:border-gray-200'
                "
                class="flex items-center gap-1.5 px-4 py-2 -mb-[1px] text-[11px] font-black uppercase tracking-widest transition-all duration-150"
              >
                Atendidos
                <span
                  :class="
                    abaAtiva === 'FINALIZADOS'
                      ? 'bg-blue-50 text-blue-600'
                      : 'bg-gray-100 text-gray-400'
                  "
                  class="text-[10px] font-bold px-1.5 py-0.5 rounded-full transition-all"
                >
                  {{ agendamentosFinalizados }}
                </span>
              </button>
              <div
                v-if="mostrarModalEspontaneo"
                class="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm"
              >
                <div class="bg-white w-full max-w-3xl rounded-[12px] p-8 shadow-2xl">
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
                  <form
                    @submit.prevent="salvarEspontaneo"
                    class="grid grid-cols-1 md:grid-cols-2 gap-5"
                  >
                    <div class="col-span-2">
                      <label class="block text-[10px] font-black text-gray-400 uppercase mb-2 ml-1"
                        >Nome do Cidadão</label
                      >
                      <v-text-field
                        v-model="novoAgendamento.nomeCidadao"
                        type="text"
                        rounded="12px"
                        variant="outlined"
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
                        variant="outlined"
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
                        variant="outlined"
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
                        variant="outlined"
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
                        variant="outlined"
                        bg-color="transparent"
                        class=""
                        required
                      >
                      </v-select>
                    </div>

                    <div v-if="podeVerObservacao" class="col-span-2">
                      <label class="block text-[10px] font-black text-gray-400 uppercase mb-2 ml-1"
                        >Observação</label
                      >
                      <v-textarea
                        v-model="novoAgendamento.observacoes"
                        density="compact"
                        rounded-2xl
                        variant="outlined"
                        bg-color="transparent"
                        class=""
                        required
                      >
                      </v-textarea>
                    </div>

                    <div class="col-span-1 md:col-span-2 flex justify-end items-center gap-3 mt-4">
                      <button
                        type="button"
                        @click="mostrarModalEspontaneo = false"
                        class="text-gray-400 font-black text-[13px] px-6 py-2 hover:text-gray-600 transition-colors"
                      >
                        Cancelar
                      </button>

                      <button
                        type="submit"
                        class="bg-[#2563eb] text-white px-8 py-3 rounded-[5px] font-semibold text-[13px] shadow-lg shadow-blue-200 hover:scale-110 active:scale-95 transition-all"
                      >
                        Cadastrar
                      </button>
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
                  <form @submit.prevent="atualizarEspontaneo">
                    <div>
                      <label class="block text-[10px] font-black text-gray-400 uppercase mb-2 ml-1"
                        >Nome do Cidadão</label
                      >
                      <v-text-field
                        v-model="selectedItem.usuarioNome"
                        type="text"
                        rounded="12px"
                        variant="outlined"
                        density="compact"
                        class="w-full border-none text-xs font-bold ring-gray-500 focus:ring-gray-500"
                        required
                      />
                    </div>

                    <div>
                      <label class="block text-[10px] font-black text-gray-400 uppercase mb-2 ml-1"
                        >Tipo de Atendimento</label
                      >
                      <v-select
                        v-model="selectedItem.tipoAtendimentoId"
                        :items="tiposAtendimento"
                        item-title="nome"
                        item-value="id"
                        density="compact"
                        variant="outlined"
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
                        density="compact"
                        variant="outlined"
                        required
                      ></v-select>
                    </div>

                    <div v-if="podeVerObservacao" class="col-span-2">
                      <label class="block text-[10px] font-black text-gray-400 uppercase mb-2 ml-1"
                        >Observação</label
                      >
                      <v-textarea
                        v-model="selectedItem.observacao"
                        :items="observacoes"
                        density="compact"
                        rounded-2xl
                        variant="outlined"
                        bg-color="transparent"
                        class=""
                        required
                      >
                      </v-textarea>
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
                            : 'bg-blue-600 shadow-blue-100',
                        ]"
                        class="w-7 h-7 rounded-xl flex items-center justify-center text-white shadow-lg"
                      >
                        <i :class="isPrioridade(item.senha) ? 'pi pi-bolt' : 'pi pi-user'"></i>
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
                      {{ calcularTempoEspera(item.horaAgendamento, item.situacao, item.horaChamada, item.horaFinalizado) }}
                    </span>
                  </td>

                  <td class="px-6 text-right pr-6 py-2 flex gap-2 justify-end"></td>

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
import NavBar from '@/components/NavBar.vue'
import { AgendamentoService } from '@/services/agendamento.service'
import { AtendenteApi } from '@/services/atendente.api'
import 'primeicons/primeicons.css'

export default {
  components: {
    ChamarSenhas,
    NavBar,
  },

  data: () => ({
    // UI/Controle
    abaAtiva: 'AGUARDANDO',
    relogio: '--:--:--',
    mostrarModalEdicao: false,
    mostrarModalEspontaneo: false,
    sidebarAberta: false,
    jaAbriuModal: false,
    perfil: '',
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
    isSalvando: false,

    // Formulários
    novoAgendamento: { nomeCidadao: '', servico: null, tipoAtendimentoId: null, observacoes: '' },
  }),

  watch: {
    mostrarModalEspontaneo(novoValor) {
      const acao = novoValor ? 'addEventListener' : 'removeEventListener'
      window[acao]('keydown', this.handleEsc)

      // LÓGICA DE ATIVAÇÃO PERMANENTE:
      // Se abriu o modal uma vez, vira 'true' e fica 'true'.
      if (novoValor === true) {
        this.jaAbriuModal = true
        // Força uma busca imediata com a visão liberada
        this.buscarAgendamentos()
      }
    },
  },

  computed: {
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

    displayLocalAtendimento() {
      // 1. Pegamos os dados que agora vêm no DTO do usuário (ajustados no Java anteriormente)
      const descricao = this.usuario?.descricaoPonto
      const numero = this.usuario?.numeroPonto

      // 2. Se o usuário tiver um ponto vinculado, montamos a string dinâmica
      if (descricao && numero !== undefined && numero !== null) {
        // Exemplo: "Consultório 01", "Classificação 02", "Guichê 03"
        return `${descricao} ${String(numero).padStart(2, '0')}`
      }

      // 3. Fallback caso ele ainda não tenha selecionado um local (ex: recém logado)
      return 'Selecione o Local'
    },
    podeVerObservacao() {
      const perfil = this.usuario?.perfil?.toUpperCase()

      return perfil && ['MEDICO', 'RECEPÇÃO', 'TRIAGEM'].includes(perfil)
    },

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
        this.perfil,
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
          Number(a.gerenciadorId || a.usuarioId) === meuId,
      ).length
    },

    agendamentosFinalizados() {
      const meuId = Number(this.usuario?.id || localStorage.getItem('usuarioId'))
      const perfil = (this.usuario?.perfil || '').toUpperCase()

      return this.agendamentosPorSetor.filter((a) => {
        if (perfil === 'SUPERADMIN') {
          return a.situacao === 'ATENDIDO' // 🔥 vê TODOS
        }

        return (
          a.situacao === 'ATENDIDO' &&
          Number(a.gerenciadorId || a.usuarioId) === meuId
        )
      }).length
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

    atendimentoAtual() {
      const meuId = Number(this.usuario?.id || localStorage.getItem('usuarioId'))
      if (!this.agendamentosPorSetor.length) return null

      return this.agendamentosPorSetor.find((a) => {
        const status = a.situacao?.toUpperCase()
        const gerenciadorId = Number(a.gerenciadorId || a.usuarioId)
        return (status === 'EM_ATENDIMENTO' || status === 'CHAMADO') && gerenciadorId === meuId
      })
    },
  },

  methods: {
    formatarLocalAtendimento() {
      // Tenta pegar a descrição amigável que salvamos na tela de seleção
      const localAtivo = localStorage.getItem('guicheDescricaoAtiva')

      if (localAtivo) {
        return localAtivo
      }

      // Fallback de segurança caso o storage esteja vazio
      return 'Ponto de Atendimento'
    },

    verificarGuicheValido() {
      // Pode vir de duas formas dependendo do backend
      const numero = this.usuario?.numeroPonto
      const descricao = this.usuario?.descricaoPonto

      // Se qualquer um essencial for null → logout
      if (!numero || !descricao) {
        console.warn('Guichê inválido. Fazendo logout...')

        this.handleLogout()
      }
    },

    async enviarPing() {
      try {
        // Tenta pegar o ID do atendimento automático ou do selecionado
        const agendamentoId =
          this.atendimentoAtual?.agendamentoId ||
          this.atendimentoAtual?.id ||
          this.selectedItem?.agendamentoId ||
          this.selectedItem?.id

        if (!agendamentoId) {
          // console.log("Sem atendimento ativo para pingar.");
          return
        }

        //console.log('Enviando ping para:', agendamentoId)
        await AtendenteApi.heartbeat(agendamentoId)
      } catch (e) {
        console.warn('Ping falhou:', e)
      }
    },

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

    handleBeforeUnload(event) {
      if (this.temAtendimentoAtivo) {
        event.preventDefault()
        event.returnValue = ''
      }
    },

    handleEsc(e) {
      if (e.key === 'Escape') this.mostrarModalEspontaneo = false
    },

    mudarAba(novaAba) {
      this.abaAtiva = novaAba
    },

    agendamentoSelecionado(item) {
      this.selectedItem = { ...item }
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
      const [date, time] = data.split(' ')
      return `${date.split('-').reverse().join('/') } ${time.slice(0,5)}`
    },

   calcularTempoEspera(horaAgendamento, situacao, hChamada, hFinalizado) {
  if (!horaAgendamento) return '00:00:00';

  // Função interna para converter a string do Java/Postgres (2026-04-07 06:20:51.777798) para Date
  const parseData = (str) => {
    if (!str) return null;
    // Substitui o espaço por 'T' para garantir compatibilidade com o padrão ISO no JS
    const isoStr = str.replace(' ', 'T');
    return new Date(isoStr);
  };

  const dataAgendamento = parseData(horaAgendamento);
  const dataChamada = parseData(hChamada);
  const dataFinalizado = parseData(hFinalizado);

  // Se a data de agendamento for inválida, para aqui
  if (!dataAgendamento || isNaN(dataAgendamento.getTime())) return '00:00:00';

  let inicio, fim;

  // Verificamos se o atendimento foi finalizado (ajuste o texto 'ATENDIDO' conforme seu banco)
  if (situacao === 'ATENDIDO' || situacao === 'FINALIZADO') {
    if (dataChamada && dataFinalizado) {
      // Caso 1: Quanto tempo durou o atendimento na mesa (Chamada -> Fim)
      inicio = dataChamada;
      fim = dataFinalizado;
    } else if (dataFinalizado) {
      // Caso 2: Quanto tempo o cidadão ficou na unidade (Agendamento -> Fim)
      inicio = dataAgendamento;
      fim = dataFinalizado;
    } else {
      // Trava para não contar se não houver data de encerramento
      return '00:00:00';
    }
  } else {
    // Caso 3: Ainda esperando ou em atendimento (Relógio rodando)
    inicio = dataAgendamento;
    fim = new Date();
  }

  const diffMs = Math.abs(fim - inicio);
  const diffHrs = Math.floor(diffMs / 3600000);
  const diffMins = Math.floor((diffMs % 3600000) / 60000);
  const diffSecs = Math.floor((diffMs % 60000) / 1000);

  return `${String(diffHrs).padStart(2, '0')}:${String(diffMins).padStart(2, '0')}:${String(diffSecs).padStart(2, '0')}`;
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

    async getUsuarioLogado() {
      try {
        const token = localStorage.getItem('token')
        this.setorTrabalhoId = localStorage.getItem('setorTrabalhoId')
        this.secretariaTrabalhoId = localStorage.getItem('secretariaTrabalhoId')

        if (!token || !this.setorTrabalhoId) return this.$router.push({ name: 'login' })

        const { data } = await AtendenteApi.getUsuarioLogado()
        this.usuario = data

        this.verificarGuicheValido()

        if (data.id) {
          localStorage.setItem('usuarioId', data.id)

          const perfilLogado = data.perfil || 'ATENDENTE'
          localStorage.setItem('perfilUsuario', perfilLogado)
          this.perfil = perfilLogado
        }
      } catch (error) {
        localStorage.clear()
        this.$router.push({ name: 'login' })
      }
    },

    async buscarAgendamentos() {
      try {
        // 1. Garante que o usuário e o perfil foram carregados
        if (!this.usuario?.id) await this.getUsuarioLogado()

        this.verificarGuicheValido()

        if (this.setorTrabalhoId) {
          const meuId = this.usuario?.id || localStorage.getItem('usuarioId')

          // 2. CAPTURA O PERFIL (Prioriza a variável do componente, depois o storage)
          // Se o cara for 'CADASTRO', o SQL libera a fila toda do setor.
          const perfilEnvio = this.perfil || localStorage.getItem('perfilUsuario') || 'ATENDENTE'

          // 3. Chama a API passando a String do Perfil
          const data = await AtendenteApi.buscarAgendamentosPorSetor(
            this.setorTrabalhoId,
            meuId,
            perfilEnvio,
          )

          // 4. Atualiza a lista reativa
          this.agendamentosPorSetor = [...data]
        }
      } catch (e) {
        console.error('Erro ao buscar agendamentos:', e)
      }
    },

    async handleChamar(senha) {
      const itemClicado = this.agendamentosPorSetor.find((a) => a.senha === senha)
      if (!itemClicado) return

      const agora = new Date();
      const pad = (n) => n.toString().padStart(2, '0');
      const dataStr = `${agora.getFullYear()}-${pad(agora.getMonth() + 1)}-${pad(agora.getDate())}`;
      const milis = agora.getMilliseconds().toString().padStart(3, '0');
      const horarioFront = `${dataStr} ${pad(agora.getHours())}:${pad(agora.getMinutes())}:${pad(agora.getSeconds())}.${milis}`;

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
        const res = await AtendenteApi.chamarPorSenha(senha, this.usuario.id, this.setorTrabalhoId, horarioFront)

        if (res.status === 200) {
          if (itemClicado) {
            this.idsChamadosManualmente.push(itemClicado.agendamentoId || itemClicado.id)
            itemClicado.situacao = 'CHAMADO'
            itemClicado.gerenciadorId = meuId,
            itemClicado.horaChamada = horarioFront;
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

        const agora = new Date()
        const pad = (n) => n.toString().padStart(2, '0')
        const dataStr = `${agora.getFullYear()}-${pad(agora.getMonth() + 1)}-${pad(agora.getDate())}`
        const horaStr = `${pad(agora.getHours())}:${pad(agora.getMinutes())}:${pad(agora.getSeconds())}.${agora.getMilliseconds().toString().padStart(3, '0')}000`
        const horarioFront = `${dataStr} ${horaStr}`

        await AtendenteApi.cancelarAtendimento(id, token, horarioFront)

        this.idsChamadosManualmente = this.idsChamadosManualmente.filter((itemId) => itemId !== id)

        const index = this.agendamentosPorSetor.findIndex((a) => (a.agendamentoId || a.id) === id)
        if (index !== -1) {
          this.agendamentosPorSetor[index].situacao = 'FALTOU'
        }

        this.abaAtiva = 'AGUARDANDO'
      } catch (e) {
        alert('Erro ao cancelar.')
      }
    },

    async handleFinalizar(id) {
      if (!confirm('Deseja finalizar?')) return
      
      try {
        // 1. Gera o horário exato do dispositivo do usuário
        const agora = new Date();
        const pad = (n) => n.toString().padStart(2, '0');
        
        // Formata a data: YYYY-MM-DD
        const dataStr = `${agora.getFullYear()}-${pad(agora.getMonth() + 1)}-${pad(agora.getDate())}`;
        
        // Formata a hora: HH:mm:ss
        const horaSimples = `${pad(agora.getHours())}:${pad(agora.getMinutes())}:${pad(agora.getSeconds())}`;
        
        // MILISSEGUNDOS: O segredo do erro 400 está aqui. 
        // Pegamos apenas os 3 dígitos que o Java espera (.SSS)
        const milis = agora.getMilliseconds().toString().padStart(3, '0');
        
        // Monta a string final SEM os "000" extras
        const horarioFront = `${dataStr} ${horaSimples}.${milis}`;

        // 2. Passa o ID e o Horário para a API
        await AtendenteApi.finalizarAtendimento(id, horarioFront);

        // --- Sua lógica de UI (MANTIDA) ---
        this.idsChamadosManualmente = this.idsChamadosManualmente.filter((itemId) => itemId !== id);
        const index = this.agendamentosPorSetor.findIndex((a) => (a.agendamentoId || a.id) === id);
        if (index !== -1) {
          this.agendamentosPorSetor[index].situacao = 'ATENDIDO';
        }
        this.mostrarModalEdicao = false;
        this.abaAtiva = 'AGUARDANDO';
        // ---------------------------------

      } catch (e) {
        console.error('Erro ao finalizar:', e);
        alert('Erro ao finalizar atendimento.');
      }
    },

    async imprimirTicketWebUSB(device, senha, dataHora, nomeServico) {
      try {
        await device.open()
        if (device.configuration === null) await device.selectConfiguration(1)
        await device.claimInterface(0)

        const outEndpoint = device.configuration.interfaces[0].alternate.endpoints.find(
          (e) => e.direction === 'out',
        )

        if (!outEndpoint) throw new Error('Endpoint de saída não encontrado.')

        const encoder = new TextEncoder()

        const commands = [
          new Uint8Array([0x1b, 0x40]), // Reset da impressora
          new Uint8Array([0x1b, 0x61, 0x01]), // Centralizar tudo

          // 1. PREFEITURA DE SÃO LUÍS (Negrito)
          new Uint8Array([0x1b, 0x45, 0x01]),
          encoder.encode('PREFEITURA DE SÃO LUIS\n\n'),
          new Uint8Array([0x1b, 0x45, 0x00]),

          // 2. SERVIÇO
          encoder.encode('SERVICO:\n'),
          encoder.encode(`${nomeServico.toUpperCase()}\n\n`),

          // 3. SENHA (Grande e Negrito)
          encoder.encode('SENHA:\n'),
          new Uint8Array([0x1d, 0x21, 0x22]), // (Tamanho Máximo: 4x)
          new Uint8Array([0x1b, 0x45, 0x01]), // Negrito ON
          encoder.encode(`${senha}\n\n`),
          new Uint8Array([0x1b, 0x45, 0x00]), // Negrito OFF
          new Uint8Array([0x1d, 0x21, 0x00]), // Volta fonte normal

          // 4. AGUARDE SER CHAMADO
          encoder.encode('AGUARDE SER CHAMADO\n\n'),

          // 5. EMISSÃO
          encoder.encode(`EMISSÃO: ${dataHora}\n`),

          // Espaço e Corte
          encoder.encode('\n\n\n\n'),
          new Uint8Array([0x1d, 0x56, 0x42, 0x00]), // Comando de Corte
        ]

        const totalLength = commands.reduce((acc, cur) => acc + cur.length, 0)
        const combinedData = new Uint8Array(totalLength)
        let offset = 0
        for (const cmd of commands) {
          combinedData.set(cmd, offset)
          offset += cmd.length
        }

        await device.transferOut(outEndpoint.endpointNumber, combinedData)
        await new Promise((resolve) => setTimeout(resolve, 800))
        await device.close()

        console.log('Ticket impresso com sucesso.')
      } catch (err) {
        console.error('Erro físico na impressora:', err)
        try {
          if (device.opened) await device.close()
        } catch (e) {}
        alert('Atendimento salvo, mas houve erro na impressora: ' + err.message)
      }
    },

    async salvarEspontaneo() {
      if (this.isSalvando) return

      if (!navigator.usb) {
        alert('Acesso USB bloqueado. Verifique o HTTPS ou as Flags do Chrome.')
        return
      }

      let device
      try {
        // TENTA IMPRIMIR DIRETO: Verifica se já existe permissão prévia
        const pairedDevices = await navigator.usb.getDevices()

        if (pairedDevices.length > 0) {
          device = pairedDevices[0] // Pega a primeira que já foi autorizada
        } else {
          // Se for a primeira vez ou cache limpo, abre o popup
          device = await navigator.usb.requestDevice({ filters: [] })
        }
      } catch (err) {
        console.warn('Seleção cancelada.')
        return
      }

      try {
        if (!this.novoAgendamento.nomeCidadao?.trim()) {
          alert('Informe o nome do cidadão.')
          return
        }

        this.isSalvando = true

        const payload = {
          nomeCidadao: this.novoAgendamento.nomeCidadao,
          tipoAtendimentoId: Number(this.novoAgendamento.tipoAtendimentoId),
          servicoId: Number(this.novoAgendamento.servico),
          setorId: Number(this.setorTrabalhoId),
          situacao: 'AGENDADO',
          observacao: this.novoAgendamento.observacoes,
        }

        const horarioFront = new Date().toISOString()

        const res = await AtendenteApi.salvarEspontaneo(this.secretariaTrabalhoId, payload, horarioFront);

        if (res.status === 200 || res.status === 201) {
          const senha = res.data.codigo || res.data.senha || '---'
          const dataHora = new Date().toLocaleString('pt-BR')

          // Busca o nome amigável do serviço
          const servicoObj = this.servicos.find((s) => s.id == this.novoAgendamento.servico)
          const nomeServico = servicoObj ? servicoObj.nome : 'GERAL'

          // Dispara a impressão
          await this.imprimirTicketWebUSB(device, senha, dataHora, nomeServico)

          // Limpa e fecha
          this.mostrarModalEspontaneo = false
          this.novoAgendamento = {
            nomeCidadao: '',
            servico: null,
            tipoAtendimentoId: null,
            observacoes: '',
          }
          await this.buscarAgendamentos()
        }
      } catch (e) {
        console.error('Erro geral:', e)
        alert('Erro: ' + (e.response?.data?.mensagem || e.message))
      } finally {
        this.isSalvando = false
      }
    },

    async atualizarEspontaneo() {
      try {
        const idServico = this.selectedItem.servicoId || this.selectedItem.servico?.id
        const payload = {
          nomeCidadao: this.selectedItem.usuarioNome,
          servicoId: Number(idServico),
          tipoAtendimentoId: Number(this.selectedItem.tipoAtendimentoId),
          observacao: this.selectedItem.observacao ?? '',
        }

        //console.log('payload enviado:', payload)

        const token = localStorage.getItem('token')
        await AtendenteApi.atualizarEspontaneo(this.selectedItem.agendamentoId, payload, token)
        this.mostrarModalEdicao = false
        await this.buscarAgendamentos()
      } catch (e) {
        alert('Erro ao atualizar.')
      }
    },

    async carregarServicos(apenasCadastro = false) {
      try {
        const meuId = Number(this.usuario?.id || localStorage.getItem('usuarioId'))

        const idParaEnviar = apenasCadastro || isNaN(meuId) ? null : meuId

        const servicos = await AtendenteApi.carregarServicosPorSetor(
          this.setorTrabalhoId,
          idParaEnviar,
          apenasCadastro, // IMPORTANTE: Passar como 3º parâmetro aqui!
        )

        this.servicos = servicos
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
    window.addEventListener('beforeunload', this.handleBeforeUnload)

    await this.getUsuarioLogado()
    await this.buscarAgendamentos()

    // Eu subi o intervalo para 2 segundos, pois 1 segundo afoga o servidor se houverem muitos atendentes
    setInterval(() => {
      this.buscarAgendamentos()
    }, 2000)

    this.carregarServicos(true)
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
  beforeUnmount() {
    window.removeEventListener('beforeunload', this.handleBeforeUnload)
  },
}
</script>

<style scoped>
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
