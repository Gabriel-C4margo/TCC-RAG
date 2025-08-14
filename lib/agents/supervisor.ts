import { TranscriptionWorker } from "./worker1";
import { SearchWorker } from "./worker2";
import { ResponseWorker } from "./worker3";

export class SupervisorAgent {
  private worker1: TranscriptionWorker;
  private worker2: SearchWorker;
  private worker3: ResponseWorker;

  constructor() {
    this.worker1 = new TranscriptionWorker();
    this.worker2 = new SearchWorker();
    this.worker3 = new ResponseWorker();
  }

  async processUserQuery(transcript: string): Promise<{
    finalResponse: string;
    processingSteps: any[];
    confidence: number;
    followUpSuggestions: string[];
  }> {
    const processingSteps = [];

    try {
      // Etapa 1: Processamento e transcrição aprimorada
      processingSteps.push({ step: 1, status: "processing", description: "Processando transcrição...", result: {} });
      const step1Result = await this.worker1.processAudio(transcript);
      processingSteps[0].status = "completed";
      processingSteps[0].result = step1Result;

      // Etapa 2: Pesquisa de informações
      processingSteps.push({ step: 2, status: "processing", description: "Pesquisando informações...",result: {} });
      const step2Result = await this.worker2.searchInformation(
        step1Result.enhancedPrompt,
        step1Result.keywords
      );
      processingSteps[1].status = "completed";
      processingSteps[1].result = step2Result;

      // Etapa 3: Geração da resposta final
      processingSteps.push({ step: 3, status: "processing", description: "Gerando resposta...",result: {} });
      const step3Result = await this.worker3.generateResponse(
        transcript,
        step1Result.enhancedPrompt,
        step2Result.relevantInfo,
        step1Result.intent
      );
      processingSteps[2].status = "completed";
      processingSteps[2].result = step3Result;

      return {
        finalResponse: step3Result.conversationalResponse,
        processingSteps,
        confidence: step3Result.confidence,
        followUpSuggestions: step3Result.followUpSuggestions
      };

    } catch (error) {
      console.error("Supervisor Error:", error);
      return {
        finalResponse: "Desculpe, ocorreu um erro ao processar sua pergunta. Tente novamente.",
        processingSteps,
        confidence: 0.3,
        followUpSuggestions: ["Tente novamente", "Verifique sua conexão"]
      };
    }
  }
}