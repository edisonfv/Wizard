import { createApp } from "vue"
import { createPinia } from "pinia"
import App from "@/App.vue"
import router from "@/router"

import { IonicVue } from "@ionic/vue"

/* Core CSS required for Ionic components to work properly */
import "@ionic/vue/css/core.css"

/* Basic CSS for apps built with Ionic */
import "@ionic/vue/css/normalize.css"
import "@ionic/vue/css/structure.css"
import "@ionic/vue/css/typography.css"

/* Optional CSS utils that can be commented out */
import "@ionic/vue/css/padding.css"
import "@ionic/vue/css/float-elements.css"
import "@ionic/vue/css/text-alignment.css"
import "@ionic/vue/css/text-transformation.css"
import "@ionic/vue/css/flex-utils.css"
import "@ionic/vue/css/display.css"

/* Archivo de estilos centralizado */
import "@/assets/styles.css"

import { VueQueryPlugin } from "@tanstack/vue-query"
import Toast from 'vue-toastification';
import 'vue-toastification/dist/index.css';

/* Creamos la instancia de Pinia */
const pinia = createPinia()

const app = createApp(App)
  .use(IonicVue)
  .use(router)
  .use(pinia)
  .use(VueQueryPlugin, {
    queryClientConfig: {
      defaultOptions: {
        queries: {
          staleTime: 1000 * 60 * 5, // 5 minutos
        },
      },
    },
  })
  .use(Toast, {
    position: 'top-right',
    timeout: 2000,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    showCloseButtonOnHover: false,
    hideProgressBar: true,
    closeButton: false,
    icon: true,
    rtl: false
  })

router.isReady().then(() => {
  app.mount("#app")
})