import React, { useState, useEffect } from "react";
import { getRelatoriosResumo, getVehicles, getPeople } from "@/services/FirestoreService";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Car,
  Users,
  LogOut,
  Calendar,
  AlertTriangle,
  TrendingUp,
  MapPin,
  Clock,
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalVehicles: 0,
    availableVehicles: 0,
    totalPeople: 0,
    activeExits: 0,
    pendingSchedules: 0,
  });
  const [recentExits, setRecentExits] = useState([]);
  const [upcomingSchedules, setUpcomingSchedules] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    loadDashboardData();
    loadCurrentUser();
  }, []);

  const loadCurrentUser = () => {
    // Mock user data - will be replaced by real auth data from Layout
    setCurrentUser({
      full_name: "Usuário",
      email: "usuario@empresa.com",
      department: "TI"
    });
  };

  const loadDashboardData = async () => {
    try {
      const [resumo, vehicles, people] = await Promise.all([
        getRelatoriosResumo(),
        getVehicles(),
        getPeople()
      ]);

      setStats({
        totalVehicles: vehicles.length,
        availableVehicles: vehicles.filter(v => v.status === 'available').length,
        totalPeople: people.length,
        activeExits: resumo.saidasEmAndamento,
        pendingSchedules: resumo.agPendentes,
      });

      // Load recent exits
      setRecentExits(resumo.ultimasSaidas);

      // Load upcoming schedules
      setUpcomingSchedules(resumo.proximosAgendamentos);

      // Generate alerts
      const alertsData = [];
      
      if (resumo.saidasEmAndamento > 0) {
        alertsData.push({
          type: "info",
          message: `${resumo.saidasEmAndamento} saída(s) em andamento`,
        });
      }
      
      if (resumo.agPendentes > 0) {
        alertsData.push({
          type: "warning",
          message: `${resumo.agPendentes} agendamento(s) pendente(s)`,
        });
      }
      
      setAlerts(alertsData);
    } catch (error) {
      console.error("Error loading dashboard data:", error);
    }
  };

  const StatCard = ({ title, value, icon: Icon, color, subtitle, trend }) => (
    <Card className="glass-card border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 bg-white/80 backdrop-blur-sm">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-sm font-semibold text-gray-700">{title}</CardTitle>
        <div className={`p-3 rounded-xl ${color} shadow-lg`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-4xl font-bold text-gray-900 mb-2">{value}</div>
        {subtitle && <p className="text-sm text-gray-600 font-medium">{subtitle}</p>}
        {trend && (
          <div className="flex items-center gap-1 mt-2">
            <TrendingUp className="h-4 w-4 text-green-500" />
            <span className="text-xs text-green-600 font-medium">{trend}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-slate-100">
      <div className="container mx-auto px-6 py-8">
        {/* Header Profissional */}
        <div className="mb-10">
          <div className="flex items-center justify-between">
            <div className="space-y-3">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                Olá, {currentUser?.full_name || "Usuário"}! 👋
              </h1>
              <p className="text-lg text-gray-600 font-medium">
                Bem-vindo ao painel de controle do DScontrolCar
              </p>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Clock className="w-4 h-4" />
                <span>{format(new Date(), "EEEE, dd 'de' MMMM 'de' yyyy", { locale: ptBR })}</span>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-right">
                <p className="text-sm text-gray-500 font-medium">Departamento</p>
                <p className="font-bold text-gray-900 text-lg">
                  {currentUser?.department || "N/A"}
                </p>
              </div>
              <div className="relative">
                <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-xl">
                  <Users className="w-7 h-7 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-400 rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Alerts */}
        {alerts.length > 0 && (
          <div className="mb-8 space-y-3">
            {alerts.map((alert, index) => (
              <div
                key={index}
                className="flex items-center gap-4 p-5 bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-2xl shadow-lg backdrop-blur-sm"
              >
                <div className="p-2 bg-yellow-100 rounded-xl">
                  <AlertTriangle className="h-6 w-6 text-yellow-600" />
                </div>
                <div>
                  <p className="text-yellow-800 font-semibold text-lg">{alert.message}</p>
                  <p className="text-yellow-700 text-sm">Requer sua atenção</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-10">
          <StatCard
            title="Total de Veículos"
            value={stats.totalVehicles}
            icon={Car}
            color="bg-gradient-to-r from-blue-500 to-blue-600"
            subtitle="Na frota"
            trend="+2 esta semana"
          />
          <StatCard
            title="Veículos Disponíveis"
            value={stats.availableVehicles}
            icon={Car}
            color="bg-gradient-to-r from-green-500 to-green-600"
            subtitle="Prontos para uso"
          />
          <StatCard
            title="Funcionários Ativos"
            value={stats.totalPeople}
            icon={Users}
            color="bg-gradient-to-r from-purple-500 to-purple-600"
            subtitle="Habilitados"
          />
          <StatCard
            title="Saídas em Andamento"
            value={stats.activeExits}
            icon={LogOut}
            color="bg-gradient-to-r from-orange-500 to-orange-600"
            subtitle="Veículos em uso"
          />
          <StatCard
            title="Agendamentos Pendentes"
            value={stats.pendingSchedules}
            icon={Calendar}
            color="bg-gradient-to-r from-red-500 to-red-600"
            subtitle="Aguardando aprovação"
          />
        </div>

        {/* Recent Activities */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Recent Exits */}
          <Card className="glass-card border-0 shadow-xl bg-white/80 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-3 text-xl font-bold text-gray-900">
                <div className="p-2 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl">
                  <LogOut className="h-6 w-6 text-white" />
                </div>
                Saídas Recentes
              </CardTitle>
              <p className="text-gray-600 text-sm">Últimas atividades registradas</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentExits.length > 0 ? (
                  recentExits.map((exit) => (
                    <div key={exit.id} className="flex items-center justify-between p-5 bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl hover:from-gray-100 hover:to-gray-200 transition-all duration-300 border border-gray-200">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-500 rounded-2xl flex items-center justify-center shadow-lg">
                          <Car className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <p className="font-bold text-gray-900 text-lg">
                            Saída #{exit.id.slice(-6)}
                          </p>
                          <p className="text-sm text-gray-600 font-medium">
                            {exit.purpose || 'Sem descrição'}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge 
                          variant={exit.status === 'concluida' ? 'default' : 'secondary'}
                          className={`px-3 py-1 font-semibold ${
                            exit.status === 'em_andamento' 
                              ? 'bg-orange-100 text-orange-800 border-orange-200' 
                              : exit.status === 'concluida' 
                                ? 'bg-green-100 text-green-800 border-green-200'
                                : 'bg-red-100 text-red-800 border-red-200'
                          }`}
                        >
                          {exit.status === 'em_andamento' ? 'Em Andamento' : exit.status === 'concluida' ? 'Concluída' : 'Cancelada'}
                        </Badge>
                        <p className="text-xs text-gray-500 mt-2 font-medium">
                          {exit.startedAt ? new Date(exit.startedAt.seconds * 1000).toLocaleDateString('pt-BR') : 'Sem data'}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <LogOut className="h-8 w-8 text-gray-400" />
                    </div>
                    <p className="text-gray-500 font-medium">Nenhuma saída recente</p>
                    <p className="text-sm text-gray-400">As saídas aparecerão aqui quando registradas</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Upcoming Schedules */}
          <Card className="glass-card border-0 shadow-xl bg-white/80 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-3 text-xl font-bold text-gray-900">
                <div className="p-2 bg-gradient-to-r from-green-500 to-green-600 rounded-xl">
                  <Calendar className="h-6 w-6 text-white" />
                </div>
                Próximos Agendamentos
              </CardTitle>
              <p className="text-gray-600 text-sm">Agendamentos aprovados</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingSchedules.length > 0 ? (
                  upcomingSchedules.map((schedule) => (
                    <div key={schedule.id} className="flex items-center justify-between p-5 bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl hover:from-gray-100 hover:to-gray-200 transition-all duration-300 border border-gray-200">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-500 rounded-2xl flex items-center justify-center shadow-lg">
                          <Clock className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <p className="font-bold text-gray-900 text-lg">
                            {schedule.title || 'Agendamento'}
                          </p>
                          <p className="text-sm text-gray-600 font-medium">
                            {schedule.description || 'Sem descrição'}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-gray-900">
                          {schedule.startAt ? new Date(schedule.startAt.seconds * 1000).toLocaleDateString('pt-BR') : 'Sem data'}
                        </p>
                        <p className="text-xs text-gray-500 font-medium">
                          {schedule.startAt ? new Date(schedule.startAt.seconds * 1000).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) : 'Sem hora'}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Calendar className="h-8 w-8 text-gray-400" />
                    </div>
                    <p className="text-gray-500 font-medium">Nenhum agendamento próximo</p>
                    <p className="text-sm text-gray-400">Os agendamentos aprovados aparecerão aqui</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}