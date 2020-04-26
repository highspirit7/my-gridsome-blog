// Import main css
import "~/assets/style/index.scss";

// Import default layout so we don't need to import it to every page
import DefaultLayout from "~/layouts/Default.vue";

import Vue from 'vue'
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { faTags } from "@fortawesome/free-solid-svg-icons";

library.add(faGithub, faTags);

Vue.config.productionTip = false;

// The Client API can be used here. Learn more: gridsome.org/docs/client-api
export default function(Vue, { router, head, isClient }) {
  // Set default layout as a global component
  Vue.component("Layout", DefaultLayout);
  Vue.component("font-awesome-icon", FontAwesomeIcon);
}
