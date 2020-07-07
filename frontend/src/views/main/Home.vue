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
                    i.icon.long.arrow.alternate.right 
                    h2 Predicates
                  .field
                    .ui.search
                      .ui.icon.input(:class='{ loading: loading.predicate }')
                        input.prompt(
                          type='text',
                          placeholder='Search...',
                          v-model="search['predicate']"
                          @keyup.enter="sendQuery('predicate')"
                        )
                        i.search.icon.link(@click.prevent="sendQuery('predicate')")

                .column
                  .ui.icon.header
                    i.icon.cube
                    h2 Types
                  .field.types
                    .ui.search
                      .ui.icon.input(:class='{ loading: loading.type }')
                        input.prompt(
                          type='text',
                          v-model="search['type']",
                          placeholder='Search...',
                          @keyup.enter="sendQuery('type')"
                        )
                        i.search.icon.link(@click="sendQuery('type')")

      feedback(
        :isFeedbackOpen="isFeedbackOpen",
        @close-feedback="isFeedbackOpen = false"
      )
      .row
        .center.aligned.column(v-if="results.length")
          h2.ui.horizontal.divider.header.results
            i.bar.chart.icon
            | Results

      .row.centered.high-column
        .twelve.wide.left.aligned.column
          .ui.list(
            v-for="r in paginatedResults",
            :key="r.uri"
          )
            search-result(
              :searchedTerm="search['predicate'] || search['type']",
              :result="r"
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
import { Vue, Component } from 'vue-property-decorator';
import axios from 'axios';
import { Parser, Store, Quad_Object } from 'n3';
import Paginate from 'vuejs-paginate';
import { OntologyResult, resultPrefixes } from '@/types';
import SearchResult from './SearchResult.vue';
import Feedback from './Feedback.vue';

@Component({
  components: {
    SearchResult,
    Paginate,
    Feedback,
  },
})
export default class Home extends Vue {
  // Style vars
  loading = {
    predicate: false,
    type: false,
  };
  currPage = 1;
  isFeedbackOpen = false;

  search = {
    predicate: '',
    type: '',
  };
  results: Array<OntologyResult> = [];

  get slicedResults() {
    const chunkSize = 20;
    const R: OntologyResult[][] = [];

    for (let i = 0; i < this.results.length; i += chunkSize) {
      R.push(this.results.slice(i, i + chunkSize));
    }
    return R;
  }
  get paginatedResults() {
    return this.slicedResults[this.currPage - 1];
  }

  paginateClick(pageNum: number) {
    this.currPage = pageNum;
  }
  async sendQuery(searchType: 'predicate' | 'type') {
    // Check for null searches
    if (!this.search[searchType]) {
      this.$toasted.show('type the keyword you want to search');
      return;
    }

    this.loading[searchType] = true;
    // Clear the other input field
    if (searchType === 'predicate') this.search['type'] = '';
    else this.search['predicate'] = '';

    // Get data
    try {
      const { data } = await axios.get(`api/${searchType}?search=${this.search[searchType]}`);
      if (!data) {
        this.$toasted.show('no result');
        return;
      }

      this.results = data.map((entity: any) => {
        const label = entity[resultPrefixes.label]?.find(
          (lObj: { '@value': string; '@language'?: string }) => {
            // If no language tag is specified, return the first result (should be the only one)
            if (!lObj['@language']) return true;
            // otherwise return the english one
            else if (lObj['@language'] === 'en') return true;
          },
        )?.['@value'];

        return {
          ...entity,
          // meta is used for easier manipulation to display
          meta: {
            uri: entity['@id'],
            label,
            comment: entity[resultPrefixes.comment]?.[0]
              ? entity[resultPrefixes.comment][0]['@value']
              : '',
            definition: entity[resultPrefixes.definition]?.[0]
              ? entity[resultPrefixes.definition][0]['@value']
              : '',
          },
        };
      });
    } catch (e) {
      this.$toasted.show(`${e.response.statusText}: ${e.response.data}`);
      throw e;
    } finally {
      this.loading[searchType] = false;
      this.currPage = 1;
      if (!this.isFeedbackOpen) this.isFeedbackOpen = true;
    }
  }
}
</script>

<style lang="scss" scoped>
@media (max-width: 767px) {
  .hide-mobile {
    display: none !important;
  }
}
@media (min-width: 768px) {
  .field {
    margin-top: 10px;
  }
}
.high-column {
  min-height: 250px;
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
  font-size: 2em !important;
}
input::placeholder {
  color: rgba(0, 0, 0, 0.466) !important;
}
.cubes {
  margin-bottom: 19px !important;
}
.feedback {
  margin-top: 5px;
}
</style>
