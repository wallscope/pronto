<template lang="pug">
  .results
    .ui.grid.container
      .row
        .two.wide.tablet.two.wide.computer.sixteen.wide.mobile.right.column
        .twelve.wide.tablet.twelve.wide.computer.sixteen.wide.mobile.centered.column
          h1 {{ searchResult.meta.label }}
          p {{ searchResult.meta.uri }}
            i.icon.clipboard.outline.link(
              @click="copyToClipboard(searchResult.meta.uri)",
              title="Copy"
            )
            a(
              :href="searchResult.meta.uri", 
              target="_blank"
            )
              i.icon.external.alternate.link(
                title="Open definition in own ontology"
              )
          br 
          table.ui.very.basic.celled.table
            thead
              tr
                th Predicate
                th Object
            tbody
              template(v-for="[k, v] in Object.entries(prettyResult)")
                template(
                  v-if="Array.isArray(v)"
                  v-for="(v2, vIdx) in v"
                )
                  tr
                    td.preds(
                      v-if="vIdx === 0"
                      :rowspan="v.length"
                    )
                      h4.ui.header
                        .content
                          | {{ getPrefixShort(k, invertedPrefixes) }}
                          .sub.header
                            | {{ k }}
                      
                    td.result-cell
                      a(
                        v-html="prettyProp(v2).value",
                        :title="prettyProp(v2).href",
                        :href="prettyProp(v2).href",
                        target="_blank"
                      )

                  
        .two.wide.tablet.two.wide.computer.sixteen.wide.mobile.right.column
          .ui.animated.button(
            tabindex='0'
            @click="goToHomePage()"
          )
            .visible.content Go back
            .hidden.content
              i.left.arrow.icon


</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import ontoM from '@/store';
import { copyToClipboard, getPrefixShort, addMetaData } from '@/utils';
import { OntologyResult } from '@/types';
import axios from 'axios';

@Component({
  methods: {
    copyToClipboard,
    getPrefixShort,
  },
})
export default class ResultDetails extends Vue {
  @Prop() result?: OntologyResult;
  fetchedResult?: OntologyResult = { meta: { label: '' } } as OntologyResult;

  get searchResult() {
    return this.result || this.fetchedResult;
  }
  get prettyResult() {
    if (!this.searchResult) return undefined;
    const { label, comment, ...rest } = this.searchResult;
    return rest;
  }
  get invertedPrefixes() {
    return ontoM.invertedPrefixes;
  }

  /** Extracts the prop from the container object and attaches a prefix */
  prettyProp(prop: any) {
    if (!prop) return;
    let prettyProp;
    if (prop.constructor === Object && !!prop['@id']) {
      prettyProp = prop['@id'];
    } else if (prop.constructor === Object && !!prop['@value'] && !!prop['@language']) {
      prettyProp = `${prop['@value']}@${prop['@language']}`;
    } else if (prop.constructor === Object && !!prop['@value']) {
      prettyProp = prop['@value'];
    } else {
      prettyProp = prop;
    }

    return {
      href: prettyProp,
      value: getPrefixShort(prettyProp, this.invertedPrefixes),
    };
  }
  goToHomePage() {
    const { uri, ...queryStrings } = this.$route.query;
    this.$router.push({ name: 'Home', query: queryStrings });
  }

  async mounted() {
    // If this page is reached directly via its url, it fetches the result from the backend
    if (!this.result) {
      const { data } = await axios.get('/api/result/', {
        params: {
          'search-type': this.$route.query['search-type'],
          uri: this.$route.query.uri,
        },
      });
      this.fetchedResult = addMetaData(data)[0];
    }
  }
}
</script>

<style lang="scss" scoped>
a > i {
  color: #2c3e50 !important;
}
.preds {
  vertical-align: top;
  min-width: 15rem !important;
  max-width: 23rem !important;
  overflow-wrap: anywhere;
}
table.ui {
  margin-bottom: 100px !important;
}
.result-cell {
  padding-left: 0.78571429em !important;
  border-left: 1px solid rgba(34, 36, 38, 0.1) !important;
}
@media only screen and (max-width: 767px) {
  .ui.table:not(.unstackable) td:first-child {
    font-weight: 400;
  }
}
</style>
