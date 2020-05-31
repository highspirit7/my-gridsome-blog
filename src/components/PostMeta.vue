<template>
  <div class="post-meta">Posted {{ post.date }}</div>
</template>

<script>
export default {
  props: ["post"]
};
</script>

<style lang="scss">
.post-meta {
  font-size: 0.8em;
  opacity: 0.8;
  margin-bottom: 1rem;
}
</style>