<template>
  <q-page v-if="isColetaEmAndamento">
    <q-layout-header>
      <q-toolbar color="primary">
        <q-btn flat
               round
               dense
               icon="navigate_before"
               @click="voltarPaginaConcorrentes" />
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

    <div class="flex items-center q-pa-sm"
         style="height: calc(100vh - 50px)">

      <div class="full-width">
        <div class="q-headline uppercase text-center descricao-produto">
          {{ produtoForm.descricao }}
        </div>
      </div>

      <div class="full-width">
        <div class="row">
          <div class="col-6 offset-3">
            <q-input v-model="produtoForm.precoConcorrente"
                     type="tel"
                     align="right"
                     prefix="R$"
                     ref="preco"
                     v-mask="'money'"
                     autofocus
                     clearable
                     @keyup.enter="avancaPosicaoProduto" />
          </div>
        </div>

        <div class="row justify-center">
          <q-checkbox class="q-mt-lg"
                      v-model="produtoForm.promocao"
                      :disable="isPrecoConcorrenteVazio"
                      label="Promoção" />
        </div>
      </div>

      <div class="self-end full-width">
        <q-progress class="q-mb-xs"
                    :percentage="percentualProgressoColeta" />

        <div class="row justify-between">
          <q-btn flat
                 size="lg"
                 icon="skip_previous"
                 :disable="isPrimeiroProduto"
                 color="faded"
                 @click="voltaPosicaoProduto" />

          <q-btn v-if="precisaDeFoto && produtoForm.foto === null"
                 flat
                 size="lg"
                 icon="photo_camera"
                 color="blue-8"
                 class="animate-pop"
                 @click="capturarFoto" />

          <q-btn v-if="produtoForm.foto !== null"
                 flat
                 size="lg"
                 icon="delete_forever"
                 color="red"
                 class="animate-pop"
                 @click="apagaFoto" />

          <q-btn v-if="isUltimoProduto"
                 push
                 size="lg"
                 icon="done_all"
                 color="positive"
                 @click="avancaPosicaoProduto" />

          <q-btn v-else
                 flat
                 size="lg"
                 icon="skip_next"
                 color="primary"
                 @click="avancaPosicaoProduto" />
        </div>
      </div>
    </div>
  </q-page>
</template>

<script>
import config from '../common/config.js'

export default {
  name: 'Coleta',
  mounted() {
    if (!this.isColetaEmAndamento) {
      return this.$router.push('/')
    }

    this.carregarPrimeiroProdutoNaoColetado()
  },
  data() {
    return {
      posicao: 0,
      produtoOriginal: {},
      produtoForm: {
        dataHoraColeta: null,
        descricao: 'Produto',
        precoConcorrente: '',
        promocao: false,
        foto: null
      },
      precisaDeFoto: false
    }
  },
  computed: {
    isColetaEmAndamento() {
      return this.$store.getters['coleta/isColetaEmAndamento']
    },
    pesquisaAtual() {
      return this.$store.state.coleta.pesquisaAtual
    },
    concorrenteAtual() {
      return this.$store.state.coleta.concorrenteAtual
    },
    coletaAtual() {
      return this.$store.state.coleta.coletaAtual
    },
    isPrecoConcorrenteVazio() {
      return this.produtoForm.precoConcorrente.length === 0
    },
    isPrimeiroProduto() {
      return this.posicao === 0
    },
    isUltimoProduto() {
      return this.posicao === (this.coletaAtual.totalProdutos - 1)
    },
    isProdutoPrecisaFoto() {
      if (this.produtoForm.foto !== null) {
        return false
      }

      const precoConcorrente = Number(this.produtoForm.precoConcorrente.toString().replace(',', '.'))
      const precoVenda = this.produtoForm.precoVenda
      if (precoConcorrente <= 0 || precoVenda <= 0) {
        return false
      }

      const custoProduto = Number(this.produtoForm.custo)
      if ((precoConcorrente - custoProduto) / precoConcorrente < (config.TIRAR_FOTO_MARGEM_LIMITE * 100)) {
        return true
      }

      const percentual =
        (precoConcorrente - precoVenda) / precoConcorrente * 100
      const diferenca = percentual < 0 ? percentual * -1 : percentual
      return diferenca > config.TIRAR_FOTO_PERCENTUAL_DIFERENCA_PRECO
    },
    isProdutoAlterado() {
      return this.produtoForm.dataHoraColeta === null ||
        this.produtoForm.precoConcorrente !== this.produtoOriginal.precoConcorrente ||
        this.produtoForm.promocao !== this.produtoOriginal.promocao
    },
    isFimDaColeta() {
      return this.posicao >= (this.coletaAtual.totalProdutos - 1)
    },
    percentualProgressoColeta() {
      return (this.posicao / (this.coletaAtual.totalProdutos - 1)) * 100
    }
  },
  methods: {
    carregarPrimeiroProdutoNaoColetado() {
      let posicao = this.coletaAtual.produtos.findIndex(produto => {
        return produto.dataHoraColeta === null
      })

      if (posicao < 0 || posicao > this.coletaAtual.totalProdutos - 1) {
        posicao = this.coletaAtual.totalProdutos - 1
      }

      this.carregarProdutoPosicao(posicao)
    },
    carregarProdutoPosicao(posicao) {
      this.focaInputPreco()
      this.posicao = posicao
      const produtoAtual = this.coletaAtual.produtos[this.posicao]
      this.produtoOriginal = { ...produtoAtual }
      this.produtoForm = { ...produtoAtual }
    },
    focaInputPreco() {
      this.$refs.preco.focus()

      setTimeout(() => {
        this.$refs.preco.blur()
        this.$refs.preco.focus()
      }, 1000)
    },
    voltarPaginaInicial() {
      this.$router.push('/')
    },
    voltarPaginaConcorrentes() {
      this.$router.push('/concorrentes')
    },
    voltaPosicaoProduto() {
      this.carregarProdutoPosicao(this.posicao - 1)
    },
    avancaPosicaoProduto() {
      this.precisaDeFoto = this.isProdutoPrecisaFoto
      if (this.precisaDeFoto) {
        return this.capturarFoto()
      }

      if (this.isProdutoAlterado) {
        this.$store.dispatch('coleta/atualizaProdutoAtual', this.produtoForm)
      }

      if (this.isFimDaColeta) {
        return this.$store.dispatch('coleta/encerraColetaAtual').then(_ => {
          this.voltarPaginaConcorrentes()
        })
      }

      this.carregarProdutoPosicao(this.posicao + 1)
    },
    capturarFoto() {
      if (!this.$q.platform.is.cordova) {
        this.produtoForm.foto = ''
        return this.avancaPosicaoProduto()
      }

      navigator.camera.getPicture(filePath => {
        this.produtoForm.foto = filePath
        this.avancaPosicaoProduto()
      }, () => {}, {
        quality: config.QUALIDADE_FOTO_CAMERA
      })
    },
    apagaFoto() {
      this.produtoForm.foto = null
    }
  }
}
</script>

<style>
.q-input .q-input-target {
  height: inherit;
  outline: 0;
  font-size: 1.8em !important;
}
.q-input .q-icon {
  margin: 5px;
}

.descricao-produto {
  height: 96px; /* .q-caption line-height * 3 */
  overflow: hidden;
}
</style>
