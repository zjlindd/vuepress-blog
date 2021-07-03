---
title: Nginx 介绍
date: 2020-12-20
cover: http://lorempixel.com/400/200/food
tags:
 - Nginx
categories:
 -  技术笔记
---
<a name="W04J9"></a>
## 1. Nginx 介绍
传统的 Web 服务器，每个客户端连接作为一个单独的进程或线程处理，需在切换任务时将 CPU 切换到新的任务并创建一个新的运行时上下文，消耗额外的内存和 CPU 时间，当并发请求增加时，服务器响应变慢，从而对性能产生负面影响。<br />
<br />![](https://cdn.nlark.com/yuque/0/2021/png/2899468/1618484390356-5e9966db-ec16-4078-b6f6-332c2421ddf9.png#clientId=u9a067f17-d621-4&from=paste&height=363&id=u25f1f275&margin=%5Bobject%20Object%5D&originHeight=363&originWidth=1080&originalType=url&status=done&style=none&taskId=u41f1e7f5-11bb-4368-b410-32a9f8c77c3&width=1080)<br />Nginx<br />Nginx 是开源、高性能、高可靠的 Web 和反向代理服务器，而且支持热部署，几乎可以做到 7 * 24 小时不间断运行，即使运行几个月也不需要重新启动，还能在不间断服务的情况下对软件版本进行热更新。性能是 Nginx 最重要的考量，其占用内存少、并发能力强、能支持高达 5w 个并发连接数，最重要的是，Nginx 是免费的并可以商业化，配置使用也比较简单。<br />
<br />
<br />Nginx 的最重要的几个使用场景：

1. 静态资源服务，通过本地文件系统提供服务；
1. 反向代理服务，延伸出包括缓存、负载均衡等；
1. API 服务，OpenResty ；



> 对于前端来说 Node.js 不陌生了，Nginx 和 Node.js 的很多理念类似，HTTP 服务器、事件驱动、异步非阻塞等，且 Nginx 的大部分功能使用 Node.js 也可以实现，但 Nginx 和 Node.js 并不冲突，都有自己擅长的领域。Nginx 擅长于底层服务器端资源的处理（静态资源处理转发、反向代理，负载均衡等），Node.js 更擅长上层具体业务逻辑的处理，两者可以完美组合，共同助力前端开发。
> 下面我们着重学习一下 Nginx 的使用。



<a name="gC4K4"></a>
## 2. 相关概念


<a name="nAMRf"></a>
### 2.1 简单请求和非简单请求

<br />首先我们来了解一下简单请求和非简单请求，如果同时满足下面两个条件，就属于简单请求：<br />

1. 请求方法是 HEAD、GET、POST 三种之一；



2. HTTP 头信息不超过右边着几个字段：Accept、Accept-Language、Content-Language、Last-Event-IDContent-Type 只限于三个值 application/x-www-form-urlencoded、multipart/form-data、text/plain；


<br />凡是不同时满足这两个条件的，都属于非简单请求。<br />
<br />浏览器处理简单请求和非简单请求的方式不一样：<br />
<br />**简单请求**<br />
<br />对于简单请求，浏览器会在头信息中增加 Origin 字段后直接发出，Origin 字段用来说明，本次请求来自的哪个源（协议+域名+端口）。<br />如果服务器发现 Origin 指定的源不在许可范围内，服务器会返回一个正常的 HTTP 回应，浏览器取到回应之后发现回应的头信息中没有包含 Access-Control-Allow-Origin 字段，就抛出一个错误给 XHR 的 error 事件；<br />
<br />如果服务器发现 Origin 指定的域名在许可范围内，服务器返回的响应会多出几个 Access-Control- 开头的头信息字段。<br />
<br />
<br />**非简单请求**<br />
<br />非简单请求是那种对服务器有特殊要求的请求，比如请求方法是 PUT 或 DELETE，或 Content-Type 值为 application/json。浏览器会在正式通信之前，发送一次 HTTP 预检 OPTIONS 请求，先询问服务器，当前网页所在的域名是否在服务器的许可名单之中，以及可以使用哪些 HTTP 请求方法和头信息字段。只有得到肯定答复，浏览器才会发出正式的 XHR 请求，否则报错。<br />
<br />

<a name="cctxs"></a>
### 2.2 跨域

<br />在浏览器上当前访问的网站向另一个网站发送请求获取数据的过程就是**跨域请求**。<br />
<br />跨域是浏览器的同源策略决定的，是一个重要的浏览器安全策略，用于限制一个 origin 的文档或者它加载的脚本与另一个源的资源进行交互，它能够帮助阻隔恶意文档，减少可能被攻击的媒介，可以使用 CORS 配置解除这个限制。<br />
<br />关于跨域网上已经有很多解释，这里就不啰嗦，也可以直接看 MDN 的 <浏览器的同源策略> 文档进一步了解，这里就列举几个同源和不同元的例子，相信程序员都能看得懂。<br />

```javascript
# 同源的例子
http://example.com/app1/index.html  # 只是路径不同
http://example.com/app2/index.html
 
http://Example.com:80  # 只是大小写差异
http://example.com
# 不同源的例子
http://example.com/app1   # 协议不同
https://example.com/app2
 
http://example.com        # host 不同
http://www.example.com
http://myapp.example.com
http://example.com        # 端口不同
http://example.com:8080

```
<a name="4bjfk"></a>
### 2.3 正向代理和反向代理

<br />反向代理（Reverse Proxy）对应的是正向代理（Forward Proxy），他们的区别：<br />
<br />**正向代理：** 一般的访问流程是客户端直接向目标服务器发送请求并获取内容，使用正向代理后，客户端改为向代理服务器发送请求，并指定目标服务器（原始服务器），然后由代理服务器和原始服务器通信，转交请求并获得的内容，再返回给客户端。正向代理隐藏了真实的客户端，为客户端收发请求，使真实客户端对服务器不可见；<br />
<br />举个具体的例子 🌰，你的浏览器无法直接访问谷哥，这时候可以通过一个代理服务器来帮助你访问谷哥，那么这个服务器就叫正向代理。<br />
<br />**反向代理：** 与一般访问流程相比，使用反向代理后，直接收到请求的服务器是代理服务器，然后将请求转发给内部网络上真正进行处理的服务器，得到的结果返回给客户端。反向代理隐藏了真实的服务器，为服务器收发请求，使真实服务器对客户端不可见。一般在处理跨域请求的时候比较常用。现在基本上所有的大型网站都设置了反向代理。<br />
<br />举个具体的例子 🌰，去饭店吃饭，可以点川菜、粤菜、江浙菜，饭店也分别有三个菜系的厨师 👨‍🍳，但是你作为顾客不用管哪个厨师给你做的菜，只用点菜即可，小二将你菜单中的菜分配给不同的厨师来具体处理，那么这个小二就是反向代理服务器。<br />
<br />简单的说，一般给客户端做代理的都是正向代理，给服务器做代理的就是反向代理。<br />
<br />正向代理和反向代理主要的原理区别可以参见下图：<br />
<br />![](https://cdn.nlark.com/yuque/0/2021/png/2899468/1618485177214-7f8b5b6e-055b-4dd0-9b72-d046e8662b95.png#clientId=u9a067f17-d621-4&from=paste&height=996&id=ud03676f9&margin=%5Bobject%20Object%5D&originHeight=996&originWidth=924&originalType=url&status=done&style=none&taskId=u167e8efb-db89-485b-a540-b3625be7c53&width=924)<br />

<a name="TN2dg"></a>
### 2.4 负载均衡

<br />一般情况下，客户端发送多个请求到服务器，服务器处理请求，其中一部分可能要操作一些资源比如数据库、静态资源等，服务器处理完毕后，再将结果返回给客户端。<br />
<br />这种模式对于早期的系统来说，功能要求不复杂，且并发请求相对较少的情况下还能胜任，成本也低。随着信息数量不断增长，访问量和数据量飞速增长，以及系统业务复杂度持续增加，这种做法已无法满足要求，并发量特别大时，服务器容易崩。<br />
<br />很明显这是由于服务器性能的瓶颈造成的问题，除了堆机器之外，最重要的做法就是负载均衡。<br />
<br />请求爆发式增长的情况下，单个机器性能再强劲也无法满足要求了，这个时候集群的概念产生了，单个服务器解决不了的问题，可以使用多个服务器，然后将请求分发到各个服务器上，将负载分发到不同的服务器，这就是**负载均衡**，核心是「分摊压力」。Nginx 实现负载均衡，一般来说指的是将请求转发给服务器集群。<br />
<br />举个具体的例子 🌰，晚高峰乘坐地铁的时候，入站口经常会有地铁工作人员大喇叭“请走 B 口，B 口人少车空....”，这个工作人员的作用就是负载均衡。<br />
<br />
<br />![](https://cdn.nlark.com/yuque/0/2021/png/2899468/1618485403267-d5a24100-9f32-4788-ae69-1e47663dfe70.png#clientId=u9a067f17-d621-4&from=paste&height=266&id=u08591f1e&margin=%5Bobject%20Object%5D&originHeight=266&originWidth=809&originalType=url&status=done&style=none&taskId=u5bc7f3db-58d6-452e-9530-820670d6202&width=809)<br />

<a name="VHeJc"></a>
### 2.5 动静分离

<br />为了加快网站的解析速度，可以把动态页面和静态页面由不同的服务器来解析，加快解析速度，降低原来单个服务器的压力。<br />
<br />![](https://cdn.nlark.com/yuque/0/2021/png/2899468/1618485512651-5e607e73-495d-4c79-a3e9-84c7a8c9aecf.png#clientId=u9a067f17-d621-4&from=paste&height=247&id=ucd9f871d&margin=%5Bobject%20Object%5D&originHeight=247&originWidth=866&originalType=url&status=done&style=none&taskId=u7009c5cd-9ed0-448b-b759-53d4f259bf3&width=866)<br />
<br />动静分离<br />一般来说，都需要将动态资源和静态资源分开，由于 Nginx 的高并发和静态资源缓存等特性，经常将静态资源部署在 Nginx 上。如果请求的是静态资源，直接到静态资源目录获取资源，如果是动态资源的请求，则利用反向代理的原理，把请求转发给对应后台应用去处理，从而实现动静分离。<br />
<br />使用前后端分离后，可以很大程度提升静态资源的访问速度，即使动态服务不可用，静态资源的访问也不会受到影响。<br />

<a name="XzSzh"></a>
## 3. Nginx 快速安装
<a name="Bdi2S"></a>
### 3.1 安装
我们可以先看看<br />

```bash
yum list | grep nginx
```
来看看<br />
<br />![](https://cdn.nlark.com/yuque/0/2021/png/2899468/1618485639565-cdfdfb62-9a02-4861-81f7-3a730955a17b.png#clientId=u9a067f17-d621-4&from=paste&height=393&id=u20fd1701&margin=%5Bobject%20Object%5D&originHeight=393&originWidth=875&originalType=url&status=done&style=none&taskId=u8b0b1b6c-9c3c-4fee-970e-cdaeb36fa1e&width=875)<br />
<br />然后<br />

```basic
yum install nginx
```
来安装 Nginx，然后我们在命令行中 nginx -v 就可以看到具体的 Nginx 版本信息，也就安装完毕了。<br />
<br />![](https://cdn.nlark.com/yuque/0/2021/png/2899468/1618485671821-d6f19265-eb1c-4c0b-9c83-897b6f95d94a.png#clientId=u9a067f17-d621-4&from=paste&height=82&id=u509d4ce3&margin=%5Bobject%20Object%5D&originHeight=82&originWidth=377&originalType=url&status=done&style=none&taskId=u4f4177c3-54e5-4295-90f0-cd7b06944da&width=377)<br />

<a name="smmPM"></a>
### 3.2 相关文件夹

<br />然后我们可以使用 rpm -ql nginx 来查看 Nginx 被安装到了什么地方，有哪些相关目录，其中位于 /etc 目录下的主要是配置文件，还有一些文件见下图：<br />
<br />![](https://cdn.nlark.com/yuque/0/2021/png/2899468/1618485692101-81075876-5590-4aee-9b16-336fbd0e3f62.png#clientId=u9a067f17-d621-4&from=paste&height=1076&id=ua3806b4e&margin=%5Bobject%20Object%5D&originHeight=1076&originWidth=809&originalType=url&status=done&style=none&taskId=u9374f4e3-d33c-4276-aab8-8cbdf11b903&width=809)<br />
<br />主要关注的文件夹有两个：<br />
<br />/etc/nginx/conf.d/ 文件夹，是我们进行子配置的配置项存放处，/etc/nginx/nginx.conf 主配置文件会默认把这个文件夹中所有子配置项都引入；<br />
<br />/usr/share/nginx/html/ 文件夹，通常静态文件都放在这个文件夹，也可以根据你自己的习惯放其他地方；<br />

<a name="n9qIv"></a>
### 3.3 跑起来康康

<br />安装之后开启 Nginx，如果系统开启了防火墙，那么需要设置一下在防火墙中加入需要开放的端口，下面列举几个常用的防火墙操作（没开启的话不用管这个）：<br />

```basic
systemctl start firewalld  # 开启防火墙
systemctl stop firewalld   # 关闭防火墙
systemctl status firewalld # 查看防火墙开启状态，显示running则是正在运行
firewall-cmd --reload      # 重启防火墙，永久打开端口需要reload一下
 
# 添加开启端口，--permanent表示永久打开，不加是临时打开重启之后失效
firewall-cmd --permanent --zone=public --add-port=8888/tcp
 
# 查看防火墙，添加的端口也可以看到
firewall-cmd --list-all
```
然后设置 Nginx 的开机启动：<br />

```basic
systemctl enable nginx
```
启动 Nginx （其他命令后面有详细讲解）：<br />

```basic
systemctl start nginx
```
然后访问你的 IP，这时候就可以看到 Nginx 的欢迎页面了～ Welcome to nginx！ 👏<br />

<a name="gdvjw"></a>
### 3.4 安装 nvm & node & git


```basic
# 下载 nvm，或者看官网的步骤 https://github.com/nvm-sh/nvm#install--update-script
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.35.3/install.sh | bash
 
source   ~/.bashrc    # 安装完毕后，更新配置文件即可使用 nvm 命令
nvm ls-remote         # 查看远程 node 版本
nvm install v12.16.3  # 选一个你要安装的版本安装，我这里选择 12.16.3
nvm list              # 安装完毕查看安装的 node 版本
node -v               # 查看是否安装好了
 
yum install git   # git 安装
```
<a name="wKQpH"></a>
## 4. Nginx 操作常用命令

<br />Nginx 的命令在控制台中输入 nginx -h 就可以看到完整的命令，这里列举几个常用的命令：<br />

```basic
nginx -s reload  # 向主进程发送信号，重新加载配置文件，热重启
nginx -s reopen	 # 重启 Nginx
nginx -s stop    # 快速关闭
nginx -s quit    # 等待工作进程处理完成后关闭
nginx -T         # 查看当前 Nginx 最终的配置
nginx -t -c <配置路径>    # 检查配置是否有问题，如果已经在配置目录，则不需要-c
```
systemctl 是 Linux 系统应用管理工具 systemd 的主命令，用于管理系统，我们也可以用它来对 Nginx 进行管理，相关命令如下：<br />

```basic
systemctl start nginx    # 启动 Nginx
systemctl stop nginx     # 停止 Nginx
systemctl restart nginx  # 重启 Nginx
systemctl reload nginx   # 重新加载 Nginx，用于修改配置后
systemctl enable nginx   # 设置开机启动 Nginx
systemctl disable nginx  # 关闭开机启动 Nginx
systemctl status nginx   # 查看 Nginx 运行状态
```
<a name="uecAe"></a>
## 5. Nginx 配置语法

<br />就跟前面文件作用讲解的图所示，Nginx 的主配置文件是 /etc/nginx/nginx.conf，你可以使用 cat -n nginx.conf 来查看配置。<br />nginx.conf 结构图可以这样概括：<br />

```basic
main        # 全局配置，对全局生效
├── events  # 配置影响 Nginx 服务器或与用户的网络连接
├── http    # 配置代理，缓存，日志定义等绝大多数功能和第三方模块的配置
│   ├── upstream # 配置后端服务器具体地址，负载均衡配置不可或缺的部分
│   ├── server   # 配置虚拟主机的相关参数，一个 http 块中可以有多个 server 块
│   ├── server
│   │   ├── location  # server 块可以包含多个 location 块，location 指令用于匹配 uri
│   │   ├── location
│   │   └── ...
│   └── ...
└── ...
```
一个 Nginx 配置文件的结构就像 nginx.conf 显示的那样，配置文件的语法规则：<br />

1. 配置文件由指令与指令块构成；
1. 每条指令以 ; 分号结尾，指令与参数间以空格符号分隔；
1. 指令块以 {} 大括号将多条指令组织在一起；
1. include 语句允许组合多个配置文件以提升可维护性；
1. 使用 # 符号添加注释，提高可读性；
1. 使用 $ 符号使用变量；
1. 部分指令的参数支持正则表达式；


<br />

<a name="eZGkz"></a>
### 5.1 典型配置

<br />Nginx 的典型配置：<br />
<br />

```basic
user  nginx;                        # 运行用户，默认即是nginx，可以不进行设置
worker_processes  1;                # Nginx 进程数，一般设置为和 CPU 核数一样
error_log  /var/log/nginx/error.log warn;   # Nginx 的错误日志存放目录
pid        /var/run/nginx.pid;      # Nginx 服务启动时的 pid 存放位置
 
events {
    use epoll;     # 使用epoll的I/O模型(如果你不知道Nginx该使用哪种轮询方法，会自动选择一个最适合你操作系统的)
    worker_connections 1024;   # 每个进程允许最大并发数
}
 
http {   # 配置使用最频繁的部分，代理、缓存、日志定义等绝大多数功能和第三方模块的配置都在这里设置
    # 设置日志模式
    log_format  main  '$remote_addr - $remote_user [$time_local] "$request" '
                      '$status $body_bytes_sent "$http_referer" '
                      '"$http_user_agent" "$http_x_forwarded_for"';
 
    access_log  /var/log/nginx/access.log  main;   # Nginx访问日志存放位置
 
    sendfile            on;   # 开启高效传输模式
    tcp_nopush          on;   # 减少网络报文段的数量
    tcp_nodelay         on;
    keepalive_timeout   65;   # 保持连接的时间，也叫超时时间，单位秒
    types_hash_max_size 2048;
 
    include             /etc/nginx/mime.types;      # 文件扩展名与类型映射表
    default_type        application/octet-stream;   # 默认文件类型
 
    include /etc/nginx/conf.d/*.conf;   # 加载子配置项
    
    server {
    	listen       80;       # 配置监听的端口
    	server_name  localhost;    # 配置的域名
    	
    	location / {
    		root   /usr/share/nginx/html;  # 网站根目录
    		index  index.html index.htm;   # 默认首页文件
    		deny 172.168.22.11;   # 禁止访问的ip地址，可以为all
    		allow 172.168.33.44；# 允许访问的ip地址，可以为all
    	}
    	
    	error_page 500 502 503 504 /50x.html;  # 默认50x对应的访问页面
    	error_page 400 404 error.html;   # 同上
    }
}
```

<br />server 块可以包含多个 location 块，location 指令用于匹配 uri，语法：<br />

```basic
location [ = | ~ | ~* | ^~] uri {
	...
}
```
指令后面：<br />
<br />1、= 精确匹配路径，用于不含正则表达式的 uri 前，如果匹配成功，不再进行后续的查找；<br />
<br />2、^~ 用于不含正则表达式的 uri 前，表示如果该符号后面的字符是最佳匹配，采用该规则，不再进行后续的查找；<br />
<br />3、~ 表示用该符号后面的正则去匹配路径，区分大小写；<br />
<br />4、~* 表示用该符号后面的正则去匹配路径，不区分大小写。跟 ~ 优先级都比较低，如有多个location的正则能匹配的话，则使用正则表达式最长的那个；<br />
<br />如果 uri 包含正则表达式，则必须要有 ~ 或 ~* 标志。<br />

<a name="vRXbF"></a>
### 5.2 全局变量
Nginx 有一些常用的全局变量，你可以在配置的任何位置使用它们，如下表：<br />  
| 全局变量 | 功能 |
| --- | --- |

| $host | 请求信息中的 Host，如果请求中没有 Host 行，则等于设置的服务器名，不包含端口 |
| --- | --- |
| $request_method | 客户端请求类型，如 GET、POST |
| $remote_addr | 客户端的 IP 地址 |
| $args | 请求中的参数 |
| $arg_PARAMETER | GET 请求中变量名 PARAMETER 参数的值，例如：$http_user_agent(Uaer-Agent 值), $http_referer... |
| $content_length | 请求头中的 Content-length 字段 |
| $http_user_agent | 客户端agent信息 |
| $http_cookie | 客户端cookie信息 |
| $remote_addr | 客户端的IP地址 |
| $remote_port | 客户端的端口 |
| $http_user_agent | 客户端agent信息 |
| $server_protocol | 请求使用的协议，如 HTTP/1.0、HTTP/1.1 |
| $server_addr | 服务器地址 |
| $server_name | 服务器名称 |
| $server_port | 服务器的端口号 |
| $scheme | HTTP 方法（如http，https） |

还有更多的内置预定义变量，可以直接搜索关键字「nginx内置预定义变量」可以看到一堆博客写这个，这些变量都可以在配置文件中直接使用。<br />

<a name="AYjiR"></a>
## 6. 设置二级域名虚拟主机

<br />在某某云 ☁️ 上购买了域名之后，就可以配置虚拟主机了，一般配置的路径在 域名管理 -> 解析 -> 添加记录 中添加二级域名，配置后某某云会把二级域名也解析到我们配置的服务器 IP 上，然后我们在 Nginx 上配置一下虚拟主机的访问监听，就可以拿到从这个二级域名过来的请求了。<br />![](https://cdn.nlark.com/yuque/0/2021/png/2899468/1618487344798-da3b42bc-fe3f-4a9f-b231-f29c2c23e217.png#clientId=u9a067f17-d621-4&from=paste&height=487&id=uda04c6c2&margin=%5Bobject%20Object%5D&originHeight=487&originWidth=1080&originalType=url&status=done&style=none&taskId=u2a9e6ea3-fadb-48af-bbd9-5f1f2fd9951&width=1080)<br />
<br />现在我自己的服务器上配置了一个 fe 的二级域名，也就是说在外网访问 fe.sherlocked93.club 的时候，也可以访问到我们的服务器了。<br />
<br />由于默认配置文件 /etc/nginx/nginx.conf 的 http 模块中有一句 include /etc/nginx/conf.d/*.conf 也就是说 conf.d 文件夹下的所有 *.conf 文件都会作为子配置项被引入配置文件中。为了维护方便，我在 /etc/nginx/conf.d 文件夹中新建一个。<br />

```basic
# /etc/nginx/conf.d/fe.sherlocked93.club.conf
 
server {
  listen 80;
	server_name fe.sherlocked93.club;
 
	location / {
		root  /usr/share/nginx/html/fe;
		index index.html;
	}
}
```
然后在 /usr/share/nginx/html 文件夹下新建 fe 文件夹，新建文件 index.html，内容随便写点，改完 nginx -s reload 重新加载，浏览器中输入 fe.sherlocked93.club，发现从二级域名就可以访问到我们刚刚新建的 fe 文件夹：<br />
<br />![](https://cdn.nlark.com/yuque/0/2021/png/2899468/1618487389554-83e7e33d-9e6d-4511-bfca-185e6578f3df.png#clientId=u9a067f17-d621-4&from=paste&height=232&id=ufb91fe97&margin=%5Bobject%20Object%5D&originHeight=232&originWidth=651&originalType=url&status=done&style=none&taskId=u7328468e-8a2a-463c-bc8b-d0fd647756b&width=651)<br />

<a name="ou1Nl"></a>
## 7. 配置反向代理

<br />反向代理是工作中最常用的服务器功能，经常被用来解决跨域问题，下面简单介绍一下如何实现反向代理。<br />首先进入 Nginx 的主配置文件：<br />

```basic
vim /etc/nginx/nginx.conf
```
为了看起来方便，把行号显示出来 :set nu （个人习惯），然后我们去 http 模块的 server 块中的 location /，增加一行将默认网址重定向到最大学习网站 Bilibili 的 proxy_pass配置 🤓 ：<br />
<br />![](https://cdn.nlark.com/yuque/0/2021/png/2899468/1618487433165-d0eb681c-e08f-4be2-849b-48184a7b15e7.png#clientId=u9a067f17-d621-4&from=paste&height=237&id=u93db2f74&margin=%5Bobject%20Object%5D&originHeight=237&originWidth=597&originalType=url&status=done&style=none&taskId=ud00652fe-c667-4924-a64c-860782a12f9&width=597)<br />
<br />改完保存退出，nginx -s reload 重新加载，进入默认网址，那么现在就直接跳转到 B 站了，实现了一个简单的代理。<br />
<br />实际使用中，可以将请求转发到本机另一个服务器上，也可以根据访问的路径跳转到不同端口的服务中。<br />
<br />比如我们监听 9001 端口，然后把访问不同路径的请求进行反向代理：<br />
<br />把访问 http://127.0.0.1:9001/edu 的请求转发到 http://127.0.0.1:8080<br />
<br />把访问 http://127.0.0.1:9001/vod 的请求转发到 http://127.0.0.1:8081<br />
<br />这种要怎么配置呢，首先同样打开主配置文件，然后在 http 模块下增加一个 server 块：<br />
<br />

```basic
server {
  listen 9001;
  server_name *.sherlocked93.club;
 
  location ~ /edu/ {
    proxy_pass http://127.0.0.1:8080;
  }
  
  location ~ /vod/ {
    proxy_pass http://127.0.0.1:8081;
  }
}
```
反向代理还有一些其他的指令，可以了解一下：<br />
<br />1、proxy_set_header：在将客户端请求发送给后端服务器之前，更改来自客户端的请求头信息；<br />
<br />2、proxy_connect_timeout：配置 Nginx 与后端代理服务器尝试建立连接的超时时间；<br />
<br />3、proxy_read_timeout：配置 Nginx 向后端服务器组发出 read 请求后，等待相应的超时时间；<br />
<br />4、proxy_send_timeout：配置 Nginx 向后端服务器组发出 write 请求后，等待相应的超时时间；<br />
<br />5、proxy_redirect：用于修改后端服务器返回的响应头中的 Location 和 Refresh。<br />
<br />

<a name="ZXm3h"></a>
## 8. 跨域 CORS 配置

<br />关于简单请求、非简单请求、跨域的概念，前面已经介绍过了，还不了解的可以看看前面的讲解。现在前后端分离的项目一统天下，经常本地起了前端服务，需要访问不同的后端地址，不可避免遇到跨域问题。<br />
<br />![](https://cdn.nlark.com/yuque/0/2021/png/2899468/1618487618103-e36efe86-f7b5-4f07-b87a-d6d499be070e.png#clientId=u9a067f17-d621-4&from=paste&height=108&id=u7e9d5837&margin=%5Bobject%20Object%5D&originHeight=108&originWidth=863&originalType=url&status=done&style=none&taskId=u4c277b69-8a32-41dc-9368-271b91a066f&width=863)<br />
<br />要解决跨域问题，我们来制造一个跨域问题。首先和前面设置二级域名的方式一样，先设置好 fe.sherlocked93.club 和 be.sherlocked93.club 二级域名，都指向本云服务器地址，虽然对应 IP 是一样的，但是在 fe.sherlocked93.club 域名发出的请求访问 be.sherlocked93.club 域名的请求还是跨域了，因为访问的 host 不一致（如果不知道啥原因参见前面跨域的内容）。<br />

<a name="RuO0C"></a>
### 8.1 使用反向代理解决跨域

<br />在前端服务地址为 fe.sherlocked93.club 的页面请求 be.sherlocked93.club 的后端服务导致的跨域，可以这样配置：<br />

```basic
server {
  listen 9001;
  server_name fe.sherlocked93.club;
 
  location / {
    proxy_pass be.sherlocked93.club;
  }
}
```
这样就将对前一个域名 fe.sherlocked93.club 的请求全都代理到了 be.sherlocked93.club，前端的请求都被我们用服务器代理到了后端地址下，绕过了跨域。<br />
<br />这里对静态文件的请求和后端服务的请求都以 fe.sherlocked93.club 开始，不易区分，所以为了实现对后端服务请求的统一转发，通常我们会约定对后端服务的请求加上 /apis/ 前缀或者其他的 path 来和对静态资源的请求加以区分，此时我们可以这样配置：<br />

```basic
# 请求跨域，约定代理后端服务请求path以/apis/开头
location ^~/apis/ {
    # 这里重写了请求，将正则匹配中的第一个分组的path拼接到真正的请求后面，并用break停止后续匹配
    rewrite ^/apis/(.*)$ /$1 break;
    proxy_pass be.sherlocked93.club;
  
    # 两个域名之间cookie的传递与回写
    proxy_cookie_domain be.sherlocked93.club fe.sherlocked93.club;
}
```
这样，静态资源我们使用 fe.sherlocked93.club/xx.html，动态资源我们使用 fe.sherlocked93.club/apis/getAwo，浏览器页面看起来仍然访问的前端服务器，绕过了浏览器的同源策略，毕竟我们看起来并没有跨域。<br />
<br />也可以统一一点，直接把前后端服务器地址直接都转发到另一个 server.sherlocked93.club，只通过在后面添加的 path 来区分请求的是静态资源还是后端服务，看需求了。<br />
<br />

<a name="RCb5j"></a>
### 8.2 配置 header 解决跨域
当浏览器在访问跨源的服务器时，也可以在跨域的服务器上直接设置 Nginx，从而前端就可以无感地开发，不用把实际上访问后端的地址改成前端服务的地址，这样可适性更高。<br />
<br />比如前端站点是 fe.sherlocked93.club，这个地址下的前端页面请求 be.sherlocked93.club 下的资源，比如前者的 fe.sherlocked93.club/index.html 内容是这样的：<br />

```html
<html>
<body>
    <h1>welcome fe.sherlocked93.club!!<h1>
    <script type='text/javascript'>
    var xmlhttp = new XMLHttpRequest()
    xmlhttp.open("GET", "http://be.sherlocked93.club/index.html", true);
    xmlhttp.send();
    </script>
</body>
</html>
```
打开浏览器访问 fe.sherlocked93.club/index.html 的结果如下：<br />
<br />![](https://cdn.nlark.com/yuque/0/2021/png/2899468/1618487884399-5663648e-b95a-4faa-b928-0ec1df7c004a.png#clientId=u9a067f17-d621-4&from=paste&height=632&id=u07e5e4c8&margin=%5Bobject%20Object%5D&originHeight=632&originWidth=997&originalType=url&status=done&style=none&taskId=ud2f020e0-0e78-4a7e-bea3-4d50f48c1f1&width=997)<br />
<br />很明显这里是跨域请求，在浏览器中直接访问 http://be.sherlocked93.club/index.html 是可以访问到的，但是在 fe.sherlocked93.club 的 html 页面访问就会出现跨域。<br />在 /etc/nginx/conf.d/ 文件夹中新建一个配置文件，对应二级域名 be.sherlocked93.club：<br />

```basic

# /etc/nginx/conf.d/be.sherlocked93.club.conf
 
server {
  listen       80;
  server_name  be.sherlocked93.club;
  
	add_header 'Access-Control-Allow-Origin' $http_origin;   # 全局变量获得当前请求origin，带cookie的请求不支持*
	add_header 'Access-Control-Allow-Credentials' 'true';    # 为 true 可带上 cookie
	add_header 'Access-Control-Allow-Methods' 'GET, POST, OPTIONS';  # 允许请求方法
	add_header 'Access-Control-Allow-Headers' $http_access_control_request_headers;  # 允许请求的 header，可以为 *
	add_header 'Access-Control-Expose-Headers' 'Content-Length,Content-Range';
	
  if ($request_method = 'OPTIONS') {
		add_header 'Access-Control-Max-Age' 1728000;   # OPTIONS 请求的有效期，在有效期内不用发出另一条预检请求
		add_header 'Content-Type' 'text/plain; charset=utf-8';
		add_header 'Content-Length' 0;
    
		return 204;                  # 200 也可以
	}
  
	location / {
		root  /usr/share/nginx/html/be;
		index index.html;
	}
}
```
然后 nginx -s reload 重新加载配置。这时再访问 fe.sherlocked93.club/index.html 结果如下，请求中出现了我们刚刚配置的 Header：<br />
<br />![](https://cdn.nlark.com/yuque/0/2021/png/2899468/1618487930790-57995c9d-ce13-4996-90ee-b4665c92b47f.png#clientId=u9a067f17-d621-4&from=paste&height=726&id=u7e4f4a34&margin=%5Bobject%20Object%5D&originHeight=726&originWidth=1080&originalType=url&status=done&style=none&taskId=ueca33d8f-0636-4d95-b1f8-8cd5d5953f4&width=1080)<br />
<br />解决了跨域问题。<br />

<a name="8Z9Gs"></a>
## 9. 开启 gzip 压缩
gzip 是一种常用的网页压缩技术，传输的网页经过 gzip 压缩之后大小通常可以变为原来的一半甚至更小（官网原话），更小的网页体积也就意味着带宽的节约和传输速度的提升，特别是对于访问量巨大大型网站来说，每一个静态资源体积的减小，都会带来可观的流量与带宽的节省。<br />
<br />百度可以找到很多检测站点来查看目标网页有没有开启 gzip 压缩，在下随便找了一个 <网页GZIP压缩检测> 输入掘金 juejin.im 来偷窥下掘金有没有开启 gzip。<br />
<br />![](https://cdn.nlark.com/yuque/0/2021/png/2899468/1618487951308-aa5e5912-b0e3-4e4d-8bf9-a859c007d1a6.png#clientId=u9a067f17-d621-4&from=paste&height=460&id=udff87aa9&margin=%5Bobject%20Object%5D&originHeight=460&originWidth=1080&originalType=url&status=done&style=none&taskId=u104e377c-f4f8-436c-a2d1-13a9ad5bdab&width=1080)<br />
<br />这里可以看到掘金是开启了 gzip 的，压缩效果还挺不错，达到了 52% 之多，本来 34kb 的网页体积，压缩完只需要 16kb，可以想象网页传输速度提升了不少。<br />

<a name="wjS6i"></a>
### 9.1 Nginx 配置 gzip
使用 gzip 不仅需要 Nginx 配置，浏览器端也需要配合，需要在请求消息头中包含 Accept-Encoding: gzip（IE5 之后所有的浏览器都支持了，是现代浏览器的默认设置）。<br />
<br />一般在请求 html 和 css 等静态资源的时候，支持的浏览器在 request 请求静态资源的时候，会加上 Accept-Encoding: gzip 这个 header，表示自己支持 gzip 的压缩方式，Nginx 在拿到这个请求的时候，如果有相应配置，就会返回经过 gzip 压缩过的文件给浏览器，并在 response 相应的时候加上 content-encoding: gzip 来告诉浏览器自己采用的压缩方式（因为浏览器在传给服务器的时候一般还告诉服务器自己支持好几种压缩方式），浏览器拿到压缩的文件后，根据自己的解压方式进行解析。<br />
<br />先来看看 Nginx 怎么进行 gzip 配置，和之前的配置一样，为了方便管理，还是在 /etc/nginx/conf.d/ 文件夹中新建配置文件 gzip.conf ：<br />

```basic
# /etc/nginx/conf.d/gzip.conf
 
gzip on; # 默认off，是否开启gzip
gzip_types text/plain text/css application/json application/x-javascript text/xml application/xml application/xml+rss text/javascript;
 
# 上面两个开启基本就能跑起了，下面的愿意折腾就了解一下
gzip_static on;
gzip_proxied any;
gzip_vary on;
gzip_comp_level 6;
gzip_buffers 16 8k;
# gzip_min_length 1k;
gzip_http_version 1.1;
```
稍微解释一下：<br />1、gzip_types：要采用 gzip 压缩的 MIME 文件类型，其中 text/html 被系统强制启用；<br />
<br />2、gzip_static：默认 off，该模块启用后，Nginx 首先检查是否存在请求静态文件的 gz 结尾的文件，如果有则直接返回该 .gz 文件内容；<br />
<br />3、gzip_proxied：默认 off，nginx做为反向代理时启用，用于设置启用或禁用从代理服务器上收到相应内容 gzip 压缩；<br />
<br />4、gzip_vary：用于在响应消息头中添加 Vary：Accept-Encoding，使代理服务器根据请求头中的 Accept-Encoding 识别是否启用 gzip 压缩；<br />
<br />5、gzip_comp_level：gzip 压缩比，压缩级别是 1-9，1 压缩级别最低，9 最高，级别越高压缩率越大，压缩时间越长，建议 4-6；<br />
<br />6、gzip_buffers：获取多少内存用于缓存压缩结果，16 8k 表示以 8k*16 为单位获得；<br />
<br />7、gzip_min_length：允许压缩的页面最小字节数，页面字节数从header头中的 Content-Length 中进行获取。默认值是 0，不管页面多大都压缩。建议设置成大于 1k 的字节数，小于 1k 可能会越压越大；<br />
<br />8、gzip_http_version：默认 1.1，启用 gzip 所需的 HTTP 最低版本；<br />
<br />这个配置可以插入到 http 模块整个服务器的配置里，也可以插入到需要使用的虚拟主机的 server 或者下面的 location 模块中，当然像上面我们这样写的话就是被 include 到 http 模块中了。<br />其他更全的配置信息可以查看 <官网文档ngx_http_gzip_module>，配置前是这样的：<br />
<br />![](https://cdn.nlark.com/yuque/0/2021/png/2899468/1618488079049-244bdf85-5d44-4aa6-81ec-99224778a8ee.png#clientId=u9a067f17-d621-4&from=paste&height=548&id=u09e25e66&margin=%5Bobject%20Object%5D&originHeight=548&originWidth=1080&originalType=url&status=done&style=none&taskId=u93867eb4-cf21-498a-82f4-8591b9d59c9&width=1080)<br />
<br />配置之后 response 的 header 里面多了一个 Content-Encoding: gzip，返回信息被压缩了：<br />
<br />![](https://cdn.nlark.com/yuque/0/2021/png/2899468/1618488090964-44ab3737-ca2c-443e-a6ed-bc9935168bd0.png#clientId=u9a067f17-d621-4&from=paste&height=641&id=u953f0867&margin=%5Bobject%20Object%5D&originHeight=641&originWidth=1080&originalType=url&status=done&style=none&taskId=ub623ee7f-6995-4f63-8f8f-4bd1c42d6c2&width=1080)<br />
<br />注意了，一般 gzip 的配置建议加上 gzip_min_length 1k，不加的话：<br />
<br />![](https://cdn.nlark.com/yuque/0/2021/png/2899468/1618488106524-234cb902-fbff-49bf-b46e-b710014cddb0.png#clientId=u9a067f17-d621-4&from=paste&height=426&id=ufbdfc82d&margin=%5Bobject%20Object%5D&originHeight=426&originWidth=998&originalType=url&status=done&style=none&taskId=u8ab20def-d4b3-4c4e-96ad-c7562da9abd&width=998)<br />由于文件太小，gzip 压缩之后得到了 -48% 的体积优化，压缩之后体积还比压缩之前体积大了，所以最好设置低于 1kb 的文件就不要 gzip 压缩了 🤪<br />

<a name="YIonl"></a>
### 9.2 Webpack 的 gzip 配置
当前端项目使用 Webpack 进行打包的时候，也可以开启 gzip 压缩：<br />

```javascript
// vue-cli3 的 vue.config.js 文件
const CompressionWebpackPlugin = require('compression-webpack-plugin')
 
module.exports = {
  // gzip 配置
  configureWebpack: config => {
    if (process.env.NODE_ENV === 'production') {
      // 生产环境
      return {
        plugins: [new CompressionWebpackPlugin({
          test: /\.js$|\.html$|\.css/,    // 匹配文件名
          threshold: 10240,               // 文件压缩阈值，对超过10k的进行压缩
          deleteOriginalAssets: false     // 是否删除源文件
        })]
      }
    }
  },
  ...
}
```
由此打包出来的文件如下图：<br />
<br />![](https://cdn.nlark.com/yuque/0/2021/png/2899468/1618488154975-3fb9bd5e-2286-445b-99fd-54d28986908d.png#clientId=u9a067f17-d621-4&from=paste&height=741&id=ufc1c7735&margin=%5Bobject%20Object%5D&originHeight=741&originWidth=499&originalType=url&status=done&style=none&taskId=u3bfe6b15-7003-443a-b837-33a7cc304ec&width=499)<br />
<br />这里可以看到某些打包之后的文件下面有一个对应的 .gz 经过 gzip 压缩之后的文件，这是因为这个文件超过了 10kb，有的文件没有超过 10kb 就没有进行 gzip 打包，如果你期望压缩文件的体积阈值小一点，可以在 compression-webpack-plugin 这个插件的配置里进行对应配置。<br />
<br />那么为啥这里 Nginx 已经有了 gzip 压缩，Webpack 这里又整了个 gzip 呢，因为如果全都是使用 Nginx 来压缩文件，会耗费服务器的计算资源，如果服务器的 gzip_comp_level 配置的比较高，就更增加服务器的开销，相应增加客户端的请求时间，得不偿失。<br />
<br />如果压缩的动作在前端打包的时候就做了，把打包之后的高压缩等级文件作为静态资源放在服务器上，Nginx 会优先查找这些压缩之后的文件返回给客户端，相当于把压缩文件的动作从 Nginx 提前给 Webpack 打包的时候完成，节约了服务器资源，所以一般推介在生产环境应用 Webpack 配置 gzip 压缩。<br />

<a name="Otoz6"></a>
## 10. 配置负载均衡

<br />负载均衡在之前已经介绍了相关概念了，主要思想就是把负载均匀合理地分发到多个服务器上，实现压力分流的目的。<br />主要配置如下：<br />

```basic

http {
  upstream myserver {
  	# ip_hash;  # ip_hash 方式
    # fair;   # fair 方式
    server 127.0.0.1:8081;  # 负载均衡目的服务地址
    server 127.0.0.1:8080;
    server 127.0.0.1:8082 weight=10;  # weight 方式，不写默认为 1
  }
 
  server {
    location / {
    	proxy_pass http://myserver;
      proxy_connect_timeout 10;
    }
  }
}
```
Nginx 提供了好几种分配方式，默认为**轮询**，就是轮流来。有以下几种分配方式：<br />

> 1、轮询，默认方式，每个请求按时间顺序逐一分配到不同的后端服务器，如果后端服务挂了，能自动剔除；
> 

> 2、weight，权重分配，指定轮询几率，权重越高，在被访问的概率越大，用于后端服务器性能不均的情况；
> 

> 3、ip_hash，每个请求按访问 IP 的 hash 结果分配，这样每个访客固定访问一个后端服务器，可以解决动态网页 session 共享问题。负载均衡每次请求都会重新定位到服务器集群中的某一个，那么已经登录某一个服务器的用户再重新定位到另一个服务器，其登录信息将会丢失，这样显然是不妥的；
> 

> 4、fair（第三方），按后端服务器的响应时间分配，响应时间短的优先分配，依赖第三方插件 nginx-upstream-fair，需要先安装；


<br />

<a name="vYG6M"></a>
## 11. 配置动静分离
动静分离在之前也介绍过了，就是把动态和静态的请求分开。方式主要有两种，一种 是纯粹把静态文件独立成单独的域名，放在独立的服务器上，也是目前主流推崇的方案。另外一种方法就是动态跟静态文件混合在一起发布， 通过 Nginx 配置来分开。<br />
<br />通过 location 指定不同的后缀名实现不同的请求转发。通过 expires 参数设置，可以使浏览器缓存过期时间，减少与服务器之前的请求和流量。具体 expires 定义：是给一个资源设定一个过期时间，也就是说无需去服务端验证，直接通过浏览器自身确认是否过期即可，所以不会产生额外的流量。此种方法非常适合不经常变动的资源。（如果经常更新的文件，不建议使用 expires 来缓存），我这里设置 3d，表示在这 3 天之内访问这个URL，发送一个请求，比对服务器该文件最后更新时间没有变化。则不会从服务器抓取，返回状态码 304，如果有修改，则直接从服务器重新下载，返回状态码 200。<br />

```basic
server {
  location /www/ {
  	root /data/;
    index index.html index.htm;
  }
  
  location /image/ {
  	root /data/;
    autoindex on;
  }
}
```
<a name="4SEjk"></a>
## 12. 配置高可用集群（双机热备）

<br />当主 Nginx 服务器宕机之后，切换到备份 Nginx 服务器<br />
<br />![](https://cdn.nlark.com/yuque/0/2021/png/2899468/1618488309479-4adcbe15-5919-4373-a396-ce29e3ebe079.png#clientId=u9a067f17-d621-4&from=paste&height=249&id=ub2cc0e52&margin=%5Bobject%20Object%5D&originHeight=249&originWidth=875&originalType=url&status=done&style=none&taskId=u31baea7f-1639-411d-8169-b2da7e3af94&width=875)<br />首先安装 keepalived，
```basic
yum install keepalived -y
```
然后编辑 /etc/keepalived/keepalived.conf 配置文件，并在配置文件中增加 vrrp_script定义一个外围检测机制，并在 vrrp_instance 中通过定义 track_script 来追踪脚本执行过程，实现节点转移：<br />

```basic
global_defs{
   notification_email {
        acassen@firewall.loc
   }
   notification_email_from Alexandre@firewall.loc
   smtp_server 127.0.0.1
   smtp_connect_timeout 30 // 上面都是邮件配置，没卵用
   router_id LVS_DEVEL     // 当前服务器名字，用hostname命令来查看
}
vrrp_script chk_maintainace { // 检测机制的脚本名称为chk_maintainace
    script "[[ -e/etc/keepalived/down ]] && exit 1 || exit 0" // 可以是脚本路径或脚本命令
    // script "/etc/keepalived/nginx_check.sh"    // 比如这样的脚本路径
    interval 2  // 每隔2秒检测一次
    weight -20  // 当脚本执行成立，那么把当前服务器优先级改为-20
}
vrrp_instanceVI_1 {   // 每一个vrrp_instance就是定义一个虚拟路由器
    state MASTER      // 主机为MASTER，备用机为BACKUP
    interface eth0    // 网卡名字，可以从ifconfig中查找
    virtual_router_id 51 // 虚拟路由的id号，一般小于255，主备机id需要一样
    priority 100      // 优先级，master的优先级比backup的大
    advert_int 1      // 默认心跳间隔
    authentication {  // 认证机制
        auth_type PASS
        auth_pass 1111   // 密码
    }
    virtual_ipaddress {  // 虚拟地址vip
       172.16.2.8
    }
}
```
其中检测脚本 nginx_check.sh，这里提供一个：<br />

```basic
#!/bin/bash
A=`ps -C nginx --no-header | wc -l`
if [ $A -eq 0 ];then
    /usr/sbin/nginx # 尝试重新启动nginx
    sleep 2         # 睡眠2秒
    if [ `ps -C nginx --no-header | wc -l` -eq 0 ];then
        killall keepalived # 启动失败，将keepalived服务杀死。将vip漂移到其它备份节点
    fi
fi
```
复制一份到备份服务器，备份 Nginx 的配置要将 state 后改为 BACKUP，priority 改为比主机小。<br />
<br />设置完毕后各自 service keepalived start 启动，经过访问成功之后，可以把 Master 机的 keepalived 停掉，此时 Master 机就不再是主机了 service keepalived stop，看访问虚拟 IP 时是否能够自动切换到备机 ip addr。<br />
<br />再次启动 Master 的 keepalived，此时 vip 又变到了主机上<br />

<a name="me20V"></a>
## 13. 适配 PC 或移动设备

<br />根据用户设备不同返回不同样式的站点，以前经常使用的是纯前端的自适应布局，但无论是复杂性和易用性上面还是不如分开编写的好，比如我们常见的淘宝、京东......这些大型网站就都没有采用自适应，而是用分开制作的方式，根据用户请求的 user-agent 来判断是返回 PC 还是 H5 站点。<br />
<br />首先在 /usr/share/nginx/html 文件夹下 mkdir 分别新建两个文件夹 PC 和 mobile，vim 编辑两个 index.html 随便写点内容。<br />

```basic

cd /usr/share/nginx/html
mkdir pc mobile
cd pc
vim index.html   # 随便写点比如 hello pc!
cd ../mobile
vim index.html   # 随便写点比如 hello mobile!
```
然后和设置二级域名虚拟主机时候一样，去 /etc/nginx/conf.d 文件夹下新建一个配置文件 fe.sherlocked93.club.conf ：<br />

```basic
# /etc/nginx/conf.d/fe.sherlocked93.club.conf
 
server {
  listen 80;
	server_name fe.sherlocked93.club;
 
	location / {
		root  /usr/share/nginx/html/pc;
    if ($http_user_agent ~* '(Android|webOS|iPhone|iPod|BlackBerry)') {
      root /usr/share/nginx/html/mobile;
    }
		index index.html;
	}
}
```
配置基本没什么不一样的，主要多了一个 if 语句，然后使用 $http_user_agent 全局变量来判断用户请求的 user-agent，指向不同的 root 路径，返回对应站点。<br />
<br />在浏览器访问这个站点，然后 F12 中模拟使用手机访问：<br />
<br />![](https://cdn.nlark.com/yuque/0/2021/png/2899468/1618488464757-b84f8210-d3ab-473f-b91a-45300826aa52.png#clientId=u9a067f17-d621-4&from=paste&height=521&id=u72f11804&margin=%5Bobject%20Object%5D&originHeight=521&originWidth=639&originalType=url&status=done&style=none&taskId=u73af2a0d-e934-4e30-9a96-b303857c8e8&width=639)<br />
<br />可以看到在模拟使用移动端访问的时候，Nginx 返回的站点变成了移动端对应的 html 了。<br />

<a name="Q9z1f"></a>
## 14. 配置 HTTPS
具体配置过程网上挺多的了，也可以使用你购买的某某云，一般都会有免费申请的服务器证书，安装直接看所在云的操作指南即可。<br />
<br />我购买的腾讯云提供的亚洲诚信机构颁发的免费证书只能一个域名使用，二级域名什么的需要另外申请，但是申请审批比较快，一般几分钟就能成功，然后下载证书的压缩文件，里面有个 nginx 文件夹，把 xxx.crt 和 xxx.key 文件拷贝到服务器目录，再配置下：
```basic
server {
  listen 443 ssl http2 default_server;   # SSL 访问端口号为 443
  server_name sherlocked93.club;         # 填写绑定证书的域名
 
  ssl_certificate /etc/nginx/https/1_sherlocked93.club_bundle.crt;   # 证书文件地址
  ssl_certificate_key /etc/nginx/https/2_sherlocked93.club.key;      # 私钥文件地址
  ssl_session_timeout 10m;
 
  ssl_protocols TLSv1 TLSv1.1 TLSv1.2;      #请按照以下协议配置
  ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:HIGH:!aNULL:!MD5:!RC4:!DHE;
  ssl_prefer_server_ciphers on;
  
  location / {
    root         /usr/share/nginx/html;
    index        index.html index.htm;
  }
}
```
写完 nginx -t -q 校验一下，没问题就 nginx -s reload，现在去访问 https://sherlocked93.club/ 就能访问 HTTPS 版的网站了。<br />
<br />一般还可以加上几个增强安全性的命令：<br />

```basic
add_header X-Frame-Options DENY;           # 减少点击劫持
add_header X-Content-Type-Options nosniff; # 禁止服务器自动解析资源类型
add_header X-Xss-Protection 1;             # 防XSS攻击
```
<a name="4Ct8r"></a>
## 15. 一些常用技巧
<a name="o7JNe"></a>
### 15.1 静态服务


```basic
server {
  listen       80;
  server_name  static.sherlocked93.club;
  charset utf-8;    # 防止中文文件名乱码
 
  location /download {
    alias	          /usr/share/nginx/html/static;  # 静态资源目录
    
    autoindex               on;    # 开启静态资源列目录
    autoindex_exact_size    off;   # on(默认)显示文件的确切大小，单位是byte；off显示文件大概大小，单位KB、MB、GB
    autoindex_localtime     off;   # off(默认)时显示的文件时间为GMT时间；on显示的文件时间为服务器时间
  }
}
```
<a name="gzkQV"></a>
### 15.2 图片防盗链


```basic
server {
  listen       80;
  server_name  *.sherlocked93.club;
  
  # 图片防盗链
  location ~* \.(gif|jpg|jpeg|png|bmp|swf)$ {
    valid_referers none blocked 192.168.0.2;  # 只允许本机 IP 外链引用
    if ($invalid_referer){
      return 403;
    }
  }
}
```
<a name="VGd8Z"></a>
### 15.3 请求过滤


```basic

# 非指定请求全返回 403
if ( $request_method !~ ^(GET|POST|HEAD)$ ) {
  return 403;
}
 
location / {
  # IP访问限制（只允许IP是 192.168.0.2 机器访问）
  allow 192.168.0.2;
  deny all;
  
  root   html;
  index  index.html index.htm;
}
```
<a name="QmLlK"></a>
### 15.4 配置图片、字体等静态文件缓存

<br />由于图片、字体、音频、视频等静态文件在打包的时候通常会增加了 hash，所以缓存可以设置的长一点，先设置强制缓存，再设置协商缓存；如果存在没有 hash 值的静态文件，建议不设置强制缓存，仅通过协商缓存判断是否需要使用缓存。<br />

```basic

# 图片缓存时间设置
location ~ .*\.(css|js|jpg|png|gif|swf|woff|woff2|eot|svg|ttf|otf|mp3|m4a|aac|txt)$ {
	expires 10d;
}
# 如果不希望缓存
expires -1;
```
<a name="x6tCZ"></a>
### 15.5 单页面项目 history 路由配置


```basic
server {
  listen       80;
  server_name  fe.sherlocked93.club;
  
  location / {
    root       /usr/share/nginx/html/dist;  # vue 打包后的文件夹
    index      index.html index.htm;
    try_files  $uri $uri/ /index.html @rewrites;
    
    expires -1;                          # 首页一般没有强制缓存
    add_header Cache-Control no-cache;
  }
  
  # 接口转发，如果需要的话
  #location ~ ^/api {
  #  proxy_pass http://be.sherlocked93.club;
  #}
  
  location @rewrites {
    rewrite ^(.+)$ /index.html break;
  }
}
```
<a name="T8XdT"></a>
### 15.6 HTTP 请求转发到 HTTPS
配置完 HTTPS 后，浏览器还是可以访问 HTTP 的地址 http://sherlocked93.club/ 的，可以做一个 301 跳转，把对应域名的 HTTP 请求重定向到 HTTPS 上<br />

```basic
server {
    listen      80;
    server_name www.sherlocked93.club;
 
    # 单域名重定向
    if ($host = 'www.sherlocked93.club'){
        return 301 https://www.sherlocked93.club$request_uri;
    }
    # 全局非 https 协议时重定向
    if ($scheme != 'https') {
        return 301 https://$server_name$request_uri;
    }
 
    # 或者全部重定向
    return 301 https://$server_name$request_uri;
 
    # 以上配置选择自己需要的即可，不用全部加
}
```
<a name="qqjcN"></a>
### 15.7 泛域名路径分离

<br />这是一个非常实用的技能，经常有时候我们可能需要配置一些二级或者三级域名，希望通过 Nginx 自动指向对应目录，比如：<br />
<br />1、test1.doc.sherlocked93.club 自动指向 /usr/share/nginx/html/doc/test1 服务器地址；<br />
<br />2、test2.doc.sherlocked93.club 自动指向 /usr/share/nginx/html/doc/test2 服务器地址；
```basic
server {
    listen       80;
    server_name  ~^([\w-]+)\.doc\.sherlocked93\.club$;
 
    root /usr/share/nginx/html/doc/$1;
}
```
<a name="NVo6y"></a>
### 15.8 泛域名转发

<br />和之前的功能类似，有时候我们希望把二级或者三级域名链接重写到我们希望的路径，让后端就可以根据路由解析不同的规则：<br />
<br />1、test1.serv.sherlocked93.club/api?name=a 自动转发到 127.0.0.1:8080/test1/api?name=a ；<br />
<br />2、test2.serv.sherlocked93.club/api?name=a 自动转发到 127.0.0.1:8080/test2/api?name=a ；<br />

```basic
server {
    listen       80;
    server_name ~^([\w-]+)\.serv\.sherlocked93\.club$;
 
    location / {
        proxy_set_header        X-Real-IP $remote_addr;
        proxy_set_header        X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header        Host $http_host;
        proxy_set_header        X-NginX-Proxy true;
        proxy_pass              http://127.0.0.1:8080/$1$request_uri;
    }
}
```
<a name="zWE9d"></a>
## 16. 最佳实践

<br />1、为了使 Nginx 配置更易于维护，建议为每个服务创建一个单独的配置文件，存储在 /etc/nginx/conf.d 目录，根据需求可以创建任意多个独立的配置文件。<br />
<br />2、独立的配置文件，建议遵循以下命名约定 <服务>.conf，比如域名是 sherlocked93.club，那么你的配置文件的应该是这样的 /etc/nginx/conf.d/sherlocked93.club.conf，如果部署多个服务，也可以在文件名中加上 Nginx 转发的端口号，比如 sherlocked93.club.8080.conf，如果是二级域名，建议也都加上 fe.sherlocked93.club.conf。<br />
<br />3、常用的、复用频率比较高的配置可以放到 /etc/nginx/snippets 文件夹，在 Nginx 的配置文件中需要用到的位置 include 进去，以功能来命名，并在每个 snippet 配置文件的开头注释标明主要功能和引入位置，方便管理。比如之前的 gzip、cors 等常用配置，我都设置了 snippet。<br />
<br />4、Nginx 日志相关目录，内以 域名.type.log 命名（比如 be.sherlocked93.club.access.log 和 be.sherlocked93.club.error.log ）位于 /var/log/nginx/ 目录中，为每个独立的服务配置不同的访问权限和错误日志文件，这样查找错误时，会更加方便快捷。
