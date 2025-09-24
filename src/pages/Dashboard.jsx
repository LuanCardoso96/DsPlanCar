import React, { useState, useEffect } from "react";
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
    // Mock user data
    setCurrentUser({
      full_name: "João Silva",
      email: "joao.silva@empresa.com",
      department: "TI"
    });
  };

  const loadDashboardData = () => {
    // Mock data
    const mockVehicles = [
      { id: 1, brand: "Toyota", model: "Corolla", status: "available", insurance_expiry: "2024-02-15", license_expiry: "2024-03-20" },
      { id: 2, brand: "Honda", model: "Civic", status: "available", insurance_expiry: "2024-01-30", license_expiry: "2024-02-10" },
      { id: 3, brand: "Ford", model: "Focus", status: "in_use", insurance_expiry: "2024-04-05", license_expiry: "2024-05-15" },
      { id: 4, brand: "Volkswagen", model: "Golf", status: "maintenance", insurance_expiry: "2024-03-10", license_expiry: "2024-04-25" },
    ];

    const mockPeople = [
      { id: 1, name: "João Silva", status: "active" },
      { id: 2, name: "Maria Santos", status: "active" },
      { id: 3, name: "Pedro Costa", status: "active" },
      { id: 4, name: "Ana Oliveira", status: "active" },
    ];

    const mockExits = [
      { id: 1, vehicle_id: 3, person_id: 1, status: "in_progress", departure_date: "2024-01-15T08:30:00" },
      { id: 2, vehicle_id: 1, person_id: 2, status: "completed", departure_date: "2024-01-14T14:20:00" },
    ];

    const mockSchedules = [
      { id: 1, vehicle_id: 2, person_id: 3, status: "approved", destination: "São Paulo", scheduled_departure: "2024-01-16T09:00:00" },
      { id: 2, vehicle_id: 4, person_id: 4, status: "pending", destination: "Rio de Janeiro", scheduled_departure: "2024-01-17T10:30:00" },
    ];

    setStats({
      totalVehicles: mockVehicles.length,
      availableVehicles: mockVehicles.filter(v => v.status === "available").length,
      totalPeople: mockPeople.length,
      activeExits: mockExits.filter(e => e.status === "in_progress").length,
      pendingSchedules: mockSchedules.filter(s => s.status === "pending").length,
    });

    // Load recent exits with details
    const exitsWithDetails = mockExits.map(exit => ({
      ...exit,
      vehicle: mockVehicles.find(v => v.id === exit.vehicle_id),
      person: mockPeople.find(p => p.id === exit.person_id),
    }));
    setRecentExits(exitsWithDetails);

    // Load upcoming schedules with details
    const schedulesWithDetails = mockSchedules.map(schedule => ({
      ...schedule,
      vehicle: mockVehicles.find(v => v.id === schedule.vehicle_id),
      person: mockPeople.find(p => p.id === schedule.person_id),
    }));
    setUpcomingSchedules(schedulesWithDetails);

    // Generate alerts
    const alertsData = [];
    
    mockVehicles.forEach(vehicle => {
      if (vehicle.insurance_expiry) {
        const daysUntilExpiry = Math.ceil((new Date(vehicle.insurance_expiry) - new Date()) / (1000 * 60 * 60 * 24));
        if (daysUntilExpiry <= 30 && daysUntilExpiry > 0) {
          alertsData.push({
            type: "warning",
            message: `Seguro do ${vehicle.brand} ${vehicle.model} vence em ${daysUntilExpiry} dias`,
          });
        }
      }
      
      if (vehicle.license_expiry) {
        const daysUntilExpiry = Math.ceil((new Date(vehicle.license_expiry) - new Date()) / (1000 * 60 * 60 * 24));
        if (daysUntilExpiry <= 30 && daysUntilExpiry > 0) {
          alertsData.push({
            type: "warning",
            message: `Licenciamento do ${vehicle.brand} ${vehicle.model} vence em ${daysUntilExpiry} dias`,
          });
        }
      }
    });
    
    setAlerts(alertsData);
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
                            {exit.vehicle?.brand} {exit.vehicle?.model}
                          </p>
                          <p className="text-sm text-gray-500">
                            {exit.person?.name}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge 
                          variant={exit.status === 'completed' ? 'default' : 'secondary'}
                          className={exit.status === 'in_progress' ? 'bg-orange-100 text-orange-800' : ''}
                        >
                          {exit.status === 'in_progress' ? 'Em Andamento' : 'Concluída'}
                        </Badge>
                        <p className="text-xs text-gray-500 mt-1">
                          {format(new Date(exit.departure_date), "dd/MM HH:mm")}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-8">Nenhuma saída recente</p>
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
                            {schedule.vehicle?.brand} {schedule.vehicle?.model}
                          </p>
                          <p className="text-sm text-gray-500 flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {schedule.destination}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">
                          {format(new Date(schedule.scheduled_departure), "dd/MM")}
                        </p>
                        <p className="text-xs text-gray-500">
                          {format(new Date(schedule.scheduled_departure), "HH:mm")}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-8">Nenhum agendamento próximo</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}