# DnaProject

Frontend Angular 20 (standalone, zoneless, SSR) da plataforma DNA. Consome a
[DNA API](https://github.com/TheLastJedi00/dna-api).

## Arquitetura

- **Smart pages / dumb components:** páginas (`pages/*`) concentram estado e
  chamadas HTTP; componentes de `shared/` recebem dados prontos por `input()` e
  emitem por `output()`. Convenções em `.specs/global-strategy.md`.
- **Sessão:** `LoginService` é o dono único da sessão — guarda o par
  **access/refresh token**, valida expiração e coordena o refresh. O
  `authInterceptor` renova o token em 401 (fila compartilhada) e desloga se o
  refresh falhar. `authGuard`/`roleGuard`/`managerGuard`/`ownershipGuard`
  protegem as rotas.
- **Rotas:** lazy loading via `loadComponent`, com rota `**` (404 → home).

## Plano Perfeito

Página `perfect-plain/:userId` (síntese dos 3 pilares, módulo único). O gatilho
"Gerar/Ver Plano Perfeito" fica no painel admin (`user-supply-details`), onde cada
pilar é um botão no padrão do dashboard que abre o respectivo form/gatilho em modal.

## Gestão de Maestras (CRUD)

Rota `management/:type` (painel de gestora). A página é **smart**: mantém o estado
(lista, paginação, busca e filtro de status) e é a única a chamar o `UserService`;
`detailed-list`/`detailed-item` são **dumb** (recebem os dados prontos).

- **Busca** por nome (com debounce) e **filtro** Ativas / Inativas / Todas.
- **Paginação** via `UserService.listUsers` (metadados lidos dos headers `X-*`).
- Ações por Maestra no `user-details-modal`, condicionais ao status: **Editar** +
  **Desativar** (ativas) e **Reativar** (inativas). Desativar é soft delete.
- **Edição** reutiliza o `new-user-form` (modo edição: prefill + `updateUser`, sem
  os campos de acesso).
- `dashboard-button` aceita `icon` (SVG via `IconsSwitch`) além de `imgSrc`,
  mantendo retrocompatibilidade; no painel, Maestras usa o ícone `users` e as
  Análises do DNA o ícone `book`.

Layout **mobile-first**: listagem e modais empilham em coluna em telas pequenas.

Cada Maestra fica vinculada a quem a cadastrou, e o `user-details-modal` mostra
esse **Analista Responsável** (campo de leitura, resolvido pelo backend).

## Papéis e visibilidade

| Papel | Vê no painel | Alcance |
| --- | --- | --- |
| `ADMIN` | Maestras, Análises do DNA, Analistas | Super-usuário: vê **todas** as Maestras |
| `MANAGER` | Maestras, Análises do DNA, Analistas | Só as Maestras que **ele** cadastrou |
| `ANALYST` | Maestras, Análises do DNA | Só as Maestras que **ele** cadastrou; não acessa `/analysts` |
| `USER` | Seus 3 pilares + Plano Perfeito | Só os próprios dados |

O `roleGuard` libera a gestão de Maestras para ADMIN, MANAGER e ANALYST; o
`managerGuard` restringe `/analysts` a ADMIN e MANAGER (espelha o
`@Role(ADMIN, MANAGER)` do backend). Os guards são conveniência de navegação — a
visibilidade e a posse de cada Maestra são impostas pela API.

## Gestão de Analistas (CRUD)

Rota `/analysts` (ADMIN e MANAGER). Mesma anatomia do CRUD de Maestras: a page
`analysts-management` é **smart** (estado em signals e única a chamar o
`AnalystService`); `analyst-list`/`analyst-item`, `analyst-form` e
`analyst-details-modal` são **dumb** — o form emite o valor e a page é quem faz o
POST/PATCH.

- **Busca** por nome (com debounce), **filtro** Ativos / Inativos / Todos e
  **paginação** (metadados nos headers `X-*`).
- **Criar** pede nome + credenciais; **editar** altera só o nome (e-mail e senha
  vivem no documento `auth`). **Desativar** é soft delete; **Reativar** restaura.
- **Supervisão:** o detalhe do Analista lista as **Maestras Vinculadas** — apenas
  nome e status, **sem ação e sem link** para o detalhe. O Manager acompanha a
  carteira do Analista, mas não acessa os dados pessoais das clientes dele (a API
  nem devolve o `id` dessas Maestras).

## Ambientes

`src/environments/`: `environment.ts` (prod), `environment.development.ts` (dev)
e `environment.local.ts` (localhost). Cada um define `apiUrl`.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
