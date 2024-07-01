// script.js
document.addEventListener("DOMContentLoaded", () => {
    const tabuleiroJogo = document.getElementById("tabuleiroJogo");
    const botaoIniciar = document.getElementById("botaoIniciar");
    const botaoParar = document.getElementById("botaoParar");
    const dificuldadeSelect = document.getElementById("dificuldade");
    const tempoElemento = document.getElementById("tempo");

    const somParCorreto = document.getElementById("somParCorreto");
    const somErro = document.getElementById("somErro");


    let temporizador;
    let cartasViradas = [];
    let paresEncontrados = 0;
    let totalPares = 0;
    let jogoEmAndamento = false;

    botaoIniciar.addEventListener("click", iniciarJogo);
    botaoParar.addEventListener("click", pararJogo);

    function iniciarJogo() {
        document.getElementById("controlesinicio").style.display = "none";
        document.getElementById("controlesJogando").style.display = "block";

        if (jogoEmAndamento) return;
        jogoEmAndamento = true;
        resetarJogo();
        const dificuldade = dificuldadeSelect.value;
        let tamanhoTabuleiro;
        switch (dificuldade) {
            case "facil":
                tamanhoTabuleiro = 4;
                break;
            case "medio":
                tamanhoTabuleiro = 6;
                break;
            case "dificil":
                tamanhoTabuleiro = 8;
                break;
        }
        totalPares = Math.floor((tamanhoTabuleiro * tamanhoTabuleiro) / 2);
        gerarTabuleiro(tamanhoTabuleiro);
        iniciarTemporizador();
    }

    function resetarJogo() {
        clearInterval(temporizador);
        tempoElemento.textContent = "0";
        tabuleiroJogo.innerHTML = "";
        cartasViradas = [];
        paresEncontrados = 0;
        
    }

    function gerarTabuleiro(tamanho) {
        const valoresCartas = [];
        for (let i = 1; i <= totalPares; i++) {
            valoresCartas.push(i);
            valoresCartas.push(i);
        }
        valoresCartas.sort(() => Math.random() - 0.5);

        const totalCartas = tamanho * tamanho;
        tabuleiroJogo.style.gridTemplateColumns = `repeat(${tamanho}, 1fr)`;
        for (let i = 0; i < totalCartas; i++) {
            const carta = document.createElement("div");
            carta.classList.add("card");
            if (i < valoresCartas.length) {
                carta.dataset.value = valoresCartas[i];
            } else {
                carta.dataset.value = "";
                carta.style.visibility = "hidden"; // Ocultar cartas extras
            }
            carta.addEventListener("click", aoClicarNaCarta);
            tabuleiroJogo.appendChild(carta);
        }
    }

    function aoClicarNaCarta(evento) {
        const carta = evento.target;
        if (cartasViradas.length < 2 && !carta.classList.contains("flipped") && carta.dataset.value) {
            carta.classList.add("flipped");
            carta.textContent = carta.dataset.value;
            cartasViradas.push(carta);
            if (cartasViradas.length === 2) {
                setTimeout(verificarPar, 500);
            }
        }
    }

    function verificarPar() {
        const [carta1, carta2] = cartasViradas;
        if (carta1.dataset.value === carta2.dataset.value) {
            
            carta1.classList.add("matched");
            carta2.classList.add("matched");
            somParCorreto.play();
            paresEncontrados++;
            if (paresEncontrados === totalPares) {
                clearInterval(temporizador);
                setTimeout(() => {
                    alert(`Parabéns! Você completou o jogo em ${tempoElemento.textContent} segundos.`);
                    limparTela();
                }, 500);
            }
        } else {
            carta1.classList.add("error");
            carta2.classList.add("error");
            somErro.play();
            setTimeout(() => {
                carta1.classList.remove("flipped", "error");
                carta2.classList.remove("flipped", "error");

                carta1.textContent = "";
                carta2.textContent = "";
            }, 1000);
        }
        cartasViradas = [];
    }

    function iniciarTemporizador() {
        let tempo = 0;
        temporizador = setInterval(() => {
            tempo++;
            tempoElemento.textContent = tempo;
        }, 1000);
    }

    function pararJogo() {
        if (!jogoEmAndamento) return;
        clearInterval(temporizador);
        limparTela();
    }

    function limparTela() {
        jogoEmAndamento = false;
        resetarJogo();

        document.getElementById("controlesinicio").style.display = "block";
        document.getElementById("controlesJogando").style.display = "none";
    }
});
