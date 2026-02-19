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

      <div class="px-8 grid grid-cols-3 gap-6 mb-5">
        <div
          class="bg-white p-6 rounded-[15px] shadow-sm flex justify-between items-start border-b-4 border-transparent hover:border-[#9E9E9E] transition-all"
        >
          <div>
            <p class="text-[12px] font-bold text-gray-400 uppercase mb-1">Atendimentos Hoje</p>
            <h3 class="text-3xl font-black text-gray-800">{{ agendamentosPorSec.length }}</h3>
            <span class="inline-block w-8 h-1 bg-blue-grey-darken-4 rounded-full"></span>
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
            <i class="pi pi-calendar"></i>
          </div>
        </div>

        <div
          class="bg-white p-6 rounded-[15px] shadow-sm flex justify-between items-start border-b-4 border-transparent hover:border-[#FFD54F] transition-all"
        >
          <div>
            <p class="text-[12px] font-bold text-gray-400 uppercase mb-1">Pessoas na Fila</p>
            <h3 class="text-3xl font-black text-gray-800">
              {{ agendamentosAguardando }}
            </h3>
            <span class="inline-block w-8 h-1 bg-amber-lighten-2 rounded-full"></span>
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

      <div class="px-8">
        <div class="px-8 mb-6 bg-white p-6 rounded-[15px] shadow-sm border-b-4 border-transparent">
          <h2 class="text-gray-400 text-xs font-bold uppercase tracking-widest mb-6">
            Painel de Comandos
          </h2>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div
              @click="handleChamarNormal"
              class="cursor-pointer bg-[#2563eb] hover:bg-[#1d4ed8] p-6 rounded-[15px] shadow-md flex justify-between items-center transition-all active:scale-95"
            >
              <div>
                <p class="text-[10px] font-bold text-white/70 uppercase mb-1 tracking-wider">
                  Ação
                </p>
                <h3 class="text-2xl font-black text-white tracking-tighter">Chamar Normal</h3>
              </div>
              <div
                class="w-12 h-12 bg-white/20 rounded-[12px] flex items-center justify-center text-white backdrop-blur-sm"
              >
                <i class="pi pi-volume-up text-xl"></i>
              </div>
            </div>

            <div
              class="cursor-pointer bg-[#FFA000] hover:bg-[#FF8F00] p-6 rounded-[15px] shadow-md flex justify-between items-center transition-all active:scale-95"
            >
              <div @click="handleChamarPrioridade">
                <p class="text-[10px] font-bold text-white/70 uppercase mb-1 tracking-wider">
                  Ação
                </p>
                <h3 class="text-2xl font-black text-white tracking-tighter">Chamar Prioridade</h3>
              </div>
              <div
                class="w-12 h-12 bg-white/20 rounded-[12px] flex items-center justify-center text-white backdrop-blur-sm"
              >
                <i class="pi pi-bolt text-xl"></i>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="px-8">
        <div class="bg-white rounded-[15px] shadow-sm border-b-4 border-transparent p-4">
          <div class="flex justify-between">
            <div class="flex justify-start gap-6 mb-6 px-4">
              <button
                @click="mudarAba('AGUARDANDO')"
                :class="
                  abaAtiva === 'AGUARDANDO'
                    ? 'bg-[#2563eb] text-white rounded-[7px] p-1 shadow-blue-100'
                    : 'bg-transparent text-gray-400 hover:bg-gray-20 hover:text-gray-100'
                "
                class="text-xs font-black border-b-2 pb-1 uppercase tracking-widest"
              >
                Aguardando
              </button>

              <button
                @click="mudarAba('ESPONTANEO')"
                :class="
                  abaAtiva === 'ESPONTANEO'
                    ? 'bg-[#2563eb] text-white rounded-[7px] p-1 shadow-blue-100'
                    : 'bg-transparent text-gray-400 hover:bg-gray-50 hover:text-gray-600'
                "
                class="text-xs font-black border-b-2 pb-1 uppercase tracking-widest"
              >
                Atendimento Avulso
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
                CANCELADOS
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
                FINALIZADOS
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
                        v-model="usuario.secretaria.nome"
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
                        >Endereço</label
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
                        v-model="novoAgendamento.tipoAtendimento"
                        :items="tiposAtendimento"
                        item-title="title"
                        item-value="value"
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
                        return-object
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
                        >Endereço</label
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
                        v-model="selectedItem.tipoAtendimento"
                        :items="tiposAtendimento"
                        item-title="title"
                        item-value="value"
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
            <div v-if="abaAtiva === 'ESPONTANEO'" class="flex justify-end mr-6">
              <button
                @click="mostrarModalEspontaneo = true"
                class="bg-green-600 text-white px-2 my-1.5 rounded-[6px] text-[10px] font-medium uppercase shadow-lg hover:bg-green-700 transition-all"
              >
                + Novo Registro
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
                <th class="px-6 py-4 text-left">Usuário</th>
                <th class="px-6 py-4 text-left">Serviço</th>
                <th class="px-6 py-4 text-left">Situação</th>
                <th class="px-6 py-4 text-left">Tipo</th>
                <th class="px-6 py-4 text-left">Data/Hora</th>
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
                <td class="px-6 text-[11px] font-black text-gray-400 uppercase">
                  {{ item.tipoAtendimento }}
                </td>
                <td class="px-6 text-xs font-bold text-gray-400">
                  {{ formatarDataHora(item.horaAgendamento) }}
                </td>
                <td class="px-6 text-right pr-6 mt-6 flex gap-2 justify-end">
                  <v-btn
                    v-if="['AGENDADO', 'EM_ATENDIMENTO'].includes(item.situacao)"
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
                    >Finalizar</v-btn
                  >
                  <v-btn
                    v-if="abaAtiva === 'ATENDIMENTO'"
                    color="#e61919"
                    size="small"
                    class="text-white text-[10px] font-black"
                    @click="handleCancelar(item.agendamentoId)"
                    >Cancelar</v-btn
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
import { AgendamentoService } from '@/services/agendamento.service'
import { AtendenteApi } from '@/services/atendente.api'
import StatsCards from '@/components/atendente/StatsCards.vue'
import PainelComandos from '@/components/atendente/PainelComandos.vue'
import 'primeicons/primeicons.css'

