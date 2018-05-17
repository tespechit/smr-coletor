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
          <div slot="subtitle">Aplicativo de Coleta</div>
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
                      :options="lojas"
                      :value="idLoja"
                      @input="alterarLoja" />
          </q-item-main>
        </q-item>
        <q-item>
          <q-item-main class="text-center">
            <q-btn rounded
                   color="positive"
                   class="full-width"
                   label="Sincronizar"
                   :loading="sincronizando"
                   icon="sync"
                   @click="sincronizar" />

            <div class="q-pt-sm">
              <small class="q-body-2 text-grey-8"
                     v-if="dataUltimaSincronizacao !== null"> Última sincronização feita em: <br> {{ dataUltimaSincronizacao }}</small>
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
               src="~assets/smr-logo.png"
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
      <p class="q-caption">Coleta</p>
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
             :disable="!coletaEmAndamento"
             icon="forward"
             @click="continuar" />
    </div>

    <q-page-sticky position="bottom"
                   class="text-center"
                   :offset="[18, 18]">
      <p class="q-caption">Loja</p>
      <q-chip class="q-body-1">{{ lojaAtualNome }}</q-chip>
    </q-page-sticky>
  </q-page>
</template>

<script>
export default {
  name: 'Inicio',
  data() {
    return {
      easterEgg: 1,
      drawerOpen: false,
      sincronizando: false
    }
  },
  computed: {
    lojas() {
      return this.$store.state.global.lojas
    },
    idLoja() {
      return this.$store.state.global.idLoja
    },
    lojaAtualNome() {
      return this.lojas.find(loja => loja.value === this.idLoja).label
    },
    dataUltimaSincronizacao() {
      return this.$store.state.global.dataUltimaSincronizacao
    },
    coletaEmAndamento() {
      return this.$store.getters['coleta/emAndamento']
    }
  },
  methods: {
    alterarLoja(idLoja) {
      this.$store.dispatch('global/alterarLoja', { idLoja })
    },
    sincronizar() {
      this.sincronizando = true
      this.$store
        .dispatch('global/sincronizarDadosLoja')
        .then(() => {
          this.$q.notify({
            type: 'positive',
            message: 'Sincronizado com sucesso!',
            timeout: 1500
          })
        })
        .catch(err => {
          if (err) {
            console.error(err)
          }
          this.$q.notify({
            type: 'negative',
            message: 'Falha ao sincronizar App'
          })
        })
        .finally(() => {
          this.sincronizando = false
        })
    },
    continuar() {
      if (this.$store.state.coleta.concorrenteAtual === null) {
        return this.$router.push('/concorrentes')
      }

      if (this.$store.getters['coleta/coletaAtual'].encerrada) {
        return this.$router.push('/concorrentes')
      }

      return this.$router.push('/coleta')
    }
  }
}
</script>
