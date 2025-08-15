# Configuração da Google Custom Search API

Este guia explica como configurar a Google Custom Search API para o Worker 2 realizar buscas reais na internet.

## 1. Criar Projeto no Google Cloud Console

1. Acesse: https://console.cloud.google.com/
2. Crie um novo projeto ou selecione um existente
3. Anote o ID do projeto

## 2. Ativar a Custom Search API

1. No Google Cloud Console, vá para "APIs & Services" > "Library"
2. Procure por "Custom Search API"
3. Clique em "Enable"

## 3. Criar Credenciais (API Key)

1. Vá para "APIs & Services" > "Credentials"
2. Clique em "Create Credentials" > "API Key"
3. Copie a API Key gerada
4. (Opcional) Configure restrições de segurança

## 4. Criar Custom Search Engine

1. Acesse: https://cse.google.com/
2. Clique em "Add" para criar um novo search engine
3. Configure:
   - **Sites to search**: Deixe em branco para buscar toda a web
   - **Language**: Portuguese
   - **Name**: Nome do seu projeto
4. Clique em "Create"
5. Na página seguinte, copie o **Search Engine ID**

## 5. Configurar Variáveis de Ambiente

Adicione no seu arquivo `.env.local`:

```env
# Google Gemini API Key
GOOGLE_API_KEY=sua_chave_gemini_aqui

# Google Custom Search API
GOOGLE_SEARCH_API_KEY=sua_api_key_aqui
GOOGLE_SEARCH_ENGINE_ID=seu_search_engine_id_aqui
```

## 6. Configurações Avançadas (Opcional)

### Personalizar o Search Engine

1. Acesse https://cse.google.com/
2. Selecione seu search engine
3. Vá para "Setup" > "Basics"
4. Configure:
   - **Sites to include**: Adicione sites específicos se desejar
   - **Language**: Portuguese (Brazil)
   - **Region**: Brazil

### Configurar Filtros de Segurança

1. Vá para "Setup" > "Advanced"
2. Configure:
   - **SafeSearch**: On (recomendado)
   - **Image Search**: Off (para economizar quota)

## 7. Limites e Cotas

- **Gratuito**: 100 consultas por dia
- **Pago**: Até 10.000 consultas por dia ($5 por 1.000 consultas adicionais)

Para aumentar a cota:
1. Vá para Google Cloud Console > "APIs & Services" > "Quotas"
2. Procure por "Custom Search API"
3. Solicite aumento de cota se necessário

## 8. Teste da Configuração

O sistema automaticamente detecta se a API está configurada:
- ✅ **Configurada**: Usa resultados reais do Google
- ❌ **Não configurada**: Usa resultados simulados

## 9. Troubleshooting

### Erro: "API key not valid"
- Verifique se a API Key está correta
- Confirme se a Custom Search API está ativada

### Erro: "Invalid search engine ID"
- Verifique se o Search Engine ID está correto
- Confirme se o search engine foi criado corretamente

### Sem resultados
- Verifique se a query não está muito específica
- Teste com termos mais gerais

## 10. Monitoramento

Monitore o uso da API em:
- Google Cloud Console > "APIs & Services" > "Dashboard"
- Veja estatísticas de uso e possíveis erros

---

**Nota**: Se não configurar a Google Search API, o sistema funcionará normalmente com resultados simulados, mas as respostas serão menos precisas e atualizadas.