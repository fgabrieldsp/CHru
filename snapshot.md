# Snapshot do Ecossistema — 28/05/2025

## index.html
- Interface principal da calculadora.
- Campos do módulo: `quantidade_vagas`, `largura_m`, `comprimento_m`, `estado`, `bases_comprometidas`, `pecas_removidas`, `observacoes`.
- Funções de exportação/importação XML sincronizadas com os metadados.
- Visual moderno e responsivo.

## metadados.xml
- Estrutura:
  - `<calculadora>`
    - `<modulos>`
      - `<modulo>` com todos os campos usados no sistema.
    - `<servicos>`
      - `<servico>` prevendo integração futura de serviços por módulo.
- Exemplo de dados para referência e integração.
- Alinhado com o padrão do index.html.

## metadados.md
- Documentação dos campos do módulo, tipos, exemplos e descrições.
- Alinhado com o que está implementado no index.html e metadados.xml.

## controle_versao.md
- Histórico de incrementos, incluindo o alinhamento do ecossistema com o padrão do index.html.
- Rastro de alterações para facilitar comunicação entre humanos e IAs.

---

**Observações:**
- O ecossistema está sincronizado: campos, lógica e documentação refletem o mesmo padrão.
- O arquivo `metadados.xml` já prevê expansão para serviços, mesmo que ainda não estejam implementados na interface principal.
- Comentários e rastros de incrementos presentes para facilitar a comunicação e rastreabilidade.

---

**Padrão vigente para nome de arquivos XML exportados:**  
`modX_TIPO1-TIPO2_YYYYMMDD-HHMM.xml`  
(Ver `metadados.md` para detalhes e abreviações dos serviços.)

---

**Status de versionamento:**  
- Projeto sincronizado com Git.  
- Todos os arquivos sob controle de versão para rastreabilidade e colaboração.


