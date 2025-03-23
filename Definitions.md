# 🃏 Competição de Bots de Sueca - Especificação Técnica

![GitHub](https://img.shields.io/badge/Versão-1.0-blue)
![Status](https://img.shields.io/badge/Status-Em%20Desenvolvimento-yellow)
![Language](https://img.shields.io/badge/Linguagem-Português-green)
[![License: MIT](https://img.shields.io/badge/License-MIT-purple.svg)](https://opensource.org/licenses/MIT)

## 📋 Definição de Conceitos e Critérios de Conclusão

### 1. 🃏 Jogada

**Definição**: Uma jogada representa a ação de um jogador colocar uma carta na mesa.

**Critérios de Conclusão de uma Jogada**:

- ✅ Carta válida jogada pelo jogador
- ✅ Carta pertence à mão do jogador
- ✅ Jogada respeita as regras de jogo da Sueca
- ✅ Jogador utiliza token de autenticação correto
- ✅ Jogada registada no estado do jogo
- ✅ Validação da carta face às regras de jogo (naipe, valor)
- ⏱️ Jogada realizada dentro do tempo limite permitido (A definir)

### 2. 🎲 Ronda

**Definição**: Uma ronda consiste em 4 jogadas, uma de cada jogador, num total de 10 rondas por jogo.

**Critérios de Conclusão de uma Ronda**:

- ✅ Cada jogador jogou uma carta
- ✅ Determinação da carta vencedora segundo regras da Sueca
- ✅ Cálculo de pontos da ronda
- ✅ Atribuição de pontos à equipa vencedora
- ✅ Registo dos pontos obtidos
- ✅ Verificação de cumprimento das regras de jogo
- ✅ Identificação de possíveis renúncias

### 3. 🏆 Jogo

**Definição**: Um jogo completo termina quando uma equipa atinge ou ultrapassa 10 pontos.

**Critérios de Conclusão de um Jogo**:

- ✅ Conclusão de todas as rondas necessárias
- ✅ Uma equipa atingiu 10 ou mais pontos
- ✅ Cálculo final dos pontos de cada equipa
- ✅ Declaração da equipa vencedora
- ✅ Registo completo do histórico do jogo
- ✅ Validação de todas as jogadas e rondas
- ⏱️ Jogo concluído dentro do tempo limite permitido (A definir)

### 4. 🚫 Renúncia

**Definição**: Ato de acusar um jogador de violar as regras de jogo.

**Critérios de Conclusão de uma Renúncia**:

- ✅ Acusação formal de renúncia por um jogador
- ✅ Verificação da validade da acusação
- ✅ Confirmação ou rejeição da renúncia
- ✅ Atribuição de pontos conforme resultado da verificação
  - Renúncia falsa: +4 pontos para a equipa acusadora
  - Renúncia verdadeira: +4 pontos para a equipa acusada
- ✅ Registo da ocorrência no histórico do jogo

### 5. 👥 Registo de Jogador

**Definição**: Processo de autenticação e preparação de um bot para jogar.

**Critérios de Conclusão do Registo**:

- ✅ Atribuição de identificador único (P1, P2, P3, P4)
- ✅ Geração de token de autenticação
- ✅ Verificação da elegibilidade do bot
- ✅ Definição da equipa (1 ou 2)
- ✅ Distribuição inicial de cartas

### 6. 📊 Pontuação

**Definição**: Sistema de pontuação baseado nos pontos obtidos em cada ronda.

**Critérios de Pontuação**:

- 0-59 pontos: 0 pontos
- 60-89 pontos: 1 ponto
- 90-119 pontos: 2 pontos
- 120 pontos: 4 pontos

### 7. 🃏 Representação de Cartas

**Definição**: Formato padronizado para representação de cartas.

**Critérios de Representação**:

- String de 2 caracteres
- 1º carácter: Naipe (E, P, C, O)
- 2º carácter: Valor (2-9, 0, J, Q, K, A)
- Exemplo: "EA" (Ás de Espadas)

### 8. 👥 Equipas

**Definição**: Distribuição fixa dos jogadores em duas equipas.

**Composição**:

- Equipa 1: Jogadores P1 e P3
- Equipa 2: Jogadores P2 e P4

## 📝 Notas Finais

- Todos os eventos são registados
- Servidor valida todas as ações
- Comunicação exclusivamente através dos endpoints definidos

**Boa sorte, desenvolvedores de bots!** 🤖🃏
