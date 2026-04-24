# Bug Report

## **_[BUG-001] Status 500 ao tentar gerar tarefas quando informado qualquer valor como API Key_**

### Severidade: Alta

### Prioridade: P2

### Componente: Backend

### **Descrição**

Quando informado qualquer valor como API Key e tentamos gerar tarefas, o backend retorna um erro status 500.

### **Passos para Reproduzir**

1. Acesse a página inicial do to-do list
2. Preencha o campo API Key com qualquer valor
3. Informar o título/objetivo da tarefa
4. Clique no botão "Gerar Tarefas"

### **Resultado Esperado**

O retorno deve ser que a API Key é inválida/incorreta e que deve informar a chave correta

### **Resultado Obtido**

Quando informado qualquer valor como API Key, o backend retorna um erro status 500.

### **Evidência**

https://prnt.sc/DWqySO2SX6Qs

### **Sugestão de Correção**

Quando o usuário informar qualquer valor no campo da API Key deve retornar um erro informando que a API Key é inválida/incorreta e que deve informar a chave correta.

---

## **_[BUG-002] Botão "Gerar Tarefas" não é desabilitado quando API Key está vazia_**

### Severidade: Baixa

### Prioridade: P3 | P4

### Componente: Frontend | UI

### **Descrição**

O botão "Gerar Tarefas" não é desabilitado quando a API Key está vazia, permitindo que o usuário clique no botão, apesar que não há como gerar tarefas sem a API Key. Mas pode levar a uma experiência ruim para o usuário.

### **Passos para Reproduzir**

1. Acesse a página inicial do to-do list
2. Deixe o campo API Key vazio
3. Clique no botão "Gerar Tarefas"

### **Resultado Esperado**

O botão "Gerar Tarefas" deve estar desabilitado quando a API Key está vazia.

### **Resultado Obtido**

Quando não tem API Key preenchida, o botão "Gerar Tarefas" não é desabilitado, permitindo que o usuário clique nele.

### **Evidência**

https://prnt.sc/o4b5HFkH9gRa

### **Sugestão de Correção**

Deixar o botão "Gerar Tarefas" desabilitado quando não informar a API Key.

---

## **_[BUG-003] Botão "Gerar Tarefas" não é desabilitado quando título/objetivo está vazio_**

### Severidade: Baixa

### Prioridade: P3 | P4

### Componente: Frontend | UI

### **Descrição**

O botão "Gerar Tarefas" não é desabilitado quando o título/objetivo está vazio, permitindo que o usuário clique no botão, apesar que não há como gerar tarefas sem o título/objetivo. Mas pode levar a uma experiência ruim para o usuário.

### **Passos para Reproduzir**

1. Acesse a página inicial do to-do list
2. Deixe o campo do título/objetivo vazio
3. Clique no botão "Gerar Tarefas"

### **Resultado Esperado**

O botão "Gerar Tarefas" deve estar desabilitado quando o título/objetivo está vazio.

### **Resultado Obtido**

Quando não tem título/objetivo preenchido, o botão "Gerar Tarefas" não é desabilitado, permitindo que o usuário clique nele.

### **Evidência**

https://prnt.sc/o4b5HFkH9gRa

### **Sugestão de Correção**

Deixar o botão "Gerar Tarefas" desabilitado quando não informar o título/objetivo.

---

## **_[BUG-004] Botão "Adicionar" não é desabilitado quando o campo tarefa está vazio_**

### Severidade: Baixa

### Prioridade: P3 | P4

### Componente: Frontend | UI

### **Descrição**

O botão "Adicionar" não é desabilitado quando o campo adicionar tarefa está vazio, permitindo que o usuário clique no botão, apesar que não há como adicionar uma tarefa sem preencher o campo. Mas pode levar a uma experiência ruim para o usuário.

### **Passos para Reproduzir**

1. Acesse a página inicial do to-do list
2. Deixe o campo da tarefa vazio
3. Clique no botão "Adicionar"

### **Resultado Esperado**

O botão "Adicionar" deve estar desabilitado quando o campo tarefa está vazio.

### **Resultado Obtido**

Quando não tem tarefa preenchida, o botão "Adicionar" não é desabilitado, permitindo que o usuário clique nele.

### **Evidência**

https://prnt.sc/o4b5HFkH9gRa

### **Sugestão de Correção**

Deixar o botão "Adicionar" desabilitado quando não informar a tarefa.

---

## **_[BUG-005] Confirmação de exclusão de tarefa_**

### Severidade: Alta

### Prioridade: P2

### Componente: Frontend

### **Descrição**

Quando o usuário clica no botão de exclusão de uma tarefa, não há confirmação da ação, o que pode levar a exclusões acidentais.

### **Passos para Reproduzir**

1. Acesse a página inicial do to-do list
2. Criar uma nota tarefa ou possuir uma tarefa criada
3. Clique no botão de exclusão de uma tarefa

### **Resultado Esperado**

