
let arrayLang = {
    "pt": {
        "project_title": "Sala Planejada - UNIFESP",
        "project_name": "Sala Planejada",
        "room_planner": "Planejador de salas",

        "project_desc_1": "A volta às aulas presenciais, mesmo que parcialmente, começam a ser planejadas por governos municipais, estaduais e reitores de universidades. Dentre as medidas que serão adotadas para minimizar o risco de contágio dos alunos e professores pelo coronavírus está o distanciamento entre as carteiras nas salas de aula. Através dessa aplicação, a partir de alguns parâmetros de entrada, é fornecida a disposição ótima para distribuição das carteiras na sala de aula especificada.",
        "project_desc_2": "Para sabermos o quanto a aplicação tem sido utilizada, solicitamos que sejam informados seu nome, instituição da qual faz parte e seu email. Caso já tenha um código de acesso, acesse através da opção 'Tenho um código de acesso'.",

        "inform_data": "Informe seus dados",

        "have_access_code": "Tenho um código de acesso",

        "name_text": "Nome",
        "name_placeholder": "Informe seu nome",

        "inst_text": "Instituição",
        "inst_placeholder": "Informe sua instituição",

        "email_text": "Email",
        "email_placeholder": "Informe seu email",

        "plan_button": "Planejar",

        "auth_problem": "Problemas de autorização. Favor tentar novamente ou entrar em contato com os administradores.",

        "user_reminder": "Este código poderá ser utilizado na tela de login, não sendo necessário inserir suas informações novamente. No futuro, será possível consultar os problemas já resolvidos através dessa chave de acesso.",

        "no_solution": "Não foi possível encontrar uma solução com os dados informados: o problema é muito grande ou não há solução. Caso seu problema seja complexo, entre em contato com salaplanejada@unifesp.br",

        "error_1": "Erro! Verifique as informações inseridas. Caso ocorra novamente, envie um email para salaplanejada@unifesp.br",

        "no_optimal_solution": "Não há solução ótima",

        "solutions_found": "Soluções encontradas:",

        "ideal_dist_calc": "Distância ideal calculada:",

        "desks_qty_text": "Número de carteiras:",

        "rows": "Fileiras",
        "desks": "Cadeiras",
        "student_qty": "Número de estudantes",




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
        "project_title": "Planned Room - UNIFESP",
        "project_name": "Planned Room",
        "room_planner": "Room Planner",

        "project_desc_1": "The return of presencial classes, even if partially, are beginning to be planned by municipal and state governments and university rectors. Among the measures that will be adopted to minimize the risk of contagion of students and teachers by the coronavirus, is the distance between desks in classrooms. Through this measure, from some input parameters, it is provided an optimal distribution of desks in each specified classroom. ",
        "project_desc_2": "To find out how much this application has been used, we request to be informed of your name, institution and email address. If you already have an access code, access through the option ‘I have an access code’.",

        "inform_data": "Enter your data",

        "have_access_code": "I have an access code",//Não foi encontrado no index.htm e nem no script.js

        "name_text": "Name",
        "name_placeholder": "Enter your name",

        "inst_text": "Institution",
        "inst_placeholder": "Enter your institution name",

        "email_text": "Email",
        "email_placeholder": "Enter your email",

        "plan_button": "Start planning",

        "auth_problem": "Authorization problems. Please try again or contact the administrators. ",//Não foi encontrado no index.htm e nem no script.js

        "user_reminder": "This code can be used in the login screen, it is not necessary to enter your information again. In the future, it will be possible to consult the problems already solved through this access key.",//Não foi encontrado no index.htm e nem no script.js

        "no_solution": "It was not possible to find a solution with the informed data: it is a major problem or the issue has no solution. If your problem is complex, contact salaplanejada@unifesp.br.", 

        "error_1": "Error! Check the information entered. If it happens again, send an email to salaplanejada@unifesp.br.",

        "no_optimal_solution": "There is no optimal solution",

        "solutions_found": "Solutions found:",

        "ideal_dist_calc": "Calculated ideal distance:",

        "desks_qty_text": "Number of student desks:",

        "rows": "Rows",
        "desks": "Chairs",
        "student_qty": "Students quantity",


        

        "instruction_title": "Instructions",
        "instruction_desc": "Fill in the dimensions of the room and desk, following the diagram below.  The space for the teacher is always on the right (a space of 2 meters for the teacher is recommended).  The desks also are always right-facing. ",
        "about_label": "About the project",
        "form_title": "Plan the distribution of students based on your classroom.",
        
        "room_dimensions": "Room dimensions",
        "room_width": "Room width (m)",
        "room_length": "Room length (m)",

        "desk_dimensions": "Desk dimensions",
        "desk_width": "Desk width (m)",
        "desk_length": "Desk length (m)",

        "number_tooltip": "Insert whole numbers or decimals separated by periods (.)",
        "integer_tooltip": "Insert whole numbers",

        "can_move": "Can you move your desks?",
        "choose_option": "Choose an option",

        "can_move_meaning": "What does that mean?",
        "can_move_desc": `Choose the option ‘no’ if the room has fixed chairs in 
                          rows,not being possible to configure them in a free way. 
                          That way, the application will indicate the distribution of students
                          around the room. If they are mobile, choose the option ‘yes’, then the
                          application will indicate possible desks distributions to accommodate 
                          students, always respecting the minimum distance (it is recommended 
                          that the distance be at least a meter and a half).`, 

        "no": "No",
        "yes": "Yes",

        "minimum_distance": "Minimum distance between students (m)",
        
        "rows_qty": "Quantity of rows of desks",
        "desks_per_row": "Number of desks per rows",

        "desks_qty": "Desks quantity",
        "maximum": "Maximum",
        "solution_row": "Solution in rows",
        
        "calculate_button": "Calculate",

        "about_text_1": `In context of COVID-19, the return of presencial classes are being planned 
                         by education managers. Among the measures that will be adopted to minimize 
                         the risk of students and teachers contagion by the coronavirus, is the distance 
                         between desks in classrooms. Our contribution consists in a free web app to 
                         help with planning. `,
        "about_text_2": `In our tool, the manager defines the dimension of the classroom, layout by 
                         rows or not and  the minimum distance between students or the quantity of 
                         students in the classroom. From these parameters, the app provides an optimal 
                         distribution: higher permitted number of students in the room or higher possible 
                         distance between the students. `,
        "about_text_3": `For any solution found in the app, the attention turns to the transposition of 
                         the computationally obtained result for the reality of the classroom. In that way, 
                         the app produces a list of instructions on how to perform the optimal distribution  
                         of desks, in cases that it is possible to move the desks, and a map of maximum capacity, 
                         in  cases  that it is not possible to change the rows.`,
        "about_text_4": `It is important to note that, although our focus is the  planning of classrooms, 
                         the developed features can be used in several contexts. For example, layout of seats 
                         in amphitheaters and stadiums, tables in a restaurant, chairs in hospital waiting rooms, 
                         among others. `,
        "about_text_5": `Finally, we emphasize that this tool does not solve others problems inherent to the 
                         return of presencial classes, which are equally fundamental variables to guarantee the 
                         safety of all. Therefore, it can not be used as an isolated strategy to the return of 
                         academic activities, requiring adequate  planning  of the more general context. `,
        "about_unifesp": "Federal University of São Paulo",
        "about_ifsp": "Federal Institute of Education, Science and Technology of São Paulo",
        "about_uem": "State University of Maringá",
        "about_members": "Members",
        "about_institutions": "Institutions",
        "about_extra_1": `Members of the thematic project of FAPESP, “Cutting, packing, lot-sizing, 
                          scheduling, routing and location problems and their integration in industrial 
                          and logistics settings”, grant number 2016/01860-1.`,
        "about_extra_2": `Members of the thematic project of FAPESP, “Computational Methods in Optimization”,
                          grant number 2018/24293-0 and PRONEX-Optimization, financed by FAPERJ and CNPq.`
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


    if(getLanguage() === 'en') {
        $("#imgCarteira").attr("src", "assets/img/carteira-en.png");
        $("#imgCarteira").attr("alt", "Chair description");
        $("#imgSala").attr("src", "assets/img/sala-en.png");
        $("#imgSala").attr("alt", "Room description");
    } else {
        $("#imgCarteira").attr("src", "assets/img/carteira.png");
        $("#imgCarteira").attr("alt", "Descrição da carteira");
        $("#imgSala").attr("src", "assets/img/sala.png");
        $("#imgSala").attr("alt", "Descrição da sala");
    }
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
