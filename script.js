document.addEventListener("DOMContentLoaded", function() {
    console.log("%cSTOP!", "color: red; font-size: 40px; font-weight: bold; text-shadow: 2px 2px black;");
    console.log("%cVocê encontrou a área de desenvolvedor.", "color: #0d6efd; font-size: 16px; font-weight: bold;");
    console.log("%cSe você está lendo isso, provavelmente compartilha da mesma paixão de ver como as coisas funcionam. Vamos conversar!", "color: #e0e0e0; font-size: 14px;");

    let tituloOriginal = document.title;
    window.addEventListener('blur', () => {
        document.title = "⚠️ SYSTEM_PAUSED | Volte logo!";
    });

    window.addEventListener('focus', () => {
        document.title = tituloOriginal;
    });

    const konamiCode = [
        "ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", 
        "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", 
        "b", "a"
    ];
    let konamiIndex = 0;

    document.addEventListener('keydown', (e) => {
        if (e.key === konamiCode[konamiIndex]) {
            konamiIndex++;
            if (konamiIndex === konamiCode.length) {
                ativarModoHacker();
                konamiIndex = 0;
            }
        } else {
            konamiIndex = 0;
        }
    });

    function ativarModoHacker() {
        alert("ACCESS GRANTED: Root privileges enabled.");
        document.documentElement.style.setProperty('--cor-destaque', '#00ff00');
        const terminalBody = document.querySelector('.terminal-body');
        if(terminalBody) terminalBody.style.color = '#00ff00';
    }

    const limiteRecargas = 6;
    let contadorBoot = localStorage.getItem('bootCounter');

    if (contadorBoot === null) {
        contadorBoot = 0;
    } else {
        contadorBoot = parseInt(contadorBoot);
    }
    if (contadorBoot === 0 || contadorBoot >= limiteRecargas) {
        iniciarReboot(true);
        localStorage.setItem('bootCounter', '1');
    } else {
        localStorage.setItem('bootCounter', (contadorBoot + 1).toString());
    }

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
    const secaoEstatisticas = document.getElementById('estatisticas-sistema');
    let estatisticasAtivadas = false;

    const observador = new IntersectionObserver((entradas) => {
        entradas.forEach(entrada => {
            if (entrada.isIntersecting) {
                entrada.target.classList.add('visivel');

                if (entrada.target.id === 'estatisticas-sistema' && !estatisticasAtivadas) {
                    ativarDecodificacaoContadores();
                    estatisticasAtivadas = true;
                }
            }
        });
    }, { threshold: 0.1 });

    secoesAnimadas.forEach(secao => {
        observador.observe(secao);
    });

    async function ativarDecodificacaoContadores() {
        const usuario = 'Eenzo71';
        try {
            const response = await fetch(`https://api.github.com/users/${usuario}`);
            if (response.ok) {
                const data = await response.json();
                const repoCounter = document.getElementById('contador-repos');
                if (repoCounter) repoCounter.setAttribute('data-target', data.public_repos);
            }
        } catch (e) { console.error("Erro offline repos"); }

        const commitCounter = document.getElementById('contador-commits');
        if (commitCounter) {
            const cacheKey = 'github_total_commits_' + usuario;
            const cacheData = localStorage.getItem(cacheKey);
            const agora = new Date().getTime();
            
            let totalCommits = 0;
            let usarCache = false;

            if (cacheData) {
                const json = JSON.parse(cacheData);
                if (agora - json.timestamp < 86400000) {
                    totalCommits = json.count;
                    usarCache = true;
                    console.log("Usando cache de commits para economizar API");
                }
            }

            if (!usarCache) {
                try {
                    console.log("Escaneando repositórios por commits...");
                    const reposRes = await fetch(`https://api.github.com/users/${usuario}/repos?per_page=100`);
                    const repos = await reposRes.json();
                    
                    const promises = repos.map(async (repo) => {
                        const commitsRes = await fetch(`https://api.github.com/repos/${usuario}/${repo.name}/commits?per_page=1`);
                        const linkHeader = commitsRes.headers.get('link');
                        
                        if (linkHeader) {
                            const match = linkHeader.match(/&page=(\d+)>; rel="last"/);
                            return match ? parseInt(match[1]) : 1;
                        } else {
                            const data = await commitsRes.json();
                            return Array.isArray(data) ? data.length : 0;
                        }
                    });

                    const counts = await Promise.all(promises);
                    totalCommits = counts.reduce((a, b) => a + b, 0);

                    localStorage.setItem(cacheKey, JSON.stringify({
                        count: totalCommits,
                        timestamp: agora
                    }));

                } catch (error) {
                    console.error("Erro ao contar commits (provável limite de API):", error);
                    totalCommits = cacheData ? JSON.parse(cacheData).count : 50; 
                }
            }
            
            commitCounter.setAttribute('data-target', totalCommits);
        }

        const stats = document.querySelectorAll('.stat-number');
        stats.forEach(stat => {
            let alvo = parseInt(stat.getAttribute('data-target'));

            if (stat.id === 'contador-techs') alvo = document.querySelectorAll('.item-habilidade').length;
            if (stat.id === 'contador-anos') alvo = new Date().getFullYear() - 2022;

            let iteracoes = 0;
            const intervalo = setInterval(() => {
                stat.innerText = Math.floor(Math.random() * (alvo + 20));
                iteracoes++;
                if (iteracoes >= 40) {
                    clearInterval(intervalo);
                    stat.innerText = alvo;
                }
            }, 50); 
        });
    }

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

    const canvas = document.getElementById('matrix-canvas');
    const wrapper = document.querySelector('.intro-wrapper');

    if (canvas && wrapper) {
        const ctx = canvas.getContext('2d');

        function resizeCanvas() {
            canvas.width = wrapper.offsetWidth;
            canvas.height = wrapper.offsetHeight;
        }
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        const assemblyCode = [
            'MOV EAX, 4', 'MOV EBX, 1', 'INT 0x80', 'XOR EAX', 
            'PUSH EBP', 'RET', 'JMP _start', '0x1', '0x0', 
            'DB', 'CMP', 'JE', 'CALL', 'POP'
        ];

        const fontSize = 14;
        const columns = canvas.width / fontSize;
        const drops = [];
        for (let i = 0; i < columns; i++) { drops[i] = 1; }

        function drawMatrix() {
            ctx.fillStyle = 'rgba(18, 18, 18, 0.05)'; 
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.fillStyle = '#0d6efd';
            ctx.font = fontSize + 'px "Courier New", monospace';

            for (let i = 0; i < drops.length; i++) {
                const text = assemblyCode[Math.floor(Math.random() * assemblyCode.length)];
                ctx.fillText(text, i * fontSize, drops[i] * fontSize);

                if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                    drops[i] = 0;
                }
                drops[i]++;
            }
        }
        setInterval(drawMatrix, 50);
    }

    const cmdInput = document.getElementById('cmd-input');
    const terminalOutput = document.getElementById('terminal-output');
    const terminalBody = document.getElementById('terminal-body');

    if (cmdInput) {
        cmdInput.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') {
                const command = cmdInput.value.trim().toLowerCase();
                
                adicionarLinha(`guest@enzo-pc:~$ ${command}`, 'text-secondary');
                
                processarComando(command);
                
                cmdInput.value = '';
                terminalBody.scrollTop = terminalBody.scrollHeight;
            }
        });
    }

    function adicionarLinha(texto, classe = 'text-light') {
        const div = document.createElement('div');
        div.className = `mb-1 ${classe}`;
        div.innerHTML = texto; 
        terminalOutput.appendChild(div);
        terminalBody.scrollTop = terminalBody.scrollHeight; 
    }

    async function processarComando(cmd) {
        switch(cmd) {
            case 'help':
                adicionarLinha("Available commands:");
                adicionarLinha("- <span class='text-warning'>whoami</span>: Identificação do usuário.");
                adicionarLinha("- <span class='text-warning'>skills</span>: Escaneia o DOM por habilidades.");
                adicionarLinha("- <span class='text-warning'>github</span>: Busca dados ao vivo da API do GitHub.");
                adicionarLinha("- <span class='text-warning'>contact</span>: Exibe canais de comunicação.");
                adicionarLinha("- <span class='text-warning'>reboot</span>: Reinicialização do sistema.");
                adicionarLinha("- <span class='text-warning'>clear</span>: Limpa o buffer da tela.");
                break;
            
            case 'whoami':
                adicionarLinha("User: Visitante (Guest)");
                adicionarLinha("Role: Recrutador / Desenvolvedor");
                adicionarLinha("Permissions: <span class='text-success'>Read-Only</span>");
                break;

            case 'skills':
                adicionarLinha("Scanning DOM for class '.item-habilidade'...", "text-secondary");
                
                const skillsElements = document.querySelectorAll('.item-habilidade');
                
                if (skillsElements.length > 0) {
                    let skillsList = "";
                    skillsElements.forEach(el => {
                        skillsList += `[${el.innerText}] `;
                    });
                    
                    setTimeout(() => {
                        adicionarLinha(`Modules Found: <span class='text-success'>${skillsElements.length}</span>`);
                        adicionarLinha(skillsList, "text-info");
                    }, 400);
                } else {
                    adicionarLinha("Error: No skills found in DOM.", "text-danger");
                }
                break;

            case 'github':
                adicionarLinha("Connecting to api.github.com/users/Eenzo71...", "text-secondary");
                
                try {
                    const response = await fetch('https://api.github.com/users/Eenzo71');
                    if (!response.ok) throw new Error('Network response was not ok');
                    
                    const data = await response.json();
                    
                    adicionarLinha(`Status: <span class='text-success'>Connected (200 OK)</span>`);
                    adicionarLinha(`User: <span class='text-warning'>${data.login}</span>`);
                    adicionarLinha(`Bio: "${data.bio || 'Sem bio definida'}"`);
                    adicionarLinha(`Public Repos: <span class='text-success'>${data.public_repos}</span>`);
                    adicionarLinha(`Followers: <span class='text-success'>${data.followers}</span>`);
                    adicionarLinha(`Profile URL: <a href="${data.html_url}" target="_blank" class="text-light text-decoration-underline">${data.html_url}</a>`);
                    
                } catch (error) {
                    adicionarLinha("Error: Failed to fetch GitHub data. Check internet connection.", "text-danger");
                    console.error(error);
                }
                break;

            case 'contact':
                adicionarLinha("Initializing Contact Protocol...");
                adicionarLinha("Email: <a href='https://mail.google.com/mail/?view=cm&fs=1&to=enzo.emanuel.enzo1346@gmail.com' target='_blank' class='text-info'>enzo.emanuel.enzo1346@gmail.com</a>");
                adicionarLinha("LinkedIn: <a href='https://www.linkedin.com/in/enzo-emanuel-a702aa39a/' target='_blank' class='text-info'>Ver Perfil</a>");
                break;
            
            case 'reboot':
                iniciarReboot();
                break;

            case 'clear':
                terminalOutput.innerHTML = '';
                adicionarLinha("Terminal buffer cleared.");
                break;

            case 'sudo':
                adicionarLinha("<span class='text-danger'>Permission denied</span>: user 'guest' is not in the sudoers file. This incident will be reported.");
                break;
                
            case '':
                break;

            default:
                adicionarLinha(`Command not found: '${cmd}'. Type 'help' for assistance.`, 'text-danger');
        }
    }

    function iniciarReboot(apenasAnimacao = false) {
        const overlay = document.getElementById('boot-overlay');
        const content = document.getElementById('boot-content');
        
        if (!overlay) return;

        overlay.classList.remove('d-none');
        content.innerHTML = '';

        const headerLogs = [
            "Starting EnzoOS Kernel v1.0.5...",
            "[    0.000000] Linux version 6.5.0-generic (root@enzo-pc) (gcc version 12.3.0)",
            "[    0.234100] ACPI: DSDT 0x000000008A1B0000 0000F4 (v02 ALASKA A M I)",
        ];
        const logsNormal = [
            ...headerLogs,
            "[ <span class='log-ok'>OK</span> ] Started Show Plymouth Boot Screen.",
            "[ <span class='log-ok'>OK</span> ] Found Device /dev/nvme0n1.",
            "[ <span class='log-ok'>OK</span> ] Mounted /boot/efi.",
            "[ <span class='log-ok'>OK</span> ] Loaded Module: <span class='text-warning'>Konami Cheat Code Support</span>.",
            "Loading Portfolio Modules...",
            "[ <span class='log-ok'>OK</span> ] Started Network Manager.",
            "[ <span class='log-ok'>OK</span> ] Reached target Graphical Interface.",
            "Welcome to Enzo's Portfolio!"
        ];
        const logsSystemError = [
            ...headerLogs,
            "[ <span class='log-ok'>OK</span> ] Started Show Plymouth Boot Screen.",
            "[ <span class='text-danger'>FAILED</span> ] Failed to load Kernel Video Module.",
            "<span class='text-warning'>[ WARN ]</span> Retrying with generic VESA drivers...",
            "[ <span class='log-ok'>OK</span> ] Video Adapter initialized (Low Res).",
            "[ <span class='log-ok'>OK</span> ] Checking cryptic filesystems...",
            "<span class='text-warning'>[ DETECTED ]</span> Legacy 'Konami' backdoor active in memory.",
            "Recovering journals...",
            "[ <span class='log-ok'>OK</span> ] Cleaned up orphaned inodes.",
            "Welcome to Enzo's Portfolio!"
        ];
        const logsNetError = [
            ...headerLogs,
            "[ <span class='log-ok'>OK</span> ] Mounted /boot/efi.",
            "Configuring network interfaces...",
            "[ <span class='text-danger'>FAILED</span> ] DHCP Lease failed on eth0.",
            "[ <span class='text-danger'>FAILED</span> ] Temporary failure in name resolution.",
            "Switching to offline local mode...",
            "[ <span class='log-ok'>OK</span> ] <span class='text-warning'>Konami Protocol</span> found in local cache.",
            "[ <span class='log-ok'>OK</span> ] Bypassing remote authentication.",
            "Starting Graphical Interface...",
            "Welcome to Enzo's Portfolio!"
        ];

        const cenarios = [logsNormal, logsSystemError, logsNetError];
        const logsEscolhidos = cenarios[Math.floor(Math.random() * cenarios.length)];

        let delay = 0;
        
        logsEscolhidos.forEach((line, index) => {
            const tempoExtra = apenasAnimacao ? Math.random() * 150 : Math.random() * 300 + 100;
            delay += tempoExtra;

            setTimeout(() => {
                const p = document.createElement('div');
                p.className = 'boot-log-line';
                const time = (delay / 1000).toFixed(6);
                p.innerHTML = `<span class='log-time'>[ ${time} ]</span> ${line}`;
                content.appendChild(p);
                
                window.scrollTo(0, document.body.scrollHeight); 
                if(content.parentElement) content.parentElement.scrollTop = content.scrollHeight;

            }, delay);
        });

        setTimeout(() => {
            if (apenasAnimacao) {
                overlay.classList.add('d-none');
                window.scrollTo(0, 0); 
            } else {
                overlay.classList.add('d-none');
                window.scrollTo(0, 0);
                location.reload();
            }
        }, delay + 1500);
    }
});