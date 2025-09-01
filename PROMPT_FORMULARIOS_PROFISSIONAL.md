# PROMPT: Demo - Sistema de Formulários Simples

## 🎯 OBJETIVO
Criar uma **DEMO** de sistema de formulários com **3 telas principais** e design moderno. Foco em mostrar a interface e experiência do usuário.

## 🎨 PALETA DE CORES PREDOMINANTE
**AZUL** como cor principal:
- **Azul Principal**: `#2563eb` (blue-600)
- **Azul Claro**: `#dbeafe` (blue-100) 
- **Azul Escuro**: `#1d4ed8` (blue-700)
- **Azul Suave**: `#eff6ff` (blue-50)
- **Branco**: `#ffffff`
- **Cinza**: `#6b7280` (gray-500) para textos secundários

## 📱 3 TELAS PRINCIPAIS

### **1. TELA DE CRIAÇÃO DE FORMULÁRIOS**
```
┌─────────────────────────────────────────────────────────┐
│ Header: Logo + "Criar Formulário" + Botão Salvar      │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ [Título do Formulário]                                  │
│ [Descrição do Formulário]                               │
│                                                         │
│ ┌─ Card de Pergunta 1 ─┐                               │
│ │ [Título da Pergunta] │                               │
│ │ [Tipo: Dropdown]     │                               │
│ │ [Opções]             │                               │
│ │ [Obrigatória: ✓]     │                               │
│ └───────────────────────┘                               │
│                                                         │
│ [+ Adicionar Pergunta]                                  │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

**Funcionalidades:**
- Input para título e descrição do formulário
- Cards para cada pergunta
- Dropdown para selecionar tipo de pergunta
- Toggle para tornar obrigatória
- Botão para adicionar nova pergunta
- Botão "Salvar" no header

### **2. TELA DE RESPOSTAS**
```
┌─────────────────────────────────────────────────────────┐
│ Header: "Respostas" + Botão Exportar                   │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ ┌─ Estatísticas ─┐                                     │
│ │ Total: 45      │                                     │
│ │ Hoje: 12       │                                     │
│ │ Taxa: 89%      │                                     │
│ └─────────────────┘                                     │
│                                                         │
│ ┌─ Lista de Respostas ─┐                               │
│ │ Resposta #1 - 2min atrás                             │
│ │ Resposta #2 - 5min atrás                             │
│ │ Resposta #3 - 10min atrás                            │
│ │ ...                                                  │
│ └───────────────────────┘                               │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

**Funcionalidades:**
- Cards com estatísticas (total, hoje, taxa de conclusão)
- Lista de respostas com timestamp
- Botão para exportar dados
- Design limpo e organizado

### **3. TELA DE ANALYTICS**
```
┌─────────────────────────────────────────────────────────┐
│ Header: "Analytics" + Período (7d/30d/90d)             │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ ┌─ Gráfico de Respostas ─┐                             │
│ │ [Gráfico de linha]     │                             │
│ │ Respostas por dia      │                             │
│ └─────────────────────────┘                             │
│                                                         │
│ ┌─ Gráfico de Perguntas ─┐                              │
│ │ [Gráfico de pizza]     │                              │
│ │ Distribuição por tipo  │                              │
│ └─────────────────────────┘                             │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

**Funcionalidades:**
- Gráfico de linha mostrando respostas ao longo do tempo
- Gráfico de pizza mostrando tipos de pergunta
- Seletor de período (7 dias, 30 dias, 90 dias)
- Dados mockados para demonstração

## 🎨 DESIGN ELEMENTOS

### **Cards**
- **Background**: Branco (`#ffffff`)
- **Borda**: Azul claro (`#dbeafe`)
- **Sombra**: Sutil para profundidade
- **Border-radius**: 8px

### **Botões**
- **Primário**: Azul (`#2563eb`) com hover azul escuro (`#1d4ed8`)
- **Secundário**: Borda azul com fundo transparente
- **Texto**: Branco para botões primários

### **Inputs**
- **Borda**: Cinza claro (`#d1d5db`)
- **Focus**: Borda azul (`#2563eb`)
- **Background**: Branco

### **Header**
- **Background**: Branco
- **Borda inferior**: Azul claro
- **Texto**: Azul escuro

## 🚀 IMPLEMENTAÇÃO

### **Tecnologias**
- **React/Next.js** com TypeScript
- **Tailwind CSS** para estilização
- **Recharts** para gráficos
- **Lucide React** para ícones

### **Estrutura de Arquivos**
```
app/forms/
├── page.tsx (página principal com tabs)
├── create/page.tsx (criação de formulários)
├── responses/page.tsx (lista de respostas)
└── analytics/page.tsx (gráficos e analytics)

components/forms/
├── FormBuilder.tsx
├── ResponseList.tsx
└── AnalyticsCharts.tsx
```

### **Navegação**
- **Tabs** no topo para alternar entre as 3 telas
- **Design consistente** em todas as telas
- **Transições suaves** entre telas

## 📋 CHECKLIST DE IMPLEMENTAÇÃO

### **Tela 1 - Criação**
- [ ] Header com título e botão salvar
- [ ] Input para título e descrição do formulário
- [ ] Card de pergunta com todos os elementos
- [ ] Dropdown para tipos de pergunta
- [ ] Toggle para obrigatoriedade
- [ ] Botão para adicionar pergunta

### **Tela 2 - Respostas**
- [ ] Header com título e botão exportar
- [ ] Cards de estatísticas
- [ ] Lista de respostas com timestamps
- [ ] Design responsivo

### **Tela 3 - Analytics**
- [ ] Header com seletor de período
- [ ] Gráfico de linha para respostas
- [ ] Gráfico de pizza para tipos
- [ ] Dados mockados realistas

## 🎯 CRITÉRIOS DE SUCESSO

### **Design**
- **Cores azuis predominantes** em toda interface
- **Cards bem definidos** com sombras sutis
- **Tipografia clara** e hierarquia visual
- **Espaçamento consistente** entre elementos

### **Funcionalidade**
- **Navegação intuitiva** entre as 3 telas
- **Interações responsivas** (hover, focus, click)
- **Dados mockados** realistas para demonstração
- **Performance otimizada**

### **Experiência**
- **Carregamento rápido** das telas
- **Feedback visual** para ações do usuário
- **Design moderno** e profissional
- **Responsivo** para diferentes tamanhos de tela

## 💡 DICAS IMPORTANTES

### **Cores**
- **SEMPRE** use tons de azul como cor principal
- **Evite** cores muito contrastantes
- **Mantenha** consistência em toda interface

### **Layout**
- **Cards** para organizar informações
- **Espaçamento generoso** entre elementos
- **Alinhamento** consistente

### **Interatividade**
- **Hover effects** em botões e cards
- **Transições suaves** entre estados
- **Feedback visual** para todas as ações

---

**OBJETIVO FINAL**: Criar uma demo visualmente atrativa que mostre o potencial do sistema de formulários, com foco no design azul e na experiência do usuário.
