<template>
  <div class="flex min-h-screen bg-[#f8f9fd] font-sans text-[#2d3748]">
    <AdminConfig />
    <main class="flex-1 flex flex-col">
      <header
        class="flex justify-between bg-white border-b border-black items-center px-4 mb-5 py-4"
      >
        <div class="text-[13px] font-bold text-gray-400">
          Administração / <span class="text-gray-900">Configuração de Datas </span>
        </div>
      </header>

      <v-container class="pa-0 mx-4 my-3" fluid>
        <v-card variant="flat" class="px-3 w-100">
          <v-row align="center" class="mb-4">
            <v-col cols="6" class="py-8">
              <v-title>
                <span>Gerenciar Datas de Atendimento</span>
              </v-title>
              <div class="d-flex align-center mt-4 ga-6">
                <div class="d-flex align-center">
                  <span class="text-subtitle-2 mr-2">Setor:</span>
                  <v-select
                    v-model="setorSelecionado"
                    :items="setores"
                    density="compact"
                    variant="outlined"
                    hide-details
                    style="width: 300px"
                  ></v-select>
                </div>

                <div class="d-flex align-center flex-grow-1">
                  <span class="text-subtitle-2 mr-2">Configuração:</span>
                  <v-select
                    v-model="configAtiva"
                    :items="configuracoes"
                    density="compact"
                    variant="outlined"
                    hide-details
                  ></v-select>
                </div>
              </div>
            </v-col>
          </v-row>

          <div class="d-flex align-center mb-4">
            <v-btn icon="mdi-chevron-left" variant="text" density="comfortable"></v-btn>
            <h2 class="text-h6 mx-4">Março / 2026</h2>
            <v-btn icon="mdi-chevron-right" variant="text" density="comfortable"></v-btn>
          </div>

          <div class="border my-3 mx-80 rounded-[12px] bg-[#e9e9e9]">
            <v-row no-gutters class="calendar-grid mb-4">
              <v-col
                v-for="dia in diasSemana"
                :key="dia"
                class="text-center text-caption py-2"
                style="flex: 0 0 14.28%"
              >
                {{ dia }}
              </v-col>

              <v-col v-for="n in 31" :key="n" style="flex: 0 0 14.28%" class="pa-1">
                <v-card
                  :color="isSelecionado(n) ? 'green-lighten-5' : 'white'"
                  :class="[
                    'text-center border py-4 cursor-pointer day-card',
                    isSelecionado(n) ? 'border-green' : '',
                  ]"
                  flat
                  @click="toggleDia(n)"
                >
                  <div class="text-body-2">{{ n }}</div>
                  <div
                    v-if="isSelecionado(n)"
                    class="text-tiny text-green font-weight-bold"
                    style="font-size: 0.6rem"
                  >
                    vinc.
                  </div>
                </v-card>
              </v-col>
            </v-row>
          </div>

          <div class="d-flex align-center text-caption mb-6">
            <v-checkbox-btn v-model="legendaEnviar" density="compact" class="mr-1"></v-checkbox-btn>
          </div>

          <div class="border d-flex align-center gap-2 mb-8">
            <v-btn color="blue-darken-3" class="text-none mr-2 rounded-[12px]"
              >Enviar datas novas</v-btn
            >
            <v-btn variant="outlined" class="text-none mr-2">Selecionar úteis novas</v-btn>
            <v-btn variant="outlined" class="text-none">Limpar seleções</v-btn>
          </div>

          <v-divider class="mb-4"></v-divider>
        </v-card>
      </v-container>
    </main>
  </div>
</template>

<script>
import AdminConfig from '@/components/AdminConfig.vue'

export default {
  components: {
    AdminConfig,
  },
  data: () => ({
    setores: [],
    configAtiva: 'POR_INTERVALO • 08:00-12:00 • guichês: 3',
    configuracoes: [
      'POR_INTERVALO • 08:00-12:00 • guichês: 3',
      'POR_QUANTIDADE • 13:00-17:00 • guichês: 2',
    ],
    diasSemana: ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'],
    diasMarcados: [],
  }),
  methods: {
    isSelecionado(dia) {
      return this.diasMarcados.includes(dia)
    },
    toggleDia(dia) {
      const index = this.diasMarcados.indexOf(dia)
      if (index > -1) this.diasMarcados.splice(index, 1)
      else this.diasMarcados.push(dia)
    },
  },
}
</script>

<style scoped>
.calendar-grid {
  border-top: 1px solid #e0e0e0;
  border-left: 1px solid #e0e0e0;
}
.day-card {
  border-radius: 8px !important;
  transition: all 0.2s;
}
.border-green {
  border: 2px solid #4caf50 !important;
}
.text-tiny {
  line-height: 1;
}
.gap-2 {
  gap: 8px;
}
</style>
