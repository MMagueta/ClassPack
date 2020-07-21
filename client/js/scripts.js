/*!
    * Start Bootstrap - Resume v6.0.0 (https://startbootstrap.com/template-overviews/resume)
    * Copyright 2013-2020 Start Bootstrap
    * Licensed under MIT (https://github.com/BlackrockDigital/startbootstrap-resume/blob/master/LICENSE)
    */
    (function ($) {
    "use strict"; // Start of use strict

    // Smooth scrolling using jQuery easing
    $('a.js-scroll-trigger[href*="#"]:not([href="#"])').click(function () {
        if (
            location.pathname.replace(/^\//, "") ==
                this.pathname.replace(/^\//, "") &&
            location.hostname == this.hostname
        ) {
            var target = $(this.hash);
            target = target.length
                ? target
                : $("[name=" + this.hash.slice(1) + "]");
            if (target.length) {
                $("html, body").animate(
                    {
                        scrollTop: target.offset().top,
                    },
                    1000,
                    "easeInOutExpo"
                );
                return false;
            }
        }
    });

    // Closes responsive menu when a scroll trigger link is clicked
    $(".js-scroll-trigger").click(function () {
        $(".navbar-collapse").collapse("hide");
    });

    // Activate scrollspy to add active class to navbar items on scroll
    $("body").scrollspy({
        target: "#sideNav",
    });
})(jQuery); // End of use strict

function myRound(x, p) {

    const mult = Math.pow(10, p);

    return Math.round(mult * x) / mult;

}

var solution;
var cntSolution = 0;

function downloadCoord(s) {

    let csvContent = "data:text/csv;charset=utf-8," 
        + s.all_solutions[cntSolution].positions.map(
            e => e.map(f => myRound(f, 2)).join(",")
        ).join("\n");

    var encodedUri = encodeURI(csvContent);
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
    ctx.fillRect(px - (cw / 8) * scale, py - (ch / 3) * scale, 
                   cw * scale / 4, (2 * ch)  * scale / 3);
    
    ctx.strokeRect(px - (cw / 8) * scale, py - (ch / 3) * scale, 
                   cw * scale / 4, (2 * ch)  * scale / 3);

    // The table: ch and 3/4 of cw
    ctx.fillRect(px + (ch / 8) * scale, py - (ch / 2) * scale,
                   cw * 3 * scale / 4, ch * scale);
    ctx.strokeRect(px + (ch / 8) * scale, py - (ch / 2) * scale,
                   cw * 3 * scale / 4, ch * scale);

}

/*
  Draw solution `s` at position `cntSolution + move` if this value is
  within the available number of solutions. The solution object `s`
  has to be obtained by the optimization packing strategy.
*/

function drawOptSolution(s, move) {

    if (s == null) return;
    
    cnt = cntSolution + move;
    
    if (cnt < 0 || cnt >= s.all_solutions.length) return;

    cntSolution += move;

    var mycanvas = document.getElementById("map");

    __actuallyDrawOptSolution(mycanvas, s);

    const radius = s.all_solutions[cntSolution].min_distance / 2.0;

    document.getElementById("display_distance").innerHTML = "Distância: " + Math.round(100 * 2 * radius) / 100.0;

    // Hidden canvas for printing
    var mycanvas = document.getElementById("map-hidden");

    __actuallyDrawOptSolution(mycanvas, s);

}

/* Internal function to draw the optimization solution in the
 * canvas. */
function __actuallyDrawOptSolution(mycanvas, s) {

    var ctx = mycanvas.getContext("2d");
    
    const w = mycanvas.width*1;
    const h = mycanvas.height*1;
    
    const salax = parseFloat($(".param_input")[0].value)*1;
    const salay = parseFloat($(".param_input")[1].value)*1;
    const cw = parseFloat($(".param_input")[2].value)*1;
    const ch = parseFloat($(".param_input")[3].value)*1;
    
    const scale = Math.min((w - 50) / salax, (h) / salay);

    clearRoom(ctx, w, h);
    
    drawRoomAndTeacherSpace(ctx, w, h, scale, salax, salay);
    
    currSol = s.all_solutions[cntSolution];

    const radius = currSol.min_distance / 2.0;

    const fontSize = Math.max(10, parseInt(radius * scale / 2.0));
    
    var x, y;

    for (i = 0; i < currSol.positions.length; i++) {

        x = currSol.positions[i][0] * scale;
        y = h - currSol.positions[i][1] * scale;
        
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

        if (y - (ch * scale) / 2 < fontSize)
            ctx.fillText(i + 1, x, y + (ch * scale) / 2);
        else
            ctx.fillText(i + 1, x, y - (ch * scale) / 2);
        
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

    if (s == null) return;
    
    var mycanvas = document.getElementById("map");
    var ctx = mycanvas.getContext("2d");

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

    console.log(rW + " " + rH);
    
    clearRoom(ctx, w, h);

    const scale = Math.min((w - 50) / rW, (h) / rH);

    console.log("Scale:", scale);
    
    drawRoomAndTeacherSpace(ctx, w, h, scale, rW, rH);

    ctx.globalAlpha = 0.8;
    ctx.strokeStyle = "black";
    ctx.lineWidth   = "1";
    ctx.fillStyle   = "#BB8888";

    let py = h - rH * scale + cH * scale / 2;

    for (i = 0; i < solution.rows; i++) {

        let px = cW * scale / 4;
        
        for (j = 0; j < solution.chairs; j++) {

            ctx.fillStyle = "white";
            if (solution.A[i][j] == 1) ctx.fillStyle = "black";

            drawChair(ctx, cW, cH, scale, px, py);

            px += (cW + cC) * scale;

        }

        py += (cH + cR) * scale;

    }
    
}

function drawRowSol_Hidden(s) {

    if (s == null) return;
    
    var mycanvas = document.getElementById("map-hidden");
    var ctx = mycanvas.getContext("2d");

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

    console.log(rW + " " + rH);
    
    clearRoom(ctx, w, h);

    const scale = Math.min((w - 50) / rW, (h) / rH);

    console.log("Scale:", scale);
    
    drawRoomAndTeacherSpace(ctx, w, h, scale, rW, rH);

    ctx.globalAlpha = 0.8;
    ctx.strokeStyle = "black";
    ctx.lineWidth   = "1";
    ctx.fillStyle   = "#BB8888";

    let py = h - rH * scale + cH * scale / 2;

    for (i = 0; i < solution.rows; i++) {

        let px = cW * scale / 4;
        
        for (j = 0; j < solution.chairs; j++) {

            ctx.fillStyle = "white";
            if (solution.A[i][j] == 1) ctx.fillStyle = "black";

            drawChair(ctx, cW, cH, scale, px, py);

            px += (cW + cC) * scale;

        }

        py += (cH + cR) * scale;

    }
    
}

$("#send").click(function(){
    $("#result").empty();
    solution = null;
    
    $("#result").append('<div id="summary" class="text-center"></div>');
    $("#result_section").show();
    var values = $(".param_input").map(function() {
        return this.value;
    })
    json_data = {};
    var step = 1;
    for (var i = 0 ; i < values.length; i++) {
        if(i == 5){
            json_data[(i+1).toString()] = "100";
            json_data[(i+2).toString()] = values[i];
            step++;
        }else{
            json_data[(i+step).toString()] = values[i];
        }
    }
    json_data[(i+step).toString()] = 2;
    $("#result").append('<img src="assets/img/loading.gif" id="loading"></img>');
    $.ajax({
        url: "http://200.144.93.70/a/optimize",
        type: "GET",
        data: json_data,
        crossDomain: true,
        dataType: 'jsonp',
        // set the request header authorization to the bearer token that is generated
        success: function(result) {
            //console.log(result);
            $("#loading").remove();
            if(result["found_solution"] == "True"){
                $("#result").append('<div class="row" id="display_distance"></div>');
                $("#result").append('<div class="row"><canvas id="map" width="300" height="300">Por favor, use um navegador que suporte HTML5.</canvas></div>');
                $("#result").append('<div class="row"><button class="btn btn-success" onclick="drawOptSolution(solution, -1)">&lt;</button>' +
                                    '<button class="btn btn-success" onclick="drawOptSolution(solution, +1)">&gt;</button>' +
                                    '<button class="btn btn-primary" onclick="downloadCoord(solution)">Baixar Coordenadas (CSV)</button></div>'
                                   );
                $("div#summary").append('<center><h1 class="mb-0">Resultados</h1><h3 class="mb-0">Soluções encontradas: '+result["solutions"]+'</h3><h3 class="mb-0">Distância ideal calculada: ' + myRound(result["min_distance"], 2) +'</h3><h3 class="mb-0">Número de carteiras: '+result["number_items"]+'</h3></center>');
                $("div#summary").append("<button class='btn btn-primary' id='download' onclick='download_pdf()'>Baixar PDF</button>");

                solution = result;
                cntSolution = 0;
                drawOptSolution(solution, 0);
              
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
            );
        },
      });
});

$("#send_fileiras").click(function(){
    $("#result").empty();
    solution = null;
    
    $("#result").append('<div id="summary" class="text-center"></div>');
    $("#result_section").show();
    var values = $(".param_input_fileiras").map(function(){
        return this.value;
    })
    json_data = {};
    for (var i = 0 ; i < values.length; i++){
        json_data[(i+1).toString()] = values[i];
    }
    $("#result").append('<img src="assets/img/loading.gif" id="loading" class="text-center"></img>');
    $.ajax({
        url: "http://200.144.93.70/a/rows",
        type: "GET",
        data: json_data,
        crossDomain: true,
        dataType: 'jsonp',
        // set the request header authorization to the bearer token that is generated
        success: function(result) {
            $("#loading").remove();
            if (result.status) {
                $("#result").append('<div class="row"><canvas id="map" width="300" height="300">Por favor, use um navegador que suporte HTML5.</canvas></div>');
                // Summary
                $("div#summary").
                    append('<center><h1 class="mb-0">Resultados</h1>' +
                           '<h3 class="mb-0">Fileiras: ' + result.rows + '</h3>' +
                           '<h3 class="mb-0">Cadeiras: ' + result.chairs + '</h3>' +
                           '<h3 class="mb-0">Número de estudantes: ' + result.students + '</h3></center>');
                $("div#summary").append(
                    "<button class='btn btn-primary' id='download' " +
                        "onclick='download_pdf(\"" +
                        result["timestamp"] + "\")'>Baixar PDF</button>"
                );

            // Set the solution to the global variable
            solution = result;
            // Draw the solution to canvas
                drawRowSol(solution);
            }
            else{
                $("div#summary").append('<center><h1 class="mb-0">Resultados</h1><h3 class="mb-0">Não há solução ótima</h3></center>');
            }
        },
        error: function(error) {
            $("#loading").remove();
            $("#result").append(
                '<div class="alert alert-danger alert-dismissible fade show">' +
                    'Erro! Verifique seus dados. Caso ocorra novamente, entre em contato com o site.' +
                    '<button type="button" class="close" data-dismiss="alert">' +
                    '&times;</button> </div>'
            );
        },
      });
});

$(document).ready(function(){
    var fixed = 0;
    $("#form_num_obstaculos").focusout(function(){
        for (var i = 1; i <= fixed; i++){
            if ($("#form_inputs_obstaculos" + i)) {
                $("#form_inputs_obstaculos" + i).remove();
                $("#form_radius_obstaculos" + i).remove();
            }
        }
        for (var i = 1; i <= $('#form_num_obstaculos').val(); i++){
            var div = $("<div id='form_inputs_obstaculos"+ i +"' class='form-group'></div>");
            var label = "<h4 class='mb-0'>Posição do obstáculo "+ i +" [X|Y]</h4>";
            var input = "<input type='text' class='form-control double param_input' id='exampleInputPassword1'>";
            $('#form').append(div);
            $('#form_inputs_obstaculos' + i).append(label);
            $('#form_inputs_obstaculos' + i).append(input);
            $('#form_inputs_obstaculos' + i).append(input);
            //Now radius insert
            div = $("<div id='form_radius_obstaculos"+ i +"' class='form-group'></div>");
            label = "<h4 class='mb-0'>Tamanho do raio do obstáculo "+ i +" </h4>";
            input = "<input type='text' class='form-control param_input' id='exampleInputPassword1'>";
            $('#form').append(div);
            $('#form_radius_obstaculos' + i).append(label);
            $('#form_radius_obstaculos' + i).append(input);
        }
        fixed = $("#form_num_obstaculos").val();
    });
    
});

/*
function download_pdf(filename) {
    var req = new XMLHttpRequest();
    req.open("POST", "http://200.144.92.61:443/a/download", true);
    req.responseType = "blob";
    
    req.onreadystatechange = function() {
      console.log(req.readyState)
      console.log(req.status)
      const blob = new Blob([req.response]);
      const url = window.URL.createObjectURL(blob);
    
      const link = document.createElement('a')
      link.href = url
      link.download = "report.pdf"
      link.click()
    }
    var params = "file="+filename;
    req.send(params);
}
*/

/*
function download_pdf(filename){
    var req = new XMLHttpRequest();

    req.open("POST", "http://200.144.93.70/a/reports/"+filename+"/pdf", true);
    req.responseType = "blob";
    req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    req.onreadystatechange = function(){
        if (this.readyState == 4 && this.status == 200){
            var blob = new Blob([this.response], {type: "application/pdf"});
            var url = window.URL.createObjectURL(blob);
            var link = document.createElement('a');
            document.body.appendChild(link);
            link.style = "display: none";
            link.href = url;
            link.download = "Mapeamento.pdf";
            link.click();

            setTimeout(() => {
            window.URL.revokeObjectURL(url);
            link.remove(); } , 60000);
        }
    };
    req.send();
}
*/
function download_pdf(filename){
    printJS({
        printable: 'map-hidden',
        type: 'html',
        style: "#map-hidden {display: block;margin: 0 auto;}"//transform: scale(2.0);margin-top:20%;}"
    })
}

$(document).ready(function(){
    $("#inter").hide();
    $("#result_section").hide();
    $("#inter_fileiras").hide();
    $("#choose").click(function(){
        $("#option_algo").hide();
        if($('input[name="option_algo"]:checked').val() == 'cadeiras'){
            $("#inter").show();
        }else{
            $("#inter_fileiras").show();
        }
    });
});
