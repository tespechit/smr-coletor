<template>
  <q-page class="row">
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

    <q-list separator class="full-width q-mb-xl" >
      <q-item sparse tag="label" v-for="pesquisa in pesquisas" :key="pesquisa.id">
        <q-item-side>
          <q-radio v-model="idPesquisa" :val="pesquisa.id" />
        </q-item-side>
        <q-item-main :label="pesquisa.nome" />
        <q-item-side right v-if="pesquisa.id === idPesquisaSugestao">
          <q-icon name="star" size="23px" color="amber" />
        </q-item-side>
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
      return this.idPesquisa === null
    }
  },
  data() {
    return {
      idPesquisa: null,
      idPesquisaSugestao: null,
      pesquisas: []
    }
  },
  created() {
    this.$store
      .dispatch('carregarPesquisas')
      .then(({ idPesquisaSugestao, pesquisas }) => {
        this.idPesquisa = this.idPesquisaSugestao = idPesquisaSugestao
        this.pesquisas = pesquisas
      })
      .catch(() => {
        this.$q.notify({
          icon: 'error',
          message: 'Falha ao obter pesquisas',
          type: 'negative'
        })
      })
  },
  methods: {
    comecarColeta() {
      // TODO: Baixar e carregar pesquisa selecionada
      // TODO: Ir para proxima tela
    }
  }
}
</script>
