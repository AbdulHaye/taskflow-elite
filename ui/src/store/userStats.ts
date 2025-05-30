import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useUserStats = defineStore('userStats', () => {
  const points = ref(0);
  const badges = ref<string[]>([]);

  const addPoints = (amount: number) => {
    points.value += amount;
  };

  const addBadge = (badge: string) => {
    if (!badges.value.includes(badge)) {
      badges.value.push(badge);
    }
  };

  return { points, badges, addPoints, addBadge };
});