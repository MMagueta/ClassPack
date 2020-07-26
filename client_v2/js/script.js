$(document).ready(function() {
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

    if(podeMoverCadeiras === 2) {
      $('#modoFixo').hide()
      $('#modoLivre').show()
    } else if (podeMoverCadeiras === 1) {
      $('#modoLivre').hide()
      $('#modoFixo').show()
    } else {
      $('#modoLivre').hide()
      $('#modoFixo').hide()
    }
  })

  $('.radio-carteiras').change(function(e) {
    e.preventDefault()
    
    const value = $(this).val()

    if(value === 'max') {
      $('#radioInserir').prop("checked", false)
      $('#radioMaxima').prop("checked", true)
    } else {
      $('#radioInserir').prop("checked", true)
      $('#radioMaxima').prop("checked", false)
    }
  })
})