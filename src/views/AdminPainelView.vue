<template>
  <div class="flex min-h-screen bg-[#f8f9fd] font-sans text-[#2d3748]">
    <AdminConfig></AdminConfig>

    <main class="flex-1">
      <header
        class="flex justify-between bg-white border-b border-black items-center px-8 mb-5 py-4"
      >
        <div class="text-[13px] font-bold text-gray-400">Administração /</div>
      </header>

      <!-- CARDS -->
      <div class="px-8 grid grid-cols-3 gap-6 mb-5">
        <div class="bg-white p-6 rounded-[15px] shadow-sm flex justify-between items-start border-b-4 hover:border-[#9E9E9E]">
          <div>
            <p class="text-[12px] font-bold text-gray-400 uppercase mb-1">Atendimentos Hoje</p>
            <h3 class="text-3xl font-black text-gray-800">{{ agendamentosFiltrados.length }}</h3>
          </div>
          <i class="pi pi-calendar text-xl"></i>
        </div>

        <div class="bg-white p-6 rounded-[15px] shadow-sm flex justify-between items-start border-b-4 hover:border-[#FFD54F]">
          <div>
            <p class="text-[12px] font-bold text-gray-400 uppercase mb-1">Pessoas na Fila</p>
            <h3 class="text-3xl font-black text-gray-800">{{ totalNaFila }}</h3>

            <div class="flex gap-2 mt-2">
              <span class="text-[11px] font-bold text-blue-500 uppercase">
                {{ totalNormal }} Normal
              </span>
              <span class="text-[11px] font-bold text-orange-500 uppercase">
                {{ totalPrioridade }} Prioridade
              </span>
            </div>
          </div>
          <i class="pi pi-users text-xl"></i>
        </div>

        <div class="bg-white p-6 rounded-[15px] shadow-sm flex justify-between items-start border-b-4 hover:border-[#4CAF50]">
          <div>
            <p class="text-[12px] font-bold text-gray-400 uppercase mb-1">Finalizados</p>
            <h3 class="text-3xl font-black text-gray-800">{{ agendamentosFinalizados }}</h3>
          </div>
          <i class="pi pi-check text-xl"></i>
        </div>
      </div>

      <div class="px-8 mb-4 flex gap-4 flex-wrap">

        <div>
          <label class="text-[10px] font-bold text-gray-400 uppercase">Data</label>
          <input 
            type="date"
            v-model="filtroData"
            class="block bg-white border rounded-lg p-2 text-sm"
          />
        </div>

        <div>
          <label class="text-[10px] font-bold text-gray-400 uppercase">Serviço</label>
            <select 
              v-model="filtroServico"
              class="block bg-white border rounded-lg p-2 text-sm min-w-[200px]"
            >
            <option value="">Todos</option>
            <option v-for="s in listaServicos" :key="s" :value="s">
              {{ s }}
            </option>
          </select>
        </div>

      <div class="flex items-end">
        <button 
          @click="filtroData = ''; filtroServico = ''"
          class="bg-gray-200 px-3 py-2 rounded text-xs font-bold"
        >
          Limpar
        </button>
      </div>

    </div>

      <!-- TABELA -->
      <div class="px-8">
        <div class="bg-white rounded-[12px] shadow-sm border border-gray-100 overflow-hidden">

          <div class="max-h-[450px] overflow-y-auto">
            <table class="w-full">
              <thead class="text-[10px] font-bold text-gray-400 uppercase bg-white sticky top-0">
                <tr>
                  <th class="px-6 py-4 text-left">Senha</th>
                  <th class="px-6 py-4 text-left">Cidadão</th>
                  <th class="px-6 py-4 text-left">Serviço</th>
                  <th class="px-6 py-4 text-left">Situação</th>
                  <th class="px-6 py-4 text-left">Tipo</th>
                  <th class="px-6 py-4 text-left">Data/Hora</th>
                </tr>
              </thead>

              <tbody class="divide-y">
                <tr v-for="item in agendamentosFiltrados" :key="item.id" class="hover:bg-gray-50">
                  <td class="px-6 py-4 font-bold">{{ item.senha }}</td>
                  <td class="px-6 py-4">{{ item.usuarioNome }}</td>
                  <td class="px-6 py-4">{{ item.servicoNome }}</td>
                  <td class="px-6 py-4">{{ item.situacao }}</td>
                  <td class="px-6 py-4">{{ item.tipoAtendimento }}</td>
                  <td class="px-6 py-4">
                    {{ formatarDataHora(item.horaAgendamento) }}
                  </td>
                </tr>

                <tr v-if="agendamentosFiltrados.length === 0">
                  <td colspan="6" class="text-center py-10 text-gray-400">
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
import AdminConfig from '@/components/AdminConfig.vue'
import { AtendenteApi } from '@/services/atendente.api.js'
import api from '@/services/api'

