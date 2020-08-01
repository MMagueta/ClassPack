let solution;
let cntSolution = 0;

function myRound(x, p) {
  const mult = Math.pow(10, p);
  return Math.round(mult * x) / mult;
}

function downloadCoord(s) {
  const csvContent = "data:text/csv;charset=utf-8," + s.all_solutions[cntSolution].positions.map(e => e.map(f => myRound(f, 2)).join(",")).join("\n");
  const encodedUri = encodeURI(csvContent);
  window.open(encodedUri);
}

function clearRoom(ctx, w, h) {
  ctx.clearRect(0, 0, w, h);
  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, w, h);
}

function drawRoomAndTeacherSpace(ctx, w, h, scale, salax, salay) {
  // Draw room
  ctx.strokeStyle = "black";
  ctx.lineWidth = "1";
  ctx.strokeRect(0, 0, w, h);

  ctx.strokeStyle = "red";
  ctx.lineWidth   = "3";
  ctx.strokeRect(2, h + 2 - salay * scale, salax * scale, salay * scale - 4);

  // Draw teacher space
  ctx.strokeStyle = "red";
  ctx.lineWidth = "1";
  ctx.font = "15px Arial";
  tw = ctx.measureText("P");
  ctx.strokeText("P", w - (50 + tw.width) / 2.0, h - (salay * scale) / 2 + 10);
  ctx.strokeRect(w - 50 + 5, 1, 50 - 5 - 2, h - 2);
}

function drawChair(ctx, cw, ch, scale, px, py) {
  // The chair: 2/3 of ch and 1/4 of cw
  ctx.fillRect(px - (cw / 8) * scale, py - (ch / 3) * scale, cw * scale / 4, (2 * ch)  * scale / 3);
  ctx.strokeRect(px - (cw / 8) * scale, py - (ch / 3) * scale, cw * scale / 4, (2 * ch)  * scale / 3);

  // The table: ch and 3/4 of cw
  ctx.fillRect(px + (ch / 8) * scale, py - (ch / 2) * scale, cw * 3 * scale / 4, ch * scale);
  ctx.strokeRect(px + (ch / 8) * scale, py - (ch / 2) * scale, cw * 3 * scale / 4, ch * scale);
}

/*
Draw solution `s` at position `cntSolution + move` if this value is
within the available number of solutions. The solution object `s`
has to be obtained by the optimization packing strategy.
*/

function drawOptSolution(s, move) {
  if (!s) return;
  
  cnt = cntSolution + move;
  
  if (cnt < 0 || cnt >= s.all_solutions.length) return;

  cntSolution += move;

  const canvas = document.getElementById("map");
  __actuallyDrawOptSolution(canvas, s);

  const radius = s.all_solutions[cntSolution].min_distance / 2.0;
  document.getElementById("display_distance").innerHTML = "Distância: " + Math.round(100 * 2 * radius) / 100.0;

  // Hidden canvas for printing
  const hiddenCanvas = document.getElementById("map-hidden");
  __actuallyDrawOptSolution(hiddenCanvas, s);
}

function download_pdf(filename){
  printJS({
      printable: 'map-hidden',
      type: 'html',
      style: "#map-hidden {display: block;margin: 0 auto;}"//transform: scale(2.0);margin-top:20%;}"
  })
}

