export default ({ Vue }) => {
  const EventBus = new Vue()
  Vue.prototype.$bus = EventBus
}
