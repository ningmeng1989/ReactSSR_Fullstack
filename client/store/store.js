import AppStateClass from './appState'

export const AppState = AppStateClass

export default {
  AppState,
}

export const createStoreMap = () => ({
  appState: new AppState(),
})
