/* ==========================================================================
   Programa de Benefícios — xGMobile / Inatel
   JavaScript — comparador de cotas
   ========================================================================== */

(function () {
  'use strict';

  /* ====================================================================
     DATA — Structured by benefit (eliminates positional coupling)
     ==================================================================== */

  var TIERS_ORDER = ['DIAMOND', 'PLATINUM', 'GOLD', 'SILVER', 'BRONZE', 'STARTUP'];

  var TIERS_META = {
    DIAMOND:  { label: 'Diamond',  css: 'diamond' },
    PLATINUM: { label: 'Platinum', css: 'platinum' },
    GOLD:     { label: 'Gold',     css: 'gold' },
    SILVER:   { label: 'Silver',   css: 'silver' },
    BRONZE:   { label: 'Bronze',   css: 'bronze' },
    STARTUP:  { label: 'Startup',  css: 'startup' }
  };

  var BENEFITS = [
    {
      label: 'Prioridade no licenciamento da PI com compensação financeira',
      values: { DIAMOND: '1', PLATINUM: '2', GOLD: '3', SILVER: '4', BRONZE: '5', STARTUP: '5' }
    },
    {
      label: 'Horas de consultoria por ano dentro do limite oferecido',
      values: { DIAMOND: '168h*', PLATINUM: '80h*', GOLD: '40h*', SILVER: '16h**', BRONZE: '-', STARTUP: '8h**' }
    },
    {
      label: 'Participação dos colaboradores na pós-graduação online assíncrono',
      values: { DIAMOND: '200****', PLATINUM: '100****', GOLD: '50', SILVER: '20', BRONZE: '10', STARTUP: '5' }
    },
    {
      label: 'Acesso à documentação técnica produzida em todos os planos do centro',
      values: { DIAMOND: 'check', PLATINUM: 'check', GOLD: '-', SILVER: '-', BRONZE: '-', STARTUP: '-' }
    },
    {
      label: 'Participação técnica na execução dos projetos de PDI do centro',
      values: { DIAMOND: 'check', PLATINUM: 'check', GOLD: '-', SILVER: '-', BRONZE: '-', STARTUP: '-' }
    },
    {
      label: 'Menção nos agradecimentos das produções científicas',
      values: { DIAMOND: 'check', PLATINUM: 'check', GOLD: '-', SILVER: '-', BRONZE: '-', STARTUP: '-' }
    },
    {
      label: 'Utilização da infraestrutura do centro, incluindo o parque de equipamentos',
      values: { DIAMOND: 'Sem custo***', PLATINUM: 'Sem custo***', GOLD: 'Preço especial***', SILVER: 'Preço especial***', BRONZE: 'Preço especial***', STARTUP: 'Preço especial***' }
    },
    {
      label: 'Lançamento de desafios para startups',
      values: { DIAMOND: '4', PLATINUM: '2', GOLD: '1', SILVER: '-', BRONZE: '-', STARTUP: '-' }
    },
    {
      label: 'Acesso ao RH qualificado pelo centro',
      values: { DIAMOND: 'check', PLATINUM: 'check', GOLD: '-', SILVER: '-', BRONZE: '-', STARTUP: '-' }
    },
    {
      label: 'Participação em reuniões periódicas sobre as ações do centro',
      values: { DIAMOND: 'check', PLATINUM: 'check', GOLD: 'check', SILVER: '-', BRONZE: '-', STARTUP: '-' }
    },
    {
      label: 'Participação dos colaboradores em capacitação online e assíncrono',
      values: { DIAMOND: '200****', PLATINUM: '100****', GOLD: '50', SILVER: '20', BRONZE: '10', STARTUP: '5' }
    },
    {
      label: 'Participação em workshops',
      values: { DIAMOND: 'check', PLATINUM: 'check', GOLD: 'check', SILVER: 'check', BRONZE: 'check', STARTUP: 'check' }
    },
    {
      label: 'Acesso diferenciado à consultoria para elevar TRL na unidade EMBRAPII',
      values: { DIAMOND: 'check', PLATINUM: 'check', GOLD: 'check', SILVER: 'check', BRONZE: 'check', STARTUP: 'check' }
    },
    {
      label: 'Logo da empresa no site e nas divulgações de eventos do centro',
      values: { DIAMOND: 'check', PLATINUM: 'check', GOLD: 'check', SILVER: 'check', BRONZE: 'check', STARTUP: '-' }
    },
    {
      label: 'Participação em rodadas de negócios',
      values: { DIAMOND: 'check', PLATINUM: 'check', GOLD: 'check', SILVER: 'check', BRONZE: 'check', STARTUP: 'check' }
    },
    {
      label: 'Acesso ao programa Inatel Startups',
      values: { DIAMOND: '-', PLATINUM: '-', GOLD: '-', SILVER: '-', BRONZE: '-', STARTUP: 'check' }
    },
    {
      label: 'Participação dos colaboradores em pós-graduação Inatel stricto-senso',
      values: { DIAMOND: '2', PLATINUM: '1', GOLD: '-', SILVER: '-', BRONZE: '-', STARTUP: '-' }
    }
  ];

  /* ====================================================================
     VALIDATION — defensive check on data integrity
     ==================================================================== */

  (function validateData() {
    BENEFITS.forEach(function (b, i) {
      TIERS_ORDER.forEach(function (tier) {
        if (!(tier in b.values)) {
          console.warn('[xGMobile] Benefício "' + b.label + '" (índice ' + i + ') sem valor para ' + tier);
        }
      });
    });
  })();

  /* ====================================================================
     ICONS
     ==================================================================== */

  var CHECK_SVG =
    '<svg class="check-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">' +
      '<circle cx="12" cy="12" r="11" fill="currentColor" opacity=".12"/>' +
      '<path d="M7.5 12.5L10.5 15.5L16.5 9.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>' +
    '</svg>';

  /* ====================================================================
     DOM REFS
     ==================================================================== */

  var checkboxes = document.querySelectorAll('input[name="cota"]');
  var btnClear = document.getElementById('btnClear');
  var btnHighlight = document.getElementById('btnHighlight');
  var comparisonTable = document.getElementById('comparisonTable');
  var mobileComparison = document.getElementById('mobileComparison');
  var selectionSummary = document.getElementById('selectionSummary');

  /* ====================================================================
     STATE
     ==================================================================== */

  var highlightDiffs = false;

  /* ====================================================================
     HELPERS
     ==================================================================== */

  function escapeHtml(str) {
    var el = document.createElement('span');
    el.textContent = str;
    return el.innerHTML;
  }

  function getSelectedTiers() {
    var selected = [];
    for (var i = 0; i < checkboxes.length; i++) {
      if (checkboxes[i].checked) selected.push(checkboxes[i].value);
    }
    return selected;
  }

  function getDisplayTiers() {
    var selected = getSelectedTiers();
    return selected.length > 0 ? selected : TIERS_ORDER;
  }

  function rowHasDifferences(benefit, tiers) {
    if (tiers.length < 2) return false;
    var first = benefit.values[tiers[0]];
    for (var i = 1; i < tiers.length; i++) {
      if (benefit.values[tiers[i]] !== first) return true;
    }
    return false;
  }

  /* ====================================================================
     URL STATE PERSISTENCE
     ==================================================================== */

  function syncToUrl(selected) {
    var url = new URL(window.location);
    if (selected.length > 0) {
      url.searchParams.set('cotas', selected.join(','));
    } else {
      url.searchParams.delete('cotas');
    }
    history.replaceState(null, '', url);
  }

  function readFromUrl() {
    var params = new URLSearchParams(window.location.search);
    var cotas = params.get('cotas');
    if (!cotas) return [];
    return cotas.split(',').filter(function (t) {
      return TIERS_ORDER.indexOf(t) !== -1;
    });
  }

  /* ====================================================================
     RENDER — Table (desktop)
     ==================================================================== */

  function renderTable() {
    var tiers = getDisplayTiers();

    var html = '<caption class="sr-only">Tabela comparativa de benefícios por categoria de associação</caption>';
    html += '<thead><tr><th scope="col">Benefícios</th>';
    for (var t = 0; t < tiers.length; t++) {
      var meta = TIERS_META[tiers[t]];
      html += '<th scope="col" class="th-' + meta.css + '">' + escapeHtml(meta.label) + '</th>';
    }
    html += '</tr></thead><tbody>';

    for (var b = 0; b < BENEFITS.length; b++) {
      var benefit = BENEFITS[b];
      var isDiff = highlightDiffs && rowHasDifferences(benefit, tiers);
      html += '<tr' + (isDiff ? ' class="row-diff"' : '') + '>';
      html += '<th scope="row">' + escapeHtml(benefit.label) + '</th>';

      for (var c = 0; c < tiers.length; c++) {
        var val = benefit.values[tiers[c]] || '-';
        html += renderCellTd(val);
      }
      html += '</tr>';
    }
    html += '</tbody>';

    comparisonTable.innerHTML = html;
  }

  function renderCellTd(value) {
    if (value === 'check') {
      return '<td aria-label="Incluso">' + CHECK_SVG + '</td>';
    }
    if (value === '-') {
      return '<td aria-label="Não disponível"><span class="cell-na" aria-hidden="true">—</span></td>';
    }
    return '<td><span class="cell-value">' + escapeHtml(value) + '</span></td>';
  }

  /* ====================================================================
     RENDER — Mobile cards
     ==================================================================== */

  function renderMobileCards() {
    var tiers = getDisplayTiers();
    var html = '';

    for (var b = 0; b < BENEFITS.length; b++) {
      var benefit = BENEFITS[b];
      var isDiff = highlightDiffs && rowHasDifferences(benefit, tiers);
      html += '<div class="benefit-card' + (isDiff ? ' card-diff' : '') + '">';
      html += '<h3 class="benefit-card-title">' + escapeHtml(benefit.label) + '</h3>';
      html += '<div class="benefit-card-values">';

      for (var t = 0; t < tiers.length; t++) {
        var tierKey = tiers[t];
        var meta = TIERS_META[tierKey];
        var val = benefit.values[tierKey] || '-';
        var valueHtml;

        if (val === 'check') {
          valueHtml = '<span class="mobile-check">' + CHECK_SVG + '</span>';
        } else if (val === '-') {
          valueHtml = '<span class="mobile-na">—</span>';
        } else {
          valueHtml = '<span class="mobile-value">' + escapeHtml(val) + '</span>';
        }

        html += '<div class="benefit-card-tier">';
        html += '<span class="tier-dot ' + meta.css + '" aria-hidden="true"></span>';
        html += '<span class="tier-label">' + escapeHtml(meta.label) + '</span>';
        html += valueHtml;
        html += '</div>';
      }

      html += '</div></div>';
    }

    mobileComparison.innerHTML = html;
  }

  /* ====================================================================
     RENDER — Selection summary
     ==================================================================== */

  function renderSummary() {
    var selected = getSelectedTiers();

    if (selected.length === 0) {
      selectionSummary.innerHTML = 'Exibindo todas as <strong>' + TIERS_ORDER.length + '</strong> categorias';
      btnClear.style.display = 'none';
      return;
    }

    var badges = selected.map(function (key) {
      var meta = TIERS_META[key];
      return '<span class="summary-badge ' + meta.css + '">' + escapeHtml(meta.label) + '</span>';
    }).join(' ');

    selectionSummary.innerHTML = 'Comparando: ' + badges;
    btnClear.style.display = '';
  }

  /* ====================================================================
     MAIN UPDATE
     ==================================================================== */

  function update() {
    var selected = getSelectedTiers();
    syncToUrl(selected);
    renderSummary();
    renderTable();
    renderMobileCards();
  }

  /* ====================================================================
     ACTIONS
     ==================================================================== */

  function clearSelection() {
    for (var i = 0; i < checkboxes.length; i++) {
      checkboxes[i].checked = false;
    }
    update();
  }

  function toggleHighlight() {
    highlightDiffs = !highlightDiffs;
    btnHighlight.setAttribute('aria-pressed', String(highlightDiffs));
    update();
  }

  /* ====================================================================
     EVENT LISTENERS
     ==================================================================== */

  for (var i = 0; i < checkboxes.length; i++) {
    checkboxes[i].addEventListener('change', update);
  }

  btnClear.addEventListener('click', clearSelection);
  btnHighlight.addEventListener('click', toggleHighlight);

  /* ====================================================================
     INIT — Restore from URL
     ==================================================================== */

  var urlTiers = readFromUrl();
  if (urlTiers.length > 0) {
    for (var i = 0; i < checkboxes.length; i++) {
      if (urlTiers.indexOf(checkboxes[i].value) !== -1) {
        checkboxes[i].checked = true;
      }
    }
  }

  update();

})();
