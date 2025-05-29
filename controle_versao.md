# Controle de Versão — Calculadora de Manutenção e Reforma

## v1.0 — 2025-05-28
- Estruturação completa dos arquivos do ecossistema do projeto.
- Criação das tabelas de módulos e serviços, campos e lógica inicial em XML.
- Implementação do fluxo para exportação/importação XML.
- Projeto pronto para expansão com banco de dados (NocoDB).

<!--
  Incremento: Registro de atualização do ecossistema para alinhar com index.html (28/05/2025).
-->

### [28/05/2025] Alinhamento do ecossistema com index.html

- Atualizados os arquivos `metadados.xml` e `metadados.md` para refletir os campos e estrutura do index.html.
- Todos os campos do formulário, exportação e importação XML estão sincronizados.
- Comentários de rastreio adicionados para facilitar comunicação entre humanos e IAs.

---

### [28/05/2025] Implementação do padrão de nomenclatura nos arquivos XML exportados

- Adotado padrão de nome: modX_TIPO1-TIPO2_YYYYMMDD-HHMM.xml, onde X é a quantidade de módulos, TIPO1/2 são abreviações dos tipos de serviço presentes, e a data/hora da exportação.
- Justificativa: facilitar consulta visual, evitar sobrescrita acidental, acelerar busca e rastreabilidade de orçamentos antigos.
- Refletido nos metadados e snapshot. Próxima etapa: implementação da lógica no JS.

---

### [28/05/2025] Sincronização do projeto com o Git

- Projeto inicializado e versionado com Git.
- Todos os arquivos do ecossistema agora sob controle de versão.
- Pronto para colaboração, rastreabilidade e integração com repositórios remotos.

---

### [28/05/2025] Incremento — Detalhamento de Serviços por Módulo

- Implementada a função `detalharServicosModulo(idx)` para abrir painel/modal de detalhamento de serviços do módulo.
- Cada módulo (objeto JS) agora possui os campos `.servicos` (array de serviços) e `.pecas_extras` (array de peças extras).
- Renderização da tabela atualizada para indicar se há serviços detalhados e mostrar um resumo rápido desses serviços e peças extras.

---

### [29/05/2025] Incremento — Sincronização e aprimoramento da interface e lógica

- **index.html**: Formulário de cadastro revisado, tabela dinâmica de módulos, modal de detalhamento de serviços e peças extras, integração dos botões de exportação/importação XML.
- **style.css**: Melhorias visuais, responsividade, estilos para novos componentes, modal, botões e tabela.
- **script.js**: Lógica de cadastro, detalhamento, renderização, exportação/importação XML, integração total com a interface, manipulação de serviços e peças extras.
- Todos os componentes agora refletem o estado mais recente do projeto, com fluxo completo e funcional.

---

### [29/05/2025] Incremento — Margem de costura, observação e padronização

- Adicionados campos `margem_costura` e `obs_costura` ao detalhamento do módulo e exportação/importação XML.
- Corrigida a importação do campo quantidade_vagas.
- Padronizada a exibição dos serviços na tabela de módulos.
- Sincronização global dos arquivos de inteligência (metadados, snapshot, controle).