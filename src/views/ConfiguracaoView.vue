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
            <v-row> </v-row>
            <v-row>
              <v-col>
                <v-sheet class="">
                  <v-data-table :items="configuracoesAtendimentos" :headers="headers">
                    <template #bottom> </template>
                  </v-data-table>
                </v-sheet>
              </v-col>
            </v-row>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
    <v-dialog v-model="dialog.addConfig" class="w-50">
      <v-card>
        <v-card-title class="d-flex justify-space-between">
          <span class="text-subtitle-1 font-weight-semibold"
            >Criar configuração de Atendimento</span
          >
          <span class="text-caption">Regra de Atendimento</span>
        </v-card-title>
        <v-divider thickness="2" opacity="1"></v-divider>
        <AdicionarConfiguracao></AdicionarConfiguracao>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import AdminConfig from '@/components/AdminConfig.vue'
import { DecimalsArrowRight } from 'lucide-vue-next'
import AdicionarConfiguracao from '@/components/AdicionarConfiguracao.vue'
import api from '@/services/api'

export default {
  components: { AdminConfig, AdicionarConfiguracao },
  data: () => ({
    configuracoesAtendimentos: [],
    setores: [],
    dialog: {
      addConfig: false,
    },
    perfilUsuario: '', // Vai vir do LocalStorage
    configHorario: {
      inicio: '08:00',
      fim: '18:00',
      intervalo: '30',
    },
    horáriosGerados: [
      '08:00',
      '08:30',
      '09:00',
      '09:30',
      '10:00',
      '10:30',
      '11:00',
      '11:30',
      '12:00',
      '12:30',
      '13:00',
      '13:30',
      '14:00',
      '14:30',
      '15:00',
      '15:30',
      '16:00',
      '16:30',
      '17:00',
      '17:30',
    ],

    headers: [
      {
        title: 'Regra',
        value: 'regra',
      },
      {
        title: 'Horário',
        value: 'horario',
      },
      {
        title: 'Pausa',
        value: 'pausa',
      },
      {
        title: 'Guichês',
        value: 'guiches',
      },
      {
        title: 'Status',
        value: 'status',
      },
    ],
  }),
  methods: {
    async getSetoresPorSecretaria() {
      try {
        const { data } = await api.get(`http://localhost:8080/setores/por-secretaria/${5}`)
        this.setores = data
      } catch (e) {
        console.error(e)
      }
    },
    async getConfiguracoesAtendimento() {
      try {
        const { data } = await api.get(`http://localhost:8080/api/configuracoes-atendimento`)
        this.configuracoesAtendimentos = data
      } catch (e) {
        console.error(e)
      }
    },
  },
  mounted() {
    // Busca o perfil do usuário logado
    this.getSetoresPorSecretaria()
    this.getConfiguracoesAtendimento()
    const user = JSON.parse(localStorage.getItem('usuario'))
    if (user) {
      this.perfilUsuario = user.perfil // Ex: 'SuperAdministrador', 'Admin' ou 'Atendente'
    }
  },
}
</script>

<style scoped>
.animate-in {
  animation: slideUp 0.4s ease-out;
}
@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
