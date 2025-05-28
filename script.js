// Estrutura de dados dos módulos
let modulos = [];

function renderTabela() {
  const tbody = document.querySelector('#modulosTable tbody');
  tbody.innerHTML = '';
  modulos.forEach((m, idx) => {
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
      <td><button class="btn" onclick="removerModulo(${idx})">Remover</button></td>
    `;
    tbody.appendChild(tr);
  });
}

document.getElementById('moduloForm').onsubmit = function(e) {
  e.preventDefault();
  const f = e.target;
  modulos.push({
    quantidade_vagas: f.quantidade_vagas.value,
    largura_m: f.largura_m.value,
    comprimento_m: f.comprimento_m.value,
    estado: f.estado.value,
    bases_comprometidas: f.bases_comprometidas.value,
    pecas_removidas: f.pecas_removidas.value,
    observacoes: f.observacoes.value,
  });
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

// Função utilitária para abreviar tipos de serviço
function abreviacaoServico(tipo) {
  const map = {
    'Lixamento': 'LIX',
    'Pintura': 'PIN',
    'Reforço': 'REF',
    'Solda': 'SOL',
    'Fabricação': 'FAB',
    'Desempeno': 'DES',
    'Tratamento químico': 'TRA',
    'Montagem': 'MON',
    'Desmontagem': 'DESM',
    'Bases': 'BAS',
    'Costura': 'COS',
    'Recostura': 'COS',
    'Tela nova': 'TEL',
    'Troca de cabo': 'CAB'
    // Adicione aqui outros tipos, se necessário
  };
  return map[tipo] || tipo.slice(0,3).toUpperCase(); // fallback para abreviação automática
}

// Função para gerar nome do arquivo XML conforme padrão
function gerarNomeArquivoXML(modulos, servicos) {
  const qtdModulos = modulos.length;
  // Extrai tipos únicos de serviço presentes
  let tiposServicos = [];
  if (Array.isArray(servicos) && servicos.length) {
    const setTipos = new Set(servicos.map(s => abreviacaoServico(s.tipo_servico)));
    tiposServicos = Array.from(setTipos).sort();
  }
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

document.getElementById('exportXmlBtn').onclick = function() {
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
    </modulo>`;
  });
  xml += '</modulos>';
  const blob = new Blob([xml], {type: 'application/xml'});
  // Para futura expansão: buscar serviços e passar para gerarNomeArquivoXML
  const nomeArquivo = gerarNomeArquivoXML(modulos, window.servicos || []);
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = nomeArquivo;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};

document.getElementById('importXml').onchange = function(event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function(e) {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(e.target.result, "application/xml");
    modulos = [];
    xmlDoc.querySelectorAll('modulo').forEach(m => {
      modulos.push({
        quantidade_vagas: m.querySelector('quantidade_vagas')?.textContent || '',
        largura_m: m.querySelector('largura_m')?.textContent || '',
        comprimento_m: m.querySelector('comprimento_m')?.textContent || '',
        estado: m.querySelector('estado')?.textContent || '',
        bases_comprometidas: m.querySelector('bases_comprometidas')?.textContent || '',
        pecas_removidas: m.querySelector('pecas_removidas')?.textContent || '',
        observacoes: m.querySelector('observacoes')?.textContent || ''
      });
    });
    renderTabela();
  };
  reader.readAsText(file);
};

renderTabela();
