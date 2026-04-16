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
          :color="item.ativo ? 'green-lighten-4' : 'red-lighten-4'"
          :text-color="item.ativo ? 'green-darken-3' : 'red-darken-3'"
          size="x-small"
          class="text-uppercase font-weight-bold"
          variant="flat"
        >
          {{ item.ativo ? 'Ativo' : 'Inativo' }}
        </v-chip>
      </template>

      <template v-slot:[`item.acoes`]="{ item }">
      <div class="d-flex justify-end gap-2">
        <v-btn
         
          :icon="item.ativo ? 'mdi-close' : 'mdi-check'"
          variant="tonal"
          size="small"
          :color="item.ativo ? 'red' : 'green'"
          @click="alterarStatus(item)"
          :title="item.ativo ? 'Desativar' : 'Ativar'"
        ></v-btn>
        
        <v-btn 
          icon="mdi-pencil" 
          variant="text" 
          size="small" 
          color="blue"
          @click="abrirEdicao(item)"
        ></v-btn>
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
          <AdicionarConfiguracao
            :config="configEmEdicao"
            @salvo="onConfigSalva"
            @cancelar="dialog.addConfig = false"
          />
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import AdminConfig from '@/components/AdminConfig.vue'
import AdicionarConfiguracao from '@/components/AdicionarConfiguracao.vue'
import api from '@/services/api'
import { ConfiguracoesAtendimentoService } from '@/services/configuracao.service'
import { UsuarioService } from '@/services/usuario.service'

export default {
  components: { AdminConfig, AdicionarConfiguracao },
  data: () => ({
    usuario: null, // Adicionado para armazenar os dados do admin
    allConfigs: [],
    configEmEdicao: null,
    configuracoesAtendimentos: [],
    dialog: { addConfig: false },
    config: {
      type: Object,
      default: null
    },
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

    async abrirEdicao(item) {
      this.configEmEdicao = { ...item } // clone importante
      this.dialog.addConfig = true
    },
    // 1. Primeiro pegamos o usuário para saber quais setores ele comanda
    async inicializarComponente() {
      try {
        const res = await UsuarioService.getUsuarioLogado()

        this.usuario = res.data

        console.log("Usuário carregado:", this.usuario)

        if (this.usuario?.setores?.length > 0) {
          await this.getAllConfigs()
        }

      } catch (error) {
        console.error('Erro ao inicializar:', error)
      }
    },

    // 2. Buscamos as configurações de TODOS os setores do admin
    async getConfiguracoesAtendimento(setores) {
      try {
        const resultados =
          await ConfiguracoesAtendimentoService.listarPorSetores(setores)

        this.configuracoesAtendimentos = resultados.reduce((acc, res) => {
          return acc.concat(Array.isArray(res.data) ? res.data : [])
        }, [])

      } catch (e) {
        console.error('Erro ao carregar configs por setor:', e)
      }
    },

    async alterarStatus(item) {
      const statusAcao = item.ativo ? 'desativar' : 'ativar'

      if (!confirm(`Deseja realmente ${statusAcao} esta configuração?`)) return

      try {
        if (item.ativo) {
          await ConfiguracoesAtendimentoService.desativar(item.id)
        } else {
          await ConfiguracoesAtendimentoService.ativar(item.id)
        }

        item.ativo = !item.ativo

        if (this.usuario?.setores) {
          await this.getConfiguracoesAtendimento(this.usuario.setores)
        }

      } catch (e) {
        const erroMsg = e.response?.data?.mensagem || 'Erro ao alterar status.'
        alert(erroMsg)
      }
    },

    onConfigSalva() {
      this.dialog.addConfig = false
      this.configEmEdicao = null
      this.getAllConfigs()
    },

    // Mantido caso o seu backend venha a ter um GET total no futuro
    async getAllConfigs() {
      if (!this.usuario?.setores) return

      try {
        const resultados =
          await ConfiguracoesAtendimentoService.listarPorSetores(this.usuario.setores)

        const dados = resultados.flatMap(res =>
          Array.isArray(res.data) ? res.data : []
        )

        this.configuracoesAtendimentos = [...dados]
        this.allConfigs = [...dados]

      } catch (e) {
        console.error("Erro ao carregar configurações:", e)
      }
    },
  },
  mounted() {
    this.inicializarComponente(); // Opcional, dependendo do seu backend
  },
}
</script>