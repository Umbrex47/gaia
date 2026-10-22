<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { BookOpen, Calendar, Clock, ArrowRight, User as UserIcon, X } from 'lucide-vue-next';
import { api } from '../../services/api';
import type { BlogArticle } from '../../types';

const articles = ref<BlogArticle[]>([]);
const selectedArticle = ref<BlogArticle | null>(null);

onMounted(async () => {
  try {
    articles.value = await api.getArticles();
  } catch (e) {
    console.warn('Cargando artículos locales');
  }
});

function openArticle(article: BlogArticle) {
  selectedArticle.value = article;
}

function closeArticle() {
  selectedArticle.value = null;
}
</script>

<template>
  <section id="blog" class="section blog-section">
    <div class="container">
      <div class="section-title-wrap">
        <div class="badge-tag">
          <BookOpen :size="14" /> Actualizaciones & Casos de Éxito
        </div>
        <h2 class="section-title">Innovaciones Agronómicas & Logros GaIA</h2>
        <p class="section-subtitle">
          Descubre cómo nuestros agentes de IA y la robótica de campo están transformando los rendimientos en fincas reales.
        </p>
      </div>

      <!-- Articles Grid -->
      <div class="grid-3 blog-grid">
        <article 
          v-for="article in articles" 
          :key="article.id" 
          class="gaia-card article-card"
          @click="openArticle(article)"
        >
          <div class="article-img-wrap">
            <img :src="article.image" :alt="article.title" class="article-img" />
            <span class="article-cat-badge">{{ article.category }}</span>
          </div>

          <div class="article-body">
            <div class="article-meta-row">
              <span class="meta-item"><Calendar :size="13" /> {{ article.date }}</span>
              <span class="meta-item"><Clock :size="13" /> {{ article.readTime }}</span>
            </div>

            <h3 class="article-title">{{ article.title }}</h3>
            <p class="article-summary">{{ article.summary }}</p>

            <div class="article-footer-row">
              <div class="author-info">
                <img :src="article.author.avatar" :alt="article.author.name" class="author-avatar" />
                <span class="author-name">{{ article.author.name.split(' ')[0] }}</span>
              </div>
              <div class="card-arrow-btn">
                <ArrowRight :size="14" />
              </div>
            </div>
          </div>
        </article>
      </div>

      <!-- Article Reader Modal -->
      <Transition name="fade">
        <div v-if="selectedArticle" class="modal-backdrop" @click.self="closeArticle">
          <div class="modal-dialog article-reader-dialog">
            <button class="modal-close-btn" @click="closeArticle" aria-label="Cerrar artículo">
              <X :size="20" />
            </button>

            <div class="reader-header">
              <span class="reader-category">{{ selectedArticle.category.toUpperCase() }}</span>
              <h2 class="reader-title">{{ selectedArticle.title }}</h2>
              
              <div class="reader-author-row">
                <img :src="selectedArticle.author.avatar" :alt="selectedArticle.author.name" class="reader-author-img" />
                <div>
                  <p class="reader-author-name">{{ selectedArticle.author.name }}</p>
                  <p class="reader-author-role">{{ selectedArticle.author.role }}</p>
                </div>
                <div class="reader-date-wrap">
                  <span>{{ selectedArticle.date }} • {{ selectedArticle.readTime }} de lectura</span>
                </div>
              </div>
            </div>

            <img :src="selectedArticle.image" :alt="selectedArticle.title" class="reader-cover-img" />

            <div class="reader-body-content" style="white-space: pre-line;">
              {{ selectedArticle.content }}
            </div>

            <div class="reader-tags-footer">
              <span v-for="tag in selectedArticle.tags" :key="tag" class="reader-tag">
                #{{ tag }}
              </span>
            </div>
          </div>
        </div>
      </Transition>
    </div>
  </section>
</template>

<style scoped>
.blog-section {
  position: relative;
}

.article-card {
  padding: 0;
  display: flex;
  flex-direction: column;
  cursor: pointer;
  background: var(--color-liquid-kelp);
  border: none;
  border-radius: var(--radius-card);
  overflow: hidden;
  box-shadow: none;
  transition: transform var(--transition-fast), background var(--transition-fast);
}

.article-card:hover {
  transform: translateY(-2px);
}

.article-img-wrap {
  position: relative;
  height: 200px;
  overflow: hidden;
  background: var(--color-liquid-deep);
}

