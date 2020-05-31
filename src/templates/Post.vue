<template>
  <Layout>
    <div class="container mx-auto my-16">
      <h1 class="text-3xl font-bold leading-tight mb-0">{{ $page.post.title }}</h1>

      <PostMeta :post="$page.post" />

      <div class="markdown-body bg-white p-12" v-html="$page.post.content" />

      <div class="post__footer">
        <PostTags :post="$page.post" />
      </div>

      <div class="post-comments">
        <!-- Add comment widgets here -->
      </div>
    </div>
  </Layout>
</template>

<script>
import PostMeta from "~/components/PostMeta";
import PostTags from "~/components/PostTags";

export default {
  components: {
    PostMeta,
    PostTags
  },
  metaInfo() {
    return {
      title: this.$page.post.title,
      meta: [
        {
          name: "description",
          content: this.$page.post.description
        }
      ]
    };
  }
};
</script>

<page-query>
query Post ($path: String!) {
  post: post (path: $path) {
    title
    path
    date (format: "D. MMMM YYYY")
    timeToRead
    tags {
      id
      title
      path
    }
    description
    content
    cover_image (width: 860, blur: 10)
  }
}
</page-query>

<style src="/Users/cacheby/Code/personal/my-gridsome-blog/src/assets/style/github-markdown.css" />
