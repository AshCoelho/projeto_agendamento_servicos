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
        <div class="h-1 w-12 bg-blue-600 rounded-full mb-6"></div>
        <p class="text-center text-[12px] text-gray-700 font-bold uppercase tracking-[0.2em] mt-1">
          INFORME A SECRETARIA, SETOR E GUICHÊ PARA CONTINUAR
        </p>
      </div>

      <form @submit.prevent="updateGerenciador" class="space-y-5">
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
              placeholder="Selecione o órgão"
            />
          </div>
        </div>

        <div v-if="selectedSecretaria">
          <label
            class="block text-[10px] font-black text-gray-400 uppercase mb-2 ml-1 tracking-widest"
          >
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
    carregandoSetores: false,
    salvando: false,
  }),

  methods: {
    // 🟢 Agora a formatação é DINÂMICA baseada no banco de dados
    formatarExibicaoPonto(ponto) {
      if (!ponto.descricao) return `Ponto ${ponto.numero}`
      return `${ponto.descricao} ${String(ponto.numero).padStart(2, '0')}`
    },

    getUsuarioLogado() {
      const userData = localStorage.getItem('usuario')
      const token = localStorage.getItem('token')

      if (userData && token) {
        try {
          this.usuario = JSON.parse(userData)

          this.selectedGuiche = null
          this.selectedSetor = null
          this.selectedSecretaria = null

          this.preencherSecretarias()
        } catch (e) {
          console.error('Dados do usuário corrompidos no storage', e)
          localStorage.clear()
          window.location.href = '/'
        }
      } else {
        localStorage.clear()
        window.location.href = '/'
      }
    },

    async updateGerenciador() {
      try {
        if (!this.selectedSetor || !this.selectedSecretaria || !this.selectedGuiche) {
          alert('Por favor, selecione a secretaria, o setor e o local de atendimento.')
          return
        }

        this.salvando = true

        // Captura dados para o LocalStorage (usado no Header/Painel do Atendente)
        const secretariaEncontrada = this.secretarias.find(
          (s) => s.value === this.selectedSecretaria,
        )
        if (secretariaEncontrada) {
          localStorage.setItem('secretariaNomeAtiva', secretariaEncontrada.title)
        }

        // Busca o label que o usuário selecionou para salvar no storage (ex: "Consultório 01")
        const pontoSelecionado = this.guiches.find((g) => g.value === this.selectedGuiche)
        if (pontoSelecionado) {
          localStorage.setItem('guicheDescricaoAtiva', pontoSelecionado.title)
        }

        const payload = { guicheId: this.selectedGuiche }

        // Chamada para a rota que você criou no Java
        await api.patch(`/gerenciador/${this.usuario.id}/guiche`, payload)

        localStorage.setItem('setorTrabalhoId', this.selectedSetor)
        localStorage.setItem('secretariaTrabalhoId', this.selectedSecretaria)
        localStorage.setItem('guicheTrabalho', this.selectedGuiche)

        this.$router.push('/atendente')
      } catch (e) {
        console.error('Erro ao atualizar local de atendimento:', e)

        if (e.response && (e.response.status === 401 || e.response.status === 403)) {
          alert('Sua sessão expirou. Faça login novamente.')
          localStorage.clear()
          window.location.href = '/'
          return
        }

        const mensagemErro =
          e.response?.data?.mensagem || e.response?.data?.erro || 'Erro ao salvar configurações'
        alert(
          typeof mensagemErro === 'string' ? mensagemErro : 'O local selecionado já está ocupado.',
        )
      } finally {
        this.salvando = false
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
      this.carregandoSetores = true
      // Pequeno delay para UX
      setTimeout(() => {
        this.setores = this.usuario.setores
          .filter((s) => s.secretariaId === secretariaId)
          .map((s) => ({ title: s.nome, value: s.id }))
          .sort((a, b) => a.title.localeCompare(b.title))
        this.carregandoSetores = false
      }, 200)
    },

    async buscarGuichesDoSetor(setorId) {
      this.carregandoGuiches = true
      try {
        const response = await api.get(`/pontos-atendimento/setor/${setorId}`)

        if (Array.isArray(response.data)) {
          this.guiches = response.data.map((g) => ({
            // 🟢 Aqui usamos a descrição que vem do banco (Classificação, Consultório, etc)
            title: this.formatarExibicaoPonto(g),
            value: g.id,
          }))
        }
      } catch (e) {
        console.error('Erro ao carregar pontos de atendimento:', e)
        this.guiches = []
      } finally {
        this.carregandoGuiches = false
      }
    },
  },

  mounted() {
    this.getUsuarioLogado()
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
