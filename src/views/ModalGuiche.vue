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
    carregandoSetores: false, 
    salvando: false 
  }),

  methods: {

    formatarNomeSaude(numero) {
      // 1. Forçamos a conversão para número para evitar conflito de String vs Number
      const num = Number(numero);

      const nomes = {
        1: "Classificação 01",
        2: "Classificação 02",
        3: "Recepção",
        4: "Consultório 01",
        5: "Consultório 02",
      };

      // 2. Verificamos se o número existe nas chaves do objeto
      if (nomes[num]) {
        return nomes[num];
      }

      // 3. Fallback: Se for Saúde mas não estiver no mapa (ex: guichê 7, 8...)
      return `Consultório ${String(num).padStart(2, '0')}`;
    },

    getUsuarioLogado() {
      const userData = localStorage.getItem('usuario')
      const token = localStorage.getItem('token')
      
      if (userData && token) {
        try {
          this.usuario = JSON.parse(userData)
          
          // Força a re-renderização inicial (garante que os selects estão limpos ao abrir a tela)
          this.selectedGuiche = null
          this.selectedSetor = null
          this.selectedSecretaria = null
          
          // Preenche a primeira lista
          this.preencherSecretarias()
        } catch (e) {
          // Se o JSON do usuário estiver corrompido, limpa tudo e desloga com hard reset
          console.error("Dados do usuário corrompidos no storage", e)
          localStorage.clear()
          window.location.href = '/'
        }
      } else {
        // Se não tem dados, chuta pro login com hard reset
        localStorage.clear()
        window.location.href = '/'
      }
    },

    async updateGerenciador() {
  try {
    if (!this.selectedSetor || !this.selectedSecretaria || !this.selectedGuiche) {
      alert('Por favor, selecione a secretaria, o setor e o guichê.')
      return
    }

    this.salvando = true 

    // 🟢 CAPTURAR O NOME DA SECRETARIA PARA O LOCALSTORAGE
    const secretariaEncontrada = this.secretarias.find(s => s.value === this.selectedSecretaria);
    if (secretariaEncontrada) {
      localStorage.setItem('secretariaNomeAtiva', secretariaEncontrada.title);
    }

    // 🟢 CAPTURAR O NÚMERO DO GUICHÊ (OPCIONAL, MAS AJUDA NO FEEDBACK)
    const guicheEncontrado = this.guiches.find(g => g.value === this.selectedGuiche);
    // Nota: salvamos o valor bruto (ex: 4) para a função de mapeamento da outra tela funcionar
    const numeroOriginal = this.guichesOriginal?.find(g => g.id === this.selectedGuiche)?.numero;

    const payload = { guicheId: this.selectedGuiche }

    await api.patch(`/gerenciador/${this.usuario.id}/guiche`, payload)

    localStorage.setItem('setorTrabalhoId', this.selectedSetor)
    localStorage.setItem('secretariaTrabalhoId', this.selectedSecretaria)
    
    // Importante: Guardar o número real do guichê para a lógica de "Consultório 01"
    // Se o seu 'this.usuario' na outra tela carregar do banco, ele pegará o 4 lá.
    localStorage.setItem('guicheTrabalho', this.selectedGuiche)

    this.$router.push('/atendente')
      } catch (e) {
        console.error('Erro ao atualizar guichê:', e)
        
        // Impede que o sistema redirecione o usuário se ele tomou erro do banco (ex: "Guichê ocupado")
        if (e.response && (e.response.status === 401 || e.response.status === 403)) {
            alert("Sua sessão expirou. Faça login novamente.")
            localStorage.clear()
            window.location.href = '/' // 🟢 Hard reset
            return;
        }

        const mensagemErro =
          e.response?.data?.mensagem || e.response?.data || 'Erro ao salvar configurações de guichê'
        alert(typeof mensagemErro === 'string' ? mensagemErro : 'Erro ao selecionar o guichê.')
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
      setTimeout(() => {
        this.setores = this.usuario.setores
          .filter((s) => s.secretariaId === secretariaId) 
          .map((s) => ({ title: s.nome, value: s.id }))
          .sort((a, b) => a.title.localeCompare(b.title))
        this.carregandoSetores = false
      }, 300)
    },

    async buscarGuichesDoSetor(setorId) {
      this.carregandoGuiches = true;
      try {
        const token = localStorage.getItem('token'); 
        const response = await api.get(`/guiches/setor/${setorId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (Array.isArray(response.data)) {
          this.guiches = response.data.map((g) => {
            // Buscamos o nome da secretaria selecionada no seu array de secretarias
            const secretariaAtiva = this.secretarias.find(s => s.value === this.selectedSecretaria);
            const nomeSec = secretariaAtiva ? secretariaAtiva.title.toUpperCase() : '';

            let labelCustomizado = `Guichê ${String(g.numero).padStart(2, '0')}`;

            // Regra de Negócio para SAÚDE
            if (nomeSec.includes("SAÚDE") || nomeSec.includes("SAUDE")) {
              labelCustomizado = this.formatarNomeSaude(g.numero);
            }

            return {
              title: labelCustomizado,
              value: g.id,
            };
          });
        }
      } catch (e) {
        console.error('Erro ao carregar guichês:', e);
        this.guiches = [];
      } finally {
        this.carregandoGuiches = false;
      }
    },
  },

  mounted() {
    // 🟢 Garantimos que a função roda ao montar a tela
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