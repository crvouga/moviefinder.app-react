import { registerSW } from 'virtual:pwa-register'

export const registerServiceWorker = () => {
  console.log('registerSW')
  const updateSW = registerSW({
    onNeedRefresh() {
      console.log('onNeedRefresh')
      if (confirm('New content available. Reload to update?')) {
        updateSW(true)
      }
    },
    onOfflineReady() {
      console.log('onOfflineReady')
      if (confirm('App ready to work offline')) {
        updateSW(true)
      }
    },
    onRegisteredSW(swUrl, r) {
      console.log('onRegisteredSW', swUrl, r)
    },
    onRegisterError(error) {
      console.error('onRegisterError', error)
    },
    immediate: true,
  })
}
