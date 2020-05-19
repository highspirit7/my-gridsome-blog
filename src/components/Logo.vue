<template>
  <g-link class="left-header" to="/">
    <g-image
      alt="logo-image"
      class="left-header__logo-image"
      src="~/assets/images/petit_prince_avec_une_rose.png"
      width="56"
      height="56"
    />
  
      <span class="left-header__site-owner">{{$static.metadata.siteOwner}}</span>
  
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
  display: flex;
  align-items: flex-end;
  &__logo-image {
    // vertical-align: middle;
    margin-right: 0.5em;
  }

  &__site-owner {
    // vertical-align: bottom;
    font-size: 1.25rem;
  }
}
</style>
