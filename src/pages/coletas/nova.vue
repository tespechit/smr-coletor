<template>
  <q-page class="row">
     <q-layout-header>
      <q-toolbar color="primary">
        <q-toolbar-title>
          Selecione uma Pesquisa
        </q-toolbar-title>
      </q-toolbar>
    </q-layout-header>

    <span class="fixed-center" v-if="pesquisas.length === 0">Carregando pesquisas...  </span>

    <q-list no-border separator class="full-width">
      <q-item sparse tag="label" v-for="pesquisa in pesquisas" :key="pesquisa">
        <q-item-side>
          <q-radio v-model="pesquisaSelecionada" :val="pesquisa" />
        </q-item-side>
        <q-item-main :label="pesquisa" />
      </q-item>
    </q-list>

    <q-layout-footer color="secondary">
      <q-toolbar class="justify-between">
        <q-btn size="md" icon="arrow_back" color="white" textColor="dark" label="Voltar" @click="$router.push('/')"/>
        <q-btn size="md" icon-right="play_arrow" :disable="pesquisaNaoSelecionada" color="positive" label="Começar" @click="comecarColeta()"/>
      </q-toolbar>
    </q-layout-footer>
  </q-page>
</template>

<style>

</style>

<script>
export default {
  name: 'Criar',
  computed: {
    pesquisaNaoSelecionada() {
      return this.pesquisaSelecionada === null
    }
  },
  data() {
    return {
      pesquisaSelecionada: null,
      pesquisas: []
    }
  },
  created() {
    // TODO: Carregar pesquisas
  },
  methods: {
    comecarColeta() {
      // TODO: Baixar e carregar pesquisa selecionada
      // TODO: Ir para proxima tela
    }
  }
}
</script>
