<template>
  <q-page class="quit-screen">
    <div ref="animation" class="quit-screen__animation" aria-hidden="true" />

    <div class="quit-screen__status">
      <div class="quit-screen__wordmark">Beldex</div>
      <div class="quit-screen__status-line">{{ $t("strings.closing") }}...</div>
    </div>
  </q-page>
</template>

<script>
// The light build has no expression engine, so it never needs eval, which
// the production CSP blocks.
import lottie from "lottie-web/build/player/lottie_light";
import closingAnimation from "assets/animations/beldex-closing.json";

export default {
  mounted() {
    this.player = lottie.loadAnimation({
      container: this.$refs.animation,
      renderer: "svg",
      loop: false,
      autoplay: true,
      animationData: closingAnimation
    });
  },
  beforeDestroy() {
    if (this.player) {
      this.player.destroy();
      this.player = null;
    }
  }
};
</script>

<style lang="scss">
.quit-screen {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  overflow: hidden;
  background-color: var(--beldex-bg);
}

// The animation is drawn on a 480x320 canvas and keeps that size.
.quit-screen__animation {
  flex: none;
  width: 480px;
  height: 320px;
  pointer-events: none;
}

.quit-screen__status {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 24px;
}

.quit-screen__wordmark {
  font-family: var(--beldex-font-display);
  font-size: 28px;
  line-height: 34px;
  letter-spacing: 2.8px;
  color: var(--beldex-text-strong);
  text-transform: uppercase;
  white-space: nowrap;
}

.quit-screen__status-line {
  margin-top: 16px;
  font-family: var(--beldex-font-mono);
  font-size: var(--beldex-text-sm);
  line-height: 16px;
  letter-spacing: 1.65px;
  color: var(--beldex-text-subtle);
  text-transform: uppercase;
  white-space: nowrap;
}
</style>
