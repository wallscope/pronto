<<template lang="pug">
  .item
    .content
      a.header.subject(@click="navigateToResult()")
        text-highlight(
        :queries="searchedTerm",
        :highlightStyle="styleHighlight"
        ) {{ result.label }}

      .label {{ result.uri }}
        i.icon.clipboard.outline.link(
          @click.stop.prevent="copyToClipboard(result.uri)",
          title="Copy"
        )
        a(
          :href="result.uri", 
          target="_blank"
        )
          i.icon.external.alternate.link(
            title="Open definition in ontology"
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
  methods: {
    copyToClipboard,
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
      params: { id: this.result.uri, result: this.result },
    });
  }
}
</script>

<style lang="scss" scoped>
a > i {
  color: #2c3e50 !important;
}
.definition {
  font-style: italic;
}
i.copy {
  z-index: 1;
  padding: 1em 1.5em 2em 0.8em;
  margin: -2em -0.2em;
}
</style>
