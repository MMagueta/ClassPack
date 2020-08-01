function myRound(x, p) {
  const mult = Math.pow(10, p);
  return Math.round(mult * x) / mult;
}

let solution;
let cntSolution = 0;

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
  
  const salax =  parseFloat($('#txtLarguraSala').val())// parseFloat($(".param_input")[0].value)*1;
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
  
  // Get problem data
  let values = $(".param_input_fileiras").get().map(e => parseFloat(e.value));

  let rW = values[0];
  let rH = values[1];
  let cW = values[2];
  let cH = values[3];
  let cR = solution.rowSpace;
  let cC = solution.chairSpace;

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
  
  // Get problem data
  let values = $(".param_input_fileiras").get().map(e => parseFloat(e.value));

  let rW = values[0]*1.5;
  let rH = values[1]*1.5;
  let cW = values[2]*1.5;
  let cH = values[3]*1.5;
  let cR = solution.rowSpace*1.5;
  let cC = solution.chairSpace*1.5;

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
            $('#txtComprimentoCarteira').val() !== ''
  }

  function checkCalcularFormExtra() {
    const selectedModo = parseInt($('#selectModo').val())

    if(selectedModo) { // Modo livre
      return  $('#txtDistanciaMinima').val() !== '' &&
              (
                ($('#radioInserir').is(':checked') && $('#txtQuantidadeCarteirasRadio').val() !== '') || 
                $('#radioMaxima').is(':checked')
              )
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

    const selectedModo = parseInt($('#selectModo').val())

    if(selectedModo) { // Modo livre
      $("#result").empty()
      solution = null
      
      $("#result").append('<div id="summary" class="text-center"></div>')
      $("#sectionSeparator").show()
      $("#sectionResults").show()
      
      var values = $(".param_input").map(function() {
          return this.value
      })
      json_data = {}
      var step = 1;
      for (var i = 0 ; i < values.length; i++) {
        if(i == 5){
          json_data[(i+1).toString()] = "100"
          json_data[(i+2).toString()] = values[i]
          step++
        }else{
          json_data[(i+step).toString()] = values[i]
        }
      }
  
      // Optimization type
      optType = $("input[name=radio-options]:checked")[0].value
      json_data[(i + step).toString()] = optType;
      step++;
      
      if (optType == "1") {
        value = $("#txtQuantidadeCarteirasRadio").val()
        json_data[(i + step).toString()] = (value == "") ? "1" : value
      }
      console.log('jsonData',json_data)
      $("#result").append('<img src="assets/img/loading.gif" id="loading"></img>');
      $.ajax({
        url: "http://200.144.93.70/a/optimize",
        type: "GET",
        data: json_data,
        crossDomain: true,
        dataType: 'jsonp',
        // set the request header authorization to the bearer token that is generated
        success: function(result) {
          console.log('res',result)
          
          $("#loading").remove()
          if(result["found_solution"] == "True") {
            $("#result").append('<div class="row" id="display_distance"></div>')
            $("#result").append('<div class="row"><canvas id="map" width="300" height="300">Por favor, use um navegador que suporte HTML5.</canvas></div>')
            $("#result").append('<div class="row"><button class="btn btn-success" onclick="drawOptSolution(solution, -1)">&lt;</button>' +
                                '<button class="btn btn-success" onclick="drawOptSolution(solution, +1)">&gt;</button>' +
                                '<button class="btn btn-primary" onclick="downloadCoord(solution)">Baixar Coordenadas (CSV)</button></div>'
                                );
            $("div#summary").append('<center><h1 class="mb-0">Resultados</h1><h3 class="mb-0">Soluções encontradas: '+result["solutions"]+'</h3><h3 class="mb-0">Distância ideal calculada: ' + myRound(result["min_distance"], 2) +'</h3><h3 class="mb-0">Número de carteiras: '+result["number_items"]+'</h3></center>')
            $("div#summary").append("<button class='btn btn-primary' id='download' onclick='download_pdf()'>Baixar PDF</button>")

            solution = result
            cntSolution = 0
            drawOptSolution(solution, 0)
          }else{
            $("div#summary").append('<center><h1 class="mb-0">Resultados</h1><h3 class="mb-0">Soluções encontradas: Nenhuma</h3></center>')
          }
        },
        error: function(request, status, error) {
          $("#loading").remove();
          $("#result").append(
              '<div class="alert alert-danger alert-dismissible fade show">' +
                  'Erro! Verifique seus dados. Caso ocorra novamente, entre em contato com o site.' +
                  '<button type="button" class="close" data-dismiss="alert">' +
                  '&times;</button> </div>'
          )
        },
      })
    } else { // Modo fixo
      $("#result").empty()
      solution = null
      
      $("#result").append('<div id="summary" class="text-center"></div>')

      $("#sectionSeparator").show()
      $("#sectionResults").show()

      var values = $(".param_input_fileiras").map(function() {
          return this.value;
      })
      json_data = {};
      for (var i = 0 ; i < values.length; i++){
          json_data[(i+1).toString()] = values[i];
      }
      console.log(json_data)
      $("#result").append('<img src="assets/img/loading.gif" id="loading" class="text-center"></img>')
      $.ajax({
        url: "http://200.144.93.70/a/rows",
        type: "GET",
        data: json_data,
        crossDomain: true,
        dataType: 'jsonp',
        // set the request header authorization to the bearer token that is generated
        success: function(result) {
          console.log('res',result)

          $("#loading").remove()

          if (result.status) {
            $("#result").append('<div class="row"><canvas id="map" width="300" height="300">Por favor, use um navegador que suporte HTML5.</canvas></div>')
            // Summary
            $("div#summary").
                append('<center><h1 class="mb-0">Resultados</h1>' +
                        '<h3 class="mb-0">Fileiras: ' + result.rows + '</h3>' +
                        '<h3 class="mb-0">Cadeiras: ' + result.chairs + '</h3>' +
                        '<h3 class="mb-0">Número de estudantes: ' + result.students + '</h3></center>')
            $("div#summary").append(
                "<button class='btn btn-primary' id='download' " +
                    "onclick='download_pdf(\"" +
                    result["timestamp"] + "\")'>Baixar PDF</button>"
            )

            // Set the solution to the global variable
            solution = result
            // Draw the solution to canvas
            drawRowSol(solution)
          } else {
            $("div#summary").append('<center><h1 class="mb-0">Resultados</h1><h3 class="mb-0">Não há solução ótima</h3></center>')
          }
        },
        error: function(error) {
          $("#loading").remove()
          $("#result").append(
              '<div class="alert alert-danger alert-dismissible fade show">' +
                  'Erro! Verifique seus dados. Caso ocorra novamente, entre em contato com o site.' +
                  '<button type="button" class="close" data-dismiss="alert">' +
                  '&times;</button> </div>'
          )
        },
      })
    }
  })
})