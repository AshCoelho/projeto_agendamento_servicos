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
                  placeholder="Nome completo"
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
                  autocomplete="off"
                  placeholder="email@dominio.com"
                  class="w-full bg-gray-5 border rounded-[6px] p-3 text-sm focus:ring-blue-500 outline-none transition-all"
                />
              </div>

              <div>
                <label
                  class="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2"
                >
                  Senha
                </label>
                <input
                  v-model="form.senha"
                  type="password"
                  placeholder="••••••••"
                  autocomplete="new-password"
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
                  Setor
                </label>
                <select>
                  <option>
                    deve aparecer os setores relacionado a secretaria do usuario logado
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
import api from '@/services/api' // seu axios configurado

export default {
  name: 'GestaoAtendentes',
  components: { AdminConfig },

  data() {
    return {
      lista: [],
      showModal: false,
      usuarioLogadoPerfil: localStorage.getItem('perfil') || '',
      usuarioLogadoSecretariaId: localStorage.getItem('secretariaId'),
      form: {
        id: null,
        usuario: '',
        cpf: '',
        contato: '',
        email: '',
        senha: '',
        perfil: 'ATENDENTE',
        status: 'Ativo',
        setorId: null,
      },
    }
  },

  mounted() {
    this.carregar()
    this
  },

  methods: {
    async carregarSetores() {
      if (!this.usuarioLogadoSecretariaId) return

      try {
        // Chamada para o endpoint que você mostrou no controller
        const res = await api.get(`/secretarias/${this.usuarioLogadoSecretariaId}/setores`)
        this.setoresDaSecretaria = res.data
      } catch (e) {
        console.error('Erro ao buscar setores da secretaria:', e)
      }
    },

    async carregar() {
      try {
        const res = await api.get('/gerenciador')
        this.lista = res.data
      } catch (e) {
        console.error('Erro ao carregar:', e)
      }
    },

    openModal(item = null) {
      if (item) {
        // ✅ Editar — preenche com os dados do item
        this.form = {
          id: item.id,
          usuario: item.nome,
          cpf: item.cpf,
          contato: item.contato || '',
          email: item.email,
          senha: '',
          perfil: item.perfil,
          status: item.status || 'Ativo',
        }
      } else {
        // ✅ Novo — form completamente vazio
        this.form = {
          id: null,
          usuario: '',
          cpf: '',
          contato: '',
          email: '',
          senha: '', // 👈 estava faltando no seu else
          perfil: 'ATENDENTE',
          status: 'Ativo',
        }
      }
      this.showModal = true
    },

    async save() {
      try {
        const payload = {
          nome: this.form.usuario,
          cpf: this.form.cpf,
          contato: this.form.contato,
          email: this.form.email,
          senha: this.form.senha,
          perfil: this.form.perfil,
          status: this.form.status,
        }
        if (this.form.senha) {
          payload.senha = this.form.senha
        }
        if (this.form.id) {
          // PUT /gerenciador/{id} — Editar
          await api.put(`/gerenciador/${this.form.id}`, payload)
        } else {
          // POST /gerenciador — Criar
          await api.post('/gerenciador', payload)
        }

        this.showModal = false
        await this.carregar()
      } catch (e) {
        console.error('Erro ao salvar:', e.response?.data || e.message)
        alert(e.response?.data?.mensagem || 'Erro ao salvar!')
      }
    },

    async excluir(id) {
      if (!confirm('Deseja excluir este registro?')) return
      try {
        await api.delete(`/gerenciador/${id}`)
        await this.carregar()
      } catch (e) {
        console.error('Erro ao excluir:', e)
      }
    },

    formatarData(data) {
      if (!data) return '—'
      return new Date(data).toLocaleString('pt-BR')
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
