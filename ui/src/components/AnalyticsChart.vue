<template>
  <canvas ref="chartCanvas"></canvas>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import {
  getCompletionRate,
  getPriorityBreakdown,
  TaskManager,
} from "taskflow-core";
import Chart from "chart.js/auto";
import { useTaskStore } from "../store/taskStore";

const chartCanvas = ref<HTMLCanvasElement | null>(null);
const taskStore = useTaskStore();

onMounted(() => {
  const tasks = taskStore.tasks;
  const completionRate = getCompletionRate(tasks);
  const priorityBreakdown = getPriorityBreakdown(tasks);

  const ctx = chartCanvas.value?.getContext("2d");
  if (ctx) {
    new Chart(ctx, {
      type: "bar",
      data: {
        labels: [
          "Completion Rate",
          "High Priority",
          "Medium Priority",
          "Low Priority",
        ],
        datasets: [
          {
            label: "Metrics",
            data: [
              completionRate,
              priorityBreakdown.High,
              priorityBreakdown.Medium,
              priorityBreakdown.Low,
            ],
            backgroundColor: [
              "rgba(75, 192, 192, 0.2)",
              "rgba(244, 67, 54, 0.2)",
              "rgba(255, 152, 0, 0.2)",
              "rgba(76, 175, 80, 0.2)",
            ],
            borderColor: [
              "rgba(75, 192, 192, 1)",
              "rgba(244, 67, 54, 1)",
              "rgba(255, 152, 0, 1)",
              "rgba(76, 175, 80, 1)",
            ],
            borderWidth: 1,
          },
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
            max: 100,
          },
        },
      },
    });
  }
});
</script>
