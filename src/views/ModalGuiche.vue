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
            />
          </div>
        </div>

        <button
          type="submit"
          :disabled="!selectedSetor || !selectedGuiche || carregando"
          class="w-full bg-gradient-to-r from-[#1d4ed8] to-[#2563eb] text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-200 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-70"
        >
          <span v-if="!carregando">Entrar no Sistema</span>
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
    carregando: false,
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
      if (!this.selectedGuiche) {
        alert("Por favor, selecione um guichê.");
        return;
      }

      this.carregando = true;
      try {
        const payload = { guicheId: this.selectedGuiche };
        const response = await api.patch(`/gerenciador/${this.usuario?.id}/guiche`, payload);

        // SÓ REDIRECIONA SE: Status for 200 E o objeto retornado tiver o guichê (validação dupla)
        if (response.status === 200 && response.data.guiche) {
          localStorage.setItem('guicheTrabalho', this.selectedGuiche);
          localStorage.setItem('setorTrabalhoId', this.selectedSetor);
          localStorage.setItem('secretariaTrabalhoId', this.selectedSecretaria);

          this.$router.push('/atendente');
        } else {
          // Se por um erro bizarro o Java retornou 200 mas guiche null
          alert("⚠️ Erro de sincronização: O guichê não foi atribuído corretamente.");
        }

      } catch (e) {
        console.error('Erro:', e);
        const msgServidor = e.response?.data?.mensagem || "Guichê já ocupado por outro colega.";
        alert("⚠️ BLOQUEIO: " + msgServidor);
        
        // Limpa para não deixar lixo
        this.selectedGuiche = null;
        localStorage.removeItem('guicheTrabalho');
      } finally {
        this.carregando = false;
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
      this.setores = this.usuario.setores
        .filter((s) => s.secretariaId === secretariaId)
        .map((s) => ({ title: s.nome, value: s.id }))
        .sort((a, b) => a.title.localeCompare(b.title))
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
