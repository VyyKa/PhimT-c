// PhimAPI service wrapper

export interface PhimApiListParams {
  page?: number;
  sort_field?: '_id' | 'year' | 'modified.time';
  sort_type?: 'asc' | 'desc';
  sort_lang?: 'vietsub' | 'thuyet-minh' | 'long-tieng';
  category?: string; // slug from /the-loai
  country?: string; // slug from /quoc-gia
  year?: number; // 1970 - now
  limit?: number; // max 64
}

export interface PhimApiSearchParams extends PhimApiListParams {
  keyword: string;
}

export interface PhimApiMovieItem {
  _id: string;
  name: string;
  slug: string;
  origin_name?: string;
  year?: number;
  poster_url?: string;
  thumb_url?: string;
  category?: { id?: string; slug?: string; name?: string }[];
  country?: { id?: string; slug?: string; name?: string }[];
}

export interface PhimApiListResponse<T = PhimApiMovieItem> {
  status: boolean;
  msg?: string;
  data?: {
    items: T[];
    params?: Record<string, unknown>;
    pagination?: { totalItems?: number; totalPages?: number; currentPage?: number };
  };
}

export interface PhimApiMovieDetailResponse {
  status: boolean;
  msg?: string;
  movie?: any; // leave as any to avoid over-typing for now
  episodes?: any[];
}

class PhimApiService {
  private baseUrl = 'https://phimapi.com';

  private async getJson<T>(url: string): Promise<T> {
    const res = await fetch(url, { headers: { Accept: 'application/json' } });
    if (!res.ok) {
      throw new Error(`HTTP ${res.status} ${res.statusText}`);
    }
    return res.json();
  }

  // List: Phim mới cập nhật (supports v1/v2/v3)
  getNewlyUpdated(page = 1, version: 'v1' | 'v2' | 'v3' = 'v1') {
    const path =
      version === 'v1'
        ? '/danh-sach/phim-moi-cap-nhat'
        : version === 'v2'
        ? '/danh-sach/phim-moi-cap-nhat-v2'
        : '/danh-sach/phim-moi-cap-nhat-v3';
    const url = `${this.baseUrl}${path}?page=${encodeURIComponent(page)}`;
    return this.getJson<PhimApiListResponse>(url);
  }

  // Movie detail by slug
  getMovieDetail(slug: string) {
    const url = `${this.baseUrl}/phim/${encodeURIComponent(slug)}`;
    return this.getJson<PhimApiMovieDetailResponse>(url);
  }

  // Aggregated lists
  getList(type_list: 'phim-bo' | 'phim-le' | 'tv-shows' | 'hoat-hinh' | 'phim-vietsub' | 'phim-thuyet-minh' | 'phim-long-tieng', params: PhimApiListParams = {}) {
    const sp = new URLSearchParams();
    if (params.page) sp.set('page', String(params.page));
    if (params.sort_field) sp.set('sort_field', params.sort_field);
    if (params.sort_type) sp.set('sort_type', params.sort_type);
    if (params.sort_lang) sp.set('sort_lang', params.sort_lang);
    if (params.category) sp.set('category', params.category);
    if (params.country) sp.set('country', params.country);
    if (params.year) sp.set('year', String(params.year));
    if (params.limit) sp.set('limit', String(params.limit));
    const url = `${this.baseUrl}/v1/api/danh-sach/${encodeURIComponent(type_list)}?${sp.toString()}`;
    return this.getJson<PhimApiListResponse>(url);
  }

  // Search
  search(params: PhimApiSearchParams) {
    const sp = new URLSearchParams();
    sp.set('keyword', params.keyword);
    if (params.page) sp.set('page', String(params.page));
    if (params.sort_field) sp.set('sort_field', params.sort_field);
    if (params.sort_type) sp.set('sort_type', params.sort_type);
    if (params.sort_lang) sp.set('sort_lang', params.sort_lang);
    if (params.category) sp.set('category', params.category);
    if (params.country) sp.set('country', params.country);
    if (params.year) sp.set('year', String(params.year));
    if (params.limit) sp.set('limit', String(params.limit));
    const url = `${this.baseUrl}/v1/api/tim-kiem?${sp.toString()}`;
    return this.getJson<PhimApiListResponse>(url);
  }

