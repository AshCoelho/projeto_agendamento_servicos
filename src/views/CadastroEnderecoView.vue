<template>
  <div class="flex min-h-screen bg-[#f8f9fd] font-sans text-[#2d3748]">
    <AdminConfig />

    <main class="flex-1">
      <header
        class="flex justify-between bg-white border-b border-black items-center px-4 mb-5 py-4"
      >
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
              <tr
                class="bg-gray-50/50 text-gray-400 text-[10px] font-black uppercase tracking-[0.15em] border-b border-gray-50"
              >
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

                <td class="px-6 py-4">
                  <div class="font-bold text-sm text-[#1e3a8a]">
                    {{ endereco.logradouro }}
                  </div>
                </td>

                <td class="px-6 py-4 text-sm text-gray-600">
                  {{ endereco.complemento || '-' }}
                </td>

                <td class="px-6 py-4 text-sm text-gray-600">
                  {{ endereco.bairro }}
                </td>

                <td class="px-6 py-4 text-sm text-gray-600">
                  {{ endereco.cep }}
                </td>

                <td class="px-6 py-4 text-sm text-gray-600">
                  {{ endereco.cidade }} - {{ endereco.uf }}
                </td>

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
                  <p class="text-gray-400 text-sm font-bold uppercase">
                    Nenhum endereço cadastrado
                  </p>
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
        <div
          class="bg-white rounded-[12px] shadow-2xl w-full max-w-4xl overflow-hidden animate-in fade-in zoom-in duration-300"
        >
          <div class="p-8">
            <h2 class="text-xl font-black mb-6 text-[#1e3a8a] border-b border-gray-50 pb-4">
              {{ form.id ? 'Editar Endereço' : 'Novo Endereço' }}
            </h2>

            <div class="grid grid-cols-2 gap-5">
              <div class="col-span-2">
                <label
                  class="block text-[10px] rounded-[14px] font-black text-gray-400 uppercase mb-2"
                  >Logradouro</label
                >
                <input
                  v-model="form.logradouro"
                  type="text"
                  placeholder="Rua, Avenida, etc..."
                  class="w-full bg-gray-5 border rounded-[6px] p-3 text-sm focus:ring-blue-500 outline-none transition-all"
                  required
                />
              </div>

              <div class="col-span-2">
                <label class="block text-[10px] font-black text-gray-400 uppercase mb-2"
                  >Complemento</label
                >
                <input
                  v-model="form.complemento"
                  type="text"
                  class="w-full bg-gray-5 border rounded-[6px] p-3 text-sm focus:ring-blue-500 outline-none transition-all"
                  required
                />
              </div>

              <div>
                <label
                  class="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2"
                  >Número</label
                >
                <input
                  v-model="form.numero"
                  type="text"
                  class="w-full bg-gray-5 border rounded-[6px] rounded-[12px] p-3 text-sm outline-none focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label
                  class="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2"
                  >CEP</label
                >
                <input
                  v-model="form.cep"
                  type="text"
                  placeholder="00000-000"
                  class="w-full bg-gray-5 border rounded-[6px] rounded-[12px] p-3 text-sm outline-none focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label
                  class="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2"
                  >UF</label
                >
                <input
                  v-model="form.uf"
                  type="text"
                  class="w-full bg-gray-5 border rounded-[6px] p-3 text-sm outline-none focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label
                  class="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2"
                  >Bairro</label
                >
                <input
                  v-model="form.bairro"
                  type="text"
                  class="w-full bg-gray-5 border rounded-[6px] p-3 text-sm outline-none focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label
                  class="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2"
                  >Cidade</label
                >
                <input
                  v-model="form.cidade"
                  type="text"
                  class="w-full bg-gray-5 border rounded-[6px] p-3 text-sm outline-none focus:ring-blue-500"
                  required
                />
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
              Salvar Endereço
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

export default {
  components: { AdminConfig },

  data() {
    return {
      showModal: false,
      lista: [],

      form: {
        id: null,
        logradouro: '',
        numero: '',
        cep: '',
        bairro: '',
        cidade: '',
        uf: '',
        complemento: '',
      },
    }
  },

  mounted() {
    this.carregarEnderecos()
  },

  methods: {
    async carregarEnderecos() {
      try {
        const res = await axios.get('http://localhost:8080/enderecos/listar-todos')
        this.lista = res.data
      } catch (err) {
        console.error('Erro ao carregar endereços', err)
      }
    },

    openModal(item = null) {
      if (item) {
        this.form.id = item.id
        this.form.logradouro = item.logradouro || ''
        this.form.numero = item.numero || ''
        this.form.cep = item.cep || ''
        this.form.bairro = item.bairro || ''
        this.form.cidade = item.cidade || ''
        this.form.uf = item.uf || ''
        this.form.complemento = item.complemento || ''
      } else {
        this.form.id = null
        this.form.logradouro = ''
        this.form.numero = ''
        this.form.cep = ''
        this.form.bairro = ''
        this.form.cidade = ''
        this.form.uf = ''
        this.form.complemento = ''
      }

      this.showModal = true
    },

    async save() {
      try {
        const payload = {
          logradouro: this.form.logradouro,
          numero: this.form.numero,
          bairro: this.form.bairro,
          cidade: this.form.cidade,
          uf: this.form.uf,
          cep: this.form.cep,
          complemento: this.form.complemento,
        }

        if (this.form.id) {
          await axios.put(`http://localhost:8080/enderecos/${this.form.id}`, payload)
        } else {
          await axios.post('http://localhost:8080/enderecos', payload)
        }

        this.showModal = false
        await this.carregarEnderecos()
      } catch (err) {
        console.error('Erro ao salvar endereço', err)
      }
    },

    async excluir(id) {
      if (!confirm('Deseja excluir este endereço?')) return

      try {
        await axios.delete(`http://localhost:8080/enderecos/${id}`)

        this.carregarEnderecos()
      } catch (err) {
        console.error('Erro ao excluir', err)
      }
    },
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
