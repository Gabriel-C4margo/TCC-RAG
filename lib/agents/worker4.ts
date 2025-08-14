import { createGeminiModel } from "../gemini";
import { HumanMessage } from "@langchain/core/messages";

export class DifficultyAnalysisWorker {
  private model;

  constructor() {
    this.model = createGeminiModel();
  }

  async analyzeDifficulty(transcript: string): Promise<{
    difficultyLevel: "simple" | "medium" | "complex";
    needsEnhancement: boolean;
    reasoning: string;
    confidence: number;
  }> {
    const prompt = `
    Você é um especialista em análise de complexidade de perguntas. Analise a seguinte pergunta e determine:
    
    1. O nível de dificuldade (simple, medium, complex)
    2. Se a pergunta precisa de aprimoramento antes do processamento
    3. Justificativa para sua análise
    
    Pergunta: "${transcript}"
    
    Critérios:
    - SIMPLE: Perguntas diretas, factuais, conceitos básicos
    - MEDIUM: Perguntas que requerem explicação ou contexto adicional
    - COMPLEX: Perguntas técnicas, multi-facetadas ou que requerem pesquisa profunda
    
    Responda no formato JSON:
    {
      "difficultyLevel": "simple|medium|complex",
      "needsEnhancement": true/false,
      "reasoning": "explicação da análise",
      "confidence": 0.85
    }
    `;

    try {
      const response = await this.model.invoke([new HumanMessage(prompt)]);
      const rawContent = response.content as string;
      const cleanedContent = rawContent.replace(/```json\n|```/g, '').trim();
      const result = JSON.parse(cleanedContent);

      return {
        difficultyLevel: result.difficultyLevel,
        needsEnhancement: result.needsEnhancement,
        reasoning: result.reasoning,
        confidence: result.confidence || 0.8
      };
    } catch (error) {
      console.error("Worker 4 Error:", error);
      return {
        difficultyLevel: "medium",
        needsEnhancement: true,
        reasoning: "Erro na análise, assumindo nível médio por segurança",
        confidence: 0.5
      };
    }
  }
}