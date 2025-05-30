<template>
  <v-container>
    <h1>Add Task</h1>
    <v-form @submit.prevent="addTask" v-model="valid">
      <v-text-field
        v-model="newTask.title"
        label="Title"
        required
        :rules="[(v) => !!v || 'Title is required']"
      />
      <v-textarea v-model="newTask.description" label="Description" />
      <v-select
        v-model="newTask.priority"
        :items="priorities"
        label="Priority"
      />
      <v-select v-model="newTask.status" :items="statuses" label="Status" />
      <v-select
        v-model="newTask.category"
        :items="categories"
        label="Category"
      />
      <v-combobox
        v-model="newTask.tags"
        :items="availableTags"
        label="Tags"
        multiple
        chips
      />
      <v-menu :close-on-content-click="false">
        <template v-slot:activator="{ props }">
          <v-text-field
            v-model="formattedDueDate"
            label="Due Date"
            v-bind="props"
            readonly
          />
        </template>
        <v-date-picker
          v-model="newTask.dueDate"
          @update:modelValue="updateDueDate"
        />
      </v-menu>
      <v-menu :close-on-content-click="false">
        <template v-slot:activator="{ props }">
          <v-text-field
            v-model="formattedReminderDate"
            label="Reminder Date"
            v-bind="props"
            readonly
          />
        </template>
        <v-date-picker
          v-model="newTask.reminderDate"
          @update:modelValue="updateReminderDate"
        />
      </v-menu>
      <v-btn type="submit" color="primary" :disabled="!valid">Add Task</v-btn>
    </v-form>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { useTaskStore } from "../store/taskStore";
import { useToast } from "vue-toastification";
import { suggestTaskPriority } from "taskflow-core";

const taskStore = useTaskStore();
const router = useRouter();
const toast = useToast();
const valid = ref(false);
const newTask = ref({
  title: "",
  description: "",
  dueDate: new Date(),
  priority: "Medium" as "Low" | "Medium" | "High",
  status: "To Do" as
    | "To Do"
    | "In Progress"
    | "In Testing"
    | "Under Review"
    | "Completed"
    | "Updatation",
  category: "General",
  tags: [] as string[],
  reminderDate: undefined as Date | undefined,
});
const priorities = ["Low", "Medium", "High"];
const statuses = [
  "To Do",
  "In Progress",
  "In Testing",
  "Under Review",
  "Completed",
  "Updatation",
];
const categories = ["General", "Work", "Personal", "Family"];
const availableTags = ["Work", "Personal", "Urgent", "Family"];

const formattedDueDate = computed({
  get() {
    return newTask.value.dueDate.toLocaleDateString();
  },
  set(newValue: string) {
    newTask.value.dueDate = new Date(newValue);
  },
});

const formattedReminderDate = computed({
  get() {
    return newTask.value.reminderDate?.toLocaleDateString() || "";
  },
  set(newValue: string) {
    newTask.value.reminderDate = newValue ? new Date(newValue) : undefined;
  },
});

const updateDueDate = (newDate: Date) => {
  newTask.value.dueDate = newDate;
};

const updateReminderDate = (newDate: Date) => {
  newTask.value.reminderDate = newDate;
};

const addTask = () => {
  if (!newTask.value.title) {
    toast.error("Title is required");
    return;
  }
  const suggestedPriority = suggestTaskPriority({
    ...newTask.value,
    completed: false,
    id: "",
    status: newTask.value.status,
  });
  if (suggestedPriority !== newTask.value.priority) {
    toast.info(
      `AI Suggestion: Set priority to ${suggestedPriority} based on due date and status.`
    );
  }
  taskStore.addTask(
    newTask.value.title,
    newTask.value.dueDate,
    newTask.value.description,
    newTask.value.priority,
    newTask.value.tags,
    newTask.value.status,
    newTask.value.category,
    newTask.value.reminderDate
  );
  toast.success("Task added successfully");
  router.push("/tasks");
};
</script>
