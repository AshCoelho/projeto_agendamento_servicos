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

      <div class="flex items-center gap-2 mb-10 self-start px-6 overflow-hidden">
        <div
          class="min-w-[40px] w-10 h-10 bg-[#2563eb] rounded-[13px] flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-blue-200"
        >
          SA
        </div>
        <div v-if="sidebarAberta" class="leading-3 whitespace-nowrap">
          <p class="text-[12px] font-medium text-[#1e3a8a] uppercase">Sistema de</p>
          <p class="text-[12px] font-black text-[#1e3a8a] tracking-tighter uppercase">
            Agendamento
          </p>
        </div>
      </div>

      <nav class="w-full px-4 space-y-2">
        <a
          href="#"
          class="flex items-center gap-3 px-4 py-3 bg-[#2563eb] text-white rounded-[13px] shadow-xl shadow-blue-100"
        >
          <i class="pi pi-grid-view"></i>
          <span v-if="sidebarAberta" class="text-sm font-bold whitespace-nowrap">Painel</span>
        </a>
      </nav>

      <div class="mt-auto w-full px-4 pb-4 overflow-hidden">
        <div class="flex items-center gap-3 bg-gray-50 p-3 rounded-2xl mb-4 border border-gray-100">
          <div
            class="min-w-[40px] w-10 h-10 bg-[#2563eb] rounded-full flex items-center justify-center text-white font-bold shadow-sm"
          >
            {{ usuario?.nome?.charAt(0).toUpperCase() || 'U' }}
          </div>
          <div v-if="sidebarAberta" class="leading-tight whitespace-nowrap">
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
          class="flex items-center gap-2 text-red-500 font-bold text-xs uppercase tracking-tight px-2"
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

      <div class="px-8">
        <div class="px-8 mb-6 bg-white p-6 rounded-[15px] shadow-sm border-b-4 border-transparent">
          <h2 class="text-gray-400 text-xs font-bold uppercase tracking-widest mb-6">
            Painel de Comandos
          </h2>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div
              class="cursor-pointer bg-[#2563eb] hover:bg-[#1d4ed8] p-6 rounded-[15px] shadow-md flex justify-between items-center transition-all active:scale-95"
            >
              <div @click="handleChamarNormal(usuario?.secretaria?.id || 1)">
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
              <div @click="handleChamarPrioridade(usuario?.secretaria?.id || 1)">
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
                    ? 'bg-[#2563eb] text-white rounded-[10px] p-2 shadow-xl shadow-blue-100'
                    : 'bg-transparent text-gray-400 hover:bg-gray-20 hover:text-gray-100'
                "
                class="text-xs font-black border-b-2 pb-1 transition-all uppercase tracking-widest"
              >
                Aguardando
              </button>

              <button
                @click="mudarAba('ESPONTANEO')"
                :class="
                  abaAtiva === 'ESPONTANEO'
                    ? 'bg-[#2563eb] text-white rounded-[10px] p-2 shadow-xl shadow-blue-100'
                    : 'bg-transparent text-gray-400 hover:bg-gray-50 hover:text-gray-600'
                "
                class="text-xs font-black border-b-2 pb-1 transition-all uppercase tracking-widest"
              >
                Atendimento Avulso
              </button>

              <div
                v-if="mostrarModalEspontaneo"
                class="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm"
              >
                <div class="bg-white w-full max-w-md rounded-[12px] p-8 shadow-2xl">
                  <h2 class="text-[#1e3a8a] text-xl font-black uppercase mb-6">
                    Cadastro de Senha Espontânea
                  </h2>

                  <form @submit.prevent="salvarEspontaneo" class="space-y-4">
                    <div>
                      <label class="block text-[10px] font-black text-gray-400 uppercase mb-2 ml-1"
                        >Nome do Cidadão</label
                      >
                      <input
                        v-model="novoAgendamento.nomeCidadao"
                        type="text"
                        class="w-full bg-gray-50 border-none rounded-2xl py-3 px-4 text-xs font-bold outline-none ring-1 ring-gray-500 focus:ring-gray-500"
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
                      <v-btn @click="salvarEspontaneo"> Criar </v-btn>
                    </div>
                  </form>
                </div>
              </div>
              <button
                @click="mudarAba('ATENDIMENTO')"
                :class="
                  abaAtiva === 'ATENDIMENTO'
                    ? 'bg-[#2563eb] text-white rounded-[10px] p-2 shadow-xl shadow-blue-100'
                    : 'bg-transparent text-gray-400 hover:bg-gray-50 hover:text-gray-600'
                "
                class="text-xs font-black border-b-2 pb-1 transition-all uppercase tracking-widest"
              >
                Em Atendimento
              </button>
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
                <td class="px-6 text-xs font-bold text-gray-400">{{ item.horaAgendamento }}</td>
                <td class="px-6 text-right pr-6 mt-6 flex gap-2 justify-end">
                  <v-btn
                    v-if="item.situacao === 'AGENDADO'"
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
import api from '@/services/api'
import StatsCards from '@/components/atendente/StatsCards.vue'
import PainelComandos from '@/components/atendente/PainelComandos.vue'
import 'primeicons/primeicons.css'

