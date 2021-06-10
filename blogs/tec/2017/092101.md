---
title: 消息系统设计与实现「上篇」
cover: https://pan.zealsay.com/zealsay/cover/4.jpg
date: 2017-09-21
tags:
 - 消息系统
 - 产品设计
categories: 
 - 心情物语
---

## 产品分析 
首先我们来看一下市场上关于消息的实现是怎么样的。
### 简书

简书的消息系统主要分了两种

- 简信
- 提醒

##### 简信
简信的性质其实跟私信是一样的，是用户发送给用户的一则消息，有具体的信息内容。

##### 提醒
而提醒，则是系统发送的一则消息，其文案格式是固定的，并且对特殊对象一般拥有超链接。
[![](https://upload-images.jianshu.io/upload_images/79702-d8e9bcfcbde089ec.jpg)](https://upload-images.jianshu.io/upload_images/79702-d8e9bcfcbde089ec.jpg)

### 知乎
知乎跟简书一样，主要分了两种：

- 私信
- 消息

##### 私信
跟简书一样，使用户发送给用户的一则消息，也可以是管理员发送给用户的消息。

[![](https://upload-images.jianshu.io/upload_images/79702-4c98190143481f7a.jpg)](https://upload-images.jianshu.io/upload_images/79702-4c98190143481f7a.jpg)

##### 消息
知乎的消息比简书的提醒有过之而无不及，知乎会对多条相似的消息进行聚会，以达到减轻用户阅读压力的体验。

[![](https://upload-images.jianshu.io/upload_images/79702-9c189d0ea208b71d.jpg)](https://upload-images.jianshu.io/upload_images/79702-9c189d0ea208b71d.jpg)

### 阿里云

- 站内消息

![](https://www.zealsay.com/wp-content/uploads/2018/09/ab5bb2ba54be4345dbef77045886d8f2.png)

阿里云的C端用户，主要是站内消息，而这些站内消息主要是促销活动的广播信息。

![](https://www.zealsay.com/wp-content/uploads/2018/09/2789349276e9e1014a46832915bf1c30.png)


还可以加一个`label`标签来区分消息的类别。

### 消息的三种分类
通过三种产品的简单分析，得出他们的消息有两种分类，在这基础上，我们再加上一种：公告。
公告的主要性质是系统发送一则含有具体内容的消息，站内所有用户都能读取到这条消息。
所以，消息有三种分类：

1. 公告 Announce
2. 提醒 Remind
3. 私信 Message

### 提醒的语言分析

我们从简书取一组提醒样本：

- 3dbe1bd90774 关注了你
- magicdawn 喜欢了你的文章 《单点登录的三种实现方式》
- 无良程序 喜欢了你的文章 《基于RESTful API 怎么设计用户权限控制？》
- alexcc4 喜欢了你的文章 《在Nodejs中贯彻单元测试》
- 你在《基于RESTful API 怎么设计用户权限控制？》中收到一条 cnlinjie 的评论
- 你的文章《Session原理》已被加入专题 《ios开发》
- 分析句子结构，提醒的内容无非就是

`「谁对一样属于谁的事物做了什么操作」
「someone do something in someone's something」`

someone = 提醒的触发者，或者发送者，标记为sender
do something = 提醒的动作，评论、喜欢、关注都属于一个动作，标记为action
something = 提醒的动作作用对象，这就具体到是哪一篇文章，标记为target
someone's = 提醒的动作作用对象的所有者，标记为targetOwner

这就清楚了，sender和targetOwner就是网站的用户，而target是具体到哪一篇文章，如果提醒的对象不仅仅局限于文章，还有其他的话，就需要增加一项targetType，来标记目标是文章还是其他的什么。而action，则是固定的，整个网站会触发提醒的动作可能就只有那几样：评论、喜欢、关注.....（或者其他业务需要提醒的动作）

### 消息的两种获取方式

- 推 Push
- 拉 Pull

##### 以知乎为例
推的比较常见，需要针对某一个问题维护着一张关注者的列表，每当触发这个问题推送的条件时（例如有人回答问题），就把这个通知发送给每个关注者。

拉的相对麻烦一点，就是推的反向，例如每个用户都有一张关注问题的列表，每当用户上线的时候，对每个问题进行轮询，当问题的事件列表出现了比我原本时间戳大的信息就进行拉取。

##### 而我们则根据消息的不同分类采用不同的获取方式：
通告和提醒，适合使用拉取的方式，消息产生之后，会存在消息表中，用户在某一特定的时间根据自己关注问题的表进行消息的拉取，然后添加到自己的消息队列中，

信息，适合使用推的方式，在发送者建立一条信息之后，同时指定接收者，把消息添加到接收者的消息队列中。

### 订阅

根据提醒使用拉取的方式，需要维护一个关注某一事物的列表。
这种行为，我们称之为：**「订阅」Subscribe **

##### 一则订阅有以下三个核心属性：

- 订阅的目标 target
- 订阅的目标类型 targetType
- 订阅的动作 action

比如我发布了一篇文章，那么我会订阅文章《XXX》的评论动作，所以文章《XXX》每被人评论了，就需要发送一则提醒告知我。

##### 订阅的规则还可以扩展

我喜欢了一篇文章，和我发布了一篇文章，订阅的动作可能不一样。
喜欢了一篇文章，我希望我订阅这篇文章更新、评论的动作。
而发布了一篇文章，我希望我只是订阅这篇文章的评论动作。

这时候就需要多一个参数：subscribReason
不同的subscribReason，对应着一个动作数组，
subscribReason = 喜欢，对应着 actions = [更新，评论]
subscribReason = 发布，对应着 actions = [评论]

##### 订阅的规则还还可以扩展
用户可能会有一个自己的订阅设置，比如对于所有的喜欢的动作，我都不希望接收。
比如Knewone的提醒设置

[![](https://upload-images.jianshu.io/upload_images/79702-aa831d93990cff2e.jpg)](https://upload-images.jianshu.io/upload_images/79702-aa831d93990cff2e.jpg)
所以我们需要再维护一个表：SubscriptionConfig，来存放用户的提醒设置。
并且，当用户没有提醒设置的时候，可以使用系统提供的一套默认设置：defaultSubscriptionConfig

### 聚合
如果我发布了一篇文章《XXX》，在我不在线的时候，被评论了10遍，当我一上线的时候，应该是收到十条信息类似于：「谁谁谁评论了你的文章《XXX》」?
还是应该收到一条信息：「甲、乙、丙、丁...评论了你的文章《XXX》」?

### 五个实体

通过上面的分析，大概知道做这个消息系统，需要哪些实体类：

1.  消息实体 Notify
2. 用户消息队列 UserNotify
3. 用户 User
4. 订阅 Subscription
5. 订阅设置 SubscriptionConfig
	- 消息 Notify
	- 通告 Announce
	- 提醒 Remind
	- 信息 Message

### 行为分解

说了这么多，整理一下整个消息流程的一些行为：

- 系统或者管理员，创建消息
 createNotify (make announce | remind | message)
- 用户，订阅消息，取消订阅
subscribe, cancelSubscription
- 用户管理订阅设置
getSubscriptionConfig, updateSubscriptionConfig
- 用户，拉取消息
pullNotify (pull announce | remind | message | all)
- 用户，查询消息队列
getUserNotify(get announce | remind | message | all)
- 用户阅读消息
read

