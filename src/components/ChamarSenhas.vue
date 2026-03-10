<template>
  <div class="px-8">
    <div class="mb-6 bg-white p-6 rounded-[15px] shadow-sm border-b-4 border-transparent">
      <h2 class="text-gray-400 text-xs font-bold uppercase tracking-widest mb-6">
        Painel de Comandos
      </h2>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div
          @click="handleChamarNormal"
          class="cursor-pointer bg-[#2563eb] hover:bg-[#1d4ed8] p-6 rounded-[15px] shadow-md flex justify-between items-center transition-all active:scale-95"
        >
          <div>
            <p class="text-[10px] font-bold text-white/70 uppercase mb-1 tracking-wider">Ação</p>
            <h3 class="text-2xl font-black text-white tracking-tighter">Chamar Normal</h3>
          </div>
          <div
            class="w-12 h-12 bg-white/20 rounded-[12px] flex items-center justify-center text-white backdrop-blur-sm"
          >
            <i class="pi pi-volume-up text-xl"></i>
          </div>
        </div>

        <div
          class="cursor-pointer bg-[#FFA000] hover:bg-[#FF8F00] p-6 rounded-[15px] shadow-md flex justify-between items-center transition-all active:scale-95"
        >
          <div @click="handleChamarPrioridade">
            <p class="text-[10px] font-bold text-white/70 uppercase mb-1 tracking-wider">Ação</p>
            <h3 class="text-2xl font-black text-white tracking-tighter">Chamar Prioridade</h3>
          </div>
          <div
            class="w-12 h-12 bg-white/20 rounded-[12px] flex items-center justify-center text-white backdrop-blur-sm"
          >
            <i class="pi pi-bolt text-xl"></i>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { AgendamentoService } from '@/services/agendamento.service'
import { AtendenteApi } from '@/services/atendente.api'
import 'primeicons/primeicons.css'

