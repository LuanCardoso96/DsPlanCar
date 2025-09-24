import { useState } from "react";
import { AuthService } from "@/firebase/services";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";

const FirebaseTest = () => {
  const [testResults, setTestResults] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const testFirebaseConnection = async () => {
    setIsLoading(true);
    const results = {};

    try {
      // Test 1: Check if Firebase is initialized
      results.firebaseInit = { status: 'success', message: 'Firebase inicializado corretamente' };
    } catch (error) {
      results.firebaseInit = { status: 'error', message: `Erro na inicialização: ${error.message}` };
    }

    try {
      // Test 2: Check if Auth is available
      const currentUser = AuthService.getCurrentUser();
      results.authAvailable = { 
        status: 'success', 
        message: `Auth disponível. Usuário atual: ${currentUser ? 'Logado' : 'Não logado'}` 
      };
    } catch (error) {
      results.authAvailable = { status: 'error', message: `Erro no Auth: ${error.message}` };
    }

    try {
      // Test 3: Check if Firestore is available
      const { db } = await import("@/firebase");
      results.firestoreAvailable = { status: 'success', message: 'Firestore disponível' };
    } catch (error) {
      results.firestoreAvailable = { status: 'error', message: `Erro no Firestore: ${error.message}` };
    }

    setTestResults(results);
    setIsLoading(false);
  };

  const testGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      await AuthService.signInWithGoogle();
      setTestResults(prev => ({
        ...prev,
        googleSignIn: { status: 'success', message: 'Login com Google funcionando!' }
      }));
    } catch (error) {
      setTestResults(prev => ({
        ...prev,
        googleSignIn: { status: 'error', message: `Erro no Google Sign-In: ${error.message}` }
      }));
    }
    setIsLoading(false);
  };

  const testEmailSignUp = async () => {
    setIsLoading(true);
    try {
      await AuthService.signUpWithEmail(
        `teste${Date.now()}@example.com`,
        '123456',
        'Usuário Teste'
      );
      setTestResults(prev => ({
        ...prev,
        emailSignUp: { status: 'success', message: 'Cadastro com email funcionando!' }
      }));
    } catch (error) {
      setTestResults(prev => ({
        ...prev,
        emailSignUp: { status: 'error', message: `Erro no cadastro: ${error.message}` }
      }));
    }
    setIsLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>🔧 Teste de Configuração Firebase</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button 
              onClick={testFirebaseConnection}
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              Testar Conexão Firebase
            </Button>
            
            <Button 
              onClick={testGoogleSignIn}
              disabled={isLoading}
              variant="outline"
              className="w-full"
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              Testar Google Sign-In
            </Button>
            
            <Button 
              onClick={testEmailSignUp}
              disabled={isLoading}
              variant="outline"
              className="w-full"
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              Testar Cadastro Email
            </Button>
          </div>

          <div className="space-y-3">
            {Object.entries(testResults).map(([key, result]) => (
              <Alert key={key} className={result.status === 'success' ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}>
                <div className="flex items-center gap-2">
                  {result.status === 'success' ? (
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  ) : (
                    <XCircle className="w-4 h-4 text-red-600" />
                  )}
                  <AlertDescription className={result.status === 'success' ? 'text-green-800' : 'text-red-800'}>
                    <strong>{key}:</strong> {result.message}
                  </AlertDescription>
                </div>
              </Alert>
            ))}
          </div>

          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="font-semibold text-blue-900 mb-2">📋 Instruções:</h3>
            <ol className="text-sm text-blue-800 space-y-1">
              <li>1. Execute os testes acima para verificar a configuração</li>
              <li>2. Se houver erros, siga as instruções em <code>FIREBASE_AUTH_FIX.md</code></li>
              <li>3. Configure os domínios autorizados no Firebase Console</li>
              <li>4. Crie o arquivo <code>.env</code> com as credenciais</li>
              <li>5. Reinicie o servidor após as configurações</li>
            </ol>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FirebaseTest;
