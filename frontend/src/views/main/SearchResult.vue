<<template lang="pug">
  .item
    .content
      router-link.header.subject(:to="{  \
        name: 'ResultDetails',  \
        params: { id: result.meta.uri, result }, \
      }")
        text-highlight(
        :queries="searchedTerm",
        :highlightStyle="styleHighlight"
        ) {{ result.meta.label }}

      .label {{ result.meta.uri }}
        i.icon.clipboard.outline.link(
          @click.stop.prevent="copyToClipboard(result.meta.uri)",
          title="Copy"
        )
        a(
          :href="result.meta.uri", 
          target="_blank"
        )
          i.icon.external.alternate.link(
            title="Open definition in ontology"
          )
      text-highlight.description(
        :queries="searchedTerm",
        :highlightStyle="styleHighlight"
      ) {{ result.meta.comment }}
      .definition {{ result.meta.definition }}

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
