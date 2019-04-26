<<template lang="pug">
  .item
    .content
      a.header.subject(@click="navigateTo(name)") {{ label }}
        i.icon.copy.outline.link(
          @click.stop.prevent="copy(name)",
          title="Copy"
        )
      .label {{ name }}
      .description {{ comment }}
      .description {{ definition ? `Definition: ${ definition }` : '' }}

</template>

<script>
import { copyToClipboard } from '@/utils';

export default {
  name: 'SearchResult',
  props: {
    name: {
      type: String,
      required: true,
    },
    label: {
      type: String,
      required: true,
    },
    comment: {
      type: String,
    },
    definition: {
      type: String,
    },
  },
  methods: {
    async copy(text) {
      try {
        await copyToClipboard(text);
        this.$toasted.show('copied to clipboard');
      } catch (_) {
        this.$toasted.show('could not copy (browser might be incompatible)');
      }
    },
    navigateTo(url) {
      // TODO: Persist results if user navigates away and goes back to the website
      window.location.href = url;
    }
  },
};
</script>

<style lang="scss" scoped>
i.copy {
  z-index: 1;
  padding: 1em 2em 2em 0.8em;
  margin: -2em -0.2em;
}
</style>
