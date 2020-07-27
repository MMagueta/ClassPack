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

    if(value === 'max') {
      $('#radioInserir').prop("checked", false)
      $('#radioMaxima').prop("checked", true)
    } else {
      $('#radioInserir').prop("checked", true)
      $('#radioMaxima').prop("checked", false)
    }

    enableCalcularButton()
  })
})