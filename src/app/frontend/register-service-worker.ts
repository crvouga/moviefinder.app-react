import { registerSW } from 'virtual:pwa-register'

export const registerServiceWorker = () => {
  const updateSW = registerSW({
    onNeedRefresh() {
      if (confirm('New content available. Reload to update?')) {
        updateSW(true)
      }
    },
    onOfflineReady() {
      if (confirm('App ready to work offline')) {
        updateSW(true)
      }
    },
    onRegisteredSW(_swUrl, _r) {},
    onRegisterError(_error) {},
    immediate: true,
  })
}
