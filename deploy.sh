      #!/usr/bin/env sh

# 确保脚本抛出遇到的错误
set -e

# 生成静态文件
yarn build

# 进入生成的文件夹
cd docs/.vuepress/dist

# 如果是发布到自定义域名
echo 'www.52ctrl.com' > CNAME

git init
git add -A
git commit -m 'deploy'

# 如果你想要部署到 https://zhangjianliu.github.io
git push -f git@github.com:zhangjianliu/zhangjianliu.github.io.git master

# 如果发布到 https://zhangjianliu.github.io/<REPO>  REPO=github上的项目
git push -f git@github.com:zhangjianliu/vuePress-blog.git master:gh-pages

cd -