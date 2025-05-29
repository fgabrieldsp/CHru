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

// Novo módulo padrão, SEM campos antigos
function novoModuloPadrao(formVals = {}) {
  const estado = formVals.estado || "Ruim";
  const mult = MULTIPLICADOR_ESTADO[estado] || 1;
  const area = (Number(formVals.largura_m) || 10) * (Number(formVals.comprimento_m) || 5);
  return {
    quantidade_vagas: Number(formVals.quantidade_vagas) || 4,
    largura_m: Number(formVals.largura_m) || 10,
    comprimento_m: Number(formVals.comprimento_m) || 5,
    estado,
    observacoes: formVals.observacoes || "",
    servicos: SERVICOS_PADRAO.map(s => {
      let valorBase = SERVICOS_VALORES_BASE[s.tipo] || 0;
      let valor = SERVICOS_AREA.includes(s.tipo)
        ? valorBase * area * mult
        : valorBase * mult;
      valor = Math.round(valor * 100) / 100;
      return {
        ...s,
        habilitado: false,
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
      <td>${mod.servicos && mod.servicos.filter(s => s.habilitado).length ? mod.servicos.filter(s => s.habilitado).map(s => s.nome).join(', ') : '-'}</td>
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

// --- Modal de Detalhamento de Serviços ---
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
  renderPecasExtrasUI();
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
  fecharModalServicos();
  renderizarTabelaModulos();
};

// Exportação/importação XML, etc: igual à sua versão, apenas remova campos antigos nos objetos!
// Pode adicionar essas funções conforme sua necessidade.

renderizarTabelaModulos();
