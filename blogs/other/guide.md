---
title: 一个前后端分离的快速开发脚手架
date: 2020-12-20
cover: https://pan.zealsay.com/mweb/blog/WechatIMG5.png
tags:
 - java
 - vue
categories:
 -  技术笔记
---

::: tip 摘要
使用zealsay初体验<br>
:::

<!-- more -->


---
title: 介绍
date: 2020-08-14
sidebar: 'auto'
publish: false
---

<p align="center"><a href="https://vuejs.org" target="_blank" rel="noopener noreferrer"><img width="300" src="https://pan.zealsay.com/2019091615686216710547.png" alt="Vue logo"></a></p>

<p align="center">

 ![vue 2.x](https://img.shields.io/badge/vue-2.x-brightgreen.svg)
 ![nuxt 2.12.2](https://img.shields.io/badge/nuxt-2.12.2-ff69b4.svg)
 ![vuetify 2.3.1](https://img.shields.io/badge/vuetify-2.x-green)
 ![License MIT](https://img.shields.io/badge/license-MIT-green.svg)
 [![Build Status](https://travis-ci.com/GodLikeZeal/zealsay_front.svg?branch=master)](https://travis-ci.com/GodLikeZeal/zealsay_front) 
 [![](https://img.shields.io/docker/stars/zealsay/zealsay_front.svg)](https://hub.docker.com/r/zealsay/zealsay_front 'DockerHub') 
 [![](https://img.shields.io/docker/pulls/zealsay/zealsay_front.svg)](https://hub.docker.com/r/zealsay/zealsay_front 'DockerHub') 
 [![](https://img.shields.io/github/downloads/GodLikeZeal/zealsay_front/total.svg)](https://img.shields.io/github/downloads/GodLikeZeal/zealsay_front/total 'Github')
 
 </p>
 

🚀 zealsay是一套前后端分离的快速开发脚手架,抽取一些常用的解决方案,以快,轻为主,打造出一个开箱即用的轻应用脚手架。  
🍰 后台基于Spring Boot,主体采用Spring Security和Mybatis-Plus。  
🧀 前端采用基于Vue的服务端渲染解决方案Nuxt,样式风格基于Vuetify这款优秀的MD风格样式库。

### 指南

### 在线体验
- [后台管理体验](https://beta.zealsay.com/admin/dashboard) 管理员账号:admin 密码：abc123
- [接口文档管理](https://dev-api.zealsay.com/doc.html) 授权用户名：zealsay 密码: api123456
- [作者博客](https://blog.zealsay.com) 一款基于zealsay开发的博客
- [备用博客](https://www.zealsay.com) 一款基于vuepress构建的的静态博客

### devops示意图
![devops](https://pan.zealsay.com/2020080609191416000000.png "devops")

### 前端技术选型 🎉🎉
####  Core
1. Framework
- `node 14.5`
- `npm 6.14.5`

2. 主框架
- `Nuxt 2.12.2`
- `Vuetify 2.x`

3. 核心模块
- `nuxt-auth` nuxt授权认证 
- `vuex`全局对象管理
- `nuxtjs/axios` 服务请求

#### 扩展
4. 组件
- `mavon-editor` 一款优秀的`markdown`编辑器
- `sweetalert2` 优秀弹窗插件
-  `vue-cropper`图片裁剪插件
- `vue-perfect-scrollbar` 滚动条样式美化
- `vue-scroll-reveal` 内容过渡动画
- `vue-typed-js` 打字机效果插件
- `vue-chartist` 漂亮图表插件
- `vue-concise-slider` 轮播插件
- `vue-count-to` 数字增长特效
- `xss` 防xss攻击
- `material-design-icons-iconfont` mdi图标库

### 后端技术选型 🔥🔥
####  Core
1. Framework
- `java 8`
- `Maven 3.5.4`
2. 主框架
- `Spring Boot 2.1.6.RELEASE`
- `Spring Security 5.1.5.RELEASE`
- `Mybatis Plus 3.3.1`
3. 运行容器
- `Undertow`  

#### 扩展
4. 数据层
- `Mysql`
- `Redis`
-  `Hikari`连接池
5. tools
- `Spring Validation` 优雅校验
- `Mapstruct` 对象映射
- `Jasypt` 敏感信息加密
- `Jackson`json利器
- `Commons-lang3` apache语言扩展包
- `Spring Mail` 邮件发送
- `Openfeign` 服务调用
6. 常用第三方
- `七牛云对象云存储`
- `Github第三方登录`
- `阿里云SMS短信服务`
- `Hitokoto 一言接口`

### 内置功能
- 用户登录注册
- 博客端首页展示
- 友链展示
- 关于页面展示
- 分类查询分页
- 后台Dashbord
- 用户管理
- 角色管理
- 文章管理
- 图片上传和头像裁剪上传
- 标签云管理
- 数据字典配置
- 站点信息配置

> 更多细节功能可以前往在线体验站点体验,更多功能正在火速🔥🔥🔥开发中...

### 开源协议
- 📚  本项目遵循MIT开源协议，可以学习，可以商用，可以二次开发。
- 📖  如果对本项目进行二次开源，请保留作者信息。

### 关于
- 🍓 欢迎关注作者 [博客](https://blog.zealsay.com)，也是基于`zealsay`开发的,后期会分享一些开发心得。
- 🍉 作者是一名后台开发者，接触前端时间并不长，项目有不足之处和不合理的地方还请海涵。
- 关于优化和好的建议，也欢迎联系作者和提issue。同时也欢迎大家PR 👏👏👏
 - 开发不易，来来回回的优化，占用了我几乎所有业余时间，希望各位大佬喜欢本项目的话，不吝在github和gitee上给个 star 以示支持❤️❤️❤️，你们的支持是我坚持下去的最大动力。爱你们😍😍😍


