import { useAuthStore } from "@/stores/auth";
import { createRouter, createWebHistory } from "vue-router";

const HomeView = () => import("@/views/HomeView.vue");
const LoginView = () => import("@/views/LoginView.vue");
const RegisterView = () => import("@/views/RegisterView.vue");
const ProfileView = () => import("@/views/ProfileView.vue");
const SessionsView = () => import("@/views/SessionsView.vue");
const ResetPasswordView = () => import("@/views/ResetPasswordView.vue");
const ForgotPasswordView = () => import("@/views/ForgotPasswordView.vue");
const VerificationView = () => import("@/views/VerificationView.vue");
const AdminView = () => import("@/views/AdminView.vue");

const routes = [
  { path: "/", name: "Home", component: HomeView },
  { path: "/login", name: "Login", component: LoginView },
  { path: "/register", name: "Register", component: RegisterView },
  { path: "/sessions", name: "Sessions", component: SessionsView },
  { path: "/reset-password", name: "ResetPass", component: ResetPasswordView },

  {
    path: "/forgot-password",
    name: "ForgotPass",
    component: ForgotPasswordView,
  },

  { path: "/verification", name: "Verification", component: VerificationView },

  {
    path: "/admin",
    name: "Admin",
    component: AdminView,
    beforeEnter: (to, from, next) => {
      const authStore = useAuthStore();

      if (!authStore.isAuthenticated || !authStore.isAdmin) {
        next("/profile");
      } else {
        next();
      }
    },
  },

  {
    path: "/profile",
    name: "Profile",
    component: ProfileView,
    beforeEnter: (to, from, next) => {
      const token = localStorage.getItem("token");
      if (!token) {
        next("/login");
      } else {
        next();
      }
    },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
