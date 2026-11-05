/* Maps the Quasar-builtin "content_copy" / "file_copy" material icon names to
   the project's single copy glyph (the "Copy icon", same path as
   assets/icons/receive-copy.svg), without touching any component that uses
   icon="content_copy" / icon-right="content_copy" / <q-icon name="content_copy">.
   See: https://v1.quasar.dev/vue-components/icon#icon-mapping */
const COPY_ICON =
  "M4.66667 0.582031V2.91536H1.75V12.832H9.91667V10.4987H12.8333V3.6696L9.74577 0.582031H4.66667ZM5.25 1.16536H9.33333V4.08203H12.25V9.91537H5.25V1.16536ZM9.91667 1.5778L11.8376 3.4987H9.91667V1.5778ZM2.33333 3.4987H4.66667V10.4987H9.33333V12.2487H2.33333V3.4987Z|0 0 14 14";

export default ({ Vue }) => {
  Vue.prototype.$q.iconMapFn = iconName => {
    if (iconName === "content_copy" || iconName === "file_copy") {
      return { icon: COPY_ICON };
    }
  };
};
