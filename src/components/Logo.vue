<template>
  <g-link class="left-header" to="/">
    <g-image
      alt="logo-image"
      class="logo-image"
      src="~/assets/images/petit_prince_avec_une_rose.png"
      width="56"
      height="56"
    />
    <span class="blog-title">
      {{ $static.metadata.siteName }}
      <span class="pen-name">by {{$static.metadata.siteOwner}}</span>
    </span>
  </g-link>
</template>

<static-query>
query {
  metadata {
    siteName
    siteOwner
  }
}
</static-query>

<style lang="scss">
.left-header {
  text-decoration: none;
  color: var(--body-color) !important;
  .logo-image {
    vertical-align: middle;
    margin-right: 0.5em;
  }

  .blog-title {
    vertical-align: bottom;

    font-size: 1.25rem;
    .pen-name {
      font-size: 0.8rem;
    }
  }
}
</style>
