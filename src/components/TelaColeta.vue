<template>
  <div class="flex items-center q-pa-sm debug"
       style="height: calc(100vh - 50px">

    <div class="full-width">
      <div class="q-headline uppercase text-center descricao-produto">
        {{ produtoAtual.descricao }}
      </div>
    </div>

    <div class="full-width">
      <div class="row">
        <div class="col-6 offset-3">
          <q-input v-model="produtoAtual.precoConcorrente"
                   type="tel"
                   align="right"
                   prefix="R$"
                   ref="preco"
                   v-mask="'money'"
                   autofocus
                   clearable
                   @keyup.enter="avancaPosicao"
                   @input="setAlterado" />
        </div>
      </div>

      <div class="row justify-center">
        <q-checkbox class="q-mt-lg"
                    v-model="produtoAtual.promocao"
                    :disable="!produtoAtual.precoConcorrente.length"
                    label="Promoção"
                    @input="setAlterado()" />
      </div>
    </div>

    <div class="self-end full-width">
      <q-progress class="q-mb-xs"
                  :percentage="percentualProgressoColeta" />

      <div class="row justify-between">
        <q-btn flat
               size="lg"
               icon="skip_previous"
               :disable="isPrimeiro"
               color="faded"
               v-touch-hold.prevent:1000="() => atualizarPosicao(-10)"
               @click="voltaPosicao" />

        <q-btn v-if="precisaDeFoto && produtoAtual.foto == null"
               flat
               size="lg"
               icon="photo_camera"
               color="blue-8"
               class="animate-pop"
               @click="tirarFoto" />

        <q-btn v-if="produtoAtual.foto"
               flat
               size="lg"
               icon="delete_forever"
               color="red"
               class="animate-pop"
               @click="apagarFoto" />

        <q-btn v-if="isUltimo"
               push
               size="lg"
               icon="done_all"
               color="positive"
               @click="avancaPosicao" />

        <q-btn v-else
               flat
               size="lg"
               icon="skip_next"
               color="primary"
               @click="avancaPosicao" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TelaColeta',
  props: [
    'produto',
    'diferenca-preco-maxima',
    'is-ultimo',
    'is-primeiro',
    'percentual-progresso-coleta'
  ],
  data() {
    return {
      alterado: false,
      precisaDeFoto: false,
      produtoAtual: {},
      handleKeyboardInterval: null
    }
  },
  created() {
    this.produtoAtual = { ...this.produto }
  },
  watch: {
    produto: {
      deep: true,
      handler() {
        this.produtoAtual = { ...this.produto }
      }
    }
  },
  methods: {
    setAlterado() {
      this.alterado = true
    },
    voltaPosicao() {
      this.atualizarPosicao(-1)
    },
    avancaPosicao() {
      this.precisaDeFoto = this.precisaTirarFoto()
      if (this.precisaDeFoto) {
        return this.tirarFoto()
      }

      if (this.alterado || this.produtoAtual.dataHoraColeta === null) {
        this.alterado = false
        this.atualizarProduto()
      }

      if (this.isUltimo) {
        return this.$emit('ultimo-produto')
      }

      this.atualizarPosicao(1)
    },
    atualizarProduto() {
      const produto = {
        ...this.produtoAtual,
        dataHoraColeta: Date.now()
      }
      this.$emit('atualizar-produto', produto)
    },
    atualizarPosicao(valor) {
      this.$emit('atualizar-posicao', valor)
      this.$refs.preco.focus()
    },
    precisaTirarFoto() {
      if (this.produtoAtual.foto !== null) {
        return false
      }

      const precoConcorrente = Number(
        this.produtoAtual.precoConcorrente.replace(',', '.')
      )
      const precoVenda = this.produtoAtual.precoVenda
      if (precoConcorrente <= 0 || precoVenda <= 0) {
        return false
      }

      const custoProduto = Number(this.produtoAtual.custo)
      if ((precoConcorrente - custoProduto) / precoConcorrente < 0.10) {
        return true
      }

      const percentual =
        (precoConcorrente - precoVenda) / precoConcorrente * 100
      const diferenca = percentual < 0 ? percentual * -1 : percentual
      return diferenca > this.diferencaPrecoMaxima
    },
    tirarFoto() {
      if (!this.$q.platform.is.cordova) {
        this.produtoAtual.foto = ''
        return
      }

      const getPictureHandler = filePath => {
        this.produtoAtual.foto = filePath
        this.avancaPosicao()
      }

      const getPictureErrorHandler = () =>
        this.$q.notify('Falha ao acessar a camera')

      navigator.camera.getPicture(getPictureHandler, getPictureErrorHandler, {
        quality: 20
      })
    },
    apagarFoto() {
      this.produtoAtual.foto = null
      this.setAlterado()
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
