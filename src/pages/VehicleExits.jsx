import React, { useState, useEffect, useCallback } from "react";
import { FirestoreService } from "@/firebase/services";
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

  const loadData = async () => {
    try {
      const [exitsData, vehiclesData, peopleData] = await Promise.all([
        FirestoreService.getVehicleExits(),
        FirestoreService.getVehicles(),
        FirestoreService.getPeople()
      ]);
      
      setExits(exitsData);
      setVehicles(vehiclesData);
      setPeople(peopleData);
    } catch (error) {
      console.error("Error loading data:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      if (selectedExit) {
        await FirestoreService.updateVehicleExit(selectedExit.id, formData);
      } else {
        await FirestoreService.createVehicleExit(formData);
      }
      
      loadData();
      setIsDialogOpen(false);
      resetForm();
    } catch (error) {
      console.error("Error saving vehicle exit:", error);
      alert("Erro ao salvar saída. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (exit) => {
    setSelectedExit(exit);
    setFormData(exit);
    setIsDialogOpen(true);
  };

  const handleComplete = async (exitId) => {
    try {
      await FirestoreService.updateVehicleExit(exitId, {
        status: "completed",
        return_date: new Date().toISOString()
      });
      loadData();
    } catch (error) {
      console.error("Error completing exit:", error);
      alert("Erro ao finalizar saída. Tente novamente.");
    }
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