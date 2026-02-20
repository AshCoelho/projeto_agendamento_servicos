import { ref } from 'vue'
import { AtendenteApi } from '@/services/atendente.api'
import { useRouter } from 'vue-router'

export function useAtendenteAuth() {
  const usuario = ref(null)
  const setorAtivoId = ref(null)
  const router = useRouter()

  const getUsuarioLogado = async () => {
    try {
      const token = localStorage.getItem('token')
      // 🔴 Verifica se o setor de trabalho foi selecionado na tela de login
      const setorId = localStorage.getItem('setorTrabalhoId')

      // Se não tiver token ou não tiver escolhido o setor, volta pro login/seleção
      if (!token || !setorId) {
        return router.push({ name: 'login' })
      }

      const { data } = await AtendenteApi.getUsuarioLogado()
      
      // ✅ Segurança extra: Verifica se o setor no localStorage realmente pertence ao usuário
      const possuiAcesso = data.setores.some(s => s.id == setorId)
      
      if (!possuiAcesso) {
        throw new Error('Acesso negado ao setor selecionado')
      }

      usuario.value = data
      setorAtivoId.value = setorId
      
    } catch (error) {
      console.error("Erro na autenticação:", error)
      localStorage.clear()
      router.push({ name: 'login' })
    }
  }

  return { usuario, setorAtivoId, getUsuarioLogado }
}