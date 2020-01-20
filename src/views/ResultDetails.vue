<template lang="pug">
  .results
    .ui.grid.container
      .row
        .twelve.wide.tablet.twelve.wide.computer.sixteen.wide.mobile.centered.column
          h1 {{ result.label }}
          p {{ result.name }}
          br 
          table.ui.very.basic.collapsing.celled.table
            thead
              tr
                th Predicate
                th Object
            tbody
              tr(v-for="[k, vArr] in Object.entries(groupedResults)")
                td
                  h4.ui.image.header
                    .content
                      | {{ k.split(/#|\//).pop() }}
                      .sub.header
                        | {{ k }}
                td
                  tr.object-row(v-for="obj in vArr")
                    td 
                      p {{ obj }}

</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
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

  get groupedResults() {
    console.log(this.result);
    return this.result.rest.reduce((prev, curr) => {
      if (!prev[curr.predicate.id]) prev[curr.predicate.id] = [];
      prev[curr.predicate.id] = [...prev[curr.predicate.id], curr.object.id];
      return prev;
    }, {} as { [key: string]: Array<string> });
  }
}
</script>

<style lang="scss" scoped>
table.ui {
  margin-bottom: 100px !important;
}
</style>
