import { Injectable, NotFoundException } from '@nestjs/common';
import { DataStoreService } from '../database/data-store.service';
import { BlogArticle } from '../database/seed.data';

@Injectable()
export class BlogService {
  constructor(private readonly dataStore: DataStoreService) {}

  findAll(tag?: string): BlogArticle[] {
    return this.dataStore.getArticles(tag);
  }

  findOne(slug: string): BlogArticle {
    const article = this.dataStore.getArticleBySlug(slug);
    if (!article) {
      throw new NotFoundException(`Artículo '${slug}' no encontrado`);
    }
    return article;
  }
}
