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
                    @click="excluir(setor.id)"
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

              <!-- ✅ Select de Secretaria com v-model e options -->
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
  </div>
</template>

<script>
import AdminConfig from '@/components/AdminConfig.vue'
import 'primeicons/primeicons.css'
import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:8080',
})

export default {
  components: { AdminConfig },

  data: () => ({
    lista: [],
    secretarias: [], // ✅ lista para popular o select
    enderecos: [], // ✅ lista para popular o select
    showModal: false,
    usuarioCompleto: null,
    form: {
      id: null,
      nome: '',
      descricao: '',
      secretariaId: null,
      enderecoId: null,
    },
  }),

  methods: {
    getToken() {
      const storage = localStorage.getItem('usuario')
      if (!storage) return null
      return JSON.parse(storage).token
    },

    formatarEndereco(endereco) {
      if (!endereco || typeof endereco !== 'object') {
        return 'Sem endereço'
      }

      return `${endereco.logradouro ?? ''}, ${endereco.numero ?? ''} - ${endereco.bairro ?? ''}, ${endereco.cidade ?? ''} - ${endereco.uf ?? ''} | CEP: ${endereco.cep ?? ''}`
    },

    async inicializar() {
      try {
        const token = this.getToken()
        if (!token) return

        const resUser = await api.get('api/gerenciador/usuario-logado', {
          headers: { Authorization: `Bearer ${token}` },
        })

        this.usuarioCompleto = resUser.data

        this.secretarias = this.usuarioCompleto.secretarias ?? []

        const idSecretaria = this.getSecretariaId()
        if (idSecretaria) {
          await this.carregarSetores(idSecretaria)
          // ajuste o endpoint conforme sua API
        } else {
          console.warn('Usuário sem secretaria vinculada.')
        }
      } catch (error) {
        console.error('Erro ao inicializar:', error)
      }
    },

    async carregarEnderecos() {
      try {
        const res = await api.get(`/api/enderecos/listar-todos`)
        this.enderecos = res.data
      } catch (error) {
        console.warn('Erro ao carregar endereços:', error)
      }
    },

    async carregarSetores(secretariaId) {
      try {
        const res = await api.get(`/api/setores/por-secretaria/${secretariaId}`)
        this.lista = res.data
      } catch (error) {
        console.error('Erro ao carregar setores:', error)
      }
    },

    openModal(item = null) {
      if (item) {
        this.form = {
          id: item.id,
          nome: item.nome,
          descricao: item.descricao,
          secretariaId: item.secretaria?.id,
          enderecoId: item.endereco?.id ?? null,
        }
      } else {
        this.form = {
          id: null,
          nome: '',
          descricao: '',
          secretariaId: '',
          enderecoId: null,
        }
      }
      this.carregarSecretarias()
      this.carregarEnderecos()

      this.showModal = true
    },
    async carregarSecretarias() {
      try {
        // Usando o endpoint base do seu SecretariaController
        const res = await api.get('/api/secretarias')
        this.secretarias = res.data
        console.log(res)
      } catch (error) {
        console.error('Erro ao carregar lista de secretarias:', error)
      }
    },
    getSecretariaId() {
      return this.usuarioCompleto?.secretarias?.[0]?.id || null
    },

    async save() {
      try {
        this.form.secretariaId = this.getSecretariaId()

        console.log('Enviando:', this.form)

        if (this.form.id) {
          await api.put(`/api/setores/${this.form.id}`, this.form)
        } else {
          await api.post('/api/setores', this.form)
        }

        this.showModal = false
        await this.carregarSetores(this.getSecretariaId())
      } catch (error) {
        console.error('Erro completo:', error.response?.data || error)
        alert('Erro ao salvar setor.')
      }
    },

    async excluir(id) {
      if (!confirm('Deseja realmente excluir?')) return
      try {
        // ✅ Corrigido: prefixo /api
        await api.delete(`/api/setores/${id}`)
        // ✅ Corrigido: usa getSecretariaId()
        await this.carregarSetores(this.getSecretariaId())
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
