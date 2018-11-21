import React from 'react'
import {
  observer,
  inject,
} from 'mobx-react'
import PropTypes from 'prop-types'
import Helmet from 'react-helmet'
import queryString from 'query-string'

import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import CircularProgress from '@material-ui/core/CircularProgress'
import List from '@material-ui/core/List'
// import Button from '@material-ui/core/Button'
// import AppState from '../../store/appState'
import TopicStore from '../../store/topicStore'

import Container from '../layout/Container'
import TopicListItem from './LiItem'
import { tabs } from '../../util/schemaDefine'

// import AppState from '../../app'

// @inject('appState') @observer
@inject(stores => ({
  // appState: stores.appState,
  topicStore: stores.topicStore,
})) @observer
class TopicList extends React.Component {
  static contextTypes = {
    router: PropTypes.object,
  }

  constructor() {
    super()
    // this.state = {
    //   tabIndex: 0,
    // }
    // this.changeName = this.changeName.bind(this)
    this.changeTab = this.changeTab.bind(this)
    this.listItemClick = this.listItemClick.bind(this)
  }

  componentDidMount() {
    // do something
    const { topicStore } = this.props
    topicStore.fetchTopics(this.getTab())
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.location.search !== this.props.location.search) {
      this.props.topicStore.fetchTopics(this.getTab(nextProps.location.search))
    }
  }

  getTab(searchF) {
    const search = searchF || this.props.location.search
    const query = queryString.parse(search)
    const { tab } = query
    return tab || 'all'
  }

  // bootstrap() {
  // return this.props.topicStore.fetchTopics()
  // const { appState } = this.props
  // return new Promise((resolve) => {
  //   setTimeout(() => {
  //     appState.count = 3
  //     resolve(true)
  //   })
  // })
  // }

  // changeName(event) {
  //   const { appState } = this.props
  //   appState.changeName(event.target.value)
  // }

  changeTab(event, value) {
    // this.setState({
    //   tabIndex: index,
    // })
    this.context.router.history.push({
      path: '/index',
      search: `?tab=${value}`,
    })
  }

  /* eslint-disable */
  listItemClick() {
    // do something
  }
  /* eslint-enable */

  render() {
    // const { tabIndex } = this.state
    const { topicStore } = this.props
    const topicList = topicStore.topics
    const syncingTopic = topicStore.syncing
    // const query = queryString.parse(this.props.location.search)
    // const tab = query.tab
    const tab = this.getTab()
    // const topic = {
    //   tab: 'Share',
    //   title: 'This is title',
    //   username: 'Jocky',
    //   reply_count: '30',
    //   visit_count: '20',
    //   create_at: '2018-11-21',
    // }
    // const { appState } = this.props
    return (
      <Container>
        <Helmet>
          <title>This is topic list</title>
          <meta name="description" content="This is description" />
        </Helmet>
        <Tabs value={tab} onChange={this.changeTab}>
          {
            Object.keys(tabs).map(t => <Tab label={tabs[t]} value={t} key={t} />)
          }
        </Tabs>
        <List>
          {
            topicList.map(topic => (
              <TopicListItem onClick={this.listItemClick} topic={topic} key={topic.id} />
            ))
          }
        </List>
        {
          syncingTopic ? (
            <div style={{
              display: 'flex',
              justifyContent: 'space-around',
              padding: '40px 0',
            }}
            >
              <CircularProgress color="primary" size={100} />
            </div>
          ) : null
        }
      </Container>
    )
  }
}

TopicList.wrappedComponent.propTypes = {
  // appState: PropTypes.instanceOf(AppState),
  topicStore: PropTypes.instanceOf(TopicStore),
}

TopicList.propTypes = {
  location: PropTypes.object.isRequired,
}

export default TopicList
