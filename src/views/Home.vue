<template lang="pug">
  .home
    .ui.grid.container
      .row
        .twelve.wide.tablet.twelve.wide.computer.sixteen.wide.mobile.centered.column
          .ui.placeholder.segment.fourteen.wide
            .ui.stackable.two.column.center.aligned.grid
              .ui.vertical.divider.hide-mobile OR
              .middle.aligned.row

                .column
                  .ui.icon.header
                    icon.icon(:icon="['fal', 'long-arrow-right']")
                    | Predicates
                  .ui.search
                    .ui.icon.input(:class='{ loading: loadingPred }')
                      input.prompt(
                        type='text',
                        placeholder='Search...',
                        v-model="predSearched"
                        @keyup.enter="sendQuery('predicate')"
                      )
                      i.search.icon.link(@click.prevent="sendQuery('predicate')")

                .column
                  .ui.icon.header
                    icon.icon.cubes(:icon="['fal', 'cubes']")
                    | Types
                  .field
                    .ui.search
                      .ui.icon.input(:class='{ loading: loadingType }')
                        input.prompt(
                          type='text',
                          v-model="classSearched",
                          placeholder='Search...',
                          @keyup.enter="sendQuery('type')"
                        )
                        i.search.icon.link(@click="sendQuery('type')")


      .row
        .center.aligned.column(v-if="results.length")
          h2.ui.horizontal.divider.header.results
            i.bar.chart.icon
            | Results

      .row.centered
        .twelve.wide.left.aligned.column
          .ui.list(
            v-for="r in paginatedResults",
            :key="r.name"
          )
            search-result(
              :searchedTerm="searchedTerm",
              :name="r.name",
              :label="r.label",
              :comment="r.comment",
              :definition="r.definition",
            )

      .row.centered
        paginate(
          v-if="results.length"
          :page-count='slicedResults.length',
          :page-range="3"
          :margin-pages="2"
          :click-handler='paginateClick',
          :prev-text="'Prev'",
          :next-text="'Next'",
          :container-class="'ui pagination menu'",
          :page-class="'item'",
          :prev-class="'item'",
          :next-class="'item'",
        )


</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import axios from 'axios';
import N3, { Parser, Store } from 'n3';
import Toasted from 'vue-toasted';
import Paginate from 'vuejs-paginate';
import { api } from '@/utils';
import SearchResult from '@/components/SearchResult.vue';

Vue.use(Toasted, {
  position: 'top-center',
  theme: 'outline',
  duration: 3000,
});

interface OntologyResult {
  name: string;
  label: string;
  comment: string;
  source: string;
}

@Component({
  components: {
    SearchResult,
    Paginate,
  },
})
export default class Home extends Vue {
  loadingPred = false;
  loadingType = false;
  currPage = 1;
  results: Array<OntologyResult> = [];
  predSearched = '';
  classSearched = '';

  get sortedResults() {
    return [...this.results].sort(({ source }) =>
      source === 'http://www.w3.org/2000/01/rdf-schema#label' ? 1 : 0,
    );
  }
  get slicedResults() {
    const chunkSize = 20;
    const R = [];

    for (let i = 0; i < this.sortedResults.length; i += chunkSize) {
      R.push(this.sortedResults.slice(i, i + chunkSize));
    }
    return R;
  }
  get paginatedResults() {
    return this.slicedResults[this.currPage - 1];
  }
  get searchedTerm() {
    return this.predSearched ? this.predSearched : this.classSearched;
  }

  paginateClick(pageNum: number) {
    this.currPage = pageNum;
  }
  async sendQuery(searchType: 'predicate' | 'type') {
    // Style before searching
    this.loadingPred = true;
    searchType === 'predicate' ? (this.classSearched = '') : (this.predSearched = '');

    const termSearched = searchType === 'predicate' ? this.predSearched : this.classSearched;
    // Get data
    try {
      const { data } = await axios.get(`${api}/${searchType}?search=${termSearched}`);
      if (data) {
        const quads = new Parser().parse(data);
        // Reset store and add quads
        const quadstore = new Store();
        quadstore.addQuads(quads);

        const labels = quadstore.getQuads(
          null,
          'http://www.w3.org/2000/01/rdf-schema#label',
          null,
          null,
        );
        this.results = labels.map(({ subject, object }) => {
          const [comment] = quadstore.getObjects(
            subject.value,
            'http://www.w3.org/2000/01/rdf-schema#comment',
            null,
          );
          const [source] = quadstore.getObjects(
            subject.value,
            'http://purl.org/dc/terms/source',
            null,
          );
          const [definition] =
            searchType === 'type'
              ? quadstore.getObjects(
                  subject.value,
                  'http://www.w3.org/2004/02/skos/core#definition',
                  null,
                )
              : [];
          return {
            name: subject.value,
            label: object.value,
            comment: comment ? comment.value : '',
            definition: definition ? definition.value : '',
            source: source ? source.value : '',
          };
        });
      } else {
        this.$toasted.show('no result');
      }
    } catch (e) {
      this.$toasted.show(e);
      throw e;
    }

    this.loadingPred = false;
    this.currPage = 1;
  }
}
</script>

<style lang="scss" scoped>
@media (max-width: 767px) {
  .hide-mobile {
    display: none !important;
  }
}
.pagination {
  padding: 0;
  margin-top: 1em !important;
}
.results {
  margin-top: 0.2em !important;
}
.subject {
  font-size: 1.1em;
  padding-top: 0.5em !important;
}
.ui.icon.header {
  width: 5em !important;
}
input::placeholder {
  color: rgba(0, 0, 0, 0.466) !important;
  // font-size: 1.2em!important;
}
.cubes {
  margin-bottom: 19px !important;
}
</style>
