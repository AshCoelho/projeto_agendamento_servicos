<template>
  <div class="flex min-h-screen bg-[#f8f9fd] font-sans text-[#2d3748]">
    <AdminConfig />

    <main class="flex-1">
      <header
        class="flex justify-between bg-white border-b border-black items-center px-4 mb-5 py-4"
      >
        <div class="text-[13px] font-bold text-gray-400">
          Administração / <span class="text-gray-900">Gestão de Setores</span>
        </div>
      </header>

      <div class="max-w px-6 mx-auto">
        <div class="flex justify-between items-end mb-10">
          <div>
            <h2 class="text-gray-500 text-xs font-bold uppercase tracking-[0.2em]">
              Organização da Empresa
            </h2>
          </div>
          <button
            @click="openModal()"
            class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-xs font-bold uppercase transition-all shadow-sm flex items-center gap-2"
          >
            <i class="pi pi-plus"></i>
            Novo Setor
          </button>
        </div>

        <div class="bg-white rounded-[12px] shadow-sm border border-gray-100 overflow-hidden">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr
                class="bg-gray-50/50 text-gray-400 text-[10px] font-black uppercase tracking-[0.15em] border-b border-gray-50"
              >
                <th class="px-6 py-5 text-center w-20">Editar</th>
                <th class="px-6 py-5">Nome do Setor</th>
                <th class="px-6 py-5">Descrição</th>
                <th class="px-6 py-5">Secretaria</th>
                <th class="px-6 py-5">Endereço</th>
                <th class="px-6 py-5 text-right">Ações</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-50">
              <tr
                v-for="setor in lista"
                :key="setor.id"
                class="hover:bg-blue-50/30 transition-colors group"
              >
                <td class="px-6 py-4 text-center">
                  <button
                    @click="openModal(setor)"
                    class="w-8 h-8 rounded-lg bg-gray-50 text-emerald-500 hover:bg-emerald-500 hover:text-white transition-all flex items-center justify-center"
                  >
                    <i class="pi pi-pencil text-xs"></i>
                  </button>
                </td>
                <td class="px-6 py-4">
                  <div class="font-bold text-sm text-[#1e3a8a]">{{ setor.nome }}</div>
                </td>
                <td class="px-6 py-4 text-sm text-gray-500">
                  {{ setor.descricao || 'Sem descrição' }}
                </td>
                <td class="px-6 py-4 text-sm text-gray-500">
                  {{ setor.secretaria?.nome }}
                </td>
                <td class="px-6 py-4 text-sm text-gray-500">
                  {{ formatarEndereco(setor.endereco) }}
                </td>
                <td class="px-6 py-4 text-right">
                  <button
                    @click="abrirConfirmacao(setor)"
                    class="text-red-400 hover:text-red-600 text-[10px] font-black uppercase transition-all px-3"
                  >
                    Excluir
                  </button>
                </td>
              </tr>
              <tr v-if="lista.length === 0">
                <td colspan="5" class="px-6 py-20 text-center">
                  <i class="pi pi-briefcase text-4xl text-gray-100 mb-4 block"></i>
                  <p class="text-gray-400 text-sm font-bold uppercase">Nenhum setor cadastrado</p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </main>

    <Teleport to="body">
      <div
        v-if="showModal"
        class="fixed inset-0 z-[100] flex items-center justify-center bg-[#1e3a8a]/20 backdrop-blur-md p-4"
      >
        <div class="bg-white rounded-[15px] shadow-2xl w-full max-w-md overflow-hidden animate-in">
          <div class="p-8">
            <h2
              class="text-xl font-black mb-6 text-[#1e3a8a] tracking-tighter border-b border-gray-50 pb-4"
            >
              {{ form.id ? 'Editar Setor' : 'Novo Setor' }}
            </h2>
            <div class="space-y-5">
              <div>
                <label
                  class="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2"
                >
                  Nome do Setor
                </label>
                <input
                  v-model="form.nome"
                  type="text"
                  placeholder="Ex: Recursos Humanos"
                  class="w-full border rounded-[6px] p-3 text-sm focus:ring-blue-500 outline-none transition-all"
                />
              </div>

              <div>
                <label
                  class="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2"
                >
                  Descrição
                </label>
                <input
                  v-model="form.descricao"
                  type="text"
                  placeholder="Descrição do setor"
                  class="w-full border rounded-[6px] p-3 text-sm focus:ring-blue-500 outline-none transition-all"
                />
              </div>

              <!--Select de Secretaria com v-model e options -->
              <div>
                <label
                  class="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2"
                >
                  Secretaria
                </label>
                <select
                  v-model="form.secretariaId"
                  class="w-full border rounded-[6px] p-3 text-sm focus:ring-blue-500 outline-none"
                >
                  <option value="" disabled>Selecione uma secretaria</option>
                  <option v-for="sec in secretarias" :key="sec.id" :value="sec.id">
                    {{ sec.nome }}
                  </option>
                </select>
              </div>

              <!-- ✅ Select de Endereço com v-model e options -->
              <div>
                <label
                  class="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2"
                >
                  Endereço
                </label>
                <select
                  v-model="form.enderecoId"
                  class="w-full border rounded-[6px] p-3 text-sm focus:ring-blue-500 outline-none transition-all"
                >
                  <option value="" disabled>Selecione um endereço</option>
                  <option v-for="end in enderecos" :key="end.id" :value="end.id">
                    {{ end.logradouro || end.nome }}
                  </option>
                </select>
              </div>
            </div>
          </div>

          <div class="p-6 flex justify-end gap-3">
            <button
              @click="showModal = false"
              class="text-gray-400 font-black text-[13px] px-6 py-2 hover:text-gray-600 transition-colors"
            >
              Cancelar
            </button>
            <button
              @click="save"
              class="bg-[#2563eb] text-white px-8 py-3 rounded-[5px] font-semibold text-[13px] shadow-lg shadow-blue-200 hover:scale-105 active:scale-95 transition-all"
            >
              Salvar
            </button>
          </div>
        </div>
      </div>
    </Teleport>

    <Teleport to="body">
      <div
        v-if="confirmDialog"
        class="fixed inset-0 z-[110] flex items-center justify-center bg-black/40 backdrop-blur-sm"
      >
        <div class="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 animate-in">
          
          <h3 class="text-lg font-bold text-gray-800 mb-4">
            Confirmar exclusão
          </h3>

          <p class="text-sm text-gray-500 mb-6">
            Deseja realmente excluir o setor
            <strong class="text-red-600">
              {{ setorParaExcluir?.nome }}
            </strong>?
          </p>

          <div class="flex justify-end gap-3">
            <button
              @click="confirmDialog = false"
              class="px-4 py-2 text-gray-500 hover:text-gray-700 font-semibold"
            >
              Cancelar
            </button>

            <button
              @click="confirmarExclusao"
              :disabled="loadingExcluir"
              class="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-lg font-semibold shadow disabled:opacity-50"
            >
              {{ loadingExcluir ? 'Excluindo...' : 'Excluir' }}
            </button>
          </div>

        </div>
      </div>
    </Teleport>

  </div>
