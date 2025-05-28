# Mapa do Código — Calculadora de Manutenção e Reforma

## Componentes principais
- Cadastro de módulos: formulário para inserção/edição dos campos de cada módulo
- Cadastro de serviços: vinculados a cada módulo, pode ser automático ou manual
- Exportação/importação: botões para XML
- Tabela resumo: lista dinâmica de módulos e serviços
- Estrutura de dados JS: objetos, arrays, funções de CRUD
- Pontos de expansão: funções para integração com API REST (NocoDB), validações adicionais, relatórios

---

## Local da lógica de nomenclatura de exportação XML

A função responsável por gerar o nome do arquivo XML exportado está implementada em `script.js`, na função `exportarXML()`.  
Ela coleta automaticamente a quantidade de módulos, os tipos de serviço distintos presentes no orçamento (usando as abreviações padrão) e a data/hora da exportação para montar o nome do arquivo conforme o padrão aprovado na documentação.

> Em caso de atualização no padrão de nomenclatura, ajustar este comentário e a função correspondente no JS.
