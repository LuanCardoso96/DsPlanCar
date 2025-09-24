import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Settings as SettingsIcon,
  User as UserIcon,
  Palette,
  Bell,
  Shield,
  Save,
  Upload,
  Download,
  RefreshCw,
  Eye,
  EyeOff,
} from "lucide-react";

const themePresets = [
  { name: "Verde Natureza", color: "#22c55e" },
  { name: "Azul Oceano", color: "#3b82f6" },
  { name: "Roxo Moderno", color: "#8b5cf6" },
  { name: "Laranja Energia", color: "#f59e0b" },
  { name: "Vermelho Poder", color: "#ef4444" },
  { name: "Cinza Elegante", color: "#6b7280" },
];

export default function Settings() {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  // Settings state
  const [userSettings, setUserSettings] = useState({
    profile: {
      department: "",
      phone: "",
      avatar: "",
    },
    theme: {
      primary_color: "#22c55e",
      dark_mode: false,
      login_background: "",
    },
    notifications: {
      email_enabled: true,
      push_enabled: true,
    },
  });
  
  // Profile state
  const [profileData, setProfileData] = useState({
    full_name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  useEffect(() => {
    loadUserSettings();
  }, []);

  const loadUserSettings = () => {
    setLoading(true);
    
    // Mock user data
    const mockUser = {
      full_name: "João Silva",
      email: "joao.silva@empresa.com",
      profile: { department: "TI", phone: "(11) 99999-9999", avatar: "" },
      settings: {
        theme: { primary_color: "#22c55e", dark_mode: false, login_background: "" },
        notifications: { email_enabled: true, push_enabled: true }
      }
    };
    
    setCurrentUser(mockUser);
    setProfileData({
      full_name: mockUser.full_name,
      email: mockUser.email,
      password: "",
      confirmPassword: "",
    });
    
    setUserSettings({
      profile: mockUser.profile,
      theme: mockUser.settings.theme,
      notifications: mockUser.settings.notifications,
    });
    
    setLoading(false);
  };

  const handleSaveProfile = () => {
    setSaving(true);
    
    // Simulate API call
    setTimeout(() => {
      setProfileData({
        ...profileData,
        password: "",
        confirmPassword: "",
      });
      alert("Perfil atualizado com sucesso!");
      setSaving(false);
    }, 1000);
  };

  const handleSaveSettings = () => {
    setSaving(true);
    
    // Simulate API call
    setTimeout(() => {
      applyTheme(userSettings.theme);
      alert("Configurações salvas com sucesso!");
      setSaving(false);
    }, 1000);
  };

  const applyTheme = (theme) => {
    const root = document.documentElement;
    root.style.setProperty("--primary-color", theme.primary_color);
    
    if (theme.dark_mode) {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  };

  const handleThemeColorChange = (color) => {
    setUserSettings({
      ...userSettings,
      theme: {
        ...userSettings.theme,
        primary_color: color,
      },
    });
    
    // Apply immediately for preview
    applyTheme({
      ...userSettings.theme,
      primary_color: color,
    });
  };

  const exportSettings = () => {
    const settingsData = {
      user: currentUser,
      settings: userSettings,
      exportDate: new Date().toISOString(),
    };
    
    const dataStr = JSON.stringify(settingsData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = `configuracoes_${currentUser?.email}_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
  };

  const importSettings = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedData = JSON.parse(e.target.result);
        if (importedData.settings) {
          setUserSettings(importedData.settings);
          alert("Configurações importadas com sucesso!");
        }
      } catch (error) {
        alert("Erro ao importar configurações. Verifique o arquivo.");
      }
    };
    reader.readAsText(file);
  };

  if (loading) {
    return (
      <div className="p-4 md:p-8 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-gray-400" />
          <p className="text-gray-500">Carregando configurações...</p>
        </div>
      </div>
    );
  }

  const isMaster = currentUser?.role === "MASTER" || currentUser?.email === "luancr72024@gmail.com";

  return (
    <div className="p-4 md:p-8 min-h-screen">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Configurações</h1>
            <p className="text-gray-600 mt-1">Gerencie suas preferências e configurações do sistema</p>
          </div>
          
          <div className="flex items-center gap-2">
            <Badge variant={isMaster ? "default" : "secondary"} className="bg-purple-100 text-purple-800">
              {currentUser?.role}
            </Badge>
            {isMaster && (
              <Badge className="bg-yellow-100 text-yellow-800">
                MASTER
              </Badge>
            )}
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Profile Settings */}
          <Card className="glass-card border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserIcon className="w-5 h-5" />
                Perfil do Usuário
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="full_name">Nome Completo</Label>
                <Input
                  id="full_name"
                  value={profileData.full_name}
                  onChange={(e) => setProfileData({...profileData, full_name: e.target.value})}
                />
              </div>
              
              <div>
                <Label htmlFor="email">E-mail</Label>
                <Input
                  id="email"
                  type="email"
                  value={profileData.email}
                  disabled
                  className="bg-gray-50"
                />
                <p className="text-xs text-gray-500 mt-1">O e-mail não pode ser alterado</p>
              </div>
              
              <div>
                <Label htmlFor="department">Departamento</Label>
                <Input
                  id="department"
                  value={userSettings.profile.department}
                  onChange={(e) => setUserSettings({
                    ...userSettings,
                    profile: {...userSettings.profile, department: e.target.value}
                  })}
                />
              </div>
              
              <div>
                <Label htmlFor="phone">Telefone</Label>
                <Input
                  id="phone"
                  value={userSettings.profile.phone}
                  onChange={(e) => setUserSettings({
                    ...userSettings,
                    profile: {...userSettings.profile, phone: e.target.value}
                  })}
                />
              </div>
              
              <Separator />
              
              <div>
                <Label htmlFor="password">Nova Senha</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={profileData.password}
                    onChange={(e) => setProfileData({...profileData, password: e.target.value})}
                    placeholder="Deixe em branco para não alterar"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                </div>
              </div>
              
              <div>
                <Label htmlFor="confirmPassword">Confirmar Nova Senha</Label>
                <Input
                  id="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  value={profileData.confirmPassword}
                  onChange={(e) => setProfileData({...profileData, confirmPassword: e.target.value})}
                  placeholder="Confirme a nova senha"
                />
                {profileData.password && profileData.confirmPassword && 
                 profileData.password !== profileData.confirmPassword && (
                  <p className="text-xs text-red-500 mt-1">As senhas não coincidem</p>
                )}
              </div>
              
              <Button onClick={handleSaveProfile} disabled={saving} className="w-full ds-primary text-white">
                <Save className="w-4 h-4 mr-2" />
                {saving ? "Salvando..." : "Salvar Perfil"}
              </Button>
            </CardContent>
          </Card>

          {/* Theme Settings */}
          <Card className="glass-card border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="w-5 h-5" />
                Personalização Visual
              </CardTitle>
              {!isMaster && (
                <p className="text-sm text-gray-500">Somente usuários MASTER podem alterar temas</p>
              )}
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Cor Primária do Sistema</Label>
                <div className="grid grid-cols-3 gap-3 mt-2">
                  {themePresets.map((preset) => (
                    <button
                      key={preset.color}
                      onClick={() => isMaster && handleThemeColorChange(preset.color)}
                      disabled={!isMaster}
                      className={`p-3 rounded-lg border-2 transition-all ${
                        userSettings.theme.primary_color === preset.color
                          ? 'border-gray-900 ring-2 ring-offset-2 ring-gray-200'
                          : 'border-gray-200 hover:border-gray-300'
                      } ${!isMaster ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:scale-105'}`}
                    >
                      <div
                        className="w-full h-8 rounded mb-2"
                        style={{ backgroundColor: preset.color }}
                      />
                      <p className="text-xs font-medium text-center">{preset.name}</p>
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <Label htmlFor="custom_color">Ou escolha uma cor personalizada</Label>
                <div className="flex gap-2 mt-2">
                  <input
                    type="color"
                    id="custom_color"
                    value={userSettings.theme.primary_color}
                    onChange={(e) => isMaster && handleThemeColorChange(e.target.value)}
                    disabled={!isMaster}
                    className="w-16 h-10 rounded border border-gray-300 disabled:opacity-50"
                  />
                  <Input
                    value={userSettings.theme.primary_color}
                    onChange={(e) => isMaster && handleThemeColorChange(e.target.value)}
                    disabled={!isMaster}
                    placeholder="#22c55e"
                    className="flex-1"
                  />
                </div>
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div>
                  <Label>Modo Escuro</Label>
                  <p className="text-sm text-gray-500">Ative o tema escuro do sistema</p>
                </div>
                <Switch
                  checked={userSettings.theme.dark_mode}
                  onCheckedChange={(checked) => isMaster && setUserSettings({
                    ...userSettings,
                    theme: {...userSettings.theme, dark_mode: checked}
                  })}
                  disabled={!isMaster}
                />
              </div>
              
              {isMaster && (
                <>
                  <Separator />
                  
                  <div>
                    <Label htmlFor="login_background">URL da Imagem de Fundo do Login</Label>
                    <Input
                      id="login_background"
                      value={userSettings.theme.login_background}
                      onChange={(e) => setUserSettings({
                        ...userSettings,
                        theme: {...userSettings.theme, login_background: e.target.value}
                      })}
                      placeholder="https://exemplo.com/imagem.jpg"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Deixe em branco para usar o fundo padrão
                    </p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Notification Settings */}
          <Card className="glass-card border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5" />
                Notificações
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Notificações por E-mail</Label>
                  <p className="text-sm text-gray-500">Receba notificações importantes por e-mail</p>
                </div>
                <Switch
                  checked={userSettings.notifications.email_enabled}
                  onCheckedChange={(checked) => setUserSettings({
                    ...userSettings,
                    notifications: {...userSettings.notifications, email_enabled: checked}
                  })}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label>Notificações Push</Label>
                  <p className="text-sm text-gray-500">Receba notificações em tempo real</p>
                </div>
                <Switch
                  checked={userSettings.notifications.push_enabled}
                  onCheckedChange={(checked) => setUserSettings({
                    ...userSettings,
                    notifications: {...userSettings.notifications, push_enabled: checked}
                  })}
                />
              </div>
            </CardContent>
          </Card>

          {/* System Actions */}
          <Card className="glass-card border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <SettingsIcon className="w-5 h-5" />
                Ações do Sistema
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <Button onClick={exportSettings} variant="outline" className="w-full ds-hover">
                  <Download className="w-4 h-4 mr-2" />
                  Exportar Configurações
                </Button>
                
                <div className="relative">
                  <input
                    type="file"
                    accept=".json"
                    onChange={importSettings}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <Button variant="outline" className="w-full ds-hover">
                    <Upload className="w-4 h-4 mr-2" />
                    Importar Configurações
                  </Button>
                </div>
              </div>
              
              <Separator />
              
              <Button onClick={handleSaveSettings} disabled={saving} className="w-full ds-primary text-white">
                <Save className="w-4 h-4 mr-2" />
                {saving ? "Salvando..." : "Salvar Todas as Configurações"}
              </Button>
              
              {isMaster && (
                <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-yellow-600" />
                    <p className="text-sm font-medium text-yellow-800">Privilégios MASTER</p>
                  </div>
                  <p className="text-sm text-yellow-700 mt-1">
                    Como usuário MASTER, você pode alterar temas, layouts e configurações avançadas do sistema.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}