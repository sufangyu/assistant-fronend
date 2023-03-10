<template>
  <section class="panel">
    <div class="panel-header" v-if="props.title">
      <h2>{{ props.title }}</h2>
      <div class="panel-extra"><slot name="extra"></slot></div>
    </div>
    <div class="panel-content">
      <slot name="default"></slot>
    </div>
  </section>
</template>

<script lang="ts" setup>
const props = defineProps({
  title: {
    type: String
  }
})
</script>

<style lang="scss">
.panel {
  background-color: var(--panel-bg);
  border-radius: var(--border-radius-middle);
  margin-bottom: 16px;

  &-header {
    padding: 20px 20px 4px;
    display: flex;
    justify-content: space-between;
    // margin-bottom: 8px;

    h2 {
      font-weight: normal;
      font-size: 16px;
    }
  }

  &-content {
    padding: 20px;
  }
}
</style>
