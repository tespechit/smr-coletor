<template>
  <q-page class="row q-mb-xl">
     <q-layout-header>
      <q-toolbar color="primary">
      <q-btn flat round dense icon="arrow_back" @click="$router.push('/')"/>
        <q-toolbar-title>
          Pesquisas
        </q-toolbar-title>
      </q-toolbar>
    </q-layout-header>

    <p class="fixed-center text-center" v-if="pesquisas.length === 0">
      <q-spinner-oval color="primary" size="32"></q-spinner-oval><br><br>
      <span>Carregando...</span>
    </p>

    <q-list no-border separator class="full-width">
      <q-item sparse tag="label" v-for="pesquisa in pesquisas" :key="pesquisa">
        <q-item-side>
          <q-radio v-model="pesquisaSelecionada" :val="pesquisa" />
        </q-item-side>
        <q-item-main :label="pesquisa" />
      </q-item>
    </q-list>

    <div class="fixed-bottom q-pa-sm" style="background: rgba(247,247,247,.8)">
      <q-btn size="lg" icon="play_arrow" class="full-width" :disable="pesquisaNaoSelecionada" color="positive" label="Começar" @click="comecarColeta()"/>
    </div>
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
      pesquisas: [
      ]
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
