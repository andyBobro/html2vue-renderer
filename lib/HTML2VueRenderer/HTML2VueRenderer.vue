<script setup lang="ts">
import { ref, onMounted, watch, type Component, type Ref } from 'vue'
import Renderer from './Renderer'
import { VueLoader } from './loaders/index'

interface Props {
  value: string,
  docProps?: any,
  componentsMap?: Record<string, Component>
}

const props = withDefaults(defineProps<Props>(), {
  value: '',
  docProps: () => ({}),
  componentsMap: () => ({})
})

const renderer = ref(loadRenderer(props.value))


const vNodes: Ref = ref([])

onMounted(() => {
  vNodes.value = renderer.value.render()
})

watch(() => props.value, (val) => {
  renderer.value = loadRenderer(val)
  vNodes.value = renderer.value.render()
})

watch(() => props.docProps, (val) => {
  renderer.value = loadRenderer(val)
  vNodes.value = renderer.value.render()
})

function loadRenderer(value: string) {
  return new Renderer({
    value: value,
    loader: new VueLoader({
      components: props.componentsMap,
      props: props.docProps
    })
  })
}
</script>

<template>
  <div class="html-renderer-wrapper">
    <template v-for="node in vNodes">
      <component :is="node" />
    </template>
  </div>
</template>
