<template>
  <v-app :theme="darkMode ? 'dark' : 'light'">
    <v-app-bar
      app
      color="primary"
      dark
      elevation="4"
      :style="{ width: '100%' }"
    >
      <v-app-bar-nav-icon
        @click="drawer = !drawer"
        class="nav-icon-mobile"
        :class="xs ? 'd-flex' : 'd-none d-sm-flex'"
        :style="{ display: 'flex !important' }"
      >
        <v-icon :color="darkMode ? 'white' : 'white'">mdi-menu</v-icon>
      </v-app-bar-nav-icon>
      <v-toolbar-title class="font-poppins">TaskFlow Elite</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon @click="toggleDarkMode" class="glow-on-hover">
        <v-icon>{{
          darkMode ? "mdi-weather-night" : "mdi-white-balance-sunny"
        }}</v-icon>
      </v-btn>
      <!-- <v-chip class="ml-2" color="success" variant="elevated">
        Points: {{ userStats.points }}
      </v-chip> -->
      <v-chip
        class="ml-2"
        color="warning"
        variant="elevated"
        v-for="badge in userStats.badges"
        :key="badge"
      >
        {{ badge }}
      </v-chip>
    </v-app-bar>

    <v-navigation-drawer v-model="drawer" app color="background" elevation="2">
      <v-list class="font-inter">
        <v-list-item
          v-for="item in navItems"
          :key="item.title"
          :to="item.to"
          :prepend-icon="item.icon"
          :title="item.title"
          :color="item.to === $route.path ? 'primary' : undefined"
          class="nav-item"
        >
          <template v-slot:prepend>
            <v-icon
              :color="item.to === $route.path ? 'primary' : 'grey'"
              class="mr-2"
              >{{ item.icon }}</v-icon
            >
          </template>
          <template v-slot:append>
            <v-icon
              small
              :color="item.to === $route.path ? 'primary' : 'grey'"
              >{{ item.appendIcon }}</v-icon
            >
          </template>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-main>
      <v-container fluid>
        <router-view v-slot="{ Component }">
          <transition name="fade">
            <component :is="Component" />
          </transition>
        </router-view>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { ref, watch, computed, onMounted } from "vue";
import { useRoute } from "vue-router";
import { useUIStore } from "./store";
import { useUserStats } from "./store/userStats";
import { useDisplay } from "vuetify";

const uiStore = useUIStore();
const userStats = useUserStats();
const route = useRoute();
const { xs } = useDisplay();

const drawer = ref(true);
const darkMode = ref(uiStore.darkMode);

const navItems = [
  {
    title: "Dashboard",
    icon: "mdi-view-dashboard",
    to: "/",
    appendIcon: "mdi-chevron-right",
  },
  {
    title: "Tasks",
    icon: "mdi-format-list-bulleted",
    to: "/tasks",
    appendIcon: "mdi-chevron-right",
  },
  {
    title: "Add Task",
    icon: "mdi-plus-circle",
    to: "/tasks/add",
    appendIcon: "mdi-chevron-right",
  },
];

const toggleDarkMode = () => {
  uiStore.toggleDarkMode();
  darkMode.value = uiStore.darkMode;
};

watch(
  () => uiStore.darkMode,
  (newVal) => {
    document.body.classList.toggle("dark", newVal);
  }
);

onMounted(() => {
  console.log("App mounted, xs breakpoint:", xs.value);
});
</script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.font-poppins {
  font-family: "Poppins", sans-serif !important;
  font-weight: 600;
}

.font-inter {
  font-family: "Inter", sans-serif !important;
}

.glow-on-hover:hover {
  box-shadow: 0 0 15px rgba(187, 134, 252, 0.5);
  transform: scale(1.1) rotate(5deg);
  transition: all 0.3s ease;
}

.nav-icon-mobile {
  display: flex !important;
  min-width: 40px;
  padding: 8px;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.nav-icon-mobile:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: scale(1.1);
}

.nav-item {
  border-radius: 8px;
  margin: 4px 8px;
  transition: all 0.3s ease;
}

.nav-item:hover {
  background: linear-gradient(
    90deg,
    rgba(98, 0, 234, 0.1) 0%,
    rgba(187, 134, 252, 0.1) 100%
  );
  transform: translateX(5px);
}

.dark .nav-item:hover {
  background: linear-gradient(
    90deg,
    rgba(187, 134, 252, 0.2) 0%,
    rgba(98, 0, 234, 0.2) 100%
  );
}
</style>
