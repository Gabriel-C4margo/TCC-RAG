import { createGeminiModel } from "../gemini";
import { HumanMessage } from "@langchain/core/messages";

export class SimpleResponseWorker {
  private model;

  constructor() {
    this.model = createGeminiModel();
  }

  async generateSimpleResponse(
    originalQuery: string,
    intent: string,
    difficultyLevel: string
  ): Promise<{
    needsInternetSearch: boolean;
    directResponse?: string;
    searchRequired: boolean;
    reasoning: string;
    confidence: number;
  }> {
    const prompt = `
    Você é um assistente que determina se uma pergunta pode ser respondida diretamente ou precisa de pesquisa na internet.
    
    Pergunta: "${originalQuery}"
    Intenção: "${intent}"
    Nível de Dificuldade: "${difficultyLevel}"
    
    Analise se você pode responder esta pergunta com seu conhecimento interno ou se precisa de informações atualizadas da internet.
    
    Critérios para resposta direta:
    - Conceitos gerais e estabelecidos
    - Definições básicas
    - Conhecimento histórico consolidado
    - Explicações de processos conhecidos
    
    Critérios para pesquisa na internet:
    - Informações atuais/recentes
    - Dados específicos e atualizados
    - Eventos recentes
    - Estatísticas atuais
    
    Se puder responder diretamente, forneça uma resposta simples e clara (máximo 150 palavras).
    
    Responda no formato JSON:
    {
      "needsInternetSearch": true/false,
      "directResponse": "resposta direta se não precisar de pesquisa",
      "searchRequired": true/false,
      "reasoning": "justificativa da decisão",
      "confidence": 0.85
    }
    `;

    try {
      const response = await this.model.invoke([new HumanMessage(prompt)]);
      const rawContent = response.content as string;
      const cleanedContent = rawContent.replace(/```json\n|```/g, '').trim();
      const result = JSON.parse(cleanedContent);

      return {
        needsInternetSearch: result.needsInternetSearch,
        directResponse: result.directResponse,
        searchRequired: result.searchRequired,
        reasoning: result.reasoning,
        confidence: result.confidence || 0.8
      };
    } catch (error) {
      console.error("Worker 5 Error:", error);
      return {
        needsInternetSearch: true,
        searchRequired: true,
        reasoning: "Erro na análise, assumindo necessidade de pesquisa por segurança",
        confidence: 0.5
      };
    }
  }
}