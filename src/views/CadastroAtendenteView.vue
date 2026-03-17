<template>
  <div class="flex min-h-screen bg-[#f8f9fd] font-sans text-[#2d3748]">
    <AdminConfig />

    <main class="flex-1">
      <header
        class="flex justify-between bg-white border-b border-black items-center px-4 mb-5 py-4"
      >
        <div class="text-[13px] font-bold text-gray-400">
          Administração / <span class="text-gray-900">Gestão de Atendentes</span>
        </div>
      </header>
      <div class="max-w px-4 mx-auto">
        <div class="flex justify-between items-end mb-10">
          <div>
            <h2 class="text-gray-500 text-xs font-bold uppercase tracking-[0.2em]">
              Controle de acesso
            </h2>
          </div>

          <button
            @click="openModal()"
            class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-xs font-bold uppercase transition-all shadow-sm flex items-center gap-2"
          >
            <i class="pi pi-plus"></i>
            Novo Registro
          </button>
        </div>

        <div class="bg-white rounded-[12px] shadow-sm border border-gray-100 overflow-hidden">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr
                class="bg-gray-50/50 text-gray-400 text-[10px] font-black uppercase tracking-[0.15em] border-b border-gray-50"
              >
                <th class="px-6 py-5 text-center w-20">Editar</th>
                <th class="px-6 py-5">Atendente</th>
                <th class="px-6 py-5">Email / Serviço</th>
                <th class="px-6 py-5 text-center">Situação</th>
                <th class="px-6 py-5">Data/Hora</th>
                <th class="px-6 py-5 text-right">Ações</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-50">
              <tr
                v-for="item in lista"
                :key="item.id"
                class="hover:bg-blue-50/30 transition-colors group"
              >
                <td class="px-6 py-4 text-center">
                  <button
                    @click="openModal(item)"
                    class="w-8 h-8 rounded-lg bg-gray-50 text-emerald-500 hover:bg-emerald-500 hover:text-white transition-all flex items-center justify-center"
                  >
                    <i class="pi pi-pencil text-xs"></i>
                  </button>
                </td>

                <!-- NOME -->
                <td class="px-6 py-4">
                  <div class="font-bold text-sm text-[#1e3a8a]">
                    {{ item.nome }}
                  </div>
                </td>

                <!-- EMAIL -->
                <td class="px-6 py-4 text-sm text-gray-500">
                  {{ item.email }}
                </td>

                <!-- PERFIL -->
                <td class="px-6 py-4 text-center">
                  <span
                    class="px-3 py-1 rounded-full text-[9px] font-black uppercase border"
                    :class="
                      item.perfil === 'ADMIN'
                        ? 'bg-purple-50 text-purple-600 border-purple-100'
                        : 'bg-blue-50 text-blue-600 border-blue-100'
                    "
                  >
                    {{ item.perfil }}
                  </span>
                </td>

                <!-- DATA -->
                <td class="px-6 py-4 text-gray-400 text-[11px] font-medium">
                  {{ formatarData(item.criadoEm) }}
                </td>

                <td>{{ item.secretariaPrincipal?.nome }}</td>

                <td>
                  {{ item.setores?.map((s) => s.nome).join(', ') }}
                </td>

                <td class="px-6 py-4 text-right">
                  <button
                    @click="excluir(item.id)"
                    class="text-red-400 hover:text-red-600 text-[10px] font-black uppercase transition-all px-3"
                  >
                    Excluir
                  </button>
                </td>
              </tr>
              <tr v-if="lista.length === 0">
                <td colspan="6" class="px-6 py-20 text-center">
                  <i class="pi pi-inbox text-4xl text-gray-100 mb-4 block"></i>
                  <p class="text-gray-400 text-sm font-bold uppercase">
                    Nenhum registro encontrado
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
          class="bg-white rounded-[12px] shadow-2xl w-full max-w-3xl overflow-hidden animate-in fade-in zoom-in duration-300"
        >
          <div class="p-8">
            <h2
              class="text-xl font-black mb-6 text-[#1e3a8a] tracking-tighter border-b border-gray-50 pb-4"
            >
              {{ form.id ? 'Editar Registro' : 'Novo Registro' }}
            </h2>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div class="md:col-span-2">
                <label
                  class="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2"
                >
                  Nome do Usuário
                </label>
                <input
                  v-model="form.usuario"
                  type="text"
                  class="w-full bg-gray-5 border rounded-[6px] p-3 text-sm focus:ring-blue-500 outline-none transition-all"
                />
              </div>

              <div>
                <label
                  class="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2"
                >
                  CPF
                </label>
                <input
                  v-model="form.cpf"
                  type="text"
                  placeholder="000.000.000-00"
                  class="w-full bg-gray-5 border rounded-[6px] p-3 text-sm focus:ring-blue-500 outline-none transition-all"
                />
              </div>

              <div>
                <label
                  class="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2"
                >
                  Contato
                </label>
                <input
                  v-model="form.contato"
                  type="text"
                  placeholder="(00) 00000-0000"
                  class="w-full bg-gray-5 border rounded-[6px] p-3 text-sm focus:ring-blue-500 outline-none transition-all"
                />
              </div>

              <div>
                <label
                  class="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2"
                >
                  E-mail
                </label>
                <input
                  v-model="form.email"
                  type="email"
                  class="w-full bg-gray-5 border rounded-[6px] p-3 text-sm focus:ring-blue-500 outline-none transition-all"
                />
              </div>

              <div>
                <label
                  class="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2"
                >
                  Perfil
                </label>
                <select
                  v-model="form.perfil"
                  class="w-full bg-gray-5 border rounded-[6px] p-3 text-sm focus:ring-blue-500 outline-none transition-all"
                >
                  <option value="ATENDENTE">Atendente</option>

                  <option
                    v-if="usuarioLogadoPerfil === 'SUPER_ADMIN' || form.perfil === 'ADMIN'"
                    value="ADMIN"
                  >
                    Administrador
                  </option>

                  <option v-if="usuarioLogadoPerfil === 'SUPER_ADMIN'" value="SUPER_ADMIN">
                    Super Administrador
                  </option>
                </select>
              </div>

              <div>
                <label
                  class="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2"
                >
                  Situação
                </label>
                <select
                  v-model="form.status"
                  class="w-full bg-gray-5 border rounded-[6px] p-3 text-sm focus:ring-blue-500 outline-none transition-all"
                >
                  <option value="Ativo">Ativo</option>
                  <option value="Desativado">Desativado</option>
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
  components: {
    AdminConfig,
  },

  data: () => ({
    showModal: false,
    lista: [],
    usuarioLogadoPerfil: '', // Armazenar o perfil de quem está logado
    form: {
      id: null,
      usuario: '',
      email: '',
      perfil: 'ATENDENTE', // Adicionei perfil aqui
      status: 'Ativo',
    },
  }),

  computed: {},

  methods: {
    formatarData(data) {
      if (!data) return '-'

      return new Date(data).toLocaleString('pt-BR')
    },

    async carregarUsuarios() {
      try {
        const token = localStorage.getItem('token')

        const userRes = await axios.get('http://localhost:8080/gerenciador/usuario-logado', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        const usuario = userRes.data
        this.usuarioLogadoPerfil = usuario.perfil
        const secretariaId = usuario.secretarias[0]?.id
        const res = await axios.get(
          `http://localhost:8080/gerenciador/secretaria/${secretariaId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        )

        this.lista = res.data
      } catch (error) {
        console.error('Erro:', error)
      }
    },

    openModal(item = null) {
      if (item) {
        this.form = { ...item }
      } else {
        this.form = { id: null, usuario: '', email: '', status: 'Ativo' }
      }
      this.showModal = true
    },

    save() {
      console.log('Salvando dados:', this.form)
      // Aqui você integraria com sua API (ex: AtendenteApi.salvar(this.form))
      this.showModal = false
    },

    chamar(id) {
      alert(`Chamando usuário ID: ${id}`)
    },

    getStatusClass(status) {
      switch (status) {
        case 'Desativado':
          return 'bg-emerald-50 text-emerald-600 border-emerald-100'
        case 'Ativo':
          return 'bg-red-50 text-red-600 border-red-100'
        default:
          return 'bg-gray-50 text-gray-600 border-gray-200'
      }
    },
  },

  mounted() {
    this.carregarUsuarios()
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
