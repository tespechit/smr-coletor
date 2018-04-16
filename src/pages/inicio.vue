<template>
  <q-page class="flex flex-center">
    <q-layout-header>
      <q-toolbar color="primary">

        <q-btn
          flat
          dense
          round
          @click="drawerOpen = !drawerOpen"
          aria-label="Menu"
        >
          <q-icon name="settings" />
        </q-btn>

        <q-toolbar-title>
          SMR <div slot="subtitle">Aplicativo de Coleta</div>
        </q-toolbar-title>
      </q-toolbar>
    </q-layout-header>

    <q-layout-drawer
      v-model="drawerOpen"
      :content-class="'bg-grey-2'"
    >
      <q-list
        no-border
        inset-delimiter
      >
        <q-list-header>Configurações</q-list-header>

        <q-item>
          <q-item-main>
            <q-select
              float-label="Loja"
              radio
              :options="lojas"
              :value="idLoja"
              @input="alteraLoja"
            />
          </q-item-main>
        </q-item>
        <q-item>
          <q-item-main class="text-center">
            <q-btn push color="positive" class="full-width" label="Sincronizar" :loading="sincronizando" icon="sync" @click="sincronizar" />
            <small class="q-caption text-grey-8" v-if="dataUltimaSincronizacao !== null"> Última sincronização em: {{ dataUltimaSincronizacao }}.</small>
            <small class="q-caption text-red-8" v-else> <q-icon name="warning"/> Aplicativo ainda não foi sincronizado.</small>
          </q-item-main>
        </q-item>
      </q-list>

      <div class="absolute-bottom full-width text-center">
        <div class="q-pb-lg">
          <img alt="SMR Logo" style="height: 48px" src="~assets/smr-logo.png" @click="easteregg++">
          <div v-if="easteregg > 3" class="text-grey-6 q-caption">
            Desenvolvido por Gustavo Novaes
          </div>
        </div>
      </div>
    </q-layout-drawer>

    <div class="botoes-acoes-coleta">
      <div class="row">
        <div class="col">
          <q-btn push size="lg" color="primary" class="full-width" label="Nova Coleta" icon="playlist_add" @click="$router.push('/pesquisas')"/>
          <q-btn push size="lg" class="full-width" label="Continuar" icon="forward" @click="continuar"/>
          <q-btn push size="lg" color="positive" class="full-width" label="Enviar Coleta" icon="file_upload" @click="enviar" />
        </div>
      </div>
    </div>

    <q-page-sticky position="bottom" :offset="[18, 18]">
      <q-chip class="q-body-1">Loja: {{ lojaAtualNome }}</q-chip>
    </q-page-sticky>
  </q-page>
</template>

<style>
.botoes-acoes-coleta {
  max-width: 70vw;
}

.botoes-acoes-coleta > .row > .col > * {
  margin-bottom: 3rem;
}
</style>

<script>
export default {
  name: 'Inicio',
  computed: {
    idLoja() {
      return this.$store.state.idLoja
    },
    lojaAtualNome() {
      return this.lojas.find(loja => loja.value === this.idLoja).label
    },
    dataUltimaSincronizacao() {
      return this.$store.state.dataUltimaSincronizacao
    },
    coletaEmAndamento() {
      return this.$store.coleta.hasOwnProperty
    },
    coletaFinalizada() {
      return false
    }
  },
  data() {
    return {
      easteregg: 1,
      drawerOpen: false,
      sincronizando: false,
      lojas: [
        { label: 'Jaboatão', value: '1' },
        { label: 'Cordeiro', value: '3' },
        { label: 'Piedade', value: '4' }
      ]
    }
  },
  methods: {
    alteraLoja(idLoja) {
      this.$store.dispatch('alterarLoja', { idLoja })
    },

    sincronizar() {
      this.sincronizando = true
      this.$store
        .dispatch('sincronizarDadosLoja')
        .then(() => {
          this.$q.notify({ type: 'positive', message: 'Sincronizado com sucesso!' })
        })
        .catch(err => {
          if (err) {
            console.error(err)
          }
          this.$q.notify({ type: 'negative', message: 'Falha ao sincronizar App' })
        }).then(() => {
          this.sincronizando = false
        })
    },

    continuar() {
      // TODO: Se a coleta do ultimo concorrente foi concluida, volta pra tela de concorrentes
    },

    enviar() {
      // TODO
    }
  }
}
</script>
