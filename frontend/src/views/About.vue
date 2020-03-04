<template lang="pug">
  .about
    .ui.grid.container
      .row
        .ten.wide.tablet.ten.wide.computer.sixteen.wide.mobile.centered.column
          p#about-text.
            Pronto is an ontology search engine created to fight against the boring and time-consuming task of
            looking for predicates and classes in ontologies.
            The included ontologies were selected from the prefix.cc user-curated list "popular", along with some others. 
          p.
            Read the #[a(href="https://medium.com/wallscope/pronto-find-predicates-fast-15187f52f516" target="_blank") Wallscope's blog post] for more information.
            If you want to access the source code or want to contribute adding ontologies, head to our
            #[a(href="https://github.com/wallscope/pronto" target="_blank") Github repo].

      .row
        .eight.wide.tablet.six.wide.computer.sixteen.wide.mobile.centered.left.aligned.column
          h2 Included ontologies
          .ui.list
            .item(v-for="[k, v] in Object.entries(prefixes)") 
              span.onto-name {{ k }}: 
              a {{ v }}
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
.onto-name {
  font-weight: 700;
}
</style>
