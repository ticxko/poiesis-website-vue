import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import { setMeta, setProjectJsonLd } from '../utils/seo'
import { trackPageview } from '../utils/analytics'

const routes = [
  { path: '/', name: 'Home', component: Home, meta: { seo: {} } },
  { path: '/about', name: 'About', component: () => import('../views/About.vue'), meta: { seo: { title: 'About', description: 'The studio behind Poiesis — a Jakarta-based architecture and interior practice built on soulful rigor and narrative-driven placemaking. Meet the founders, process and services.' } } },
  { path: '/projects', name: 'Projects', component: () => import('../views/Projects.vue'), meta: { seo: { title: 'Projects', description: 'Selected architecture and interior work by Poiesis Studio — residential, built and conceptual projects across Jakarta and Indonesia.' } } },
  { path: '/project/:id', name: 'ProjectDetail', component: () => import('../views/ProjectDetail.vue') },
  { path: '/contact', name: 'Contact', component: () => import('../views/Contact.vue'), meta: { seo: { title: 'Contact', description: 'Start a conversation with Poiesis Studio about your architecture or interior project. Based in Jakarta; we reply within two working days.' } } },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  }
})

// Keep the document head + analytics in sync with the route. ProjectDetail sets its own
// meta AND fires its own pageview after the project JSON loads (it needs the async
// title/description/image), so we skip it here to avoid a wrong-title flash / pageview.
router.afterEach((to) => {
  if (to.name === 'ProjectDetail') return
  setMeta({ ...(to.meta?.seo || {}), path: to.path })
  setProjectJsonLd(null) // drop any project structured data carried over from a detail page
  trackPageview({ path: to.fullPath })
})

export default router
