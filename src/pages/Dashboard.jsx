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

  const StatCard = ({ title, value, icon: Icon, color, subtitle }) => (
    <Card className="glass-card border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <CardTitle className="text-sm font-medium text-gray-600">{title}</CardTitle>
        <div className={`p-2 rounded-lg ${color}`}>
          <Icon className="h-5 w-5 text-white" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold text-gray-900 mb-1">{value}</div>
        {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
      </CardContent>
    </Card>
  );

  return (
    <div className="p-4 md:p-8 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
            <p className="text-gray-600">
              Bem-vindo, {currentUser?.full_name}. Aqui está o resumo das atividades.
            </p>
          </div>
          <div className="text-right">
            <p className="text-lg font-semibold text-gray-900">
              {format(new Date(), "EEEE", { locale: ptBR })}
            </p>
            <p className="text-gray-600">
              {format(new Date(), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
            </p>
          </div>
        </div>

        {/* Alerts */}
        {alerts.length > 0 && (
          <div className="space-y-2">
            {alerts.map((alert, index) => (
              <div
                key={index}
                className="flex items-center gap-3 p-4 bg-yellow-50 border border-yellow-200 rounded-xl"
              >
                <AlertTriangle className="h-5 w-5 text-yellow-600 flex-shrink-0" />
                <p className="text-yellow-800">{alert.message}</p>
              </div>
            ))}
          </div>
        )}

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          <StatCard
            title="Total de Veículos"
            value={stats.totalVehicles}
            icon={Car}
            color="bg-gradient-to-r from-blue-500 to-blue-600"
            subtitle="Na frota"
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
          <Card className="glass-card border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <LogOut className="h-5 w-5 ds-primary-text" />
                Saídas Recentes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentExits.length > 0 ? (
                  recentExits.map((exit) => (
                    <div key={exit.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-500 rounded-full flex items-center justify-center">
                          <Car className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            Saída #{exit.id.slice(-6)}
                          </p>
                          <p className="text-sm text-gray-500">
                            {exit.purpose || 'Sem descrição'}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge 
                          variant={exit.status === 'concluida' ? 'default' : 'secondary'}
                          className={exit.status === 'em_andamento' ? 'bg-orange-100 text-orange-800' : ''}
                        >
                          {exit.status === 'em_andamento' ? 'Em Andamento' : exit.status === 'concluida' ? 'Concluída' : 'Cancelada'}
                        </Badge>
                        <p className="text-xs text-gray-500 mt-1">
                          {exit.startedAt ? new Date(exit.startedAt.seconds * 1000).toLocaleDateString('pt-BR') : 'Sem data'}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <Car className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">Nenhuma saída registrada</p>
                    <p className="text-gray-400 text-sm mt-1">As saídas aparecerão aqui quando forem registradas</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Upcoming Schedules */}
          <Card className="glass-card border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 ds-primary-text" />
                Próximos Agendamentos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingSchedules.length > 0 ? (
                  upcomingSchedules.map((schedule) => (
                    <div key={schedule.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-500 rounded-full flex items-center justify-center">
                          <Clock className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {schedule.title || 'Agendamento'}
                          </p>
                          <p className="text-sm text-gray-500">
                            {schedule.description || 'Sem descrição'}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">
                          {schedule.startAt ? new Date(schedule.startAt.seconds * 1000).toLocaleDateString('pt-BR') : 'Sem data'}
                        </p>
                        <p className="text-xs text-gray-500">
                          {schedule.startAt ? new Date(schedule.startAt.seconds * 1000).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) : 'Sem hora'}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">Nenhum agendamento aprovado</p>
                    <p className="text-gray-400 text-sm mt-1">Os agendamentos aprovados aparecerão aqui</p>
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