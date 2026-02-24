import { ref, onMounted, onUnmounted } from 'vue'

export function useRelogio() {
  const relogio = ref('--:--:--')
  let interval = null

  const atualizar = () => {
    relogio.value = new Date().toLocaleTimeString('pt-BR')
  }

  onMounted(() => {
    atualizar()
    interval = setInterval(atualizar, 1000)
  })

  onUnmounted(() => {
    clearInterval(interval)
  })

  return { relogio }
}