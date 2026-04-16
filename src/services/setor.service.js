// services/setor.service.js
import api from './api'

export const SetorService = {
  listarPorSecretaria(secretariaId) {
    return api.get(`/setores/por-secretaria/${secretariaId}`)
  },

  criar(data) {
    return api.post('/setores', data)
  },

  atualizar(id, data) {
    return api.put(`/setores/${id}`, data)
  },

  excluir(id) {
    return api.delete(`/setores/${id}`)
  }
}