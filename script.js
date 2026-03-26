/* ==========================================================================
   Programa de Benefícios — xGMobile / Inatel
   JavaScript — comparador de cotas
   ========================================================================== */

(function () {
  'use strict';

  /* ---------- DATA ---------- */

  var BENEFICIOS = [
    'Prioridade no licenciamento da PI com compensação financeira',
    'Horas de consultoria por ano dentro do limite oferecido',
    'Participação dos colaboradores na pós-graduação online assíncrono',
    'Acesso à documentação técnica produzida em todos os planos do centro',
    'Participação técnica na execução dos projetos de PDI do centro',
    'Menção nos agradecimentos das produções científicas',
    'Utilização da infraestrutura do centro, incluindo o parque de equipamentos',
    'Lançamento de desafios para startups',
    'Acesso ao RH qualificado pelo centro',
    'Participação em reuniões periódicas sobre as ações do centro',
    'Participação dos colaboradores em capacitação online e assíncrono',
    'Participação em workshops',
    'Acesso diferenciado à consultoria para elevar TRL na unidade EMBRAPII',
    'Logo da empresa no site e nas divulgações de eventos do centro',
    'Participação em rodadas de negócios',
    'Acesso ao programa Inatel Startups',
    'Participação dos colaboradores em pós-graduação Inatel stricto-senso'
  ];

  var COTAS = {
    DIAMOND: {
      label: 'Diamond',
      cssClass: 'th-diamond',
      valores: [
        '1', '168h*', '200****', 'check', 'check', 'check',
        'Sem custo***', '4', 'check', 'check', '200****',
        'check', 'check', 'check', 'check', '-', '2'
      ]
    },
    PLATINUM: {
      label: 'Platinum',
      cssClass: 'th-platinum',
      valores: [
        '2', '80h*', '100****', 'check', 'check', 'check',
        'Sem custo***', '2', 'check', 'check', '100****',
        'check', 'check', 'check', 'check', '-', '1'
      ]
    },
    GOLD: {
      label: 'Gold',
      cssClass: 'th-gold',
      valores: [
        '3', '40h*', '50', '-', '-', '-',
        'Preço especial***', '1', '-', 'check', '50',
        'check', 'check', 'check', 'check', '-', '-'
      ]
    },
    SILVER: {
      label: 'Silver',
      cssClass: 'th-silver',
      valores: [
        '4', '16h**', '20', '-', '-', '-',
        'Preço especial***', '-', '-', '-', '20',
        'check', 'check', 'check', 'check', '-', '-'
      ]
    },
    BRONZE: {
      label: 'Bronze',
      cssClass: 'th-bronze',
      valores: [
        '5', '-', '10', '-', '-', '-',
        'Preço especial***', '-', '-', '-', '10',
        'check', 'check', 'check', 'check', '-', '-'
      ]
    },
    STARTUP: {
      label: 'Startup',
      cssClass: 'th-startup',
      valores: [
        '5', '8h**', '5', '-', '-', '-',
        'Preço especial***', '-', '-', '-', '5',
        'check', 'check', '-', 'check', 'check', '-'
      ]
    }
  };

  /* ---------- SVG CHECK ICON ---------- */

  var CHECK_SVG =
    '<svg class="check-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Incluso">' +
      '<circle cx="12" cy="12" r="11" fill="currentColor" opacity=".12"/>' +
      '<path d="M7.5 12.5L10.5 15.5L16.5 9.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>' +
    '</svg>';

  /* ---------- DOM REFS ---------- */

  var checkboxes = document.querySelectorAll('input[name="cota"]');
  var btnClear = document.getElementById('btnClear');
  var comparisonTable = document.getElementById('comparisonTable');

  /* Tier order for full table display */
  var TIERS_ORDER = ['DIAMOND', 'PLATINUM', 'GOLD', 'SILVER', 'BRONZE', 'STARTUP'];

  /* ---------- STATE MANAGEMENT ---------- */

  function getSelectedCotas() {
    var selected = [];
    for (var i = 0; i < checkboxes.length; i++) {
      if (checkboxes[i].checked) {
        selected.push(checkboxes[i].value);
      }
    }
    return selected;
  }

  function isSelectedCota(cotaKey) {
    var selected = getSelectedCotas();
    return selected.indexOf(cotaKey) !== -1;
  }

  /* ---------- TABLE GENERATION ---------- */

  function renderCell(value) {
    if (value === 'check') {
      return '<td>' + CHECK_SVG + '</td>';
    }
    if (value === '-') {
      return '<td><span class="cell-na" aria-label="Não disponível">—</span></td>';
    }
    return '<td><span class="cell-value">' + escapeHtml(value) + '</span></td>';
  }

  function escapeHtml(str) {
    var div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  }

  function gerarTabela() {
    var selected = getSelectedCotas();

    // Build header with all tiers
    var html = '<thead><tr><th>Benefícios</th>';
    for (var t = 0; t < TIERS_ORDER.length; t++) {
      var tierKey = TIERS_ORDER[t];
      var cota = COTAS[tierKey];
      var className = cota.cssClass;

      // Highlight selected cotas
      if (isSelectedCota(tierKey)) {
        className += ' th-highlighted';
      }

      html += '<th class="' + className + '">' + escapeHtml(cota.label) + '</th>';
    }
    html += '</tr></thead>';

    // Build body
    html += '<tbody>';
    for (var b = 0; b < BENEFICIOS.length; b++) {
      html += '<tr><td>' + escapeHtml(BENEFICIOS[b]) + '</td>';
      for (var t = 0; t < TIERS_ORDER.length; t++) {
        var tierKey = TIERS_ORDER[t];
        var cellClass = isSelectedCota(tierKey) ? ' highlighted' : '';
        var cellHtml = renderCell(COTAS[tierKey].valores[b]);
        // Add class to cell
        cellHtml = cellHtml.replace('<td>', '<td class="' + cellClass + '">');
        html += cellHtml;
      }
      html += '</tr>';
    }
    html += '</tbody>';

    comparisonTable.innerHTML = html;
  }

  /* ---------- CLEAR ---------- */

  function limparSelecao() {
    for (var i = 0; i < checkboxes.length; i++) {
      checkboxes[i].checked = false;
    }
    gerarTabela();
  }

  /* ---------- EVENT LISTENERS ---------- */

  // Checkboxes → update table in real-time
  for (var i = 0; i < checkboxes.length; i++) {
    checkboxes[i].addEventListener('change', gerarTabela);
  }

  // Clear button
  btnClear.addEventListener('click', limparSelecao);

  // Initial render - show all tiers
  gerarTabela();

})();
