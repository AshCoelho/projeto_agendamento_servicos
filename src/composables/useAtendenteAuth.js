import { ref } from 'vue'
import { AtendenteApi } from '@/services/atendente.api'
import { useRouter } from 'vue-router'

export function useAtendenteAuth() {
  const usuario = ref(null)
  const router = useRouter()

  const getUsuarioLogado = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) return router.push({ name: 'login' })

      const { data } = await AtendenteApi.getUsuarioLogado()
      usuario.value = data
    } catch {
      localStorage.clear()
      router.push({ name: 'login' })
    }
  }

  return { usuario, getUsuarioLogado }
}