<template>
  <div class="flex min-h-screen bg-[#f8f9fd] font-sans text-[#2d3748]">
    <AdminConfig />

    <main class="flex-1">
      <header class="flex justify-between bg-white border-b border-black items-center px-4 mb-5 py-4">
        <div class="text-[13px] font-bold text-gray-400">
          Administração / <span class="text-gray-900">Gestão de Endereços</span>
        </div>
      </header>

      <div class="max-w px-6 mx-auto">
        <div class="flex justify-between items-end mb-10">
          <div>
            <h2 class="text-gray-500 text-xs font-bold uppercase tracking-[0.2em] mb-1">
              Localidades e Unidades
            </h2>
          </div>

          <button
            @click="openModal()"
            class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-xs font-bold uppercase transition-all shadow-sm flex items-center gap-2"
          >
            <i class="pi pi-plus"></i>
            Novo Endereço
          </button>
        </div>

        <div class="bg-white rounded-[12px] shadow-sm border border-gray-100 overflow-hidden">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-gray-50/50 text-gray-400 text-[10px] font-black uppercase tracking-[0.15em] border-b border-gray-50">
                <th class="px-6 py-5 text-center w-20">Editar</th>
                <th class="px-6 py-5">Logradouro</th>
                <th class="px-6 py-5">Complemento</th>
                <th class="px-6 py-5">Bairro</th>
                <th class="px-6 py-5">CEP</th>
                <th class="px-6 py-5">Cidade</th>
                <th class="px-6 py-5 text-right">Ações</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-50">
              <tr
                v-for="endereco in lista"
                :key="endereco.id"
                class="hover:bg-blue-50/30 transition-colors group"
              >
                <td class="px-6 py-4 text-center">
                  <button
                    @click="openModal(endereco)"
                    class="w-8 h-8 rounded-lg bg-gray-50 text-emerald-500 hover:bg-emerald-500 hover:text-white transition-all flex items-center justify-center shadow-sm"
                  >
                    <i class="pi pi-pencil text-xs"></i>
                  </button>
                </td>
                <td class="px-6 py-4 font-bold text-sm text-[#1e3a8a]">{{ endereco.logradouro }}</td>
                <td class="px-6 py-4 text-sm text-gray-600">{{ endereco.complemento || '-' }}</td>
                <td class="px-6 py-4 text-sm text-gray-600">{{ endereco.bairro }}</td>
                <td class="px-6 py-4 text-sm text-gray-600">{{ endereco.cep }}</td>
                <td class="px-6 py-4 text-sm text-gray-600">{{ endereco.cidade }} - {{ endereco.uf }}</td>
                <td class="px-6 py-4 text-right">
                  <button
                    @click="excluir(endereco.id)"
                    class="text-red-400 hover:text-red-600 text-[10px] font-black uppercase transition-all px-3"
                  >
                    Excluir
                  </button>
                </td>
              </tr>
              <tr v-if="lista.length === 0">
                <td colspan="7" class="px-6 py-20 text-center">
                  <i class="pi pi-map text-4xl text-gray-100 mb-4 block"></i>
                  <p class="text-gray-400 text-sm font-bold uppercase">Nenhum endereço cadastrado</p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </main>

    <Teleport to="body">
      <div v-if="showModal" class="fixed inset-0 z-[100] flex items-center justify-center bg-[#1e3a8a]/20 backdrop-blur-md p-4">
        <div class="bg-white rounded-[12px] shadow-2xl w-full max-w-4xl overflow-hidden animate-in fade-in zoom-in duration-300">
          <div class="p-8">
            <h2 class="text-xl font-black mb-6 text-[#1e3a8a] border-b border-gray-50 pb-4">
              {{ form.id ? 'Editar Endereço' : 'Novo Endereço' }}
            </h2>

            <div class="grid grid-cols-2 gap-5">
              <div class="col-span-2">
                <label class="block text-[10px] font-black text-gray-400 uppercase mb-2">Logradouro</label>
                <input v-model="form.logradouro" type="text" class="w-full bg-gray-5 border rounded-[6px] p-3 text-sm focus:ring-blue-500 outline-none" required />
              </div>

              <div>
                <label class="block text-[10px] font-black text-gray-400 uppercase mb-2">Complemento</label>
                <input v-model="form.complemento" type="text" class="w-full bg-gray-5 border rounded-[6px] p-3 text-sm focus:ring-blue-500 outline-none" />
              </div>

              <div>
                <label class="block text-[10px] font-black text-gray-400 uppercase mb-2">Número</label>
                <input v-model="form.numero" type="text" class="w-full bg-gray-5 border rounded-[6px] p-3 text-sm outline-none focus:ring-blue-500" required />
              </div>

              <div>
                <label class="block text-[10px] font-black text-gray-400 uppercase mb-2">CEP</label>
                <input v-model="form.cep" type="text" class="w-full bg-gray-5 border rounded-[6px] p-3 text-sm outline-none focus:ring-blue-500" required />
              </div>

              <div>
                <label class="block text-[10px] font-black text-gray-400 uppercase mb-2">UF</label>
                <input v-model="form.uf" type="text" class="w-full bg-gray-5 border rounded-[6px] p-3 text-sm outline-none focus:ring-blue-500" required />
              </div>

              <div>
                <label class="block text-[10px] font-black text-gray-400 uppercase mb-2">Bairro</label>
                <input v-model="form.bairro" type="text" class="w-full bg-gray-5 border rounded-[6px] p-3 text-sm outline-none focus:ring-blue-500" required />
              </div>

              <div>
                <label class="block text-[10px] font-black text-gray-400 uppercase mb-2">Cidade</label>
                <input v-model="form.cidade" type="text" class="w-full bg-gray-5 border rounded-[6px] p-3 text-sm outline-none focus:ring-blue-500" required />
              </div>

              <div>
                <label class="block text-[10px] font-black text-gray-400 uppercase mb-2">Latitude</label>
                <input v-model="form.latitude" type="text" class="w-full bg-gray-5 border rounded-[6px] p-3 text-sm outline-none focus:ring-blue-500" />
              </div>

              <div>
                <label class="block text-[10px] font-black text-gray-400 uppercase mb-2">Longitude</label>
                <input v-model="form.longitude" type="text" class="w-full bg-gray-5 border rounded-[6px] p-3 text-sm outline-none focus:ring-blue-500" />
              </div>
            </div>
          </div>

          <div class="p-6 flex justify-end gap-3">
            <button @click="showModal = false" class="text-gray-400 font-black text-[13px] px-6 py-2 hover:text-gray-600">
              Cancelar
            </button>
            <button @click="save" class="bg-[#2563eb] text-white px-8 py-3 rounded-[5px] font-semibold text-[13px] shadow-lg hover:scale-105 active:scale-95 transition-all">
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
import api from '@/services/api'
import { EnderecoService } from '@/services/endereco.service'
import { SetorService } from '@/services/setor.service'
import { UsuarioService } from '@/services/usuario.service'

