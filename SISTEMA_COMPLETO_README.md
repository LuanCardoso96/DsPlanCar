# DScontrolCar - Sistema de Gestão de Veículos

Sistema completo de gestão de veículos com Firebase, incluindo saídas, agendamentos, documentos e relatórios.

## 🚀 Funcionalidades Implementadas

### ✅ **Sistema Completo de Saídas**
- ✅ Criar nova saída com veículo, motorista, finalidade e quilometragem
- ✅ Concluir saída com quilometragem final e observações
- ✅ Cancelar saída com motivo
- ✅ Editar e excluir saídas
- ✅ Filtros por status, veículo, motorista e período
- ✅ Status: `em_andamento`, `concluida`, `cancelada`

### ✅ **Sistema Completo de Agendamentos**
- ✅ Criar agendamento com título, descrição, veículo e horários
- ✅ Aprovar, rejeitar e cancelar agendamentos
- ✅ Editar e excluir agendamentos
- ✅ Filtros por status, veículo e período
- ✅ Status: `pendente`, `aprovado`, `rejeitado`, `cancelado`

### ✅ **Sistema Completo de Documentos**
- ✅ Upload de documentos PDF para Firebase Storage
- ✅ Associar documentos a veículos ou pessoas
- ✅ Controle de vencimento de documentos
- ✅ Download de documentos
- ✅ Substituir e excluir documentos
- ✅ Tipos: CNH, CRLV, Seguro, Manutenção, Outros

### ✅ **Sistema de Relatórios**
- ✅ Estatísticas em tempo real
- ✅ Filtros por período, veículo e motorista
- ✅ Quilometragem total rodada
- ✅ Veículo mais usado e motorista mais ativo
- ✅ Documentos vencendo em breve
- ✅ Atividade recente

### ✅ **Dashboard Atualizado**
- ✅ Dados reais do Firestore
- ✅ Contadores de saídas em andamento
- ✅ Contadores de agendamentos pendentes
- ✅ Últimas saídas e próximos agendamentos
- ✅ Alertas automáticos

## 🗄️ **Estrutura do Banco de Dados (Firestore)**

### **Coleção: `saidas`**
```javascript
{
  vehicleId: string,        // ID do veículo
  driverId: string,         // ID do motorista (pessoa)
  purpose: string,         // Finalidade da saída
  odometerStart: number,   // Quilometragem inicial
  odometerEnd: number,     // Quilometragem final (null se em andamento)
  startedAt: Timestamp,   // Data/hora de início
  endedAt: Timestamp,     // Data/hora de fim (null se em andamento)
  status: string,          // "em_andamento" | "concluida" | "cancelada"
  notes: string,          // Observações
  createdAt: Timestamp,   // Data de criação
  updatedAt: Timestamp    // Data de atualização
}
```

### **Coleção: `agendamentos`**
```javascript
{
  vehicleId: string,       // ID do veículo
  requesterId: string,     // ID do solicitante
  driverId: string,        // ID do motorista (opcional)
  title: string,          // Título do agendamento
  description: string,     // Descrição
  startAt: Timestamp,     // Data/hora de início
  endAt: Timestamp,       // Data/hora de fim
  status: string,         // "pendente" | "aprovado" | "rejeitado" | "cancelado"
  createdAt: Timestamp,   // Data de criação
  updatedAt: Timestamp    // Data de atualização
}
```

### **Coleção: `documentos`**
```javascript
{
  vehicleId: string,       // ID do veículo (opcional)
  personId: string,        // ID da pessoa (opcional)
  title: string,          // Título do documento
  type: string,           // "CNH" | "CRLV" | "Seguro" | "Manutenção" | "Outros"
  expiresAt: Timestamp,   // Data de vencimento (opcional)
  filePath: string,       // Caminho no Storage
  fileUrl: string,        // URL de download
  uploadedAt: Timestamp,  // Data de upload
  uploadedBy: string      // ID do usuário que fez upload
}
```

## 🔧 **Configuração do Firebase**

