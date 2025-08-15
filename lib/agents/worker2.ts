import { google } from "googleapis";

export class SearchWorker {
  private customSearch;

  constructor() {
    this.customSearch = google.customsearch('v1');
  }

  async searchInformation(enhancedPrompt: string, keywords: string[]): Promise<{
    searchResults: any[];
    relevantInfo: string;
    sources: string[];
  }> {
    try {
      // Verifica se as variáveis de ambiente estão configuradas
      if (!process.env.GOOGLE_SEARCH_API_KEY || !process.env.GOOGLE_SEARCH_ENGINE_ID) {
        console.warn("Google Search API não configurada, usando resultados simulados");
        return this.getSimulatedResults(enhancedPrompt, keywords);
      }

      // Prepara a query de busca
      const searchQuery = this.buildSearchQuery(enhancedPrompt, keywords);
      
      // Realiza a busca usando Google Custom Search API
      const searchResponse = await this.customSearch.cse.list({
        auth: process.env.GOOGLE_SEARCH_API_KEY,
        cx: process.env.GOOGLE_SEARCH_ENGINE_ID,
        q: searchQuery,
        num: 5, // Número de resultados
        safe: 'active', // Filtro de segurança
        lr: 'lang_pt', // Priorizar resultados em português
      });

      const items = searchResponse.data.items || [];
      
      if (items.length === 0) {
        console.warn("Nenhum resultado encontrado, usando resultados simulados");
        return this.getSimulatedResults(enhancedPrompt, keywords);
      }

      // Processa os resultados da busca
      const searchResults = items.map(item => ({
        title: item.title || "Título não disponível",
        snippet: item.snippet || "Descrição não disponível",
        url: item.link || "#",
        displayLink: item.displayLink || "",
        formattedUrl: item.formattedUrl || ""
      }));

      // Combina as informações relevantes
      const relevantInfo = searchResults
        .map(result => `${result.title}: ${result.snippet}`)
        .join("\n\n");

      const sources = searchResults.map(result => result.url);

      return {
        searchResults,
        relevantInfo,
        sources
      };

    } catch (error) {
      console.error("Worker 2 Google Search Error:", error);
      
      // Em caso de erro, retorna resultados simulados
      return this.getSimulatedResults(enhancedPrompt, keywords);
    }
  }

  private buildSearchQuery(enhancedPrompt: string, keywords: string[]): string {
    // Combina o prompt aprimorado com palavras-chave para criar uma query otimizada
    const keywordString = keywords.join(" ");
    
    // Remove caracteres especiais e limita o tamanho da query
    const cleanPrompt = enhancedPrompt.replace(/[^\w\s]/gi, '').substring(0, 100);
    
    // Prioriza palavras-chave se disponíveis
    if (keywords.length > 0) {
      return `${keywordString} ${cleanPrompt}`.trim();
    }
    
    return cleanPrompt;
  }

  private getSimulatedResults(enhancedPrompt: string, keywords: string[]): {
    searchResults: any[];
    relevantInfo: string;
    sources: string[];
  } {
    const searchQuery = keywords.join(" ");
    
    const simulatedResults = [
      {
        title: `Informações sobre ${searchQuery}`,
        snippet: `Informações relevantes relacionadas a ${searchQuery}. Este conteúdo fornece contexto abrangente sobre o tópico pesquisado, incluindo definições, características principais e aplicações práticas.`,
        url: "https://example.com/info-1",
        displayLink: "example.com",
        formattedUrl: "https://example.com/info-1"
      },
      {
        title: `Guia completo: ${enhancedPrompt.substring(0, 50)}...`,
        snippet: `Dados detalhados e atualizados sobre ${enhancedPrompt.substring(0, 80)}. Inclui explicações técnicas, exemplos práticos e informações complementares para uma compreensão completa.`,
        url: "https://example.com/guide-2",
        displayLink: "example.com",
        formattedUrl: "https://example.com/guide-2"
      },
      {
        title: `Análise especializada sobre ${keywords[0] || "o tópico"}`,
        snippet: `Perspectiva especializada e análise aprofundada sobre o assunto. Contém insights valiosos, tendências atuais e recomendações baseadas em pesquisas recentes.`,
        url: "https://example.com/analysis-3",
        displayLink: "example.com", 
        formattedUrl: "https://example.com/analysis-3"
      }
    ];

    const relevantInfo = simulatedResults
      .map(result => `${result.title}: ${result.snippet}`)
      .join("\n\n");

    return {
      searchResults: simulatedResults,
      relevantInfo,
      sources: simulatedResults.map(result => result.url)
    };
  }

  // Método para validar se a API está configurada corretamente
  async validateApiConfiguration(): Promise<boolean> {
    try {
      if (!process.env.GOOGLE_SEARCH_API_KEY || !process.env.GOOGLE_SEARCH_ENGINE_ID) {
        return false;
      }

      // Testa com uma busca simples
      const testResponse = await this.customSearch.cse.list({
        auth: process.env.GOOGLE_SEARCH_API_KEY,
        cx: process.env.GOOGLE_SEARCH_ENGINE_ID,
        q: "test",
        num: 1
      });

      return testResponse.status === 200;
    } catch (error) {
      console.error("API Configuration validation failed:", error);
      return false;
    }
  }
}