export default {
  data: () => ({
    // UI/Controle
    abaAtiva: 'AGUARDANDO',
    relogio: '--:--:--',
    paginaAtual: 1,
    itensPorPagina: 3,
    mostrarModalEdicao: false,
    mostrarModalEspontaneo: false,
    sidebarAberta: false,

    // Dados
    filtroTexto: '',
    usuario: null,
    setorTrabalhoId: null,
    secretariaTrabalhoId: null,
    enderecoEstatico: null,
    agendamentosPorSetor: [],
    selectedItem: null,
    idsChamadosManualmente: [],
    servicos: [],
    tiposAtendimento: [],
    horaAtual: new Date(),

    // Formulários
    novoAgendamento: { nomeCidadao: '', servico: null, tipoAtendimentoId: null },
  }),

  watch: {
    mostrarModalEspontaneo(novoValor) {
      const acao = novoValor ? 'addEventListener' : 'removeEventListener'
      window[acao]('keydown', this.handleEsc)
    },
  },

  computed: {
    temAtendimentoAtivo() {
      const meuId = Number(this.usuario?.id || localStorage.getItem('usuarioId'))

      if (!this.agendamentosPorSetor.length) return false

      return this.agendamentosPorSetor.some((a) => {
        const status = a.situacao?.toUpperCase()
        const idNoBanco = Number(a.gerenciadorId)

        const ocupado = status === 'CHAMADO' || status === 'EM_ATENDIMENTO'
        const ehMeu = idNoBanco === meuId

        return ocupado && ehMeu
      })
    },

    // Deixei apenas as variáveis que são usadas por esse componente
    totalNormalFila() {
      return this.agendamentosPorSetor.filter(
        (a) => a.situacao === 'AGENDADO' && a.tipoAtendimento === 'NORMAL',
      ).length
    },
  },

  methods: {
    mudarAba(novaAba) {
      this.abaAtiva = novaAba
      this.paginaAtual = 1
    },
    handleEsc(e) {
      if (e.key === 'Escape') this.mostrarModalEspontaneo = false
    },
    agendamentoSelecionado(item) {
      this.selectedItem = item
      this.mostrarModalEdicao = true
    },

    atualizarRelogioLocal() {
      this.horaAtual = new Date()
      this.relogio = this.horaAtual.toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      })
    },

    formatarDataHora(data) {
      if (!data) return ''
      return new Date(data).toLocaleString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    },

    async handleLogout() {
      const token = localStorage.getItem('token')
      const usuarioId = this.usuario?.id || localStorage.getItem('usuarioId')

      try {
        if (usuarioId && token) {
          await AtendenteApi.deslogarGuiche(usuarioId)
        }
      } catch (error) {
        console.error('Erro técnico ao deslogar guichê:', error.response?.data || error.message)
      } finally {
        localStorage.clear()
        this.usuario = null
        this.$router.push({ name: 'login' })
      }
    },

    async getUsuarioLogado() {
      try {
        const token = localStorage.getItem('token')
        this.setorTrabalhoId = localStorage.getItem('setorTrabalhoId')
        this.secretariaTrabalhoId = localStorage.getItem('secretariaTrabalhoId')

        if (!token || !this.setorTrabalhoId) return this.$router.push({ name: 'login' })

        const { data } = await AtendenteApi.getUsuarioLogado()
        this.usuario = data

        if (data.id) {
          localStorage.setItem('usuarioId', data.id)
        }
      } catch (error) {
        localStorage.clear()
        this.$router.push({ name: 'login' })
      }
    },

    async buscarAgendamentos() {
      try {
        if (!this.usuario?.id) await this.getUsuarioLogado()
        if (this.setorTrabalhoId) {
          const data = await AtendenteApi.buscarAgendamentosPorSetor(this.setorTrabalhoId)
          this.agendamentosPorSetor = [...data]
        }
      } catch (e) {
        console.error('Erro ao buscar agendamentos:', e)
      }
    },

    async handleChamar(senha) {
      const itemClicado = this.agendamentosPorSetor.find((a) => a.senha === senha)
      if (!itemClicado) return

      const statusClicado = itemClicado.situacao?.toUpperCase()
      const meuId = Number(this.usuario?.id || localStorage.getItem('usuarioId'))
      const donoDoItemClicado = Number(itemClicado.gerenciadorId || itemClicado.usuarioId)

      const ehMinhaSenhaAtual =
        (statusClicado === 'EM_ATENDIMENTO' || statusClicado === 'CHAMADO') &&
        donoDoItemClicado === meuId

      if (this.temAtendimentoAtivo && !ehMinhaSenhaAtual) {
        alert('Você já possui um atendimento em aberto. Finalize-o antes de chamar outra senha.')
        return
      }

      try {
        const res = await AtendenteApi.chamarPorSenha(senha, this.usuario.id, this.setorTrabalhoId)

        if (res.status === 200) {
          if (itemClicado) {
             // 🟢 Adiciona nos chamados manualmente para o "computed" enxergar na hora
            this.idsChamadosManualmente.push(itemClicado.agendamentoId || itemClicado.id)
            
            // 🟢 Altera o status localmente de forma imediata (Otimismo de UI)
            itemClicado.situacao = 'CHAMADO'
            itemClicado.gerenciadorId = meuId 
          }

          // 🟢 MUDA A ABA AQUI
          this.mudarAba('ATENDIMENTO')
          
          // E depois vai no banco buscar os dados reais
          await this.buscarAgendamentos()
        }
      } catch (e) {
        alert(e?.response?.data?.mensagem || 'Falha na chamada.')
      }
    },

    async handleChamarNormal() {
      if (this.temAtendimentoAtivo) {
        alert('Você já possui um atendimento em aberto. Finalize-o antes de chamar o próximo.')
        return
      }

      if (this.totalNormalFila === 0) {
        alert('Não há pacientes aguardando na fila de atendimento NORMAL.')
        return
      }

      try {
        const { data } = await AtendenteApi.chamarNormal(this.setorTrabalhoId, this.usuario.id)
        
        if (data && data.sucesso === false) {
          alert(data.mensagem)
        } else {
          // 🟢 SUCESSO: Avisa a tela principal para mudar a aba
          this.$emit('senha-chamada')
        }
      } catch (error) {
        console.error('Erro técnico:', error)
        alert('Falha ao chamar: Ocorreu um erro na comunicação com o servidor.')
      } finally {
        this.buscarAgendamentos()
      }
    },

    async handleChamarPrioridade() {
      if (this.temAtendimentoAtivo) {
        alert('Você já possui um atendimento em aberto. Finalize-o antes de chamar o próximo.')
        return
      }

      try {
        const response = await AtendenteApi.chamarPrioridade(this.setorTrabalhoId, this.usuario.id)
        const dados = response.data || response

        if (dados && dados.sucesso === false) {
          alert(dados.mensagem)
        } else if (dados && dados.sucesso === true) {
          
          // 🟢 ATUALIZAÇÃO OTIMISTA
          if (dados.id) {
            this.idsChamadosManualmente.push(dados.id)

            // Acha o cidadão na lista atual e atualiza o status instantaneamente
            const index = this.agendamentosPorSetor.findIndex((a) => (a.agendamentoId || a.id) === dados.id)
            if (index !== -1) {
              this.agendamentosPorSetor[index].situacao = 'CHAMADO'
              this.agendamentosPorSetor[index].gerenciadorId = this.usuario.id
            }
          }
          // Muda a aba sem fazer o usuário esperar
          this.$emit('senha-chamada')
        }
      } catch (error) {
        console.error('Erro técnico:', error)
        const msgErro = error.response?.data?.mensagem || error.response?.data || 'Ocorreu um erro ao tentar chamar.'
        alert(typeof msgErro === 'string' ? msgErro : 'Erro na comunicação com o servidor.')
      } finally {
        // Atualiza a lista no fundo, sem travar a tela
        this.buscarAgendamentos()
      }
    },

    async handleCancelar(id) {
      if (!confirm('Deseja realmente cancelar?')) return
      try {
        const token = localStorage.getItem('token')
        await AtendenteApi.cancelarAtendimento(id, token)

        this.idsChamadosManualmente = this.idsChamadosManualmente.filter((itemId) => itemId !== id)

        const index = this.agendamentosPorSetor.findIndex((a) => (a.agendamentoId || a.id) === id)
        if (index !== -1) this.agendamentosPorSetor[index].situacao = 'FALTOU'

        await this.buscarAgendamentos()
      } catch (e) {
        alert('Erro ao cancelar.')
      }
    },

    async handleFinalizar(id) {
      if (!confirm('Deseja finalizar?')) return
      try {
        await AtendenteApi.finalizarAtendimento(id)

        this.idsChamadosManualmente = this.idsChamadosManualmente.filter((itemId) => itemId !== id)
        await new Promise((resolve) => setTimeout(resolve, 400))

        this.mostrarModalEdicao = false
        await this.buscarAgendamentos()
      } catch (e) {
        console.error('Erro ao finalizar:', e)
        alert('Erro ao finalizar atendimento.')
      }
    },

    async salvarEspontaneo() {
      try {
        if (!this.novoAgendamento.nomeCidadao || !this.novoAgendamento.servico) {
          alert('Preencha o nome e selecione o serviço.')
          return
        }

        const payload = {
          nomeCidadao: this.novoAgendamento.nomeCidadao,
          tipoAtendimentoId: Number(this.novoAgendamento.tipoAtendimentoId),
          servicoId: Number(this.novoAgendamento.servico),
          setorId: Number(this.setorTrabalhoId),
          situacao: 'AGENDADO',
        }

        const res = await AtendenteApi.salvarEspontaneo(this.secretariaTrabalhoId, payload)

        if (res.status === 200 || res.status === 201) {
          const senhaGerada = res.data?.senha || ''

          this.mostrarModalEspontaneo = false
          this.novoAgendamento = { nomeCidadao: '', servico: null, tipoAtendimentoId: null }

          await this.buscarAgendamentos()
          await this.carregarTiposAtendimento()

          alert(`Atendimento registrado! Senha: ${senhaGerada}`)
        }
      } catch (e) {
        console.error('Erro ao salvar:', e)
        const msgErro = e.response?.data?.mensagem || e.message || 'Erro de comunicação'
        alert('Erro: ' + msgErro)
      }
    },

    async atualizarEspontaneo() {
      try {
        const idServico = this.selectedItem.servicoId || this.selectedItem.servico?.id
        const payload = { nomeCidadao: this.selectedItem.usuarioNome, servicoId: Number(idServico) }
        const token = localStorage.getItem('token')
        await AtendenteApi.atualizarEspontaneo(this.selectedItem.agendamentoId, payload, token)
        this.mostrarModalEdicao = false
        await this.buscarAgendamentos()
      } catch (e) {
        alert('Erro ao atualizar.')
      }
    },

    async carregarServicos() {
      try {
        const res = await AtendenteApi.carregarServicos(this.secretariaTrabalhoId)
        this.servicos = res.data
      } catch (e) {
        console.error(e)
      }
    },

    async carregarTiposAtendimento() {
      try {
        const { data } = await AtendenteApi.carregarTiposAtendimento(this.secretariaTrabalhoId)
        this.tiposAtendimento = data

        if (data.length > 0 && !this.novoAgendamento.tipoAtendimentoId) {
          const padrao = data.find((t) => t.nome.toUpperCase() === 'NORMAL')
          if (padrao) this.novoAgendamento.tipoAtendimentoId = padrao.id
        }
      } catch (error) {
        console.error('Erro ao carregar tipos:', error)
      }
    },
  },

  async mounted() {
    await this.getUsuarioLogado()
    await this.buscarAgendamentos()

    setInterval(() => {
      this.buscarAgendamentos()
    }, 2000)
    this.carregarServicos()
    this.carregarTiposAtendimento()
    this.atualizarRelogioLocal()
    setInterval(this.atualizarRelogioLocal, 1000)

    if (this.usuario?.setores) {
      const setorAtual = this.usuario.setores.find((s) => s.id == this.setorTrabalhoId)
      this.enderecoEstatico = setorAtual ? `Unidade: ${setorAtual.nome}` : 'Unidade de Atendimento'
    }
  },
}
</script>