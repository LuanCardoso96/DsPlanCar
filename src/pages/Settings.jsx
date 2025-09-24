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
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Configurações</h1>
        <p className="text-gray-600 mt-1">Personalize a aparência e notificações do sistema</p>
      </div>

      {/* Appearance Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="w-5 h-5" />
            Aparência
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Primary Color */}
          <div>
            <Label htmlFor="primaryColor">Cor Primária</Label>
            <div className="mt-2 space-y-3">
              <div className="flex items-center gap-2">
                <Input
                  id="primaryColor"
                  type="color"
                  value={settings.primaryColor}
                  onChange={(e) => handleColorChange(e.target.value)}
                  className="w-16 h-10 p-1 border rounded"
                />
                <span className="text-sm text-gray-600">
                  {settings.primaryColor}
                </span>
              </div>
              
              <div className="grid grid-cols-4 gap-2">
                {predefinedColors.map((color) => (
                  <button
                    key={color.value}
                    onClick={() => handleColorChange(color.value)}
                    className={`w-12 h-12 rounded-lg border-2 transition-all ${
                      settings.primaryColor === color.value
                        ? "border-gray-900 scale-110"
                        : "border-gray-300 hover:border-gray-400"
                    }`}
                    style={{ backgroundColor: color.value }}
                    title={color.name}
                  />
                ))}
              </div>
            </div>
          </div>

          <Separator />

          {/* Dark Mode */}
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="darkMode">Modo Escuro</Label>
              <p className="text-sm text-gray-600">Ativar tema escuro</p>
            </div>
            <Switch
              id="darkMode"
              checked={settings.darkMode}
              onCheckedChange={() => handleToggle("darkMode")}
            />
          </div>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Notificações
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Email Notifications */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-gray-600" />
              <div>
                <Label htmlFor="emailNotifications">Notificações por E-mail</Label>
                <p className="text-sm text-gray-600">Receber alertas por e-mail</p>
              </div>
            </div>
            <Switch
              id="emailNotifications"
              checked={settings.emailNotifications}
              onCheckedChange={() => handleToggle("emailNotifications")}
            />
          </div>

          {/* Email Address */}
          {settings.emailNotifications && (
            <div>
              <Label htmlFor="emailAddress">E-mail para Notificações</Label>
              <Input
                id="emailAddress"
                type="email"
                value={settings.emailAddress}
                onChange={(e) => handleInputChange("emailAddress", e.target.value)}
                placeholder="seu@email.com"
                className="mt-2"
              />
            </div>
          )}

          <Separator />

          {/* Push Notifications */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Smartphone className="w-5 h-5 text-gray-600" />
              <div>
                <Label htmlFor="pushNotifications">Notificações Push</Label>
                <p className="text-sm text-gray-600">Receber notificações no navegador</p>
              </div>
            </div>
            <Switch
              id="pushNotifications"
              checked={settings.pushNotifications}
              onCheckedChange={() => handleToggle("pushNotifications")}
            />
          </div>

          <Separator />

          {/* Notification Frequency */}
          <div>
            <Label htmlFor="notificationFrequency">Frequência das Notificações</Label>
            <Select
              value={settings.notificationFrequency}
              onValueChange={(value) => handleInputChange("notificationFrequency", value)}
            >
              <SelectTrigger className="mt-2">
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
          className="ds-primary text-white shadow-lg hover:shadow-xl transition-all duration-300"
        >
          {isLoading ? "Salvando..." : "Salvar Configurações"}
        </Button>
      </div>

      {/* Preview */}
      <Card>
        <CardHeader>
          <CardTitle>Prévia das Configurações</CardTitle>
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
  );
}