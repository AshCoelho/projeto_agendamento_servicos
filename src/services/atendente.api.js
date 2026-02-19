import api from '@/services/api'

export const AtendenteApi = {
  // ✅ Alterado: Agora busca agendamentos por SETOR
  async buscarAgendamentosPorSetor(setorId) {
    const res = await api.get(`/agendamentos/setor/${setorId}`)
    return Array.isArray(res.data) ? res.data : []
  },

  async chamarPorSenha(senha, gerenciadorId) {
    return await api.post(`/agendamentos/chamar/por-senha/${encodeURIComponent(senha)}/${gerenciadorId}`)
  },

  // ✅ Alterado: Chamar Próximo Normal por SETOR
  async chamarNormal(setorId, gerenciadorId) {
    return await api.post(`/agendamentos/chamar/normal/${setorId}/${gerenciadorId}`)
  },

  // ✅ Alterado: Chamar Próximo Prioridade por SETOR
  async chamarPrioridade(setorId, gerenciadorId) {
    return await api.post(`/agendamentos/chamar/prioridade/${setorId}/${gerenciadorId}`)
  },

  async cancelarAtendimento(id, token) {
    return await api.put(`/agendamentos/cancelar/${id}`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    })
  },

  async finalizarAtendimento(id) {
    return await api.put(`/agendamentos/finalizar/${id}`)
  },

  async salvarEspontaneo(secretariaId, payload) {
    // payload agora deve conter o setorId em vez de enderecoId
    return await api.post(`/agendamentos/espontaneo/${secretariaId}`, payload)
  },

  async atualizarEspontaneo(id, payload, token) {
    return await api.put(`/agendamentos/atualizar-espontaneo/${id}`, payload, {
      headers: { Authorization: `Bearer ${token}` }
    })
  },

  async getUsuarioLogado() {
    return await api.get('/gerenciador/usuario-logado')
  },

  async carregarServicos(secretariaId) {
    return await api.get(`/secretarias/${secretariaId}/servicos`)
  }
}