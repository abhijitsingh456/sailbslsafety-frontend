import { createRouter, createWebHistory } from 'vue-router'
import CreateView from '../views/CreateView.vue'
import SearchView from '../views/SearchView.vue'

const routes = [
  { path: '/',                   redirect: '/inspection/search' },
  { path: '/inspection',         redirect: '/inspection/search' },
  { path: '/inspection/create',  name: 'inspection-create', component: CreateView },
  { path: '/inspection/search',  name: 'inspection-search', component: SearchView },

  // Back-compat: old URLs anyone may have bookmarked / linked to.
  { path: '/create',             redirect: '/inspection/create' },
  { path: '/search',             redirect: '/inspection/search' },
]

export default createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior: () => ({ top: 0 }),
})
