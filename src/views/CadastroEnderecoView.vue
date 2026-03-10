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
                <th class="px-6 py-5">Logradouro / CEP</th>
                <th class="px-6 py-5">Bairro / Cidade</th>
                <th class="px-6 py-5">Status</th>
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
                  <div class="flex items-center gap-3">
                    <div class="leading-tight">
                      <div class="font-bold text-sm text-[#1e3a8a]">
                        {{ endereco.logradouro }}, {{ endereco.numero }}
                      </div>
                      <div class="text-[10px] text-gray-400 font-bold uppercase tracking-tight">
                        {{ endereco.cep }}
                      </div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4">
                  <div class="text-sm text-gray-600 font-medium">{{ endereco.bairro }}</div>
                  <div class="text-[11px] text-gray-400">
                    {{ endereco.cidade }} - {{ endereco.uf }}
                  </div>
                </td>

                <td class="px-6 py-4 text-center">
                  <span
                    :class="getStatusClass(endereco.status)"
                    class="px-3 py-1 rounded-full text-[9px] font-black uppercase border tracking-tighter"
                  >
                    {{ endereco.status }}
                  </span>
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
                <td colspan="6" class="px-6 py-20 text-center">
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
        <div class="bg-white rounded-[15px] shadow-2xl w-full max-w-lg overflow-hidden animate-in">
          <div class="p-8">
            <h2
              class="text-xl font-black mb-6 text-[#1e3a8a] tracking-tighter border-b border-gray-50 pb-4"
            >
              {{ form.id ? 'Editar Endereço' : 'Novo Endereço' }}
            </h2>

            <div class="grid grid-cols-2 gap-5">
              <div class="col-span-2">
                <label
                  class="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2"
                  >Logradouro</label
                >
                <input
                  v-model="form.logradouro"
                  type="text"
                  placeholder="Rua, Avenida, etc..."
                  class="w-full bg-gray-50 border-none rounded-[12px] p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
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
                  class="w-full bg-gray-50 border-none rounded-[12px] p-3 text-sm outline-none focus:ring-2 focus:ring-blue-500"
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
                  class="w-full bg-gray-50 border-none rounded-[12px] p-3 text-sm outline-none focus:ring-2 focus:ring-blue-500"
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
                  class="w-full bg-gray-50 border-none rounded-[12px] p-3 text-sm outline-none focus:ring-2 focus:ring-blue-500"
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
                  class="w-full bg-gray-50 border-none rounded-[12px] p-3 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label
                  class="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2"
                  >Status</label
                >
                <select
                  v-model="form.status"
                  class="w-full bg-gray-50 border-none rounded-[12px] p-3 text-sm outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
                >
                  <option value="ATIVO">ATIVO</option>
                  <option value="INATIVO">INATIVO</option>
                </select>
              </div>
            </div>
          </div>

          <div class="bg-gray-50 p-6 flex justify-end gap-3 border-t border-gray-100">
            <button
              @click="showModal = false"
              class="text-gray-400 font-black uppercase text-[10px] px-6 py-2 hover:text-gray-600 transition-colors"
            >
              Cancelar
            </button>
            <button
              @click="save"
              class="bg-[#2563eb] text-white px-8 py-3 rounded-[8px] font-black uppercase text-[10px] shadow-lg shadow-blue-200 hover:scale-105 active:scale-95 transition-all"
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

export default {
  components: { AdminConfig },
  data: () => ({
    showModal: false,
    lista: [
      {
        id: 1,
        logradouro: 'Avenida Brasil',
        numero: '1500',
        cep: '01234-567',
        bairro: 'Centro',
        cidade: 'São Luís',
        uf: 'MA',
        status: 'ATIVO',
      },
    ],
    form: {
      id: null,
      logradouro: '',
      numero: '',
      cep: '',
      bairro: '',
      cidade: '',
      uf: 'MA',
      status: 'ATIVO',
    },
  }),
  methods: {
    openModal(item = null) {
      if (item) {
        this.form = { ...item }
      } else {
        this.form = {
          id: null,
          logradouro: '',
          numero: '',
          cep: '',
          bairro: '',
          cidade: '',
          uf: 'MA',
          status: 'ATIVO',
        }
      }
      this.showModal = true
    },
    save() {
      if (this.form.id) {
        const index = this.lista.findIndex((i) => i.id === this.form.id)
        this.lista[index] = { ...this.form }
      } else {
        this.lista.push({
          ...this.form,
          id: this.lista.length + 1,
        })
      }
      this.showModal = false
    },
    excluir(id) {
      if (confirm('Deseja excluir este endereço?')) {
        this.lista = this.lista.filter((i) => i.id !== id)
      }
    },
    getStatusClass(status) {
      return status === 'ATIVO'
        ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
        : 'bg-red-50 text-red-600 border-red-100'
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
