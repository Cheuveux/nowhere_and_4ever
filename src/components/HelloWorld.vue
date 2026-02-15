<script setup>
  import { ref, onMounted } from 'vue'
  import { supa_config } from '../supa_config.js'

  const articles = ref([])
  const errorMsg = ref('')
  const openIndex = ref(null)
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

  function toggleSynopsis(index) {
    openIndex.value = openIndex.value === index ? null : index
}
</script>

<template>
  <div class="w-full h-full flex flex-col  items-center pt-50">
    <ul class="flex flex-col items-center gap-4 w-full">
      <li
        v-for="(article, index) in articles"
        :key="article.id"
        class="w-[80vw] md:w-[50vw] bg-gray-500 p-4 rounded-lg overflow-hidden cursor-pointer"
        @click="toggleSynopsis(index)"
      >
        <div class="flex justify-between items-center w-full">
          <h2 class="truncate max-w-[50%] text-base text-xs md:text-xl">{{ article.article_name }}</h2>
          <em class="truncate max-w-[40%] text-sm sm:text-base md:text-lg">{{ article.article_author }}</em>
        </div>
        <transition name="fade">
          <p
            v-if="openIndex === index"
            class="mt-2 break-words text-sm sm:text-base md:text-lg"
          >
            {{ article.article_synopsis }}
          </p>
        </transition>
      </li>
    </ul>
  </div>
</template>

<style scoped>
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.2s;
  }

  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
  } 
</style>