export default {
  components: {
    StatsCards,
    PainelComandos,
  },
  data: () => ({
    enderecoEstatico: null,
    usuario: null,
    sidebarAberta: true,
    fila: [],
    agendamentosPorSec: [],
    abaAtiva: 'AGUARDANDO',
    relogio: '--:--:--',
    filtroTexto: '',
    paginaAtual: 1,
    itensPorPagina: 3,
    idsChamadosManualmente: [],
    mostrarModalEspontaneo: false,
    novoAgendamento: {
      nomeCidadao: '',
      servico: null,
      tipoAtendimento: null,
    },
    servicos: [],
    secretarias: [],
    tiposAtendimento: [
      { title: 'Normal', value: 'NORMAL' },
      { title: 'Prioridade', value: 'PRIORIDADE' },
    ],
  }),

  methods: {
    mudarAba(novaAba) {
      this.abaAtiva = novaAba
      this.paginaAtual = 1
    },

    async buscarAgendamentos() {
      try {
        if (!this.usuario?.id) await this.getUsuarioLogado()

        const enderecoId = this.usuario?.endereco?.id
        const secretariaId = this.usuario?.secretaria?.id

        if (!enderecoId) {
          console.warn('Usuário logado não tem endereco.id')
          return
        }

        // ✅ OPÇÃO A (se seu backend ficou assim):
        // GET /agendamentos/enderecos/{enderecoId}
        const res = await api.get(`/agendamentos/enderecos/${enderecoId}`)

        // ✅ OPÇÃO B (se você mudou pra secretaria + endereco):
        // const res = await api.get(`/agendamentos/enderecos/${secretariaId}/${enderecoId}`)

        console.log('Agendamentos recebidos:', res.data)

        if (Array.isArray(res.data)) {
          this.agendamentosPorSec = res.data
        } else {
          this.agendamentosPorSec = []
        }
      } catch (e) {
        console.error('Erro buscarAgendamentos:', e?.response?.data || e)
      }
    },

    async handleChamar(senha) {
      try {
        if (!this.usuario?.id) {
          await this.getUsuarioLogado()
        }

        const gerenciadorId = this.usuario?.id
        if (!gerenciadorId) {
          alert('Usuário não carregado. Faça login novamente.')
          return
        }

        const url = `/agendamentos/chamar/por-senha/${encodeURIComponent(senha)}/${gerenciadorId}`
        console.log('POST:', url)

        const res = await api.post(url)

        if (res.status === 200) {
          const item = this.agendamentosPorSec.find((a) => a.senha === senha)
          if (item) {
            this.idsChamadosManualmente.push(item.agendamentoId)
            item.situacao = 'EM_ATENDIMENTO'
          }

          this.abaAtiva = 'ATENDIMENTO'

          await this.buscarAgendamentos()
        }
      } catch (e) {
        console.error('Erro ao chamar:', e?.response?.data || e)
        alert(e?.response?.data?.mensagem || e?.response?.data || 'Falha na chamada.')
      }
    },

     async handleChamarNormal() {
      try {
        if (!this.usuario?.id) await this.getUsuarioLogado()

        const enderecoId = this.usuario?.endereco?.id
        const gerenciadorId = this.usuario?.id

        if (!enderecoId || !gerenciadorId) {
          alert('Usuário incompleto: faltou enderecoId/gerenciadorId')
          return
        }

        await api.post(`/agendamentos/chamar/normal/${enderecoId}/${gerenciadorId}`)
      } catch (e) {
        console.error('Erro chamar normal:', e?.response?.data || e)
        alert(e?.response?.data?.mensagem || 'Falha ao chamar normal.')
      } finally {
        this.buscarAgendamentos()
      }
    },

    async handleChamarPrioridade() {
      try {
        if (!this.usuario?.id) await this.getUsuarioLogado()

        const enderecoId = this.usuario?.endereco?.id
        const gerenciadorId = this.usuario?.id

        if (!enderecoId || !gerenciadorId) {
          alert('Usuário incompleto: faltou enderecoId/gerenciadorId')
          return
        }

        await api.post(`/agendamentos/chamar/prioridade/${enderecoId}/${gerenciadorId}`)
      } catch (e) {
        console.error('Erro chamar prioridade:', e?.response?.data || e)
        alert(e?.response?.data?.mensagem || 'Falha ao chamar prioridade.')
      } finally {
        this.buscarAgendamentos()
      }
    },

    async getUsuarioLogado() {
      try {
        const token = localStorage.getItem('token')
        if (!token) {
          this.$router.push({ name: 'login' })
          return
        }

        const { data } = await api.get('/gerenciador/usuario-logado', {
          headers: { Authorization: `Bearer ${token}` },
        })

        this.usuario = data
        console.log('usuario-logado:', data)
      } catch (error) {
        console.error('Erro ao buscar usuário logado', error)
        localStorage.removeItem('token')
        this.$router.push({ name: 'login' })
      }
    },
    handleLogout() {
      localStorage.clear()
      this.$router.push({ name: 'login' })
    },

    async handleCancelar(id) {
      if (!confirm('Deseja realmente cancelar este atendimento?')) return
      try {
        const usuario_logado = JSON.parse(localStorage.getItem('usuario'))
        await api.put(
          `/agendamentos/cancelar/${id}`,
          {},
          {
            headers: { Authorization: `Bearer ${usuario_logado.token}` },
          },
        )
      } catch (e) {
        alert('Não foi possível cancelar o atendimento.')
      } finally {
        this.buscarAgendamentos()
      }
    },

    async handleFinalizar(id) {
      if (!confirm('Deseja finalizar este atendimento?')) return
      try {
        await api.put(`/agendamentos/finalizar/${id}`)
      } catch (e) {
        console.error(e)
      } finally {
        this.buscarAgendamentos()
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

    async salvarEspontaneo() {
      try {
        const secretariaId = this.usuario?.secretaria?.id

        if (!secretariaId) {
          console.error('ID da secretaria não encontrado no usuário logado.')
          return
        }

        const payload = {
          nomeCidadao: this.novoAgendamento.nomeCidadao,
          servico: this.novoAgendamento.servico,
          tipoAtendimento: this.novoAgendamento.tipoAtendimento,
          secretaria: this.usuario?.secretaria,
          endereco: this.usuario?.endereco,
          status: 'AGUARDANDO',
        }
        console.log("O que estou enviando para o banco:", JSON.stringify(payload, null, 2));
       

        const res = await api.post(`/agendamentos/espontaneo/${secretariaId}`, payload)

        if (res.status === 201 || res.status === 200) {
          this.mostrarModalEspontaneo = false

          this.novoAgendamento = {
            nomeCidadao: '',
            servico: null,
            tipoAtendimento: 'NORMAL',
          }

          await this.buscarAgendamentos()

          console.log('Agendamento salvo com sucesso:', res.data)
        }
      } catch (e) {
        if (e.response) {
          console.error('Erro do Servidor:', e.response.data)
        }
        console.error('Erro na requisição:', e.message)
      }
    },

    async carregarServicos() {
      try {
        const res = await api.get('/agendamento/api/servico/listar-todos')
        this.servicos = res.data
        console.log(this.servicos)
      } catch (e) {
        console.error(e)
      }
    },
  },

  async carregarSecretarias() {
    try {
      const res = await api.get('/secretarias')
      this.secretariasId = res.data
      console.log('Secretarias carregadas:', this.secretariaId)
    } catch (e) {
      console.error('Erro ao carregar secretarias:', e)
    }
  },

  computed: {
    agendamentosFinalizados() {
      return this.agendamentosPorSec.filter((a) => a.situacao === 'ATENDIDO').length
    },

    agendamentosFiltrados() {
  // 1. Normaliza a lista para evitar erros de undefined/null
  let listaNormalizada = this.agendamentosPorSec.map((item) => {
    const status = item.situacao ? item.situacao.toUpperCase() : 'AGENDADO';
    const tipoAg = item.tipoAgendamento ? item.tipoAgendamento.toUpperCase() : 'NORMAL';
    const id = item.agendamentoId || item.id; // Tenta pegar o ID de duas formas

    // Se o ID foi chamado manualmente, força o status para visualização
    if (this.idsChamadosManualmente && this.idsChamadosManualmente.includes(id)) {
      return { ...item, situacao: 'EM_ATENDIMENTO', tipoAgendamento: tipoAg };
    }
    return { ...item, situacao: status, tipoAgendamento: tipoAg };
  });

  // 2. Filtra de acordo com a aba ativa
  if (this.abaAtiva === 'AGUARDANDO') {
    return listaNormalizada.filter(a => a.situacao === 'AGENDADO');
  }

  if (this.abaAtiva === 'ESPONTANEO') {
    return listaNormalizada.filter(a => a.tipoAgendamento === 'ESPONTANEO');
  }

  if (this.abaAtiva === 'ATENDIMENTO') {
    return listaNormalizada.filter(a => 
      ['EM_ATENDIMENTO', 'CHAMADO'].includes(a.situacao)
    );
  }

  return listaNormalizada;
},

    agendamentosPaginados() {
      const inicio = (this.paginaAtual - 1) * this.itensPorPagina
      const fim = inicio + this.itensPorPagina
      return this.agendamentosFiltrados.slice(inicio, fim)
    },

    totalPaginas() {
      const total = Math.ceil(this.agendamentosFiltrados.length / this.itensPorPagina)
      return total > 0 ? total : 1
    },

    totalNormal() {
      return this.agendamentosPorSec.filter((a) => a.tipoAtendimento === 'NORMAL').length
    },
    totalPrioridade() {
      return this.agendamentosPorSec.filter((a) => a.tipoAtendimento !== 'NORMAL').length
    },
  },

  async mounted() {
    try {
      await this.getUsuarioLogado()
    } catch (e) {
      console.error(e)
    }
    this.buscarAgendamentos()
    this.atualizarRelogioLocal()
    this.carregarServicos()
    setInterval(() => this.atualizarRelogioLocal(), 1000)

    this.enderecoEstatico = `${this.usuario?.endereco?.bairro}, ${this.usuario?.endereco?.logradouro}`
  },
}
</script>

<style scoped></style>
