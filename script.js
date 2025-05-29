// Estrutura de dados dos módulos
let modulos = [];

// Serviços padrão
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
  desmontagem: 200,  // fixo
  montagem: 200,     // fixo
  transporte: 25,   // fixo
  recuperacao: 500,  // fixo
  lixamento: 8,     // R$/m²
  pintura: 10,      // R$/m²
  tratamento: 4,    // R$/m²
  tela: 60,         // R$/m²
  cabo: 36          // fixo
};

const MULTIPLICADOR_ESTADO = {
  "Ruim": 1,
  "Muito Ruim": 1.50,
  "Condição Crítica": 1.90
};

const SERVICOS_AREA = ["lixamento", "pintura", "tratamento", "tela"];

// Função para criar novo módulo com todos campos padrão + serviços e peças extras
function novoModuloPadrao(formVals = {}) {
  const estado = formVals.estado || "Ruim";
  const mult = MULTIPLICADOR_ESTADO[estado] || 1;
  const area = (Number(formVals.largura_m) || 10) * (Number(formVals.comprimento_m) || 5);

  return {
    quantidade_vagas: formVals.quantidade_vagas || 4,
    largura_m: formVals.largura_m || 10,
    comprimento_m: formVals.comprimento_m || 5,
    estado,
    bases_comprometidas: formVals.bases_comprometidas || 0,
    pecas_removidas: formVals.pecas_removidas || "",
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
    pecas_extras: [] // {nome, quantidade, valor_unitario}
  };
}