  // Genres
  getGenres() {
    const url = `${this.baseUrl}/the-loai`;
    return this.getJson<any>(url);
  }
  getGenreDetail(type_list: string, params: Omit<PhimApiListParams, 'category'> = {}) {
    const sp = new URLSearchParams();
    if (params.page) sp.set('page', String(params.page));
    if (params.sort_field) sp.set('sort_field', params.sort_field);
    if (params.sort_type) sp.set('sort_type', params.sort_type);
    if (params.sort_lang) sp.set('sort_lang', params.sort_lang);
    if (params.country) sp.set('country', params.country);
    if (params.year) sp.set('year', String(params.year));
    if (params.limit) sp.set('limit', String(params.limit));
    const url = `${this.baseUrl}/v1/api/the-loai/${encodeURIComponent(type_list)}?${sp.toString()}`;
    return this.getJson<PhimApiListResponse>(url);
  }

  // Countries
  getCountries() {
    const url = `${this.baseUrl}/quoc-gia`;
    return this.getJson<any>(url);
  }
  getCountryDetail(type_list: string, params: Omit<PhimApiListParams, 'country'> = {}) {
    const sp = new URLSearchParams();
    if (params.page) sp.set('page', String(params.page));
    if (params.sort_field) sp.set('sort_field', params.sort_field);
    if (params.sort_type) sp.set('sort_type', params.sort_type);
    if (params.sort_lang) sp.set('sort_lang', params.sort_lang);
    if (params.category) sp.set('category', params.category);
    if (params.year) sp.set('year', String(params.year));
    if (params.limit) sp.set('limit', String(params.limit));
    const url = `${this.baseUrl}/v1/api/quoc-gia/${encodeURIComponent(type_list)}?${sp.toString()}`;
    return this.getJson<PhimApiListResponse>(url);
  }

  // Year
  getYearDetail(year: number, params: Omit<PhimApiListParams, 'year'> = {}) {
    const sp = new URLSearchParams();
    if (params.page) sp.set('page', String(params.page));
    if (params.sort_field) sp.set('sort_field', params.sort_field);
    if (params.sort_type) sp.set('sort_type', params.sort_type);
    if (params.sort_lang) sp.set('sort_lang', params.sort_lang);
    if (params.category) sp.set('category', params.category);
    if (params.country) sp.set('country', params.country);
    if (params.limit) sp.set('limit', String(params.limit));
    const url = `${this.baseUrl}/v1/api/nam/${encodeURIComponent(String(year))}?${sp.toString()}`;
    return this.getJson<PhimApiListResponse>(url);
  }

  // Image webp proxy
  toWebp(imageUrl: string) {
    const url = `${this.baseUrl}/image.php?url=${encodeURIComponent(imageUrl)}`;
    return url;
  }

  // Prefer WEBP only for KKPhim image hosts; otherwise keep original URL
  formatImage(imageUrl?: string | null): string {
    if (!imageUrl) return '';

    // Normalize relative URLs like "/upload/vod/..."
    let normalized = imageUrl.trim();
    if (normalized.startsWith('//')) {
      normalized = `https:${normalized}`;
    } else if (normalized.startsWith('/')) {
      // KKPhim image host
      normalized = `https://phimimg.com${normalized}`;
    } else if (!/^https?:\/\//i.test(normalized)) {
      // Bare relative path like "upload/vod/..."
      normalized = `https://phimimg.com/${normalized}`;
    }

    try {
      const u = new URL(normalized);
      if (u.hostname.includes('phimimg')) {
        return this.toWebp(u.toString());
      }
      return u.toString();
    } catch {
      return normalized;
    }
  }
}

export const phimapiService = new PhimApiService();


