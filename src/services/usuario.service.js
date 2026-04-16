// services/usuario.service.js
import api from './api'

export const UsuarioService = {
  getUsuarioLogado() {
    return api.get('/gerenciador/usuario-logado')
  }
}