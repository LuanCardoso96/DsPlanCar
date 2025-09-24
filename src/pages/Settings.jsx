import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Palette, Bell, Mail, Smartphone } from "lucide-react";

export default function Settings() {
  const [settings, setSettings] = useState({
    primaryColor: "#22c55e",
    darkMode: false,
    emailNotifications: true,
    pushNotifications: false,
    notificationFrequency: "immediate",
    emailAddress: "",
  });

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = () => {
    const savedSettings = localStorage.getItem("app-settings");
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  };

  const saveSettings = async () => {
    setIsLoading(true);
    try {
      localStorage.setItem("app-settings", JSON.stringify(settings));
      
      // Aplicar tema imediatamente
      applyTheme();
      
      alert("Configurações salvas com sucesso!");
    } catch (error) {
      console.error("Error saving settings:", error);
      alert("Erro ao salvar configurações. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  const applyTheme = () => {
    const root = document.documentElement;
    root.style.setProperty("--primary-color", settings.primaryColor);
    
    if (settings.darkMode) {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  };

  const handleColorChange = (color) => {
    setSettings({ ...settings, primaryColor: color });
  };

  const handleToggle = (key) => {
    setSettings({ ...settings, [key]: !settings[key] });
  };

  const handleInputChange = (key, value) => {
    setSettings({ ...settings, [key]: value });
  };

  const predefinedColors = [
    { name: "Verde", value: "#22c55e" },
    { name: "Azul", value: "#3b82f6" },
    { name: "Roxo", value: "#8b5cf6" },
    { name: "Rosa", value: "#ec4899" },
    { name: "Laranja", value: "#f97316" },
    { name: "Vermelho", value: "#ef4444" },
    { name: "Amarelo", value: "#eab308" },
    { name: "Cinza", value: "#6b7280" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-slate-100">
      <div className="container mx-auto px-6 py-8">
        {/* Header Profissional */}
        <div className="mb-10">
          <div className="space-y-3">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              Configurações ⚙️
            </h1>
            <p className="text-lg text-gray-600 font-medium">
              Personalize a aparência e notificações do sistema
            </p>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Palette className="w-4 h-4" />
              <span>Customize sua experiência</span>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          {/* Appearance Settings */}
          <Card className="glass-card border-0 shadow-xl bg-white/80 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-3 text-xl font-bold text-gray-900">
                <div className="p-2 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl">
                  <Palette className="w-6 h-6 text-white" />
                </div>
                Aparência
              </CardTitle>
              <p className="text-gray-600 text-sm">Personalize as cores e tema do sistema</p>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Primary Color */}
              <div>
                <Label htmlFor="primaryColor" className="text-sm font-semibold text-gray-700">Cor Primária</Label>
                <div className="mt-3 space-y-4">
                  <div className="flex items-center gap-3">
                    <Input
                      id="primaryColor"
                      type="color"
                      value={settings.primaryColor}
                      onChange={(e) => handleColorChange(e.target.value)}
                      className="w-16 h-12 p-1 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:ring-green-500/20 transition-all duration-200"
                    />
                    <span className="text-sm font-medium text-gray-600 bg-gray-100 px-3 py-2 rounded-lg">
                      {settings.primaryColor}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-6 gap-3">
                    {predefinedColors.map((color) => (
                      <button
                        key={color.value}
                        onClick={() => handleColorChange(color.value)}
                        className={`w-12 h-12 rounded-xl border-2 transition-all duration-200 hover:scale-110 ${
                          settings.primaryColor === color.value
                            ? "border-gray-900 scale-110 shadow-lg"
                            : "border-gray-300 hover:border-gray-400 hover:shadow-md"
                        }`}
                        style={{ backgroundColor: color.value }}
                        title={color.name}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <Separator className="my-6" />

              {/* Dark Mode */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div>
                  <Label htmlFor="darkMode" className="text-sm font-semibold text-gray-700">Modo Escuro</Label>
                  <p className="text-sm text-gray-600 mt-1">Ativar tema escuro para melhor experiência noturna</p>
                </div>
                <Switch
                  id="darkMode"
                  checked={settings.darkMode}
                  onCheckedChange={() => handleToggle("darkMode")}
                  className="data-[state=checked]:bg-green-600"
                />
              </div>
            </CardContent>
          </Card>

          {/* Notification Settings */}
          <Card className="glass-card border-0 shadow-xl bg-white/80 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-3 text-xl font-bold text-gray-900">
                <div className="p-2 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl">
                  <Bell className="w-6 h-6 text-white" />
                </div>
                Notificações
              </CardTitle>
              <p className="text-gray-600 text-sm">Configure como você deseja receber alertas</p>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Email Notifications */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Mail className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <Label htmlFor="emailNotifications" className="text-sm font-semibold text-gray-700">Notificações por E-mail</Label>
                    <p className="text-sm text-gray-600 mt-1">Receber alertas importantes por e-mail</p>
                  </div>
                </div>
                <Switch
                  id="emailNotifications"
                  checked={settings.emailNotifications}
                  onCheckedChange={() => handleToggle("emailNotifications")}
                  className="data-[state=checked]:bg-green-600"
                />
              </div>

              {/* Email Address */}
              {settings.emailNotifications && (
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
                  <Label htmlFor="emailAddress" className="text-sm font-semibold text-gray-700">E-mail para Notificações</Label>
                  <Input
                    id="emailAddress"
                    type="email"
                    placeholder="seu@email.com"
                    value={settings.emailAddress}
                    onChange={(e) => handleInputChange("emailAddress", e.target.value)}
                    className="mt-2 h-12 border-gray-200 focus:border-green-500 focus:ring-green-500/20 transition-all duration-200"
                  />
                </div>
              )}

              <Separator />

              {/* Push Notifications */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Smartphone className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <Label htmlFor="pushNotifications" className="text-sm font-semibold text-gray-700">Notificações Push</Label>
                    <p className="text-sm text-gray-600 mt-1">Receber notificações no navegador</p>
                  </div>
                </div>
                <Switch
                  id="pushNotifications"
                  checked={settings.pushNotifications}
                  onCheckedChange={() => handleToggle("pushNotifications")}
                  className="data-[state=checked]:bg-green-600"
                />
              </div>

              <Separator />

              {/* Notification Frequency */}
              <div>
                <Label htmlFor="notificationFrequency" className="text-sm font-semibold text-gray-700">Frequência das Notificações</Label>
                <Select
                  value={settings.notificationFrequency}
                  onValueChange={(value) => handleInputChange("notificationFrequency", value)}
                >
                  <SelectTrigger className="mt-2 h-12 border-gray-200 focus:border-green-500 focus:ring-green-500/20 transition-all duration-200">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="immediate">Imediata</SelectItem>
                    <SelectItem value="hourly">A cada hora</SelectItem>
                    <SelectItem value="daily">Diária</SelectItem>
                    <SelectItem value="weekly">Semanal</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Save Button */}
          <div className="flex justify-end">
            <Button
              onClick={saveSettings}
              disabled={isLoading}
              className="h-12 px-8 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
            >
              {isLoading ? "Salvando..." : "Salvar Configurações"}
            </Button>
          </div>

          {/* Preview */}
          <Card className="glass-card border-0 shadow-xl bg-white/80 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl font-bold text-gray-900">Prévia das Configurações</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div
                    className="w-8 h-8 rounded-full"
                    style={{ backgroundColor: settings.primaryColor }}
                  />
                  <div>
                    <p className="font-medium">Cor Primária</p>
                    <p className="text-sm text-gray-600">{settings.primaryColor}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className={`w-8 h-8 rounded-full ${settings.darkMode ? "bg-gray-800" : "bg-gray-200"}`} />
                  <div>
                    <p className="font-medium">Modo Escuro</p>
                    <p className="text-sm text-gray-600">
                      {settings.darkMode ? "Ativado" : "Desativado"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <Mail className={`w-5 h-5 ${settings.emailNotifications ? "text-green-600" : "text-gray-400"}`} />
                  <div>
                    <p className="font-medium">Notificações por E-mail</p>
                    <p className="text-sm text-gray-600">
                      {settings.emailNotifications ? "Ativadas" : "Desativadas"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <Smartphone className={`w-5 h-5 ${settings.pushNotifications ? "text-green-600" : "text-gray-400"}`} />
                  <div>
                    <p className="font-medium">Notificações Push</p>
                    <p className="text-sm text-gray-600">
                      {settings.pushNotifications ? "Ativadas" : "Desativadas"}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}