<template>
  <q-page v-if="pesquisaAtual">
    <q-layout-header>
      <q-toolbar color="primary">
        <q-btn flat
               round
               dense
               icon="navigate_before"
               @click="$router.push('/pesquisas')" />

        <q-toolbar-title>
          Concorrentes
          <span slot="subtitle">{{ pesquisaAtual.nome }}</span>
        </q-toolbar-title>

        <q-btn flat
               dense
               icon="home"
               label=""
               @click="$router.push('/')" />
      </q-toolbar>
    </q-layout-header>

    <div v-if="temConcorrentes">
      <q-list separator>
        <q-item highlight
                tag="label"
                v-for="concorrente in concorrentes"
                :key="concorrente.id">
          <q-item-side>
            <q-radio v-model="idConcorrenteSelecionado"
                     :val="concorrente.id" />
          </q-item-side>

          <q-item-main class="uppercase"
                       :label="concorrente.nome">
            <q-progress class="q-mt-sm"
                        :percentage="progressoConcorrentes[concorrente.id]" />
          </q-item-main>

          <q-item-side right
                       icon="done_all"
                       color="positive"
                       v-if="progressoConcorrentes[concorrente.id] >= 100" />

          <q-item-side right
                       icon="timelapse"
                       v-else/>

          <q-context-menu>
            <q-list link
                    separator>
              <q-item v-close-overlay
                      @click.native="ignorarConcorrente(concorrente.id)"
                      class="non-selectable">
                <q-item-side icon="done_all">
                </q-item-side>
                <q-item-main label="Ignorar Concorrente" />
              </q-item>
            </q-list>
          </q-context-menu>
        </q-item>
      </q-list>

      <q-page-sticky position="bottom-left"
                     :offset="[18, 18]">
        <q-btn round
               size="lg"
               :icon="isColetasEnviadas ? 'done_all' : 'cloud_upload'"
               :color="isColetasEnviadas ? 'blue-4' : 'blue-8'"
               label=""
               v-if="isColetasEncerradas"
               :loading="enviando"
               @click="confirmaEnvioColeta" />
      </q-page-sticky>

      <q-page-sticky position="bottom-right"
                     :offset="[18, 18]">
        <q-btn round
               size="lg"
               icon="play_arrow"
               color="positive"
               label=""
               :disable="!isConcorrenteSelecionado"
               @click="selecionaConcorrente" />
      </q-page-sticky>
    </div>
    <div v-else
         class="fixed-center full-width text-center">
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
import errorHandler from '../support/errorHandler'

export default {
  name: 'Concorrentes',
  mounted() {
    if (!this.pesquisaAtual) {
      this.$router.push('/')
    }

    if (this.concorrenteAtual) {
      this.idConcorrenteSelecionado = this.concorrenteAtual.id
    }
  },
  data() {
    return {
      idConcorrenteSelecionado: null,
      enviando: false
    }
  },
  computed: {
    temConcorrentes() {
      return this.concorrentes.length > 0
    },
    pesquisaAtual() {
      return this.$store.state.coleta.pesquisaAtual
    },
    concorrenteAtual() {
      return this.$store.state.coleta.concorrenteAtual
    },
    concorrentes() {
      return this.$store.getters.concorrentes
    },
    isConcorrenteSelecionado() {
      return this.idConcorrenteSelecionado !== null
    },
    isColetasEncerradas() {
      return this.$store.getters['coleta/isColetasEncerradas']
    },
    isColetasEnviadas() {
      return this.$store.state.coleta.coletasEnviadas
    },
    progressoConcorrentes() {
      return this.$store.getters['coleta/progressoConcorrentes']
    }
  },
  methods: {
    selecionaConcorrente() {
      this.$store
        .dispatch('coleta/selecionaConcorrente', this.idConcorrenteSelecionado)
        .then(_ => {
          this.$router.push('/coleta')
        })
        .catch(_ => {})
    },
    confirmaEnvioColeta() {
      if (!this.isColetasEnviadas) {
        return this.enviaColeta()
      }

      this.$q
        .dialog({
          title: 'Coleta já enviada',
          message: 'Essa coleta já foi enviada.' + ' Deseja enviar novamente?',
          ok: {
            push: true,
            label: 'Sim'
          },
          cancel: 'Não'
        })
        .then(() => {
          this.enviaColeta()
        })
        .catch(() => {})
    },
    ignorarConcorrente(idConcorrente) {
      this.$q.dialog({
        title: 'Ignorar Concorrente',
        message: 'Deseja zerar o preço de todos os items do concorrente?',
        color: 'warning',
        ok: {
          push: true,
          label: 'Sim'
        },
        cancel: 'Não'
      }).then(() => {
        this.$store.dispatch('coleta/ignorarConcorrente', idConcorrente).catch(errorHandler('Falha ao ignorar concorrente'))
      }).catch(() => {})
    },
    enviaColeta() {
      this.enviando = true

      this.$store
        .dispatch('coleta/enviaColeta')
        .then(idColeta => {
          this.$q.notify({
            type: 'positive',
            message: `Coleta #${idColeta} enviada com sucesso!`
          })
        })
        .catch(err => {
          this.$q.notify({
            type: 'negative',
            message: 'Falha ao enviar coleta.'
          })

          errorHandler('store.dispatch(coleta/enviaColeta)')(err)
        })
        .finally(() => {
          this.enviando = false
        })
    }
  }
}
</script>
