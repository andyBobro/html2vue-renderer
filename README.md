# html2vue-renderer

Component is an alternative for v-html directive allows to include components to html markup. It can be useful for rendering fetched html content and to add it some interactivity.

#### It has some restrictions:

- you have to always close component's tag
- attributes and props names have to be in `kebab-case`
- events on component are not working yet

## Requirements:

- [Vue.js](https://github.com/vuejs/vue) `3.x`

## Install:

```bash
npm install html2vue-renderer

# OR

yarn add html2vue-renderer
```

## Simple usage:

```javascript
<script setup lang="ts">
import { ref } from 'vue'
import { HTML2Vue } from 'html2vue-renderer'

const html = ref('<h1>hello html</h1>')
</script>

<template>
  <HTML2Vue :value="html" />
</template>
```

## Usage with vue components and props for them:

In `<SomeComponent>` `:some-prop` will take any data from `docProps['someValue']` and `some-other-prop` will take string `'some-other-value'`

```javascript
<script setup lang="ts">
import { ref } from 'vue'
import { HTML2Vue } from 'html2vue-renderer'
import SomeComponent from './SomeComponent'

const html = `
  <h1>Heading</h1>
  <SomeComponent :some-prop="someValue" some-other-prop="some-other-value">
    Veeery long text
  </SomeComponent>
`

const docProps = {
  someValue: 'Some Value'
}
</script>

<template>
  <HTML2Vue :value="html" :componentsMap={ SomeComponent } :docProps="docProps" />
</template>
```

## Props

#### value

Type: `string`<br>
Required: `true`<br>

HTML string can contain vue components defined in `componentsMap` prop

#### componentsMap

Type: `Record<string, Component>`<br>
Required: `false`<br>
Default: `{}`<br>

Object represents components can be included into HTML markup. Key in this object have to be same with name of component's tag included into markup.

#### docProps

Type: `Record<string, any>`<br>
Required: `false`<br>
Default: `{}`<br>

Object represents data to be passed to components in the markup. Keys in this object have to be same with the idetifier in the markup.

example:

```javascript
<script setup lang="ts">
import { ref } from 'vue'
import { HTML2Vue } from 'html2vue-renderer'
import SomeComponent from './SomeComponent'

const html = `
  <h1>Heading</h1>
  {/* identifier `someValue` passed to <SomeComponent> in `some-prop` prop is the same with key in `docProps`  */}
  <SomeComponent :some-prop="someValue">
    Veeery long text
  </SomeComponent>
`

const docProps = {
  // key `someValue` is the same with identifier passed to <SomeComponent>
  someValue: 'Some Value'
}
</script>

<template>
  <HTML2Vue :value="html" :componentsMap={ SomeComponent } :docProps="docProps" />
</template>
```

