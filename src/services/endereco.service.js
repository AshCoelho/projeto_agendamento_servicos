// services/endereco.service.js
import api from './api'

export const EnderecoService = {
  listarTodos() {
    return api.get('/enderecos/listar-todos')
  },

  criar(data) {
    return api.post('/enderecos', data)
  },

  atualizar(id, data) {
    return api.put(`/enderecos/${id}`, data)
  },

  excluir(id) {
    return api.delete(`/enderecos/${id}`)
  }
}