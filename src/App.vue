<script setup lang="ts">
import HTML2VueRenderer from '../lib/HTML2VueRenderer/HTML2VueRenderer.vue';
</script>


<template>
  <div>
    HTML renderer
    <HTML2VueRenderer :value="'<h1>hello html</h1>'" />
  </div>
</template>
