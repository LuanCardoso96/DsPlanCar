import { useState, useEffect } from "react";
import { listSaidas, createSaida, updateSaida, closeSaida, cancelSaida, deleteSaida, getVehicles, getPeople } from "@/services/FirestoreService";
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
  Car,
  Plus,
  Search,
  Edit,
  CheckCircle,
  XCircle,
  Trash2,
  Filter,
  Clock,
  MapPin
} from "lucide-react";

const statusOptions = [
  { value: "em_andamento", label: "Em Andamento" },
  { value: "concluida", label: "Concluída" },
  { value: "cancelada", label: "Cancelada" },
];

export default function Saidas() {
  const [saidas, setSaidas] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [people, setPeople] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isCloseDialogOpen, setIsCloseDialogOpen] = useState(false);
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedSaida, setSelectedSaida] = useState(null);
  const [saidaToDelete, setSaidaToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const [formData, setFormData] = useState({
    vehicleId: "",
    driverId: "",
    purpose: "",
    odometerStart: "",
    startedAt: "",
    notes: "",
  });

  const [closeFormData, setCloseFormData] = useState({
    odometerEnd: "",
    endedAt: "",
    notes: "",
  });

  const [cancelFormData, setCancelFormData] = useState({
    notes: "",
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [saidasData, vehiclesData, peopleData] = await Promise.all([
        listSaidas(),
        getVehicles(),
        getPeople(),
      ]);
      setSaidas(saidasData);
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
      if (selectedSaida) {
        await updateSaida(selectedSaida.id, formData);
      } else {
        await createSaida(formData);
      }
      
      loadData();
      setIsDialogOpen(false);
      resetForm();
    } catch (error) {
      console.error("Error saving saida:", error);
      alert("Erro ao salvar saída. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await closeSaida(selectedSaida.id, closeFormData);
      loadData();
      setIsCloseDialogOpen(false);
      resetCloseForm();
    } catch (error) {
      console.error("Error closing saida:", error);
      alert("Erro ao concluir saída. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await cancelSaida(selectedSaida.id, cancelFormData.notes);
      loadData();
      setIsCancelDialogOpen(false);
      resetCancelForm();
    } catch (error) {
      console.error("Error canceling saida:", error);
      alert("Erro ao cancelar saída. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (saida) => {
    setSelectedSaida(saida);
    setFormData({
      vehicleId: saida.vehicleId || "",
      driverId: saida.driverId || "",
      purpose: saida.purpose || "",
      odometerStart: saida.odometerStart || "",
      startedAt: saida.startedAt ? new Date(saida.startedAt.seconds * 1000).toISOString().slice(0, 16) : "",
      notes: saida.notes || "",
    });
    setIsDialogOpen(true);
  };

  const handleCloseClick = (saida) => {
    setSelectedSaida(saida);
    setIsCloseDialogOpen(true);
  };

  const handleCancelClick = (saida) => {
    setSelectedSaida(saida);
    setIsCancelDialogOpen(true);
  };

  const handleDeleteClick = (saida) => {
    setSaidaToDelete(saida);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!saidaToDelete) return;
    
    try {
      await deleteSaida(saidaToDelete.id);
      loadData();
      setIsDeleteDialogOpen(false);
      setSaidaToDelete(null);
    } catch (error) {
      console.error("Error deleting saida:", error);
      alert("Erro ao excluir saída. Tente novamente.");
    }
  };

  const resetForm = () => {
    setFormData({
      vehicleId: "",
      driverId: "",
      purpose: "",
      odometerStart: "",
      startedAt: "",
      notes: "",
    });
    setSelectedSaida(null);
  };

  const resetCloseForm = () => {
    setCloseFormData({
      odometerEnd: "",
      endedAt: "",
      notes: "",
    });
    setSelectedSaida(null);
  };

  const resetCancelForm = () => {
    setCancelFormData({
      notes: "",
    });
    setSelectedSaida(null);
  };

  const filteredSaidas = saidas.filter(saida => {
    const matchesSearch = saida.purpose?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         saida.notes?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || statusFilter === "all" || saida.status === statusFilter;
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
      em_andamento: { variant: "secondary", className: "bg-orange-100 text-orange-800", label: "Em Andamento" },
      concluida: { variant: "default", className: "bg-green-100 text-green-800", label: "Concluída" },
      cancelada: { variant: "destructive", className: "bg-red-100 text-red-800", label: "Cancelada" },
    };
    
    const config = statusConfig[status] || statusConfig.em_andamento;
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
          <h1 className="text-3xl font-bold text-gray-900">Saídas de Veículos</h1>
          <p className="text-gray-600 mt-1">Gerencie as saídas e retornos dos veículos</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="ds-primary text-white shadow-lg hover:shadow-xl transition-all duration-300">
              <Plus className="w-4 h-4 mr-2" />
              Nova Saída
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {selectedSaida ? "Editar Saída" : "Nova Saída"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
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
                  <Label htmlFor="driverId">Motorista *</Label>
                  <Select value={formData.driverId} onValueChange={(value) => setFormData({...formData, driverId: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o motorista" />
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
                <Label htmlFor="purpose">Finalidade *</Label>
                <Input
                  id="purpose"
                  value={formData.purpose}
                  onChange={(e) => setFormData({...formData, purpose: e.target.value})}
                  placeholder="Ex: Entrega de documentos"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="odometerStart">Quilometragem Inicial</Label>
                  <Input
                    id="odometerStart"
                    type="number"
                    value={formData.odometerStart}
                    onChange={(e) => setFormData({...formData, odometerStart: e.target.value})}
                    placeholder="Ex: 15000"
                  />
                </div>
                <div>
                  <Label htmlFor="startedAt">Data/Hora de Saída *</Label>
                  <Input
                    id="startedAt"
                    type="datetime-local"
                    value={formData.startedAt}
                    onChange={(e) => setFormData({...formData, startedAt: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="notes">Observações</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  placeholder="Observações adicionais..."
                  rows={3}
                />
              </div>

              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={isLoading} className="ds-primary text-white">
                  {isLoading ? "Salvando..." : selectedSaida ? "Atualizar" : "Criar"}
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
                  placeholder="Buscar por finalidade ou observações..."
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

      {/* Saidas List */}
      <div className="grid gap-4">
        {isLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
            <p className="text-gray-500 mt-2">Carregando saídas...</p>
          </div>
        ) : filteredSaidas.length > 0 ? (
          filteredSaidas.map((saida) => (
            <Card key={saida.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-500 rounded-full flex items-center justify-center">
                      <Car className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {getVehicleName(saida.vehicleId)}
                      </h3>
                      <p className="text-sm text-gray-600">
                        Motorista: {getPersonName(saida.driverId)}
                      </p>
                      <p className="text-sm text-gray-500">
                        {saida.purpose}
                      </p>
                      {saida.notes && (
                        <p className="text-xs text-gray-400 mt-1">
                          Obs: {saida.notes}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      {getStatusBadge(saida.status)}
                      <p className="text-sm text-gray-500 mt-1">
                        Início: {saida.startedAt ? new Date(saida.startedAt.seconds * 1000).toLocaleString('pt-BR') : 'N/A'}
                      </p>
                      {saida.endedAt && (
                        <p className="text-sm text-gray-500">
                          Fim: {new Date(saida.endedAt.seconds * 1000).toLocaleString('pt-BR')}
                        </p>
                      )}
                      {saida.odometerStart && (
                        <p className="text-sm text-gray-500">
                          KM Inicial: {saida.odometerStart}
                        </p>
                      )}
                      {saida.odometerEnd && (
                        <p className="text-sm text-gray-500">
                          KM Final: {saida.odometerEnd}
                        </p>
                      )}
                    </div>
                    
                    <div className="flex gap-2">
                      {saida.status === "em_andamento" && (
                        <>
                          <Button
                            size="sm"
                            onClick={() => handleCloseClick(saida)}
                            className="bg-green-600 hover:bg-green-700 text-white"
                          >
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Concluir
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleCancelClick(saida)}
                            className="text-red-600 border-red-600 hover:bg-red-50"
                          >
                            <XCircle className="w-4 h-4 mr-1" />
                            Cancelar
                          </Button>
                        </>
                      )}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(saida)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDeleteClick(saida)}
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
              <Car className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma saída encontrada</h3>
              <p className="text-gray-500 mb-4">
                {searchTerm || statusFilter 
                  ? "Tente ajustar os filtros de busca." 
                  : "Comece criando uma nova saída de veículo."}
              </p>
              {!searchTerm && !statusFilter && (
                <Button onClick={() => setIsDialogOpen(true)} className="ds-primary text-white">
                  <Plus className="w-4 h-4 mr-2" />
                  Nova Saída
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      {/* Close Dialog */}
      <Dialog open={isCloseDialogOpen} onOpenChange={setIsCloseDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Concluir Saída</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleClose} className="space-y-4">
            <div>
              <Label htmlFor="odometerEnd">Quilometragem Final</Label>
              <Input
                id="odometerEnd"
                type="number"
                value={closeFormData.odometerEnd}
                onChange={(e) => setCloseFormData({...closeFormData, odometerEnd: e.target.value})}
                placeholder="Ex: 15150"
              />
            </div>
            <div>
              <Label htmlFor="endedAt">Data/Hora de Retorno</Label>
              <Input
                id="endedAt"
                type="datetime-local"
                value={closeFormData.endedAt}
                onChange={(e) => setCloseFormData({...closeFormData, endedAt: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="notes">Observações</Label>
              <Textarea
                id="notes"
                value={closeFormData.notes}
                onChange={(e) => setCloseFormData({...closeFormData, notes: e.target.value})}
                placeholder="Observações sobre a conclusão..."
                rows={3}
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={() => setIsCloseDialogOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isLoading} className="bg-green-600 hover:bg-green-700 text-white">
                {isLoading ? "Concluindo..." : "Concluir"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Cancel Dialog */}
      <Dialog open={isCancelDialogOpen} onOpenChange={setIsCancelDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancelar Saída</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCancel} className="space-y-4">
            <div>
              <Label htmlFor="notes">Motivo do Cancelamento</Label>
              <Textarea
                id="notes"
                value={cancelFormData.notes}
                onChange={(e) => setCancelFormData({...cancelFormData, notes: e.target.value})}
                placeholder="Descreva o motivo do cancelamento..."
                rows={3}
                required
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={() => setIsCancelDialogOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isLoading} className="bg-red-600 hover:bg-red-700 text-white">
                {isLoading ? "Cancelando..." : "Confirmar Cancelamento"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir Saída</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir esta saída? Esta ação não pode ser desfeita.
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
