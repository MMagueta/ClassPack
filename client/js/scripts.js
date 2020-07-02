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

var solution;
var cntSolution = 0;

function downloadCoord(s) {

    let csvContent = "data:text/csv;charset=utf-8," 
        + s.all_solutions[cntSolution].positions.map(e => e.join(",")).join("\n");

    var encodedUri = encodeURI(csvContent);
    window.open(encodedUri);

}
    
function drawSolution(s, move) {

    if (s == null) return;
    
    var mycanvas = document.getElementById("map");
    var ctx = mycanvas.getContext("2d");

    cnt = cntSolution + move;
    
    if (cnt < 0 || cnt >= s.all_solutions.length) return;

    cntSolution += move;

    const w = mycanvas.width;
    const h = mycanvas.height;
    
    const salax = parseFloat($(".param_input")[3].value);
    const salay = parseFloat($(".param_input")[4].value);
    const scale = Math.min((w - 50) / salax, (h) / salay);

    ctx.clearRect(0, 0, w, h);

    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, w, h);

    // Draw room
    ctx.strokeStyle = "red";
    ctx.lineWidth   = "3";
    ctx.strokeRect(0, h - salay * scale, salax * scale, salay * scale);

    ctx.strokeStyle = "black";
    ctx.lineWidth = "1";
    ctx.strokeRect(0, 0, w, h);

    // Draw teacher space
    ctx.strokeStyle = "red";
    ctx.font = "15px Arial";
    tw = ctx.measureText("P");
    ctx.strokeText("P", w - (50 + tw.width) / 2.0, h - (salay * scale) / 2 + 10);
    ctx.strokeRect(w - 50 + 5, 0, w, h);

    currSol = s.all_solutions[cntSolution];

    radius = currSol.min_distance / 2.0;
    
    document.getElementById("display_distance").innerHTML = "Distância: " + Math.round(100 * 2 * radius) / 100.0;

    var x, y;
    
    for (i = 0; i < currSol.positions.length; i++) {

        x = currSol.positions[i][0] * scale;
        y = h - currSol.positions[i][1] * scale;
        
        ctx.globalAlpha = 0.2;
        ctx.strokeStyle = "black";
        ctx.lineWidth   = "1";
        ctx.fillStyle   = "#BB8888";
        ctx.beginPath();
        ctx.arc(x, y, radius * scale, 0, 2 * Math.PI);
        ctx.fill();
        ctx.stroke();

        ctx.globalAlpha = 0.6;
        ctx.strokeStyle = "black";
        ctx.font = Math.max(5, parseInt(radius * scale / 2.0)) + "px Arial";
        tw = ctx.measureText(i + 1);
        ctx.strokeText(i + 1, x - tw.width / 2.0, y);
        ctx.globalAlpha = 1.0;

    }

    // Draw origin

    ctx.globalAlpha = 0.7;
    ctx.strokeStyle = "red";
    ctx.font = "10px Arial";
    ctx.strokeText("Origem", 2, h - 5);
    ctx.globalAlpha = 1.0;
}

$("#send").click(function(){
    $("#result").empty();
    solution = null;
    
    $("#result").append('<div id="summary"></div>');
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
        url: "http://127.0.0.1:5000/optimize",
        type: "GET",
        data: json_data,
        crossDomain: true,
        dataType: 'jsonp',
        // set the request header authorization to the bearer token that is generated
        success: function(result) {
            //console.log(result);
            if(result["found_solution"] == "True"){
                var button = "<button class='btn btn-primary' id='download' onclick='download_pdf(\""+result["file"].replace(".pdf", "")+"\")'>Baixar PDF</button>";
                $("#loading").remove();
                $("#result").append(button);
                $("#result").append('<div class="row" id="display_distance"></div>');
                $("#result").append('<div class="row"><canvas id="map" width="300" height="300">Por favor, use um navegador que suporte HTML5.</canvas></div>');
                $("#result").append('<div class="row"><button class="btn btn-success" onclick="drawSolution(solution, -1)">&lt;</button>' +
                                    '<button class="btn btn-success" onclick="drawSolution(solution, +1)">&gt;</button>' +
                                    '<button class="btn btn-primary" onclick="downloadCoord(solution)">Baixar Coordenadas (CSV)</button></div>'
                                   );
                $("div#summary").append('<center><h1 class="mb-0">Resultados</h1><h3 class="mb-0">Soluções encontradas: '+result["solutions"]+'</h3><h3 class="mb-0">Distância ideal calculada: '+result["min_distance"]+'</h3><h3 class="mb-0">Número de carteiras: '+result["number_items"]+'</h3></center>');
                solution = result;
                cntSolution = 0;
                drawSolution(solution, 0);
              
          }else{
            $("div#summary").append('<center><h1 class="mb-0">Resultados</h1><h3 class="mb-0">Soluções encontradas: Nenhuma</h3></center>')
          }
          
        },
        error: function(request, status, error) {
            alert("Erro!");
        },
      });
});

$("#send_fileiras").click(function(){
    $("#result").empty();
    $("#result").append('<div id="summary"></div>');
    $("#result_section").show();
    var values = $(".param_input_fileiras").map(function(){
        return this.value;
    })
    json_data = {};
    for (var i = 0 ; i < values.length; i++){
        json_data[(i+1).toString()] = values[i];
    }
    $("#result").append('<img src="assets/img/loading.gif" id="loading"></img>');
    $.ajax({
        url: "http://127.0.0.1:5000/rows",
        type: "GET",
        data: json_data,
        crossDomain: true,
        dataType: 'jsonp',
        // set the request header authorization to the bearer token that is generated
        success: function(result) {
          var button = "<button class='btn btn-primary' id='download' onclick='download_pdf(\""+result["timestamp"]+"\")'>Baixar PDF</button>";
          $("#loading").remove();
          $("#result").append(button);
        },
        error: function(error) {
          alert(error);
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
    req.open("POST", "http://127.0.0.1:5000/download", true);
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
function download_pdf(filename){
    var req = new XMLHttpRequest();

    req.open("POST", "http://127.0.0.1:5000/reports/"+filename+"/pdf", true);
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
