<template>
  <Layout>
    <div class="container mx-auto pb-16">
      <h2 class="text-4xl font-bold mb-8 border-b">
        Tags
      </h2>
        <div>
          <g-link
            :to="tag.node.path"
            v-for="tag in $page.tags.edges"
            :key="tag.node.id"
            class="inline-block mr-2 mb-2 px-4 py-2 text-base rounded-full bg-gray-300 hover:bg-gray-400"
          >
            {{ tag.node.title }}
          </g-link>
        </div>
    </div>
  </Layout>
</template>

<page-query>
query Tags {
  tags: allTag (sortBy: "date", order: DESC) @paginate {
    totalCount
    pageInfo {
      totalPages
      currentPage
    }
    edges {
      node {
        id
        title
        path
      }
    }
  }
}
</page-query>

<script>
export default {
  metaInfo: {
    title: 'Tags'
  }
}
</script>
