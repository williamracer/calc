let diasUteisNecessarios = 0;
let diasUteisSelecionados = [];

function habilitarCampos() {
    document.getElementById("cargaHoraria").disabled = false;
    document.getElementById("horasPorDia").disabled = false;
    document.getElementById("diasUteisCheckbox").disabled = false;
    document.getElementById("mensagemCargaHoraria").style.display = "none";
    document.getElementById("mensagemHorasPorDia").style.display = "none";
}

function calcularDiasUteis() {
    let dataInicialStr = document.getElementById("dataInicial").value;
    let dataInicial = flatpickr.parseDate(dataInicialStr, "d/m/Y");

    if (dataInicial instanceof Date && !isNaN(dataInicial)) {
        document.getElementById("diasUteis").innerText = "";

        let cargaHorariaTotal = parseInt(document.getElementById("cargaHoraria").value);
        let horasPorDia = parseInt(document.getElementById("horasPorDia").value);

        if (!isNaN(cargaHorariaTotal) && !isNaN(horasPorDia) && cargaHorariaTotal > 0 && horasPorDia > 0) {
            diasUteisNecessarios = Math.ceil(cargaHorariaTotal / horasPorDia);
            document.getElementById("diasUteis").innerText = `Quantidade de aulas: ${diasUteisNecessarios}`;
            habilitarCampos();
            diasUteisSelecionados = getDiasUteisSelecionados();
            calcularDataFinal();
        } else {
            document.getElementById("diasUteis").innerText = "Dados inválidos";
            document.getElementById("dataFinal").style.display = "none";
            document.getElementById("relatorio").style.display = "none";
        }
    } else {
        document.getElementById("diasUteis").innerText = "Data inicial inválida";
        document.getElementById("dataFinal").style.display = "none";
        document.getElementById("relatorio").style.display = "none";
    }
}

function getDiasUteisSelecionados() {
    let diasSelecionados = [];
    let checkboxes = document.getElementsByName("diasUteis");

    for (let i = 0; i < checkboxes.length; i++) {
        if (checkboxes[i].checked) {
            diasSelecionados.push(parseInt(checkboxes[i].value));
        }
    }

    return diasSelecionados;
}

function calcularDataFinal() {
    if (diasUteisNecessarios > 0 && diasUteisSelecionados.length > 0) {
        let dataInicialStr = document.getElementById("dataInicial").value;
        let dataInicial = flatpickr.parseDate(dataInicialStr, "d/m/Y");

        if (dataInicial instanceof Date && !isNaN(dataInicial)) {
            let dataFinal = new Date(dataInicial);
            let diasUteisCalculados = 1;

            while (diasUteisCalculados < diasUteisNecessarios) {
                dataFinal.setDate(dataFinal.getDate() + 1);

                if (diasUteisSelecionados.includes(dataFinal.getDay())) {
                    diasUteisCalculados++;
                }
            }

            let dataFinalFormatted = dataFinal.toLocaleDateString("pt-BR");
            let dataFinalTexto = `Data final: ${dataFinalFormatted} - ${diaSemana(dataFinal)}`;
            document.getElementById("dataFinal").innerText = dataFinalTexto;
            document.getElementById("dataFinal").style.display = "block";

            let totalDiasCorridos = calcularTotalDiasCorridos(dataInicial, dataFinal);
            let totalSemanas = calcularTotalSemanas(dataInicial, dataFinal);

            let relatorioTexto = `<p>TOTAL</p>`;
            relatorioTexto += `<p>&#10003; ${diasUteisNecessarios} aulas</p>`;
            relatorioTexto += `<p>&#10003; ${totalDiasCorridos} dias corridos</p>`;
            relatorioTexto += `<p>&#10003; ${totalSemanas} semanas</p>`;
            document.getElementById("relatorio").innerHTML = relatorioTexto;
            document.getElementById("relatorio").style.display = "block";
        } else {
            document.getElementById("dataFinal").innerText = "Data inicial inválida";
            document.getElementById("dataFinal").style.display = "none";
            document.getElementById("relatorio").style.display = "none";
        }
    } else {
        document.getElementById("dataFinal").innerText = "Calcule primeiro os dias úteis necessários";
        document.getElementById("dataFinal").style.display = "none";
        document.getElementById("relatorio").style.display = "none";
    }
}

function diaSemana(data) {
    let diasSemana = ['domingo', 'segunda-feira', 'terça-feira', 'quarta-feira', 'quinta-feira', 'sexta-feira', 'sábado'];
    return diasSemana[data.getDay()];
}

function calcularTotalDiasCorridos(dataInicial, dataFinal) {
    let diffTime = Math.abs(dataFinal - dataInicial);
    let diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
}

function calcularTotalSemanas(dataInicial, dataFinal) {
    let diffTime = Math.abs(dataFinal - dataInicial);
    let diffWeeks = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 7));
    return diffWeeks;
}

flatpickr(".flatpickr", {
    dateFormat: "d/m/Y",
    locale: "pt", // Configurando o idioma para português brasileiro
    defaultDate: null, // Removemos o defaultDate
    inline: true, // Modo de calendário embutido
    onChange: function (selectedDates, dateStr, instance) {
        if (selectedDates.length > 0) {
            habilitarCampos();
            document.getElementById("dataFinal").style.display = "none";
            document.getElementById("relatorio").style.display = "none";
        }
    }
});
