module.exports = {
    title: 'lvyiyi的博客',
    description: '专注 Node.js 技术栈分享，从前端到Node.js再到数据库',
    theme: '@vuepress/blog',
    themeConfig:{
        nav: [
            {text: "主页", link: "/"      },
        ],
        sidebar: [
            '/',
            '/page-a',
            ['/page-b', 'Explicit link text']
        ]
    }
}
