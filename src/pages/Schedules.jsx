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
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Plus,
  Search,
  Calendar as CalendarIcon,
  Edit,
  Check,
  X,
  Clock,
  MapPin,
  User as UserIcon,
  Car,
  ArrowRight,
  AlertTriangle,
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800",
  approved: "bg-green-100 text-green-800",
  rejected: "bg-red-100 text-red-800",
  cancelled: "bg-gray-100 text-gray-800",
  converted: "bg-blue-100 text-blue-800",
};

const statusLabels = {
  pending: "Pendente",
  approved: "Aprovado",
  rejected: "Rejeitado",
  cancelled: "Cancelado",
  converted: "Convertido",
};

const priorityColors = {
  low: "bg-gray-100 text-gray-800",
  medium: "bg-blue-100 text-blue-800",
  high: "bg-orange-100 text-orange-800",
  urgent: "bg-red-100 text-red-800",
};

const priorityLabels = {
  low: "Baixa",
  medium: "Média",
  high: "Alta",
  urgent: "Urgente",
};

export default function Schedules() {
  const [schedules, setSchedules] = useState([]);
  const [filteredSchedules, setFilteredSchedules] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [people, setPeople] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [conflictCheck, setConflictCheck] = useState("");

  const [formData, setFormData] = useState({
    vehicle_id: "",
    person_id: "",
    scheduled_departure: "",
    scheduled_return: "",
    destination: "",
    purpose: "",
    status: "pending",
    priority: "medium",
    notes: "",
  });

  const filterSchedules = useCallback(() => {
    if (!searchTerm) {
      setFilteredSchedules(schedules);
      return;
    }

    const filtered = schedules.filter(
      (schedule) =>
        schedule.destination?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        schedule.purpose?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        schedule.notes?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredSchedules(filtered);
  }, [schedules, searchTerm]);

  useEffect(() => {
    loadSchedules();
    loadVehicles();
    loadPeople();
    loadCurrentUser();
  }, []);

  useEffect(() => {
    filterSchedules();
  }, [filterSchedules]);

  const loadCurrentUser = () => {
    setCurrentUser({
      full_name: "exemplo",
      email: "email",
      role: "Funcionario"
    });
  };

  const loadSchedules = () => {
    const mockSchedules = [
      {
        id: 1,
        vehicle_id: 1,
        person_id: 1,
        destination: "São Paulo",
        purpose: "Reunião de negócios",
        scheduled_departure: "2024-01-16T09:00:00",
        scheduled_return: "2024-01-16T17:00:00",
        status: "approved",
        priority: "high",
        notes: "Reunião importante",
        created_date: "2024-01-15T00:00:00"
      },
      {
        id: 2,
        vehicle_id: 2,
        person_id: 2,
        destination: "Rio de Janeiro",
        purpose: "Visita técnica",
        scheduled_departure: "2024-01-17T08:00:00",
        scheduled_return: "2024-01-17T18:00:00",
        status: "pending",
        priority: "medium",
        notes: "",
        created_date: "2024-01-16T00:00:00"
      },
      {
        id: 3,
        vehicle_id: 3,
        person_id: 3,
        destination: "Brasília",
        purpose: "Apresentação",
        scheduled_departure: "2024-01-18T10:00:00",
        scheduled_return: "2024-01-18T16:00:00",
        status: "rejected",
        priority: "low",
        notes: "Cancelado por falta de veículo",
        created_date: "2024-01-17T00:00:00"
      }
    ];
    setSchedules(mockSchedules);
  };

  const loadVehicles = () => {
    const mockVehicles = [
      { id: 1, brand: "Toyota", model: "Corolla", license_plate: "ABC-1234", status: "available" },
      { id: 2, brand: "Honda", model: "Civic", license_plate: "DEF-5678", status: "available" },
      { id: 3, brand: "Ford", model: "Focus", license_plate: "GHI-9012", status: "in_use" }
    ];
    setVehicles(mockVehicles);
  };

  const loadPeople = () => {
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
      if (selectedSchedule) {
        setSchedules(prev => prev.map(s => s.id === selectedSchedule.id ? { ...formData, id: selectedSchedule.id } : s));
      } else {
        const newSchedule = {
          ...formData,
          id: Date.now(),
          created_date: new Date().toISOString()
        };
        setSchedules(prev => [newSchedule, ...prev]);
      }
      
      setIsDialogOpen(false);
      resetForm();
      setIsLoading(false);
    }, 1000);
  };

  const handleEdit = (schedule) => {
    setSelectedSchedule(schedule);
    setFormData(schedule);
    setIsDialogOpen(true);
  };

  const handleApprove = (scheduleId) => {
    setSchedules(prev => prev.map(s => s.id === scheduleId ? { ...s, status: "approved" } : s));
  };

  const handleReject = (scheduleId) => {
    setSchedules(prev => prev.map(s => s.id === scheduleId ? { ...s, status: "rejected" } : s));
  };

  const resetForm = () => {
    setFormData({
      vehicle_id: "",
      person_id: "",
      scheduled_departure: "",
      scheduled_return: "",
      destination: "",
      purpose: "",
      status: "pending",
      priority: "medium",
      notes: "",
    });
    setSelectedSchedule(null);
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
            <h1 className="text-3xl font-bold text-gray-900">Agendamentos</h1>
            <p className="text-gray-600 mt-1">Gerencie os agendamentos de veículos</p>
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button 
                className="ds-primary text-white shadow-lg hover:shadow-xl transition-all duration-300"
                onClick={resetForm}
              >
                <Plus className="w-4 h-4 mr-2" />
                Novo Agendamento
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {selectedSchedule ? "Editar Agendamento" : "Novo Agendamento"}
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
                        {vehicles.filter(v => v.status === "available").map((vehicle) => (
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
                    <Label htmlFor="scheduled_departure">Data/Hora de Saída *</Label>
                    <Input
                      id="scheduled_departure"
                      type="datetime-local"
                      value={formData.scheduled_departure}
                      onChange={(e) => setFormData({...formData, scheduled_departure: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="scheduled_return">Data/Hora de Retorno *</Label>
                    <Input
                      id="scheduled_return"
                      type="datetime-local"
                      value={formData.scheduled_return}
                      onChange={(e) => setFormData({...formData, scheduled_return: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="priority">Prioridade</Label>
                    <Select
                      value={formData.priority}
                      onValueChange={(value) => setFormData({...formData, priority: value})}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(priorityLabels).map(([value, label]) => (
                          <SelectItem key={value} value={value}>
                            {label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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
                    {isLoading ? "Salvando..." : selectedSchedule ? "Atualizar" : "Criar"}
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
            placeholder="Buscar agendamentos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Schedules Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredSchedules.map((schedule) => {
            const vehicle = getVehicleInfo(schedule.vehicle_id);
            const person = getPersonInfo(schedule.person_id);
            
            return (
              <Card key={schedule.id} className="glass-card border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg font-bold text-gray-900">
                        {schedule.destination}
                      </CardTitle>
                      <p className="text-sm text-gray-500">{schedule.purpose}</p>
                    </div>
                    <div className="flex gap-2">
                      <Badge className={priorityColors[schedule.priority]}>
                        {priorityLabels[schedule.priority]}
                      </Badge>
                      <Badge className={statusColors[schedule.status]}>
                        {statusLabels[schedule.status]}
                      </Badge>
                    </div>
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
                      {format(new Date(schedule.scheduled_departure), "dd/MM/yyyy HH:mm", { locale: ptBR })}
                    </span>
                    <ArrowRight className="w-4 h-4 text-gray-400" />
                    <span className="text-sm">
                      {format(new Date(schedule.scheduled_return), "dd/MM/yyyy HH:mm", { locale: ptBR })}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span className="text-sm">{schedule.destination}</span>
                  </div>
                  
                  {schedule.notes && (
                    <div className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                      {schedule.notes}
                    </div>
                  )}
                  
                  <div className="flex justify-between items-center pt-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(schedule)}
                      className="ds-hover"
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Editar
                    </Button>
                    
                    {schedule.status === "pending" && (currentUser?.role === "ADMIN" || currentUser?.role === "MASTER") && (
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleApprove(schedule.id)}
                          className="bg-green-50 text-green-700 hover:bg-green-100"
                        >
                          <Check className="w-4 h-4 mr-2" />
                          Aprovar
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleReject(schedule.id)}
                          className="bg-red-50 text-red-700 hover:bg-red-100"
                        >
                          <X className="w-4 h-4 mr-2" />
                          Rejeitar
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {filteredSchedules.length === 0 && (
          <div className="text-center py-12">
            <CalendarIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">Nenhum agendamento encontrado</p>
            <p className="text-gray-400 text-sm mt-2">
              {searchTerm ? "Tente uma busca diferente" : "Comece criando um novo agendamento"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}