/* Internal function to draw the optimization solution in the
* canvas. */
function __actuallyDrawOptSolution(mycanvas, s) {
  const ctx = mycanvas.getContext("2d");
  
  const w = mycanvas.width*1;
  const h = mycanvas.height*1;
  
  const salax =  parseFloat($('#txtLarguraSala').val())
  const salay = parseFloat($('#txtComprimentoSala').val())
  const cw = parseFloat($('#txtLarguraCarteira').val())
  const ch = parseFloat($('#txtComprimentoCarteira').val())
  
  const scale = Math.min((w - 50) / salax, (h) / salay);

  clearRoom(ctx, w, h);
  drawRoomAndTeacherSpace(ctx, w, h, scale, salax, salay);
  
  currSol = s.all_solutions[cntSolution];

  const radius = currSol.min_distance / 2.0;
  const fontSize = Math.max(10, parseInt(radius * scale / 2.0));
  
  for (let i = 0; i < currSol.positions.length; i++) {
    const x = currSol.positions[i][0] * scale;
    const y = h - currSol.positions[i][1] * scale;
    
    ctx.globalAlpha = 0.8;
    ctx.strokeStyle = "black";
    ctx.lineWidth   = "1";
    // Do not paint the chairs
    ctx.fillStyle = "white"

    drawChair(ctx, cw, ch, scale, x, y)

    ctx.globalAlpha = 0.7;
    ctx.fillStyle = "brown";
    ctx.font = fontSize + "px Arial";
    tw = ctx.measureText(i + 1);

    if (y - (ch * scale) / 2 < fontSize) ctx.fillText(i + 1, x, y + (ch * scale) / 2);
    else ctx.fillText(i + 1, x, y - (ch * scale) / 2);
    
    ctx.globalAlpha = 1.0;
  }

  // Draw origin
  ctx.globalAlpha = 0.7;
  ctx.strokeStyle = "red";
  ctx.font = "10px Arial";
  ctx.strokeText("Origem", 2, h - 5);
  ctx.globalAlpha = 1.0;
}

function drawRowSol(s) {
  drawRowSol_Hidden(s);

  if (!s) return;
  
  const mycanvas = document.getElementById("map");
  const ctx = mycanvas.getContext("2d");

  const w = mycanvas.width;
  const h = mycanvas.height;
  
  const rW = parseFloat($('#txtLarguraSala').val())
  const rH = parseFloat($('#txtComprimentoSala').val())
  const cW = parseFloat($('#txtLarguraCarteira').val())
  const cH = parseFloat($('#txtComprimentoCarteira').val())
  const cR = solution.rowSpace;
  const cC = solution.chairSpace;

  clearRoom(ctx, w, h);

  const scale = Math.min((w - 50) / rW, (h) / rH);
  drawRoomAndTeacherSpace(ctx, w, h, scale, rW, rH);

  ctx.globalAlpha = 0.8;
  ctx.strokeStyle = "black";
  ctx.lineWidth   = "1";
  ctx.fillStyle   = "#BB8888";

  let py = h - rH * scale + cH * scale / 2;

  for (let i = 0; i < solution.rows; i++) {
    let px = cW * scale / 4;
    
    for (let j = 0; j < solution.chairs; j++) {
        ctx.fillStyle = "white"
        if (solution.A[i][j] == 1) ctx.fillStyle = "black"

        drawChair(ctx, cW, cH, scale, px, py)
        px += (cW + cC) * scale;
    }

    py += (cH + cR) * scale;
  }
}

function drawRowSol_Hidden(s) {
  if (!s) return;
  
  const mycanvas = document.getElementById("map-hidden");
  const ctx = mycanvas.getContext("2d");

  const w = mycanvas.width;
  const h = mycanvas.height;
  
  const rW = parseFloat($('#txtLarguraSala').val()) * 1.5
  const rH = parseFloat($('#txtComprimentoSala').val()) * 1.5
  const cW = parseFloat($('#txtLarguraCarteira').val()) * 1.5
  const cH = parseFloat($('#txtComprimentoCarteira').val()) * 1.5
  const cR = solution.rowSpace*1.5;
  const cC = solution.chairSpace*1.5;

  clearRoom(ctx, w, h);

  const scale = Math.min((w - 50) / rW, (h) / rH);
  drawRoomAndTeacherSpace(ctx, w, h, scale, rW, rH);

  ctx.globalAlpha = 0.8;
  ctx.strokeStyle = "black";
  ctx.lineWidth   = "1";
  ctx.fillStyle   = "#BB8888";

  let py = h - rH * scale + cH * scale / 2;

  for (let i = 0; i < solution.rows; i++) {
      let px = cW * scale / 4;
      
      for (let j = 0; j < solution.chairs; j++) {
          ctx.fillStyle = "white";
          if (solution.A[i][j] == 1) ctx.fillStyle = "black";

          drawChair(ctx, cW, cH, scale, px, py);
          px += (cW + cC) * scale;
      }

      py += (cH + cR) * scale;
  }
}

