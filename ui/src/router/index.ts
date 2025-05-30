import { createRouter, createWebHistory } from 'vue-router';
import Dashboard from '../views/Dashboard.vue';
import TaskListView from '../views/TaskListView.vue';
import TaskAddView from '../views/TaskAddView.vue';
import CalendarView from '../views/CalendarView.vue';

const routes = [
  { path: '/', component: Dashboard },
  { path: '/tasks', component: TaskListView },
  { path: '/tasks/add', component: TaskAddView },
//   { path: '/calendar', component: CalendarView },
];

export default createRouter({
  history: createWebHistory(),
  routes,
});