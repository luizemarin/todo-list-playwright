# Review requisitos

# Requisitos que avalio serem problemas "_Criticos_".

## **_[PRD-001] Nenhum tratamento de erro está especificado para falhas de IA_**

### Requisito afetado: RF-03 e RF-04

**Problema identificado**
Os requisitos RF-03 e RF-04 mencionam a persistência, mas não define/informa onde os dados são armazenados.
Sem autenticação o dado é salvo localmente? Banco de dados? Por quanto tempo?

**Por que isso é um risco**
Se o usuário abrir outro browser ele perde tudo?

**Sugestão de melhoria**
Criar um critério de aceite e reescrever o requisito para que valide onde deve ser salvo os dados e por quanto tempo.

---

## **_[PRD-002] Nenhum tratamento de erro está especificado para falhas de IA_**

### Requisito afetado: RF-05

**Problema identificado**
O RF-05 descreve apenas o "caminho feliz" da geração de tarefas por IA, sem mencionar o que deve acontecer quando algo da errado durante o processo.
Ex: timeout da API, erro de conexão, chave inválida, retorno vazio, erro 429, erro 500.

**Por que isso é um risco**
O usuário digita o objetivo, clica em "Gerar tarefas" e nada acontece. Ele não sabe se está funcionando, se deu erro ou se precisa esperar mais.

**Sugestão de melhoria**
Reescrever o requisito para incluir tratamento de erros, possiveis falhas, mensagens de validações e feedback ao usuário.

---

## **_[PRD-003] Sem definição de formato de resposta esperado pela IA_**

### Requisito afetado: RF-05

**Problema identificado**
O requisito diz apenas "processar a resposta recebida" sem especificar o formato esperado pela aplicação. JSON? Lista?
Quantas tarefas no minimo/máximo

**Por que isso é um risco**
Isso é citado mas o requisito não define claramente como resolver o problema de forma robusta, apenas documenta o problema

**Sugestão de melhoria**
Definir claramente o formato de resposta esperado pela aplicação (contrato de dados).

---

## **_[PRD-004] Armazenamento e segurança da API KEY omitido_**

### Requisito afetado: RF-06

**Problema identificado**
O RF-06 diz "o usuário fornece a chave em um campo". Não especifica onde é salvo, localStorage? SessionStorage?, se é
mascarada apenas no campo (type=password), se é enviado para o backend. Ou usada apenas no frontend.

**Por que isso é um risco**
A chave de API é um dado sensível que deve ser tratado com cuidado. Se não for especificado onde e como é armazenada, pode haver vazamento de dados, uso indevido da chave, entre outros pontos relacionados a segurança de dados (LGPD).

**Sugestão de melhoria**
Especificar onde e como a chave de API é armazenada, se é mascarada no campo (type=password), se é enviado para o backend ou usada apenas no frontend.

# Requisitos que avalio serem problemas "_Altos_".

## **_[PRD-001] Nenhum tratamento de erro está especificado para falhas de IA_**

### Requisito afetado: RF-01

**Problema identificado**
O RF-01 menciona a listagem das tarefas, mas a ordenação não é definida. Mais recentes primeiro? Ordem alfabética? Ordem de criação?
Concluidas vão para o final da lista?

**Por que isso é um risco**
No dia a dia do usuário sem uma ordenação clara, ele pode ter dificuldade para encontrar as tarefas mais importantes ou as mais antigas.

**Sugestão de melhoria**
Ajustar o RF-01 para definir a ordenação das tarefas (se será ajustada pelo usuário ou sempre será uma "_default_").

---

## **_[PRD-002] Sem validação dos campo de geração de tarefas_**

### Requisito afetado: RF-02

**Problema identificado**
O requisito não especifica valor minimo/máximo, se campo permite ser vazio, se permite apenas letras, números, etc.

**Por que isso é um risco**
Isso pode levar a comportamentos inesperados, sem uma definição clara do que é aceito como entrada.

**Sugestão de melhoria**
Definir melhor os valores de entrada para o campo de geração de tarefas, especificando tamanho mínimo/máximo, se permite ser vazio, se permite apenas letras, números, etc.

---

## **_[PRD-003] Exclusão de tarefas sem confirmação_**

### Requisito afetado: RF-04

**Problema identificado**
O RF não especifica se há confirmação antes da exclusão da tarefa.

**Por que isso é um risco**
Isso pode levar o usuário excluir uma tarefa acidentalmente.

**Sugestão de melhoria**
Definir um requisito para exibir uma modal de confirmação de exclusão para usuário, perguntando se ele deseja realmente excluir a tarefa.

---

## **_[PRD-004] Inclusão de tarefas "duplicadas"_**

### Requisito afetado: RF-02

**Problema identificado**
O RF não define se é permitido ou não criar tarefas "duplicadas", exemplo: Levantar cedo.

**Por que isso é um risco**
O desenvolvedor pode interpretar que é permitido, o QA não tem critério para definir se isso é um bug ou melhoria e o usuário pode achar que
não deve permitir.

**Sugestão de melhoria**
Definir no RF-02 se é permitido ou não criar tarefas "duplicadas".

---

# Requisitos que avalio serem problemas "_Baixo_".

## **_[PRD-001] Feedback visual ao concluir tarefa_**

### Requisito afetado: RF-03

**Problema identificado**
O RF menciona que o "feedback visual" deve ser exibido ao marcar uma tarefa como concluída, mas não especifica qual é esse feedback.

**Por que isso é um risco**
O CEO pode pensar uma forma de feedback, o PO outra, UX/UI outra e o desenvolvedor outra. Isso pode gerar inconsistências na experiência do usuário.

**Sugestão de melhoria**
Ajustar o RF-03 para definir o feedback visual a ser exibido ao marcar uma tarefa como concluída.

---

## **_[PRD-002] Provedor de IA padrão em aberto_**

### Requisito afetado: RF-03

**Problema identificado**
Sem saber o provedor de IA padrão, pode haver confusão sobre qual serviço será utilizado para gerar as tarefas.

**Por que isso é um risco**
Cada pessoa do time pode usar um provedor de "seu gosto pessoal" e isso pode causar inconsistencias de resultado de testes do QA.
O QA não consegue montar cenários de testes de integração.

**Sugestão de melhoria**
Definir o provedor de IA padrão a ser utilizado para gerar as tarefas. Assim o QA consegue montar cenários de testes de integração.

---
