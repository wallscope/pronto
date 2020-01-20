<template lang="pug">
  .results
    .ui.grid.container
      .row
        .twelve.wide.tablet.twelve.wide.computer.sixteen.wide.mobile.centered.column
          table.ui.very.basic.collapsing.celled.table
            thead
              tr
                th Employee
                th Correct Guesses
            tbody
              tr
                td
                  h4.ui.image.header
                    img.ui.mini.rounded.image(src='/images/avatar2/small/lena.png')
                    .content
                      | Lena
                      .sub.header
                        | Human Resources
                td
                  | 22

          p {{ result.name }}
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
}
</script>
