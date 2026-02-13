# 🚇 Metro do Porto - Sistema de Consulta de Horários

Aplicação web moderna para consulta de horários de contingência do Metro do Porto com interface intuitiva e recursos avançados.

## ✨ Funcionalidades Principais

### 🎯 **Versão Melhorada**
- ✅ **Dropdowns de Seleção** - Escolha origem e destino sem erros de digitação
- ✅ **Geolocalização Inteligente** - Encontra automaticamente a estação mais próxima
- ✅ **Múltiplos Horários** - Visualize os próximos 5 horários de partida
- ✅ **Tempo de Espera** - Cálculo automático de quanto tempo falta
- ✅ **Interface Moderna** - Design responsivo e intuitivo
- ✅ **Cache Inteligente** - Dados armazenados por 24h para acesso offline
- ✅ **Validações Completas** - Sistema robusto de verificação de dados

## 🚀 Como Usar

### 1️⃣ **Selecionar Estação de Origem**
- Escolha no dropdown OU
- Clique no botão 📍 para usar geolocalização

### 2️⃣ **Selecionar Estação de Destino**
- Escolha sua estação de chegada no dropdown

### 3️⃣ **Definir Hora de Partida**
- O campo já vem preenchido com a hora atual
- Ajuste se necessário

### 4️⃣ **Consultar Horários**
- Clique em "🔍 CONSULTAR HORÁRIOS"
- Veja o próximo metro em destaque
- Confira as próximas partidas

## 📋 Requisitos

- Navegador moderno (Chrome, Firefox, Safari, Edge)
- Conexão à internet (para carregar PDF.js)
- Arquivo `horario.pdf` em `/assets/`

## 🛠️ Instalação

### Opção 1: Desenvolvimento Local
```bash
# Clone o repositório
git clone [url-do-repositorio]

# Coloque o PDF na pasta assets/
cp horario.pdf assets/

# Abra o index.html no navegador
# OU use um servidor local:
python -m http.server 8000
```

### Opção 2: Com Parcel (Recomendado)
```bash
# Instalar dependências
npm install

# Modo desenvolvimento (hot reload)
npm start

# Build para produção
npm run build
```

## 📂 Estrutura do Projeto

```
metro-app-improved/
│
├── index.html                  # Interface principal
├── css/
│   └── styles.css             # Estilos CSS completos
├── js/
│   └── main.js                # Lógica da aplicação
├── assets/
│   └── horario.pdf            # PDF com horários
├── package.json               # Configurações do projeto
└── ANALISE_E_MELHORIAS.md     # Documentação detalhada
```

## 🎨 Linhas do Metro

| Linha | Cor | Estações |
|-------|-----|----------|
| **A** | 🔵 Azul | Senhor de Matosinhos ↔ Estádio do Dragão |
| **B** | 🔴 Vermelho | Póvoa de Varzim ↔ Estádio do Dragão |
| **C** | 🟢 Verde | ISMAI ↔ Campanhã |
| **D** | 🟡 Amarelo | Hospital São João ↔ Santo Ovídio |
| **E** | 🟣 Roxo | Aeroporto ↔ Estádio do Dragão |
| **F** | 🟠 Laranja | Fânzeres ↔ Senhora da Hora |

## 🔧 Tecnologias Utilizadas

- **HTML5** - Estrutura semântica
- **CSS3** - Design moderno e responsivo
- **JavaScript (ES6+)** - Lógica da aplicação
- **PDF.js** - Extração de dados do PDF
- **Geolocation API** - Localização do utilizador
- **LocalStorage API** - Cache de dados

## 📱 Compatibilidade

- ✅ Chrome/Edge (89+)
- ✅ Firefox (88+)
- ✅ Safari (14+)
- ✅ Dispositivos móveis (iOS/Android)

## 🆕 Novidades desta Versão

### Melhorias Implementadas
1. **Dropdowns Profissionais** - Seleção facilitada de estações
2. **Origem + Destino** - Sistema completo de rota
3. **Geolocalização Aprimorada** - Feedback visual rico e tratamento de erros
4. **Cálculo de Tempo** - "em X minutos" ou "em X horas e Y minutos"
5. **Interface Melhorada** - Cards visuais e hierarquia clara
6. **Validações Robustas** - Previne erros do utilizador
7. **Cache Otimizado** - Expira automaticamente após 24h
8. **Bug Fixes** - Correção do erro `App.init()` → `APP.init()`

### Problemas Resolvidos
- ❌ Erros de digitação eliminados
- ❌ Falta de destino corrigida
- ❌ Feedback de geolocalização melhorado
- ❌ Extração de horários mais robusta
- ❌ Bug fatal no JavaScript corrigido

## 📖 Documentação Completa

Para análise detalhada de todas as melhorias implementadas, consulte:
👉 [ANALISE_E_MELHORIAS.md](ANALISE_E_MELHORIAS.md)

## 🤝 Contribuições

Sugestões e melhorias são bem-vindas! Para contribuir:

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'Adiciona MinhaFeature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto é open-source e está disponível sob a licença MIT.

## 💡 Funcionalidades Futuras (Roadmap)

- [ ] Integração com API em tempo real
- [ ] Notificações push de atrasos
- [ ] Modo escuro
- [ ] Favoritos de rotas
- [ ] Histórico de pesquisas
- [ ] PWA (Progressive Web App)
- [ ] Suporte multi-idioma
- [ ] Mapas de percurso

## 🙏 Agradecimentos

- Metro do Porto pela infraestrutura
- PDF.js pela biblioteca de extração
- Comunidade open-source

---

**Desenvolvido com ❤️ para os utilizadores do Metro do Porto**

🌐 Versão: 2.0  
📅 Última atualização: Fevereiro 2026
