# html2vue-renderer

Deadly simple Vue 3 component takes html string as input and returns Vue components tree. HTML string can include Vue components with some restrictions

## Install:

```
npm install html2vue-renderer

# OR

yarn add html2vue-renderer
```

## Usage:

```
<script setup lang="ts">
import { HTML2Vue } from 'html2vue-renderer';
</script>

<template>
  <div>
    HTML renderer
    <HTML2Vue :value="'<h1>hello html</h1>'" />
  </div>
</template>
```

## Props:

`value` - HTML string

```
  <HTML2Vue :value="value" />
```

`componentsMap` - `Record<string, Component>` Object represents components allowed to render in HTML string

```
<HTML2Vue :value="'<div><some-component>Some text</some-coomponent></div>'" :componentsMap="{
  'SomeComponent': SomeComponent
}" />
```

## Recommended IDE Setup

- [VS Code](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur) + [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin).

## Type Support For `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin) to make the TypeScript language service aware of `.vue` types.

If the standalone TypeScript plugin doesn't feel fast enough to you, Volar has also implemented a [Take Over Mode](https://github.com/johnsoncodehk/volar/discussions/471#discussioncomment-1361669) that is more performant. You can enable it by the following steps:

1. Disable the built-in TypeScript Extension
   1. Run `Extensions: Show Built-in Extensions` from VSCode's command palette
   2. Find `TypeScript and JavaScript Language Features`, right click and select `Disable (Workspace)`
2. Reload the VSCode window by running `Developer: Reload Window` from the command palette.

