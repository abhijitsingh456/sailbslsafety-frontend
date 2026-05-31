import { createRouter, createWebHistory } from 'vue-router'
import CreateView from '../views/CreateView.vue'
import SearchView from '../views/SearchView.vue'

const routes = [
  { path: '/', redirect: '/search' },
  { path: '/create', name: 'create', component: CreateView },
  { path: '/search', name: 'search', component: SearchView },
]

export default createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior: () => ({ top: 0 }),
})
