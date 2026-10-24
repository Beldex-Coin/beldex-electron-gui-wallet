/* Maps the Quasar-builtin "content_copy" material icon name to the project's
   custom copy icon (SVG path), without touching any component that uses
   icon="content_copy" / icon-right="content_copy" / <q-icon name="content_copy">.
   See: https://v1.quasar.dev/vue-components/icon#icon-mapping */
const CONTENT_COPY_ICON =
  "M1.615 0C0.722712 0 0 0.722712 0 1.615V12.92H1.615V1.615H12.92V0H1.615ZM4.845 3.23C3.95271 3.23 3.23 3.95271 3.23 4.845V14.535C3.23 15.4273 3.95271 16.15 4.845 16.15H14.535C15.4273 16.15 16.15 15.4273 16.15 14.535V4.845C16.15 3.95271 15.4273 3.23 14.535 3.23H4.845ZM4.845 4.845H14.535V14.535H4.845V4.845Z|0 0 17 17";

export default ({ Vue }) => {
  Vue.prototype.$q.iconMapFn = iconName => {
    if (iconName === "content_copy") {
      return { icon: CONTENT_COPY_ICON };
    }
  };
};
