// services/secretaria.service.js
import api from './api'

export const SecretariaService = {
  listarTodas() {
    return api.get('/secretarias')
  }
}