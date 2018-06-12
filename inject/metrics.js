$(document).ready(function() {
  console.warn('Métricas Chrome iniciado');

  const finding = 'finding-element-metrics';
  const selected = 'selected-element-metrics';
  let selectedNumber = 1;

  //resetAll();

  //Inicia a div com as configurações
  createDraggableDiv();
  createCodeSnippet();
  handlers();

  //Mostra elementos que podem ser selecionados
  $('*').hover(
    function(e) {
      //if ($(this).hasClass('prevent-select') || $(this).hasClass(selected)) {
      if ($(this).parents('#draggable-div').length || $(this).attr('id') == 'draggable-div') {
        e.stopPropagation();
        e.preventDefault();
        return false;
      }

      $('.finding-element-metrics').removeClass(finding);
      $(this).addClass(finding);
      e.stopPropagation();
    },
    function(e) {
      $(this).removeClass(finding);
      e.stopPropagation();
    }
  );

  //Marca elemento selecionado
  $(document).on('click', '*', function(e) {
    //if ($(this).hasClass('prevent-select')) {
    if ($(this).parents('#draggable-div').length || $(this).attr('id') == 'draggable-div') {
      e.stopPropagation();
      e.preventDefault();
      return false;
    }

    //Se já estiver selecionado, remove a métrica
    if ($(this).hasClass(selected) || $(this).hasClass('floating-number')) {
      removeSelectedElement(this);
    }
    //Se não estiver selecionado, seleciona e inclui um input
    else {
      selectElement(this);
    }

    updateMetricsCount();
    e.stopPropagation();
    e.preventDefault();
    return false;
  });

  function selectElement(el) {
    //Cria a estrutura que vai númerar as métricas selecionadas.
    const selectedStructure = '<span class="floating-number float-nr' + selectedNumber + '">' + selectedNumber + '</span>';
    $(el).addClass(selected + ' float-nr' + selectedNumber);
    $(el).after(selectedStructure);
    //Posiciona a estrutura próxima ao elemento selecionado.
    const elOffset = $(el).offset();
    $('.floating-number.float-nr' + selectedNumber).offset({ top: elOffset.top - 22, left: elOffset.left });

    //Verifica se a marcação está dentro do viewport, se não estiver posiciona ele embaixo da div selecionada.
    if (!isElementInViewport($('.floating-number.float-nr' + selectedNumber))) {
      $('.floating-number.float-nr' + selectedNumber).offset({ top: elOffset.top + $(el).height() + 6, left: elOffset.left });
    }

    insertInput(selectedNumber);

    //Incrementa número para a próxima métrica
    selectedNumber++;
  }

  function insertInput(number) {
    $('.inputs-metricas').append(inputMetric(number));
  }

  function removeSelectedElement(el) {
    const className = Array.from(el.classList).find(className => className.indexOf('float-nr') !== -1);
    //Remove o span do dom
    $('.floating-number.' + className).remove();
    //Remove a classe do elemento que tinha sido selecionado
    $('.' + className).removeClass(className + ' selected-element-metrics');
  }

  function updatePosition(pos, el) {
    setInterval(function() {
      el.offset({ top: pos.top - 20, left: pos.left });
    }, 100);
  }

  function isElementInViewport(el) {
    //special bonus for those using jQuery
    if (typeof jQuery === 'function' && el instanceof jQuery) {
      el = el[0];
    }
    var rect = el.getBoundingClientRect();
    return rect.top >= 0 && rect.left >= 0 && rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) /*or $(window).height() */ && rect.right <= (window.innerWidth || document.documentElement.clientWidth) /*or $(window).width() */;
  }

  function resetAll() {
    selectedNumber = 1;
    $('.floating-number').remove();
    $('*').removeClass(finding);
    $('*').removeClass(selected);
    $('.spn-metricas-nr').text(0);
  }

  function createDraggableDiv() {
    $('body').prepend(draggableDiv());
    dragElement(document.getElementById('draggable-div'));

    //Posiciona na tela
    $('#draggable-div').css('right', '10px');
  }

  function createCodeSnippet() {
    $('body').prepend(codeSnippet());
  }

  function handlers() {
    $(document).on('click', '.btn-gerar-script', function(e) {
      showCodeSnippet();
    });

    $(document).on('click', '#code-snip-overlay', function(e) {
      hideCodeSnippet();
    });

    $(document).on('click', '.btn-resetar', function(e) {
      resetAll();
    });
  }

  function draggableDiv() {
    return `
	<div id="draggable-div">
		  <div id="draggable-div-header">Selecione...</div>
		  <span class="spn-metricas-selecionadas">Métricas: <span class="spn-metricas-nr">0</span></span>
		  <div class="inputs-metricas"></div>
		  <button class="btn-resetar btn-drag">Resetar Métricas</button>
		  <button class="btn-gerar-script btn-drag">Gerar Script</button>
	</div>`;
  }

  function codeSnippet() {
    return `
	<div id="code-snip-overlay"></div>
	<div class="code-snippet-bg">
		<textarea class="txt-code-snip"></textarea>
		<button class="btn-copiar-script">Copiar</button>
	</div>`;
  }

  function inputMetric(number) {
    return (
      `
	<div class="ipt-metric">
		<span class="spn-num-metric"> ` +
      number +
      `</span>
		<input class="ipt-attr-metric" placeholder="Atributo" type="text"></input>
		<input type="checkbox"></input>
	</div>
	`
    );
  }

  function dragElement(elmnt) {
    var pos1 = 0,
      pos2 = 0,
      pos3 = 0,
      pos4 = 0;
    if (document.getElementById(elmnt.id + '-header')) {
      /* if present, the header is where you move the DIV from:*/
      document.getElementById(elmnt.id + '-header').onmousedown = dragMouseDown;
    } else {
      /* otherwise, move the DIV from anywhere inside the DIV:*/
      elmnt.onmousedown = dragMouseDown;
    }

    function dragMouseDown(e) {
      e = e || window.event;
      // get the mouse cursor position at startup:
      pos3 = e.clientX;
      pos4 = e.clientY;
      document.onmouseup = closeDragElement;
      // call a function whenever the cursor moves:
      document.onmousemove = elementDrag;
      $('#draggable-div').css('opacity', '0.8');
    }

    function elementDrag(e) {
      e = e || window.event;
      // calculate the new cursor position:
      pos1 = pos3 - e.clientX;
      pos2 = pos4 - e.clientY;
      pos3 = e.clientX;
      pos4 = e.clientY;
      // set the element's new position:
      elmnt.style.top = elmnt.offsetTop - pos2 + 'px';
      elmnt.style.left = elmnt.offsetLeft - pos1 + 'px';
      elmnt.style.right = '';
    }

    function closeDragElement() {
      /* stop moving when mouse button is released:*/
      document.onmouseup = null;
      document.onmousemove = null;
      $('#draggable-div').css('opacity', '1');
    }
  }

  function updateMetricsCount() {
    const nrMetricas = $('.selected-element-metrics').length;
    //$('.spn-metricas-nr').text(nrMetricas > 1 ? nrMetricas + ' selecionadas' : nrMetricas + ' selecionada');
    $('.spn-metricas-nr').text(nrMetricas);
  }

  function showCodeSnippet() {
    $('#code-snip-overlay').show();
    $('.code-snippet-bg').show();

    //todo metrics.js
    buildScript();
  }

  function hideCodeSnippet() {
    $('#code-snip-overlay').hide();
    $('.code-snippet-bg').hide();
  }

  function buildScript() {
    let fullJS = '';
    const clickId = 'hue2';
    $('.selected-element-metrics').each(function(idx) {
      const identifier = 'hue';
      const script =
        `$(document).on('click','` +
        identifier +
        `', function(e) {
   trigger.` +
        clickId +
        `.fire('atributo');
   e.stopPropagation();
});
		`;

      if (idx == 0) {
        fullJS += script;
      } else {
        fullJS += '\n' + script;
      }
    });

    $('.txt-code-snip').text(fullJS);
  }
});
