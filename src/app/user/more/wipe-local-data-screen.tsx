import { ConfirmationBlock } from '~/@/ui/confirmation-block'
import { useCurrentScreen } from '~/app/@/screen/use-current-screen'
import { AppScreenLayout } from '~/app/@/ui/app-screen-layout'

declare global {
  interface IDBFactory {
    webkitGetDatabaseNames?(): IDBRequest<string[]>
    mozGetDatabaseNames?(): IDBRequest<string[]>
    getDatabaseNames?(): IDBRequest<string[]>
  }
}

export const WipeLocalDataScreen = () => {
  const currentScreen = useCurrentScreen()
  const onBack = () => {
    currentScreen.replace({ t: 'user', c: { t: 'more', c: { t: 'index' } } })
  }

  return (
    <AppScreenLayout
      topBar={{
        title: 'Wipe Local Data',
        onBack,
      }}
      scrollKey="wipe-local-data"
    >
      <ConfirmationBlock
        title="Wipe Local Data"
        description="Are you sure you want to wipe local data?"
        onConfirm={async () => {
          clearAll()
          window.location.reload()
        }}
        color="danger"
        onCancel={onBack}
      />
    </AppScreenLayout>
  )
}

const clearLocalStorage = () => {
  localStorage.clear()
  sessionStorage.clear()
}

const clearIndexedDB = async () => {
  if (!indexedDB.databases) {
    // Fallback for browsers that don't support indexedDB.databases()
    const req =
      indexedDB.webkitGetDatabaseNames ||
      indexedDB.mozGetDatabaseNames ||
      indexedDB.getDatabaseNames

    if (req) {
      req().onsuccess = (event: Event) => {
        if (!event.target) return
        const target = event.target as IDBRequest<string[]>
        const dbNames = target.result
        for (const name of dbNames) {
          indexedDB.deleteDatabase(name)
        }
      }
    }
    return
  }

  const dbs = await indexedDB.databases()
  for (const db of dbs) {
    if (db.name) {
      indexedDB.deleteDatabase(db.name)
    }
  }
}

// Clear cookies
const clearCookies = () => {
  const cookies = document.cookie.split('; ')
  for (const cookie of cookies) {
    const eqPos = cookie.indexOf('=')
    const name = eqPos > -1 ? cookie.slice(0, eqPos) : cookie
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`
  }
}

const clearAll = async () => {
  await clearIndexedDB()
  clearLocalStorage()
  clearCookies()
}
