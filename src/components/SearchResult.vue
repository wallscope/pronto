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
          @click.stop.prevent="copy(result.name)",
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
import { copyToClipboard } from '@/utils';

@Component({
  components: {
    TextHighlight,
  },
})
export default class SearchResult extends Vue {
  @Prop({ required: true }) readonly searchedTerm!: string;
  @Prop({ required: true }) result!: OntologyResult;

  styleHighlight = {
    'background-color': 'rgba(204, 228, 249, 0.55)',
  };

  async copy(text: string) {
    try {
      await copyToClipboard(text);
      this.$toasted.show('copied to clipboard');
    } catch (_) {
      this.$toasted.show('could not copy (browser might be incompatible)');
    }
  }
  navigateToExternal(url: string) {
    // TODO: Persist results if user navigates away and goes back to the website
    window.open(url, '_blank');
  }
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
  padding: 1em 2em 2em 0.8em;
  margin: -2em -0.2em;
}
</style>
