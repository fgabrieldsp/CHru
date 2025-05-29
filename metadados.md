# Metadados — Calculadora de Manutenção e Reforma

Esta calculadora foi desenvolvida para estimativa, registro e acompanhamento de serviços de manutenção e reforma em estruturas metálicas já existentes, orientada por módulos e parametrizada por grau de dano e histórico.

- Persistência: XML local, com estrutura pronta para futura integração com banco relacional via API REST (ex: NocoDB).
- Foco: Simplicidade, flexibilidade, facilidade de uso e de backup/exportação.
- Campos essenciais: identificação, número de vagas, dimensões, estado, margem de costura, observações, serviços associados, peças extras.

<!--
  Incremento: Atualizado para refletir os campos e estrutura do index.html (29/05/2025).
  Referência: index.html, exportarXML/importarXML.
-->

## Campos do Módulo

| Campo                | Tipo    | Exemplo | Descrição                                      |
|----------------------|---------|---------|------------------------------------------------|
| id                   | int     | 1       | Identificador único do módulo                   |
| quantidade_vagas     | int     | 4       | Número de vagas do módulo                       |
| largura_m            | float   | 10      | Largura do módulo em metros                     |
| comprimento_m        | float   | 5       | Comprimento do módulo em metros                 |
| estado               | string  | Ruim    | Estado geral do módulo                          |
| margem_costura       | float   | 0.05    | Margem de costura por lado (em metros)          |
| obs_costura          | string  | ...     | Observação sobre costura/acabamento             |
| observacoes          | string  | ...     | Observações gerais                              |
| servicos             | array   | [...]   | Lista de serviços detalhados por módulo         |
| pecas_extras         | array   | [...]   | Lista de peças extras associadas ao módulo      |

## Estrutura XML

- Cada módulo possui seus próprios serviços detalhados e peças extras.
- Exportação/importação XML segue o padrão documentado e inclui margem de costura e observação.
- Modal de detalhamento permite edição granular dos serviços, peças extras e campos de costura.

---

## [Incremento 29/05/2025] — Margem de costura e observação

- Adicionados campos `margem_costura` e `obs_costura` ao detalhamento do módulo.
- Exportação/importação XML e interface sincronizadas com esses campos.

---

## [Incremento 28/05/2025] — Padrão de nomenclatura para exportação XML

Ao exportar o orçamento em XML, o nome do arquivo segue o padrão:

```
modX_TIPO1-TIPO2_YYYYMMDD-HHMM.xml
```

- **X**: número de módulos incluídos no orçamento.
- **TIPO1, TIPO2...**: abreviações dos tipos de serviço distintos presentes, separados por hífen.
- **YYYYMMDD-HHMM**: data/hora da exportação.

### Abreviações dos tipos de serviço

| Abreviação | Serviço               |
|------------|----------------------|
| LIX        | Lixamento            |
| PIN        | Pintura              |
| REF        | Reforço              |
| SOL        | Solda                |
| FAB        | Fabricação           |
| DES        | Desempeno            |
| TRA        | Tratamento químico   |
| MON        | Montagem             |
| DESM       | Desmontagem          |
| BAS        | Bases                |
| COS        | Costura/recostura    |
| TEL        | Tela nova            |
| CAB        | Troca de cabo        |

> O objetivo é que o nome do arquivo permita identificar rapidamente a magnitude, a natureza dos serviços e a data/hora do orçamento, sem abrir o arquivo.

---

## [Incremento 28/05/2025] — Detalhamento de Serviços por Módulo

Agora, cada módulo pode possuir uma lista de serviços detalhados (tratamentos, trocas, substituições) e adicionar peças extras.

### Serviços disponíveis por módulo

- Desmontagem
- Montagem
- Transporte
- Recuperação estrutural
- Lixamento
- Pintura
- Tratamento químico
- Troca de tela
- Troca de cabo
- Adição/substituição de pilares, braços, arcos e peças customizadas

Cada serviço pode ser habilitado por checkbox no cadastro/edição do módulo.

### Peças adicionais

- Cadastro por nome, quantidade e valor unitário.
- Peças extras podem ser adicionadas a cada módulo conforme necessidade.

### Cálculo do preço final

O preço final do módulo é a soma dos valores dos serviços marcados (com multiplicadores, se houver) e das peças extras cadastradas.

---

> **Rastro incremental:**  
> Adicionado detalhamento de serviços por módulo, peças extras, margem de costura e observação conforme instrução de 29/05/2025.
