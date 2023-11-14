<script lang="ts">
import type { Ref } from "vue"
import type { ComponentsMap } from './Renderer'

interface Props {
  value: string,
  docProps?: any,
  componentsMap?: ComponentsMap
}
</script>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import Renderer from './Renderer'

const props = withDefaults(defineProps<Props>(), {
  value: '',
  docProps: () => ({}),
  componentsMap: () => ({})
})

const renderer = ref(new Renderer({
  value: props.value,
  componentsMap: props.componentsMap
}))


const vNodes: Ref = ref([])

onMounted(() => {
  vNodes.value = renderer.value.render(props.docProps)
})

watch(() => props.value, () => {
  renderer.value = new Renderer({
    value: props.value,
    componentsMap: props.componentsMap
  })
  vNodes.value = renderer.value.render(props.docProps)
})
</script>

<template>
  <div class="html-renderer-wrapper">
    <template v-for="node in vNodes">
      <component :is="node" />
    </template>
  </div>
</template>