export default {
  components: { AdminConfig },

  data() {
    return {
      usuario: null,
      agendamentosPorSec: [],
      filtroData: '',
      filtroServico: ''
    }
  },

  computed: {
    totalNaFila() {
      return this.agendamentosFiltrados.filter(a =>
        ['AGENDADO'].includes(a.situacao)
      ).length
    },

    agendamentosFinalizados() {
      return this.agendamentosFiltrados.filter(a =>
        a.situacao === 'ATENDIDO'
      ).length
    },

    totalNormal() {
      return this.agendamentosFiltrados.filter(a =>
        a.tipoAtendimento === 'NORMAL' && a.situacao === 'AGENDADO'
      ).length
    },

    totalPrioridade() {
      return this.agendamentosFiltrados.filter(a => {
        const tipo = (a.tipoAtendimento || '').toUpperCase()

        return tipo.includes('PRIORIDADE') &&
              a.situacao === 'AGENDADO'
      }).length
    },

    agendamentosFiltrados() {
      return this.agendamentosPorSec.filter(a => {
        const matchData = this.filtroData
          ? a.horaAgendamento?.startsWith(this.filtroData)
          : true

        const matchServico = this.filtroServico
          ? a.servicoNome === this.filtroServico
          : true

        return matchData && matchServico
      })
    },

    listaServicos() {
      return [...new Set(this.agendamentosPorSec.map(a => a.servicoNome))]
    },
  },

  methods: {
    async getUsuarioLogado() {
      const res = await api.get('/gerenciador/usuario-logado')
      this.usuario = res.data

      if (this.usuario?.setores?.length) {
        this.carregarDados(this.usuario.setores)
      }
    },

    async carregarDados(setores) {
      const buscas = setores.map(s =>
        AtendenteApi.buscarAgendamentosPorSetor(
          s.id,
          this.usuario?.id,
          this.usuario?.perfil
        )
      )

      const resultados = await Promise.all(buscas)

      const todos = resultados.flat()

      // REMOVE DUPLICADOS
      const map = new Map()

      todos.forEach(item => {
        const key = item.agendamentoId || item.id
        if (key && !map.has(key)) {
          map.set(key, item)
        }
      })

      const unicos = Array.from(map.values())

      // ORDENA (mantendo sua lógica)
      this.agendamentosPorSec = unicos.sort((a, b) => {

        // 1. Situação (fila primeiro)
        const ordemSituacao = (s) => {
          if (['EM_ATENDIMENTO', 'CHAMADO'].includes(s)) return 1
          if (['AGENDADO', 'REAGENDADO'].includes(s)) return 2
          if (s === 'ATENDIDO') return 3
          return 4
        }

        const s1 = ordemSituacao(a.situacao)
        const s2 = ordemSituacao(b.situacao)

        if (s1 !== s2) return s1 - s2

        // 2. DATA MAIS RECENTE PRIMEIRO
        const d1 = new Date(a.horaAgendamento)
        const d2 = new Date(b.horaAgendamento)

        if (d1.toDateString() !== d2.toDateString()) {
          return d2 - d1 // DESC (mais recente primeiro)
        }

        // 3. PRIORIDADE
        const p1 = a.tipoAtendimentoPeso || 0
        const p2 = b.tipoAtendimentoPeso || 0

        if (p1 !== p2) return p1 - p2

        // 4. HORA
        return d1 - d2
      })
    },

    formatarDataHora(data) {
      if (!data) return '-'
      return new Date(data).toLocaleString('pt-BR')
    }
  },

  mounted() {
    this.getUsuarioLogado()
  }
}
</script>