function prepareResultsSection() {
  solution = null
  $("#result").empty()
  $("#result").append('<div id="summary" class="text-center"></div>')
  $("#sectionSeparator").show()
  $("#sectionResults").show()
  $("#result").append('<img src="assets/img/loading.gif" id="loading"></img>');
}

function drawFixedLayout(result) {
  $("#result").append('<div class="row"><canvas id="map" width="300" height="300">Por favor, use um navegador que suporte HTML5.</canvas></div>')
  $("div#summary").
      append(`
        <center>
          <h1 class="mb-0">Resultados</h1>
          <h3 class="mb-0">Fileiras: ${result.rows}</h3>
          <h3 class="mb-0">Cadeiras: ${result.chairs}</h3>
          <h3 class="mb-0">Número de estudantes: ${result.students}</h3>
        </center>`
      )
  $("div#summary").append("<button class='btn btn-primary' id='download' onclick='download_pdf()'>Baixar PDF</button>")

  solution = result // Sets the solution to the global variable
  drawRowSol(solution) // Draw the solution to canvas
}

function drawFreeLayout(result) {
  $("#result").append('<div class="row" id="display_distance"></div>')
  $("#result").append('<div class="row"><canvas id="map" width="300" height="300">Por favor, use um navegador que suporte HTML5.</canvas></div>')
  $("#result").append(` <div class="row">
                          <button class="btn btn-success" onclick="drawOptSolution(solution, -1)">&lt;</button>
                          <button class="btn btn-success" onclick="drawOptSolution(solution, +1)">&gt;</button>
                          <button class="btn btn-primary" onclick="downloadCoord(solution)">Baixar Coordenadas (CSV)</button>
                        </div>`);
  $("div#summary").append(`<center><h1 class="mb-0">Resultados</h1><h3 class="mb-0">Soluções encontradas: ${result["solutions"]}</h3><h3 class="mb-0">Distância ideal calculada: ${myRound(result["min_distance"], 2)}</h3><h3 class="mb-0">Número de carteiras: ${result["number_items"]}</h3></center>`)
  $("div#summary").append("<button class='btn btn-primary' id='download' onclick='download_pdf()'>Baixar PDF</button>")

  solution = result
  cntSolution = 0
  drawOptSolution(solution, 0)
}

function errorHandler() {
  $("#loading").remove()
  $("#result").append(`
    <div class="alert alert-danger alert-dismissible fade show">
      Erro! Verifique as informações inseridas dados. Caso ocorra novamente, envie um email para <b>salaplanejada@unifesp.br</b>.
      <button type="button" class="close" data-dismiss="alert">
        &times;
      </button>
    </div>`
  )
}

