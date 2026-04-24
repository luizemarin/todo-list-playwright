# Testes E2E

Testes end-to-end do app Todo List usando [Playwright](https://playwright.dev/) com o padrão Page Object Model.

## Estrutura

```
e2e/
├── pages/              # Page Object Models
│   ├── TaskListPage.ts
│   ├── TaskFormPage.ts
│   └── AiGeneratorPage.ts
├── fixtures/           # Fixtures de teste
│   └── tasks.fixture.ts
└── tests/              # Arquivos de teste
    ├── task-creation.spec.ts
    ├── task-completion.spec.ts
    ├── task-deletion.spec.ts
    ├── empty-state.spec.ts
    └── error-handling.spec.ts
```

## Pré-requisitos

- Node.js instalado
- App rodando em `http://localhost:3000`

## Instalação

```bash
npm install
npx playwright install
```

## Executando Testes

```bash
npm test                 # Rodar todos os testes (headless)
npm run test:headed      # Rodar com navegador visível
npm run test:ui          # Abrir modo UI do Playwright
npm run test:debug       # Modo debug
npm run test:chromium    # Rodar só no Chromium
npm run test:firefox     # Rodar só no Firefox
```

## Cobertura de Testes

| Funcionalidade       | O que é testado                            |
| -------------------- | ------------------------------------------ |
| Criação de Tarefas   | Títulos válidos/inválidos, casos de borda  |
| Conclusão de Tarefas | Alternar estado, persistência, feedback UI |
| Exclusão de Tarefas  | Remover tarefas, verificar remoção         |
| Estado Vazio         | UI quando não há tarefas                   |
| Tratamento de Erros  | Falhas de API, erros de rede               |

## Page Objects

- **TaskListPage** – Interações com lista (alternar, excluir, verificar)
- **TaskFormPage** – Criar tarefas (preencher, enviar)
- **AiGeneratorPage** – Geração de tarefas com IA

## Fixtures

`tasks.fixture.ts` fornece page objects pré-inicializados para os testes.
