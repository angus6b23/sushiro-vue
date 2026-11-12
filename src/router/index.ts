import { createRouter, createWebHistory } from "@ionic/vue-router";
import type { RouteRecordRaw } from "vue-router";

import TabsPage from "@/views/TabsPage.vue";

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    redirect: "/tabs/shop-list",
  },
  {
    path: "/tabs/",
    component: TabsPage,
    children: [
      {
        path: "",
        redirect: "/tabs/shop-list",
      },
      {
        path: "shop-list",
        component: () => import("@/views/ShopList.vue"),
      },
      {
        path: "map",
        component: () => import("@/views/Map.vue"),
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
