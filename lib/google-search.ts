import { google } from "googleapis";

export interface SearchResult {
  title: string;
  snippet: string;
  url: string;
  displayLink: string;
  formattedUrl: string;
}

export interface SearchResponse {
  results: SearchResult[];
  totalResults: string;
  searchTime: number;
}

export class GoogleSearchService {
  private customSearch;

  constructor() {
    this.customSearch = google.customsearch('v1');
  }

  async search(
    query: string,
    options: {
      num?: number;
      start?: number;
      language?: string;
      safeSearch?: 'active' | 'off';
      dateRestrict?: string;
    } = {}
  ): Promise<SearchResponse> {
    const {
      num = 5,
      start = 1,
      language = 'lang_pt',
      safeSearch = 'active',
      dateRestrict
    } = options;

    try {
      const searchResponse = await this.customSearch.cse.list({
        auth: process.env.GOOGLE_SEARCH_API_KEY,
        cx: process.env.GOOGLE_SEARCH_ENGINE_ID,
        q: query,
        num,
        start,
        lr: language,
        safe: safeSearch,
        dateRestrict,
      });

      const items = searchResponse.data.items || [];
      const searchInformation = searchResponse.data.searchInformation;

      const results: SearchResult[] = items.map(item => ({
        title: item.title || "Título não disponível",
        snippet: item.snippet || "Descrição não disponível", 
        url: item.link || "#",
        displayLink: item.displayLink || "",
        formattedUrl: item.formattedUrl || ""
      }));

      return {
        results,
        totalResults: searchInformation?.totalResults || "0",
        searchTime: parseFloat(searchInformation?.searchTime || "0")
      };

    } catch (error) {
      console.error("Google Search Service Error:", error);
      throw new Error("Falha na busca do Google");
    }
  }

  async isConfigured(): Promise<boolean> {
    return !!(process.env.GOOGLE_SEARCH_API_KEY && process.env.GOOGLE_SEARCH_ENGINE_ID);
  }

  async validateConfiguration(): Promise<boolean> {
    try {
      if (!await this.isConfigured()) {
        return false;
      }

      const testResult = await this.search("test", { num: 1 });
      return testResult.results.length >= 0;
    } catch (error) {
      return false;
    }
  }
}