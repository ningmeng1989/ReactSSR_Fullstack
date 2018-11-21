import {
  observable,
  // toJS,
  // computed,
  action,
  extendObservable,
} from 'mobx'
import { topicSchema } from '../util/schemaDefine'
import { get } from '../util/http'

const createTopic = topic => (Object.assign({}, topicSchema, topic))

class Topic {
  constructor(data) {
    extendObservable(this, data)
  }

  @observable syncing = false
}

class TopicStore {
  @observable topics

  @observable syncing

  constructor({ syncing, topics } = { syncing: false, topics: [] }) {
    this.syncing = syncing
    this.topics = topics.map(topic => new Topic(createTopic(topic)))
  }

  addTopic(topic) {
    this.topics.push(new Topic(createTopic(topic)))
  }

  @action fetchTopics(tab) {
    return new Promise((resolve, reject) => {
      this.syncing = true
      this.topics = []
      get('/topics', {
        mrender: false,
        tab,
      }).then((resp) => {
        if (resp.success) {
          resp.data.forEach((topic) => {
            this.addTopic(topic)
          })
          resolve()
        } else {
          reject()
        }
        this.syncing = false
      }).catch((err) => {
        reject(err)
        this.syncing = false
      })
    })
  }

  toJson() {
    return {
      topics: this.topics,
      syncing: this.syncing,
    }
  }
}

export default TopicStore
