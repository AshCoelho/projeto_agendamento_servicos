<template>
  <div class="absolute top-0 left-0 w-full h-[4px] bg-gradient-to-r from-[#FFC107] via-[#f0d924] to-[#3da1d5] z-50"></div>

  <div class="flex min-h-screen items-center justify-center bg-[#f1f5f9] font-sans relative overflow-hidden">
    <div class="absolute -top-24 -left-24 w-96 h-96 bg-blue-50 rounded-full opacity-50"></div>
    <div class="absolute -bottom-24 -right-24 w-96 h-96 bg-blue-50 rounded-full opacity-50"></div>

    <div class="z-10 w-full max-w-md bg-white p-10 rounded-[32px] shadow-2xl shadow-blue-100 border border-gray-50">
      <div class="flex flex-col items-center mb-8">
        <div class="h-1 w-12 bg-blue-600 rounded-full mb-6"></div>
        <p class="text-center text-[12px] text-gray-700 font-bold uppercase tracking-[0.2em] mt-1">
          INFORME A SECRETARIA, SETOR E GUICHÊ PARA CONTINUAR
        </p>
      </div>

      <form @submit.prevent="updateGerenciador" class="space-y-5">
        <div>
          <label class="block text-[10px] font-black text-gray-400 uppercase mb-2 ml-1 tracking-widest">
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
              placeholder="Selecione o órgão"
            />
          </div>
        </div>

        <div v-if="selectedSecretaria">
          <label class="block text-[10px] font-black text-gray-400 uppercase mb-2 ml-1 tracking-widest">
            Escolha o Setor / Unidade
          </label>
          <div class="relative d-flex">
            <v-select
              v-model="selectedSetor"
              prepend-inner-icon="mdi-map-marker-radius"
              :items="setores"
              item-title="title"
              item-value="value"
              variant="outlined"
              density="compact"
              placeholder="Onde você irá atender?"
              :loading="carregandoSetores"
            />
          </div>
        </div>

        <div>
          <label class="block text-[10px] font-black text-gray-400 uppercase mb-2 ml-1 tracking-widest">
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
              placeholder="Número do guichê"
              :loading="carregandoGuiches"
            />
          </div>
        </div>

        <button
          type="submit"
          :disabled="!selectedSetor || !selectedGuiche || salvando"
          class="w-full bg-gradient-to-r from-[#1d4ed8] to-[#2563eb] text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-200 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-70 mt-6"
        >
          <span v-if="!salvando">Entrar</span>
          <v-progress-circular v-else indeterminate size="20" width="2" color="white" />
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
    selectedSetor: null,
    usuario: null,
    secretarias: [],
    setores: [],
    guiches: [],
    carregandoGuiches: false,
    carregandoSetores: false, // 🟢 Variável adicionada
    salvando: false // 🟢 Substituí o 'carregando' (que não existia) por 'salvando'
  }),

  methods: {
    getUsuarioLogado() {
      const userData = localStorage.getItem('usuario')
      if (userData) {
        this.usuario = JSON.parse(userData)
      } else {
        this.$router.push('/login')
      }
    },

    async updateGerenciador() {
      try {
        if (!this.selectedSetor || !this.selectedSecretaria || !this.selectedGuiche) {
          alert('Por favor, selecione a secretaria, o setor e o guichê.')
          return
        }

        this.salvando = true // 🟢 Inicia o loading no botão

        const payload = { guicheId: this.selectedGuiche }

        const response = await api.patch(`/gerenciador/${this.usuario?.id}/guiche`, payload)

        // Se chegou aqui, deu certo
        localStorage.setItem('setorTrabalhoId', this.selectedSetor)
        localStorage.setItem('secretariaTrabalhoId', this.selectedSecretaria)
        localStorage.setItem('guicheTrabalho', this.selectedGuiche)

        this.$router.push('/atendente')
      } catch (e) {
        console.error('Erro ao atualizar guichê:', e)
        const mensagemErro =
          e.response?.data?.mensagem || e.response?.data || 'Erro ao salvar configurações'
        alert(mensagemErro)
      } finally {
        this.salvando = false // 🟢 Para o loading no botão, mesmo se der erro
      }
    },

    preencherSecretarias() {
      if (this.usuario && this.usuario.secretarias) {
        this.secretarias = this.usuario.secretarias
          .map((sec) => ({ title: sec.nome, value: sec.id }))
          .sort((a, b) => a.title.localeCompare(b.title))
      }
    },

    filtrarSetores(secretariaId) {
      if (!this.usuario || !this.usuario.setores) {
        this.setores = []
        return
      }
      this.carregandoSetores = true // Efeito visual rápido
      setTimeout(() => {
        this.setores = this.usuario.setores
          .filter((s) => s.secretariaId === secretariaId) // 🔴 Verifica se é secretariaId no DTO!
          .map((s) => ({ title: s.nome, value: s.id }))
          .sort((a, b) => a.title.localeCompare(b.title))
        this.carregandoSetores = false
      }, 300)
    },

    async buscarGuichesDoSetor(setorId) {
      this.carregandoGuiches = true
      try {
        const response = await api.get(`/guiches/setor/${setorId}`)
        this.guiches = response.data.map((g) => ({
          title: `Guichê ${String(g.numero).padStart(2, '0')}`,
          value: g.id,
        }))
      } catch (e) {
        console.error('Erro ao carregar guichês:', e)
        this.guiches = []
      } finally {
        this.carregandoGuiches = false
      }
    },
  },

  mounted() {
    this.getUsuarioLogado()
    this.preencherSecretarias()
  },

  watch: {
    selectedSecretaria(newValue) {
      this.selectedSetor = null
      this.selectedGuiche = null
      if (newValue) {
        this.filtrarSetores(newValue)
      } else {
        this.setores = []
      }
    },

    selectedSetor(newValue) {
      this.selectedGuiche = null
      if (newValue) {
        this.buscarGuichesDoSetor(newValue)
      } else {
        this.guiches = []
      }
    },
  },
}
</script>
<style scoped></style>