export default {
  components: { StatsCards, PainelComandos },
  
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
    usuario: null,
    enderecoEstatico: null,
    agendamentosPorSec: [],
    selectedItem: null,
    idsChamadosManualmente: [],
    servicos: [],
    
    // Formulários
    novoAgendamento: { nomeCidadao: '', servico: null, tipoAtendimento: 'NORMAL' },
    tiposAtendimento: [
      { title: 'Normal', value: 'NORMAL' },
      { title: 'Prioridade', value: 'PRIORIDADE' },
    ],
  }),

  watch: {
    mostrarModalEspontaneo(novoValor) {
      const acao = novoValor ? 'addEventListener' : 'removeEventListener'
      window[acao]('keydown', this.handleEsc)
    },
  },

  computed: {
    agendamentosFiltrados() {
      return AgendamentoService.filtrarAgendamentos(
        this.agendamentosPorSec, 
        this.abaAtiva, 
        this.idsChamadosManualmente
      )
    },

    agendamentosPaginados() {
      const inicio = (this.paginaAtual - 1) * this.itensPorPagina
      return this.agendamentosFiltrados.slice(inicio, inicio + this.itensPorPagina)
    },

    totalPaginas() {
      return Math.ceil(this.agendamentosFiltrados.length / this.itensPorPagina) || 1
    },

    // Totais para StatsCards
    agendamentosAguardando() { return this.agendamentosPorSec.filter(a => a.situacao === 'AGENDADO').length },
    agendamentosFinalizados() { return this.agendamentosPorSec.filter(a => a.situacao === 'ATENDIDO').length },
    totalNormal() { return this.agendamentosPorSec.filter(a => a.tipoAtendimento === 'NORMAL').length },
    totalPrioridade() { return this.agendamentosPorSec.filter(a => a.tipoAtendimento !== 'NORMAL').length }
  },

  methods: {
    // --- Lógica de UI ---
    mudarAba(novaAba) { this.abaAtiva = novaAba; this.paginaAtual = 1 },
    handleEsc(e) { if (e.key === 'Escape') this.mostrarModalEspontaneo = false },
    agendamentoSelecionado(item) { this.selectedItem = item; this.mostrarModalEdicao = true },
    
    atualizarRelogioLocal() {
      this.relogio = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    },

    formatarDataHora(data) {
      if (!data) return ''
      return new Date(data).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })
    },

    // --- Chamadas de API ---
    async getUsuarioLogado() {
      try {
        const token = localStorage.getItem('token')
        if (!token) return this.$router.push({ name: 'login' })
        const { data } = await AtendenteApi.getUsuarioLogado()
        this.usuario = data
      } catch (error) {
        localStorage.removeItem('token')
        this.$router.push({ name: 'login' })
      }
    },

    async buscarAgendamentos() {
      try {
        if (!this.usuario?.id) await this.getUsuarioLogado()
        const id = this.usuario?.endereco?.id
        if (id) this.agendamentosPorSec = await AtendenteApi.buscarAgendamentosPorEndereco(id)
      } catch (e) { console.error(e) }
    },

    async handleChamar(senha) {
      try {
        const res = await AtendenteApi.chamarPorSenha(senha, this.usuario.id)
        if (res.status === 200) {
          const item = this.agendamentosPorSec.find(a => a.senha === senha)
          if (item) this.idsChamadosManualmente.push(item.agendamentoId || item.id)
          this.abaAtiva = 'ATENDIMENTO'
          await this.buscarAgendamentos()
        }
      } catch (e) { alert(e?.response?.data?.mensagem || 'Falha na chamada.') }
    },

    async handleChamarNormal() {
      try {
        await AtendenteApi.chamarNormal(this.usuario.endereco.id, this.usuario.id)
      } finally { this.buscarAgendamentos() }
    },

    async handleChamarPrioridade() {
      try {
        await AtendenteApi.chamarPrioridade(this.usuario.endereco.id, this.usuario.id)
      } finally { this.buscarAgendamentos() }
    },

    async handleCancelar(id) {
      if (!confirm('Deseja realmente cancelar?')) return
      try {
        const user = JSON.parse(localStorage.getItem('usuario'))
        await AtendenteApi.cancelarAtendimento(id, user.token)
      } finally { this.buscarAgendamentos() }
    },

    async handleFinalizar(id) {
      if (!confirm('Deseja finalizar?')) return
      try { await AtendenteApi.finalizarAtendimento(id) }
      finally { this.buscarAgendamentos() }
    },

    async salvarEspontaneo() {
      try {
        const payload = { 
          ...this.novoAgendamento, 
          secretaria: this.usuario.secretaria, 
          endereco: this.usuario.endereco, 
          status: 'AGUARDANDO' 
        }
        await AtendenteApi.salvarEspontaneo(this.usuario.secretaria.id, payload)
        this.mostrarModalEspontaneo = false
        this.novoAgendamento = { nomeCidadao: '', servico: null, tipoAtendimento: 'NORMAL' }
        await this.buscarAgendamentos()
      } catch (e) { console.error(e) }
    },

    async atualizarEspontaneo() {
      try {
        const idServico = this.selectedItem.servicoId || this.selectedItem.servico?.id
        const payload = { nomeCidadao: this.selectedItem.usuarioNome, servicoId: Number(idServico) }
        const token = localStorage.getItem('token')
        await AtendenteApi.atualizarEspontaneo(this.selectedItem.agendamentoId, payload, token)
        this.mostrarModalEdicao = false
        await this.buscarAgendamentos()
      } catch (e) { alert('Erro ao atualizar.') }
    },

    async carregarServicos() {
      try {
        const res = await AtendenteApi.carregarServicos(this.usuario.secretaria.id)
        this.servicos = res.data
      } catch (e) { console.error(e) }
    },

    handleLogout() { localStorage.clear(); this.$router.push({ name: 'login' }) }
  },

  async mounted() {
    await this.getUsuarioLogado()
    this.buscarAgendamentos()
    this.carregarServicos()
    this.atualizarRelogioLocal()
    setInterval(this.atualizarRelogioLocal, 1000)
    if (this.usuario?.endereco) {
      this.enderecoEstatico = `${this.usuario.endereco.bairro}, ${this.usuario.endereco.logradouro}`
    }
  }
}
</script>

<style scoped></style>
