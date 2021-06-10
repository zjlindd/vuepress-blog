const sidebar = require('./siderbar.js');
module.exports = {
  "title": "青椒小店",
  "description": "一个爱分享的小店",
  "dest": "dist",
  "base": "/",
  "head": [
    [
      "link",
      {
        "rel": "icon",
        "href": "/logo.jpg"
      }
    ],
    [
      "meta",
      {
        "name": "viewport",
        "content": "width=device-width,initial-scale=1,user-scalable=no"
      }
    ]
  ],
  "plugins": ["@vuepress-reco/vuepress-plugin-comments", "vuepress-plugin-meting"],
  "theme": "reco",
  "themeConfig": {
    "mode": 'light',
    "subSidebar": 'auto',
    "valineConfig": {
      "appId": 'aCSipIDPBNQTreNNNr4bT5R4-gzGzoHsz',
      "appKey": 'zuQELzuRINaCxHgIozNrnwKO',
    },
    "nav": [
      {
        "text": "主页",
        "link": "/",
        "icon": "reco-home"
      }
    ],
    sidebar,
    "type": "blog",
    "blogConfig": {
      "category": {
        "location": 2,
        "text": "目录索引"
      },
      "tag": {
        "location": 3,
        "text": "标签索引"
      }
    },
    "logo": "/logo.jpg",
    "search": true,
    "searchMaxSuggestions": 10,
    "lastUpdated": "Last Updated",
    "author": "indd",
    "authorAvatar": "/logo.jpg",
    "startYear": "2017"
  },
  "markdown": {
    "lineNumbers": true
  }
}
