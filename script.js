let modulos = [];

const SERVICOS_PADRAO = [
  { tipo: "desmontagem", nome: "Desmontagem", valor: 0 },
  { tipo: "montagem", nome: "Montagem", valor: 0 },
  { tipo: "transporte", nome: "Transporte", valor: 0 },
  { tipo: "recuperacao", nome: "Recuperação estrutural", valor: 0 },
  { tipo: "lixamento", nome: "Lixamento", valor: 0 },
  { tipo: "pintura", nome: "Pintura", valor: 0 },
  { tipo: "tratamento", nome: "Tratamento físico/químico", valor: 0 },
  { tipo: "tela", nome: "Tela (m²)", valor: 0 },
  { tipo: "cabo", nome: "Troca de cabo de aço", valor: 0 }
];

const SERVICOS_VALORES_BASE = {
  desmontagem: 200,
  montagem: 200,
  transporte: 25,
  recuperacao: 500,
  lixamento: 8,
  pintura: 10,
  tratamento: 4,
  tela: 60,
  cabo: 36
};

const MULTIPLICADOR_ESTADO = {
  "Ruim": 1,
  "Muito Ruim": 1.50,
  "Condição Crítica": 1.90
};

const SERVICOS_AREA = ["lixamento", "pintura", "tratamento", "tela"];

// Ordem dos serviços deve seguir a lista fornecida:
// 0: Desmontagem, 1: Montagem, 2: Lixamento, 3: Primer, 4: PU, 5: Solda, 6: Desempeno, 7: Troca de peças, 8: Complementos
const CHECKBOX_SUGERIDOS = {
  "Ruim":        [0,1,2,3,4],          // Desmontagem, Montagem, Lixamento, Primer, PU
  "Muito Ruim":  [0,1,2,3,4,5,6],     // + Solda, Desempeno
  "Condição Crítica": [0,1,2,3,4,5,6,7,8], // + Troca de peças, Complementos
};

// Novo módulo padrão, SEM campos antigos
function novoModuloPadrao(formVals = {}) {
  const estado = formVals.estado || "Ruim";
  const mult = MULTIPLICADOR_ESTADO[estado] || 1;
  const area = (Number(formVals.largura_m) || 10) * (Number(formVals.comprimento_m) || 5);
  const indicesSugeridos = CHECKBOX_SUGERIDOS[estado] || [];
  return {
    quantidade_vagas: Number(formVals.quantidade_vagas) || 4,
    largura_m: Number(formVals.largura_m) || 10,
    comprimento_m: Number(formVals.comprimento_m) || 5,
    estado,
    observacoes: formVals.observacoes || "",
    servicos: SERVICOS_PADRAO.map((s, idx) => {
      let valorBase = SERVICOS_VALORES_BASE[s.tipo] || 0;
      let valor = SERVICOS_AREA.includes(s.tipo)
        ? valorBase * area * mult
        : valorBase * mult;
      valor = Math.round(valor * 100) / 100;
      return {
        ...s,
        habilitado: indicesSugeridos.includes(idx),
        valor_base: valor,
        valor: valor
      };
    }),
    pecas_extras: []
  };
}

// Cadastro de módulos — agora correto!
document.getElementById('moduloForm').onsubmit = function(e) {
  e.preventDefault();
  const f = e.target;
  modulos.push(novoModuloPadrao({
    quantidade_vagas: f.quantidade_vagas.value,
    largura_m: f.largura_m.value,
    comprimento_m: f.comprimento_m.value,
    estado: f.estado.value,
    observacoes: "" // Pode adicionar campo se quiser
  }));
  renderizarTabelaModulos();
  f.reset();
  f.quantidade_vagas.value = 4;
  f.largura_m.value = 10;
  f.comprimento_m.value = 5;
};

