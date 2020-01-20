<template lang="pug">
  .results
    .ui.grid.container
      .row
        .twelve.wide.tablet.twelve.wide.computer.sixteen.wide.mobile.centered.column
          p {{ result.name }}
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { OntologyResult } from '@/types';

@Component
export default class Results extends Vue {
  @Prop({ required: true }) result!: OntologyResult;
}
</script>
