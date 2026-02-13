/**
 * METRO PORTO - SISTEMA PROFISSIONAL DE HORÁRIOS
 * @author Specialist Web Dev
 */

const APP = {
    CONFIG: {
        pdfPath: 'assets/horario.pdf',
        cacheKey: 'metro_data_v1'
    },

    // Usa a lista global definida em stations.js ou fallback
    STATIONS: typeof METRO_STATIONS !== 'undefined' ? METRO_STATIONS : [
        { n: "Trindade", lat: 41.1522, lon: -8.6094 },
        { n: "Casa da Música", lat: 41.1603, lon: -8.6293 }
    ],

    async init() {
        this.log("A inicializar sistema...");
        this.loadDatalist();
        this.checkFile();
        this.setupTime();
        this.bindEvents();
    },

    log(msg, isError = false) {
        const consoleEl = document.getElementById('debug-log');
        if (consoleEl) {
            consoleEl.style.display = 'block';
            consoleEl.innerHTML += `<div style="color:${isError ? '#ff4b2b' : '#00ff00'}">> ${msg}</div>`;
            consoleEl.scrollTop = consoleEl.scrollHeight;
        }
    },

    loadDatalist() {
        const list = document.getElementById('paragens-lista');
        if (!list) return;
        
        list.innerHTML = ''; // Limpa lista existente
        this.STATIONS.sort((a,b) => a.n.localeCompare(b.n)).forEach(s => {
            const opt = document.createElement('option');
            opt.value = s.n;
            list.appendChild(opt);
        });
        this.log(`${this.STATIONS.length} estações carregadas.`);
    },

    setupTime() {
        const now = new Date();
        const timeInput = document.getElementById('horaRef');
        if (timeInput) {
            timeInput.value = now.getHours().toString().padStart(2, '0') + ":" + now.getMinutes().toString().padStart(2, '0');
        }
    },

    async checkFile() {
        try {
            const response = await fetch(this.CONFIG.pdfPath, { method: 'HEAD' });
            const statusDot = document.getElementById('file-status');
            if (response.ok) {
                if (statusDot) statusDot.className = 'status-dot green';
                this.log("PDF Detetado e pronto.");
            } else {
                this.log("ERRO 404: PDF não encontrado em /assets/horario.pdf", true);
            }
        } catch (e) {
            this.log("ERRO: Falha na ligação ao servidor de ficheiros.", true);
        }
    },

    // Cálculo de distância usando a fórmula de Haversine para maior precisão
    calculateDistance(lat1, lon1, lat2, lon2) {
        const R = 6371e3; // Raio da Terra em metros
        const φ1 = lat1 * Math.PI/180;
        const φ2 = lat2 * Math.PI/180;
        const Δφ = (lat2-lat1) * Math.PI/180;
        const Δλ = (lon2-lon1) * Math.PI/180;

        const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
                Math.cos(φ1) * Math.cos(φ2) *
                Math.sin(Δλ/2) * Math.sin(Δλ/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

        return R * c;
    },

    getGeo() {
        this.log("A consultar GPS...");
        if (!navigator.geolocation) {
            this.log("Geolocalização não suportada pelo browser.", true);
            return;
        }

        navigator.geolocation.getCurrentPosition(pos => {
            const { latitude, longitude } = pos.coords;
            let closest = this.STATIONS[0];
            let minDist = Infinity;

            this.STATIONS.forEach(s => {
                const dist = this.calculateDistance(latitude, longitude, s.lat, s.lon);
                if (dist < minDist) { 
                    minDist = dist; 
                    closest = s; 
                }
            });

            const inputOrigem = document.getElementById('origem');
            if (inputOrigem) {
                inputOrigem.value = closest.n;
                // Trigger input event to notify any listeners
                inputOrigem.dispatchEvent(new Event('input'));
            }
            this.log(`📍 Localizado em: ${closest.n} (a ${Math.round(minDist)}m)`);
        }, (err) => {
            this.log(`GPS Indisponível: ${err.message}`, true);
        }, {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0
        });
    },

    async syncPDF(force = false) {
        if (!force && localStorage.getItem(this.CONFIG.cacheKey)) {
            return JSON.parse(localStorage.getItem(this.CONFIG.cacheKey));
        }

        this.log("A extrair dados do PDF (Apenas uma vez)...");
        try {
            const pdfjsLib = window['pdfjs-dist/build/pdf'];
            pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
            
            const loadingTask = pdfjsLib.getDocument(this.CONFIG.pdfPath);
            const pdf = await loadingTask.promise;
            let fullText = "";

            for (let i = 1; i <= Math.min(pdf.numPages, 15); i++) {
                const page = await pdf.getPage(i);
                const content = await page.getTextContent();
                fullText += content.items.map(s => s.str).join(" ");
            }

            const times = fullText.match(/\b\d{2}[:.]\d{2}\b/g) || [];
            const cleanTimes = [...new Set(times)].map(t => t.replace('.', ':')).sort();
            
            localStorage.setItem(this.CONFIG.cacheKey, JSON.stringify(cleanTimes));
            this.log("✅ Sincronização Concluída.");
            return cleanTimes;
        } catch (e) {
            this.log("Falha Crítica ao ler PDF. Verifique o nome do ficheiro.", true);
            return [];
        }
    },

    async search() {
        const time = document.getElementById('horaRef').value;
        const resArea = document.getElementById('resultados');
        const origem = document.getElementById('origem').value;

        if (!origem) {
            this.log("Por favor, selecione uma estação.", true);
            return;
        }
        
        resArea.innerHTML = "🔍 A calcular...";
        const data = await this.syncPDF();
        
        const nextTimes = data.filter(t => t > time).slice(0, 5);
        
        if (nextTimes.length > 0) {
            resArea.innerHTML = `<h4>Próximos horários em ${origem}:</h4>` + nextTimes.map(t => `
                <div class="time-card">
                    <div><b>DIREÇÃO PRINCIPAL</b><br><small>Passagem prevista</small></div>
                    <div class="time-val">${t}</div>
                </div>
            `).join('');
        } else {
            resArea.innerHTML = "<p>Sem horários disponíveis para hoje.</p>";
        }
    },

    bindEvents() {
        const btnPesquisar = document.getElementById('btnPesquisar');
        const btnSync = document.getElementById('btnSync');
        const btnGeo = document.getElementById('btnGeo');

        if (btnPesquisar) btnPesquisar.onclick = () => this.search();
        if (btnSync) btnSync.onclick = () => this.syncPDF(true);
        if (btnGeo) btnGeo.onclick = () => this.getGeo();
    }
};

// Inicialização segura
document.addEventListener('DOMContentLoaded', () => {
    APP.init();
});
