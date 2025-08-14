"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mic, MicOff, Play, Pause, Volume2 } from "lucide-react";

interface ProcessingStep {
  step: number;
  status: "processing" | "completed" | "error";
  description: string;
  result?: any;
}

interface ChatResponse {
  response: string;
  processingSteps: ProcessingStep[];
  confidence: number;
  followUpSuggestions: string[];
}

export default function VoiceChatInterface() {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [response, setResponse] = useState<ChatResponse | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  
  const recognitionRef = useRef<any | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined" && "webkitSpeechRecognition" in window) {
      const recognition = new (window as any).webkitSpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = "pt-BR";

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setTranscript(transcript);
        handleProcessTranscript(transcript);
      };

      recognition.onerror = (event: any) => {
        console.error("Speech recognition error:", event.error);
        setIsRecording(false);
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognitionRef.current = recognition;
    }
  }, []);

  const handleProcessTranscript = async (transcript: string) => {
    setIsProcessing(true);
    
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ transcript }),
      });

      const data = await response.json();
      
      if (data.success) {
        setResponse(data);
        await speakText(data.response);
      } else {
        console.error("API Error:", data.error);
      }
    } catch (error) {
      console.error("Request error:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const speakText = async (text: string) => {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "pt-BR";
      utterance.rate = 0.9;
      utterance.pitch = 1;

      utterance.onstart = () => setIsPlaying(true);
      utterance.onend = () => setIsPlaying(false);
      
      speechSynthesis.speak(utterance);
    }
  };

  const startRecording = () => {
    if (recognitionRef.current && !isRecording) {
      setTranscript("");
      setResponse(null);
      setIsRecording(true);
      recognitionRef.current.start();
    }
  };

  const stopRecording = () => {
    if (recognitionRef.current && isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    }
  };

  const toggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-800 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-white">
            Chatbot por Voz com IA
          </h1>
          <p className="text-slate-300">
            Powered by Google Gemini 2.0 Flash & LangChain
          </p>
        </div>

        {/* Recording Interface */}
        <Card className="bg-white/10 backdrop-blur-lg border-white/20">
          <CardHeader className="text-center">
            <CardTitle className="text-white">Interface de Voz</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex justify-center">
              <Button
                onClick={toggleRecording}
                disabled={isProcessing}
                size="lg"
                className={`w-24 h-24 rounded-full transition-all duration-300 ${
                  isRecording
                    ? "bg-red-500 hover:bg-red-600 animate-pulse"
                    : "bg-blue-500 hover:bg-blue-600"
                } text-white shadow-2xl`}
              >
                {isRecording ? (
                  <MicOff className="w-8 h-8" />
                ) : (
                  <Mic className="w-8 h-8" />
                )}
              </Button>
            </div>

            <div className="text-center space-y-2">
              <p className="text-white/80">
                {isRecording
                  ? "🎤 Gravando... Fale agora!"
                  : isProcessing
                  ? "🤔 Processando sua pergunta..."
                  : "🎯 Clique no microfone para começar"}
              </p>
              
              {transcript && (
                <div className="mt-4 p-4 bg-white/20 rounded-lg">
                  <p className="text-white font-medium">Você disse:</p>
                  <p className="text-blue-200 italic">"{transcript}"</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Processing Steps */}
        {isProcessing && response?.processingSteps && (
          <Card className="bg-white/10 backdrop-blur-lg border-white/20">
            <CardHeader>
              <CardTitle className="text-white">Status dos Agentes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {response.processingSteps.map((step) => (
                <div key={step.step} className="flex items-center justify-between">
                  <span className="text-white">
                    Worker {step.step}: {step.description}
                  </span>
                  <Badge
                    variant={step.status === "completed" ? "default" : "secondary"}
                    className={
                      step.status === "completed"
                        ? "bg-green-500"
                        : "bg-yellow-500 animate-pulse"
                    }
                  >
                    {step.status === "completed" ? "✓" : "⏳"}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Response */}
        {response && !isProcessing && (
          <Card className="bg-white/10 backdrop-blur-lg border-white/20">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-white">Resposta da IA</CardTitle>
              <div className="flex items-center space-x-2">
                <Badge className="bg-blue-500">
                  Confiança: {Math.round(response.confidence * 100)}%
                </Badge>
                {isPlaying && (
                  <Badge className="bg-green-500 animate-pulse">
                    <Volume2 className="w-3 h-3 mr-1" />
                    Reproduzindo
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-white/20 rounded-lg">
                <p className="text-white leading-relaxed">
                  {response.response}
                </p>
              </div>

              <div className="flex justify-between items-center">
                <Button
                  onClick={() => speakText(response.response)}
                  disabled={isPlaying}
                  className="bg-green-500 hover:bg-green-600"
                >
                  <Play className="w-4 h-4 mr-2" />
                  Ouvir Novamente
                </Button>

                <Button
                  onClick={() => setResponse(null)}
                  variant="outline"
                  className="border-white/30 text-white hover:bg-white/10"
                >
                  Nova Pergunta
                </Button>
              </div>

              {response.followUpSuggestions.length > 0 && (
                <div className="space-y-2">
                  <p className="text-white/80 text-sm">Sugestões:</p>
                  <div className="flex flex-wrap gap-2">
                    {response.followUpSuggestions.map((suggestion, index) => (
                      <Badge
                        key={index}
                        variant="outline"
                        className="border-blue-300 text-blue-200 cursor-pointer hover:bg-blue-500/20"
                        onClick={() => speakText(suggestion)}
                      >
                        {suggestion}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Instructions */}
        <Card className="bg-white/5 backdrop-blur-sm border-white/10">
          <CardContent className="pt-6">
            <div className="grid md:grid-cols-3 gap-4 text-center">
              <div className="space-y-2">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto">
                  <Mic className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-white font-medium">1. Fale</h3>
                <p className="text-slate-300 text-sm">
                  Clique no microfone e faça sua pergunta
                </p>
              </div>
              <div className="space-y-2">
                <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mx-auto">
                  <span className="text-white font-bold">AI</span>
                </div>
                <h3 className="text-white font-medium">2. Processamento</h3>
                <p className="text-slate-300 text-sm">
                  Nossos agentes processam sua pergunta
                </p>
              </div>
              <div className="space-y-2">
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto">
                  <Volume2 className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-white font-medium">3. Resposta</h3>
                <p className="text-slate-300 text-sm">
                  Ouça a resposta personalizada
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}