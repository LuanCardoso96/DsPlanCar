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
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-900 via-green-900 to-slate-800">
      <video
        autoPlay
        loop
        muted
        playsInline
        className="video-background opacity-30"
        onLoadedData={handleVideoLoad}
        onError={handleVideoError}
      >
        <source src="/img/login1.mp4" type="video/mp4" />
        Seu navegador não suporta vídeos HTML5.
      </video>
      
      {!videoLoaded && (
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-green-900 to-slate-800 z-5 flex items-center justify-center">
          <div className="text-center text-white">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-green-400 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
              <div className="absolute inset-0 w-16 h-16 border-4 border-green-300 border-t-transparent rounded-full animate-spin mx-auto opacity-50" style={{animationDirection: 'reverse', animationDuration: '1.5s'}}></div>
            </div>
            <p className="text-xl font-semibold">Carregando sistema...</p>
            <p className="text-sm text-green-200 mt-2">Preparando ambiente seguro</p>
          </div>
        </div>
      )}
      
      {/* Overlay com gradiente profissional */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900/80 via-green-900/60 to-slate-800/80"></div>
      
      {/* Padrão de fundo sutil */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(34,197,94,0.1),transparent_50%)]"></div>
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-green-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl"></div>
      </div>
      
      <div className="login-content min-h-screen flex items-center justify-center p-6 relative z-10">
        <div className="max-w-md w-full mx-auto">
          <Card className="glass-card border-0 shadow-2xl backdrop-blur-xl bg-white/95">
            <CardHeader className="text-center pb-8 pt-8">
              {/* Logo melhorado */}
              <div className="flex items-center justify-center gap-4 mb-6">
                <div className="relative">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-xl">
                    <Building2 className="w-8 h-8 text-white" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-br from-emerald-400 to-green-500 rounded-full flex items-center justify-center shadow-lg">
                    <Leaf className="w-3 h-3 text-white" />
                  </div>
                </div>
                <div className="text-left">
                  <h2 className="font-bold text-gray-900 text-2xl tracking-tight">DScontrolCar</h2>
                  <p className="text-sm text-gray-600 font-medium">Soluções Inteligentes</p>
                </div>
              </div>
              
              {/* Título principal */}
              <div className="space-y-2">
                <h1 className="text-3xl font-bold text-gray-900">Bem-vindo de volta</h1>
                <p className="text-gray-600 text-base">Acesse sua conta para continuar</p>
              </div>
            </CardHeader>
          
            <CardContent className="px-8 pb-8">
              {error && (
                <Alert className="mb-6 border-red-200 bg-red-50/80 backdrop-blur-sm">
                  <AlertDescription className="text-red-800 font-medium">{error}</AlertDescription>
                </Alert>
              )}
              
              <Tabs defaultValue="login" className="w-full">
                <TabsList className="grid w-full grid-cols-2 bg-gray-100/80 backdrop-blur-sm mb-6">
                  <TabsTrigger value="login" className="data-[state=active]:bg-white data-[state=active]:shadow-sm font-medium">Entrar</TabsTrigger>
                  <TabsTrigger value="signup" className="data-[state=active]:bg-white data-[state=active]:shadow-sm font-medium">Criar Conta</TabsTrigger>
                </TabsList>
                
                <TabsContent value="login" className="space-y-6 mt-6">
                  <form onSubmit={handleEmailSignIn} className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="login-email" className="text-sm font-semibold text-gray-700">Email</Label>
                      <div className="relative group">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-green-500 transition-colors" />
                        <Input
                          id="login-email"
                          type="email"
                          placeholder="seu@email.com"
                          value={loginData.email}
                          onChange={(e) => handleLoginInputChange("email", e.target.value)}
                          className="pl-12 h-12 border-gray-200 focus:border-green-500 focus:ring-green-500/20 transition-all duration-200 bg-white/80 backdrop-blur-sm"
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="login-password" className="text-sm font-semibold text-gray-700">Senha</Label>
                      <div className="relative group">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-green-500 transition-colors" />
                        <Input
                          id="login-password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Sua senha"
                          value={loginData.password}
                          onChange={(e) => handleLoginInputChange("password", e.target.value)}
                          className="pl-12 pr-12 h-12 border-gray-200 focus:border-green-500 focus:ring-green-500/20 transition-all duration-200 bg-white/80 backdrop-blur-sm"
                          required
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent text-gray-400 hover:text-gray-600"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </Button>
                      </div>
                    </div>
                    
                    <Button
                      type="submit"
                      className="w-full h-12 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Entrando...
                        </div>
                      ) : (
                        "Entrar"
                      )}
                    </Button>
                  </form>
                </TabsContent>
                
                <TabsContent value="signup" className="space-y-6 mt-6">
                  <form onSubmit={handleEmailSignUp} className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="signup-name" className="text-sm font-semibold text-gray-700">Nome Completo</Label>
                      <div className="relative group">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-green-500 transition-colors" />
                        <Input
                          id="signup-name"
                          type="text"
                          placeholder="Seu nome completo"
                          value={signupData.name}
                          onChange={(e) => handleSignupInputChange("name", e.target.value)}
                          className="pl-12 h-12 border-gray-200 focus:border-green-500 focus:ring-green-500/20 transition-all duration-200 bg-white/80 backdrop-blur-sm"
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="signup-email" className="text-sm font-semibold text-gray-700">Email</Label>
                      <div className="relative group">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-green-500 transition-colors" />
                        <Input
                          id="signup-email"
                          type="email"
                          placeholder="seu@email.com"
                          value={signupData.email}
                          onChange={(e) => handleSignupInputChange("email", e.target.value)}
                          className="pl-12 h-12 border-gray-200 focus:border-green-500 focus:ring-green-500/20 transition-all duration-200 bg-white/80 backdrop-blur-sm"
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="signup-password" className="text-sm font-semibold text-gray-700">Senha</Label>
                      <div className="relative group">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-green-500 transition-colors" />
                        <Input
                          id="signup-password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Mínimo 6 caracteres"
                          value={signupData.password}
                          onChange={(e) => handleSignupInputChange("password", e.target.value)}
                          className="pl-12 pr-12 h-12 border-gray-200 focus:border-green-500 focus:ring-green-500/20 transition-all duration-200 bg-white/80 backdrop-blur-sm"
                          required
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent text-gray-400 hover:text-gray-600"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </Button>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="signup-confirm-password" className="text-sm font-semibold text-gray-700">Confirmar Senha</Label>
                      <div className="relative group">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-green-500 transition-colors" />
                        <Input
                          id="signup-confirm-password"
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="Confirme sua senha"
                          value={signupData.confirmPassword}
                          onChange={(e) => handleSignupInputChange("confirmPassword", e.target.value)}
                          className="pl-12 pr-12 h-12 border-gray-200 focus:border-green-500 focus:ring-green-500/20 transition-all duration-200 bg-white/80 backdrop-blur-sm"
                          required
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent text-gray-400 hover:text-gray-600"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                          {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </Button>
                      </div>
                    </div>
                    
                    <Button
                      type="submit"
                      className="w-full h-12 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Criando conta...
                        </div>
                      ) : (
                        "Criar Conta"
                      )}
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>
              
              <div className="mt-8">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-gray-200" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-4 text-gray-500 font-medium">Ou continue com</span>
                  </div>
                </div>
                
                <Button
                  onClick={handleGoogleSignIn}
                  className="w-full mt-6 h-12 bg-white text-gray-700 border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:bg-gray-50 hover:border-gray-300 transform hover:scale-[1.02] font-semibold"
                  disabled={isLoading}
                >
                  <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                      Entrando...
                    </div>
                  ) : (
                    "Entrar com Google"
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
          
          {/* Footer com informações de segurança */}
          <div className="mt-6 text-center">
            <p className="text-sm text-white/80">
              🔒 Conexão segura e criptografada
            </p>
            <p className="text-xs text-white/60 mt-1">
              Seus dados estão protegidos com tecnologia de ponta
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
