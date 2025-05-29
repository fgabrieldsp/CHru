# Mapa do Código — Calculadora de Manutenção e Reforma

## Componentes principais
- Cadastro de módulos: formulário para inserção/edição dos campos de cada módulo (inclui quantidade de vagas, largura, comprimento, estado)
- Cadastro de serviços: vinculados a cada módulo, com checkboxes automáticos conforme o estado, valores dinâmicos e detalhamento via modal
- Margem de costura e observação: campos editáveis no modal de detalhamento, com cálculo automático de área útil e área total da tela
- Cadastro de peças extras: lista dinâmica por módulo
- Exportação/importação: botões para XML, incluindo todos os campos (serviços, peças extras, margem, observação)
- Tabela resumo: lista dinâmica de módulos, serviços habilitados e preços
- Estrutura de dados JS: objetos, arrays, funções de CRUD, cálculo de preço, atualização de área
- Padronização de exibição: serviços exibidos por nome, separados por vírgula
- Pontos de expansão: integração com API REST (NocoDB), validações adicionais, relatórios

---

## Local da lógica de nomenclatura de exportação XML

A função responsável por gerar o nome do arquivo XML exportado está implementada em `script.js`, na função `exportarXML()`.  
Ela coleta automaticamente a quantidade de módulos, os tipos de serviço distintos presentes no orçamento (usando as abreviações padrão) e a data/hora da exportação para montar o nome do arquivo conforme o padrão aprovado na documentação.

> Em caso de atualização no padrão de nomenclatura, ajustar este comentário e a função correspondente no JS.

---

## Incremento 29/05/2025 — Margem de costura, observação e padronização

- Modal de detalhamento de serviços agora inclui campos de margem de costura e observação, com cálculo automático de área útil e área total da tela.
- Exportação/importação XML sincronizadas com os novos campos.
- Exibição dos serviços na tabela padronizada (nomes separados por vírgula).
- Correção da importação do campo quantidade_vagas.
- Cada módulo (objeto JS) possui os campos `.servicos` (array de serviços), `.pecas_extras` (array de peças extras), `.margem_costura` e `.obs_costura`.
