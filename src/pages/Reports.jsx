import React, { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";
import {
  Download,
  Calendar,
  TrendingUp,
  Car,
  Users,
  Clock,
  MapPin,
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

export default function Reports() {
  const [currentUser, setCurrentUser] = useState(null);
  const [dateRange, setDateRange] = useState({
    start: format(new Date(new Date().getFullYear(), new Date().getMonth(), 1), "yyyy-MM-dd"),
    end: format(new Date(), "yyyy-MM-dd")
  });
  const [reportType, setReportType] = useState("usage");

  useEffect(() => {
    loadCurrentUser();
  }, []);

  const loadCurrentUser = () => {
    setCurrentUser({
      full_name: "João Silva",
      email: "joao.silva@empresa.com",
      role: "ADMIN"
    });
  };

  // Mock data for reports
  const mockUsageData = [
    { name: 'Toyota Corolla', usage: 45, trips: 12 },
    { name: 'Honda Civic', usage: 38, trips: 8 },
    { name: 'Ford Focus', usage: 25, trips: 6 },
    { name: 'Volkswagen Golf', usage: 32, trips: 9 },
  ];

  const mockStatusData = [
    { name: 'Disponível', value: 8, color: '#00C49F' },
    { name: 'Em Uso', value: 3, color: '#0088FE' },
    { name: 'Manutenção', value: 2, color: '#FFBB28' },
    { name: 'Arquivado', value: 1, color: '#FF8042' },
  ];

  const mockMonthlyData = [
    { month: 'Jan', vehicles: 12, trips: 45 },
    { month: 'Fev', vehicles: 14, trips: 52 },
    { month: 'Mar', vehicles: 13, trips: 48 },
    { month: 'Abr', vehicles: 15, trips: 58 },
    { month: 'Mai', vehicles: 16, trips: 62 },
    { month: 'Jun', vehicles: 14, trips: 55 },
  ];

  const mockDriverData = [
    { name: 'João Silva', trips: 15, distance: 1200 },
    { name: 'Maria Santos', trips: 12, distance: 980 },
    { name: 'Pedro Costa', trips: 8, distance: 650 },
    { name: 'Ana Oliveira', trips: 6, distance: 480 },
  ];

  const handleExport = () => {
    // Simulate export functionality
    alert("Relatório exportado com sucesso!");
  };

  const renderUsageReport = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Car className="h-5 w-5" />
            Uso de Veículos por Modelo
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={mockUsageData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="usage" fill="#8884d8" name="Horas de Uso" />
              <Bar dataKey="trips" fill="#82ca9d" name="Número de Viagens" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Status dos Veículos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={mockStatusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {mockStatusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );

  const renderMonthlyReport = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Tendência Mensal
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={mockMonthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="vehicles" stroke="#8884d8" name="Veículos Ativos" />
              <Line type="monotone" dataKey="trips" stroke="#82ca9d" name="Viagens Realizadas" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );

  const renderDriverReport = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Performance dos Motoristas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={mockDriverData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="trips" fill="#8884d8" name="Número de Viagens" />
              <Bar dataKey="distance" fill="#82ca9d" name="Distância (km)" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="p-4 md:p-8 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Relatórios</h1>
            <p className="text-gray-600 mt-1">Análise e relatórios do sistema de gestão de veículos</p>
          </div>
          
          <Button 
            className="ds-primary text-white shadow-lg hover:shadow-xl transition-all duration-300"
            onClick={handleExport}
          >
            <Download className="w-4 h-4 mr-2" />
            Exportar Relatório
          </Button>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Filtros</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="reportType">Tipo de Relatório</Label>
                <Select value={reportType} onValueChange={setReportType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="usage">Uso de Veículos</SelectItem>
                    <SelectItem value="monthly">Tendência Mensal</SelectItem>
                    <SelectItem value="drivers">Performance dos Motoristas</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="startDate">Data Inicial</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={dateRange.start}
                  onChange={(e) => setDateRange({...dateRange, start: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="endDate">Data Final</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={dateRange.end}
                  onChange={(e) => setDateRange({...dateRange, end: e.target.value})}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Report Content */}
        {reportType === "usage" && renderUsageReport()}
        {reportType === "monthly" && renderMonthlyReport()}
        {reportType === "drivers" && renderDriverReport()}

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="glass-card border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total de Veículos</p>
                  <p className="text-2xl font-bold text-gray-900">14</p>
                </div>
                <Car className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="glass-card border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Viagens Este Mês</p>
                  <p className="text-2xl font-bold text-gray-900">55</p>
                </div>
                <MapPin className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="glass-card border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Motoristas Ativos</p>
                  <p className="text-2xl font-bold text-gray-900">8</p>
                </div>
                <Users className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="glass-card border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Horas de Uso</p>
                  <p className="text-2xl font-bold text-gray-900">1,240</p>
                </div>
                <Clock className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}