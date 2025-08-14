import { TranscriptionWorker } from "./worker1";
import { SearchWorker } from "./worker2";
import { ResponseWorker } from "./worker3";
import { DifficultyAnalysisWorker } from "./worker4";
import { SimpleResponseWorker } from "./worker5";

export class SupervisorAgent {
  private worker1: TranscriptionWorker;
  private worker2: SearchWorker;
  private worker3: ResponseWorker;
  private worker4: DifficultyAnalysisWorker;
  private worker5: SimpleResponseWorker;

  constructor() {
    this.worker1 = new TranscriptionWorker();
    this.worker2 = new SearchWorker();
    this.worker3 = new ResponseWorker();
    this.worker4 = new DifficultyAnalysisWorker();
    this.worker5 = new SimpleResponseWorker();
  }

  async processUserQuery(transcript: string): Promise<{
    finalResponse: string;
    processingSteps: any[];
    confidence: number;
    followUpSuggestions: string[];
  }> {
    const processingSteps = [];

    try {
      // Etapa 1: Análise de dificuldade
      processingSteps.push({ step: 1, status: "processing", description: "Analisando dificuldade da pergunta...", result: {} });
      const difficultyResult = await this.worker4.analyzeDifficulty(transcript);
      processingSteps[0].status = "completed";
      processingSteps[0].result = difficultyResult;

      let step1Result;
      let currentStepIndex = 1;

      // Etapa 2: Processamento condicional baseado na dificuldade
      if (difficultyResult.needsEnhancement) {
        processingSteps.push({ step: 2, status: "processing", description: "Aprimorando prompt...", result: {} });
        step1Result = await this.worker1.processAudio(transcript);
        processingSteps[currentStepIndex].status = "completed";
        processingSteps[currentStepIndex].result = step1Result;
        currentStepIndex++;
      } else {
        // Para perguntas simples, criamos um resultado básico
        step1Result = {
          enhancedPrompt: transcript,
          intent: "pergunta simples",
          keywords: transcript.split(" ").slice(0, 3)
        };
      }

      // Etapa 3: Verificação se precisa de pesquisa na internet
      processingSteps.push({ step: currentStepIndex + 1, status: "processing", description: "Verificando necessidade de pesquisa...", result: {} });
      const simpleResponseResult = await this.worker5.generateSimpleResponse(
        transcript,
        step1Result.intent,
        difficultyResult.difficultyLevel
      );
      processingSteps[currentStepIndex].status = "completed";
      processingSteps[currentStepIndex].result = simpleResponseResult;
      currentStepIndex++;

      // Se não precisa de pesquisa, retorna resposta direta
      if (!simpleResponseResult.needsInternetSearch && simpleResponseResult.directResponse) {
        return {
          finalResponse: simpleResponseResult.directResponse,
          processingSteps,
          confidence: simpleResponseResult.confidence,
          followUpSuggestions: ["Quer saber mais sobre este tópico?", "Tem alguma dúvida específica?"]
        };
      }

      // Etapa 4: Pesquisa de informações (se necessário)
      processingSteps.push({ step: currentStepIndex + 1, status: "processing", description: "Pesquisando informações...", result: {} });
      const step2Result = await this.worker2.searchInformation(
        step1Result.enhancedPrompt,
        step1Result.keywords
      );
      processingSteps[currentStepIndex].status = "completed";
      processingSteps[currentStepIndex].result = step2Result;
      currentStepIndex++;

      // Etapa 5: Geração da resposta final
      processingSteps.push({ step: currentStepIndex + 1, status: "processing", description: "Gerando resposta final...", result: {} });
      const step3Result = await this.worker3.generateResponse(
        transcript,
        step1Result.enhancedPrompt,
        step2Result.relevantInfo,
        step1Result.intent
      );
      processingSteps[currentStepIndex].status = "completed";
      processingSteps[currentStepIndex].result = step3Result;

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