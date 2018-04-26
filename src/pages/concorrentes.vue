<template>
  <q-page style="padding-bottom: 52px">
    <q-layout-header>
      <q-toolbar color="primary">
        <q-btn flat
               round
               dense
               icon="navigate_before"
               @click="$router.push('/pesquisas')" />
        <q-toolbar-title>
          Concorrentes
        </q-toolbar-title>

        <q-btn flat
               dense
               icon="home"
               label=""
               @click="$router.push('/')" />
      </q-toolbar>
    </q-layout-header>

    <div v-if="concorrentes.length">
      <q-list separator>
        <q-item sparse
                highlight
                tag="label"
                v-for="concorrente in concorrentes"
                :key="concorrente.id">
          <q-item-side>
            <q-radio v-model="idConcorrente"
                     :val="concorrente.id" />
          </q-item-side>
          <q-item-main class="uppercase"
                       :label="concorrente.nome">
            <q-progress class="q-mt-sm"
                        :percentage="progressoConcorrentes[concorrente.id]" />
          </q-item-main>

          <q-context-menu class="non-selectable">
            <q-list-header>Opções</q-list-header>

            <q-list :highlight="false"
                    link>
              <q-item v-close-overlay
                      @click.native="avancarConcorrente(concorrente.id)">
                <q-item-side>
                  <q-icon size="36px"
                          name="warning"
                          color="negative" />
                </q-item-side>
                <q-item-main label="Pular Concorrente"
                             sublabel="Zerar preço dos produtos" />
              </q-item>
            </q-list>
          </q-context-menu>
        </q-item>
      </q-list>

      <div class="fixed-bottom">
        <q-btn size="lg"
               icon="play_arrow"
               class="full-width"
               :disable="concorrenteNaoSelecionado"
               color="positive"
               label="Começar"
               @click="comecar" />
      </div>
    </div>

    <div class="fixed-center full-width text-center"
         v-else>
      <p>
        <q-icon name="warning"
                color="warning"
                size="64px"></q-icon>
      </p>

      <p class="q-title upp">Nenhum concorrente disponível</p>
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
  name: 'Concorrentes',
  data() {
    return {
      idConcorrente: null
    }
  },
  computed: {
    concorrentes() {
      return this.$store.getters['global/concorrentes']
    },
    concorrenteNaoSelecionado() {
      return this.idConcorrente === null
    },
    progressoConcorrentes() {
      return this.$store.getters['coleta/progressoConcorrentes']
    }
  },
  methods: {
    comecar() {
      const concorrente = this.concorrentes.find(
        concorrente => concorrente.id === this.idConcorrente
      )

      this.$store.commit('coleta/setConcorrenteAtual', concorrente)
      this.$router.push('/coleta')
    },
    avancarConcorrente(idConcorrente) {
      this.$q
        .dialog({
          title: 'Pular Concorrente',
          message:
            'Deseja realmente zerar o preço de todos os produtos desse concorrente?',
          ok: {
            push: true,
            color: 'negative',
            label: 'Sim'
          },
          cancel: 'Não'
        })
        .then(() => {
          this.$store
            .commit('coleta/avancarConcorrente', idConcorrente)
            .then(() => {
              this.$q.notify({
                type: 'positive',
                message: 'Concorrente ignorado com sucesso!',
                timeout: 1000
              })
            })
        })
        .catch(() => {})
    }
  }
}
</script>
