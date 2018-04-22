<template>
  <q-page padding>
    <q-layout-header>
      <q-toolbar color="primary">
        <q-btn flat
               round
               dense
               icon="navigate_before"
               @click="voltarConcorrentes" />
        <q-toolbar-title class="text-no-wrap">
          <q-breadcrumbs separator=">"
                         active-color="white"
                         color="white"
                         class="q-body-1">
            <q-breadcrumbs-el :label="pesquisaAtual.nome" />
            <q-breadcrumbs-el :label="concorrenteAtual.nome" />
          </q-breadcrumbs>
        </q-toolbar-title>
        <q-btn flat
               dense
               icon="home"
               label=""
               @click="voltarInicio" />
      </q-toolbar>
    </q-layout-header>

    <div class="row justify-center items-center"
         style="height: calc(100vh - 150px)"
         v-if="produtoAtual">

      <div class="q-display-1"  >
        {{ produtoAtual.descricao }}
      </div>

      <div class="row full-width justify-center">
        <div class="row full-width justify-center">
          <div style="width: 50vw">
            <q-input v-model.lazy="precoConcorrente"
                     type="tel"
                     align="right"
                     prefix="R$"
                     ref="preco"
                     @click="$refs.preco.select()"
                     class="input-preco"
                     v-mask="'money'"
                     style="font-size: 2em"
                     autofocus
                     @keyup.enter="avancarProduto"/>
          </div>
        </div>

        <q-checkbox class="q-mt-lg"
                    v-model="promocao"
                    label="Promoção" />
      </div>
    </div>

    <div class="fixed-bottom flex justify-between q-pa-sm"
         style="background: rgba(247,247,247,.8)">
      <q-btn flat
             size="lg"
             icon="skip_previous"
             :disable="primeiroItem"
             color="primary"
             @click="voltarProduto" />
      <q-btn v-if="precisaDeFoto"
             rounded
             size="lg"
             icon="photo_camera"
             color="negative"
             @click="tirarFoto()" />

      <q-btn v-if="ultimoItem"
             push
             size="lg"
             icon="check"
             color="positive"
             @click="$router.push('/concorrentes')" />
      <q-btn v-else
             flat
             size="lg"
             icon="skip_next"
             color="primary"
             @click="avancarProduto" />
      <q-progress class="q-mt-sm"
                  :percentage="percentualConcluido" />
    </div>
  </q-page>
</template>

<script>
export default {
  name: 'Coleta',
  data() {
    return {
      precisaDeFoto: false
    }
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
      const idConcorrente = this.$store.state.coleta.concorrenteAtual.id
      return this.$store.state.global.concorrentes.find(
        concorrente => concorrente.id === idConcorrente
      )
    },
    coletaAtual() {
      return this.$store.state.coleta.coletas.find(
        coleta => coleta.concorrente.id === this.concorrenteAtual.id
      )
    },
    produtoAtual() {
      return this.$store.getters['coleta/produtoAtual']
    },
    precoConcorrente: {
      get() {
        return this.produtoAtual.precoConcorrente
      },
      set(value) {
        const produto = {
          ...this.produtoAtual,
          precoConcorrente: value,
          dataHoraColeta: Date.now()
        }
        this.$store.commit('coleta/atualizarProduto', produto)
      }
    },
    promocao: {
      get() {
        return this.produtoAtual.promocao
      },
      set(value) {
        const produto = {
          ...this.produtoAtual,
          promocao: value
        }
        this.$store.commit('coleta/atualizarProduto', produto)
      }
    },
    produtoIndex() {
      return this.coletaAtual.produtos.findIndex(
        produto => produto.id === this.produtoAtual.id
      )
    },
    primeiroItem() {
      return this.coletaAtual.posicao === 1
    },
    ultimoItem() {
      return this.coletaAtual.encerrada
    },
    percentualConcluido() {
      return this.coletaAtual.posicao / this.coletaAtual.totalProdutos * 100
    }
  },
  methods: {
    atualizarProduto() {
      this.$store.dispatch('coleta/atualizarProduto', this.produtoAtual)
    },
    confirmarSaida(url, message) {
      this.$q
        .dialog({
          title: 'Confirmação',
          message,
          ok: 'Sim',
          cancel: 'Não'
        })
        .then(() => {
          this.$router.push(url)
        })
        .catch(() => {})
    },
    voltarConcorrentes() {
      this.confirmarSaida(
        '/concorrentes',
        'Deseja voltar para a tela de concorrentes?'
      )
    },
    voltarInicio() {
      this.confirmarSaida('/', 'Deseja voltar para a tela inicial?')
    },
    voltarProduto() {
      this.atualizarPosicaoProduto(-1)
    },
    avancarProduto() {
      this.precisaDeFoto = this.precisaTirarFoto()
      if (this.precisaDeFoto) {
        return
      }

      this.atualizarPosicaoProduto(1)
    },
    atualizarPosicaoProduto(value) {
      this.$store.commit('coleta/atualizarPosicaoProduto', value)
      this.$refs.preco.focus()
    },
    precisaTirarFoto() {
      if (!this.$q.platform.is.cordova) {
        return false
      }

      if (this.produtoAtual.foto !== null) {
        return false
      }

      const diferencaMaxima = 25
      if (this.calculaDiferencaPreco() > diferencaMaxima) {
        return false
      }

      this.$q.dialog({
        color: 'negative',
        title: 'Tire uma Foto',
        message:
          'Tire uma foto da etiqueta do produto clicando no botão vermelho.'
      })

      return true
    },
    calculaDiferencaPreco() {
      const precoConcorrente = Number(this.precoConcorrente.replace(',', '.'))
      const diferenca =
        (precoConcorrente - this.produtoAtual.precoVenda) /
        precoConcorrente *
        100
      return diferenca < 0 ? diferenca * -1 : diferenca
    },
    tirarFoto() {
      const foto = 'base64'

      const produto = {
        ...this.produtoAtual,
        foto
      }
      this.$store.commit('coleta/atualizarProduto', produto)
    }
  }
}
</script>

<style>
input.q-input-target {
  height: inherit;
  outline: 0;
}
</style>
