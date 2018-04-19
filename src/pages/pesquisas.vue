<template>
  <q-page style="padding-bottom: 52px">
    <q-layout-header>
      <q-toolbar color="primary">
        <q-btn flat
               round
               dense
               icon="navigate_before"
               @click="$router.push('/')" />
        <q-toolbar-title>
          Pesquisas
        </q-toolbar-title>
      </q-toolbar>
    </q-layout-header>

    <div v-if="pesquisas.length">
      <q-list separator>
        <q-item sparse
                highlight
                tag="label"
                v-for="pesquisa in pesquisas"
                :key="pesquisa.id">
          <q-item-side>
            <q-radio v-model="idPesquisa"
                     :val="pesquisa.id" />
          </q-item-side>
          <q-item-main class="uppercase"
                       :label="pesquisa.nome" />
          <q-item-side right
                       v-if="pesquisa.id === idPesquisaSugestao">
            <q-icon name="star"
                    size="23px"
                    color="amber" />
          </q-item-side>
        </q-item>
      </q-list>

      <div class="fixed-bottom">
        <q-btn size="lg"
               icon="navigate_next"
               class="full-width"
               :disable="pesquisaNaoSelecionada"
               color="positive"
               label="Avançar"
               @click="verificarSeExisteOutraPesquisa()" />
      </div>
    </div>

    <div class="fixed-center full-width text-center"
         v-else>
      <p>
        <q-icon name="warning"
                color="warning"
                size="64px"></q-icon>
      </p>

      <p class="q-title upp">Nenhuma pesquisa disponível</p>
      <p class="q-subheading">Sincronize o aplicativo através do menu de configurações
        <q-icon name="settings" /> na tela inicial.</p>

      <p class="q-mt-lg">
        <q-btn size="lg"
               label="voltar"
               @click="$router.push('/')" />
      </p>
    </div>
  </q-page>
</template>

<script>
export default {
  name: 'Pesquisas',
  computed: {
    pesquisas() {
      return this.$store.getters['global/pesquisas']
    },
    idPesquisaSugestao() {
      return this.$store.state.global.idPesquisaSugestao
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
    verificarSeExisteOutraPesquisa() {
      const pesquisaEmAndamento = this.$store.state.coleta.pesquisaAtual

      if (!pesquisaEmAndamento) {
        return
      }

      this.$q
        .dialog({
          color: 'warning',
          title: 'Pesquisa  detectada!',
          message:
            `A pesquisa "${pesquisaEmAndamento.nome}" já está em andamento. Deseja realmente APAGAR e COMEÇAR UMA NOVA?`,
          stackButtons: true,
          cancel: 'Não',
          ok: {
            push: true,
            color: 'negative',
            label: 'Apagar e Começar uma Nova'
          }
        })
        .then(() => {
          this.avancar()
        })
        .catch(() => {})
    },
    avancar() {
      const pesquisa = this.pesquisas.find(
        pesquisa => pesquisa.id === this.idPesquisa
      )

      const concorrentes = this.$store.getters['global/concorrentes']

      this.$store
        .dispatch('coleta/iniciar', { pesquisa, concorrentes })
        .then(() => {
          this.$router.push('/concorrentes')
        })
    }
  }
}
</script>
