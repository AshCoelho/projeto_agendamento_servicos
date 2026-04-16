import api from './api'

export const ConfiguracoesAtendimentoService = {
  listarPorSetor(setorId) {
    return api.get(`/configuracoes-atendimento/setor/${setorId}`)
  },

  listarAtivosPorSetor(setorId) {
    return api.get(`/configuracoes-atendimento/setor/${setorId}/ativos`)
  },

  ativar(id) {
    return api.put(`/configuracoes-atendimento/${id}/ativar`)
  },

  desativar(id) {
    return api.delete(`/configuracoes-atendimento/${id}/desativar`)
  },

  listarPorSetores(setores) {
    return Promise.all(
      setores.map(s =>
        api.get(`/configuracoes-atendimento/setor/${s.id}`)
      )
    )
  }
}