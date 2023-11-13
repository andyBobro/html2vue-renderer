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

`componentsMap` - Record<string, Component> Object represents components allowed to render in HTML string
```
<HTML2Vue :value="'<div><some-component>Some text</some-coomponent></div>'" :componentsMap="{
  'SomeComponent': SomeComponent
}" />
```
