# Chatbot por Voz com LangChain.js e Google Gemini

Sistema avançado de chatbot por voz que utiliza um **Agente Supervisor** para orquestrar três **Worker Agents** especializados, powered by Google Gemini 2.0 Flash e LangChain.js.

## 🚀 Funcionalidades

- **Interface de Voz Intuitiva**: Capture de voz com Web Speech API
- **Arquitetura Multi-Agente**: Sistema supervisor com 3 workers especializados
- **Worker 1**: Transcrição e otimização de prompts
- **Worker 2**: Pesquisa inteligente de informações
- **Worker 3**: Geração de respostas conversacionais
- **Text-to-Speech**: Conversão de texto em voz para as respostas
- **Interface Moderna**: Design responsivo com feedback visual em tempo real

## 🛠️ Tecnologias

- **Frontend**: Next.js 13+ com App Router
- **IA/ML**: LangChain.js + Google Gemini 2.0 Flash
- **UI**: Tailwind CSS + shadcn/ui
- **Speech**: Web Speech API (Speech Recognition + Speech Synthesis)
- **TypeScript**: Tipagem completa em todo o projeto

## 📋 Pré-requisitos

1. Node.js 18+ instalado
2. Google API Key para o Gemini
3. Navegador com suporte à Web Speech API

## 🔧 Configuração

1. **Clone e instale dependências:**
```bash
npm install
```

2. **Configure as variáveis de ambiente:**
```bash
cp .env.example .env.local
```

3. **Adicione sua chave do Google Gemini:**
   - Visite: https://makersuite.google.com/app/apikey
   - Copie sua API key
   - Adicione no arquivo `.env.local`:
```
GOOGLE_API_KEY=sua_chave_aqui
```

4. **Execute o projeto:**
```bash
npm run dev
```

## 🎯 Como Usar

1. **Clique no microfone** para iniciar a gravação
2. **Fale sua pergunta** claramente
3. **Acompanhe o processamento** dos agentes em tempo real
4. **Ouça a resposta** gerada automaticamente

## 🤖 Arquitetura dos Agentes

### Agente Supervisor
Orquestra o fluxo completo e coordena os cinco workers especializados.

### Worker 4 - Análise de Dificuldade
- Analisa a complexidade da pergunta
- Determina se precisa de aprimoramento
- Otimiza o fluxo de processamento

### Worker 5 - Resposta Simples
- Avalia se precisa de pesquisa na internet
- Gera respostas diretas para perguntas simples
- Otimiza tempo de resposta

### Worker 1 - Aprimoramento de Prompt
- Processa o áudio capturado
- Melhora e estrutura o prompt
- Identifica intenções e palavras-chave (apenas quando necessário)

### Worker 2 - Pesquisa
- Realiza busca inteligente (apenas quando necessário)
- Coleta informações relevantes
- Organiza dados para o próximo worker

### Worker 3 - Resposta
- Gera resposta conversacional complexa
- Combina informações da pesquisa
- Otimiza para síntese de voz

## 🔊 Web Speech API

O sistema utiliza:
- **SpeechRecognition**: Para captura e transcrição de voz
- **SpeechSynthesis**: Para conversão de texto em áudio

## 🎨 Interface

- Design moderno com gradientes e animações
- Feedback visual durante processamento
- Indicadores de status para cada agente
- Sugestões de follow-up interativas

## 📱 Compatibilidade

- ✅ Chrome/Edge (Recomendado)
- ✅ Safari (iOS 15+)
- ⚠️ Firefox (Limitado)

## 🚀 Deploy

O projeto está configurado para deploy estático:

```bash
npm run build
```

## 📄 Licença

MIT License - Veja o arquivo LICENSE para detalhes.

## 🤝 Contribuição

Contribuições são bem-vindas! Abra uma issue ou pull request.

---

**Desenvolvido com ❤️ usando Next.js, LangChain.js e Google Gemini**