import { AtendenteApi } from '@/services/atendente.api'

export function useChamadas(usuario, buscar) {

  const chamarPorSenha = async (senha) => {
    await AtendenteApi.chamarPorSenha(senha, usuario.value.id)
    await buscar()
  }

  const chamarNormal = async () => {
    await AtendenteApi.chamarNormal(
      usuario.value.setor.id,
      usuario.value.id
    )
    await buscar()
  }

  const chamarPrioridade = async () => {
    await AtendenteApi.chamarPrioridade(
      usuario.value.setor.id,
      usuario.value.id
    )
    await buscar()
  }

  return {
    chamarPorSenha,
    chamarNormal,
    chamarPrioridade
  }
}