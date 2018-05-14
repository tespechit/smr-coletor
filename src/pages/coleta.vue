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

    <tela-coleta :produto="produtoAtual"
                 diferenca-preco-maxima="25"
                 :is-primeiro="isPrimeiro"
                 :is-ultimo="isUltimo"
                 :percentual-progresso-coleta="percentualProgressoColeta"
                 @atualizar-posicao="atualizarPosicao"
                 @atualizar-produto="atualizarProduto"
                 @ultimo-produto="$router.push('/concorrentes')"></tela-coleta>
  </q-page>
</template>

<script>
import TelaColeta from 'components/TelaColeta'

export default {
  name: 'Coleta',
  components: {
    TelaColeta
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
    },
    produtoAtual() {
      return this.coletaAtual.produtos[this.coletaAtual.posicao - 1]
    },
    isPrimeiro() {
      return this.coletaAtual.posicao === 1
    },
    isUltimo() {
      return this.coletaAtual.posicao === this.coletaAtual.totalProdutos
    },
    percentualProgressoColeta() {
      return this.coletaAtual.posicao / this.coletaAtual.totalProdutos * 100
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
