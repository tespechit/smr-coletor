<template>
  <div id="q-app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App',
  created() {
    this.$store.dispatch('inicializaStore').then(() => {
      this.$bus.$emit('store')
    })
  }
}
</script>

<style>
</style>
