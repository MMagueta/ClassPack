
let arrayLang = {
    "pt": {
        "instruction_title": "Instruções",
        "instruction_desc": "Preencha as dimensões da sala e da carteira seguindo o esquema abaixo. O espaço para o professor encontra-se sempre à direita (recomenda-se um espaço de 2 metros para o professor). As carteiras também estão sempre voltadas para a direita.",
        "about_label": "Sobre o projeto",
        "form_title": "Planeje a distribuição dos alunos de acordo com sua sala",
        
        "room_dimensions": "Dimensões da sala",
        "room_width": "Largura da sala (m)",
        "room_length": "Comprimento da sala (m)",

        "desk_dimensions": "Dimensões das carteiras",
        "desk_width": "Largura da carteira (m)",
        "desk_length": "Comprimento da carteira (m)",

        "number_tooltip": "Inserir números inteiros ou decimais separados por ponto (.)",
        "integer_tooltip": "Inserir números inteiros",

        "can_move": "Você pode mover suas carteiras?",
        "choose_option": "Escolha uma opção",

        "can_move_meaning": "O que isso quer dizer?",
        "can_move_desc": `Escolha a opção 'não' caso a sala tenha cadeiras
                        fixas em fileiras, não sendo possível configurá-las de uma
                        forma livre. Dessa maneira, a aplicação irá indicar a
                        distribuição dos estudantes pela sala. Caso elas sejam
                        móveis, selecione a opção 'sim', e serão indicadas
                        possíveis distribuições de carteiras para acomodar os
                        estudantes, respeitando sempre a distância mínima
                        fornecida (recomenda-se que seja de ao menos 1 metro e
                        meio).`,

        "no": "Não",
        "yes": "Sim",

        "minimum_distance": "Distância mínima entre estudantes (m)",
        
        "rows_qty": "Quantidade de fileiras de carteiras",
        "desks_per_row": "Número de carteiras por fileira",

        "desks_qty": "Quantidade de carteiras",
        "maximum": "Máxima",
        "solution_row": "Solução em fileiras",
        
        "calculate_button": "Calcular",

        "about_text_1": `No contexto da COVID-19 a volta às aulas presenciais está sendo
                        planejada por gestores educacionais. Dentre as medidas que serão
                        adotadas para minimizar o risco de contágio dos alunos e
                        professores pelo coronavírus está o distanciamento entre as
                        carteiras nas salas de aula. Nossa contribuição consiste no
                        desenvolvimento de um aplicativo web de livre acesso para
                        auxiliar este planejamento.`,
        "about_text_2": `Na nossa ferramenta, o gestor define a dimensão de sua sala, o
                        layout por fileiras ou não e a distância mínima entre os
                        estudantes ou a quantidade de estudantes na sala. A partir
                        destes parâmetros, o aplicativo fornece a disposição ótima:
                        maior número de alunos na sala ou o maior distanciamento
                        possível entre os estudantes.`,
        "about_text_3": `Para cada solução encontrada no aplicativo, a atenção volta-se
                        para a transposição do resultado obtido computacionalmente para
                        a realidade da sala de aula. Dessa forma, o aplicativo produz
                        uma lista de instruções de como realizar a disposição ótima das
                        carteiras no caso em que for possível realizar a movimentação e
                        um mapa de lotação nos casos em que não há opção de alterar a
                        disposição em fileiras.`,
        "about_text_4": `É interessante ressaltar que, embora nosso foco seja voltado
                        para o planejamento de salas de aulas, os recursos desenvolvidos
                        podem ser utilizados em vários outros contextos. Por exemplo, a
                        disposição de assentos em anfiteatros e estádios, mesas em
                        restaurantes, cadeiras em salas de espera de hospitais, entre
                        outros.`,
        "about_text_5": `Por fim, ressaltamos que esta ferramenta não resolve outros
                        problemas inerentes ao fluxo da volta às aulas, que constituem
                        variáveis igualmente fundamentais para garantir a segurança de
                        todos. Portanto, não pode ser utilizada isoladamente como
                        estratégia para o retorno às atividades acadêmicas, sendo
                        necessário um planejamento adequado do contexto mais geral.`,
        "about_unifesp": "Universidade Federal de São Paulo",
        "about_ifsp": "Instituto Federal de Educação, Ciência e Tecnologia de São Paulo",
        "about_uem": "Universidade Estadual de Maringá",
        "about_members": "Integrantes",
        "about_institutions": "Instituições",
        "about_extra_1": `* Participantes do projeto temático da FAPESP, "Problemas de
                        corte, empacotamento, dimensionamento de lotes, programação da
                        produção, roteamento e localização e suas integrações em
                        contextos industriais e logísticos", processo número
                        2016/01860-1.`,
        "about_extra_2": `** Participante do projeto temático da FAPESP, "Métodos
                        Computacionais de Otimização", processo número 2018/24293-0 e
                        do PRONEX-Otimização, financiado pela FAPERJ e CNPq.`
    },
    "en": {
        "instruction_title": "Instruções",
        "instruction_desc": "Preencha as dimensões da sala e da carteira seguindo o esquema abaixo. O espaço para o professor encontra-se sempre à direita (recomenda-se um espaço de 2 metros para o professor). As carteiras também estão sempre voltadas para a direita.",
        "about_label": "Sobre o projeto",
        "form_title": "Planeje a distribuição dos alunos de acordo com sua sala",
        
        "room_dimensions": "Dimensões da sala",
        "room_width": "Largura da sala (m)",
        "room_length": "Comprimento da sala (m)",

        "desk_dimensions": "Dimensões das carteiras",
        "desk_width": "Largura da carteira (m)",
        "desk_length": "Comprimento da carteira (m)",

        "number_tooltip": "Inserir números inteiros ou decimais separados por ponto (.)",
        "integer_tooltip": "Inserir números inteiros",

        "can_move": "Você pode mover suas carteiras?",
        "choose_option": "Escolha uma opção",

        "no": "Não",
        "yes": "Sim",

        "minimum_distance": "Distância mínima entre estudantes (m)",
        
        "rows_qty": "Quantidade de fileiras de carteiras",
        "desks_per_row": "Número de carteiras por fileira",

        "desks_qty": "Quantidade de carteiras",
        "maximum": "ccccccccccccc",
        "solution_row": "Soaaairas"

    }
}

function getLanguage() {
    localStorage.getItem("language") == null ? setLanguage("pt") : false
    return localStorage.getItem("language")
}

function setLanguage(lang) {
    localStorage.setItem('language', lang)
}

$('#selectLang').change(function() {
    setLanguage($(this).val())

    const langDict = arrayLang[getLanguage()]

    $(".lang").each(function(index, element) {
        $(this).text(langDict[$(this).attr("key")])
    })
    $(".lang-title").each(function(index, element) {
        $(this).prop('title', langDict[$(this).attr("key")])
    })
    $(".lang-value").each(function(index, element) {
        $(this).attr('value', langDict[$(this).attr("key")])
    })
})

$(document).ready(function() {
    const langDict = arrayLang[getLanguage()]

    $(`#selectLang option[value=${getLanguage()}]`).attr('selected','selected');

    $(".lang").each(function(index, element) {
        $(this).text(langDict[$(this).attr("key")])
    })
    $(".lang-title").each(function(index, element) {
        $(this).prop('title', langDict[$(this).attr("key")])
    })
    $(".lang-value").each(function(index, element) {
        $(this).attr('value', langDict[$(this).attr("key")])
    })
})
