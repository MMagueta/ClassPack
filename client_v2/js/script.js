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

    if(podeMoverCadeiras) {
      $('#modoFixo').hide()
      $('#modoLivre').show()
    } else {
      $('#modoLivre').hide()
      $('#modoFixo').show()
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