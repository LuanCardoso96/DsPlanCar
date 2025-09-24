import { useState, useEffect } from "react";
import { listAgendamentos, createAgendamento, updateAgendamento, aprovarAgendamento, rejeitarAgendamento, cancelarAgendamento, deleteAgendamento, getVehicles, getPeople } from "@/services/FirestoreService";
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
  Calendar,
  Plus,
  Search,
  Edit,
  CheckCircle,
  XCircle,
  Trash2,
  Clock,
  User,
  Car
} from "lucide-react";

const statusOptions = [
  { value: "pendente", label: "Pendente" },
  { value: "aprovado", label: "Aprovado" },
  { value: "rejeitado", label: "Rejeitado" },
  { value: "cancelado", label: "Cancelado" },
];

export default function Agendamentos() {
  const [agendamentos, setAgendamentos] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [people, setPeople] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedAgendamento, setSelectedAgendamento] = useState(null);
  const [agendamentoToDelete, setAgendamentoToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    vehicleId: "",
    requesterId: "",
    driverId: "",
    startAt: "",
    endAt: "",
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [agendamentosData, vehiclesData, peopleData] = await Promise.all([
        listAgendamentos(),
        getVehicles(),
        getPeople(),
      ]);
      setAgendamentos(agendamentosData);
      setVehicles(vehiclesData);
      setPeople(peopleData);
    } catch (error) {
      console.error("Error loading data:", error);
      alert("Erro ao carregar dados. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      if (selectedAgendamento) {
        await updateAgendamento(selectedAgendamento.id, formData);
      } else {
        await createAgendamento(formData);
      }
      
      loadData();
      setIsDialogOpen(false);
      resetForm();
    } catch (error) {
      console.error("Error saving agendamento:", error);
      alert("Erro ao salvar agendamento. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      await aprovarAgendamento(id);
      loadData();
    } catch (error) {
      console.error("Error approving agendamento:", error);
      alert("Erro ao aprovar agendamento. Tente novamente.");
    }
  };

  const handleReject = async (id) => {
    try {
      await rejeitarAgendamento(id);
      loadData();
    } catch (error) {
      console.error("Error rejecting agendamento:", error);
      alert("Erro ao rejeitar agendamento. Tente novamente.");
    }
  };

  const handleCancel = async (id) => {
    try {
      await cancelarAgendamento(id);
      loadData();
    } catch (error) {
      console.error("Error canceling agendamento:", error);
      alert("Erro ao cancelar agendamento. Tente novamente.");
    }
  };

  const handleEdit = (agendamento) => {
    setSelectedAgendamento(agendamento);
    setFormData({
      title: agendamento.title || "",
      description: agendamento.description || "",
      vehicleId: agendamento.vehicleId || "",
      requesterId: agendamento.requesterId || "",
      driverId: agendamento.driverId || "",
      startAt: agendamento.startAt ? new Date(agendamento.startAt.seconds * 1000).toISOString().slice(0, 16) : "",
      endAt: agendamento.endAt ? new Date(agendamento.endAt.seconds * 1000).toISOString().slice(0, 16) : "",
    });
    setIsDialogOpen(true);
  };

  const handleDeleteClick = (agendamento) => {
    setAgendamentoToDelete(agendamento);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!agendamentoToDelete) return;
    
    try {
      await deleteAgendamento(agendamentoToDelete.id);
      loadData();
      setIsDeleteDialogOpen(false);
      setAgendamentoToDelete(null);
    } catch (error) {
      console.error("Error deleting agendamento:", error);
      alert("Erro ao excluir agendamento. Tente novamente.");
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      vehicleId: "",
      requesterId: "",
      driverId: "",
      startAt: "",
      endAt: "",
    });
    setSelectedAgendamento(null);
  };

  const filteredAgendamentos = agendamentos.filter(agendamento => {
    const matchesSearch = agendamento.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         agendamento.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || statusFilter === "all" || agendamento.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getVehicleName = (vehicleId) => {
    const vehicle = vehicles.find(v => v.id === vehicleId);
    return vehicle ? `${vehicle.brand} ${vehicle.model}` : 'Veículo não encontrado';
  };

  const getPersonName = (personId) => {
    const person = people.find(p => p.id === personId);
    return person ? person.name : 'Pessoa não encontrada';
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pendente: { variant: "secondary", className: "bg-yellow-100 text-yellow-800", label: "Pendente" },
      aprovado: { variant: "default", className: "bg-green-100 text-green-800", label: "Aprovado" },
      rejeitado: { variant: "destructive", className: "bg-red-100 text-red-800", label: "Rejeitado" },
      cancelado: { variant: "outline", className: "bg-gray-100 text-gray-800", label: "Cancelado" },
    };
    
    const config = statusConfig[status] || statusConfig.pendente;
    return (
      <Badge variant={config.variant} className={config.className}>
        {config.label}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Agendamentos</h1>
          <p className="text-gray-600 mt-1">Gerencie os agendamentos de veículos</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="ds-primary text-white shadow-lg hover:shadow-xl transition-all duration-300">
              <Plus className="w-4 h-4 mr-2" />
              Novo Agendamento
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {selectedAgendamento ? "Editar Agendamento" : "Novo Agendamento"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="title">Título *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  placeholder="Ex: Viagem para São Paulo"
                  required
                />
              </div>

              <div>
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Detalhes sobre o agendamento..."
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="vehicleId">Veículo *</Label>
                  <Select value={formData.vehicleId} onValueChange={(value) => setFormData({...formData, vehicleId: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o veículo" />
                    </SelectTrigger>
                    <SelectContent>
                      {vehicles.filter(v => v.id).map((vehicle) => (
                        <SelectItem key={vehicle.id} value={vehicle.id}>
                          {vehicle.brand} {vehicle.model} - {vehicle.license_plate}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="requesterId">Solicitante *</Label>
                  <Select value={formData.requesterId} onValueChange={(value) => setFormData({...formData, requesterId: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o solicitante" />
                    </SelectTrigger>
                    <SelectContent>
                      {people.filter(p => p.id).map((person) => (
                        <SelectItem key={person.id} value={person.id}>
                          {person.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="driverId">Motorista (Opcional)</Label>
                <Select value={formData.driverId || "none"} onValueChange={(value) => setFormData({...formData, driverId: value === "none" ? null : value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o motorista" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Sem motorista específico</SelectItem>
                    {people.filter(p => p.id).map((person) => (
                      <SelectItem key={person.id} value={person.id}>
                        {person.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="startAt">Data/Hora de Início *</Label>
                  <Input
                    id="startAt"
                    type="datetime-local"
                    value={formData.startAt}
                    onChange={(e) => setFormData({...formData, startAt: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="endAt">Data/Hora de Fim *</Label>
                  <Input
                    id="endAt"
                    type="datetime-local"
                    value={formData.endAt}
                    onChange={(e) => setFormData({...formData, endAt: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={isLoading} className="ds-primary text-white">
                  {isLoading ? "Salvando..." : selectedAgendamento ? "Atualizar" : "Criar"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Buscar por título ou descrição..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filtrar por status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os status</SelectItem>
                {statusOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Agendamentos List */}
      <div className="grid gap-4">
        {isLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
            <p className="text-gray-500 mt-2">Carregando agendamentos...</p>
          </div>
        ) : filteredAgendamentos.length > 0 ? (
          filteredAgendamentos.map((agendamento) => (
            <Card key={agendamento.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-500 rounded-full flex items-center justify-center">
                      <Calendar className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {agendamento.title}
                      </h3>
                      <p className="text-sm text-gray-600">
                        Veículo: {getVehicleName(agendamento.vehicleId)}
                      </p>
                      <p className="text-sm text-gray-600">
                        Solicitante: {getPersonName(agendamento.requesterId)}
                      </p>
                      {agendamento.driverId && (
                        <p className="text-sm text-gray-600">
                          Motorista: {getPersonName(agendamento.driverId)}
                        </p>
                      )}
                      {agendamento.description && (
                        <p className="text-sm text-gray-500 mt-1">
                          {agendamento.description}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      {getStatusBadge(agendamento.status)}
                      <p className="text-sm text-gray-500 mt-1">
                        Início: {agendamento.startAt ? new Date(agendamento.startAt.seconds * 1000).toLocaleString('pt-BR') : 'N/A'}
                      </p>
                      <p className="text-sm text-gray-500">
                        Fim: {agendamento.endAt ? new Date(agendamento.endAt.seconds * 1000).toLocaleString('pt-BR') : 'N/A'}
                      </p>
                    </div>
                    
                    <div className="flex gap-2">
                      {agendamento.status === "pendente" && (
                        <>
                          <Button
                            size="sm"
                            onClick={() => handleApprove(agendamento.id)}
                            className="bg-green-600 hover:bg-green-700 text-white"
                          >
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Aprovar
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleReject(agendamento.id)}
                            className="text-red-600 border-red-600 hover:bg-red-50"
                          >
                            <XCircle className="w-4 h-4 mr-1" />
                            Rejeitar
                          </Button>
                        </>
                      )}
                      {agendamento.status === "aprovado" && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleCancel(agendamento.id)}
                          className="text-orange-600 border-orange-600 hover:bg-orange-50"
                        >
                          <XCircle className="w-4 h-4 mr-1" />
                          Cancelar
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(agendamento)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDeleteClick(agendamento)}
                        className="text-red-600 border-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="text-center py-12">
              <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum agendamento encontrado</h3>
              <p className="text-gray-500 mb-4">
                {searchTerm || statusFilter 
                  ? "Tente ajustar os filtros de busca." 
                  : "Comece criando um novo agendamento."}
              </p>
              {!searchTerm && !statusFilter && (
                <Button onClick={() => setIsDialogOpen(true)} className="ds-primary text-white">
                  <Plus className="w-4 h-4 mr-2" />
                  Novo Agendamento
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      {/* Delete Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir Agendamento</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este agendamento? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
