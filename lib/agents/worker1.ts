import { createGeminiModel } from "../gemini";
import { HumanMessage } from "@langchain/core/messages";

export class TranscriptionWorker {
  private model;

  constructor() {
    this.model = createGeminiModel();
  }

  async processAudio(transcript: string): Promise<{
    enhancedPrompt: string;
    intent: string;
    keywords: string[];
  }> {
    const prompt = `
    Você é um especialista em processamento de linguagem natural. Analise a seguinte transcrição de áudio e:
    
    1. Melhore e estruture o prompt para uma pesquisa mais eficiente
    2. Identifique a intenção do usuário
    3. Extraia palavras-chave relevantes para pesquisa
    
    Transcrição: "${transcript}"
    
    Responda no formato JSON:
    {
      "enhancedPrompt": "prompt melhorado e estruturado",
      "intent": "intenção identificada",
      "keywords": ["palavra1", "palavra2", "palavra3"]
    }
    `;

    try {
      const response = await this.model.invoke([new HumanMessage(prompt)]);

      // 1. Acessa o conteúdo da resposta
      const rawContent = response.content as string;

      // 2. Remove as marcações de código ```json...``` da string
      const cleanedContent = rawContent.replace(/```json\n|```/g, '').trim();

      // 3. Faz o parsing do JSON limpo
      const result = JSON.parse(cleanedContent);

      
      return {
        enhancedPrompt: result.enhancedPrompt,
        intent: result.intent,
        keywords: result.keywords
      };
    } catch (error) {
      console.error("Worker 1 Error:", error);
      return {
        enhancedPrompt: transcript,
        intent: "informação geral",
        keywords: transcript.split(" ").slice(0, 5)
      };
    }
  }
}