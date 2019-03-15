<template lang="pug">
  .home
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
                          v-model="predSearched"
                          @keyup.enter="sendPredicateQuery()"
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
                          v-model="classSearched",
                          placeholder='Search type...',
                          @keyup.enter="sendTypeQuery()"
                        )
                        i.search.icon
                      .results


      .row
        .center.aligned.column
          h2.ui.horizontal.divider.header.results
            i.bar.chart.icon
            | Results

      .row.centered
        .twelve.wide.left.aligned.column
          h2(v-if="topResults.length") Top
          .ui.list(v-for="t in topResults")
            .item
              .content
                a.header.subject(:href="t.name") {{ t.label }} - {{ t.name }} 
                  i.icon.copy.outline.link(
                    @click.stop.prevent="copy(t.name)",
                    title="Copy"
                  )
                .description {{ t.comment }}
                .description {{ t.definition ? `Definition: ${ t.definition }` : '' }}

          h2(v-if="secondaryResults.length") Secondary
          .ui.list(v-for="t in secondaryResults")
            .item
              .content
                a.header.subject(:href="t.name") {{ t.label }} - {{ t.name }}
                  i.icon.copy.outline(
                    @click.stop.prevent="copy(t.name)",
                    title="Copy"
                  )
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
      predSearched: '',
      classSearched: ''
    };
  },
  computed: {
    topResults(){
      return this.results.filter(({ source }) => source === 'http://www.w3.org/2000/01/rdf-schema#label')
    },
    secondaryResults(){
      return this.results.filter(({ source }) => source === 'http://www.w3.org/2000/01/rdf-schema#comment')
    }
  },
  methods: {
    // TODO: add ability to copy and link to
    async copy(text){
      try {
        await navigator.clipboard.writeText(text);
        this.$toasted.show('copied to clipboard');
      } catch (_) {
        this.$toasted.show('could not copy (browser might be incompatible)');
      }
    },
    async sendPredicateQuery() {
      // Style before searching
      this.loadingPred = true;
      this.classSearched = '';

      // Get data
      const { data } = await axios.get(`${api}/predicate?search=${this.predSearched}`);
      if (data) {
        const quads = N3.Parser().parse(data);
        // Reset store and add quads
        this.quadstore = N3.Store();
        this.quadstore.addQuads(quads);

        const labels = this.quadstore.getQuads(null, 'http://www.w3.org/2000/01/rdf-schema#label', null);
        this.results = labels.map(({ subject, object }) => {
          const [comment] = this.quadstore
            .getObjects(subject.value, 'http://www.w3.org/2000/01/rdf-schema#comment');
          const [source] = this.quadstore
            .getObjects(subject.value, 'http://purl.org/dc/terms/source')

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
      this.loadingPred = false;
    },
    async sendTypeQuery() {
      // Style before searching
      this.loadingType = true;
      this.predSearched = '';

      // Get data
      const { data } = await axios.get(`${api}/type?search=${this.classSearched}`);
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
          const [source] = this.quadstore
            .getObjects(subject.value, 'http://purl.org/dc/terms/source');

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
i.copy {
  // padding: 0.5em 1.2em 1.1em 0.5em;
  // margin: 0;
  // width: 2em;
  // height: 1.8em;
  // border: 1px solid black !important;    

  z-index: 1;     
  padding: 1em 2em 2em 0.8em;     
  margin: -2em -0.2em; 
}
// .header.subject {
//   margin: 0!important; 
//   border: 0!important; 
//   padding: 0!important;
  
// }
</style>
