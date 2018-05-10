<template>
  <div class="flex items-center q-pa-sm debug"
       style="height: calc(100vh - 50px">

    <div class="full-width">
      <div class="q-headline uppercase text-center">
        {{ produto.descricao }}
      </div>
    </div>

    <div class="full-width">
      <div class="row">
        <div class="col-6 offset-3">
          <q-input v-model="produto.precoConcorrente"
                   type="tel"
                   align="right"
                   prefix="R$"
                   ref="preco"
                   v-mask="'money'"
                   autofocus
                   clearable
                   @keyup.enter="proximo"
                   @input="setAlterado" />
        </div>
      </div>

      <div class="row justify-center">
        <q-checkbox class="q-mt-lg"
                    v-model="produto.promocao"
                    :disable="!produto.precoConcorrente.length"
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
               @click="voltar" />

        <q-btn v-if="precisaDeFoto && produto.foto == null"
               flat
               size="lg"
               icon="photo_camera"
               color="blue-8"
               class="animate-pop"
               @click="tirarFoto" />

        <q-btn v-if="produto.foto"
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
               @click="proximo" />

        <q-btn v-else
               flat
               size="lg"
               icon="skip_next"
               color="primary"
               @click="proximo" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'NavegadorProdutos',
  props: ['produtos', 'posicao', 'diferenca-preco-maxima'],
  data() {
    return {
      alterado: false,
      precisaDeFoto: false
    }
  },
  computed: {
    produto() {
      return this.produtos[this.posicao - 1]
    },
    isPrimeiro() {
      return this.posicao === 1
    },
    isUltimo() {
      return this.posicao === this.produtos.length
    },
    percentualProgressoColeta() {
      return this.posicao / this.produtos.length * 100
    },
    precoConcorrente() {
      return Number(this.produto.precoConcorrente.replace(',', '.'))
    }
  },
  methods: {
    setAlterado() {
      this.alterado = true
    },
    voltar() {
      this.atualizarPosicao(-1)
    },
    proximo() {
      this.precisaDeFoto = this.precisaTirarFoto()
      if (this.precisaDeFoto) {
        return this.$q.notify({
          position: 'top',
          type: 'warning',
          icon: 'photo_camera',
          timeout: 1500,
          message: 'Tire uma foto da etiqueta do produto.'
        })
      }

      if (this.alterado || this.produto.dataHoraColeta === null) {
        this.alterado = false
        this.atualizaProduto()
      }

      if (this.isUltimo) {
        return this.$router.push('/concorrentes')
      }

      this.atualizarPosicao(1)
    },
    atualizaProduto() {
      const produto = {
        ...this.produto,
        dataHoraColeta: Date.now()
      }
      this.$emit('atualizar-produto', produto)
    },
    atualizarPosicao(valor) {
      this.$emit('atualizar-posicao', valor)
      this.$refs.preco.focus()
    },
    precisaTirarFoto() {
      if (this.produto.foto !== null) {
        return false
      }

      const precoConcorrente = Number(
        this.produto.precoConcorrente.replace(',', '.')
      )
      const precoVenda = this.produto.precoVenda
      if (precoConcorrente <= 0 || precoVenda <= 0) {
        return false
      }

      const percentual =
        (precoConcorrente - precoVenda) / precoConcorrente * 100
      const diferenca = percentual < 0 ? percentual * -1 : percentual
      return diferenca > this.diferencaPrecoMaxima
    },
    tirarFoto() {
      if (!this.$q.platform.is.cordova) {
        this.produto.foto =
          'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'
        return this.$q.notify({
          position: 'top',
          type: 'warning',
          timeout: 500,
          message: 'Foto ignorada com sucesso!'
        })
      }

      navigator.camera.getPicture(
        image => {
          this.produto.foto = 'data:image/jpeg;base64,' + image
          this.$q.notify({
            position: 'top',
            type: 'positive',
            timeout: 1500,
            message: 'Foto salva com sucesso!'
          })
        },
        () => {
          this.$q.notify('Falha ao acessar a camera')
        },
        {
          quality: 20,
          destinationType: 0 // DATA_URL
        }
      )
    },
    apagarFoto() {
      this.produto.foto = null;
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
</style>