### **1. Regras do Firestore (`firestore.rules`)**
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    function isSignedIn() { 
      return request.auth != null; 
    }
    
    match /{document=**} {
      allow read, write: if isSignedIn();
    }
  }
}
```

### **2. Regras do Storage (`storage.rules`)**
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    function isSignedIn() { 
      return request.auth != null; 
    }
    
    match /documents/{allPaths=**} {
      allow read, write: if isSignedIn();
    }
  }
}
```

### **3. Índices do Firestore (`firestore.indexes.json`)**
```json
{
  "indexes": [
    {
      "collectionGroup": "saidas",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "status", "order": "ASCENDING" },
        { "fieldPath": "startedAt", "order": "DESCENDING" }
      ]
    }
    // ... outros índices
  ]
}
```

## 📁 **Estrutura de Arquivos**

```
src/
├── services/
│   ├── FirestoreService.js    # Todas as funções CRUD do Firestore
│   └── StorageService.js      # Upload/download de arquivos
├── firebase/
│   └── config.js              # Configuração do Firebase
├── pages/
│   ├── Dashboard.jsx          # Dashboard com dados reais
│   ├── Saidas.jsx             # Gestão de saídas
│   ├── Agendamentos.jsx       # Gestão de agendamentos
│   ├── Documentos.jsx         # Gestão de documentos
│   ├── Relatorios.jsx         # Relatórios e estatísticas
│   ├── Vehicles.jsx           # Gestão de veículos
│   ├── People.jsx             # Gestão de pessoas
│   └── Layout.jsx             # Layout com navegação atualizada
├── firestore.rules            # Regras de segurança do Firestore
├── storage.rules              # Regras de segurança do Storage
└── firestore.indexes.json     # Índices para consultas otimizadas
```

## 🚀 **Como Usar**

### **1. Instalar Dependências**
```bash
npm install
```

### **2. Configurar Firebase**
- Configure as regras do Firestore e Storage no console do Firebase
- Importe os índices do arquivo `firestore.indexes.json`

### **3. Executar Aplicação**
```bash
npm run dev
```

### **4. Testar Funcionalidades**

#### **Saídas:**
1. Acesse "Saídas" no menu
2. Clique em "Nova Saída"
3. Preencha veículo, motorista, finalidade e quilometragem
4. Salve e veja na lista
5. Teste "Concluir" e "Cancelar"

#### **Agendamentos:**
1. Acesse "Agendamentos" no menu
2. Clique em "Novo Agendamento"
3. Preencha título, veículo, horários
4. Salve e teste "Aprovar"/"Rejeitar"

#### **Documentos:**
1. Acesse "Documentos" no menu
2. Clique em "Enviar Documento"
3. Selecione um arquivo PDF
4. Preencha título e tipo
5. Salve e teste "Baixar"

#### **Relatórios:**
1. Acesse "Relatórios" no menu
2. Use os filtros de período
3. Veja estatísticas em tempo real

## 🔍 **Testes Manuais Obrigatórios**

### ✅ **Teste 1: Saída Completa**
- [x] Criar saída → aparece em "Em Andamento"
- [x] Concluir saída → grava quilometragem final e data de retorno
- [x] Status muda para "Concluída"

### ✅ **Teste 2: Agendamento Completo**
- [x] Criar agendamento → fica "Pendente"
- [x] Aprovar agendamento → aparece em "Próximos Agendamentos" do Dashboard
- [x] Status muda para "Aprovado"

### ✅ **Teste 3: Documento Completo**
- [x] Enviar PDF → salva no Storage e cria documento no Firestore
- [x] Baixar documento → abre PDF no navegador
- [x] Excluir documento → remove do Firestore e Storage

### ✅ **Teste 4: Dashboard em Tempo Real**
- [x] Contadores atualizados automaticamente
- [x] Últimas saídas aparecem corretamente
- [x] Próximos agendamentos aparecem corretamente

## 🎯 **Próximos Passos**

1. **Implementar notificações** para documentos vencendo
2. **Adicionar relatórios em PDF** para impressão
3. **Implementar backup automático** dos dados
4. **Adicionar logs de auditoria** para todas as ações
5. **Implementar permissões granulares** por usuário

## 📞 **Suporte**

O sistema está 100% funcional e pronto para uso em produção. Todas as funcionalidades foram testadas e estão integradas com Firebase Firestore e Storage.
