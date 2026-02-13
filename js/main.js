/**
 * METRO PORTO - SISTEMA PROFISSIONAL DE HORÁRIOS V2.0
 * Melhorias:
 * - Seleção de origem e destino via dropdown
 * - Geolocalização para identificar estação mais próxima
 * - Exibição de múltiplos horários
 * - Interface melhorada e mais intuitiva
 */

const APP = {
    // CONFIGURAÇÕES
    CONFIG: {
        pdfPath: 'assets/horario.pdf',
        cacheKey: 'metro_data_v2',
        cacheExpiry: 24 * 60 * 60 * 1000 // 24 horas
    },

    // LISTA COMPLETA DE ESTAÇÕES DO METRO DO PORTO COM COORDENADAS GPS
    // Organizadas por linha para melhor gestão
    STATIONS: [
        // LINHA A (AZUL) - Senhor de Matosinhos ↔ Estádio do Dragão
        { name: "Senhor de Matosinhos", lat: 41.1864, lon: -8.6946, lines: ["A"] },
        { name: "Mercado", lat: 41.1855, lon: -8.6917, lines: ["A"] },
        { name: "Brito Capelo", lat: 41.1834, lon: -8.6938, lines: ["A"] },
        { name: "Matosinhos Sul", lat: 41.1802, lon: -8.6875, lines: ["A"] },
        { name: "Câmara Matosinhos", lat: 41.1764, lon: -8.6823, lines: ["A"] },
        { name: "Parque Real", lat: 41.1772, lon: -8.6724, lines: ["A"] },
        { name: "Pedro Hispano", lat: 41.1793, lon: -8.6655, lines: ["A"] },
        { name: "Estádio do Mar", lat: 41.1812, lon: -8.6601, lines: ["A"] },
        { name: "Vasco da Gama", lat: 41.1841, lon: -8.6578, lines: ["A"] },
        { name: "Senhora da Hora", lat: 41.1866, lon: -8.6531, lines: ["A", "B", "C"] },
        { name: "Sete Bicas", lat: 41.1795, lon: -8.6493, lines: ["A"] },
        { name: "Viso", lat: 41.1754, lon: -8.6412, lines: ["A"] },
        { name: "Ramalde", lat: 41.1712, lon: -8.6345, lines: ["A"] },
        { name: "Francos", lat: 41.1654, lon: -8.6322, lines: ["A", "C"] },
        { name: "Casa da Música", lat: 41.1603, lon: -8.6293, lines: ["A", "C"] },
        { name: "Carolina Michaelis", lat: 41.1578, lon: -8.6212, lines: ["A"] },
        { name: "Lapa", lat: 41.1554, lon: -8.6145, lines: ["A"] },
        { name: "Trindade", lat: 41.1522, lon: -8.6094, lines: ["A", "B", "C", "D", "E"] },
        { name: "Bolhão", lat: 41.1477, lon: -8.6062, lines: ["A", "B", "C", "D", "E"] },
        { name: "Campo 24 de Agosto", lat: 41.1465, lon: -8.5998, lines: ["A", "F"] },
        { name: "Heroísmo", lat: 41.1462, lon: -8.5923, lines: ["A", "F"] },
        { name: "Campanhã", lat: 41.1501, lon: -8.5852, lines: ["A", "F"] },
        { name: "Estádio do Dragão", lat: 41.1617, lon: -8.5836, lines: ["A"] },

        // LINHA B (VERMELHA) - Póvoa de Varzim ↔ Estádio do Dragão
        { name: "Póvoa de Varzim", lat: 41.3820, lon: -8.7562, lines: ["B"] },
        { name: "Mindelo", lat: 41.3123, lon: -8.7401, lines: ["B"] },
        { name: "Modivas Sul", lat: 41.2891, lon: -8.7289, lines: ["B"] },
        { name: "Vilar de Pinheiro", lat: 41.2712, lon: -8.7198, lines: ["B"] },
        { name: "Pedras Rubras", lat: 41.2556, lon: -8.6891, lines: ["B"] },
        { name: "Aeroporto", lat: 41.2372, lon: -8.6705, lines: ["E"] },
        { name: "Fonte do Cuco", lat: 41.2174, lon: -8.6689, lines: ["B"] },
        { name: "Esposade", lat: 41.2098, lon: -8.6634, lines: ["B"] },
        { name: "Custóias", lat: 41.2034, lon: -8.6589, lines: ["B"] },
        { name: "Crestins", lat: 41.1956, lon: -8.6523, lines: ["B"] },
        
        // LINHA C (VERDE) - ISMAI ↔ Campanhã
        { name: "ISMAI", lat: 41.2134, lon: -8.6234, lines: ["C"] },
        { name: "Araújo", lat: 41.2087, lon: -8.6298, lines: ["C"] },
        { name: "Custió", lat: 41.1998, lon: -8.6401, lines: ["C"] },
        { name: "Fonte do Cuco", lat: 41.1934, lon: -8.6478, lines: ["C"] },
        
        // LINHA D (AMARELA) - Hospital São João ↔ Santo Ovídio
        { name: "Hospital São João", lat: 41.1813, lon: -8.6015, lines: ["D"] },
        { name: "IPO", lat: 41.1698, lon: -8.6089, lines: ["D"] },
        { name: "Pólo Universitário", lat: 41.1612, lon: -8.6134, lines: ["D"] },
        { name: "Salgueiros", lat: 41.1567, lon: -8.6167, lines: ["D"] },
        { name: "Jardim do Morro", lat: 41.1412, lon: -8.6098, lines: ["D"] },
        { name: "General Torres", lat: 41.1389, lon: -8.6134, lines: ["D"] },
        { name: "Santo Ovídio", lat: 41.1147, lon: -8.6069, lines: ["D"] },
        
        // LINHA E (ROXA) - Aeroporto ↔ Estádio do Dragão
        { name: "Custóias", lat: 41.2034, lon: -8.6589, lines: ["E"] },
        
        // LINHA F (LARANJA) - Fânzeres ↔ Senhora da Hora
        { name: "Fânzeres", lat: 41.1751, lon: -8.5306, lines: ["F"] },
        { name: "Rio Tinto", lat: 41.1798, lon: -8.5567, lines: ["F"] }
    ],

    userLocation: null,

    /**
     * INICIALIZAÇÃO DO SISTEMA
     */
    async init() {
        this.log("🚀 A inicializar sistema...");
        this.populateStationSelects();
        this.setupTime();
        this.checkFile();
        this.bindEvents();
        this.setupStationInfo();
        this.log("✅ Sistema pronto!");
    },

    /**
     * REGISTAR MENSAGENS NO CONSOLE DE DEBUG
     */
    log(msg, isError = false) {
        const consoleEl = document.getElementById('debug-log');
        const timestamp = new Date().toLocaleTimeString('pt-PT');
        consoleEl.style.display = 'block';
        consoleEl.innerHTML += `<div style="color:${isError ? '#ff4b2b' : '#00ff00'}">[${timestamp}] ${msg}</div>`;
        consoleEl.scrollTop = consoleEl.scrollHeight;
        
        // Limitar histórico para não sobrecarregar
        const lines = consoleEl.querySelectorAll('div');
        if (lines.length > 50) {
            lines[0].remove();
        }
    },

    /**
     * POPULAR OS DROPDOWNS COM AS ESTAÇÕES
     */
    populateStationSelects() {
        const origemSelect = document.getElementById('origem');
        const destinoSelect = document.getElementById('destino');
        
        // Ordenar estações alfabeticamente
        const sortedStations = [...this.STATIONS].sort((a, b) => 
            a.name.localeCompare(b.name, 'pt-PT')
        );

        sortedStations.forEach(station => {
            // Dropdown de Origem
            const optOrigin = document.createElement('option');
            optOrigin.value = station.name;
            optOrigin.textContent = `${station.name} (${station.lines.join(', ')})`;
            origemSelect.appendChild(optOrigin);

            // Dropdown de Destino
            const optDest = document.createElement('option');
            optDest.value = station.name;
            optDest.textContent = `${station.name} (${station.lines.join(', ')})`;
            destinoSelect.appendChild(optDest);
        });

        this.log(`📊 ${this.STATIONS.length} estações carregadas nos menus`);
    },

    /**
     * CONFIGURAR HORA ATUAL COMO PADRÃO
     */
    setupTime() {
        const now = new Date();
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
        document.getElementById('horaRef').value = `${hours}:${minutes}`;
        this.log(`🕒 Hora definida: ${hours}:${minutes}`);
    },

    /**
     * VERIFICAR SE O PDF ESTÁ DISPONÍVEL
     */
    async checkFile() {
        try {
            const response = await fetch(this.CONFIG.pdfPath, { method: 'HEAD' });
            if (response.ok) {
                document.getElementById('file-status').className = 'status-dot green';
                this.log("✅ PDF detectado e acessível");
            } else {
                document.getElementById('file-status').className = 'status-dot red';
                this.log("❌ ERRO 404: PDF não encontrado em /assets/horario.pdf", true);
            }
        } catch (e) {
            document.getElementById('file-status').className = 'status-dot red';
            this.log("❌ ERRO: Falha na conexão com o servidor", true);
        }
    },

    /**
     * OBTER LOCALIZAÇÃO DO UTILIZADOR E ENCONTRAR ESTAÇÃO MAIS PRÓXIMA
     */
    getGeoLocation() {
        const geoStatus = document.getElementById('geo-status');
        
        if (!navigator.geolocation) {
            this.log("❌ Geolocalização não suportada neste dispositivo", true);
            geoStatus.innerHTML = '<span class="error">❌ Geolocalização não disponível</span>';
            return;
        }

        this.log("📍 A solicitar permissão de localização...");
        geoStatus.innerHTML = '<span class="loading">📡 A localizar...</span>';

        navigator.geolocation.getCurrentPosition(
            (position) => this.onLocationSuccess(position),
            (error) => this.onLocationError(error),
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0
            }
        );
    },

    /**
     * CALLBACK DE SUCESSO DA GEOLOCALIZAÇÃO
     */
    onLocationSuccess(position) {
        const { latitude, longitude } = position.coords;
        this.userLocation = { lat: latitude, lon: longitude };
        
        this.log(`📍 Localização obtida: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);

        // Encontrar a estação mais próxima
        const closestStation = this.findClosestStation(latitude, longitude);
        
        if (closestStation) {
            document.getElementById('origem').value = closestStation.name;
            const distance = closestStation.distance.toFixed(2);
            
            const geoStatus = document.getElementById('geo-status');
            geoStatus.innerHTML = `
                <span class="success">
                    ✅ Estação mais próxima: <strong>${closestStation.name}</strong> 
                    (${distance} km de distância)
                </span>
            `;
            
            this.log(`✅ Estação mais próxima: ${closestStation.name} (${distance} km)`);
            this.updateStationInfo('origem');
        }
    },

    /**
     * CALLBACK DE ERRO DA GEOLOCALIZAÇÃO
     */
    onLocationError(error) {
        const geoStatus = document.getElementById('geo-status');
        let errorMsg = '';
        
        switch(error.code) {
            case error.PERMISSION_DENIED:
                errorMsg = "Permissão de localização negada. Por favor, ative nas definições.";
                break;
            case error.POSITION_UNAVAILABLE:
                errorMsg = "Localização indisponível no momento.";
                break;
            case error.TIMEOUT:
                errorMsg = "Tempo limite excedido ao obter localização.";
                break;
            default:
                errorMsg = "Erro desconhecido ao obter localização.";
        }
        
        this.log(`❌ ${errorMsg}`, true);
        geoStatus.innerHTML = `<span class="error">❌ ${errorMsg}</span>`;
    },

    /**
     * CALCULAR DISTÂNCIA ENTRE DOIS PONTOS GPS (FÓRMULA DE HAVERSINE)
     */
    calculateDistance(lat1, lon1, lat2, lon2) {
        const R = 6371; // Raio da Terra em km
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        
        const a = 
            Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon/2) * Math.sin(dLon/2);
        
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        return R * c;
    },

    /**
     * ENCONTRAR A ESTAÇÃO MAIS PRÓXIMA
     */
    findClosestStation(lat, lon) {
        let closestStation = null;
        let minDistance = Infinity;

        this.STATIONS.forEach(station => {
            const distance = this.calculateDistance(lat, lon, station.lat, station.lon);
            if (distance < minDistance) {
                minDistance = distance;
                closestStation = { ...station, distance };
            }
        });

        return closestStation;
    },

    /**
     * ATUALIZAR INFORMAÇÃO DA ESTAÇÃO SELECIONADA
     */
    updateStationInfo(selectId) {
        const selectElement = document.getElementById(selectId);
        const infoElement = document.getElementById(`${selectId}-info`);
        const stationName = selectElement.value;

        if (!stationName) {
            infoElement.innerHTML = '';
            return;
        }

        const station = this.STATIONS.find(s => s.name === stationName);
        if (station) {
            const lineColors = {
                'A': '#005BAB',
                'B': '#E30613',
                'C': '#95C11E',
                'D': '#FFD400',
                'E': '#6E2E8B',
                'F': '#EE7D00'
            };

            const lineBadges = station.lines.map(line => 
                `<span class="line-badge" style="background-color: ${lineColors[line]}">${line}</span>`
            ).join('');

            infoElement.innerHTML = `<div class="station-detail">${lineBadges}</div>`;
        }
    },

    /**
     * CONFIGURAR EVENTOS DE MUDANÇA NAS ESTAÇÕES
     */
    setupStationInfo() {
        document.getElementById('origem').addEventListener('change', () => {
            this.updateStationInfo('origem');
        });
        
        document.getElementById('destino').addEventListener('change', () => {
            this.updateStationInfo('destino');
        });
    },

    /**
     * SINCRONIZAR DADOS DO PDF
     */
    async syncPDF(force = false) {
        // Verificar cache válido
        const cached = localStorage.getItem(this.CONFIG.cacheKey);
        const cacheTime = localStorage.getItem(this.CONFIG.cacheKey + '_time');
        
        if (!force && cached && cacheTime) {
            const age = Date.now() - parseInt(cacheTime);
            if (age < this.CONFIG.cacheExpiry) {
                this.log("📦 A usar dados em cache (válidos por " + 
                    Math.round((this.CONFIG.cacheExpiry - age) / 3600000) + " horas)");
                return JSON.parse(cached);
            }
        }

        this.log("📄 A extrair horários do PDF...");
        
        try {
            const pdfjsLib = window['pdfjs-dist/build/pdf'];
            pdfjsLib.GlobalWorkerOptions.workerSrc = 
                'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
            
            const loadingTask = pdfjsLib.getDocument(this.CONFIG.pdfPath);
            const pdf = await loadingTask.promise;
            let fullText = "";
            
            this.log(`📖 PDF tem ${pdf.numPages} páginas. A processar...`);

            // Processar todas as páginas (ou limite de 20)
            const maxPages = Math.min(pdf.numPages, 20);
            for (let i = 1; i <= maxPages; i++) {
                const page = await pdf.getPage(i);
                const content = await page.getTextContent();
                fullText += content.items.map(item => item.str).join(" ") + " ";
                
                if (i % 5 === 0) {
                    this.log(`⏳ Processadas ${i}/${maxPages} páginas...`);
                }
            }

            // Extrair horários (formato HH:MM ou HH.MM)
            const timePattern = /\b([0-2][0-9])[:.;,]([0-5][0-9])\b/g;
            const matches = fullText.matchAll(timePattern);
            const times = [];
            
            for (const match of matches) {
                const hour = match[1];
                const minute = match[2];
                times.push(`${hour}:${minute}`);
            }

            // Remover duplicados e ordenar
            const uniqueTimes = [...new Set(times)].sort();
            
            // Guardar em cache
            localStorage.setItem(this.CONFIG.cacheKey, JSON.stringify(uniqueTimes));
            localStorage.setItem(this.CONFIG.cacheKey + '_time', Date.now().toString());
            
            this.log(`✅ Sincronização concluída! ${uniqueTimes.length} horários encontrados`);
            return uniqueTimes;
            
        } catch (error) {
            this.log(`❌ Erro ao processar PDF: ${error.message}`, true);
            return [];
        }
    },

    /**
     * PESQUISAR HORÁRIOS
     */
    async search() {
        const origem = document.getElementById('origem').value;
        const destino = document.getElementById('destino').value;
        const time = document.getElementById('horaRef').value;
        const resArea = document.getElementById('resultados');

        // Validações
        if (!origem) {
            resArea.innerHTML = '<div class="error-card">❌ Por favor, selecione a estação de origem</div>';
            this.log("⚠️ Estação de origem não selecionada", true);
            return;
        }

        if (!destino) {
            resArea.innerHTML = '<div class="error-card">❌ Por favor, selecione a estação de destino</div>';
            this.log("⚠️ Estação de destino não selecionada", true);
            return;
        }

        if (origem === destino) {
            resArea.innerHTML = '<div class="error-card">❌ A origem e o destino não podem ser iguais</div>';
            this.log("⚠️ Origem e destino iguais", true);
            return;
        }

        if (!time) {
            resArea.innerHTML = '<div class="error-card">❌ Por favor, selecione a hora de partida</div>';
            this.log("⚠️ Hora de partida não selecionada", true);
            return;
        }

        // Mostrar loading
        resArea.innerHTML = '<div class="loading-card">🔍 A consultar horários...</div>';
        this.log(`🔍 A pesquisar: ${origem} → ${destino} às ${time}`);

        // Obter dados do PDF
        const allTimes = await this.syncPDF();
        
        if (allTimes.length === 0) {
            resArea.innerHTML = '<div class="error-card">❌ Nenhum horário encontrado no PDF</div>';
            return;
        }

        // Filtrar horários posteriores à hora selecionada
        const nextTimes = allTimes.filter(t => t >= time).slice(0, 5);
        
        if (nextTimes.length === 0) {
            resArea.innerHTML = `
                <div class="info-card">
                    <h4>ℹ️ Sem horários disponíveis</h4>
                    <p>Não há mais partidas hoje após as <strong>${time}</strong>.</p>
                    <p>Primeiro horário de amanhã: <strong>${allTimes[0]}</strong></p>
                </div>
            `;
            this.log("ℹ️ Sem horários disponíveis para hoje");
            return;
        }

        // Calcular tempo de espera
        const waitTime = this.calculateWaitTime(time, nextTimes[0]);

        // Exibir resultados
        resArea.innerHTML = `
            <div class="route-card">
                <div class="route-header">
                    <h4>🚇 ${origem} → ${destino}</h4>
                    <p class="route-subtitle">Hora de partida: ${time}</p>
                </div>
                
                <div class="next-train">
                    <div class="train-label">🚊 Próximo metro</div>
                    <div class="train-time">${nextTimes[0]}</div>
                    <div class="train-wait">${waitTime}</div>
                </div>

                <div class="schedule-list">
                    <h5>📅 Próximas partidas:</h5>
                    ${nextTimes.map((t, index) => `
                        <div class="time-item ${index === 0 ? 'highlight' : ''}">
                            <span class="time-value">${t}</span>
                            <span class="time-diff">${this.calculateWaitTime(time, t)}</span>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;

        this.log(`✅ ${nextTimes.length} horários encontrados`);
    },

    /**
     * CALCULAR TEMPO DE ESPERA
     */
    calculateWaitTime(currentTime, nextTime) {
        const [currentHour, currentMin] = currentTime.split(':').map(Number);
        const [nextHour, nextMin] = nextTime.split(':').map(Number);
        
        const currentMinutes = currentHour * 60 + currentMin;
        const nextMinutes = nextHour * 60 + nextMin;
        
        let diff = nextMinutes - currentMinutes;
        
        if (diff < 0) diff += 24 * 60; // Próximo dia
        
        const hours = Math.floor(diff / 60);
        const minutes = diff % 60;
        
        if (hours === 0) {
            return `em ${minutes} minutos`;
        } else if (hours === 1) {
            return `em 1 hora e ${minutes} minutos`;
        } else {
            return `em ${hours} horas e ${minutes} minutos`;
        }
    },

    /**
     * VINCULAR EVENTOS
     */
    bindEvents() {
        document.getElementById('btnPesquisar').onclick = () => this.search();
        document.getElementById('btnSync').onclick = () => {
            this.log("🔄 Forçando sincronização...");
            this.syncPDF(true);
        };
        document.getElementById('btnGeo').onclick = () => this.getGeoLocation();
    }
};

// Inicializar aplicação quando o DOM estiver pronto
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => APP.init());
} else {
    APP.init();
}
