# 提前退休计算器

[通过网页访问。](https://retirement.wangyufeng.org/)

提前退休计算器用于估算：如果从某个年龄停止工作，当前需要准备多少钱、每月需要存多少钱，资产能否撑到规划截止年龄。

## 计算口径

- 金额按当前购买力填写；未来生活费、退休金和法定退休时想保留的钱会按通胀估算。
- 工作期：生活费由工作收入支付，额外储蓄存入资产。
- 提前退休后：不再计入工作收入，生活费从资产里支出。
- 法定退休后：退休金先支付生活费，不够的部分再从资产里支出。
- 结果是按固定收益率和固定通胀率做的年度估算，不构成投资建议。

## 主要结果

- 提前退休时需要准备的资产。
- 从当前年龄到提前退休前，每月需要储蓄的金额。
- 工作期所需月收入下限。
- 法定退休时和规划截止年龄的预计剩余资产。
- 压力测试和逐年资产曲线。

本工具基于 [Vite](https://vitejs.dev/) 和 React 构建。

## 开发

```bash
git clone https://github.com/wangyufeng0615/early_retirement_calculator.git
cd early_retirement_calculator
npm install
npm start
npm test
npm run build
npm run preview
```

部署到 GitHub Pages：

```bash
npm run deploy
```

## 联系我

任何建议、需求都请随时联系我或者提Issue，谢谢！

## Licence
 
MIT
