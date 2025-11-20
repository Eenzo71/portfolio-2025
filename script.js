document.addEventListener("DOMContentLoaded", function() {
    
    const elementoTexto = document.getElementById('texto-dinamico');
    
    if (elementoTexto) {
        const frases = [
            "Apaixonado por Hardware", 
            "Um Futuro Security Eng.", 
            "Estudante de C/C++", 
            "Explorador de Sistemas"
        ];
        let indiceFrase = 0;
        let indiceLetra = 0;
        let apagando = false;

        function digitar() {
            const fraseAtual = frases[indiceFrase];
            
            if (apagando) {
                elementoTexto.textContent = fraseAtual.substring(0, indiceLetra - 1);
                indiceLetra--;
            } else {
                elementoTexto.textContent = fraseAtual.substring(0, indiceLetra + 1);
                indiceLetra++;
            }

            let velocidade = apagando ? 50 : 100;

            if (!apagando && indiceLetra === fraseAtual.length) {
                velocidade = 2000;
                apagando = true;
            } else if (apagando && indiceLetra === 0) {
                apagando = false;
                indiceFrase = (indiceFrase + 1) % frases.length;
            }

            setTimeout(digitar, velocidade);
        }
        
        digitar();
    }
    
    const secoesAnimadas = document.querySelectorAll('.animar-entrada');

    const observador = new IntersectionObserver((entradas) => {
        entradas.forEach(entrada => {
            if (entrada.isIntersecting) {
                entrada.target.classList.add('visivel');
            }
        });
    }, { threshold: 0.1 });

    secoesAnimadas.forEach(secao => {
        observador.observe(secao);
    });

    const btnCopiar = document.getElementById('btn-copiar');
    
    if (btnCopiar) {
        btnCopiar.addEventListener('click', function() {
            const email = "enzo.emanuel.enzo1346@gmail.com";
            
            navigator.clipboard.writeText(email).then(() => {
                mostrarNotificacao("E-mail copiado com sucesso!");
            }).catch(err => {
                console.error('Erro ao copiar:', err);
            });
        });
    }

    function mostrarNotificacao(mensagem) {
        const notificacao = document.createElement('div');
        notificacao.textContent = mensagem;
        notificacao.className = 'notificacao-flutuante';

        document.body.appendChild(notificacao);

        setTimeout(() => {
            notificacao.remove();
        }, 2500);
    }
});