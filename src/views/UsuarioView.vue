<template>
  <div class="min-h-screen bg-gray-100 p-4">
    
    <!-- HEADER -->
    <div class="bg-white rounded-xl shadow p-4 mb-4">
      <h1 class="text-xl font-bold">Olá, {{ usuario?.nome }}</h1>
      <p class="text-gray-500">{{ usuario?.email }}</p>

      <button
        @click="logout"
        class="mt-3 bg-red-500 text-white px-4 py-2 rounded-lg"
      >
        Sair
      </button>
    </div>

    <!-- DADOS -->
    <div class="bg-white rounded-xl shadow p-4 mb-4">
      <h2 class="font-semibold mb-2">Seus dados</h2>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
        <p><b>CPF:</b> {{ usuario?.login }}</p>
        <p><b>Celular:</b> {{ usuario?.celular }}</p>
        <p><b>Cidade:</b> {{ usuario?.cidade }}</p>
        <p><b>Estado:</b> {{ usuario?.estado }}</p>
        <p><b>Bairro:</b> {{ usuario?.bairro }}</p>
      </div>
    </div>

    <!-- HISTÓRICO -->
    <div class="bg-white rounded-xl shadow p-4">
      <h2 class="font-semibold mb-4">Histórico de Agendamentos</h2>

      <div v-if="carregando">Carregando...</div>

      <div v-else-if="historico.length === 0">
        Nenhum agendamento encontrado
      </div>

      <div v-else class="space-y-3">
        <div
          v-for="item in historico"
          :key="item.id"
          class="border rounded-lg p-3"
        >
          <p><b>Senha:</b> {{ item.senha }}</p>
          <p><b>Status:</b> {{ item.situacao }}</p>
          <p><b>Data:</b> {{ formatarData(item.horaAgendamento) }}</p>
          <p><b>Serviço:</b> {{ item.servico }}</p>
          <p><b>Setor:</b> {{ item.setor }}</p>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import api from '@/services/api'

export default {
  name: 'UsuarioView',

  data() {
    return {
      usuario: null,
      historico: [],
      carregando: false,
    }
  },

  async created() {
    await this.buscarUsuarioLogado()
  },

  methods: {
    async buscarUsuarioLogado() {
      try {
        const { data } = await api.get('/gerenciador/usuario-logado')

        this.usuario = data

        if (this.usuario?.login) {
          await this.buscarHistorico()
        }
        

      } catch (error) {
        console.error('Erro ao buscar usuário logado:', error)
        this.logout()
      }
    },

    async buscarHistorico() {
      this.carregando = true
      try {
        const cpf = this.usuario.login

        const { data } = await api.get(`/agendamentos/historico/${cpf}`)

        this.historico = data
      } catch (error) {
        console.error('Erro ao buscar histórico:', error)
      } finally {
        this.carregando = false
      }
    },

    formatarData(data) {
      if (!data) return '-'
      return new Date(data).toLocaleString('pt-BR')
    },

    logout() {
      localStorage.removeItem('token')
      localStorage.removeItem('usuario')
      localStorage.removeItem('usuarioId')
      this.$router.push('/')
    }
  }
}
</script>