<template>
  <q-page style="padding-bottom: 52px">
    <q-layout-header>
      <q-toolbar color="primary">
        <q-btn flat round dense icon="navigate_before" @click="$router.push('/pesquisas')"/>
        <q-toolbar-title>
          Concorrentes
        </q-toolbar-title>
      </q-toolbar>
    </q-layout-header>

    <div v-if="concorrentes.length">
      <q-list separator>
        <q-item sparse highlight tag="label" v-for="concorrente in concorrentes" :key="concorrente.id">
          <q-item-side>
            <q-radio v-model="idConcorrente" :val="concorrente.id" />
          </q-item-side>
          <q-item-main class="uppercase" :label="concorrente.nome">
            <q-progress class="q-mt-sm" :percentage="30" />
          </q-item-main>
        </q-item>
      </q-list>

      <div class="fixed-bottom">
        <q-btn size="lg" icon="play_arrow" class="full-width" :disable="concorrenteNaoSelecionado" color="positive" label="Começar" @click="comecar()"/>
      </div>
    </div>

    <div class="fixed-center full-width text-center" v-else>
      <p>
        <q-icon name="warning" color="warning" size="64px"></q-icon>
      </p>

      <p class="q-title upp">Nenhum concorrente disponível</p>
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
  name: 'Concorrentes',
  computed: {
    concorrentes() {
      const concorrentes = this.$store.state.concorrentes
      return concorrentes.sort((a, b) => {
        return a.ordem < b.ordem ? -1 : 1
      })
    },

    concorrenteNaoSelecionado() {
      return this.idConcorrente === null
    }
  },
  data() {
    return {
      idConcorrente: null
    }
  },
  methods: {
    comecar() {
      this.$store.dispatch('selecionaConcorrente', this.idConcorrente)
      this.$router.push('/coleta')
    }
  }
}
</script>
