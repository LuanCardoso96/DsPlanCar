import React, { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Plus,
  Search,
  LogOut,
  Edit,
  CheckCircle,
  Clock,
  MapPin,
  Car,
  User as UserIcon,
  Calendar,
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

const statusColors = {
  in_progress: "bg-blue-100 text-blue-800",
  completed: "bg-green-100 text-green-800",
  cancelled: "bg-gray-100 text-gray-800",
};

const statusLabels = {
  in_progress: "Em Andamento",
  completed: "Concluída",
  cancelled: "Cancelada",
};

export default function VehicleExits() {
  const [exits, setExits] = useState([]);
  const [filteredExits, setFilteredExits] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [people, setPeople] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedExit, setSelectedExit] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    vehicle_id: "",
    person_id: "",
    departure_date: "",
    return_date: "",
    destination: "",
    purpose: "",
    status: "in_progress",
    notes: "",
  });

  const filterExits = useCallback(() => {
    if (!searchTerm) {
      setFilteredExits(exits);
      return;
    }

    const filtered = exits.filter(
      (exit) =>
        exit.destination?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        exit.purpose?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        exit.notes?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredExits(filtered);
  }, [exits, searchTerm]);

  useEffect(() => {
    loadData();
    loadCurrentUser();
  }, []);

  useEffect(() => {
    filterExits();
  }, [filterExits]);

  const loadCurrentUser = () => {
    setCurrentUser({
      full_name: "João Silva",
      email: "joao.silva@empresa.com",
      role: "ADMIN"
    });
  };

  const loadData = () => {
    // Mock exits data
    const mockExits = [
      {
        id: 1,
        vehicle_id: 1,
        person_id: 1,
        departure_date: "2024-01-15T08:30:00",
        return_date: "2024-01-15T17:00:00",
        destination: "São Paulo",
        purpose: "Reunião de negócios",
        status: "completed",
        notes: "Reunião importante",
        created_date: "2024-01-15T00:00:00"
      },
      {
        id: 2,
        vehicle_id: 2,
        person_id: 2,
        departure_date: "2024-01-16T09:00:00",
        return_date: "",
        destination: "Rio de Janeiro",
        purpose: "Visita técnica",
        status: "in_progress",
        notes: "",
        created_date: "2024-01-16T00:00:00"
      },
      {
        id: 3,
        vehicle_id: 3,
        person_id: 3,
        departure_date: "2024-01-14T14:00:00",
        return_date: "2024-01-14T18:00:00",
        destination: "Brasília",
        purpose: "Apresentação",
        status: "completed",
        notes: "Apresentação bem-sucedida",
        created_date: "2024-01-14T00:00:00"
      }
    ];
    setExits(mockExits);

    // Mock vehicles data
    const mockVehicles = [
      { id: 1, brand: "Toyota", model: "Corolla", license_plate: "ABC-1234" },
      { id: 2, brand: "Honda", model: "Civic", license_plate: "DEF-5678" },
      { id: 3, brand: "Ford", model: "Focus", license_plate: "GHI-9012" }
    ];
    setVehicles(mockVehicles);

    // Mock people data
    const mockPeople = [
      { id: 1, name: "João Silva", department: "TI" },
      { id: 2, name: "Maria Santos", department: "RH" },
      { id: 3, name: "Pedro Costa", department: "Vendas" }
    ];
    setPeople(mockPeople);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    setTimeout(() => {
      if (selectedExit) {
        setExits(prev => prev.map(e => e.id === selectedExit.id ? { ...formData, id: selectedExit.id } : e));
      } else {
        const newExit = {
          ...formData,
          id: Date.now(),
          created_date: new Date().toISOString()
        };
        setExits(prev => [newExit, ...prev]);
      }
      
      setIsDialogOpen(false);
      resetForm();
      setIsLoading(false);
    }, 1000);
  };

  const handleEdit = (exit) => {
    setSelectedExit(exit);
    setFormData(exit);
    setIsDialogOpen(true);
  };

  const handleComplete = (exitId) => {
    setExits(prev => prev.map(e => 
      e.id === exitId 
        ? { ...e, status: "completed", return_date: new Date().toISOString() }
        : e
    ));
  };

  const resetForm = () => {
    setFormData({
      vehicle_id: "",
      person_id: "",
      departure_date: "",
      return_date: "",
      destination: "",
      purpose: "",
      status: "in_progress",
      notes: "",
    });
    setSelectedExit(null);
  };

  const getVehicleInfo = (vehicleId) => {
    return vehicles.find(v => v.id === vehicleId);
  };

  const getPersonInfo = (personId) => {
    return people.find(p => p.id === personId);
  };

  return (
    <div className="p-4 md:p-8 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Saídas de Veículos</h1>
            <p className="text-gray-600 mt-1">Gerencie as saídas e retornos de veículos</p>
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button 
                className="ds-primary text-white shadow-lg hover:shadow-xl transition-all duration-300"
                onClick={resetForm}
              >
                <Plus className="w-4 h-4 mr-2" />
                Nova Saída
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {selectedExit ? "Editar Saída" : "Nova Saída"}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="vehicle_id">Veículo *</Label>
                    <Select
                      value={formData.vehicle_id}
                      onValueChange={(value) => setFormData({...formData, vehicle_id: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecionar veículo" />
                      </SelectTrigger>
                      <SelectContent>
                        {vehicles.map((vehicle) => (
                          <SelectItem key={vehicle.id} value={vehicle.id.toString()}>
                            {vehicle.brand} {vehicle.model} - {vehicle.license_plate}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="person_id">Funcionário *</Label>
                    <Select
                      value={formData.person_id}
                      onValueChange={(value) => setFormData({...formData, person_id: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecionar funcionário" />
                      </SelectTrigger>
                      <SelectContent>
                        {people.map((person) => (
                          <SelectItem key={person.id} value={person.id.toString()}>
                            {person.name} - {person.department}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="destination">Destino *</Label>
                    <Input
                      id="destination"
                      value={formData.destination}
                      onChange={(e) => setFormData({...formData, destination: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="purpose">Finalidade *</Label>
                    <Input
                      id="purpose"
                      value={formData.purpose}
                      onChange={(e) => setFormData({...formData, purpose: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="departure_date">Data/Hora de Saída *</Label>
                    <Input
                      id="departure_date"
                      type="datetime-local"
                      value={formData.departure_date}
                      onChange={(e) => setFormData({...formData, departure_date: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="return_date">Data/Hora de Retorno</Label>
                    <Input
                      id="return_date"
                      type="datetime-local"
                      value={formData.return_date}
                      onChange={(e) => setFormData({...formData, return_date: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="status">Status</Label>
                    <Select
                      value={formData.status}
                      onValueChange={(value) => setFormData({...formData, status: value})}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(statusLabels).map(([value, label]) => (
                          <SelectItem key={value} value={value}>
                            {label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label htmlFor="notes">Observações</Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => setFormData({...formData, notes: e.target.value})}
                    rows={3}
                  />
                </div>
                <div className="flex justify-end gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                  >
                    Cancelar
                  </Button>
                  <Button 
                    type="submit" 
                    className="ds-primary text-white"
                    disabled={isLoading}
                  >
                    {isLoading ? "Salvando..." : selectedExit ? "Atualizar" : "Criar"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Buscar saídas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Exits Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredExits.map((exit) => {
            const vehicle = getVehicleInfo(exit.vehicle_id);
            const person = getPersonInfo(exit.person_id);
            
            return (
              <Card key={exit.id} className="glass-card border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg font-bold text-gray-900">
                        {exit.destination}
                      </CardTitle>
                      <p className="text-sm text-gray-500">{exit.purpose}</p>
                    </div>
                    <Badge className={statusColors[exit.status]}>
                      {statusLabels[exit.status]}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Car className="w-4 h-4 text-gray-400" />
                    <span className="text-sm">
                      {vehicle?.brand} {vehicle?.model} - {vehicle?.license_plate}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <UserIcon className="w-4 h-4 text-gray-400" />
                    <span className="text-sm">{person?.name}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span className="text-sm">
                      Saída: {format(new Date(exit.departure_date), "dd/MM/yyyy HH:mm", { locale: ptBR })}
                    </span>
                  </div>
                  
                  {exit.return_date && (
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span className="text-sm">
                        Retorno: {format(new Date(exit.return_date), "dd/MM/yyyy HH:mm", { locale: ptBR })}
                      </span>
                    </div>
                  )}
                  
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span className="text-sm">{exit.destination}</span>
                  </div>
                  
                  {exit.notes && (
                    <div className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                      {exit.notes}
                    </div>
                  )}
                  
                  <div className="flex justify-between items-center pt-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(exit)}
                      className="ds-hover"
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Editar
                    </Button>
                    
                    {exit.status === "in_progress" && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleComplete(exit.id)}
                        className="bg-green-50 text-green-700 hover:bg-green-100"
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Finalizar
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {filteredExits.length === 0 && (
          <div className="text-center py-12">
            <LogOut className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">Nenhuma saída encontrada</p>
            <p className="text-gray-400 text-sm mt-2">
              {searchTerm ? "Tente uma busca diferente" : "Comece registrando uma nova saída"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}