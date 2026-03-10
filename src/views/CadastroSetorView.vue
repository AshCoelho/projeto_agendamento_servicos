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
                <th class="px-6 py-5">Nome do Setor / ID</th>
                <th class="px-6 py-5">Responsável</th>
                <th class="px-6 py-5 text-center">Status</th>
                <th class="px-6 py-5">Última Atualização</th>
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
                  <div class="flex items-center gap-3">
                    <div class="font-bold text-sm text-[#1e3a8a]">{{ setor.nome }}</div>
                  </div>
                </td>
                <td class="px-6 py-4 text-sm text-gray-500">
                  {{ setor.responsavel }}
                </td>
                <td class="px-6 py-4 text-center">
                  <span
                    :class="getStatusClass(setor.status)"
                    class="px-3 py-1 rounded-full text-[9px] font-black uppercase border tracking-tighter"
                  >
                    {{ setor.status }}
                  </span>
                </td>
                <td class="px-6 py-4 text-gray-400 text-[11px] font-medium">
                  {{ setor.data }}
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
                <td colspan="6" class="px-6 py-20 text-center">
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
                  >Nome do Setor</label
                >
                <input
                  v-model="form.nome"
                  type="text"
                  placeholder="Ex: Recursos Humanos"
                  class="w-full bg-gray-50 border-none rounded-[12px] p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                />
              </div>
              <div>
                <label
                  class="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2"
                  >Responsável / Gestor</label
                >
                <input
                  v-model="form.responsavel"
                  type="text"
                  placeholder="Nome do gestor"
                  class="w-full bg-gray-50 border-none rounded-[12px] p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                />
              </div>
              <div>
                <label
                  class="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2"
                  >Status do Setor</label
                >
                <select
                  v-model="form.status"
                  class="w-full bg-gray-50 border-none rounded-[12px] p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none appearance-none cursor-pointer"
                >
                  <option value="ATIVO">ATIVO</option>
                  <option value="INATIVO">INATIVO</option>
                  <option value="MANUTENÇÃO">MANUTENÇÃO</option>
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
              Confirmar
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
        nome: 'Atendimento ao Cliente',
        responsavel: 'Ana Souza',
        status: 'ATIVO',
        data: '07/03/2026 09:00',
      },
    ],
    form: {
      id: null,
      nome: '',
      responsavel: '',
      status: 'ATIVO',
    },
  }),
  methods: {
    openModal(item = null) {
      if (item) {
        this.form = { ...item }
      } else {
        this.form = { id: null, nome: '', responsavel: '', status: 'ATIVO' }
      }
      this.showModal = true
    },
    save() {
      // Simulação de salvar
      if (this.form.id) {
        const index = this.lista.findIndex((i) => i.id === this.form.id)
        this.lista[index] = { ...this.form, data: new Date().toLocaleString() }
      } else {
        this.lista.push({
          ...this.form,
          id: this.lista.length + 1,
          data: new Date().toLocaleString(),
        })
      }
      this.showModal = false
    },
    excluir(id) {
      if (confirm('Deseja realmente excluir este setor?')) {
        this.lista = this.lista.filter((i) => i.id !== id)
      }
    },
    getStatusClass(status) {
      switch (status) {
        case 'ATIVO':
          return 'bg-emerald-50 text-emerald-600 border-emerald-100'
        case 'INATIVO':
          return 'bg-red-50 text-red-600 border-red-100'
        case 'MANUTENÇÃO':
          return 'bg-amber-50 text-amber-600 border-amber-100'
        default:
          return 'bg-gray-50 text-gray-600 border-gray-200'
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
