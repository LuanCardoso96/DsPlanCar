# 🔧 SOLUÇÃO PARA ERRO DE DOMÍNIO NÃO AUTORIZADO

## ❌ Erro Atual:
```
FirebaseError: Firebase: Error (auth/unauthorized-domain)
```

## ✅ Solução Passo a Passo:

### 1. **Configurar Domínios Autorizados no Firebase Console:**

1. Acesse: https://console.firebase.google.com
2. Selecione seu projeto: **dsplancar**
3. Vá para **Authentication** → **Settings** → **Authorized domains**
4. Clique em **"Add domain"** e adicione:
   - `localhost`
   - `127.0.0.1`
   - `localhost:5173`

### 2. **Criar arquivo .env na raiz do projeto:**

Crie um arquivo `.env` na raiz do projeto com o seguinte conteúdo:

```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=AIzaSyAostvdG27uYLmXP9aeQrzoK1P3VXKD2lQ
VITE_FIREBASE_AUTH_DOMAIN=dsplancar.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=dsplancar
VITE_FIREBASE_STORAGE_BUCKET=dsplancar.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=813245706461
VITE_FIREBASE_APP_ID=1:813245706461:web:dd947e7e3b0a79f46a2b34
VITE_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX
```

### 3. **Reiniciar o servidor de desenvolvimento:**

```bash
# Pare o servidor atual (Ctrl+C)
# Execute novamente:
npm run dev
```

### 4. **Verificar se o Google Sign-In está habilitado:**

1. No Firebase Console → **Authentication** → **Sign-in method**
2. Certifique-se de que **Google** está **habilitado**
3. Configure o **Project support email** se necessário

### 5. **Testar o login:**

- Acesse: http://localhost:5173
- Tente fazer login com Google
- Se ainda houver erro, verifique o console do navegador

## 🔍 **Verificações Adicionais:**

### **Se o erro persistir:**

1. **Verificar se o projeto está correto:**
   - Confirme que está usando o projeto **dsplancar**
   - Verifique se as credenciais estão corretas

2. **Limpar cache do navegador:**
   - Ctrl+Shift+R (hard refresh)
   - Ou abrir em aba anônima

3. **Verificar se o Firebase está funcionando:**
   - Teste o login manual (email/senha) primeiro
   - Se funcionar, o problema é específico do Google

## 📋 **Checklist de Configuração:**

- [ ] Domínios autorizados configurados no Firebase
- [ ] Arquivo .env criado com as credenciais
- [ ] Servidor reiniciado
- [ ] Google Sign-In habilitado no Firebase
- [ ] Cache do navegador limpo

## 🚨 **Importante:**

- **NUNCA** commite o arquivo `.env` para o Git
- Adicione `.env` ao `.gitignore`
- Use variáveis de ambiente em produção

## 📞 **Se ainda não funcionar:**

1. Verifique se o projeto Firebase está ativo
2. Confirme se a API Key está correta
3. Teste em outro navegador
4. Verifique se não há bloqueios de firewall/proxy
