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
  refresh falhar. `authGuard`/`roleGuard`/`ownershipGuard` protegem as rotas.
- **Rotas:** lazy loading via `loadComponent`, com rota `**` (404 → home).

## Plano Perfeito

Página `perfect-plain/:userId` (síntese dos 3 pilares, módulo único). O gatilho
"Gerar/Ver Plano Perfeito" fica no painel admin (`user-supply-details`), onde cada
pilar é um botão no padrão do dashboard que abre o respectivo form/gatilho em modal.

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
