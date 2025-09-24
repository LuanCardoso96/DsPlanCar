import { useState } from "react";
import { AuthService } from "@/firebase/services";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Eye, EyeOff, Mail, Lock, User, Building2, Leaf, Loader2 } from "lucide-react";

const LoginForm = ({ onLoginSuccess }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);
  
  const [loginData, setLoginData] = useState({
    email: "",
    password: ""
  });
  
  const [signupData, setSignupData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setError("");
    
    try {
      await AuthService.signInWithGoogle();
      onLoginSuccess();
    } catch (error) {
      console.error("Error signing in with Google:", error);
      setError("Erro ao fazer login com Google. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailSignIn = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    
    try {
      await AuthService.signInWithEmail(loginData.email, loginData.password);
      onLoginSuccess();
    } catch (error) {
      console.error("Error signing in with email:", error);
      if (error.code === "auth/user-not-found") {
        setError("Usuário não encontrado. Verifique o email ou crie uma conta.");
      } else if (error.code === "auth/wrong-password") {
        setError("Senha incorreta. Tente novamente.");
      } else if (error.code === "auth/invalid-email") {
        setError("Email inválido. Verifique o formato.");
      } else {
        setError("Erro ao fazer login. Tente novamente.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailSignUp = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    
    if (signupData.password !== signupData.confirmPassword) {
      setError("As senhas não coincidem.");
      setIsLoading(false);
      return;
    }
    
    if (signupData.password.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres.");
      setIsLoading(false);
      return;
    }
    
    try {
      await AuthService.signUpWithEmail(signupData.email, signupData.password, signupData.name);
      onLoginSuccess();
    } catch (error) {
      console.error("Error signing up with email:", error);
      if (error.code === "auth/email-already-in-use") {
        setError("Este email já está em uso. Tente fazer login.");
      } else if (error.code === "auth/invalid-email") {
        setError("Email inválido. Verifique o formato.");
      } else if (error.code === "auth/weak-password") {
        setError("Senha muito fraca. Use pelo menos 6 caracteres.");
      } else {
        setError("Erro ao criar conta. Tente novamente.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoginInputChange = (field, value) => {
    setLoginData(prev => ({ ...prev, [field]: value }));
  };

  const handleSignupInputChange = (field, value) => {
    setSignupData(prev => ({ ...prev, [field]: value }));
  };

  const handleVideoLoad = () => {
    setVideoLoaded(true);
  };

  const handleVideoError = () => {
    console.warn("Erro ao carregar vídeo de background");
    setVideoLoaded(true);
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      <video
        autoPlay
        loop
        muted
        playsInline
        className="video-background"
        onLoadedData={handleVideoLoad}
        onError={handleVideoError}
      >
        <source src="/img/login1.mp4" type="video/mp4" />
        Seu navegador não suporta vídeos HTML5.
      </video>
      
      {!videoLoaded && (
        <div className="absolute inset-0 bg-gradient-to-br from-green-400 to-green-600 z-5 flex items-center justify-center">
          <div className="text-center text-white">
            <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4" />
            <p className="text-lg font-semibold">Carregando...</p>
          </div>
        </div>
      )}
      
      <div className="video-overlay"></div>
      
      <div className="login-content min-h-screen flex items-center justify-center p-4">
        <div className="max-w-md w-full mx-auto">
          <Card className="glass-card border-0 shadow-xl">
            <CardHeader className="text-center pb-6">
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Building2 className="w-6 h-6 text-white" />
                  <Leaf className="w-4 h-4 text-white absolute -top-1 -right-1" />
                </div>
                <div>
                  <h2 className="font-bold text-gray-900 text-xl">DScontrolCar</h2>
                  <p className="text-sm text-gray-600">Soluções Inteligentes</p>
                </div>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Bem-vindo!</h1>
              <p className="text-gray-600">Faça login para acessar o sistema de gestão de veículos</p>
            </CardHeader>
          
            <CardContent>
              {error && (
                <Alert className="mb-6 border-red-200 bg-red-50">
                  <AlertDescription className="text-red-800">{error}</AlertDescription>
                </Alert>
              )}
              
              <Tabs defaultValue="login" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="login">Entrar</TabsTrigger>
                  <TabsTrigger value="signup">Criar Conta</TabsTrigger>
                </TabsList>
                
                <TabsContent value="login" className="space-y-4">
                  <form onSubmit={handleEmailSignIn} className="space-y-4">
                    <div>
                      <Label htmlFor="login-email">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="login-email"
                          type="email"
                          placeholder="seu@email.com"
                          value={loginData.email}
                          onChange={(e) => handleLoginInputChange("email", e.target.value)}
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="login-password">Senha</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="login-password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Sua senha"
                          value={loginData.password}
                          onChange={(e) => handleLoginInputChange("password", e.target.value)}
                          className="pl-10 pr-10"
                          required
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>
                    
                    <Button
                      type="submit"
                      className="w-full ds-primary text-white shadow-lg hover:shadow-xl transition-all duration-300"
                      disabled={isLoading}
                    >
                      {isLoading ? "Entrando..." : "Entrar"}
                    </Button>
                  </form>
                </TabsContent>
                
                <TabsContent value="signup" className="space-y-4">
                  <form onSubmit={handleEmailSignUp} className="space-y-4">
                    <div>
                      <Label htmlFor="signup-name">Nome Completo</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="signup-name"
                          type="text"
                          placeholder="Seu nome completo"
                          value={signupData.name}
                          onChange={(e) => handleSignupInputChange("name", e.target.value)}
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="signup-email">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="signup-email"
                          type="email"
                          placeholder="seu@email.com"
                          value={signupData.email}
                          onChange={(e) => handleSignupInputChange("email", e.target.value)}
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="signup-password">Senha</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="signup-password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Mínimo 6 caracteres"
                          value={signupData.password}
                          onChange={(e) => handleSignupInputChange("password", e.target.value)}
                          className="pl-10 pr-10"
                          required
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="signup-confirm-password">Confirmar Senha</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="signup-confirm-password"
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="Confirme sua senha"
                          value={signupData.confirmPassword}
                          onChange={(e) => handleSignupInputChange("confirmPassword", e.target.value)}
                          className="pl-10 pr-10"
                          required
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                          {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>
                    
                    <Button
                      type="submit"
                      className="w-full ds-primary text-white shadow-lg hover:shadow-xl transition-all duration-300"
                      disabled={isLoading}
                    >
                      {isLoading ? "Criando conta..." : "Criar Conta"}
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>
              
              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-2 text-gray-500">Ou continue com</span>
                  </div>
                </div>
                
                <Button
                  onClick={handleGoogleSignIn}
                  className="w-full mt-4 bg-white text-gray-700 border border-gray-300 shadow-lg hover:shadow-xl transition-all duration-300 hover:bg-gray-50"
                  disabled={isLoading}
                >
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  {isLoading ? "Entrando..." : "Entrar com Google"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
