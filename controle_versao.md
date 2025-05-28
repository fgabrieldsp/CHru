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
