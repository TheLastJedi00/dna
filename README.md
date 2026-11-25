# Matriz DNA (front)

Frontend Angular 20 (standalone, zoneless, SSR) da Matriz DNA. Consome a
[DNA API](https://github.com/TheLastJedi00/dna-api).

## Arquitetura

- **Smart pages / dumb components:** páginas (`pages/*`) concentram estado e
  chamadas HTTP; componentes de `shared/` recebem dados prontos por `input()` e
  emitem por `output()`. Convenções em `.specs/global-strategy.md`.
- **Sessão (Firebase Auth, spec 010):** o login é feito pelo SDK web do Firebase.
  `FirebaseAuthClient` é o único ponto que fala com o SDK (carregado **sob demanda**,
  fora do bundle inicial; não roda no SSR). `LoginService` é o dono da sessão: signals
  do usuário, das roles (custom claim `roles`) e do e-mail confirmado. O
  `authInterceptor` manda o **ID token** do Firebase e, num 401, tenta uma vez com o
  token renovado antes de deslogar. `authGuard`/`roleGuard`/`managerGuard`/
  `ownershipGuard`/`emailVerifiedGuard` esperam a sessão ser restaurada
  (`whenReady()`) antes de decidir.
- **Rotas:** lazy loading via `loadComponent`, com rota `**` (404 → home).

## Sistema visual

`src/styles.scss` é a única folha global e concentra os **tokens** usados por
todo o app. Ao estilizar qualquer coisa nova, partir daqui em vez de inventar
valores locais.

**Cor** — variáveis em `:root`, todas escolhidas para passar WCAG 2.1 AA no uso
a que se destinam (4.5:1 texto, 3:1 elemento não-textual):

| Token | Papel |
|---|---|
| `--color-primary` / `--color-secondary` | marca |
| `--color-text` | texto padrão |
| `--color-text-muted` | texto secundário — **use no lugar de `opacity` ou `text-black/50`**, que derrubam o contraste junto com a ênfase (classe `.text-muted`) |
| `--color-danger` | erros e ações destrutivas — **use no lugar de `red` puro**, que só dá 4:1 (classes `.text-danger`, `.bg-danger`, `.bg-danger-soft`) |
| `--color-border` | bordas de campo |
| `--color-surface-muted` / `--color-surface-disabled` | fundo de campo e de campo desabilitado |

**Espaçamento de controle** — `--control-padding-y/x`, `--control-radius` e
`--control-min-height` (44px, alvo de toque no mobile). Input, select e as três
variantes de `app-button` compartilham esses valores, então ficam com a mesma
altura quando lado a lado.

**Campos** — há **um só** estilo de `input`/`select`, na regra global. Não criar
classes de campo por tela.

**Botões** — `app-button` (`elevated`/`flat`/`text`) para texto puro;
`app-icon-text-button` para ícone + texto. Neste último, CTA de largura total
pede `align="center"`, e botão sem texto (`text=""`) vira alvo quadrado de 44px
e exige `ariaLabel`.

**Controle segmentado** — `.segmented` + `.segment` (com `.is-selected`) para
filtros de status e toggles binários.

**Foco** — `:focus-visible` global; não anular `outline` sem repor um indicador.

**Mobile-first** — usar `w-full` e `min-h-dvh`, nunca `w-screen`/`100vw` (inclui
a barra de rolagem e gera scroll horizontal) nem `h-screen` (não acompanha a
barra de endereço no mobile). Padding deve crescer com o breakpoint, nunca
diminuir.

## Carregamento e erros

Duas formas de "carregando", cada uma com seu papel:

| Situação | O que aparece | Onde |
|---|---|---|
| **Leitura** (listas, detalhes, perfil, pilares) | Skeleton no formato do conteúdo | `shared/feedback/skeleton*`, `pillar-load` |
| **Ação** (salvar, login, gerar com IA, desativar/reativar) | Overlay de tela cheia | `shared/loading/infinity` |

**Estado de leitura** — `core/utils/load-state.ts`: `loadState(() => service.x())` devolve
signals `status` (`idle`/`loading`/`success`/`empty`/`error`), `data`, `error` e `load()`.
`emptyOn404` trata "ainda não cadastrado" como **vazio**, não como falha. `combineLoad`
junta leituras da mesma tela (um skeleton, um erro, um "Tentar novamente").

**Erros** — `core/utils/http-error-message.ts` traduz o status em frase clara (sem
conexão, sessão expirada, sem permissão, não encontrado, instabilidade).

- Leitura (`GET`): erro **inline** no lugar do skeleton (`app-load-error`), com
  "Tentar novamente". **Não** abre o modal global.
- Ação (`POST`/`PATCH`/`PUT`/`DELETE`): modal global; 4xx mostra a mensagem do backend,
  rede/5xx mostram a frase traduzida.
- Para forçar o contrário numa requisição: `HttpContext` com `SHOW_ERROR_MODAL`.

**Usuário logado** — `CurrentUserService` busca `/users/me/:id` uma vez por sessão e
abastece o menu lateral e o dashboard. Sem perfil em `users` (Manager → 404), o nome
exibido é o e-mail do token. O cache é limpo quando a sessão encerra.

## Formulário de Desenho Humano

Três campos são `select` (as opções vivem em
`core/models/human-design.constants.ts`, espelhando o `@IsIn` da API) e cinco são
derivados deles — ficam `readonly` no formulário, mas continuam sendo enviados:

| Escolha | Preenche |
| --- | --- |
| **Tipo Áurico** — Geradora · Geradora Manifestante · Projetora · Manifestadora · Refletora | Aura, Energia, Palavra Chave, Estratégia |
| **Ângulo** — Ângulo Direito · Ângulo Esquerdo · Justa Posição | Grupo de Destino (Pessoal · Transpessoal · Justa Posição) |
| **Quarto de Cruz** — Quarto 1 a 4 (Iniciação · Civilização · Dualidade · Mutação) | — |

Mapeamento do Tipo Áurico:

| Tipo | Aura | Energia | Palavra | Estratégia |
| --- | --- | --- | --- | --- |
| Geradora / Geradora Manifestante | Aberta e Envolvente | Gera Energia | Construtora | Responder à Vida |
| Projetora | Focalizada e Absorvente | Não Energético | Guia | Aguardar os Convites |
| Manifestadora | Fechada e Repelente | Inicia Energia | Guia | Informar Antes de Agir |
| Refletora | Que Tira Amostras | Não Energético | Discernidora | Aguardar o Ciclo Lunar |

## Edição dos dados de DNA

Os três formulários de pilar (`human-design`, `numerology`, `astrology`) mostram os
dados em leitura depois de preenchidos. O botão **Editar dados** repõe o
formulário com os valores atuais (`PillarFormBase.startEdit()` → `prefillForm()` de
cada form) e o submit passa a chamar o `PATCH` do pilar em vez do `POST`; **Cancelar**
sai sem salvar.

Salva a edição, um banner avisa que o conteúdo já gerado pode estar desatualizado e
oferece **Regenerar conteúdo** (o mesmo `createAllSupply()` de sempre). O aviso é
**efêmero**: vive num signal, vale para a sessão em que a edição aconteceu e some
quando o conteúdo é regerado — não é persistido.

## Plano Perfeito

Página `perfect-plain/:userId` (síntese dos 3 pilares, módulo único). O gatilho
"Gerar/Ver Plano Perfeito" fica no painel admin (`user-supply-details`), onde cada
pilar é um botão no padrão do dashboard que abre o respectivo form/gatilho em modal.

## Gestão de usuários (CRUD)

Rota `management/users` (o endereço antigo `management/maestras` redireciona). A página
é **smart**: mantém o estado (lista, paginação, busca e filtro de status) e é a única a
chamar o `UserService`; `detailed-list`/`detailed-item` são **dumb**.

- **Busca** por nome (com debounce) e **filtro** Ativas / Inativas / Todas.
- **Paginação** via `UserService.listUsers` (metadados lidos dos headers `X-*`).
- Ações por usuário no `user-details-modal`, condicionais ao status: **Editar** +
  **Desativar** (ativos) e **Reativar** (inativos). Desativar é soft delete.
- **Cadastro por convite:** o form pede o **e-mail de acesso, sem senha**. Depois do
  `POST /users`, o `InviteService` dispara o e-mail "Defina sua senha" do Firebase e
  confirma num toast. O detalhe mostra o **status do acesso** (Convite pendente / E-mail
  não confirmado / Acesso ativo) e o botão **"Reenviar convite"**.
- **Área de atuação** (texto livre) e **pronome de tratamento** (toggle
  Feminino/Masculino). O pronome flexiona os termos da interface — "Usuária/Usuário",
  "Nova usuária/Novo usuário", "a usuária/o usuário" — via `core/utils/pronoun.ts`, e
  vai para a API, que o usa no material gerado. Sem pronome, assume feminino.
- Quem cadastrou aparece como **Analista Responsável**; se essa conta foi excluída,
  aparece **"Conta removida"**.

Layout **mobile-first**: listagem e modais empilham em coluna em telas pequenas.

## Papéis e visibilidade

| Papel | Vê no painel | Alcance |
| --- | --- | --- |
| `ADMIN` | Usuários, Análises do DNA, Analistas, Meu perfil | Super-usuário: vê **todos** os usuários |
| `MANAGER` | Usuários, Análises do DNA, Analistas, Meu perfil | Só os usuários que **ele** cadastrou |
| `ANALYST` | Usuários, Análises do DNA, Meu perfil | Só os usuários que **ele** cadastrou; não acessa `/analysts` |
| `USER` | Seus 3 pilares + Plano Perfeito, Meu perfil | Só os próprios dados |

O `roleGuard` libera a gestão de usuários para ADMIN, MANAGER e ANALYST; o
`managerGuard` restringe `/analysts` a ADMIN e MANAGER (espelha o
`@Role(ADMIN, MANAGER)` do backend). Os guards são conveniência de navegação — a
visibilidade e a posse de cada usuário são impostas pela API.

## Acesso: convite, verificação de e-mail e Meu perfil (spec 010)

- **Login** pelo Firebase, com mensagens em PT-BR por código de erro
  (`core/utils/firebase-auth-error.ts`). Credencial errada é sempre "E-mail ou senha
  incorretos." **"Esqueci minha senha"** envia o link do Firebase e responde igual para
  qualquer e-mail (não revela quem tem conta).
- **Verificação de e-mail:** enquanto o e-mail não for confirmado, o dashboard mostra
  um **popup que não fecha** (`verify-email-modal`): enviar/reenviar (60s entre envios),
  "Já confirmei" (recarrega o usuário e renova o token), "Corrigir e-mail" e "Sair". O
  `emailVerifiedGuard` devolve ao dashboard qualquer outra rota, menos `/profile`. Um 403
  `EMAIL_NOT_VERIFIED` da API reabre o popup.
- **Meu perfil** (`/profile`, todas as roles, aberto mesmo sem e-mail confirmado):
  alterar senha (senha atual + nova), alterar e-mail (o Firebase só troca depois do link
  no novo endereço) e **excluir a conta** (LGPD: senha + "EXCLUIR" → `DELETE /users/me`,
  logout e aviso na entrada).
- A senha provisória da spec 005 (`/change-password`, `passwordGuard`,
  `temp-password-form`) **não existe mais**.

## Gestão de Analistas (CRUD)

Rota `/analysts` (ADMIN e MANAGER). Mesma anatomia do CRUD de usuários: a page
`analysts-management` é **smart** (estado em signals e única a chamar o
`AnalystService`); `analyst-list`/`analyst-item`, `analyst-form` e
`analyst-details-modal` são **dumb** — o form emite o valor e a page é quem faz o
POST/PATCH.

- **Busca** por nome (com debounce), **filtro** Ativos / Inativos / Todos e
  **paginação** (metadados nos headers `X-*`).
- **Criar** pede nome + e-mail (convite, sem senha); **editar** altera só o nome
  (e-mail e senha vivem no Firebase Auth). **Desativar** é soft delete; **Reativar**
  restaura. O detalhe tem o mesmo bloco de status do acesso e "Reenviar convite".
- **Supervisão:** o detalhe do Analista lista os **usuários vinculados** — apenas
  nome e status, **sem ação e sem link** para o detalhe. O Manager acompanha a
  carteira do Analista, mas não acessa os dados pessoais dos clientes dele (a API
  nem devolve o `id` desses usuários).

## Ambientes

`src/environments/`: cada um define `apiUrl` e a config do **app Web do Firebase**
(não é segredo: vai no bundle do navegador).

| Arquivo | API | Projeto Firebase |
| --- | --- | --- |
| `environment.ts` (produção) | `dna-api-iota.vercel.app` | `dna-empresaria-6c142` |
| `environment.development.ts` | `dev-dna-api.vercel.app` | `dna-empresaria-dev` |
| `environment.local.ts` (`ng serve -c local`) | `localhost:3000` | `dna-empresaria-dev` |

No console do Firebase de cada projeto: provedor E-mail/senha ativo, domínios
autorizados (`localhost` e o domínio do front) e templates de e-mail em português.

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
