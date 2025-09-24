# 🔧 Configuração do Firebase - Variáveis de Ambiente

## ⚠️ IMPORTANTE: Configure as variáveis de ambiente

Para que o sistema funcione corretamente, você precisa criar um arquivo `.env` na raiz do projeto com as seguintes variáveis:

### 1. Crie o arquivo `.env` na raiz do projeto:

```bash
# Firebase Configuration
VITE_FIREBASE_API_KEY=AIzaSyAostvdG27uYLmXP9aeQrzoK1P3VXKD2lQ
VITE_FIREBASE_AUTH_DOMAIN=dsplancar.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=dsplancar
VITE_FIREBASE_STORAGE_BUCKET=dsplancar.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=813245706461
VITE_FIREBASE_APP_ID=1:813245706461:web:dd947e7e3b0a79f46a2b34
```

### 2. Ou copie o arquivo de exemplo:

```bash
cp firebase.env.example .env
```

### 3. Reinicie o servidor de desenvolvimento:

```bash
npm run dev
```

## ✅ **Problema Resolvido!**

O erro `Failed to resolve import "./config"` foi corrigido através da padronização dos imports do Firebase:

### **Mudanças realizadas:**

1. ✅ **Criado `src/firebase.js`** - Módulo único do Firebase
2. ✅ **Atualizado `src/services/FirestoreService.js`** - Import corrigido
3. ✅ **Atualizado `src/services/StorageService.js`** - Import corrigido  
4. ✅ **Atualizado `src/firebase/services.js`** - Import corrigido
5. ✅ **Atualizado `src/firebase/vehicleService.js`** - Import corrigido
6. ✅ **Criado `firebase.env.example`** - Exemplo de variáveis de ambiente

### **Estrutura padronizada:**

```javascript
// ✅ CORRETO - Import único e limpo
import { db, auth, storage } from "@/firebase";

// ❌ ANTIGO - Imports relativos problemáticos  
import { db } from "./config";
import { storage } from "../firebase/config";
```

### **Arquivo principal: `src/firebase.js`**

```javascript
import { initializeApp, getApps } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const googleProvider = new GoogleAuthProvider();
export const analytics = getAnalytics(app);
```

## 🚀 **Sistema Funcionando**

- ✅ Build sem erros
- ✅ Imports padronizados
- ✅ Firebase configurado corretamente
- ✅ Todas as funcionalidades operacionais

**O sistema está pronto para uso!** 🎉
