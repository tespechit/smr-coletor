<template>
  <q-page>
    <q-layout-header>
      <q-toolbar color="primary">
        <q-btn flat round dense icon="navigate_before" @click="$router.push('/')"/>
        <q-toolbar-title>
          Pesquisas
        </q-toolbar-title>
      </q-toolbar>
    </q-layout-header>

    <div v-if="pesquisas.length">
      <q-list separator>
        <q-item sparse highlight tag="label" v-for="pesquisa in pesquisas" :key="pesquisa.id">
          <q-item-side>
            <q-radio v-model="idPesquisa" :val="pesquisa.id" />
          </q-item-side>
          <q-item-main class="uppercase" :label="pesquisa.nome" />
          <q-item-side right v-if="pesquisa.id === idPesquisaSugestao">
            <q-icon name="star" size="23px" color="amber" />
          </q-item-side>
        </q-item>
      </q-list>

      <div class="fixed-bottom q-pa-sm">
        <q-btn size="lg" icon="navigate_next" class="full-width" :disable="pesquisaNaoSelecionada" color="positive" label="Avançar" @click="avancar()"/>
      </div>
    </div>

    <div class="fixed-center full-width text-center" v-else>
      <p>
        <q-icon name="warning" color="warning" size="64px"></q-icon>
      </p>

      <p class="q-title upp">Nenhuma pesquisa disponível</p>
      <p class="q-subheading">Sincronize o aplicativo através do menu de configurações <q-icon name="settings"/> na tela inicial.</p>

      <p class="q-mt-lg">
        <q-btn size="lg" label="voltar" @click="$router.push('/')"/>
      </p>
    </div>
  </q-page>
</template>

<style>

</style>

<script>
export default {
  name: 'Pesquisas',
  computed: {
    pesquisas() {
      return this.$store.state.pesquisas
    },
    idPesquisaSugestao() {
      return this.$store.state.idPesquisaSugestao
    },
    pesquisaNaoSelecionada() {
      return this.idPesquisa === null
    }
  },
  data() {
    return {
      idPesquisa: null
    }
  },
  methods: {
    avancar() {
      // TODO: Confirmar se deseja sobrescrever coleta em andamento
      this.$store.dispatch('selecionaPesquisa', this.idPesquisa)
      this.$router.push('/concorrentes')
    }
  }
}
</script>
