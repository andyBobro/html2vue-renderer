<script setup lang="ts">
import { shallowRef, onMounted, watch, type Component, type Ref, markRaw } from 'vue'
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

const components = Object.entries(props.componentsMap).reduce((acc, [key, val]) => ({
  ...acc,
  [key]: markRaw(val)
}), {})

const renderer = shallowRef(loadRenderer(props.value))

const vNodes: Ref = shallowRef([])

const rendererWrapper = shallowRef(null)

const emit = defineEmits(['mounted'])

onMounted(() => {
  vNodes.value = renderer.value.render()
  emit('mounted', rendererWrapper.value)
})

watch(() => props.value, (val) => {
  renderer.value = loadRenderer(val)
  vNodes.value = renderer.value.render()
})

function loadRenderer(value: string) {
  return new Renderer({
    value: value,
    loader: new VueLoader({
      components: components,
      props: props.docProps
    })
  })
}
</script>

<template>
  <div class="html-renderer-wrapper" ref="rendererWrapper">
    <template v-for="node in vNodes">
      <component :is="node" />
    </template>
  </div>
</template>
