# Documento Estratégico de Qualidade — Smart To-Do

---

## Sumário Executivo

Este documento apresenta a visão estratégica de qualidade para o Smart To-Do, tem como objetivo estruturar uma abordagem de qualidade que seja sustentável, proporcional ao risco real do produto e capaz de antecipar problemas antes que cheguem ao ambiente produtivo.

O produto enfrenta um desafio duplo: entregar uma experiência confiável para um perfil de usuário com baixa tolerância a falhas silenciosas (persona Marina), ao mesmo tempo em que depende de uma integração com IA externa que introduz variabilidade por natureza. A estratégia de qualidade precisa absorver essa variabilidade sem transferi-la para o usuário.

> **Posição central:** Qualidade não é a última etapa antes do deploy — é uma propriedade de como o time escreve requisitos, faz a revisão de código e realiza a entrega.
> Este documento trata dos três níveis: o que testamos, como testamos e como mudamos o processo para testar menos tarde.

---

## 1. Análise de Risco

O risco em qualidade de software não é distribuído de forma uniforme entre as funcionalidades. Para o Smart To-Do, ele está concentrado em dois eixos: dependências externas não controláveis e requisitos com ambiguidade crítica.

| Funcionalidade          | Risco Principal                                                                                                         | Impacto no Negócio                                               | Severidade |
| ----------------------- | ----------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------- | ---------- |
| RF-05 — Geração por IA  | Resposta não estruturada; ausência de tratamento de erro;                                                               | Abandono na primeira sessão. Feature principal do produto.       | 🔴 CRÍTICO |
| RF-06 — API Key         | Chave armazenada de forma insegura no client-side; ausência de validação antes do uso;                                  | Risco de segurança                                               | 🔴 CRÍTICO |
| RF-03/04 — Persistência | Mecanismo de persistência indefinido; sem clareza sobre escopo de dados entre sessões e dispositivos                    | Perda de dados do usuário sem aviso gera desconfiança imediata   | 🟠 ALTO    |
| RF-02 — Criação Manual  | Ausência de validação de input; campo vazio aceito; títulos duplicados sem definição de comportamento                   | Dados sujos na lista, experiência degradada                      | 🟠 ALTO    |
| RF-01 — Listagem        | Ordenação indefinida; comportamento de empty state ausente; diferenciação visual de tarefas IA sem critério objetivável | Confusão na primeira sessão; métricas de engajamento distorcidas | 🔵 MÉDIO   |

### 1.1 RF-05 — Geração por IA: o risco mais alto

Esta é a funcionalidade diferenciadora do produto e, ao mesmo tempo, a mais frágil. Três fatores se combinam para criar um risco sistêmico:

- **Dependência externa não controlável:** timeout, rate limiting, instabilidade do provedor são eventos certos no tempo — apenas a frequência é incerta. O PRD os reconhece como riscos (seção 8) mas não define comportamento de fallback.
- **Contrato de resposta indefinido:** o requisito diz "extrair as subtarefas" sem definir o formato esperado. Fragilidade sobre texto livre que vai falhar de formas imprevisíveis e silenciosas — o usuário vê a lista e não aparece sem saber o motivo.
- **Ausência total de tratamento de erro:** nenhum critério de aceitação cobre o caminho de falha. Em produção, o primeiro timeout vai expor esse vazio.

> **Por que isso é risco de negócio, não só técnico:** O objetivo declarado no PRD é aumentar em 30% o percentual de usuários que criam pelo menos uma tarefa na primeira sessão. Se a geração por IA falhar silenciosamente nessa sessão, o usuário não vai criar a tarefa, a métrica vai cair e o time vai procurar o problema no lugar errado.

### 1.2 RF-06 — API Key: risco de segurança e conversão

A gestão da API Key tem dois perfis de risco distintos que precisam ser tratados separadamente:

- **Segurança:** armazenar a chave em localStorage sem criptografia ou ofuscação expõe o usuário a vazamento dos dados. Isso não é uma decisão de implementação — é uma decisão de produto que precisa constar no PRD.
- **Conversão:** Usuários sem chave própria de API não conseguem usar a feature principal. O PRD reconhece isso como risco de negócio, mas não define o que fazer para esse usuário. Pode render abandono do produto garantido.

### 1.3 Persistência: risco de confiança

RF-03 e RF-04 mencionam que mudanças de estado devem persistir, mas o documento nunca define o mecanismo. Sem autenticação (fora do escopo), persistência local é a única opção — mas "local" precisa de definição: qual storage, qual escopo (aba? browser? dispositivo?). Uma tarefa que some ao recarregar a página destrói a confiança do usuário.

---

## 2. Pirâmide de Testes

A pirâmide de testes para o Smart To-Do é orientada por dois princípios: testar o mais perto possível da origem, e manter a suíte de testes sustentável. Testes caros e lentos no topo só se justificam quando a base está sólida.

| Tipo           | O que cobre                                                                                           | Exemplos de casos                                                                        | Volume |
| -------------- | ----------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- | ------ |
| **Unitário**   | Lógica de parsing da resposta IA; validações de input; regras de negócio isoladas; formatação de UUID |                                                                                          | ~60%   |
| **Integração** | Comunicação com API do provedor IA; persistência de dados; criar, listar, atualizar, deletar          | POST /tasks + GET /tasks; chamada ao OpenRouter com mock de resposta                     | ~25%   |
| **Contrato**   | Contrato do endpoint de geração IA; endpoints CRUD de tarefas                                         | Pact consumer-driven: frontend define o contrato que o backend e o provedor devem honrar | ~10%   |
| **E2E**        | Fluxos críticos de negócio ponta a ponta no browser real                                              | Inserir objetivo → gerar tarefas → marcar concluída                                      | ~5%    |