A exclusão da tarefa deve ser confirmada antes da ação ser executada. Assim o usuário tem certeza se realmente deseja excluir a tarefa.

### **Resultado Obtido**

Quando o usuário clica no botão de exclusão, a tarefa é excluída imediatamente sem confirmação.

### **Evidência**

https://prnt.sc/o4b5HFkH9gRa

### **Sugestão de Correção**

Adicionar um modal de confirmação antes de excluir a tarefa.

---

## **_[BUG-006] Limpeza do campo API Key após a geração das tarefas_**

### Severidade: Média

### Prioridade: P3

### Componente: Frontend

### **Descrição**

Após o usuário criar tarefa usando a API Key o campo não é "limpo".

### **Passos para Reproduzir**

1. Acesse a página inicial do to-do list
2. Informar o campo API Key com valor válido
3. Informar o título/objetivo
4. Clicar no botão "Gerar tarefas"

### **Resultado Esperado**

Após a inclusão das tarefas na lista usando a IA, o campo de API Key deve ser limpo, para que o usuário não possa reutilizá-lo.
E caso queira reutilizar a API Key, deve ser informada novamente.

### **Resultado Obtido**

O campo de API Key não é limpo após a inclusão das tarefas na lista.

### **Evidência**

https://prnt.sc/WTt-pHWqVi3M

### **Sugestão de Correção**

Adicionar lógica para limpar o campo de API Key após a inclusão das tarefas na lista.

---

## **_[BUG-007] O título/objetivo não é exibido ou utilizado_**

### Severidade: Baixa

### Prioridade: P4

### Componente: Frontend | Backend | API

### **Descrição**

O título/objetivo informado pelo usuário não é exibido ou utilizado na geração das tarefas.

### **Passos para Reproduzir**

1. Acesse a página inicial do to-do list
2. Informar o campo API Key com valor válido
3. Informar o título/objetivo
4. Clicar no botão "Gerar tarefas"

### **Resultado Esperado**

Após a inclusão das tarefas na lista usando a IA, o campo de título/objetivo não é exibido ou utilizado.

### **Resultado Obtido**

O campo de título/objetivo não exibido ou utilizado

### **Evidência**

https://prnt.sc/MBVxIrwcO-t4
https://prnt.sc/pfck5JPAf9dN

### **Sugestão de Correção**

Adicionar uma função/utilização para o título/objetivo informado pelo usuário.

---

## **_[BUG-008] É possivel criar uma tarefa sem informar o título_**

### Severidade: Crítica

### Prioridade: P1

### Componente: Backend | API

### **Descrição**

É possível criar uma tarefa sem informar o título diretamente pela API.

### **Passos para Reproduzir**

1. Acesse a página do swagger da api
2. Localize o POST de criação /tasks
3. Não informar o título, deixar ele em branco
4. Enviar a requisição

### **Resultado Esperado**

A API deve retornar um erro 400 (Bad Request) indicando que o título é obrigatório.

### **Resultado Obtido**

A API permite criar a tarefa sem título.

### **Evidência**

https://prnt.sc/-qe86tQq1Dp6

### **Sugestão de Correção**

Adicionar validação no backend para garantir que o título seja obrigatório na criação de uma tarefa.

---

## **_[BUG-008] Delete é realizado quando informado um id inválido_**

### Severidade: Alto

### Prioridade: P2

### Componente: Backend | API

### **Descrição**

É possível deletar uma tarefa informando um ID inválido diretamente pela API.

### **Passos para Reproduzir**

1. Acesse a página do swagger da api
2. Localize o DELETE de deleção /tasks/{id}
3. Informar um ID inválido
4. Enviar a requisição

### **Resultado Esperado**

A API deve retornar um erro 400 (Bad Request) indicando que o ID informado é inválido.

### **Resultado Obtido**

A API permite deletar a tarefa mesmo com ID inválido.

### **Evidência**

https://prnt.sc/8NKq3hFbTwXh

### **Sugestão de Correção**

Adicionar validação no backend para garantir que o ID informado seja válido na deleção de uma tarefa.

---

## **_[BUG-009] Delete é realizado quando informado um id inexistente_**

### Severidade: Alto

### Prioridade: P2

### Componente: Backend | API

### **Descrição**

É retornado 204 (No Content) quando informado um id de um registro que não existe.

### **Passos para Reproduzir**

1. Acesse a página do swagger da api
2. Localize o DELETE de deleção /tasks/{id}
3. Informar um ID de registro que não existe
4. Enviar a requisição

### **Resultado Esperado**

A API deve retornar um erro 404 (Not Found) indicando que o ID informado não existe registro vinculado

### **Resultado Obtido**

A API permite deletar a tarefa mesmo com ID inexistente.

### **Evidência**

https://prnt.sc/C8zqVcjGD8-1

### **Sugestão de Correção**

Adicionar validação no backend para garantir que o ID informado seja válido na deleção de uma tarefa.
Caso não encontre registro retornar erro informando que o registro não existe.

---
