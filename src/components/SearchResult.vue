<<template lang="pug">
  .item
    .content
      a.header.subject(@click="navigateToResult()")
        text-highlight(
        :queries="searchedTerm",
        :highlightStyle="styleHighlight"
        ) {{ result.label }}

      .label {{ result.name }}
        i.icon.copy.outline.link(
          @click.stop.prevent="copyToClipboard(result.name)",
          title="Copy"
        )
        i.icon.external.alternate.link(
          @click.stop.prevent="navigateToExternal(result.name)",
          title="Open definition in own ontology"
        )
      text-highlight.description(
        :queries="searchedTerm",
        :highlightStyle="styleHighlight"
      ) {{ result.comment }}
      .definition {{ result.definition }}

</template>

<script lang="ts">
import { Vue, Prop, Component } from 'vue-property-decorator';
import TextHighlight from 'vue-text-highlight';
import { OntologyResult } from '@/types';
import { copyToClipboard, navigateToExternal } from '@/utils';

@Component({
  components: {
    TextHighlight,
  },
  methods: {
    copyToClipboard,
    navigateToExternal,
  },
})
export default class SearchResult extends Vue {
  @Prop({ required: true }) readonly searchedTerm!: string;
  @Prop({ required: true }) result!: OntologyResult;

  styleHighlight = {
    'background-color': 'rgba(204, 228, 249, 0.55)',
  };

  navigateToResult() {
    // @ts-ignore
    this.$router.push({
      name: 'ResultDetails',
      params: { id: this.result.name, result: this.result },
    });
  }
}
</script>

<style lang="scss" scoped>
.definition {
  font-style: italic;
}
i.copy {
  z-index: 1;
  padding: 1em 1.5em 2em 0.8em;
  margin: -2em -0.2em;
}
</style>
