export const tabs = {
  all: '全部',
  share: '分享',
  job: '工作',
  ask: '问答',
  good: '精品',
  dev: '测试',
}

export const topicSchema = {
  id: '',
  author_id: '',
  tab: '',
  content: '',
  title: '',
  last_reply_at: '',
  good: '',
  top: '',
  reply_count: '',
  visit_count: '',
  create_at: '',
  is_collect: '',
  author: {
    loginname: '',
    avatar_url: '',
  },
  replies: [],
}

export const replySchema = {
  id: '',
}
