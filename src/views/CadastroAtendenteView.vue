<template>
  <div class="container">
    <h2>Cadastro de Atendente</h2>

    <form @submit.prevent="cadastrar">
      <div class="campo">
        <label>Nome:</label>
        <input v-model="form.nome" type="text" required />
      </div>

      <div class="campo">
        <label>Email:</label>
        <input v-model="form.email" type="email" required />
      </div>

      <div class="campo">
        <label>CPF:</label>
        <input v-model="form.cpf" type="text" required />
      </div>

      <div class="campo">
        <label>Telefone:</label>
        <input v-model="form.telefone" type="text" />
      </div>

      <div class="campo">
        <label>Senha:</label>
        <input v-model="form.senha" type="password" required />
      </div>

      <button type="submit">Cadastrar</button>
    </form>

    <div v-if="mensagem" class="mensagem">
      {{ mensagem }}
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'

const form = reactive({
  nome: '',
  email: '',
  cpf: '',
  telefone: '',
  senha: '',
})

const mensagem = ref('')

const cadastrar = () => {
  console.log('Dados enviados:', form)

  // Aqui você pode fazer um axios.post para sua API
  // Exemplo:
  // await axios.post('/api/atendentes', form)

  mensagem.value = 'Atendente cadastrado com sucesso!'

  // Limpar formulário
  form.nome = ''
  form.email = ''
  form.cpf = ''
  form.telefone = ''
  form.senha = ''
}
</script>

<style scoped>
.container {
  max-width: 400px;
  margin: 40px auto;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
}

h2 {
  text-align: center;
  margin-bottom: 20px;
}

.campo {
  display: flex;
  flex-direction: column;
  margin-bottom: 15px;
}

label {
  margin-bottom: 5px;
  font-weight: bold;
}

input {
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

button {
  width: 100%;
  padding: 10px;
  background-color: #3da1d5;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #2c89b8;
}

.mensagem {
  margin-top: 15px;
  text-align: center;
  color: green;
}
</style>
