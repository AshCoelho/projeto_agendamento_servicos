<template>
  <div
    class="absolute top-0 left-0 w-full h-[4px] bg-gradient-to-r from-[#FFC107] via-[#f0d924] to-[#3da1d5] z-50"
  ></div>

  <div
    class="flex min-h-screen items-center justify-center bg-[#f1f5f9] font-sans relative overflow-hidden"
  >
    <div class="absolute -top-24 -left-24 w-96 h-96 bg-blue-50 rounded-full opacity-50"></div>
    <div class="absolute -bottom-24 -right-24 w-96 h-96 bg-blue-50 rounded-full opacity-50"></div>

    <div
      class="z-10 w-full max-w-md bg-white p-10 rounded-[32px] shadow-2xl shadow-blue-100 border border-gray-50"
    >
      <div class="flex flex-col items-center mb-8">
        <img src="@/assets/logo-prefeitura.png" alt="Prefeitura de São Luís" class="h-14 mb-4" />
        <div class="h-1 w-12 bg-blue-600 rounded-full mb-6"></div>

        <h2 class="text-xl font-black text-[#1e3a8a] uppercase tracking-tighter">
          Acesso ao <span class="text-blue-600">Sistema</span>
        </h2>
        <p class="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em] mt-1">
          Agendamento de Serviços
        </p>
      </div>

      <form @submit.prevent="updateGerenciador()" class="space-y-5">
        
        <div>
          <label
            class="block text-[10px] font-black text-gray-400 uppercase mb-2 ml-1 tracking-widest"
          >
            Escolha a secretaria
          </label>
          <div class="relative d-flex">
            <v-select
              v-model="selectedSecretaria"
              prepend-inner-icon="mdi-account-tie"
              :items="secretarias"
              item-title="title"
              item-value="value"
              variant="outlined"
              density="compact"
            />
          </div>
        </div>

        <div>
          <label
            class="block text-[10px] font-black text-gray-400 uppercase mb-2 ml-1 tracking-widest"
          >
            Escolha seu Guichê
          </label>
          <div class="relative d-flex">
      
            <v-select
              v-model="selectedGuiche"
              prepend-inner-icon="mdi-monitor"
              :items="guiches"
              item-title="title"
              item-value="value"
              variant="outlined"
              density="compact"
            />
          </div>
        </div>

      
        <button
          type="submit"
          :disabled="carregando"
          class="w-full bg-gradient-to-r from-[#1d4ed8] to-[#2563eb] text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-200 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-70"
        >
          <span>Entrar no Sistema</span>
          <!-- <i class="pi pi-spin pi-spinner text-sm"></i> -->
        </button>
      </form>

      <div class="mt-10 text-center">
        <p class="text-[9px] font-bold text-gray-400 uppercase">© 2026 Prefeitura de São Luís</p>
        <p class="text-[9px] font-black text-blue-700 uppercase mt-1">
          Secretaria Municipal de Tecnologia da Informação
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import api from '@/services/api'

export default {
  data: () => ({
    selectedGuiche: null,
    selectedSecretaria: null,
    usuario: null,
    secretarias: [],
    servicos: [],
    guiches: [
      { title: 'Guichê 01', value: 1 },
      { title: 'Guichê 02', value: 2 },
      { title: 'Guichê 03', value: 3 },
      { title: 'Guichê 04', value: 4 },
      { title: 'Guichê 05', value: 5 },
    ],
  }),

  methods: {
    getUsuarioLogado() {
      this.usuario = JSON.parse(localStorage.getItem('usuario'))
    },

    async updateGerenciador() {
      try {
        const payload = {
          guiche: this.selectedGuiche,
          secretariaId: this.selectedSecretaria
        }

        const response = await api.put(
          `/gerenciador/${this.usuario?.id}/guiche`,
          payload
        )

        if (response.status === 200) {
          this.$router.push('/atendente')
        }
      } catch (e) {
        console.error(e)
      }
    },

    async getSecretarias() {
      try {
        const response = await api.get('/secretarias/ativas-visiveis')

        this.secretarias = response.data.map(sec => ({
          title: sec.nome,
          value: sec.id
        }))
      } catch (error) {
        console.error('Erro ao buscar secretarias', error)
      }
    },

    async getServicos(secretariaId) {
      try {
        const response = await api.get(
          `/secretarias/${secretariaId}/servicos`
        )
        this.servicos = response.data
      } catch (error) {
        console.error(error)
      }
    }
  },

  mounted() {
    this.getUsuarioLogado()
    this.getSecretarias()
  },

  watch: {
    selectedSecretaria(newValue) {
      if (newValue) {
        this.getServicos(newValue)
      }
    }
  }
}
</script>
