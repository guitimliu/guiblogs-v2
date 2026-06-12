---
title: 從 Vue 到 React — 心智模型對照表
date: 2025-09-02 09:00:00 +08:00
tags: [React, Vue]
categories: [開發]
description: 寫了多年 Vue 之後學 React，把兩邊的概念對應整理成一張表。
---

接案這幾年都在寫 Vue，最近開始認真學 React，
發現多數概念都能對應，差別在於「框架幫你做」與「你自己寫」。

## 響應式 vs 重新渲染

Vue 的 `ref` 是細粒度追蹤，改了值畫面就更新；
React 則是 `setState` 之後整個元件函式重跑一次。

```vue
<script setup>
const count = ref(0);
</script>
```

```tsx
const [count, setCount] = useState(0);
```

## computed vs useMemo

Vue 的 `computed` 自動追蹤依賴；React 的 `useMemo` 要自己填依賴陣列：

```tsx
const total = useMemo(() => items.reduce((s, i) => s + i.price, 0), [items]);
```

## watch vs useEffect

最容易踩坑的對應。`useEffect` 不是 watch，
它是「同步外部系統」的逃生艙，能不用就不用。

## 小結

React 把控制權還給你，代價是你要自己負責。
寫起來囉嗦一點，但「一切都只是 JavaScript」的一致性確實舒服。