### 2.1 Base: testes unitários (60%)

A maior parte da cobertura deve ser aqui — rápidos e sem dependências externas.

**Parsing da resposta da IA**

Este é o ponto mais crítico de toda a aplicação. A função que transforma a resposta do provedor em uma lista de subtarefas precisa ter cobertura com alto percentual:

- Resposta vazia (string vazia, array vazio, null)
- Resposta com formato inesperado (texto livre sem estrutura)
- Resposta truncada (timeout parcial)

**Validações de input**

- Título vazio ou só com espaços
- Título no limite máximo de caracteres
- Objetivo vazio antes de chamar a IA

### 2.2 Integração (25%)

Testes que verificam a colaboração entre módulos e com dependências reais.

**Integração com o provedor de IA**

Usar um mock serverque simula o provedor com diferentes comportamentos:

- Resposta normal com tarefas bem estruturadas
- Timeout
- Erro 401 (API Key inválida)
- Erro 500 do provedor

**Fluxos de persistência**

- Criar tarefa → recarregar página → tarefa ainda existe
- Marcar como concluída → recarregar → estado preservado
- Deletar tarefa → ela não reaparece após reload
- Criar tarefa em uma aba → verificar em outra aba do mesmo browser

### 2.3 Testes de Contrato (10%)

Para o Smart To-Do, o contrato mais crítico é entre o frontend e o provedor de IA. A abordagem que pode ser adotada écontract testing com Pact:

- O frontend define o contrato: "dado este prompt, espero um objeto com campo `tasks` contendo um array de strings"
- O contrato é verificado contra o provedor real em ambiente de staging antes de cada release
- Quebras de contrato bloqueiam o deploy

Essa camada é especialmente importante porque o provedor de IA pode mudar o formato de resposta sem aviso. O contrato captura essa mudança antes do parsing quebrar em produção.

### 2.4 E2E (5%)

Reservado para os fluxos mais críticos de negócio. Poucos, lentos, confiáveis — não um substituto para os testes anteriores citados.

- Fluxo completo de geração IA: inserir API Key → descrever objetivo → verificar tarefas geradas → recarregar → tarefas persistem
- Criação manual + conclusão + exclusão em sequência
- Comportamento em 375px de largura (critério de responsividade do PRD)
- Comportamento sem JavaScript (graceful degradation mínima)

---

## 3. Mudanças de Processo

A maioria dos problemas identificados neste PRD não são bugs — são decisões de produto que não foram tomadas. E que podemos criar as condições para que eles não precisem ser encontrados tardiamente.

### 3.1 Definition of Ready

Nenhuma história pode entrar em desenvolvimento sem responder explicitamente a estas perguntas:

- O caminho de erro está especificado, não apenas o caminho feliz?
- O comportamento de tela está definido? (campo vazio, input inválido, lista vazia)
- As dependências externas têm um comportamento de retorno definido?

### 3.2 QA na Refinement, não no Final de Sprint

O modelo atual implícito no PRD é: PM escreve → dev implementa → QA testa. Esse modelo garante que os problemas de especificação sejam encontrados no momento mais caro — depois que o código foi escrito.

A mudança é simples: QA participa do refinamento de backlog como revisor e avaliador se todas as possibilidades foram levantadas. Nesse momento não é para escrever cenários de teste, mas para fazer as perguntas que revelam as lacunas enquanto ainda custa zero para corrigir.

> **Exemplo prático com o RF-05:** Em um refinemento, o QA questiona: "O que acontece se a IA não responder em um determinado tempo?" Se não souberem responder, o item não entra no sprint. Essa pergunta evita o bug de timeout em produção — e custa pouco tempo de refinement.

### 3.3 Testes como Documentação Viva

Os testes precisam ser legíveis por não-desenvolvedores. A nomenclatura dos casos de teste deve seguir o padrão BDD:

```
dado [contexto]
quando [ação]
então [resultado esperado]
```

Exemplo: _"DADO um objetivo válido, QUANDO a API retorna timeout, ENTÃO exibe mensagem de erro"_

Isso serve a dois propósitos: o PM consegue validar que o comportamento especificado foi implementado; e quando o teste falha, o nome do teste já descreve o que está quebrado.

### 3.4 Decisões Técnicas que Precisam Sair do Limbo

Três decisões bloqueiam a escrita de casos de teste e precisam ser resolvidas antes do início do desenvolvimento:

- **Provedor de IA padrão (Q3 em aberto):** sem isso não é possível preparar mocks realistas, avaliar latência esperada ou definir o contrato de resposta.
- **Mecanismo de persistência:** localStorage? IndexedDB? Backend sem auth? Cada um tem implicações de teste completamente diferentes.
- **Formato de resposta esperado da IA:** definir o schema (`{ tasks: string[] }`) antes de escrever o parser — não depois.

### 3.5 Monitoramento como Extensão do QA

Para uma funcionalidade que depende de uma API externa, testes locais podem não ser suficientes. O comportamento em produção precisa ser observado:

- Taxa de sucesso e falha das chamadas ao provedor de IA
- Alertar quando a taxa de erro ultrapassar 5% em determinado tempo (definido pelo time)
- Medir o tempo de resposta médio e alertar para degradação (P95 > 8 segundos) - pode ser avaliado em testes de performance

Esses dados não são apenas operacionais — são insumo para a próxima iteração do produto, melhorias de infraestrutura também.

---
