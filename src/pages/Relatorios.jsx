import { useState, useEffect } from "react";
import { listSaidas, getVehicles, getPeople } from "@/services/FirestoreService";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { LogOut, Car, User, Calendar, Clock, Filter } from "lucide-react";

export default function Relatorios() {
  const [saidas, setSaidas] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [people, setPeople] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Filtros
  const [filters, setFilters] = useState({
    vehicleId: "",
    driverId: "",
    status: "",
    dateFrom: "",
    dateTo: "",
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [saidasData, vehiclesData, peopleData] = await Promise.all([
        listSaidas({ max: 100 }),
        getVehicles(),
        getPeople()
      ]);
      
      setSaidas(saidasData);
      setVehicles(vehiclesData);
      setPeople(peopleData);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getFilteredSaidas = () => {
    return saidas.filter(saida => {
      if (filters.vehicleId && filters.vehicleId !== "all" && saida.vehicleId !== filters.vehicleId) return false;
      if (filters.driverId && filters.driverId !== "all" && saida.driverId !== filters.driverId) return false;
      if (filters.status && filters.status !== "all" && saida.status !== filters.status) return false;
      
      if (filters.dateFrom || filters.dateTo) {
        const saidaDate = new Date(saida.startedAt.seconds * 1000);
        if (filters.dateFrom && saidaDate < new Date(filters.dateFrom)) return false;
        if (filters.dateTo && saidaDate > new Date(filters.dateTo)) return false;
      }
      
      return true;
    });
  };

  const getVehicleName = (vehicleId) => {
    const vehicle = vehicles.find(v => v.id === vehicleId);
    return vehicle ? vehicle.name : 'Veículo não encontrado';
  };

  const getPersonName = (personId) => {
    const person = people.find(p => p.id === personId);
    return person ? person.name : 'Pessoa não encontrada';
  };

  const filteredSaidas = getFilteredSaidas();

  const getStatusBadge = (status) => {
    const statusConfig = {
      'em_andamento': { label: 'Em Andamento', className: 'bg-orange-100 text-orange-800' },
      'concluida': { label: 'Concluída', className: 'bg-green-100 text-green-800' },
      'cancelada': { label: 'Cancelada', className: 'bg-red-100 text-red-800' },
    };
    
    const config = statusConfig[status] || { label: status, className: 'bg-gray-100 text-gray-800' };
    
    return (
      <Badge className={config.className}>
        {config.label}
      </Badge>
    );
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return 'Sem data';
    const date = new Date(timestamp.seconds * 1000);
    return date.toLocaleDateString('pt-BR');
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return 'Sem hora';
    const date = new Date(timestamp.seconds * 1000);
    return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mx-auto"></div>
          <p className="mt-2 text-gray-600">Carregando histórico...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Histórico de Saídas</h1>
        <p className="text-gray-600 mt-1">Registro completo de todas as saídas de veículos</p>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filtros
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Veículo */}
            <div>
              <Label htmlFor="vehicle">Veículo</Label>
              <Select value={filters.vehicleId || "all"} onValueChange={(value) => setFilters({...filters, vehicleId: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos os veículos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os veículos</SelectItem>
                  {vehicles.map(vehicle => (
                    <SelectItem key={vehicle.id} value={vehicle.id}>
                      {vehicle.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Motorista */}
            <div>
              <Label htmlFor="driver">Motorista</Label>
              <Select value={filters.driverId || "all"} onValueChange={(value) => setFilters({...filters, driverId: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos os motoristas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os motoristas</SelectItem>
                  {people.map(person => (
                    <SelectItem key={person.id} value={person.id}>
                      {person.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Status */}
            <div>
              <Label htmlFor="status">Status</Label>
              <Select value={filters.status || "all"} onValueChange={(value) => setFilters({...filters, status: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos os status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os status</SelectItem>
                  <SelectItem value="em_andamento">Em Andamento</SelectItem>
                  <SelectItem value="concluida">Concluída</SelectItem>
                  <SelectItem value="cancelada">Cancelada</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Data Início */}
            <div>
              <Label htmlFor="dateFrom">Data Início</Label>
              <Input
                id="dateFrom"
                type="date"
                value={filters.dateFrom}
                onChange={(e) => setFilters({...filters, dateFrom: e.target.value})}
              />
            </div>

            {/* Data Fim */}
            <div>
              <Label htmlFor="dateTo">Data Fim</Label>
              <Input
                id="dateTo"
                type="date"
                value={filters.dateTo}
                onChange={(e) => setFilters({...filters, dateTo: e.target.value})}
              />
            </div>
          </div>

          <div className="flex justify-end mt-4">
            <Button
              variant="outline"
              onClick={() => setFilters({
                vehicleId: "",
                driverId: "",
                status: "",
                dateFrom: "",
                dateTo: "",
              })}
            >
              Limpar Filtros
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <LogOut className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total de Saídas</p>
                <p className="text-2xl font-bold text-gray-900">{filteredSaidas.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Em Andamento</p>
                <p className="text-2xl font-bold text-gray-900">
                  {filteredSaidas.filter(s => s.status === 'em_andamento').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Concluídas</p>
                <p className="text-2xl font-bold text-gray-900">
                  {filteredSaidas.filter(s => s.status === 'concluida').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lista de Saídas */}
      <Card>
        <CardHeader>
          <CardTitle>Histórico de Saídas</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredSaidas.length === 0 ? (
            <div className="text-center py-8">
              <LogOut className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">Nenhuma saída encontrada</p>
              <p className="text-gray-400 text-sm mt-1">Ajuste os filtros para ver mais resultados</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredSaidas.map((saida) => (
                <div key={saida.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-500 rounded-full flex items-center justify-center">
                      <Car className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {getVehicleName(saida.vehicleId)}
                      </p>
                      <p className="text-sm text-gray-500">
                        Motorista: {getPersonName(saida.driverId)}
                      </p>
                      <p className="text-sm text-gray-500">
                        Propósito: {saida.purpose || 'Sem descrição'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="mb-2">
                      {getStatusBadge(saida.status)}
                    </div>
                    <div className="text-sm text-gray-600">
                      <p className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {formatDate(saida.startedAt)}
                      </p>
                      <p className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {formatTime(saida.startedAt)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}