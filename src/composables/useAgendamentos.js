import { ref, computed } from 'vue'
import { AtendenteApi } from '@/services/atendente.api'

export function useAgendamentos(usuario) {
  const lista = ref([])
  const abaAtiva = ref('AGUARDANDO')
  const paginaAtual = ref(1)
  const itensPorPagina = ref(3)

  const buscar = async () => {
    if (!usuario.value?.setor?.id) return
    lista.value = await AtendenteApi.buscarAgendamentosPorSetor(
      usuario.value.setor.id
    )
  }

  const filtrados = computed(() =>
    lista.value.filter(a =>
      abaAtiva.value === 'AGUARDANDO'
        ? a.situacao === 'AGENDADO'
        : a.situacao === 'ATENDIDO'
    )
  )

  const paginados = computed(() => {
    const inicio = (paginaAtual.value - 1) * itensPorPagina.value
    return filtrados.value.slice(inicio, inicio + itensPorPagina.value)
  })

  const totalPaginas = computed(() =>
    Math.ceil(filtrados.value.length / itensPorPagina.value) || 1
  )

  return {
    lista,
    abaAtiva,
    paginaAtual,
    paginados,
    totalPaginas,
    buscar
  }
}