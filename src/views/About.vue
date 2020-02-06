<template lang="pug">
  .about
    .ui.grid.container
      .row
        .ten.wide.tablet.ten.wide.computer.sixteen.wide.mobile.centered.column
          p#about-text.
            Pronto was created by Wallscope to fight against the boring and time-consuming task of
            searching for predicates and classes in ontologies. Read our
            #[a(href="https://medium.com/wallscope/pronto-find-predicates-fast-15187f52f516" target="_blank") Wallscope's blog post] for more information.

      .row
        .eight.wide.tablet.six.wide.computer.sixteen.wide.mobile.centered.left.aligned.column
          h2 List of the included ontologies
          .ui.list
            a.item(v-for="p in Object.values(prefixes)") 
              | {{ p }}
</template>
<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { prefixes } from '@/utils';

@Component
export default class About extends Vue {
  prefixes = prefixes;
}
</script>

<style lang="scss" scoped>
#about-text {
  margin-top: 1.5em;
}
</style>