</template>

<script>
import AdminConfig from '@/components/AdminConfig.vue'
import 'primeicons/primeicons.css'
// Importamos a sua instância centralizada que já tem a baseURL e Interceptors
import api from '@/services/api'
import { EnderecoService } from '@/services/endereco.service'
import { SetorService } from '@/services/setor.service'
import { UsuarioService } from '@/services/usuario.service'
import { SecretariaService } from '@/services/secretaria.service'

export default {
  components: { AdminConfig },

  data: () => ({
    lista: [],
    secretarias: [],
    enderecos: [],
    showModal: false,
    usuarioCompleto: null,
    confirmDialog: false,        
    setorParaExcluir: null, 
    form: {
      id: null,
      nome: '',
      descricao: '',
      secretariaId: null,
      enderecoId: null,
    },
  }),

  methods: {
    // Agora o endereço é formatado com segurança para o template
    formatarEndereco(endereco) {
      if (!endereco || typeof endereco !== 'object') {
        return 'Sem endereço'
      }
      const e = endereco
      return `${e.logradouro ?? ''}, ${e.numero ?? ''} - ${e.bairro ?? ''}, ${e.cidade ?? ''} - ${e.uf ?? ''} | CEP: ${e.cep ?? ''}`
    },

    async inicializar() {
      try {
        const resUser = await UsuarioService.getUsuarioLogado()
        this.usuarioCompleto = resUser.data

        this.secretarias = this.usuarioCompleto.secretarias ?? []

        if (this.secretarias.length > 0) {
          await this.carregarTodosSetores()
        }
      } catch (error) {
        console.error('Erro ao inicializar:', error)
      }
    },

    async carregarEnderecos() {
      try {
        const res = await EnderecoService.listarTodos()
        this.enderecos = res.data
      } catch (error) {
        console.warn('Erro ao carregar endereços:', error)
      }
    },

    async carregarTodosSetores() {
      try {
        this.lista = []

        const promises = this.secretarias.map(sec =>
          SetorService.listarPorSecretaria(sec.id)
        )

        const resultados = await Promise.all(promises)

        this.lista = resultados.flatMap(res => res.data)

      } catch (error) {
        console.error('Erro ao carregar setores:', error)
      }
    },

    async carregarSecretarias() {
      try {
        const res = await SecretariaService.listarTodas()
        this.secretarias = res.data
      } catch (error) {
        console.error('Erro ao carregar lista de secretarias:', error)
      }
    },

    openModal(item = null) {
      if (item) {
        this.form = {
          id: item.id,
          nome: item.nome,
          descricao: item.descricao,
          secretariaId: item.secretaria?.id || '', // Use string vazia em vez de null
          enderecoId: item.endereco?.Id || item.endereco?.id || '',    // Use string vazia em vez de null
        }
      } else {
        this.form = {
          id: null,
          nome: '',
          descricao: '',
          secretariaId: this.secretarias.length === 1 ? this.secretarias[0].id : '',
          enderecoId: '',
        }
      }
      
      this.carregarEnderecos()
      this.showModal = true
    },

    getSecretariaId() {
      // Pega a primeira secretaria vinculada ao usuário logado
      return this.usuarioCompleto?.secretarias?.[0]?.id || null
    },

    abrirConfirmacao(setor) {
      this.setorParaExcluir = setor
      this.confirmDialog = true
    },

    async save() {
      try {
        if (!this.form.secretariaId) {
          alert('Selecione uma secretaria')
          return
        }

        if (this.form.id) {
          await SetorService.atualizar(this.form.id, this.form)
        } else {
          await SetorService.criar(this.form)
        }

        this.showModal = false
        await this.carregarTodosSetores()

      } catch (error) {
        console.error(error)
        alert('Erro ao salvar')
      }
    },

    async confirmarExclusao() {
      try {
        await SetorService.excluir(this.setorParaExcluir.id)

        this.confirmDialog = false
        this.setorParaExcluir = null

        await this.carregarTodosSetores()

      } catch (error) {
        console.error('Erro ao excluir setor:', error)
        alert('Erro ao excluir setor.')
      }
    },
  },

  mounted() {
    this.inicializar()
  },
}
</script>

<style scoped>
.animate-in {
  animation: fadeIn 0.2s ease-out;
}
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
</style>
