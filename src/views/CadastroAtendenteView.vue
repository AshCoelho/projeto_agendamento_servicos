<template>
  <div class="flex min-h-screen bg-[#f8f9fd] font-sans text-[#2d3748]">
    <AdminConfig />

    <main class="flex-1">
      <header class="flex justify-between bg-white border-b border-black items-center px-4 mb-5 py-4">
        <div class="text-[13px] font-bold text-gray-400">
          Administração / <span class="text-gray-900">Gestão de Atendentes</span>
        </div>
      </header>

      <div class="max-w px-4 mx-auto">
        <div class="flex flex-col md:flex-row justify-between items-end mb-6 gap-4">
          <div class="flex flex-col md:flex-row gap-4 w-full md:w-auto">
            <div>
              <label class="block text-[10px] font-black text-gray-400 uppercase mb-1">Filtrar por Setor</label>
              <select 
                v-model="setorFiltro" 
                @change="carregar"
                class="bg-white border rounded-lg p-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 min-w-[250px]"
              >
                <option value="">Todos os setores da secretaria</option>
                <option v-for="s in setores" :key="s.id" :value="s.id">{{ s.nome }}</option>
              </select>
            </div>
          </div>

          <button
            @click="openModal()"
            class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-xs font-bold uppercase transition-all shadow-sm flex items-center gap-2 h-10"
          >
            <i class="pi pi-plus"></i>
            Novo Registro
          </button>
        </div>

        <div class="bg-white rounded-[12px] shadow-sm border border-gray-100 overflow-hidden">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-gray-50/50 text-gray-400 text-[10px] font-black uppercase tracking-[0.15em] border-b border-gray-50">
                <th class="px-6 py-5 text-center w-20">Editar</th>
                <th class="px-6 py-5">Atendente</th>
                <th class="px-6 py-5">Setores</th>
                <th class="px-6 py-5 text-center">Perfil</th>
                <th class="px-6 py-5 text-right">Ações</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-50">
              <tr v-for="item in lista" :key="item.id" class="hover:bg-blue-50/30 transition-colors group">
                <td class="px-6 py-4 text-center">
                  <button @click="openModal(item)" class="w-8 h-8 rounded-lg bg-gray-50 text-emerald-500 hover:bg-emerald-500 hover:text-white transition-all flex items-center justify-center mx-auto">
                    <i class="pi pi-pencil text-xs"></i>
                  </button>
                </td>
                <td class="px-6 py-4">
                  <div class="font-bold text-sm text-[#1e3a8a]">{{ item.nome }}</div>
                  <div class="text-[11px] text-gray-400">{{ item.email }}</div>
                </td>
                <td class="px-6 py-4 text-[11px] text-gray-500">
                  {{ item.setoresNomes?.join(', ') || 'Sem setor' }}
                </td>
                <td class="px-6 py-4 text-center">
                  <span class="px-3 py-1 rounded-full text-[9px] font-black uppercase border"
                    :class="item.perfil === 'ADMIN' ? 'bg-purple-50 text-purple-600 border-purple-100' : 'bg-blue-50 text-blue-600 border-blue-100'">
                    {{ item.perfil }}
                  </span>
                </td>
                <td class="px-6 py-4 text-right">
                  <button @click="excluir(item.id)" class="text-red-400 hover:text-red-600 text-[10px] font-black uppercase transition-all px-3">
                    Excluir
                  </button>
                </td>
              </tr>
              <tr v-if="lista.length === 0">
                <td colspan="5" class="px-6 py-10 text-center text-gray-400 text-xs uppercase font-bold">Nenhum atendente encontrado</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </main>

    <Teleport to="body">
      <div v-if="showModal" class="fixed inset-0 z-[100] flex items-center justify-center bg-[#1e3a8a]/20 backdrop-blur-md p-4">
        <div class="bg-white rounded-[12px] shadow-2xl w-full max-w-3xl overflow-hidden animate-in">
          <div class="p-8">
            <h2 class="text-xl font-black mb-6 text-[#1e3a8a] tracking-tighter border-b pb-4">
              {{ form.id ? 'Editar Atendente' : 'Novo Atendente' }}
            </h2>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div class="md:col-span-2">
                <label class="block text-[10px] font-black text-gray-400 uppercase mb-2">Nome Completo</label>
                <input v-model="form.usuario" type="text" class="w-full bg-gray-50 border rounded-lg p-3 text-sm outline-none focus:ring-2 focus:ring-blue-500" />
              </div>

              <div>
                <label class="block text-[10px] font-black text-gray-400 uppercase mb-2">CPF</label>
                <input v-model="form.cpf" type="text" class="w-full bg-gray-50 border rounded-lg p-3 text-sm outline-none" />
              </div>

              <div>
                <label class="block text-[10px] font-black text-gray-400 uppercase mb-2">E-mail</label>
                <input v-model="form.email" type="email" class="w-full bg-gray-50 border rounded-lg p-3 text-sm outline-none" />
              </div>

              <div>
                <label class="block text-[10px] font-black text-gray-400 uppercase mb-2">Perfil</label>
                <select v-model="form.perfil" class="w-full bg-gray-50 border rounded-lg p-3 text-sm outline-none">
                  <option value="ATENDENTE">Atendente</option>
                  <option 
                    v-if="usuarioLogadoPerfil === 'SUPER_ADMIN'" 
                    value="ADMIN">
                    Administrador
                  </option>
                </select>
              </div>

              <div>
                <label class="block text-[10px] font-black text-gray-400 uppercase mb-2">Situação</label>
                <select v-model="form.status" class="w-full bg-gray-50 border rounded-lg p-3 text-sm outline-none">
                  <option value="Ativo">Ativo</option>
                  <option value="Desativado">Desativado</option>
                </select>
              </div>

              <div class="md:col-span-2">
                <label class="block text-[10px] font-black text-gray-400 uppercase mb-2">Vincular às Secretarias</label>
                <select v-model="form.secretariasIds" multiple class="w-full bg-gray-50 border rounded-lg p-3 text-sm outline-none h-24">
                  <option v-for="sec in secretarias" :key="sec.id" :value="sec.id">
                    {{ sec.nome }}
                  </option>
                </select>
                <p class="text-[9px] text-gray-400 mt-1 italic">* Pressione Ctrl para selecionar mais de uma</p>
              </div>

              <div class="md:col-span-2">
                <label class="block text-[10px] font-black text-gray-400 uppercase mb-2">Vincular aos Setores</label>
                <select v-model="form.setoresIds" multiple class="w-full bg-gray-50 border rounded-lg p-3 text-sm outline-none h-32 focus:ring-2 focus:ring-blue-500">
                  <option v-for="s in setores" :key="s.id" :value="s.id">{{ s.nome }}</option>
                </select>
                <div class="flex justify-between mt-1">
                  <p class="text-[9px] text-gray-400 italic">Segure CTRL para selecionar/desmarcar vários</p>
                  <p class="text-[9px] font-bold text-blue-500">{{ form.setoresIds.length }} selecionado(s)</p>
                </div>
              </div>
            </div>
          </div>

          <div class="p-6 bg-gray-50 flex justify-end gap-3">
            <button @click="showModal = false" class="text-gray-400 font-black text-[13px] px-6 py-2">Cancelar</button>
            <button @click="save" class="bg-[#2563eb] text-white px-8 py-3 rounded-lg font-semibold text-[13px] shadow-lg">
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
import api from '@/services/api'

