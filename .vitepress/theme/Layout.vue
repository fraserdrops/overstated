<script setup lang="ts">
import { useData } from 'vitepress'
import Home from './Home.vue'
import Article from './Article.vue'
import NotFound from './NotFound.vue'

const { page, frontmatter } = useData()
</script>

<template>
  <div class="antialiased">
    <div
      v-if="!frontmatter.index"
      class="max-w-3xl mx-auto px-4 sm:px-6 xl:max-w-5xl xl:px-0"
    >
      <nav class="flex justify-between items-center py-10 font-bold">
        <a class="text-xl" href="/" aria-label="Overstated">
          <img
            class="inline-block mr-2"
            style="width: 36px; height: 31px"
            alt="logo"
            src="/logo.svg"
          />
          <span class="hidden md:inline dark:text-white">Overstated</span>
        </a>
      </nav>
    </div>
    <main class="max-w-3xl mx-auto px-4 sm:px-6 xl:max-w-1xl xl:px-0">
      <div v-if="frontmatter.index" class="flex items-center mt-10 -ml-5">
        <img
          class="inline-block mr-2"
          style="width: 60px; height: 60px"
          alt="logo"
          src="/logo.svg"
        />
        <h1
          class="text-3xl leading-9 font-bold text-gray-900 dark:text-white tracking-tight sm:text-4xl sm:leading-10 md:text-5xl md:leading-14"
        >
          Overstated
        </h1>
      </div>

      <Content
        v-if="frontmatter.index"
        class="prose dark:prose-invert max-w-none pb-8"
      />
      <NotFound v-else-if="page.isNotFound" />
      <Article v-else />
    </main>
  </div>
</template>
