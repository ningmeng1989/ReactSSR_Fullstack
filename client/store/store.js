import AppState from './appState'
import TopicStore from './topicStore'

export default {
  AppState,
  TopicStore,
}

export const createStoreMap = () => ({
  appState: new AppState(),
  topicStore: new TopicStore(),
})