// Função para renderizar a tabela dos módulos
function renderTabela() {
  const tbody = document.querySelector('#modulosTable tbody') || document.getElementById('modulosTable');
  tbody.innerHTML = '';
  modulos.forEach((m, idx) => {
    // Resumo dos serviços
    const servicosMarcados = m.servicos ? m.servicos.filter(s => s.habilitado).map(s => s.nome).join(', ') : '-';
    const precoTotal = calcularPrecoModulo(m);
    // Ícones universais com tooltip e classe no-print
    const btnDetalhar = `<button title="Detalhar Serviços" class="text-blue-700 text-lg hover:text-blue-900 px-1 no-print"
      onclick="detalharServicosModulo(${idx})">🔧</button>`;
    const btnRemover = `<button title="Remover" class="text-red-700 text-lg hover:text-red-900 px-1 no-print"
      onclick="removerModulo(${idx})">🗑️</button>`;
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${idx+1}</td>
      <td>${m.quantidade_vagas}</td>
      <td>${m.largura_m}</td>
      <td>${m.comprimento_m}</td>
      <td>${m.estado}</td>
      <td>${m.bases_comprometidas}</td>
      <td>${m.pecas_removidas || '-'}</td>
      <td>${m.observacoes || '-'}</td>
      <td class="flex flex-row gap-2 items-center">
        ${btnDetalhar}
        ${btnRemover}
        <span class="text-xs text-blue-900 mt-1">Serviços: ${servicosMarcados}</span>
        <span class="text-xs text-green-700">R$ ${precoTotal.toFixed(2)}</span>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

// Função para calcular o preço total de um módulo
function calcularPrecoModulo(m) {
  const precoServicos = m.servicos
    ? m.servicos.filter(s => s.habilitado).reduce((acc, s) => acc + Number(s.valor), 0)
    : 0;
  const precoPecas = m.pecas_extras
    ? m.pecas_extras.reduce((acc, p) => acc + (Number(p.valor_unitario) * Number(p.quantidade)), 0)
    : 0;
  return precoServicos + precoPecas;
}

// Evento para cadastro de módulos
document.getElementById('moduloForm').onsubmit = function(e) {
  e.preventDefault();
  const f = e.target;
  modulos.push(novoModuloPadrao({
    quantidade_vagas: f.quantidade_vagas.value,
    largura_m: f.largura_m.value,
    comprimento_m: f.comprimento_m.value,
    estado: f.estado.value,
    bases_comprometidas: f.bases_comprometidas.value,
    pecas_removidas: f.pecas_removidas.value,
    observacoes: f.observacoes.value
  }));
  f.reset();
  f.quantidade_vagas.value = 4;
  f.largura_m.value = 10;
  f.comprimento_m.value = 5;
  f.bases_comprometidas.value = 0;
  renderTabela();
};

function removerModulo(idx) {
  modulos.splice(idx, 1);
  renderTabela();
}

// --------------------------------------
// MODAL DE DETALHAMENTO DE SERVIÇOS
// --------------------------------------

let idxModuloAtivo = null; // Índice do módulo sendo editado

// Atualizar detalharServicosModulo e fecharModalServicos para manipular display
function detalharServicosModulo(idx) {
  idxModuloAtivo = idx;
  const modulo = modulos[idx];
  const modal = document.getElementById('servicosModal');
  if (modal) modal.style.display = 'flex'; // Mostra o modal
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
  // Renderiza peças extras
  renderPecasExtrasUI();
}

function fecharModalServicos() {
  const modal = document.getElementById('servicosModal');
  if (modal) modal.style.display = 'none'; // Esconde o modal
  idxModuloAtivo = null;
}

// Checkbox de serviço
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

// Adiciona peça extra
function adicionarPecaExtraUI() {
  if (idxModuloAtivo === null) return;
  modulos[idxModuloAtivo].pecas_extras.push({ nome: "", quantidade: 1, valor_unitario: 0 });
  renderPecasExtrasUI();
}

// Atualiza nome da peça extra
function atualizarPecaNome(el) {
  const pidx = Number(el.getAttribute('data-pidx'));
  if (idxModuloAtivo === null) return;
  modulos[idxModuloAtivo].pecas_extras[pidx].nome = el.value;
}

// Atualiza quantidade da peça extra
function atualizarPecaQtd(el) {
  const pidx = Number(el.getAttribute('data-pidx'));
  if (idxModuloAtivo === null) return;
  modulos[idxModuloAtivo].pecas_extras[pidx].quantidade = Number(el.value);
}

// Atualiza valor da peça extra
function atualizarPecaValor(el) {
  const pidx = Number(el.getAttribute('data-pidx'));
  if (idxModuloAtivo === null) return;
  modulos[idxModuloAtivo].pecas_extras[pidx].valor_unitario = Number(el.value);
}

// Remove peça extra
function removerPecaExtra(pidx) {
  if (idxModuloAtivo === null) return;
  modulos[idxModuloAtivo].pecas_extras.splice(pidx, 1);
  renderPecasExtrasUI();
}

// Salva e fecha modal de serviços
document.getElementById('servicosForm').onsubmit = function(e) {
  e.preventDefault();
  fecharModalServicos();
  renderTabela();
};

// Função utilitária para abreviar tipos de serviço (usada na exportação)
function abreviacaoServico(tipo) {
  const map = {
    'Lixamento': 'LIX',
    'Pintura': 'PIN',
    'Reforço': 'REF',
    'Solda': 'SOL',
    'Fabricação': 'FAB',
    'Desempeno': 'DES',
    'Tratamento físico/químico': 'TRA',
    'Tratamento químico': 'TRA',
    'Montagem': 'MON',
    'Desmontagem': 'DESM',
    'Bases': 'BAS',
    'Costura': 'COS',
    'Recostura': 'COS',
    'Tela (m²)': 'TEL',
    'Tela nova': 'TEL',
    'Troca de cabo de aço': 'CAB',
    'Troca de cabo': 'CAB',
    'Recuperação estrutural': 'REF'
    // Adicione aqui outros tipos, se necessário
  };
  return map[tipo] || tipo.slice(0,3).toUpperCase();
}

// Função para gerar nome do arquivo XML conforme padrão
function gerarNomeArquivoXML(modulos) {
  const qtdModulos = modulos.length;
  // Extrai tipos únicos de serviço presentes
  let tiposServicos = [];
  modulos.forEach(m => {
    if (Array.isArray(m.servicos)) {
      m.servicos.forEach(s => {
        if (s.habilitado) tiposServicos.push(abreviacaoServico(s.nome));
      });
    }
  });
  tiposServicos = Array.from(new Set(tiposServicos)).sort();
  const tiposStr = tiposServicos.length ? '_' + tiposServicos.join('-') : '';
  // Timestamp YYYYMMDD-HHMM
  const now = new Date();
  const dataStr = now.getFullYear().toString() +
    String(now.getMonth()+1).padStart(2, '0') +
    String(now.getDate()).padStart(2, '0') + '-' +
    String(now.getHours()).padStart(2, '0') +
    String(now.getMinutes()).padStart(2, '0');
  return `mod${qtdModulos}${tiposStr}_${dataStr}.xml`;
}

// Exportação XML (atualizada para incluir serviços e peças extras)
function exportarXML() {
  let xml = '<?xml version="1.0" encoding="UTF-8"?><modulos>';
  modulos.forEach((m, idx) => {
    xml += `<modulo>
      <id>${idx+1}</id>
      <quantidade_vagas>${m.quantidade_vagas}</quantidade_vagas>
      <largura_m>${m.largura_m}</largura_m>
      <comprimento_m>${m.comprimento_m}</comprimento_m>
      <estado>${m.estado}</estado>
      <bases_comprometidas>${m.bases_comprometidas}</bases_comprometidas>
      <pecas_removidas>${m.pecas_removidas}</pecas_removidas>
      <observacoes>${m.observacoes}</observacoes>
      <servicos>`;
    m.servicos.forEach(s => {
      xml += `<servico>
        <tipo>${s.tipo}</tipo>
        <nome>${s.nome}</nome>
        <habilitado>${s.habilitado}</habilitado>
        <valor>${s.valor}</valor>
      </servico>`;
    });
    m.pecas_extras.forEach(p => {
      xml += `<peca_extra>
        <nome>${p.nome}</nome>
        <quantidade>${p.quantidade}</quantidade>
        <valor_unitario>${p.valor_unitario}</valor_unitario>
      </peca_extra>`;
    });
    xml += `</servicos>
    </modulo>`;
  });
  xml += '</modulos>';
  const blob = new Blob([xml], {type: 'application/xml'});
  const nomeArquivo = gerarNomeArquivoXML(modulos);
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = nomeArquivo;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

// Importação XML (atualizada para ler serviços e peças extras)
function importarXML(event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function(e) {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(e.target.result, "application/xml");
    modulos = [];
    xmlDoc.querySelectorAll('modulo').forEach(m => {
      // Recupera serviços detalhados
      const servicos = [];
      m.querySelectorAll('servicos > servico').forEach(s => {
        servicos.push({
          tipo: s.querySelector('tipo')?.textContent || '',
          nome: s.querySelector('nome')?.textContent || '',
          habilitado: s.querySelector('habilitado')?.textContent === 'true',
          valor: Number(s.querySelector('valor')?.textContent || 0)
        });
      });
      // Recupera peças extras
      const pecas_extras = [];
      m.querySelectorAll('servicos > peca_extra').forEach(p => {
        pecas_extras.push({
          nome: p.querySelector('nome')?.textContent || '',
          quantidade: Number(p.querySelector('quantidade')?.textContent || 1),
          valor_unitario: Number(p.querySelector('valor_unitario')?.textContent || 0)
        });
      });
      // Monta módulo
      modulos.push({
        quantidade_vagas: m.querySelector('quantidade_vagas')?.textContent || '',
        largura_m: m.querySelector('largura_m')?.textContent || '',
        comprimento_m: m.querySelector('comprimento_m')?.textContent || '',
        estado: m.querySelector('estado')?.textContent || '',
        bases_comprometidas: m.querySelector('bases_comprometidas')?.textContent || '',
        pecas_removidas: m.querySelector('pecas_removidas')?.textContent || '',
        observacoes: m.querySelector('observacoes')?.textContent || '',
        servicos: servicos.length ? servicos : SERVICOS_PADRAO.map(s => ({
          ...s, habilitado: false, valor: s.valor
        })),
        pecas_extras: pecas_extras
      });
    });
    renderTabela();
  };
  reader.readAsText(file);
}

// Se necessário, conecte os botões de exportação/importação no HTML
if (document.getElementById('exportXmlBtn')) {
  document.getElementById('exportXmlBtn').onclick = exportarXML;
}
if (document.getElementById('importXml')) {
  document.getElementById('importXml').onchange = importarXML;
}

// Renderização inicial
renderTabela();
