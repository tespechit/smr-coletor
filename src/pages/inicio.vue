<template>
  <q-page class="flex flex-center">
    <q-layout-header>
      <q-toolbar color="primary">
        <img alt="SMR Logo" style="height: 24px" src="~assets/smr-logo.png">

        <q-toolbar-title>
          SMR <div slot="subtitle">Aplicativo de Coleta</div>
        </q-toolbar-title>

        <q-btn
          flat
          dense
          round
          @click="drawerOpen = !drawerOpen"
          aria-label="Menu"
        >
          <q-icon name="menu" />
        </q-btn>
      </q-toolbar>
    </q-layout-header>

    <q-layout-drawer
      side="right"
      v-model="drawerOpen"
      :content-class="$q.theme === 'mat' ? 'bg-grey-2' : null"
    >
      <q-list
        no-border
        link
        inset-delimiter
      >
        <q-list-header>Configurações</q-list-header>
        <div class="q-pa-sm">
          <q-select
            v-model="lojaAtual"
            float-label="Loja"
            radio
            :options="lojas"
            @input="alteraLoja"
          />
          <br>
          <p :style="{color: 'red'}">Não é possível alterar a loja enquanto a coleta estiver pendente.</p>
        </div>

        <div class="q-pa-sm">
          <q-btn push size="md" color="primary" class="full-width" label="Excluir Coleta" icon="delete" @click="excluiColeta" />
        </div>
      </q-list>
    </q-layout-drawer>

    <div class="botoes-acoes-coleta">
      <div class="row">
        <div class="col">
          <q-btn push size="lg" color="primary" class="full-width" label="Nova Coleta" icon="playlist_add" @click="novaColeta"/>
          <q-btn push size="lg" color="tertiary" class="full-width" label="Continuar" icon="replay" @click="continuaColeta"/>
          <q-btn push size="lg" color="positive" class="full-width" label="Enviar Coleta" icon="file_upload" @click="enviaColeta" />
        </div>
      </div>
    </div>

    <q-page-sticky position="bottom-left" :offset="[18, 18]">
    <q-chip color="white" textColor="faded" square><strong>Loja: </strong> {{ lojaAtualNome }}</q-chip>
    </q-page-sticky>
  </q-page>
</template>

<style>
.botoes-acoes-coleta {
  max-width: 60vw;
}

.botoes-acoes-coleta > .row > .col > * {
  margin-bottom: 3rem;
}
</style>

<script>
export default {
  name: 'Inicio',
  computed: {
    lojaAtualNome() {
      return this.lojas.find(loja => loja.value === this.lojaAtual).label
    }
  },
  data() {
    return {
      drawerOpen: this.$q.platform.is.desktop,
      lojaAtual: '1',
      lojas: [
        {
          label: 'Jaboatão',
          value: '1'
        },
        {
          label: 'Cordeiro',
          value: '3'
        },
        {
          label: 'Piedade',
          value: '4'
        }
      ]
    }
  },
  methods: {
    alteraLoja(idLoja) {
      // TODO
    },

    novaColeta() {
      // TODO
    },

    continuaColeta() {
      // TODO
    },

    enviaColeta() {
      // TODO
    },

    excluiColeta() {
      // TODO
    }
  }
}
</script>
