<template>
  <div
    ref="animation"
    class="beldex-spinner"
    :style="{ width: sizePx, height: sizePx }"
    role="progressbar"
    aria-busy="true"
  />
</template>

<script>
// The light build has no expression engine, so it never needs eval, which
// the production CSP blocks.
import lottie from "lottie-web/build/player/lottie_light";
import spinnerAnimation from "assets/animations/beldex-toast-spinner.json";

// Drop-in replacement for QSpinner (Loading plugin passes `size` and `color`;
// the colours are baked into the animation, so `color` is ignored).
export default {
  name: "BeldexSpinner",
  props: {
    size: { type: [Number, String], default: 32 },
    color: { type: String, default: "" }
  },
  computed: {
    sizePx() {
      return typeof this.size === "number" || /^\d+$/.test(this.size)
        ? `${this.size}px`
        : this.size;
    }
  },
  mounted() {
    this.player = lottie.loadAnimation({
      container: this.$refs.animation,
      renderer: "svg",
      loop: true,
      autoplay: true,
      animationData: spinnerAnimation
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
.beldex-spinner {
  display: inline-block;
  flex: none;
}
</style>
