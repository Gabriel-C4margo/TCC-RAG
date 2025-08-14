import { createGeminiModel } from "../gemini";
import { HumanMessage } from "@langchain/core/messages";

export class ResponseWorker {
  private model;

  constructor() {
    this.model = createGeminiModel();
  }

  async generateResponse(
    originalQuery: string,
    enhancedPrompt: string,
    searchInfo: string,
    intent: string
  ): Promise<{
    conversationalResponse: string;
    confidence: number;
    followUpSuggestions: string[];
  }> {
    const prompt = `
    Você é um assistente conversacional amigável e informativo. Com base nas informações fornecidas:

    Pergunta Original: "${originalQuery}"
    Prompt Aprimorado: "${enhancedPrompt}"
    Intenção: "${intent}"
    Informações de Pesquisa: "${searchInfo}"

    Crie uma resposta conversacional, natural e informativa que:
    1. Responda diretamente à pergunta do usuário
    2. Use um tom amigável e conversacional
    3. Seja concisa (máximo 60 palavras)
    4. Verifique se o usuario quer mais informações

    Responda no formato JSON:
    {
      "conversationalResponse": "sua resposta conversacional aqui",
      "confidence": 0.85,
      "followUpSuggestions": ["sugestão 1", "sugestão 2"]
    }
    `;

    try {
      const response = await this.model.invoke([new HumanMessage(prompt)]);

      const rawContent = response.content as string;

      // 2. Remove as marcações de código ```json...``` da string
      const cleanedContent = rawContent.replace(/```json\n|```/g, '').trim();

      const result = JSON.parse(cleanedContent);
      
      return {
        conversationalResponse: result.conversationalResponse,
        confidence: result.confidence || 0.8,
        followUpSuggestions: result.followUpSuggestions || []
      };
    } catch (error) {
      console.error("Worker 3 Error:", error);
      return {
        conversationalResponse: "Desculpe, tive dificuldades para processar sua pergunta no momento. Pode tentar reformular?",
        confidence: 0.5,
        followUpSuggestions: ["Tente fazer uma pergunta mais específica", "Reformule sua pergunta"]
      };
    }
  }
}