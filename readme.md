# LinNotes
使用electron+vue构建的桌面便签软件。功能完善中……

便签页支持置顶，便签内容支持markdown语法。

**注意：** TODO 框的语法为：
```markdown
* [ ]
```

## 安装
### 从release中下载
[release](https://github.com/ljs-2002/LinNotes/releases)中有windows和macOS的安装包，可以直接下载使用。其中，对于arm64架构的Windows没有提供安装包，只有免安装的Zip文件。
### 自行构建
若要通过代码自行构建，请先clone本仓库并安装node.js，开发环境使用的node.js版本为20.13.1。然后在项目文件夹中执行以下命令：
```bash
npm install -g yarn
yarn install
yarn build
yarn make
```
上述命令将在项目文件夹下*build*子文件夹中生成免安装的Zip文件和安装包（arm64架构的Windows没有安装包）。

***注意***：请先删除*./src/router/index.js*中的```import test from '@/components/test.vue'```，以及相关的路由，否则构建时会报错。