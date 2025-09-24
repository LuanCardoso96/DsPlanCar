
import React, { useState, useEffect, useCallback } from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  LayoutDashboard,
  Car,
  Users,
  LogOut,
  Calendar,
  FileText,
  BarChart3,
  Settings,
  ChevronDown,
  Building2,
  Leaf,
} from "lucide-react";

const navigationItems = [
  {
    title: "Dashboard",
    url: createPageUrl("Dashboard"),
    icon: LayoutDashboard,
    roles: ["MASTER", "ADMIN", "OPERADOR"],
  },
  {
    title: "Veículos",
    url: createPageUrl("Vehicles"),
    icon: Car,
    roles: ["MASTER", "ADMIN", "OPERADOR"],
  },
  {
    title: "Funcionários",
    url: createPageUrl("People"),
    icon: Users,
    roles: ["MASTER", "ADMIN", "OPERADOR"],
  },
  {
    title: "Saídas",
    url: createPageUrl("VehicleExits"),
    icon: LogOut,
    roles: ["MASTER", "ADMIN", "OPERADOR"],
  },
  {
    title: "Agendamentos",
    url: createPageUrl("Schedules"),
    icon: Calendar,
    roles: ["MASTER", "ADMIN", "OPERADOR"],
  },
  {
    title: "Documentos",
    url: createPageUrl("Documents"),
    icon: FileText,
    roles: ["MASTER", "ADMIN"],
  },
  {
    title: "Relatórios",
    url: createPageUrl("Reports"),
    icon: BarChart3,
    roles: ["MASTER", "ADMIN"],
  },
  {
    title: "Configurações",
    url: createPageUrl("Settings"),
    icon: Settings,
    roles: ["MASTER", "ADMIN"],
  },
];

export default function Layout({ children, currentPageName }) {
  const location = useLocation();
  const [currentUser, setCurrentUser] = useState(null);
  const [theme, setTheme] = useState({
    primary_color: "#22c55e",
    dark_mode: false,
  });

  const loadCurrentUser = useCallback(() => {
    // Mock user data
    const mockUser = {
      full_name: "João Silva",
      email: "joao.silva@empresa.com",
      role: "ADMIN",
      settings: {
        theme: {
          primary_color: "#22c55e",
          dark_mode: false
        }
      }
    };
    setCurrentUser(mockUser);
    applyTheme(mockUser.settings.theme);
  }, []);

  useEffect(() => {
    loadCurrentUser();
  }, [loadCurrentUser]);

  const applyTheme = (themeSettings) => {
    const root = document.documentElement;
    root.style.setProperty("--primary-color", themeSettings.primary_color || "#22c55e");
    
    if (themeSettings.dark_mode) {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

  const filteredNavItems = navigationItems.filter(item => 
    !currentUser || item.roles.includes(currentUser.role)
  );

  if (!currentUser) {
    return children;
  }

  return (
    <SidebarProvider>
      <style>{`
        :root {
          --primary-color: ${theme.primary_color};
          --primary-light: ${theme.primary_color}20;
          --primary-dark: ${theme.primary_color}dd;
        }
        
        .ds-primary {
          background-color: var(--primary-color) !important;
        }
        
        .ds-primary-light {
          background-color: var(--primary-light) !important;
        }
        
        .ds-primary-text {
          color: var(--primary-color) !important;
        }
        
        .ds-hover:hover {
          background-color: var(--primary-light) !important;
          color: var(--primary-color) !important;
        }
        
        .gradient-bg {
          background: linear-gradient(135deg, #f0fdf4, #ecfdf5);
        }
        
        .glass-card {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.3);
        }
        
        * {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, system-ui, sans-serif;
        }
      `}</style>
      
      <div className="min-h-screen flex w-full gradient-bg">
        <Sidebar className="border-r border-green-100 bg-white/80 backdrop-blur-sm">
          <SidebarHeader className="border-b border-green-100 p-6">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Building2 className="w-5 h-5 text-white" />
                  <Leaf className="w-3 h-3 text-white absolute -top-1 -right-1" />
                </div>
              </div>
              <div>
                <h2 className="font-bold text-gray-900 text-lg">DScontrolCar</h2>
                <p className="text-xs text-gray-600">Soluções Inteligentes</p>
              </div>
            </div>
          </SidebarHeader>
          
          <SidebarContent className="p-3">
            <SidebarGroup>
              <SidebarGroupLabel className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 py-2">
                Navegação
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {filteredNavItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton 
                        asChild 
                        className={`ds-hover transition-all duration-300 rounded-xl mb-1 ${
                          location.pathname === item.url ? 'ds-primary-light ds-primary-text shadow-sm' : ''
                        }`}
                      >
                        <Link to={item.url} className="flex items-center gap-3 px-4 py-3">
                          <item.icon className="w-5 h-5" />
                          <span className="font-medium">{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>

          <SidebarFooter className="border-t border-green-100 p-4">
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-3 w-full p-3 rounded-xl ds-hover transition-all duration-300">
                <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-500 rounded-full flex items-center justify-center text-white font-semibold shadow-md">
                  {currentUser?.full_name?.[0]?.toUpperCase() || 'U'}
                </div>
                <div className="flex-1 text-left">
                  <p className="font-medium text-gray-900 text-sm">{currentUser?.full_name || 'Usuário'}</p>
                  <p className="text-xs text-gray-500">{currentUser?.role}</p>
                </div>
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 glass-card">
                <DropdownMenuItem disabled className="cursor-default">
                  <span className="text-xs text-gray-500">{currentUser?.email}</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                  <LogOut className="w-4 h-4 mr-2" />
                  Sair
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarFooter>
        </Sidebar>

        <main className="flex-1 flex flex-col">
          <header className="bg-white/80 backdrop-blur-sm border-b border-green-100 px-6 py-4 md:hidden">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="hover:bg-green-50 p-2 rounded-lg transition-colors duration-200" />
              <h1 className="text-xl font-bold text-gray-900">DScontrolCar</h1>
            </div>
          </header>

          <div className="flex-1 overflow-auto">
            {children}
          </div>
          
          <footer className="bg-white/60 backdrop-blur-sm border-t border-green-100 p-4">
            <div className="text-center">
              <p className="text-sm text-gray-600">
                © 2024 Luan Cardoso Desenvolvedor. Todos os direitos reservados.
              </p>
            </div>
          </footer>
        </main>
      </div>
    </SidebarProvider>
  );
}
