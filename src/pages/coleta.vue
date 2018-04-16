<template>
  <q-page padding>
    <q-layout-header>
      <q-toolbar color="primary">
        <q-btn flat round dense icon="navigate_before" @click="voltar"/>
        <q-toolbar-title>Coleta</q-toolbar-title>
        <q-btn flat dense icon="home" label="" @click="sair"/>
      </q-toolbar>
    </q-layout-header>

    <q-breadcrumbs
      class="justify-center"
      separator=">"
      active-color="dark"
      color="dark"
    >
        <q-breadcrumbs-el :label="pesquisaAtual" />
        <q-breadcrumbs-el :label="concorrenteAtual"/>
    </q-breadcrumbs>

    <div class="row justify-center items-center" style="height: calc(100vh - 130px)">

      <big class="text-center">{{ item.descricao }}</big>

      <div class="row full-width justify-center">
        <div style="width: 40vw">
          <q-input stack-label=""
          v-model.lazy="item.preco"
          type="tel"
          align="right"
          prefix="R$"
          ref="preco"
          @click="$refs.preco.select()"
          v-money="money"/>
        </div>
      </div>

      <div class="row">
        <q-checkbox class="q-mt-lg" v-model="item.promocao" label="Promoção" />
      </div>
    </div>

    <div class="fixed-bottom flex justify-between q-pa-sm" style="background: rgba(247,247,247,.8)">
      <q-btn flat size="lg" icon="skip_previous" :disable="primeiroItem" color="primary" @click="voltarItem()"/>
      <q-btn rounded v-if="itemPrecisaDeConfirmacaoComFoto" size="lg" icon="photo_camera" color="negative" @click="tirarFoto()"/>
      <q-btn flat size="lg" icon="skip_next" :disable="ultimoItem" color="primary" @click="avancarItem()"/>
      <q-progress class="q-mt-sm" :percentage="percentualConcluido" />
    </div>
  </q-page>
</template>

<script>
import { VMoney } from 'v-money'

export default {
  name: 'Coleta',
  directives: {
    money: VMoney
  },
  mounted () {
  },
  data: () => {
    return {
      money: {
        decimal: ',',
        thousands: '.',
        precision: 2,
        masked: false
      }
    }
  },
  computed: {
    pesquisaAtual() {
      return this.$store.getters.pesquisaColeta.nome
    },

    concorrenteAtual() {
      return this.$store.getters.concorrenteColeta.nome
    },

    primeiroItem() {
      return true
    },

    ultimoItem() {
      return false
    },

    itemPrecisaDeConfirmacaoComFoto() {
      // Preço digitado é diferente de X%
      return false
    },

    percentualConcluido() {
      return 1
    },

    item() {
      return {
        id: 123123,
        descricao: 'Descricao'
      }
    }
  },
  methods: {
    sairDaColeta(url, message) {
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
    },

    voltar() {
      this.sairDaColeta('/concorrentes', 'Deseja voltar para a tela de concorrentes?')
    },

    sair() {
      this.sairDaColeta('/concorrentes', 'Deseja voltar para a tela de inicial?')
    },

    encerrarColeta() {
      // TODO
    },

    voltarItem() {
      // TODO
    },

    avancarItem() {
      // TODO
    },

    tirarFoto() {
      // TODO
    }
  }
}
</script>

<style>
.form {
  max-width: 40vw;
}
</style>
