<template>
  <div class="flex mt-4 text-xs">
    <g-link
      class="bg-gray-300 rounded-full px-4 py-2 mr-3 hover:bg-gray-400"
      v-for="tag in post.tags"
      :key="tag.id"
      :to="tag.path"
    >
      <span>#</span>
      {{ tag.title }}
    </g-link>
  </div>
</template>

<script>
export default {
  props: ["post"]
};
</script>

<style lang="scss">

</style>