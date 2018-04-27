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
         style="height: calc(100vh - 150px)">

      <div class="q-headline uppercase text-center">
        {{ produto.descricao }}
      </div>

      <div class="row full-width justify-center">
        <div class="row full-width justify-center">
          <div style="width: 50vw">
            <q-input v-model.lazy="produto.precoConcorrente"
                     type="tel"
                     align="right"
                     prefix="R$"
                     ref="preco"
                     v-mask="'money'"
                     style="font-size: 2em"
                     autofocus
                     clearable
                     @keyup.enter="avancarProduto" />
          </div>
        </div>

        <q-checkbox class="q-mt-lg"
                    v-model="produto.promocao"
                    :disable="!produto.precoConcorrente.length"
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
             size="lg"
             icon="photo_camera"
             color="negative"
             class="animate-pop"
             @click="tirarFoto()" />
      <q-btn v-if="ultimoItem"
             push
             size="lg"
             icon="check"
             color="positive"
             @click="avancarProduto" />
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
      produto: {},
      precisaDeFoto: false
    }
  },
  created() {
    if (!this.$store.getters['coleta/emAndamento']) {
      return this.$router.push('/')
    }

    this.carregaProduto()
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
    carregaProduto() {
      this.produto = { ...this.produtoAtual }
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

      if (this.produtoFoiAlterado()) {
        this.atualizaProduto()
      }

      if (this.ultimoItem) {
        return this.$router.push('/concorrentes')
      }

      this.atualizarPosicaoProduto(1)
    },
    precisaTirarFoto() {
      if (this.produto.foto !== null) {
        return false
      }

      const diferencaMaxima = 25
      if (this.calculaDiferencaPrecoEmPercentual() < diferencaMaxima) {
        return false
      }

      if (Number(this.produto.precoConcorrente.replace(',', '.')) === 0) {
        return false
      }

      this.$q.notify({
        position: 'top',
        type: 'warning',
        icon: 'photo_camera',
        timeout: 1500,
        message: 'Tire uma foto da etiqueta do produto.'
      })

      return true
    },
    calculaDiferencaPrecoEmPercentual() {
      if (this.produto.precoVenda <= 0) {
        return 0
      }
      const precoConcorrente = Number(
        this.produto.precoConcorrente.replace(',', '.')
      )
      const diferenca =
        (precoConcorrente - this.produto.precoVenda) / precoConcorrente * 100
      return diferenca < 0 ? diferenca * -1 : diferenca
    },
    produtoFoiAlterado() {
      if (this.produto.dataHoraColeta === null) {
        return true
      }

      const props = ['precoConcorrente', 'promocao']
      return props
        .map(prop => this.produto[prop] !== this.produtoAtual[prop])
        .some(isTrue => isTrue)
    },
    atualizaProduto() {
      const produto = {
        ...this.produto,
        dataHoraColeta: Date.now()
      }
      this.$store.commit('coleta/atualizarProduto', produto)
    },
    atualizarPosicaoProduto(value) {
      this.$store.commit('coleta/atualizarPosicaoProduto', value)
      this.carregaProduto()
      this.$refs.preco.focus()
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
          destinationType: 0 // DATA_URL
        }
      )
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
