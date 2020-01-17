<<template lang="pug">
  .item
    .content
      a.header.subject(@click="navigateTo(name)")
        text-highlight(
        :queries="searchedTerm",
        :highlightStyle="styleHighlight"
        ) {{ label }}
        i.icon.copy.outline.link(
          @click.stop.prevent="copy(name)",
          title="Copy"
        )
      .label {{ name }}
      text-highlight.description(
        :queries="searchedTerm",
        :highlightStyle="styleHighlight"
      ) {{ comment }}
      .definition {{ definition }}

</template>

<script lang="ts">
import { Vue, Prop, Component } from 'vue-property-decorator';
import TextHighlight from 'vue-text-highlight';
import { copyToClipboard } from '@/utils';

@Component({
  components: {
    TextHighlight,
  },
})
export default class SearchResult extends Vue {
  @Prop({ required: true }) readonly searchedTerm!: string;
  @Prop({ required: true }) name!: string;
  @Prop({ required: true }) label!: string;
  @Prop() comment!: string;
  @Prop() definition!: string;

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
  navigateTo(url: string) {
    // TODO: Persist results if user navigates away and goes back to the website
    window.open(url, '_blank');
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
