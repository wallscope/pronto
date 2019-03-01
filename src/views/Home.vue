<template lang="pug">
  .ui.grid.container
    .row
      .ten.wide.tablet.twelve.wide.computer.sixteen.wide.mobile.centered.column
        h2.ui.centered.header Ontology Searcher
        .ui.placeholder.segment
          .ui.stackable.two.column.center.aligned.grid
            .ui.vertical.divider Or
            .middle.aligned.row
              .column
                .ui.icon.header
                  i.search.icon
                  | Find Predicate
                .field
                  .ui.search
                    .ui.icon.input(:class='{ loading: loadingPred }')
                      input.prompt(
                        type='text',
                        placeholder='Search predicate...',
                        @keyup.enter="sendPredicateQuery($event.target.value)"
                      )
                      i.search.icon
                    .results
              .column
                .ui.icon.header
                  i.search.icon
                  | Find Type
                .field
                  .ui.search
                    .ui.icon.input(:class='{ loading: loadingType }')
                      input.prompt(
                        type='text',
                        placeholder='Search type...',
                        @keyup.enter="sendTypeQuery($event.target.value)"
                      )
                      i.search.icon
                    .results


    .row
      .center.aligned.column
        h2.ui.horizontal.divider.header.results
          i.bar.chart.icon
          | Results

    .row.centered
      //- .ui.center.aligned.two.column.grid
      //-   .column results
        //- .two.wide.column
      .twelve.wide.left.aligned.column
        .ui.list(v-for="t in results")
          .item
            .content
              a.header.subject(:href="t.name") {{ t.label }} - {{ t.name }}
              .description {{ t.comment }}
              .description {{ t.definition ? `Definition: ${ t.definition }` : '' }}


</template>

<script>
import Vue from 'vue';
import axios from 'axios';
import N3 from 'n3';
import Toasted from 'vue-toasted';
import { api } from '@/utils';

Vue.use(Toasted, {
  position: 'top-center',
  theme: 'outline',
  duration: 3000,
});

export default {
  name: 'home',
  components: {},
  data() {
    return {
      loadingPred: false,
      loadingType: false,
      quadstore: null,
      results: [],
    };
  },
  computed: {},
  methods: {
    // TODO: compress in a single function
    // TODO: add ability to copy
    // TODO: for the PREDICATE searcher, do not show CLASSES
    async sendPredicateQuery(searchValue) {
      this.loadingPred = true;
      const { data } = await axios.get(`${api}/predicate?search=${searchValue}`);
      if (data) {
        const quads = N3.Parser().parse(data);
        // Reset store and add quads
        this.quadstore = N3.Store();
        this.quadstore.addQuads(quads);

        const labels = this.quadstore.getQuads(null, 'http://www.w3.org/2000/01/rdf-schema#label', null);
        this.results = labels.map(({ subject, object }) => {
          const [comment] = this.quadstore
            .getObjects(subject.value, 'http://www.w3.org/2000/01/rdf-schema#comment');

          return {
            name: subject.value,
            label: object.value,
            comment: comment ? comment.value : '',
          };
        });
      } else {
        this.$toasted.show('No result');
      }
      this.loadingPred = false;
    },
    async sendTypeQuery(searchValue) {
      this.loadingType = true;
      const { data } = await axios.get(`${api}/type?search=${searchValue}`);
      if (data) {
        const quads = N3.Parser().parse(data);
        // Reset store and add quads
        this.quadstore = N3.Store();
        this.quadstore.addQuads(quads);

        const labels = this.quadstore.getQuads(null, 'http://www.w3.org/2000/01/rdf-schema#label', null);
        this.results = labels.map(({ subject, object }) => {
          const [comment] = this.quadstore
            .getObjects(subject.value, 'http://www.w3.org/2000/01/rdf-schema#comment');
          const [definition] = this.quadstore
            .getObjects(subject.value, 'http://www.w3.org/2004/02/skos/core#definition');

          return {
            name: subject.value,
            label: object.value,
            comment: comment ? comment.value : '',
            definition: definition ? definition.value : '',
          };
        });
      } else {
        this.$toasted.show('No result');
      }
      this.loadingType = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.results {
  margin-top: 0.2em!important;
}
.subject {
   font-size: 1.1em;
   padding-top: 0.5em!important;
}
</style>
