import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import { setMeta, setProjectJsonLd } from '../utils/seo'
import { trackPageview } from '../utils/analytics'

const routes = [
  { path: '/', name: 'Home', component: Home, meta: { seo: {} } },
  { path: '/about', name: 'About', component: () => import('../views/About.vue'), meta: { seo: { title: 'About', description: 'The studio behind Poiesis — a Jakarta-based architecture and interior practice built on soulful rigor and narrative-driven placemaking. Meet the founders, process and services.' } } },
  { path: '/projects', name: 'Projects', component: () => import('../views/Projects.vue'), meta: { seo: { title: 'Projects', description: 'Selected architecture and interior work by Poiesis Studio — residential, built and conceptual projects across Jakarta and Indonesia.' } } },
  { path: '/project/:id', name: 'ProjectDetail', component: () => import('../views/ProjectDetail.vue') },
  // The enquiry wizard. `/enquiry` is the shareable primary; `/contact` is kept as an alias so existing
  // header/footer/CTA links (and SEO) keep working — both render the same view.
  { path: '/enquiry', name: 'Enquiry', component: () => import('../views/Enquiry.vue'), meta: { seo: { title: 'Enquiry', description: 'Mulai percakapan dengan Poiesis Studio tentang proyek arsitektur atau interior Anda. Isi formulir singkat; kami membalas dalam dua hari kerja.', image: '/images/projects/bangka-1210/02.jpg' } } },
  { path: '/contact', name: 'Contact', component: () => import('../views/Enquiry.vue'), meta: { seo: { title: 'Enquiry', description: 'Mulai percakapan dengan Poiesis Studio tentang proyek arsitektur atau interior Anda. Isi formulir singkat; kami membalas dalam dua hari kerja.', image: '/images/projects/bangka-1210/02.jpg' } } },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  }
})

// Recover from stale lazy-chunk failures: when a new deploy replaces the hashed route
// chunk that an already-loaded session was pointing at, the dynamic import 404s and the
// navigation silently fails (e.g. clicking "Studio" does nothing). Do a one-shot full
// reload to fetch the fresh index + chunks. A sessionStorage flag prevents a reload loop
// if the failure is something other than a stale chunk.
router.onError((error, to) => {
  const msg = error?.message || ''
  const isChunkError = /dynamically imported module|Importing a module script failed|Loading chunk|error loading dynamically/i.test(msg)
  const target = to?.fullPath
  if (!isChunkError || !target) return
  const key = 'chunk-reload:' + target
  if (!sessionStorage.getItem(key)) {
    sessionStorage.setItem(key, '1')
    window.location.assign(target)
  }
})

// Keep the document head + analytics in sync with the route. ProjectDetail sets its own
// meta AND fires its own pageview after the project JSON loads (it needs the async
// title/description/image), so we skip it here to avoid a wrong-title flash / pageview.
router.afterEach((to) => {
  sessionStorage.removeItem('chunk-reload:' + to.fullPath) // navigation succeeded — reset the guard
  if (to.name === 'ProjectDetail') return
  setMeta({ ...(to.meta?.seo || {}), path: to.path })
  setProjectJsonLd(null) // drop any project structured data carried over from a detail page
  trackPageview({ path: to.fullPath })
})

export default router
