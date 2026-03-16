<template>
  <div class="flex min-h-screen bg-[#f8f9fd] font-sans text-[#2d3748]">
    <AdminConfig />
    <v-container class="pa-0" fluid>
      <main class="flex-1">
        <header
          class="flex justify-between bg-white border-b border-black items-center px-4 mb-5 py-4"
        >
          <div class="text-[13px] font-bold text-gray-400">
            Administração / <span class="text-gray-900">Configuração </span>
          </div>
        </header>
      </main>

      <v-row class="pa-5">
        <div class="flex justify-between items-center mb-5 w-full">
          <div>
            <h2 class="text-gray-500 mx-3 text-xs font-bold uppercase tracking-[0.2em]">
              Configurações de Atendimento
            </h2>
          </div>

          <button
            @click="dialog.addConfig = true"
            class="bg-green-600 hover:bg-green-700 mx-3 text-white px-4 py-2 rounded-lg text-xs font-bold uppercase transition-all shadow-sm flex items-center gap-2"
          >
            <i class="pi pi-plus"></i>
            Adicionar Configuração
          </button>
        </div>

        <v-col cols="12">
          <v-card class="pa-4">
            <v-data-table :items="allConfigs" :headers="headers" class="elevation-0">
              <template v-slot:[`item.horario`]="{ item }">
                <div class="font-weight-medium">{{ item.horaInicio }} — {{ item.horaFim }}</div>
              </template>

              <template v-slot:[`item.pausa`]="{ item }">
                <v-chip v-if="item.pausaInicio" size="small" variant="tonal" color="orange">
                  {{ item.pausaInicio }} - {{ item.pausaFim }}
                </v-chip>
                <span v-else class="text-caption text-grey">Sem pausa</span>
              </template>

              <template v-slot:[`item.detalheRegra`]="{ item }">
                <span v-if="item.tipoRegra === 'POR_QUANTIDADE'">
                  {{ item.quantidadeAtendimentos }} atend.
                </span>
                <span v-else> {{ item.intervaloMinutos }} min. </span>
              </template>

              <template v-slot:[`item.ativo`]="{ item }">
                <v-chip
                  :color="item.ativo ? 'green' : 'red'"
                  size="x-small"
                  class="text-uppercase font-weight-bold"
                >
                  {{ item.ativo ? 'Ativo' : 'Inativo' }}
                </v-chip>
              </template>

              <template v-slot:[`item.acoes`]="{ item }">
                <div class="d-flex justify-end gap-2">
                  <v-btn
                    icon="mdi-power"
                    variant="text"
                    size="small"
                    :color="item.ativo ? 'red' : 'green'"
                    @click="alterarStatus(item)"
                    :title="item.ativo ? 'Desativar' : 'Ativar'"
                  ></v-btn>
                  <v-btn icon="mdi-pencil" variant="text" size="small" color="blue"></v-btn>
                </div>
              </template>

              <template #bottom></template>
            </v-data-table>
          </v-card>
        </v-col>
      </v-row>
    </v-container>

    <v-dialog v-model="dialog.addConfig" persistent max-width="700">
      <v-card>
        <v-card-title class="d-flex justify-space-between align-center pa-4">
          <span class="text-h6 font-weight-bold">Criar configuração de Atendimento</span>
          <v-btn icon="mdi-close" variant="text" @click="dialog.addConfig = false"></v-btn>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <AdicionarConfiguracao @salvo="onConfigSalva" @cancelar="dialog.addConfig = false" />
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import AdminConfig from '@/components/AdminConfig.vue'
import AdicionarConfiguracao from '@/components/AdicionarConfiguracao.vue'
import api from '@/services/api'

export default {
  components: { AdminConfig, AdicionarConfiguracao },
  data: () => ({
    allConfigs: [],
    configuracoesAtendimentos: [],
    dialog: { addConfig: false },
    headers: [
      { title: 'Setor', key: 'setor.nome' },
      { title: 'Regra', key: 'tipoRegra' },
      { title: 'Horário de Atendimento', key: 'horario' },
      { title: 'Pausa', key: 'pausa' },
      { title: 'Qtd/Intervalo', key: 'detalheRegra' },
      { title: 'Guichês', key: 'numeroGuiches', align: 'center' },
      { title: 'Status', key: 'ativo', align: 'center' },
      { title: 'Ações', key: 'acoes', sortable: false, align: 'end' },
    ],
  }),
  methods: {
    async getConfiguracoesAtendimento() {
      try {
        // Como o GET geral não existe, vamos buscar de um setor específico (ex: setor 5)
        // No futuro, você pode pegar o setorId do usuário logado
        const setorId = 5
        const { data } = await api.get(`/api/configuracoes-atendimento/setor/${setorId}`)
        this.configuracoesAtendimentos = data
      } catch (e) {
        console.error('Erro ao carregar configurações:', e)
      }
    },

    async alterarStatus(item) {
      const id = item.id
      try {
        if (item.ativo) {
          // Bate no @DeleteMapping("/{id}/desativar")
          await api.delete(`/api/configuracoes-atendimento/${id}/desativar`)
        } else {
          // Bate no @PutMapping("/{id}/ativar")
          await api.put(`/api/configuracoes-atendimento/${id}/ativar`)
        }
        this.getConfiguracoesAtendimento()
      } catch (e) {
        alert('Erro ao alterar status da configuração.', e)
      }
    },

    onConfigSalva() {
      this.dialog.addConfig = false
      this.getConfiguracoesAtendimento()
    },

    async getAllConfigs() {
      try {
        const { data } = await api.get('/api/configuracoes-atendimento')
        this.allConfigs = data
      } catch (e) {
        console.error(e)
      }
    },
  },
  mounted() {
    this.getConfiguracoesAtendimento()
    this.getAllConfigs()
  },
}
</script>
