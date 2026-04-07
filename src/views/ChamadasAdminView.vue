<template>
  <div class="flex min-h-screen bg-[#f8f9fd] font-sans text-[#2d3748]">
    <AdminConfig />

    <main class="flex-1 flex flex-col">
      <header
        class="flex items-center justify-between bg-white border-b border-gray-100 px-8 py-3 mb-5 shadow-sm"
      >
        <div class="flex items-center gap-2 text-[13px] font-bold">
          <span class="text-gray-400">Administração</span>
          <i class="pi pi-angle-right text-[10px] text-gray-300"></i>
          <span class="text-[#1e3a8a]">Histórico de Chamadas</span>
        </div>

        <div class="relative w-1/4 max-w-md">
          <i class="pi pi-search absolute left-4 top-1/2 -translate-y-1/2 text-blue-400"></i>
          <input
            v-model="filtroGlobal"
            type="text"
            placeholder="Pesquisar no histórico..."
            class="w-full bg-[#f1f4f9] border-none rounded-full py-2 pl-11 text-xs placeholder-gray-400 focus:ring-1 focus:ring-blue-200 outline-none transition-all"
          />
        </div>

        <div class="flex items-center gap-6">
          <div class="text-right leading-tight">
            <div class="text-[11px] font-bold text-gray-400 uppercase tracking-tighter">
              Última Atualização
            </div>
            <div class="text-gray-500 text-[12px] font-medium">
              {{ relogio }}
            </div>
          </div>

          <div class="h-10 w-[1px] bg-gray-100"></div>

          <button
            @click="buscarChamadas"
            :disabled="loading"
            class="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-full text-[11px] font-bold uppercase tracking-wider transition-all shadow-sm flex items-center gap-2 disabled:opacity-50"
          >
            <i class="pi pi-refresh text-[10px]" :class="{ 'fa-spin': loading }"></i>
            {{ loading ? 'Carregando...' : 'Atualizar' }}
          </button>
        </div>
      </header>

      <v-container class="pa-0 mx-4 my-3" fluid>
        <v-card variant="flat" class="px-6 py-6 rounded-xl border border-gray-100">
          <div class="mb-6">
            <h1 class="text-xl font-bold text-gray-800">Registros de Atendimento</h1>
            <p class="text-xs text-gray-400">
              Visualize todas as senhas chamadas e seus respectivos setores.
            </p>
          </div>

          <div class="overflow-hidden border border-gray-50 rounded-lg">
            <table class="w-full text-left border-collapse">
              <thead>
                <tr class="bg-[#f1f4f9]">
                  <th
                    class="px-4 py-4 text-[11px] font-bold uppercase text-gray-400 tracking-wider"
                  >
                    Senha
                  </th>
                  <th
                    class="px-4 py-4 text-[11px] font-bold uppercase text-gray-400 tracking-wider"
                  >
                    Guichê
                  </th>
                  <th
                    class="px-4 py-4 text-[11px] font-bold uppercase text-gray-400 tracking-wider"
                  >
                    Tipo
                  </th>
                  <th
                    class="px-4 py-4 text-[11px] font-bold uppercase text-gray-400 tracking-wider"
                  >
                    Setor
                  </th>
                  <th
                    class="px-4 py-4 text-[11px] font-bold uppercase text-gray-400 tracking-wider"
                  >
                    Horário
                  </th>
                  <th
                    class="px-4 py-4 text-[11px] font-bold uppercase text-gray-400 tracking-wider text-center"
                  >
                    Ações
                  </th>
                </tr>
              </thead>

              <tbody class="divide-y divide-gray-50">
                <tr
                  v-for="chamada in chamadasFiltradas"
                  :key="chamada.id"
                  class="hover:bg-blue-50/30 transition-colors"
                >
                  <td class="px-4 py-4">
                    <span class="font-bold text-blue-900">{{ chamada.senha }}</span>
                  </td>
                  <td class="px-4 py-4 text-sm text-gray-600">
                    <span class="bg-gray-100 px-2 py-1 rounded text-[11px] font-medium">
                      {{ chamada.guiche }}
                    </span>
                  </td>
                  <td class="px-4 py-4">
                    <span
                      class="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-tight"
                      :class="
                        chamada.tipo === 'PRIORIDADE'
                          ? 'bg-red-100 text-red-600'
                          : 'bg-green-100 text-green-600'
                      "
                    >
                      {{ chamada.tipo }}
                    </span>
                  </td>
                  <td class="px-4 py-4 text-sm text-gray-500 font-medium">
                    {{ chamada.setor }}
                  </td>
                  <td class="px-4 py-4 text-sm text-gray-400">
                    {{ formatarHora(chamada.hora) }}
                  </td>
                  <td class="px-4 py-4 text-center">
                    <button class="text-blue-400 hover:text-blue-600 transition">
                      <i class="pi pi-ellipsis-h"></i>
                    </button>
                  </td>
                </tr>

                <tr v-if="!chamadasFiltradas.length">
                  <td colspan="6" class="py-20 text-center">
                    <i class="pi pi-inbox text-gray-200 text-4xl mb-3 block"></i>
                    <span class="text-sm text-gray-400 font-medium">
                      {{
                        filtroGlobal
                          ? 'Nenhum resultado para a busca'
                          : 'Nenhuma chamada registrada no momento'
                      }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </v-card>
      </v-container>
    </main>
  </div>
</template>

<script>
import { AtendenteApi } from '@/services/atendente.api'
import AdminConfig from '@/components/AdminConfig.vue'

export default {
  name: 'ChamadasAdminView',

  components: {
    AdminConfig,
  },

  data() {
    return {
      chamadas: [],
      intervalo: null,
      filtroGlobal: '',
      relogio: '',
      loading: false,
    }
  },

  computed: {
    chamadasFiltradas() {
      if (!this.filtroGlobal) return this.chamadas
      const termo = this.filtroGlobal.toLowerCase()
      return this.chamadas.filter(
        (c) =>
          c.senha?.toLowerCase().includes(termo) ||
          c.setor?.toLowerCase().includes(termo) ||
          c.guiche?.toString().includes(termo),
      )
    },
  },

  methods: {
    atualizarRelogio() {
      const agora = new Date()
      this.relogio = agora.toLocaleTimeString('pt-BR')
    },

    async buscarChamadas() {
      if (this.loading) return // Evita múltiplas chamadas simultâneas
      this.loading = true
      try {
        const setorId = localStorage.getItem('setorTrabalhoId')
        if (!setorId) {
          console.warn('Setor ID não encontrado no localStorage')
          return
        }

        const dados = await AtendenteApi.buscarAgendamentosPorSetor(setorId, null, 'SUPERADMIN')

        if (dados && Array.isArray(dados)) {
          this.chamadas = dados.map((item) => ({
            id: item.id,
            senha: item.senha || item.numero || 'S/N',
            guiche: item.guiche || item.numeroGuiche || '-',
            tipo: item.tipo || item.prioridade || 'NORMAL',
            setor: item.setorNome || (item.setor ? item.setor.nome : '-'),
            hora: item.hora || item.dataHoraChamada || item.createdAt,
          }))
        }
      } catch (e) {
        console.error('Erro na requisição:', e)
      } finally {
        this.loading = false
      }
    },

    formatarHora(data) {
      if (!data) return '--:--'
      const d = new Date(data)
      return isNaN(d.getTime())
        ? '--:--'
        : d.toLocaleTimeString('pt-BR', {
            hour: '2-digit',
            minute: '2-digit',
          })
    },
  },

  mounted() {
    this.atualizarRelogio()
    this.buscarChamadas()

    this.intervalo = setInterval(() => {
      this.buscarChamadas()
      this.atualizarRelogio()
    }, 10000)
  },

  beforeUnmount() {
    if (this.intervalo) clearInterval(this.intervalo)
  },
}
</script>
