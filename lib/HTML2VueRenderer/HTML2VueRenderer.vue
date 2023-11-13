<script lang="ts">
import type { Ref } from "vue"
import type { ComponentsMap } from './Renderer'

interface DocProps {
  string?: any
}

interface Props {
  value: string,
  docProps: any,
  componentsMap: ComponentsMap
}
</script>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import Renderer from './Renderer'

const props = withDefaults(defineProps<Props>(), {
  value: '',
  docProps: () => ({} as DocProps),
  componentsMap: () => ({} as ComponentsMap)
})

const renderer = new Renderer({
  value: props.value,
  componentsMap: props.componentsMap 
})

const vNodes: Ref = ref([])

onMounted(() => {
  vNodes.value = renderer.render(props.docProps)
})
</script>

<template>
  <div class="html-renderer-wrapper">
    <template v-for="(node, n) in vNodes" :key="n">
      <component :is="node" />
    </template>
  </div>
</template>
