<template>
  <q-page padding>
    <q-layout-header>
      <q-toolbar color="primary">
        <q-btn flat
               dense
               round
               @click="drawerOpen = !drawerOpen"
               aria-label="Menu">
          <q-icon name="settings" />
        </q-btn>

        <q-toolbar-title>
          SMR
          <div slot="subtitle">Aplicativo de Coleta
            <em>v1.1.5</em>
          </div>
        </q-toolbar-title>
      </q-toolbar>
    </q-layout-header>

    <q-layout-drawer v-model="drawerOpen"
                     :content-class="'bg-grey-2'">
      <q-list no-border
              inset-delimiter>
        <q-list-header>Configurações</q-list-header>

        <q-item>
          <q-item-main>
            <q-select float-label="Loja"
                      radio
                      :options="lojasOptions"
                      :value="lojaAtual.id"
                      @input="alteraLojaAtual" />
          </q-item-main>
        </q-item>
        <q-item>
          <q-item-main class="text-center">
            <q-btn rounded
                   color="positive"
                   class="full-width"
                   label="Sincronizar"
                   :loading="isSincronizando"
                   icon="sync"
                   @click="sincronizar"
                   v-touch-hold.prevent:1000="limpaStore" />

            <div class="q-pt-sm">
              <small class="q-body-2 text-grey-8"
                     v-if="dataUltimaSincronizacao"> Última sincronização feita em: <br> {{ dataUltimaSincronizadaoFormatada
                }}
              </small>
              <small class="q-body-2 text-red-8"
                     v-else>
                <q-icon name="warning" /> Aplicativo ainda não foi sincronizado.</small>
            </div>
          </q-item-main>
        </q-item>
      </q-list>

      <div class="absolute-bottom full-width text-center">
        <div class="q-pb-lg">
          <img alt="SMR Logo"
               style="height: 48px"
               src="~assets/logo.png"
               @click="easterEgg++">
          <div v-if="easterEgg > 3"
               class="text-grey-6 q-caption">
            Desenvolvido por Gustavo Novaes
          </div>
        </div>
      </div>
    </q-layout-drawer>

    <div class="absolute-center text-center"
         style="width: 70vw">
      <q-btn size="lg"
             rounded
             color="primary"
             class="full-width q-mb-lg"
             label="Começar"
             icon="add"
             @click="$router.push('/pesquisas')" />
      <q-btn push
             rounded
             size="lg"
             class="full-width q-mb-lg"
             label="Continuar"
             v-if="isPesquisaSelecionada"
             icon="forward"
             @click="continuarColeta" />
    </div>

    <q-page-sticky position="bottom"
                   class="text-center"
                   :offset="[18, 18]">
      <q-chip class="q-body-1">{{ lojaAtual.descricao }}</q-chip>
    </q-page-sticky>
  </q-page>
</template>

<script>
import { date } from 'quasar'
import errorHandler from '../support/errorHandler'

export default {
  name: 'Inicio',
  mounted() {
    if (navigator.splashscreen) {
      navigator.splashscreen.hide()
    }

    this.$bus.$on('store', () => {
      if (this.isDesatualizado) {
        this.$q.notify({
          type: 'warning',
          message: 'Coletor desatualizado!',
          timeout: 0,
          actions: [ { label: 'Sincronizar', handler: () => this.sincronizar() } ]
        })
      }
    })
  },
  data() {
    return {
      easterEgg: 1,
      drawerOpen: false,
      isSincronizando: false
    }
  },
  computed: {
    lojas() {
      return this.$store.state.lojas
    },
    lojasOptions() {
      return this.lojas.map(loja => {
        return {
          value: loja.id,
          label: loja.descricao
        }
      })
    },
    lojaAtual() {
      return this.$store.state.lojaAtual
    },
    coletaAtual() {
      return this.$store.state.coleta.coletaAtual
    },
    dataUltimaSincronizacao() {
      return this.$store.state.dataUltimaSincronizacao
    },
    dataUltimaSincronizadaoFormatada() {
      return date.formatDate(
        this.dataUltimaSincronizacao,
        'DD/MM/YYYY HH:mm:ss'
      )
    },
    isDesatualizado() {
      if (this.dataUltimaSincronizacao === null) {
        return true
      }

      const diff = Date.now() - this.dataUltimaSincronizacao
      const dias = Math.floor(diff / 86400000)

      return dias > 1
    },
    isPesquisaSelecionada() {
      return this.$store.state.coleta.pesquisaAtual !== null
    }
  },
  methods: {
    alteraLojaAtual(idLoja) {
      const loja = this.lojas.find(loja => loja.id === idLoja)
      this.$store.dispatch('alteraLojaAtual', loja)
    },
    sincronizar() {
      this.isSincronizando = true
      this.$store
        .dispatch('sincronizaDadosLoja')
        .then(() => {
          this.$q.notify({
            type: 'positive',
            message: 'Sincronizado com sucesso!',
            timeout: 800
          })
        })
        .catch(err => {
          this.$q.notify({
            type: 'negative',
            message: 'Falha ao sincronizar dados da loja.'
          })
          errorHandler('store.dispatch(sincronizarDadosLoja)')(err)
        })
        .finally(() => {
          this.isSincronizando = false
        })
    },
    continuarColeta() {
      if (this.coletaAtual && !this.coletaAtual.isEncerrada) {
        return this.$router.push('/coleta')
      }

      return this.$router.push('/concorrentes')
    },
    limpaStore(_) {
      this.$q.notify({
        type: 'negative',
        message: 'Banco de Dados apagado!',
        timeout: 1500
      })

      this.$store.dispatch('limparStore')
    }
  }
}
</script>
