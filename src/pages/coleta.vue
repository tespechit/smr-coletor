<template>
  <q-page>
    <q-layout-header>
      <q-toolbar color="primary">
        <q-btn flat
               round
               dense
               icon="navigate_before"
               @click="$router.push('/concorrentes')" />
        <q-toolbar-title class="text-no-wrap">
          {{ concorrenteAtual.nome }}
          <span slot="subtitle">{{ pesquisaAtual.nome }}</span>
        </q-toolbar-title>
        <q-btn flat
               dense
               icon="home"
               label=""
               @click="voltarPaginaInicial" />
      </q-toolbar>
    </q-layout-header>

    <navegador-produtos :produtos="coletaAtual.produtos"
                        :posicao="coletaAtual.posicao"
                        diferenca-preco-maxima="25"
                        @atualizar-posicao="atualizarPosicao"
                        @atualizar-produto="atualizarProduto"></navegador-produtos>
  </q-page>
</template>

<script>
import NavegadorProdutos from 'components/NavegadorProdutos'

export default {
  name: 'Coleta',
  components: {
    NavegadorProdutos
  },
  created() {
    if (!this.$store.getters['coleta/emAndamento']) {
      return this.$router.push('/')
    }
  },
  computed: {
    pesquisaAtual() {
      return this.$store.state.coleta.pesquisaAtual
    },
    concorrenteAtual() {
      return this.$store.state.coleta.concorrenteAtual
    },
    coletaAtual() {
      return this.$store.state.coleta.coletas.find(
        coleta => coleta.concorrente.id === this.concorrenteAtual.id
      )
    }
  },
  methods: {
    voltarPaginaInicial() {
      this.$q
        .dialog({
          title: 'Confirmação',
          message: 'Deseja voltar para a tela inicial?',
          ok: 'Sim',
          cancel: 'Não'
        })
        .then(() => {
          this.$router.push('/')
        })
        .catch(() => {})
    },
    atualizarPosicao(valor) {
      this.$store.commit('coleta/atualizarPosicaoProduto', valor)
    },
    atualizarProduto(produto) {
      this.$store.commit('coleta/atualizarProduto', produto)
    }
  }
}
</script>