export default {
  components: { AdminConfig },
  data: () => ({
    showModal: false,
    lista: [],
    relogio: '--:--:--',
    timer: null,
    usuario: null,
    setorTrabalhoId: null,
    form: {
      id: null,
      logradouro: '',
      numero: '',
      cep: '',
      bairro: '',
      cidade: '',
      uf: '',
      complemento: '',
      latitude: '',
      longitude: '',
    }
  }),

  async mounted() {
    await this.getUsuarioLogado();
    this.carregarEnderecos();
    this.timer = setInterval(() => {
      this.relogio = new Date().toLocaleTimeString('pt-BR');
    }, 1000);
  },

  beforeUnmount() {
    clearInterval(this.timer);
  },

  methods: {
    async getUsuarioLogado() {
  try {
    const { data } = await api.get('/gerenciador/usuario-logado');
    this.usuario = data;
    // Não precisamos mais setar um único setorTrabalhoId aqui 
    // se o objetivo for listar todos os endereços dos setores dele.
  } catch (error) {
    console.error('Erro ao identificar usuário:', error);
  }
},

    async carregarEnderecos() {
      try {
        const { data } = await api.get('/enderecos/listar-todos')
        this.lista = data || []
      } catch (err) {
        console.error('Erro ao carregar endereços:', err)
      }
    },

    openModal(item = null) {
      if (item) {
        this.form = { ...item };
      } else {
        this.form = { id: null, logradouro: '', numero: '', cep: '', bairro: '', cidade: '', uf: '', complemento: '', latitude: '', longitude: '' };
      }
      this.showModal = true;
    },

    async save() {
      try {
        const payload = { ...this.form };
        if (this.form.id) {
          await api.put(`/enderecos/${this.form.id}`, payload);
        } else {
          // Se for novo, talvez precise vincular ao setor no backend?
          await api.post('/enderecos', payload);
        }
        this.showModal = false;
        this.carregarEnderecos();
      } catch (err) {
        console.error('Erro ao salvar:', err);
      }
    },

    async excluir(id) {
      if (!confirm('Excluir este endereço?')) return;
      try {
        await api.delete(`/enderecos/${id}`);
        this.carregarEnderecos();
      } catch (err) {
        console.error('Erro ao excluir:', err);
      }
    }
  }
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
