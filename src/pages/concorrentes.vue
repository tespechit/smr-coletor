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
        <q-item highlight
                tag="label"
                v-for="concorrente in concorrentes"
                :key="concorrente.id">
          <q-item-side>
            <q-radio v-model="idConcorrente"
                     :val="concorrente.id"/>
          </q-item-side>
          <q-item-main class="uppercase"
                       :label="concorrente.nome">
            <q-progress class="q-mt-sm"
                        :percentage="progressoConcorrentes[concorrente.id]" />
          </q-item-main>

          <q-item-side>
            <q-icon name="done_all" color="positive" size="30px" v-if="progressoConcorrentes[concorrente.id] >= 100"/>
            <q-icon name="timelapse" color="light" size="30px" v-else/>
          </q-item-side>

          <q-context-menu class="non-selectable">
            <q-list-header>Ações</q-list-header>

            <q-list :highlight="false"
                    link>
              <q-item v-close-overlay
                      @click.native="pularConcorrente(concorrente.id)">
                <q-item-side>
                  <q-icon size="36px"
                          name="fast_forward"
                          color="faded" />
                </q-item-side>
                <q-item-main label="Pular Concorrente"
                             sublabel="Avança até último produto." />
              </q-item>

              <q-item v-close-overlay
                      @click.native="resetarConcorrente(concorrente.id)">
                <q-item-side>
                  <q-icon size="36px"
                          name="undo"
                          color="faded" />
                </q-item-side>
                <q-item-main label="Resetar Concorrente"
                             sublabel="Volta ao primeiro produto." />
              </q-item>
            </q-list>
          </q-context-menu>
        </q-item>
      </q-list>

      <div class="fixed-bottom">
        <q-btn push
               size="lg"
               icon="play_arrow"
               class="full-width"
               :disable="concorrenteNaoSelecionado"
               color="positive"
               label="Iniciar Coleta"
               @click="iniciarColeta" />
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
    },
    concorrenteConcluido() {
      return this.progressoConcorrentes === 100
    }
  },
  methods: {
    iniciarColeta() {
      const concorrente = this.concorrentes.find(
        concorrente => concorrente.id === this.idConcorrente
      )

      this.$store.commit('coleta/setConcorrenteAtual', concorrente)
      this.$router.push('/coleta')
    },
    pularConcorrente(idConcorrente) {
      this.$q
        .dialog({
          title: 'Pular Concorrente',
          message:
            'Essa operação vai zerar o preço de todos os produtos a partir do último coletado.' +
            ' Deseja continuar?',
          ok: {
            push: true,
            color: 'negative',
            label: 'Sim'
          },
          cancel: 'Não'
        })
        .then(() => {
          this.$store
            .commit('coleta/pularConcorrente', idConcorrente)
            .then(() => {
              this.$q.notify({
                type: 'positive',
                message: 'Concorrente ignorado com sucesso!',
                timeout: 1000
              })
            })
        })
        .catch(() => {})
    },
    resetarConcorrente(idConcorrente) {
      this.$q
        .dialog({
          title: 'Resetar Concorrente',
          message:
            'Essa operação vai voltar a posição do primeiro produto.' +
            ' Deseja continuar?',
          ok: {
            push: true,
            color: 'negative',
            label: 'Sim'
          },
          cancel: 'Não'
        })
        .then(() => {
          this.$store
            .commit('coleta/resetarConcorrente', idConcorrente)
            .then(() => {
              this.$q.notify({
                type: 'positive',
                message: 'Concorrente resetado com sucesso!',
                timeout: 1000
              })
            })
        })
        .catch(() => {})
    }
  }
}
</script>