export default {
  name: 'GestaoAtendentes',
  components: { AdminConfig },
  data() {
    return {
      lista: [],
      setores: [],
      secretarias: [],
      setorFiltro: '',
      showModal: false,
      usuarioLogadoPerfil: '',
      usuarioLogadoSecretariaId: null,
      form: { id: null, usuario: '', cpf: '', email: '', senha: '', perfil: 'ATENDENTE', status: 'Ativo', setoresIds: [] },
    }
  },
  async mounted() {
    await this.carregarUsuario();
  },
  methods: {
    async carregarUsuario() {
      try {
        const res = await api.get('/gerenciador/usuario-logado');
        this.usuarioLogadoPerfil = res.data.perfil;
        this.secretarias = res.data.secretarias || [];

        if (this.secretarias.length > 0) {
          const idSalvo = localStorage.getItem('sec_ativa_id');
          const existe = this.secretarias.find(s => s.id == idSalvo);
          this.usuarioLogadoSecretariaId = existe ? parseInt(idSalvo) : this.secretarias[0].id;
          
          // Carrega setores e lista inicial
          await this.carregarDadosAuxiliares();
          await this.carregar();
        }
      } catch (e) {
        console.error("Erro ao carregar usuário:", e);
      }
    },

    async carregarDadosAuxiliares() {
      if (!this.secretarias || this.secretarias.length === 0) return;
      
      try {
        // Se o seu back-end suportar passar vários IDs
        // Fazer um loop nas secretarias do usuário e juntar os setores
        const promessas = this.secretarias.map(s => api.get(`/setores/por-secretaria/${s.id}`));
        const resultados = await Promise.all(promessas);
        
        // Achata os arrays de setores em um só e remove duplicados (caso um setor apareça em duas buscas)
        const todosSetores = resultados.flatMap(r => r.data);
        
        // Remove duplicados por ID
        this.setores = todosSetores.filter((setor, index, self) =>
          index === self.findIndex((t) => t.id === setor.id)
        );
      } catch (e) {
        console.error("Erro ao carregar setores auxiliares:", e);
        this.setores = [];
      }
    },

    async carregar() {
      if (!this.secretarias || this.secretarias.length === 0) return;

      try {
        let res;

        if (this.setorFiltro) {
          // filtro por setor
          res = await api.get(`/gerenciador/por-setor/${this.setorFiltro}`);
        } else {
          // pega TODAS as secretarias do usuário
          const ids = this.secretarias.map(s => s.id);

          res = await api.post('/gerenciador/secretarias', ids);
        }

        const dados = res.data || [];

        // 🔵 mantém sua lógica (já está correta)
        const agrupado = dados.reduce((acc, atual) => {
          const encontrado = acc.find(item => item.id === atual.id);

          if (encontrado) {
            if (atual.setoresNomes) {
              atual.setoresNomes.forEach(nome => {
                if (!encontrado.setoresNomes.includes(nome)) {
                  encontrado.setoresNomes.push(nome);
                }
              });
            }
          } else {
            acc.push({
              ...atual,
              setoresNomes: [...(atual.setoresNomes || [])]
            });
          }

          return acc;
        }, []);

        this.lista = agrupado.filter(
          item => item.perfil !== 'ADMIN' && item.perfil !== 'SUPER_ADMIN'
        );

      } catch (e) {
        console.error("Erro ao carregar lista:", e);
        this.lista = [];
      }
    },

    openModal(item = null) {
      if (item) {
        this.form = {
          id: item.id,
          usuario: item.nome,
          cpf: item.cpf,
          email: item.email,
          senha: '', 
          perfil: item.perfil,
          status: item.status || 'Ativo',
          setoresIds: item.setoresIds || [],
          // Mapeia as secretarias vindas do item (atendente)
          secretariasIds: item.secretariasIds || [],
          guicheId: item.pontoAtendimentoId || null
        }
      } else {
        this.form = { 
          id: null, usuario: '', cpf: '', email: '', senha: '', 
          perfil: 'ATENDENTE', status: 'Ativo', 
          setoresIds: [], 
          // Para novo registro, sugere a secretaria ativa atual
          secretariasIds: [this.usuarioLogadoSecretariaId] 
        }
      }
      this.showModal = true;
    },

    async save() {
      if (!this.form.secretariasIds || this.form.secretariasIds.length === 0) {
        alert("O atendente precisa estar vinculado a pelo menos uma secretaria.");
        return;
      }

      // Validação simples antes de enviar para o Java não dar RuntimeException
      if (this.form.setoresIds.length === 0) {
        alert("Selecione ao menos um setor!");
        return;
      }

      try {
        const payload = {
          id: this.form.id,
          nome: this.form.usuario,
          cpf: this.form.cpf,
          email: this.form.email,
          senha: this.form.senha, // O seu Java já trata se for null/blank
          perfil: this.form.perfil,
          secretariasIds: this.form.secretariasIds,
          setoresIds: this.form.setoresIds,
          guicheId: this.form.guicheId
        };

        if (this.form.id) {
          await api.put(`/gerenciador/${this.form.id}`, payload);
        } else {
          await api.post('/gerenciador', payload);
        }

        this.showModal = false;
        await this.carregar();
      } catch (e) {
        // Aqui você consegue ver a mensagem exata que o seu Java enviou no throw
        const msg = e.response?.data?.message || e.message;
        alert('Erro ao salvar: ' + msg);
      }
    },

    async excluir(id) {
      if (confirm('Excluir atendente?')) {
        await api.delete(`/gerenciador/${id}`);
        await this.carregar();
      }
    },
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
