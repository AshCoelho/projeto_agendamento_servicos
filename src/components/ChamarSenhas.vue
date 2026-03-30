<template>
  <div class="px-8">
    <div class="mb-6 bg-white p-6 rounded-[15px] shadow-sm border-b-4 border-transparent">
      <h2 class="text-gray-400 text-xs font-bold uppercase tracking-widest mb-6">
        Painel de Comandos
      </h2>

      <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div
          class="bg-[#f8f9fd] p-6 rounded-[15px] shadow-sm flex justify-between items-start border-b-4 border-transparent"
        >
          <div>
            <p class="text-[10px] font-bold text-black/70 uppercase mb-1 tracking-wider">
              Atendimentos Hoje
            </p>
            <h3 class="text-2xl font-black text-black tracking-tighter">
              {{ totalRegistradosHoje }}
            </h3>
            <span class="inline-block w-8 h-1 bg-blue-darken-4 rounded-full"></span>
            <div class="flex gap-2 mt-2">
              <span class="text-[11px] font-bold text-blue-500 uppercase">
                {{ totalNormalGeral }} Normal
              </span>
              <span class="text-[11px] font-bold text-orange-500 uppercase">
                {{ totalPrioridadeGeral }} Prioridade
              </span>
            </div>
          </div>
          <div
            class="w-12 h-12 bg-black/20 rounded-[12px] flex items-center justify-center text-white backdrop-blur-sm"
          >
            <i class="pi pi-calendar"></i>
          </div>
        </div>

        <div
          @click="handleChamarNormal"
          class="cursor-pointer bg-[#2563eb] hover:bg-[#1d4ed8] p-6 rounded-[15px] shadow-md flex justify-between items-center transition-all active:scale-95"
        >
          <div>
            <p class="text-[10px] font-bold text-white/70 uppercase mb-1 tracking-wider">Ação</p>
            <h3 class="text-2xl font-black text-white font-bold">Chamar Normal</h3>
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
            <h3 class="text-2xl font-black text-white font-bold">Chamar Prioridade</h3>
          </div>
          <div
            class="w-12 h-12 bg-white/20 rounded-[12px] flex items-center justify-center text-white backdrop-blur-sm"
          >
            <i class="pi pi-bolt text-xl"></i>
          </div>
        </div>

        <div
          class="bg-[#f8f9fd] p-6 rounded-[15px] shadow-sm flex justify-between items-start border-b-4 border-transparent"
        >
          <div>
            <p class="text-[10px] font-bold text-black/70 uppercase mb-1 tracking-wider">
              Pessoas na Fila
            </p>
            <h3 class="text-2xl font-black text-black tracking-tighter">
              {{ agendamentosAguardando }}
            </h3>
            <span class="inline-block w-8 h-1 bg-blue-darken-4 rounded-full"></span>
            <div class="flex gap-2 mt-2">
              <span class="text-[11px] font-bold text-blue-500 uppercase">
                {{ totalNormalFila }} Normal
              </span>
              <span class="text-[11px] font-bold text-orange-500 uppercase">
                {{ totalPrioridadeFila }} Prioridade
              </span>
            </div>
          </div>
          <div
            class="w-12 h-12 bg-black/20 rounded-[12px] flex items-center justify-center text-white backdrop-blur-sm"
          >
            <i class="pi pi-users text-lg"></i>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
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
    // 🟢 1. O FILTRO MESTRE (Blindado contra o Bug do Zero)
    meusAgendamentos() {
      const meuId = this.usuario?.id || localStorage.getItem('usuarioId');
      
      if (!meuId) return []; // Se o sistema ainda não carregou o seu usuário, a lista fica vazia.

      return this.agendamentosPorSetor.filter(a => {
        // 🛑 A TRAVA: Se o paciente ainda não foi chamado (gerenciadorId é nulo/vazio), ignora ele na hora!
        if (!a.gerenciadorId) return false;
        
        // Se ele tem um gerenciadorId, compara com o seu de forma segura
        return Number(a.gerenciadorId) === Number(meuId);
      });
    },

    // 🟢 2. PAINEL "ATENDIMENTOS HOJE": Agora só mostra o total de quem passou pelo SEU guichê!
    totalRegistradosHoje() {
      return this.meusAgendamentos.filter((a) => a.situacao === 'ATENDIDO').length
    },

    totalNormalGeral() {
      return this.meusAgendamentos.filter(
        (a) => a.situacao === 'ATENDIDO' && a.tipoAtendimento === 'NORMAL'
      ).length;
    },
    
    totalPrioridadeGeral() {
      return this.meusAgendamentos.filter(
        (a) => a.situacao === 'ATENDIDO' && a.tipoAtendimento && a.tipoAtendimento.includes('PRIORIDADE')
      ).length;
    },

    // 🟢 3. PAINÉIS DE RESULTADO: Apenas os seus atendidos e ausentes
    agendamentosFinalizados() {
      return this.meusAgendamentos.filter((a) => a.situacao === 'ATENDIDO').length;
    },
    agendamentosCancelados() {
      return this.meusAgendamentos.filter((a) => a.situacao === 'FALTOU').length;
    },

    // 🌎 4. PAINEL "PESSOAS NA FILA": A fila geral de quem está aguardando no setor (Não mexemos, fica global)
    agendamentosAguardando() {
      return this.agendamentosPorSetor.filter(
        (a) => a.situacao === 'AGENDADO' && ['AGENDADO', 'ESPONTANEO'].includes(a.tipoAgendamento),
      ).length;
    },
    totalNormalFila() {
      return this.agendamentosPorSetor.filter(
        (a) => a.situacao === 'AGENDADO' && a.tipoAtendimento === 'NORMAL',
      ).length;
    },
    totalPrioridadeFila() {
      return this.agendamentosPorSetor.filter(
        (a) => a.situacao === 'AGENDADO' && a.tipoAtendimento && a.tipoAtendimento.includes('PRIORIDADE'),
      ).length;
    },

    atendimentoAtual() {
      const meuId = Number(this.usuario?.id || localStorage.getItem('usuarioId'))
      // Procura na lista quem está em atendimento com este usuário
      return this.agendamentosPorSetor.find(
        (a) =>
          (a.situacao === 'EM_ATENDIMENTO' || a.situacao === 'CHAMADO') &&
          Number(a.gerenciadorId || a.usuarioId) === meuId
      )
    },
    temAtendimentoAtivo() {
      return !!this.atendimentoAtual
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

    async enviarPing() {
      try {
        // Busca o ID prioritariamente do que está sendo atendido agora
        const agendamentoId = 
          this.atendimentoAtual?.agendamentoId || 
          this.atendimentoAtual?.id ||
          this.selectedItem?.agendamentoId || 
          this.selectedItem?.id;

        if (!agendamentoId) {
          console.log('Nenhum atendimento ativo para ping.');
          return;
        }

        await AtendenteApi.heartbeat(agendamentoId);
        console.log('Heartbeat enviado para ID:', agendamentoId);
      } catch (e) {
        console.warn('Falha no ping:', e);
      }
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
      try {
        const response = await AtendenteApi.chamarNormal(this.setorTrabalhoId, this.usuario.id)
        const dados = response.data || response

        if (dados && dados.sucesso === false) {
          // 🟢 Garante que SEMPRE haverá uma mensagem legível, mesmo se a API falhar em enviar
          alert(
            dados.mensagem ||
              'Ação bloqueada: Verifique se você já possui um atendimento em aberto ou se a fila está vazia.',
          )
        } else if (dados && (dados.sucesso === true || dados.id)) {
          this.$emit('senha-chamada', dados.id)
        }
      } catch (error) {
        console.error('Erro técnico:', error)

        // 🟢 Se for erro de Token/Sessão expirada (401 ou 403), avisa o usuário!
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
          alert('Sua sessão expirou por inatividade. Atualize a página ou faça login novamente.')
          return
        }

        // Tenta pegar a mensagem de erro do Spring, se não conseguir, dá uma mensagem genérica
        const msgErro =
          error.response?.data?.mensagem ||
          error.response?.data?.error ||
          'Não foi possível chamar a senha agora.'
        alert(typeof msgErro === 'string' ? msgErro : 'Erro de comunicação com o servidor.')
      }
    },

    async handleChamarPrioridade() {
      try {
        const response = await AtendenteApi.chamarPrioridade(this.setorTrabalhoId, this.usuario.id)
        const dados = response.data || response

        if (dados && dados.sucesso === false) {
          // 🟢 Garante a mensagem
          alert(
            dados.mensagem ||
              'Ação bloqueada: Verifique se você já possui um atendimento em aberto ou se a fila de prioridades está vazia.',
          )
        } else if (dados && (dados.sucesso === true || dados.id)) {
          this.$emit('senha-chamada', dados.id)
        }
      } catch (error) {
        console.error('Erro técnico:', error)

        // 🟢 Blindagem contra expiração de inatividade
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
          alert('Sua sessão expirou por inatividade. Atualize a página ou faça login novamente.')
          return
        }

        const msgErro =
          error.response?.data?.mensagem ||
          error.response?.data?.error ||
          'Não foi possível chamar a senha agora.'
        alert(typeof msgErro === 'string' ? msgErro : 'Erro de comunicação com o servidor.')
      }
    },

    async handleCancelar(id) {
      if (!confirm('Deseja realmente cancelar?')) return
      try {
        const token = localStorage.getItem('token')

        // 1. Envia comando para a API
        await AtendenteApi.cancelarAtendimento(id, token)

        // 2. Limpa dos chamados manuais
        this.idsChamadosManualmente = this.idsChamadosManualmente.filter((itemId) => itemId !== id)

        // 3. Atualização Otimista (tira o status de EM_ATENDIMENTO instantaneamente)
        const index = this.agendamentosPorSetor.findIndex((a) => (a.agendamentoId || a.id) === id)
        if (index !== -1) {
          this.agendamentosPorSetor[index].situacao = 'FALTOU'
        }

        // 🟢 4. MUDA A ABA NA HORA!
        this.abaAtiva = 'AGUARDANDO'

        // 5. Busca os dados reais no fundo
        await this.buscarAgendamentos()
      } catch (e) {
        alert('Erro ao cancelar.')
      }
    },

    async handleFinalizar(id) {
      if (!confirm('Deseja finalizar?')) return
      try {
        // 1. Envia comando para a API
        await AtendenteApi.finalizarAtendimento(id)

        // 2. Limpa dos chamados manuais
        this.idsChamadosManualmente = this.idsChamadosManualmente.filter((itemId) => itemId !== id)

        // 3. Fecha o modal de edição (caso esteja aberto)
        this.mostrarModalEdicao = false

        // 4. Atualização Otimista (tira o status de EM_ATENDIMENTO instantaneamente)
        const index = this.agendamentosPorSetor.findIndex((a) => (a.agendamentoId || a.id) === id)
        if (index !== -1) {
          this.agendamentosPorSetor[index].situacao = 'ATENDIDO'
        }

        // 🟢 5. MUDA A ABA NA HORA!
        this.abaAtiva = 'AGUARDANDO'

        // 6. Busca os dados reais no fundo
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
    this.carregarTiposAtendimento()
    this.atualizarRelogioLocal()
    setInterval(this.atualizarRelogioLocal, 1000)

    // 3. 💓 PING: Envia a cada 10 segundos
    setInterval(() => this.enviarPing(), 10000);

    if (this.usuario?.setores) {
      const setorAtual = this.usuario.setores.find((s) => s.id == this.setorTrabalhoId)
      this.enderecoEstatico = setorAtual ? `Unidade: ${setorAtual.nome}` : 'Unidade de Atendimento'
    }
  },
}
</script>
