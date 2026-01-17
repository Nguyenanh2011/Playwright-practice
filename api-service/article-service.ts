import { ENDPOINTS } from '../constants/endpoints';
import { Article } from '../data-object/article';
import { apiControllerService } from './api-controller';

export class ArticleService {
    async createArticle(article: Article, headers?: Record<string, string>) {
        return apiControllerService.post(ENDPOINTS.ARTICLE, { article: article }, { headers });
    }

    async deleteArticle(articleId: string, headers?: Record<string, string>) {
        return apiControllerService.delete(`${ENDPOINTS.ARTICLE}/${articleId}`, { headers });
    }
}
// mỗi file phục vụ cho service như tạo , xóa 