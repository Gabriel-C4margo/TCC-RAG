export interface SearchConfig {
  enabled: boolean;
  apiKey?: string;
  engineId?: string;
  defaultOptions: {
    maxResults: number;
    language: string;
    safeSearch: 'active' | 'off';
    region?: string;
  };
}

export const searchConfig: SearchConfig = {
  enabled: !!(process.env.GOOGLE_SEARCH_API_KEY && process.env.GOOGLE_SEARCH_ENGINE_ID),
  apiKey: process.env.GOOGLE_SEARCH_API_KEY,
  engineId: process.env.GOOGLE_SEARCH_ENGINE_ID,
  defaultOptions: {
    maxResults: 5,
    language: 'lang_pt',
    safeSearch: 'active',
    region: 'countryBR'
  }
};

export const getSearchStatus = () => {
  return {
    configured: searchConfig.enabled,
    hasApiKey: !!searchConfig.apiKey,
    hasEngineId: !!searchConfig.engineId,
    message: searchConfig.enabled 
      ? "Google Search API configurada - usando resultados reais"
      : "Google Search API não configurada - usando resultados simulados"
  };
};