// Renderização da tabela
function renderizarTabelaModulos() {
  const tbody = document.getElementById('modulosTable');
  tbody.innerHTML = '';
  modulos.forEach((mod, idx) => {
    const precoTotal = calcularPrecoModulo(mod);
    // Padroniza exibição dos serviços habilitados
    let servicosStr = '-';
    if (mod.servicos && mod.servicos.filter(s => s.habilitado).length) {
      servicosStr = mod.servicos
        .filter(s => s.habilitado)
        .map(s => s.nome)
        .join(', ');
    }
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td class="actions-cell">
        <button class="icon-btn" title="Detalhar Serviços" onclick="abrirModalServicos(${idx})">🛠️</button>
        <button class="icon-btn remove" title="Remover" onclick="removerModulo(${idx})">🗑️</button>
      </td>
      <td>${idx + 1}</td>
      <td>${mod.quantidade_vagas}</td>
      <td>${mod.largura_m}</td>
      <td>${mod.comprimento_m}</td>
      <td>${mod.estado}</td>
      <td>${mod.observacoes || ''}</td>
      <td>${servicosStr}</td>
      <td>R$ ${precoTotal.toFixed(2)}</td>
    `;
    tbody.appendChild(tr);
  });
}

// Cálculo do preço total de um módulo
function calcularPrecoModulo(m) {
  const precoServicos = m.servicos
    ? m.servicos.filter(s => s.habilitado).reduce((acc, s) => acc + Number(s.valor), 0)
    : 0;
  const precoPecas = m.pecas_extras
    ? m.pecas_extras.reduce((acc, p) => acc + (Number(p.valor_unitario) * Number(p.quantidade)), 0)
    : 0;
  return precoServicos + precoPecas;
}

// Remover módulo
function removerModulo(idx) {
  if (confirm('Remover este módulo?')) {
    modulos.splice(idx, 1);
    renderizarTabelaModulos();
  }
}

// --- Cálculo de área da tela e margem de costura ---
function atualizarAreaTelaUI() {
  if (idxModuloAtivo === null) return;
  const modulo = modulos[idxModuloAtivo];
  const largura = Number(modulo.largura_m) || 0;
  const comprimento = Number(modulo.comprimento_m) || 0;
  const margem = Number(document.getElementById('margemCosturaInput').value) || 0;
  const areaUtil = largura * comprimento;
  const larguraFinal = largura + 2 * margem;
  const comprimentoFinal = comprimento + 2 * margem;
  const areaTotal = larguraFinal * comprimentoFinal;
  document.getElementById('areaTelaSpan').textContent = areaUtil.toFixed(2);
  document.getElementById('areaTelaTotalSpan').textContent = areaTotal.toFixed(2);
}

// --- Modal de Detalhamento de Serviços --- (adaptação)
let idxModuloAtivo = null;

function abrirModalServicos(idx) {
  idxModuloAtivo = idx;
  const modulo = modulos[idx];
  const modal = document.getElementById('servicosModal');
  if (modal) modal.style.display = 'flex';
  // Renderiza checkboxes dos serviços
  const servicosDiv = document.getElementById('servicosCheckboxes');
  servicosDiv.innerHTML = '';
  modulo.servicos.forEach((s, i) => {
    servicosDiv.innerHTML += `
      <label class="flex items-center gap-2">
        <input type="checkbox" data-sidx="${i}" ${s.habilitado ? 'checked' : ''} onchange="toggleServicoCheck(this)">
        <span class="w-32">${s.nome}</span>
        <input type="number" min="0" step="0.01" value="${s.valor}" data-sidx="${i}" class="w-20 rounded border border-blue-200 px-2 py-1 ml-2" onchange="atualizarServicoValor(this)">
        <span class="text-xs text-gray-400">R$</span>
      </label>
    `;
  });
  // Margem de costura e observação
  document.getElementById('margemCosturaInput').value = modulo.margem_costura !== undefined ? modulo.margem_costura : 0.05;
  document.getElementById('obsCosturaInput').value = modulo.obs_costura || '';
  atualizarAreaTelaUI();
  document.getElementById('margemCosturaInput').oninput = atualizarAreaTelaUI;
  document.getElementById('obsCosturaInput').oninput = function(){};
}
function fecharModalServicos() {
  const modal = document.getElementById('servicosModal');
  if (modal) modal.style.display = 'none';
  idxModuloAtivo = null;
}

// Check/uncheck serviço
function toggleServicoCheck(el) {
  const sidx = Number(el.getAttribute('data-sidx'));
  if (idxModuloAtivo === null) return;
  modulos[idxModuloAtivo].servicos[sidx].habilitado = el.checked;
}
// Atualiza valor do serviço
function atualizarServicoValor(el) {
  const sidx = Number(el.getAttribute('data-sidx'));
  if (idxModuloAtivo === null) return;
  modulos[idxModuloAtivo].servicos[sidx].valor = Number(el.value);
}
// Renderização peças extras
function renderPecasExtrasUI() {
  if (idxModuloAtivo === null) return;
  const div = document.getElementById('pecasExtrasList');
  div.innerHTML = '';
  modulos[idxModuloAtivo].pecas_extras.forEach((p, i) => {
    div.innerHTML += `
      <div class="flex items-center gap-2 mb-1">
        <input type="text" value="${p.nome}" class="w-28 border rounded px-2 py-1" data-pidx="${i}" onchange="atualizarPecaNome(this)">
        <input type="number" min="1" value="${p.quantidade}" class="w-16 border rounded px-2 py-1" data-pidx="${i}" onchange="atualizarPecaQtd(this)">
        <input type="number" min="0" step="0.01" value="${p.valor_unitario}" class="w-20 border rounded px-2 py-1" data-pidx="${i}" onchange="atualizarPecaValor(this)">
        <span class="text-xs text-gray-400">R$/un</span>
        <button type="button" onclick="removerPecaExtra(${i})" class="bg-red-100 text-red-700 rounded px-2 py-1 hover:bg-red-200">X</button>
      </div>
    `;
  });
}
function adicionarPecaExtraUI() {
  if (idxModuloAtivo === null) return;
  modulos[idxModuloAtivo].pecas_extras.push({ nome: "", quantidade: 1, valor_unitario: 0 });
  renderPecasExtrasUI();
}
function atualizarPecaNome(el) {
  const pidx = Number(el.getAttribute('data-pidx'));
  if (idxModuloAtivo === null) return;
  modulos[idxModuloAtivo].pecas_extras[pidx].nome = el.value;
}
function atualizarPecaQtd(el) {
  const pidx = Number(el.getAttribute('data-pidx'));
  if (idxModuloAtivo === null) return;
  modulos[idxModuloAtivo].pecas_extras[pidx].quantidade = Number(el.value);
}
function atualizarPecaValor(el) {
  const pidx = Number(el.getAttribute('data-pidx'));
  if (idxModuloAtivo === null) return;
  modulos[idxModuloAtivo].pecas_extras[pidx].valor_unitario = Number(el.value);
}
function removerPecaExtra(pidx) {
  if (idxModuloAtivo === null) return;
  modulos[idxModuloAtivo].pecas_extras.splice(pidx, 1);
  renderPecasExtrasUI();
}
// Salvar do modal
document.getElementById('servicosForm').onsubmit = function(e) {
  e.preventDefault();
  if (idxModuloAtivo !== null) {
    // Salva margem e observação no módulo
    modulos[idxModuloAtivo].margem_costura = Number(document.getElementById('margemCosturaInput').value) || 0.05;
    modulos[idxModuloAtivo].obs_costura = document.getElementById('obsCosturaInput').value || '';
  }
  fecharModalServicos();
  renderizarTabelaModulos();
};

// Exportação/importação XML, etc: igual à sua versão, apenas remova campos antigos nos objetos!
// Pode adicionar essas funções conforme sua necessidade.

function exportarXML() {
  if (!modulos.length) {
    alert('Nenhum módulo cadastrado para exportar.');
    return;
  }
  // Coleta tipos de serviço habilitados em todos os módulos
  const tiposServicos = new Set();
  modulos.forEach(m => {
    if (Array.isArray(m.servicos)) {
      m.servicos.forEach(s => {
        if (s.habilitado) tiposServicos.add(s.tipo);
      });
    }
  });
  // Abreviações dos tipos de serviço (ajuste conforme metadados)
  const ABREV = {
    lixamento: 'LIX', pintura: 'PIN', recuperacao: 'REF', solda: 'SOL',
    fabricacao: 'FAB', desempeno: 'DES', tratamento: 'TRA', montagem: 'MON',
    desmontagem: 'DESM', bases: 'BAS', costura: 'COS', tela: 'TEL', cabo: 'CAB',
    transporte: 'TRA', primer: 'PRI', pu: 'PU', 'troca de peças': 'TRO', complementos: 'COM'
  };
  // Monta parte dos tipos no nome
  const tiposArr = Array.from(tiposServicos).map(t => ABREV[t] || t.toUpperCase());
  // Data/hora
  const now = new Date();
  const pad = n => n.toString().padStart(2, '0');
  const dataStr = `${now.getFullYear()}${pad(now.getMonth()+1)}${pad(now.getDate())}-${pad(now.getHours())}${pad(now.getMinutes())}`;
  // Nome do arquivo
  const nomeArquivo = `mod${modulos.length}_${tiposArr.join('-')}_${dataStr}.xml`;

  // Monta XML
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n<calculadora>\n  <modulos>\n';
  modulos.forEach((m, idx) => {
    xml += `    <modulo>\n`;
    xml += `      <id>${idx+1}</id>\n`;
    xml += `      <quantidade_vagas>${m.quantidade_vagas}</quantidade_vagas>\n`;
    xml += `      <largura_m>${m.largura_m}</largura_m>\n`;
    xml += `      <comprimento_m>${m.comprimento_m}</comprimento_m>\n`;
    xml += `      <estado>${m.estado}</estado>\n`;
    xml += `      <observacoes>${m.observacoes||''}</observacoes>\n`;
    xml += `      <margem_costura>${m.margem_costura || 0.05}</margem_costura>\n`;
    xml += `      <obs_costura>${m.obs_costura || ''}</obs_costura>\n`;
    // Serviços detalhados
    xml += `      <servicos>\n`;
    if (Array.isArray(m.servicos)) {
      m.servicos.filter(s => s.habilitado).forEach(s => {
        xml += `        <servico>\n`;
        xml += `          <tipo>${s.tipo}</tipo>\n`;
        xml += `          <valor>${s.valor}</valor>\n`;
        xml += `        </servico>\n`;
      });
    }
    // Peças extras
    if (Array.isArray(m.pecas_extras)) {
      m.pecas_extras.forEach(p => {
        xml += `        <peca_extra>\n`;
        xml += `          <nome>${p.nome}</nome>\n`;
        xml += `          <quantidade>${p.quantidade}</quantidade>\n`;
        xml += `          <valor_unitario>${p.valor_unitario}</valor_unitario>\n`;
        xml += `        </peca_extra>\n`;
      });
    }
    xml += `      </servicos>\n`;
    xml += `    </modulo>\n`;
  });
  xml += '  </modulos>\n</calculadora>';

  // Download
  const blob = new Blob([xml], {type: 'application/xml'});
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = nomeArquivo;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

function importarXML(event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function(e) {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(e.target.result, "application/xml");
    modulos = [];
    xmlDoc.querySelectorAll('modulo').forEach(m => {
      const servicos = [];
      m.querySelectorAll('servicos > servico').forEach(s => {
        servicos.push({
          tipo: s.querySelector('tipo')?.textContent || '',
          valor: Number(s.querySelector('valor')?.textContent) || 0,
          habilitado: true,
          nome: '', // pode ser ajustado depois
        });
      });
      const pecas_extras = [];
      m.querySelectorAll('servicos > peca_extra').forEach(p => {
        pecas_extras.push({
          nome: p.querySelector('nome')?.textContent || '',
          quantidade: Number(p.querySelector('quantidade')?.textContent) || 1,
          valor_unitario: Number(p.querySelector('valor_unitario')?.textContent) || 0
        });
      });
      modulos.push({
        quantidade_vagas: Number(m.querySelector('quantidade_vagas')?.textContent) || 4,
        largura_m: m.querySelector('largura_m')?.textContent || '',
        comprimento_m: m.querySelector('comprimento_m')?.textContent || '',
        estado: m.querySelector('estado')?.textContent || '',
        observacoes: m.querySelector('observacoes')?.textContent || '',
        margem_costura: Number(m.querySelector('margem_costura')?.textContent) || 0.05,
        obs_costura: m.querySelector('obs_costura')?.textContent || '',
        servicos,
        pecas_extras
      });
    });
    renderizarTabelaModulos();
  };
  reader.readAsText(file);
}

renderizarTabelaModulos();
