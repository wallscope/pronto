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
                    icon.icon.cubes(:icon="['fal', 'cubes']")
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


      .row
        .center.aligned.column(v-if="results.length")
          h2.ui.horizontal.divider.header.results
            i.bar.chart.icon
            | Results

      .row.centered.high-column
        .twelve.wide.left.aligned.column
          .ui.list(
            v-for="r in paginatedResults",
            :key="r.name"
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
import { Parser, Store } from 'n3';
import Paginate from 'vuejs-paginate';
import { OntologyResult } from '@/types';
import SearchResult from '@/components/SearchResult.vue';

@Component({
  components: {
    SearchResult,
    Paginate,
  },
})
export default class Home extends Vue {
  // Style vars
  loading = {
    predicate: false,
    type: false,
  };
  currPage = 1;

  search = {
    predicate: '',
    type: '',
  };
  results: Array<OntologyResult> = [];
  parser = new Parser();
  quadstore = new Store();

  get sortedResults() {
    return [...this.results].sort(({ source }) =>
      source === 'http://www.w3.org/2000/01/rdf-schema#label' ? 1 : 0,
    );
  }
  get slicedResults() {
    const chunkSize = 20;
    const R: OntologyResult[][] = [];

    for (let i = 0; i < this.sortedResults.length; i += chunkSize) {
      R.push(this.sortedResults.slice(i, i + chunkSize));
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
      const { data } = await axios.get(
        `${process.env.VUE_APP_SERVER_ADDRESS}/${searchType}?search=${this.search[searchType]}`,
      );
      if (!data) {
        this.$toasted.show('no result');
        return;
      }
      const quads = this.parser.parse(data);
      // Reset store and add quads
      this.quadstore.deleteGraph('');
      this.quadstore.addQuads(quads);

      const labels = this.quadstore.getQuads(
        null,
        'http://www.w3.org/2000/01/rdf-schema#label',
        null,
        null,
      );
      this.results = labels.map(({ subject, object }) => {
        const [comment] = this.quadstore.getObjects(
          subject.value,
          'http://www.w3.org/2000/01/rdf-schema#comment',
          null,
        );
        const [source] = this.quadstore.getObjects(
          subject.value,
          'http://purl.org/dc/terms/source',
          null,
        );
        const [definition] = this.quadstore.getObjects(
          subject.value,
          'http://www.w3.org/2004/02/skos/core#definition',
          null,
        );
        const rest = this.quadstore.getQuads(subject.value, null, null, null);

        return {
          name: subject.value,
          label: object.value,
          comment: comment ? comment.value : '',
          definition: definition ? definition.value : '',
          source: source ? source.value : '',
          rest,
        };
      });
    } catch (e) {
      this.$toasted.show(e);
      throw e;
    } finally {
      this.loading[searchType] = false;
      this.currPage = 1;
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
    margin-top: 20px;
  }
  .field.types {
    margin-bottom: -18px;
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
  width: 7em !important;
}
input::placeholder {
  color: rgba(0, 0, 0, 0.466) !important;
  // font-size: 1.2em!important;
}
.cubes {
  margin-bottom: 19px !important;
}
</style>
