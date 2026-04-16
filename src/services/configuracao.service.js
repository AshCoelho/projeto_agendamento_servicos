import api from '@/services/api'

export const ConfiguracaoService = {
  listarAtivosPorSetor(setorId) {
    return api.get(`/configuracoes-atendimento/setor/${setorId}/ativos`)
  },

  buscarPorId(configId) {
    return api.get(`/configuracoes-atendimento/${configId}`)
  },

  adicionarDatas(configId, datas) {
    return api.post(`/configuracoes-atendimento/${configId}/datas`, { datas })
  },

  removerDatas(configId, datas) {
    return api.delete(`/configuracoes-atendimento/${configId}/datas`, {
      data: datas
    })
  },

  listarTodas() {
    return api.get('/configuracoes-atendimento')
  }
}