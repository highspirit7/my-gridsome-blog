<template>
  <div id="app">
    <header class="header">
      <div class="header__left">
        <Logo />
      </div>

      <div class="header__right">
        <g-link to="/tags" class="tags-icon">
          <font-awesome-icon icon="tags" />
        </g-link>

        <ToggleTheme />
      </div>
    </header>

    <main class="main">
      <slot />
    </main>

    <footer class="footer">
      <div>
        <span class="footer__copyright">Copyright © {{ new Date().getFullYear() }}</span>
        <span class="footer__links">
          Powered by
          <a href="//gridsome.org">Gridsome</a>
        </span>
      </div>
      <font-awesome-icon icon="github" />
    </footer>
  </div>
</template>

<script>
import Logo from "~/components/Logo.vue";
import ToggleTheme from "~/components/ToggleTheme.vue";

export default {
  props: {},
  components: {
    Logo,
    ToggleTheme
  }
};
</script>

<style lang="scss">
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  min-height: var(--header-height);
  padding: 0 calc(var(--space) / 2);
  top: 0;
  z-index: 10;
  /* background-color: var(--bg-color); */
  &__left,
  &__right {
    display: flex;
    align-items: center;
  }

  &__right {
    a {
      color: var(--body-color);
      margin-right: 10px;
    }
  }

  @media screen and (min-width: 1540px) {
    //Make header sticky for large screens
    position: sticky;
    width: 100%;
  }
}

.main {
  margin: 0 auto;
  padding: 1.5vw 15px 0;
  min-height: 80vh;
}

.footer {
  display: flex;
  align-items: center;
  max-width: var(--content-width);
  margin: 0 auto;
  padding: 1rem 0;
  text-align: center;
  font-size: 0.8em;
  border-top: 2px solid var(--border-color);
  > span {
    margin: 0 0.35em;
  }
  .footer__links {
    font-size: 0.8em;
  }
  a {
    color: currentColor;
  }
}
</style>
