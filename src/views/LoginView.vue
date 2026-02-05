<template>
  <div
    class="absolute top-0 left-0 w-full h-[4px] bg-gradient-to-r from-[#FFC107] via-[#f0d924] to-[#3da1d5] z-50"
  ></div>
  <div
    class="flex min-h-screen items-center justify-center bg-[#f1f5f9] font-sans relative overflow-hidden"
  >
    <div class="absolute -top-24 -left-24 w-96 h-96 bg-blue-50 rounded-full opacity-50"></div>
    <div class="absolute -bottom-24 -right-24 w-96 h-96 bg-blue-50 rounded-full opacity-50"></div>

    <div
      class="z-10 w-full max-w-md bg-white p-10 rounded-[32px] shadow-2xl shadow-blue-100 border border-gray-50"
    >
      <div class="flex flex-col items-center mb-8">
        <img src="@/assets/logo-prefeitura.png" alt="Prefeitura de São Luís" class="h-14 mb-4" />
        <div class="h-1 w-12 bg-blue-600 rounded-full mb-6"></div>

        <h2
          class="text-xl font-black text-[#1e3a8a] uppercase tracking-tighter flex items-center gap-2"
        >
          Acesso ao <span class="text-blue-600">Sistema</span>
        </h2>
        <p class="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em] mt-1">
          Agendamento de Serviços
        </p>
      </div>

      <form @submit.prevent="handleLogin" class="space-y-5">
        <div>
          <label
            class="block text-[10px] font-black text-gray-400 uppercase mb-2 ml-1 tracking-widest"
            >E-mail</label
          >
          <div class="relative">
            <i
              class="pi pi-user absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 text-sm"
            ></i>
            <input
              v-model="login.login"
              type="text"
              placeholder="seu@email.com"
              class="w-full bg-[#f8fafc] border border-gray-100 rounded-2xl py-3.5 pl-12 pr-4 text-xs font-semibold focus:ring-4 focus:ring-blue-50 focus:border-blue-300 transition-all outline-none"
              required
            />
          </div>
        </div>

        <div>
          <label
            class="block text-[10px] font-black text-gray-400 uppercase mb-2 ml-1 tracking-widest"
            >Senha</label
          >
          <div class="relative">
            <i
              class="pi pi-lock absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 text-sm"
            ></i>

            <input
              v-model="login.senha"
              :type="mostrarSenha ? 'text' : 'password'"
              placeholder="********"
              class="w-full bg-[#f8fafc] border border-gray-100 rounded-2xl py-3.5 pl-12 pr-12 text-xs font-semibold focus:ring-4 focus:ring-blue-50 focus:border-blue-300 transition-all outline-none"
              required
            />

            <button
              type="button"
              @click="mostrarSenha = !mostrarSenha"
              class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 hover:text-blue-500 transition-colors focus:outline-none"
            >
              <i :class="['pi', mostrarSenha ? 'pi-eye-slash' : 'pi-eye']"></i>
            </button>
          </div>
        </div>
        <div>
          <label
            class="block text-[10px] font-black text-gray-400 uppercase mb-2 ml-1 tracking-widest"
            >Perfil</label
          >
          <v-select
            :items="roles"
            item-title="title"
            item-value="value"
            v-model="roleSelecionado"
            density="compact"
            variant="outlined"
          ></v-select>

          <v-select
            v-if="roleSelecionado === 'ATENDENTE'"
            :items="guiche"
            item-title="title"
            item-value="value"
            density="compact"
            variant="outlined"
          >
          </v-select>
        </div>

        <div class="flex items-center justify-between px-1">
          <a href="#" class="text-[10px] font-bold text-blue-600 uppercase hover:underline"
            >Esqueci a senha</a
          >
        </div>

        <button
          type="submit"
          :disabled="carregando"
          class="w-full bg-gradient-to-r from-[#1d4ed8] to-[#2563eb] text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-200 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-70"
        >
          <span v-if="!carregando">Entrar no Sistema</span>
          <i v-else class="pi pi-spin pi-spinner text-sm"></i>
        </button>
      </form>

      <div class="mt-10 text-center">
        <p class="text-[9px] font-bold text-gray-400 uppercase tracking-tighter">
          © 2026 Prefeitura de São Luís
        </p>
        <p class="text-[9px] font-black text-blue-700 uppercase tracking-tighter mt-1">
          Secretaria Municipal de Tecnologia da Informação
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import api from '@/services/api'

export default {
  name: 'LoginView',
  data() {
    return {
      login: {
        login: '',
        senha: '',
      },
      mostrarSenha: false,
      carregando: false,
      roles: [
        {
          title: 'Administrador',
          value: 'ADMINISTRADOR',
        },
        {
          title: 'Atendente',
          value: 'ATENDENTE',
        },
        {
          title: 'Usuário',
          value: 'USUARIO',
        },
      ],
      roleSelecionado: '',
      guiche: [
        {
          title: 'Guichê',
          value: 'Guichê',
        },
      ],
      guicheSelecionado: '',
    }
  },
  methods: {
    async handleLogin() {
      this.carregando = true
      try {
        const resposta = await api.post('/gerenciador/login', this.login)
        if (resposta.status === 200) {
          console.log(resposta)
          localStorage.setItem('usuario', JSON.stringify(resposta.data))
          this.$router.push('/atendente')
        }
      } catch (error) {
        console.error('Erro ao autenticar:', error)
        alert('Credenciais inválidas ou erro no servidor.')
      } finally {
        this.carregando = false
      }
    },
  },
}
</script>

<style scoped>
@import 'https://unpkg.com/primeicons/primeicons.css';

input::placeholder {
  color: #cbd5e1;
  font-weight: 500;
}
</style>
