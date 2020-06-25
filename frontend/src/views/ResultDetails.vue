<template lang="pug">
  .results
    .ui.grid.container
      .row
        .two.wide.tablet.two.wide.computer.sixteen.wide.mobile.right.column
        .twelve.wide.tablet.twelve.wide.computer.sixteen.wide.mobile.centered.column
          h1 {{ result.meta.label }}
          p {{ result.meta.uri }}
            i.icon.clipboard.outline.link(
              @click.stop.prevent="copyToClipboard(result.uri)",
              title="Copy"
            )
            a(
              :href="result.uri", 
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
                          | {{ prefix(k) }}
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
            @click="$router.go(-1)"
          )
            .visible.content Go back
            .hidden.content
              i.left.arrow.icon


</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { prefixes, copyToClipboard } from '@/utils';
import { OntologyResult } from '@/types';

@Component({
  beforeRouteEnter(to, from, next) {
    next(vm => {
      // @ts-ignore
      if (!vm.result) {
        vm.$router.go(-1);
      }
    });
  },
})
export default class ResultDetails extends Vue {
  @Prop({ required: true }) result!: OntologyResult;

  // swap uri with prefixes
  prefixes = Object.entries(prefixes).reduce((acc, entry) => {
    const [key, value] = entry;
    acc[value] = key;
    return acc;
  }, {} as { [root: string]: string });

  /** TODO: temporary getter below. Remove once fusejs dot in key problem is solved */
  get prettyResult() {
    const { label, comment, ...rest } = this.result;
    return rest;
  }

  copyToClipboard = copyToClipboard;
  prefix(s: string) {
    try {
      const re = s.match(/(\/|#)(?:.(?!\/|#))+$/);
      if (!re) return s;
      const [root, prop] = [s.slice(0, re['index']! + 1), s.slice(re['index']! + 1)];
      if (!this.prefixes[root]) return s;
      return `${this.prefixes[root]}:${prop}`;
    } catch {
      return s;
    }
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
      value: this.prefix(prettyProp),
    };
  }
}
</script>

<style lang="scss" scoped>
a > i {
  color: #2c3e50 !important;
}
.preds {
  vertical-align: top;
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
