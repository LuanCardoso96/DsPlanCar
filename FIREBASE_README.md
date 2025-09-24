# DScontrolCar - Sistema de Gestão de Veículos

Sistema completo de gestão de veículos com autenticação Google e integração Firebase.

## 🚀 Funcionalidades

- **Autenticação Google**: Login seguro com conta Google
- **Gestão de Funcionários**: CRUD completo com Firestore
- **Gestão de Veículos**: Controle da frota
- **Saídas de Veículos**: Registro de saídas e retornos
- **Agendamentos**: Sistema de agendamentos
- **Documentos**: Gestão de documentos
- **Relatórios**: Análises e relatórios
- **Configurações**: Personalização do sistema

## 🔥 Firebase Integration

### Configuração
O projeto está configurado com Firebase Firestore para persistência de dados:

- **Autenticação**: Google Auth Provider
- **Banco de Dados**: Firestore
- **Coleções**:
  - `people` - Funcionários
  - `vehicleExits` - Saídas de veículos
  - `vehicles` - Veículos
  - `schedules` - Agendamentos
  - `documents` - Documentos
  - `users` - Usuários autenticados

### Estrutura dos Dados

#### People Collection
```javascript
{
  name: string,
  email: string,
  phone: string,
  department: string,
  position: string,
  driver_license: string,
  license_category: string,
  license_expiry: string,
  status: "active" | "inactive" | "archived",
  notes: string,
  createdAt: timestamp,
  updatedAt: timestamp
}
```

#### Vehicle Exits Collection
```javascript
{
  vehicle_id: string,
  person_id: string,
  departure_date: string,
  return_date: string,
  destination: string,
  purpose: string,
  status: "in_progress" | "completed" | "cancelled",
  notes: string,
  createdAt: timestamp,
  updatedAt: timestamp
}
```

## 🛠️ Instalação e Execução

1. **Instalar dependências**:
   ```bash
   npm install
   ```

2. **Executar em desenvolvimento**:
   ```bash
   npm run dev
   ```

3. **Build para produção**:
   ```bash
   npm run build
   ```

## 🔐 Autenticação

O sistema utiliza autenticação Google através do Firebase Auth:

1. **Login**: Clique em "Entrar com Google"
2. **Autorização**: Autorize o acesso à sua conta Google
3. **Acesso**: Após login, você terá acesso completo ao sistema

## 📊 Firestore Rules

Para funcionar corretamente, configure as regras do Firestore:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow authenticated users to read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Allow authenticated users to read/write people collection
    match /people/{document} {
      allow read, write: if request.auth != null;
    }
    
    // Allow authenticated users to read/write vehicle exits
    match /vehicleExits/{document} {
      allow read, write: if request.auth != null;
    }
    
    // Allow authenticated users to read/write vehicles
    match /vehicles/{document} {
      allow read, write: if request.auth != null;
    }
    
    // Allow authenticated users to read/write schedules
    match /schedules/{document} {
      allow read, write: if request.auth != null;
    }
    
    // Allow authenticated users to read/write documents
    match /documents/{document} {
      allow read, write: if request.auth != null;
    }
  }
}
```

## 🎨 Personalização

O sistema permite personalização através das configurações:

- **Cores**: Escolha a cor primária do sistema
- **Tema**: Modo claro/escuro
- **Notificações**: Configurações de notificações

## 📱 Responsividade

O sistema é totalmente responsivo e funciona em:
- Desktop
- Tablet
- Mobile

## 🔧 Tecnologias Utilizadas

- **React 18**
- **Vite**
- **Tailwind CSS**
- **Firebase**
- **Firestore**
- **Google Auth**
- **Lucide React** (ícones)
- **Radix UI** (componentes)

## 📝 Licença

Este projeto é propriedade da DS Construções e está protegido por direitos autorais.

---

**Desenvolvido por**: DS Construções  
**Contato**: dsconstrucoesdev@gmail.com
