<template>
  <v-container>
    <h1>Dashboard</h1>
    <v-row>
      <v-col cols="12" md="6">
        <v-card class="pa-4 glass-card">
          <v-card-title>Task Completion</v-card-title>
          <v-progress-circular
            :model-value="completionRate"
            size="120"
            color="primary"
            class="mb-4"
          >
            {{ completionRate }}%
          </v-progress-circular>
          <AnalyticsChart />
        </v-card>
      </v-col>
      <v-col cols="12" md="6">
        <v-card class="pa-4 glass-card">
          <v-card-title>Quick Stats</v-card-title>
          <v-row>
            <v-col>Total Tasks: {{ totalTasks }}</v-col>
            <v-col>Completed: {{ completedTasks }}</v-col>
            <v-col>Overdue: {{ overdueTasks }}</v-col>
          </v-row>
          <v-divider class="my-2"></v-divider>
          <v-card-subtitle>Status Breakdown</v-card-subtitle>
          <v-row>
            <v-col v-for="(count, status) in statusBreakdown" :key="status">
              {{ status }}: {{ count }}
            </v-col>
          </v-row>
        </v-card>
      </v-col>
      <v-col cols="12" md="6">
        <!-- <v-card class="pa-4 glass-card">
          <v-card-title>Upcoming Tasks</v-card-title>
          <v-list>
            <v-list-item v-for="task in upcomingTasks" :key="task.id">
              <v-list-item-title>{{ task.title }}</v-list-item-title>
              <v-list-item-subtitle
                >{{ task.dueDate.toLocaleDateString() }} |
                {{ task.status }}</v-list-item-subtitle
              >
            </v-list-item>
          </v-list>
        </v-card> -->
      </v-col>
      <!-- <v-col cols="12" md="6">
        <v-card class="pa-4 glass-card">
          <v-card-title>Recent Activity</v-card-title>
          <v-list>
            <v-list-item
              v-for="activity in recentActivities"
              :key="activity.id"
            >
              <v-list-item-title>{{ activity.message }}</v-list-item-title>
              <v-list-item-subtitle>{{
                activity.timestamp.toLocaleString()
              }}</v-list-item-subtitle>
            </v-list-item>
          </v-list>
        </v-card>
      </v-col> -->
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import AnalyticsChart from "../components/AnalyticsChart.vue";
import { useTaskStore } from "../store/taskStore";
import { getCompletionRate, getStatusBreakdown } from "taskflow-core";

const taskStore = useTaskStore();

const completionRate = computed(() => getCompletionRate(taskStore.tasks));
const totalTasks = computed(() => taskStore.tasks.length);
const completedTasks = computed(
  () => taskStore.tasks.filter((t) => t.status === "Completed").length
);
const overdueTasks = computed(() => taskStore.overdueTasks.length);
const statusBreakdown = computed(() => getStatusBreakdown(taskStore.tasks));
const upcomingTasks = computed(() =>
  taskStore.tasks
    .filter((t) => t.status !== "Completed" && t.dueDate > new Date())
    .sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime())
    .slice(0, 5)
);

const recentActivities = ref<
  { id: string; message: string; timestamp: Date }[]
>([]);

watch(
  () => taskStore.tasks,
  (newTasks, oldTasks) => {
    if (!oldTasks) return;
    const changes = newTasks.filter((task, index) => {
      const oldTask = oldTasks.find((t) => t.id === task.id);
      return oldTask && JSON.stringify(task) !== JSON.stringify(oldTask);
    });
    changes.forEach((task) => {
      if (task.status !== oldTasks.find((t) => t.id === task.id)?.status) {
        recentActivities.value.unshift({
          id: crypto.randomUUID(),
          message: `Task "${task.title}" marked as ${task.status}`,
          timestamp: new Date(),
        });
      }
    });
    if (recentActivities.value.length > 5) {
      recentActivities.value = recentActivities.value.slice(0, 5);
    }
  },
  { deep: true }
);
</script>
