<template>
  <q-layout view="lHh Lpr lFf" class="non-selectable">
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
export default {
  name: 'LayoutDefault',
  data () {
    return {
    }
  }
}
</script>

<style>
body {
  background: #F7F7F7
}
</style>
