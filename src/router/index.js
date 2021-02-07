import Vue from "vue";
import VueRouter from "vue-router";

const Login = () => import(/* webpackChunkName: "Login" */ "../components/login/Login.vue");
const Home = () => import(/* webpackChunkName: "Home" */ "../components/Home.vue");

Vue.use(VueRouter);

const routes = [
  {path: "/", redirect: "/login"},
  {
    path: "/login",
    name: "login",
    component: Login
  },
  {
    path: "/home",
    name: "home",
    component: Home
  }
];

const router = new VueRouter({
  routes
});

router.beforeEach((to, from, next) => {
  if (to.path === "/login") return next();
  const tokenStr = window.sessionStorage.getItem("token");
  if (!tokenStr) return next("/login");
  next();
});

export default router;
