import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useUIStore = defineStore('ui', () => {
  const darkMode = ref(false);
  const toggleDarkMode = () => {
    darkMode.value = !darkMode.value;
  };
  return { darkMode, toggleDarkMode };
});