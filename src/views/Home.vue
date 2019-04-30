<template lang="pug">
  .home
    .ui.grid.container
      .row
        .twelve.wide.tablet.twelve.wide.computer.sixteen.wide.mobile.centered.column
          h1.ui.centered.header
            | PR
            span.blue O
            | NTO
          .ui.placeholder.segment.fourteen.wide
            .ui.stackable.two.column.center.aligned.grid
              .ui.vertical.divider.hide-mobile OR
              .middle.aligned.row
                .column
                  .ui.icon.header
                    i.search.icon
                    | Find Predicate
                  //- .field
                  .ui.search
                    .ui.icon.input(:class='{ loading: loadingPred }')
                      input.prompt(
                        type='text',
                        placeholder='Search predicate...',
                        v-model="predSearched"
                        @keyup.enter="sendPredicateQuery()"
                      )
                      i.search.icon
                    //- .results
                .column
                  .ui.icon.header
                    i.search.icon
                    | Find Type
                  .field
                    .ui.search
                      .ui.icon.input(:class='{ loading: loadingType }')
                        input.prompt(
                          type='text',
                          v-model="classSearched",
                          placeholder='Search type...',
                          @keyup.enter="sendTypeQuery()"
                        )
                        i.search.icon
                      //- .results


      .row
        .center.aligned.column
          h2.ui.horizontal.divider.header.results
            i.bar.chart.icon
            | Results

      .row.centered
        .twelve.wide.left.aligned.column
          .ui.list(
            v-for="r in sortedResults",
            :key="r.name"
          )
            search-result(
              :searchedTerm="searchedTerm",
              :name="r.name",
              :label="r.label",
              :comment="r.comment",
              :definition="r.definition",
            )

</template>

<script>
import Vue from 'vue';
import axios from 'axios';
import N3 from 'n3';
import Toasted from 'vue-toasted';
import { api } from '@/utils';
import SearchResult from '@/components/SearchResult.vue';

Vue.use(Toasted, {
  position: 'top-center',
  theme: 'outline',
  duration: 3000,
});

export default {
  name: 'home',
  components: {
    SearchResult,
  },
  data() {
    return {
      loadingPred: false,
      loadingType: false,
      quadstore: null,
      results: [],
      predSearched: '',
      classSearched: '',
    };
  },
  computed: {
    sortedResults() {
      return [...this.results].sort(({ source }) => (source === 'http://www.w3.org/2000/01/rdf-schema#label' ? 1 : 0));
    },
    searchedTerm() {
      return this.predSearched ? this.predSearched : this.classSearched;
    },
  },
  methods: {
    async sendPredicateQuery() {
      // Style before searching
      this.loadingPred = true;
      this.classSearched = '';

      // Get data
      try {
        const { data } = await axios.get(
          `${api}/predicate?search=${this.predSearched}`,
        );
        if (data) {
          const quads = N3.Parser().parse(data);
          // Reset store and add quads
          this.quadstore = N3.Store();
          this.quadstore.addQuads(quads);

          const labels = this.quadstore.getQuads(
            null,
            'http://www.w3.org/2000/01/rdf-schema#label',
            null,
          );
          this.results = labels.map(({ subject, object }) => {
            const [comment] = this.quadstore.getObjects(
              subject.value,
              'http://www.w3.org/2000/01/rdf-schema#comment',
            );
            const [source] = this.quadstore.getObjects(
              subject.value,
              'http://purl.org/dc/terms/source',
            );

            return {
              name: subject.value,
              label: object.value,
              comment: comment ? comment.value : '',
              source: source.value,
            };
          });
        } else {
          this.$toasted.show('no result');
        }
      } catch (e) {
        this.$toasted.show(e);
      }

      this.loadingPred = false;
    },
    async sendTypeQuery() {
      // Style before searching
      this.loadingType = true;
      this.predSearched = '';

      // Get data
      try {
        const { data } = await axios.get(
          `${api}/type?search=${this.classSearched}`,
        );
        if (data) {
          const quads = N3.Parser().parse(data);
          // Reset store and add quads
          this.quadstore = N3.Store();
          this.quadstore.addQuads(quads);

          const labels = this.quadstore.getQuads(
            null,
            'http://www.w3.org/2000/01/rdf-schema#label',
            null,
          );
          this.results = labels.map(({ subject, object }) => {
            const [comment] = this.quadstore.getObjects(
              subject.value,
              'http://www.w3.org/2000/01/rdf-schema#comment',
            );
            const [definition] = this.quadstore.getObjects(
              subject.value,
              'http://www.w3.org/2004/02/skos/core#definition',
            );
            const [source] = this.quadstore.getObjects(
              subject.value,
              'http://purl.org/dc/terms/source',
            );

            return {
              name: subject.value,
              label: object.value,
              comment: comment ? comment.value : '',
              definition: definition ? definition.value : '',
              source: source.value,
            };
          });
        } else {
          this.$toasted.show('no result');
        }
      } catch (e) {
        this.$toasted.show(e);
      }

      this.loadingType = false;
    },
  },
};
</script>

<style lang="scss" scoped>
@media (max-width: 767px) {
  .hide-mobile {
    display: none!important;
  }
}
.results {
  margin-top: 0.2em !important;
}
.subject {
  font-size: 1.1em;
  padding-top: 0.5em !important;
}
.blue {
  color: #4183c4;
}
// show-mobile
</style>
