# 慢慢有光 · 给又没人看

一个手机友好的插画手账小站：每日幸运色、温柔签语、可种花与涂鸦的心情花园、PNG 导出和一封私人小信。纯静态，无需安装依赖，无后台、追踪或登录。装饰植物为网页原创 SVG，并非「又没人看」的作品。

## 发布

推送 main 后，`.github/workflows/pages.yml` 自动校验并发布 GitHub Pages。
首次发布需要仓库 Settings → Pages → Build and deployment → Source 选择 **GitHub Actions**。若自动启用失败，这是当前 GitHub 连接不具备 Pages 管理权限造成的；选择后到 Actions → Deploy gentle garden to GitHub Pages → Run workflow 重跑。

预计站点地址：https://felixqian284-create.github.io/lucky-dmb/ （以部署成功结果为准）

## 接入真实插画

小红书主页：https://www.xiaohongshu.com/user/profile/5659a462cb35fb02977ce0f0

已从用户提供的公开主页取得《骑士》《毛线团🧶》《爱与耗》三张公开笔记封面，保留完整画面、作者署名与平台水印，按实际画面色彩映射六种幸运色。图片本地托管，浏览时不依赖临时 CDN 地址；原作链接可跳回小红书。图片版权属于又没人看。

将获得授权的原图放入 `artworks/`，修改 `artworks.js`：

```js
window.ARTWORKS = [
  { title: '作品名称', src: './artworks/blue-01.jpg', colors: ['blue'], url: 'https://www.xiaohongshu.com/explore/真实笔记编号' }
];
```

支持色系：`silver` 月光银、`blue` 晴空蓝、`pink` 晚樱粉、`yellow` 奶油黄、`red` 蝴蝶结红、`white` 云朵白。一张作品可以关联多个色系。填入真实作品链接，勿保留示例地址。使用相对路径兼容仓库子目录。推送后自动更新。

## 使用与隐私

按访问者设备当地日期生成固定幸运色，同一天保持一致，次日更新。幸运色仅为娱乐及自我关怀仪式。花园存入浏览器 localStorage；无痕模式或存储被禁用时仍可绘制、导出，清理浏览器数据会删除存档。手机可点「种一朵」或直接触摸画布。外部字体不可用时自动使用系统字体；小红书可能要求登录。

本地预览可用任何静态服务器。检查：`node --check app.js` 和 `node --check artworks.js`。