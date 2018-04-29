<template>
  <q-page>
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

    <div v-if="pesquisas.length"
         class="q-mb-xl">
      <q-list separator>
        <q-item highlight
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
                       v-if="pesquisa.sugestao"
                       icon="star"
                       color="amber">
          </q-item-side>
        </q-item>
      </q-list>

      <q-page-sticky position="bottom-right"
                     :offset="[18, 18]">
        <q-btn round
               size="lg"
               icon="forward"
               :disable="pesquisaNaoSelecionada"
               color="positive"
               label=""
               @click="verificarSeExisteOutraPesquisa" />
      </q-page-sticky>
    </div>
    <div v-else
         class="fixed-center full-width text-center">
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
  mounted() {
    this.idPesquisa = this.pesquisas.find(pesquisa => pesquisa.sugestao).id
  },
  computed: {
    pesquisas() {
      return this.$store.getters['global/pesquisas']
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
        return this.avancar()
      }

      const dialog1 = {
        title: 'Atenção!',
        message:
          'Já existe uma pesquisa em andamento. Deseja realmente apaga-la para começar uma nova?',
        cancel: 'Não',
        ok: {
          push: true,
          color: 'negative',
          label: 'Sim, Apague!'
        }
      }

      const dialog2 = {
        title: 'Tem certeza?!',
        message:
          'Ao confirmar você irá apagar a pesquisa em andamento e começar uma nova.',
        cancel: 'Não',
        ok: {
          push: true,
          color: 'negative',
          label: 'Sim, eu tenho!'
        }
      }

      this.$q
        .dialog(dialog1)
        .then(() => {
          return this.$q.dialog(dialog2)
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