$(document).ready(function() {
  function checkUsuarioForm() {
    return  $('#txtNome').val() !== '' &&
            $('#txtInstituicao').val() !== '' &&
            $('#txtEmail').val() !== ''
  }

  $('#txtNome,#txtInstituicao,#txtEmail').keyup(function(e) {
    if(checkUsuarioForm()) $('#btnUsuarioSubmit').prop('disabled', false)
    else $('#btnUsuarioSubmit').prop('disabled', true)
  })

  function checkCalcularForm() {
    return  $('#txtLarguraSala').val() !== '' &&
            $('#txtComprimentoSala').val() !== '' &&
            $('#txtLarguraCarteira').val() !== '' &&
            $('#txtComprimentoCarteira').val() !== '' &&
            $('#txtDistanciaMinima').val() !== ''
  }

  function checkCalcularFormExtra() {
    const selectedModo = parseInt($('#selectModo').val())

    if(selectedModo) { // Modo livre
      return  ($('#radioInserir').is(':checked') && $('#txtQuantidadeCarteirasRadio').val() !== '') || 
              $('#radioMaxima').is(':checked')
              
    }
    // Modo fixo
    return  $('#txtQuantidadeFileiras').val() !== '' &&
            $('#txtQuantidadeCarteirasFileira').val() !== ''
  }

  function enableCalcularButton() {
    if(checkCalcularForm() && checkCalcularFormExtra()) $('#btnCalcularSubmit').prop('disabled', false)
    else $('#btnCalcularSubmit').prop('disabled', true)
  }

  $('#txtLarguraSala,#txtComprimentoSala,#txtLarguraCarteira,#txtComprimentoCarteira,#txtQuantidadeFileiras,#txtQuantidadeCarteirasFileira,#txtDistanciaMinima,#txtQuantidadeCarteirasRadio').keyup(function(e) {
    enableCalcularButton()
  })

  $('#frmUsuario').submit(function(e) {
    e.preventDefault()
    
    $('#firstPage').hide()
    $('#secondPage').show()

    // $('#firstPage').show()
    // $('#secondPage').show()
    // var url = form.attr('action')
    
    // $.ajax({
    //   type: "POST",
    //   url: url,
    //   data: form.serialize(),
    //   success: function(data) {
    //       alert(data);
    //   }
    // })
  })

  $('#selectModo').change(function() {
    const podeMoverCadeiras = parseInt($(this).val())

    if(podeMoverCadeiras) { // Modo livre
      $('#modoFixo').hide()
      $('#modoLivre').show()

      $('#txtQuantidadeFileiras,#txtQuantidadeCarteirasFileira').val('')
    } else { // Modo Fixo
      $('#modoLivre').hide()
      $('#modoFixo').show()

      $('#txtDistanciaMinima,#txtQuantidadeCarteirasRadio').val('')
      $('#radioInserir,#radioMaxima').prop("checked", false)
    }

    enableCalcularButton()
  })

  $('.radio-carteiras').change(function(e) {
    e.preventDefault()
    
    const value = $(this).val()

    if(value == '2') {
      $('#radioInserir').prop("checked", false)
      $('#radioMaxima').prop("checked", true)
    } else {
      $('#radioInserir').prop("checked", true)
      $('#radioMaxima').prop("checked", false)
    }

    enableCalcularButton()
  })

  $("#frmCalcular").submit(function(e) {
    e.preventDefault()

    prepareResultsSection()
    
    const selectedModo = parseInt($('#selectModo').val())

    if(selectedModo) { // Modo livre
      const selectedRadio = $("input[name=radio-options]:checked").val()
      const data = {
        1: $("#txtLarguraSala").val(),
        2: $("#txtComprimentoSala").val(),
        3: $("#txtLarguraCarteira").val(),
        4: $("#txtComprimentoCarteira").val(),
        5: $("#txtDistanciaMinima").val(),
        6: "100",
        7: "0",
        8: selectedRadio,
      }
      if (selectedRadio == "1") data[9] = $("#txtQuantidadeCarteirasRadio").val()

      $.ajax({
        url: "http://200.144.93.70/a/optimize",
        type: "GET",
        data,
        crossDomain: true,
        dataType: 'jsonp',
        // set the request header authorization to the bearer token that is generated
        success: function(result) {
          $("#loading").remove()

          if(result["found_solution"] == "True") drawFreeLayout(result)
          else $("div#summary").append('<center><h1 class="mb-0">Resultados</h1><h3 class="mb-0">Soluções encontradas: Nenhuma</h3></center>')
        },
        error: errorHandler
      })
    } else { // Modo fixo
      const data = {
        1: $("#txtLarguraSala").val(),
        2: $("#txtComprimentoSala").val(),
        3: $("#txtLarguraCarteira").val(),
        4: $("#txtComprimentoCarteira").val(),
        5: $("#txtQuantidadeFileiras").val(),
        6: $("#txtQuantidadeCarteirasFileira").val(),
        7: $("#txtDistanciaMinima").val(),
      }
      
      $.ajax({
        url: "http://200.144.93.70/a/rows",
        type: "GET",
        data,
        crossDomain: true,
        dataType: 'jsonp',
        // set the request header authorization to the bearer token that is generated
        success: function(result) {
          $("#loading").remove()

          if (result.status) drawFixedLayout(result)
          else $("div#summary").append('<center><h1 class="mb-0">Resultados</h1><h3 class="mb-0">Não há solução ótima</h3></center>')
        },
        error: errorHandler
      })
    }
  })
})