<template lang="pug">
  .row(v-if="isFeedbackOpen && showFeedback()")
    .sixteen.wide.tablet.sixteen.wide.computer.sixteen.wide.mobile.centered.column
      .ui.info.message
        i.close.icon(@click="closeFeedback()")
        .header
          | Do you like Pronto?

        .ui.form.feedback
          .field
            label Give us some feedback so we can improve it!
            textarea(
              rows='2', 
              placeholder='Type your feedback...'
            )
          button.ui.button Send

</template>

<script lang="ts">
import { Vue, Prop, Component } from 'vue-property-decorator';
import TextHighlight from 'vue-text-highlight';
import { OntologyResult } from '@/types';

@Component
export default class Feedback extends Vue {
  @Prop({ default: false }) isFeedbackOpen!: boolean;

  showFeedback() {
    console.log('running');
    debugger;
    const lastDismissed = localStorage.getItem('feedbackLastDismissed');
    if (!lastDismissed) return true;

    // If dismissed more than three days ago return true
    const timeDifference = +new Date() - +new Date(lastDismissed);
    if (timeDifference > 3 * 24 * 3600 * 1000) return true;

    this.$emit('close-feedback');
    return false;
  }
  closeFeedback() {
    localStorage.setItem('feedbackLastDismissed', new Date().toString());
    // localStorage.setItem('wasFeedbackDismissed', 'true');
    this.$emit('close-feedback');
  }
}
</script>

<style lang="scss" scoped></style>
