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

$("#send").click(function(){
    $.ajax({
        url: "http://127.0.0.1:5000/optimize",
        type: "GET",
        data: { p1: "1.4", p2: "1", p3: "1", p4: "7", p5: "8.2", p6: "100", p7: "2", p8: "0.5", p9: "0.5", 
        p10: "1",
        p11: "6.5",
        p12: "0.5",
        p13: "0.5",
        p14: "2"} ,
        crossDomain: true,
        dataType: 'jsonp',
        // set the request header authorization to the bearer token that is generated
        success: function(result) {
          //console.log(result);
          var button = "<button class='btn btn-primary' id='download' onclick='download_pdf(\""+result["file"]+"\")'>Baixar PDF</button>";
          $("#result").append(button);
        },
        error: function(error) {
          alert(error);
        },
      });
});

$(document).ready(function(){
    $("#form_num_obstaculos").focusout(function() {
        if ($("#form_num_obstaculos").val() != 0) {
            if ($("#form_inputs_obstaculos")) {
                $("#form_inputs_obstaculos").remove();
            }
            var div = $("<div id='form_inputs_obstaculos' class='form-group'></div>");
            var label = "<h4 class='mb-0'>Tamanho(s) do(s) obstáculo(s) [X|Y]</h4>";
            var input = "<input type='text' class='form-control double' id='exampleInputPassword1'>";
            
            $('#form').append(div);
            $('#form_inputs_obstaculos').append(label);
            for (var i = 0; i < $('#form_num_obstaculos').val()*2; i++){
                $('#form_inputs_obstaculos').append(input);
            }
        }
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
            link.download = "report.pdf";
            link.click();

            setTimeout(() => {
            window.URL.revokeObjectURL(url);
            link.remove(); } , 100);
        }
    };
    req.send();
}