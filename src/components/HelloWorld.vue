<script setup>
import { ref, onMounted } from 'vue'
import { supa_config } from '../supa_config.js'

const articles = ref([])
const errorMsg = ref('')

onMounted(async () => {
  const { data, error } = await supa_config
    .from('main_article')
    .select('*')
  if (error) {
    errorMsg.value = error.message
  } else {
    articles.value = data
  }
})
</script>

<template>
  <div class="w-full max-w-screen-sm mx-auto p-4">
    <h1 class="title_content text-3xl font-bold text-center mb-6">Proposals</h1>
    <div v-if="errorMsg" style="color:red;">Erreur : {{ errorMsg }}</div>
    <ul class="flex flex-col items-center gap-4 w-xl">
      <li
        v-for="article in articles"
        :key="article.id"
        class="w-full bg-gray-800 p-4 rounded-lg"
      >
        <div class="flex justify-between items-center w-full">
          <strong>{{ article.article_name }}</strong>
          <em>{{ article.article_author }}</em>
        </div>
        <p class="mt-2 hidden">{{ article.article_synopsis }}</p>
      </li>
    </ul>
  </div>
</template>