.article-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s ease;
}

.article-card:hover .article-img {
  transform: scale(1.04);
}

.article-cat-badge {
  position: absolute;
  top: 14px;
  left: 14px;
  background: var(--color-liquid-deep);
  border: 1px solid rgba(255, 255, 255, 0.08);
  color: var(--color-liquid-mist);
  font-family: var(--font-matter);
  font-size: 10px;
  font-weight: 500;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  padding: 4px 8px;
  border-radius: var(--radius-button);
}

.article-body {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  flex: 1;
}

.article-meta-row {
  display: flex;
  align-items: center;
  gap: 1rem;
  font-family: var(--font-matter);
  font-size: 12px;
  color: var(--color-silver-mist);
  margin-bottom: 0.75rem;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 0.35rem;
}

.article-title {
  font-family: var(--font-matter);
  font-size: 18px;
  font-weight: 500;
  margin-bottom: 0.6rem;
  line-height: 1.3;
  letter-spacing: -0.01em;
  color: var(--color-platinum);
}

.article-summary {
  font-family: var(--font-matter);
  font-size: 14px;
  color: var(--color-silver-mist);
  line-height: 1.4;
  margin-bottom: 1.5rem;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  flex: 1;
}

.article-footer-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
  padding-top: 1rem;
}

.author-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.author-avatar {
  width: 28px;
  height: 28px;
  border-radius: var(--radius-button);
  object-fit: cover;
}

.author-name {
  font-family: var(--font-matter);
  font-size: 13px;
  font-weight: 500;
  color: var(--color-platinum);
}

.card-arrow-btn {
  width: 32px;
  height: 32px;
  border-radius: var(--radius-button);
  background: var(--color-liquid-deep);
  border: 1px solid rgba(255, 255, 255, 0.06);
  color: var(--color-platinum);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--transition-fast);
}

.article-card:hover .card-arrow-btn {
  background: var(--color-aurora-gradient);
  color: #012624;
  border-color: transparent;
  transform: translateX(2px);
}

/* Modal Reader */
.article-reader-dialog {
  background: var(--color-liquid-deep);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: var(--radius-card);
  width: 820px;
  max-width: 95vw;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  padding: 2.5rem;
  box-shadow: none;
}

.modal-close-btn {
  position: absolute;
  top: 1.5rem;
  right: 1.5rem;
  background: var(--color-liquid-kelp);
  border: 1px solid rgba(255, 255, 255, 0.08);
  color: var(--color-silver-mist);
  width: 32px;
  height: 32px;
  border-radius: var(--radius-button);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all var(--transition-fast);
}

.modal-close-btn:hover {
  color: var(--color-platinum);
  border-color: rgba(255, 255, 255, 0.2);
}

.reader-header {
  margin-bottom: 1.75rem;
}

.reader-category {
  font-family: var(--font-matter);
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--color-liquid-mist);
}

.reader-title {
  font-family: var(--font-matter);
  font-size: 28px;
  font-weight: 500;
  color: var(--color-platinum);
  letter-spacing: -0.02em;
  margin: 0.5rem 0 1.25rem 0;
  line-height: 1.2;
}

.reader-author-row {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.reader-author-img {
  width: 40px;
  height: 40px;
  border-radius: var(--radius-button);
  object-fit: cover;
}

.reader-author-name {
  font-family: var(--font-matter);
  font-weight: 500;
  color: var(--color-platinum);
  font-size: 14px;
  margin: 0;
}

.reader-author-role {
  font-family: var(--font-matter);
  font-size: 12px;
  color: var(--color-silver-mist);
  margin: 0;
}

.reader-date-wrap {
  margin-left: auto;
  font-family: var(--font-matter);
  font-size: 12px;
  color: var(--color-silver-mist);
}

.reader-cover-img {
  width: 100%;
  height: 320px;
  object-fit: cover;
  border-radius: var(--radius-button);
  margin-bottom: 2rem;
}

.reader-body-content {
  font-family: var(--font-matter);
  font-size: 16px;
  color: var(--color-silver-mist);
  line-height: 1.6;
  margin-bottom: 2rem;
}

.reader-tags-footer {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
  padding-top: 1.25rem;
}

.reader-tag {
  font-family: var(--font-matter);
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.08em;
  color: var(--color-liquid-mist);
  background: var(--color-liquid-kelp);
  padding: 4px 10px;
  border-radius: var(--radius-button);
}
</style>
