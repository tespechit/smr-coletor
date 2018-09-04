import localforage from 'localforage'

localforage.config({
  name: 'SMRColetor',
  driver: localforage.INDEXEDDB,
  storeName: 'smrcoletor'
})

export function persisteState(state) {
  return localforage.setItem('store', state)
}

export function recuperaState() {
  return localforage.getItem('store')
}

export function limpar() {
  localforage.clear()
}
