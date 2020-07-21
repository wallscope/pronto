<template lang="pug">
  .home
    .ui.grid
      .thirteen.wide.column
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
                              name="predicate"
                              @input="onSearchBoxTyping"
                              :value="search.predicate"
                              @keyup.enter="sendQuery()"
                            )
                            i.search.icon.link(@click.prevent="sendQuery()")

                    .column
                      .ui.icon.header
                        i.icon.cube
                        h2 Types
                      .field.types
                        .ui.search
                          .ui.icon.input(:class='{ loading: loading.type }')
                            input.prompt(
                              type='text',
                              placeholder='Search...',
                              name="type"
                              @input="onSearchBoxTyping"
                              :value="search.type"
                              @keyup.enter="sendQuery()"
                            )
                            i.search.icon.link(@click="sendQuery()")

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
                  :searchedTerm="search.predicate || search.type",
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

      .three.wide.column
        .sidebar
          p Ontology selection
          button.ui.small.compact.basic.circular.button(@click="prefixManager.toggleAllOntologies()") Toggle all
          .ui.celled.selection.list
            .item.onto-item(
              v-for="[uri, name] in Object.entries(invertedPrefixes)"
              @click="selectOntology(uri)"
              :title="uri"
            )
              .ui.checkbox
                input(
                  type="checkbox" 
                  :name="name"
                  :checked="prefixManager.ontologiesSelected[uri]"
                )
                label {{ name }}
            
</template>

<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator';
import axios from 'axios';
import { Parser, Store, Quad_Object } from 'n3';
import Paginate from 'vuejs-paginate';
import ontoM from '@/store';

import { OntologyResult, resultPrefixes } from '@/types';
import SearchResult from './SearchResult.vue';
import Feedback from './Feedback.vue';

class PrefixManager {
  ontologiesSelected = {} as { [uri: string]: boolean };

  get selectedOntologiesStrings() {
    return Object.entries(this.ontologiesSelected)
      .filter(([k, v]) => v)
      .map(([k, v]) => k);
  }

  selectOntology(id: string) {
    this.ontologiesSelected[id] = !this.ontologiesSelected[id];
  }
  toggleAllOntologies() {
    const isAnyUnselected = Object.entries(this.ontologiesSelected).some(([k, v]) => !v);
    Object.entries(this.ontologiesSelected).forEach(
      ([k, v]) => (this.ontologiesSelected[k] = isAnyUnselected),
    );
  }
  updateOntoList(ontologies: { [uri: string]: string }) {
    this.ontologiesSelected = Object.entries(ontologies).reduce((prev, [k, v]) => {
      prev[k] = true;
      return prev;
    }, {} as { [uri: string]: boolean });
  }
}

@Component({
  components: {
    SearchResult,
    Paginate,
    Feedback,
  },
  async beforeCreate() {
    await ontoM.fetchPrefixes();
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
  prefixManager = new PrefixManager();
  results: Array<OntologyResult> = [];

  get invertedPrefixes() {
    return ontoM.invertedPrefixes;
  }
  get filteredResults() {
    return this.results.filter(r =>
      this.prefixManager.selectedOntologiesStrings.includes(r.ontology),
    );
  }
  get slicedResults() {
    const chunkSize = 20;
    const R: OntologyResult[][] = [];

    for (let i = 0; i < this.filteredResults.length; i += chunkSize) {
      R.push(this.filteredResults.slice(i, i + chunkSize));
    }
    return R;
  }
  get paginatedResults() {
    return this.slicedResults[this.currPage - 1];
  }

  onSearchBoxTyping(evt: { target: HTMLInputElement & { name: 'predicate' | 'type' } }) {
    const searchType = evt.target.name;
    if (!(searchType in this.search)) {
      throw Error('Unknown name attribute used in the search box input field');
    }
    // Clear the other input field
    if (searchType === 'predicate') this.search.type = '';
    else this.search.predicate = '';

    this.search[searchType] = evt.target.value;
  }
  paginateClick(pageNum: number) {
    this.currPage = pageNum;
  }
  selectOntology(id: string) {
    this.prefixManager.selectOntology(id);
    if (Object.values(this.search).some(s => s.length)) this.sendQuery();
  }

  async sendQuery() {
    const searchType = this.search.predicate.length ? 'predicate' : 'type';
    // Check for null searches
    if (!this.search[searchType]) {
      this.$toasted.show('type the keyword you want to search');
      return;
    }

    this.loading[searchType] = true;

    // Get data
    try {
      const params = {
        search: this.search[searchType],
        ontologies: this.prefixManager.selectedOntologiesStrings,
      };
      const { data } = await axios.get(`api/${searchType}`, { params });
      if (!data) {
        this.$toasted.show('no result');
        return;
      }

      const getEnglishValue = (array: Array<{ '@value': string; '@language'?: string }>) => {
        if (!Array.isArray(array)) return '';
        return array.find(lObj => {
          // If no language tag is specified, return the first result (should be the only one)
          if (!lObj['@language']) return true;
          // otherwise return the english one
          else if (lObj['@language'] === 'en') return true;
        })?.['@value'];
      };
      this.results = data.map((entity: any) => {
        return {
          ...entity,
          // meta is used for easier manipulation to display
          meta: {
            uri: entity['@id'],
            label: getEnglishValue(entity[resultPrefixes.label]),
            comment: getEnglishValue(entity[resultPrefixes.comment]),
            definition: getEnglishValue(entity[resultPrefixes.definition]),
          },
        };
      });
    } catch (e) {
      if (e?.response?.data)
        this.$toasted.show(`${e.response.statusText}: ${e.response.data}`);
      throw e;
    } finally {
      this.loading[searchType] = false;
      this.currPage = 1;
      if (!this.isFeedbackOpen) this.isFeedbackOpen = true;
    }
  }

  @Watch('invertedPrefixes')
  onPrefixUpdate() {
    this.prefixManager.updateOntoList(this.invertedPrefixes);
  }
}
</script>

<style lang="scss">
.pagination {
  padding: 0;
  margin-top: 1em !important;

  .item {
    padding: 0 !important;

    a {
      padding: 15px !important;
    }
  }
}
</style>

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
#ontologies-menu {
  margin-top: 50px !important;
}
.ontology-toggle {
  margin: auto 0 auto auto !important;
  width: 150px;
  .icon {
    margin: 0 0 0 10px !important;
  }
}
.onto-item {
  text-align: left;

  label {
    cursor: pointer !important;
  }
}
.high-column {
  min-height: 250px;
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
.sidebar {
  position: sticky;
  top: 60px;

  .list {
    max-height: 90vh;
    overflow: auto;
    direction: rtl;
  }
}
</style>
