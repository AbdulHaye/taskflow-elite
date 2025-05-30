<template>
  <v-container>
    <h1>Tasks</h1>
    <TaskList />
    <v-form @submit.prevent="addTask">
      <v-text-field v-model="newTask.title" label="Title" />
      <v-text-field v-model="newTask.description" label="Description" />
      <v-date-picker v-model="newTask.dueDate" />
      <v-btn type="submit">Add Task</v-btn>
    </v-form>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from "vue";
import TaskList from "../components/TaskList.vue";
import { TaskManager } from "taskflow-core";

const manager = new TaskManager();
const newTask = ref({ title: "", description: "", dueDate: new Date() });

const addTask = () => {
  manager.addTask(
    newTask.value.title,
    newTask.value.dueDate,
    newTask.value.description
  );
  newTask.value = { title: "", description: "", dueDate: new Date() };
};
</script>
