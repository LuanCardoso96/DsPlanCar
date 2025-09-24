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
  Car,
  Edit,
  Archive,
  Trash2,
  AlertTriangle,
  Calendar,
  Fuel,
  MapPin,
  CheckCircle,
  XCircle,
  Clock,
} from "lucide-react";
import { format } from "date-fns";

const vehicleTypes = [
  { value: "sedan", label: "Sedan" },
  { value: "suv", label: "SUV" },
  { value: "pickup", label: "Pick-up" },
  { value: "van", label: "Van" },
  { value: "motorcycle", label: "Motocicleta" },
  { value: "truck", label: "Caminhão" },
];

const fuelTypes = [
  { value: "gasoline", label: "Gasolina" },
  { value: "ethanol", label: "Etanol" },
  { value: "diesel", label: "Diesel" },
  { value: "electric", label: "Elétrico" },
  { value: "hybrid", label: "Híbrido" },
];

const statusColors = {
  available: "bg-green-100 text-green-800",
  in_use: "bg-blue-100 text-blue-800",
  maintenance: "bg-orange-100 text-orange-800",
  archived: "bg-gray-100 text-gray-800",
};

const statusLabels = {
  available: "Disponível",
  in_use: "Em Uso",
  maintenance: "Manutenção",
  archived: "Arquivado",
};

export default function Vehicles() {
  const [vehicles, setVehicles] = useState([]);
  const [filteredVehicles, setFilteredVehicles] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [vehicleToDelete, setVehicleToDelete] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    brand: "",
    model: "",
    year: new Date().getFullYear(),
    license_plate: "",
    color: "",
    vehicle_type: "sedan",
    fuel_type: "gasoline",
    status: "available",
    mileage: 0,
    insurance_expiry: "",
    license_expiry: "",
    notes: "",
  });

  const filterVehicles = useCallback(() => {
    if (!searchTerm) {
      setFilteredVehicles(vehicles);
      return;
    }

    const filtered = vehicles.filter(
      (vehicle) =>
        vehicle.brand?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vehicle.model?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vehicle.license_plate?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vehicle.color?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredVehicles(filtered);
  }, [vehicles, searchTerm]);

  useEffect(() => {
    loadVehicles();
    loadCurrentUser();
  }, []);

  useEffect(() => {
    filterVehicles();
  }, [filterVehicles]);

  const loadCurrentUser = () => {
    // Mock user data
    setCurrentUser({
      full_name: "João Silva",
      email: "joao.silva@empresa.com",
      role: "ADMIN"
    });
  };

  const loadVehicles = () => {
    // Mock vehicles data
    const mockVehicles = [
      {
        id: 1,
        brand: "Toyota",
        model: "Corolla",
        year: 2022,
        license_plate: "ABC-1234",
        color: "Prata",
        vehicle_type: "sedan",
        fuel_type: "gasoline",
        status: "available",
        mileage: 15000,
        insurance_expiry: "2024-12-31",
        license_expiry: "2024-06-15",
        notes: "Veículo em excelente estado",
        created_date: "2024-01-01T00:00:00"
      },
      {
        id: 2,
        brand: "Honda",
        model: "Civic",
        year: 2021,
        license_plate: "DEF-5678",
        color: "Branco",
        vehicle_type: "sedan",
        fuel_type: "gasoline",
        status: "in_use",
        mileage: 25000,
        insurance_expiry: "2024-03-20",
        license_expiry: "2024-08-10",
        notes: "",
        created_date: "2024-01-02T00:00:00"
      },
      {
        id: 3,
        brand: "Ford",
        model: "Ranger",
        year: 2023,
        license_plate: "GHI-9012",
        color: "Azul",
        vehicle_type: "pickup",
        fuel_type: "diesel",
        status: "maintenance",
        mileage: 8000,
        insurance_expiry: "2024-11-15",
        license_expiry: "2024-09-25",
        notes: "Em manutenção preventiva",
        created_date: "2024-01-03T00:00:00"
      },
      {
        id: 4,
        brand: "Volkswagen",
        model: "Golf",
        year: 2020,
        license_plate: "JKL-3456",
        color: "Preto",
        vehicle_type: "sedan",
        fuel_type: "gasoline",
        status: "available",
        mileage: 35000,
        insurance_expiry: "2024-02-28",
        license_expiry: "2024-04-30",
        notes: "Necessita revisão",
        created_date: "2024-01-04T00:00:00"
      }
    ];
    setVehicles(mockVehicles);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      if (selectedVehicle) {
        // Update existing vehicle
        setVehicles(prev => prev.map(v => v.id === selectedVehicle.id ? { ...formData, id: selectedVehicle.id } : v));
      } else {
        // Create new vehicle
        const newVehicle = {
          ...formData,
          id: Date.now(), // Simple ID generation
          created_date: new Date().toISOString()
        };
        setVehicles(prev => [newVehicle, ...prev]);
      }
      
      setIsDialogOpen(false);
      resetForm();
      setIsLoading(false);
    }, 1000);
  };

  const handleEdit = (vehicle) => {
    setSelectedVehicle(vehicle);
    setFormData(vehicle);
    setIsDialogOpen(true);
  };

  const handleArchive = (vehicleId) => {
    setVehicles(prev => prev.map(v => 
      v.id === vehicleId 
        ? { ...v, status: v.status === 'archived' ? 'available' : 'archived' }
        : v
    ));
  };

  const handleDeleteClick = (vehicle) => {
    setVehicleToDelete(vehicle);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (!vehicleToDelete) return;
    
    setVehicles(prev => prev.filter(v => v.id !== vehicleToDelete.id));
    setIsDeleteDialogOpen(false);
    setVehicleToDelete(null);
  };

  const resetForm = () => {
    setFormData({
      brand: "",
      model: "",
      year: new Date().getFullYear(),
      license_plate: "",
      color: "",
      vehicle_type: "sedan",
      fuel_type: "gasoline",
      status: "available",
      mileage: 0,
      insurance_expiry: "",
      license_expiry: "",
      notes: "",
    });
    setSelectedVehicle(null);
  };

  const isExpiringSoon = (date) => {
    if (!date) return false;
    const daysUntilExpiry = Math.ceil((new Date(date) - new Date()) / (1000 * 60 * 60 * 24));
    return daysUntilExpiry <= 30 && daysUntilExpiry > 0;
  };

  return (
    <div className="p-4 md:p-8 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gestão de Veículos</h1>
            <p className="text-gray-600 mt-1">Gerencie a frota de veículos da empresa</p>
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button 
                className="ds-primary text-white shadow-lg hover:shadow-xl transition-all duration-300"
                onClick={resetForm}
              >
                <Plus className="w-4 h-4 mr-2" />
                Novo Veículo
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {selectedVehicle ? "Editar Veículo" : "Novo Veículo"}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="brand">Marca *</Label>
                    <Input
                      id="brand"
                      value={formData.brand}
                      onChange={(e) => setFormData({...formData, brand: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="model">Modelo *</Label>
                    <Input
                      id="model"
                      value={formData.model}
                      onChange={(e) => setFormData({...formData, model: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="year">Ano</Label>
                    <Input
                      id="year"
                      type="number"
                      value={formData.year}
                      onChange={(e) => setFormData({...formData, year: parseInt(e.target.value)})}
                      min="1950"
                      max={new Date().getFullYear() + 1}
                    />
                  </div>
                  <div>
                    <Label htmlFor="license_plate">Placa *</Label>
                    <Input
                      id="license_plate"
                      value={formData.license_plate}
                      onChange={(e) => setFormData({...formData, license_plate: e.target.value.toUpperCase()})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="color">Cor</Label>
                    <Input
                      id="color"
                      value={formData.color}
                      onChange={(e) => setFormData({...formData, color: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="vehicle_type">Tipo</Label>
                    <Select
                      value={formData.vehicle_type}
                      onValueChange={(value) => setFormData({...formData, vehicle_type: value})}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {vehicleTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="fuel_type">Combustível</Label>
                    <Select
                      value={formData.fuel_type}
                      onValueChange={(value) => setFormData({...formData, fuel_type: value})}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {fuelTypes.map((fuel) => (
                          <SelectItem key={fuel.value} value={fuel.value}>
                            {fuel.label}
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
                  <div>
                    <Label htmlFor="mileage">Quilometragem</Label>
                    <Input
                      id="mileage"
                      type="number"
                      value={formData.mileage}
                      onChange={(e) => setFormData({...formData, mileage: parseFloat(e.target.value)})}
                      min="0"
                    />
                  </div>
                  <div>
                    <Label htmlFor="insurance_expiry">Vencimento do Seguro</Label>
                    <Input
                      id="insurance_expiry"
                      type="date"
                      value={formData.insurance_expiry}
                      onChange={(e) => setFormData({...formData, insurance_expiry: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="license_expiry">Vencimento do Licenciamento</Label>
                    <Input
                      id="license_expiry"
                      type="date"
                      value={formData.license_expiry}
                      onChange={(e) => setFormData({...formData, license_expiry: e.target.value})}
                    />
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
                    {isLoading ? "Salvando..." : selectedVehicle ? "Atualizar" : "Criar"}
                  </Button>
                  {selectedVehicle && (currentUser?.role === "MASTER" || currentUser?.role === "ADMIN") && (
                    <Button
                      type="button"
                      variant="destructive"
                      onClick={() => {
                        setIsDialogOpen(false);
                        handleDeleteClick(selectedVehicle);
                      }}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Excluir
                    </Button>
                  )}
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Buscar veículos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Vehicles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVehicles.map((vehicle) => (
            <Card key={vehicle.id} className="glass-card border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg font-bold text-gray-900">
                      {vehicle.brand} {vehicle.model}
                    </CardTitle>
                    <p className="text-sm text-gray-500">{vehicle.year}</p>
                  </div>
                  <Badge className={statusColors[vehicle.status]}>
                    {statusLabels[vehicle.status]}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <span className="text-sm font-mono">{vehicle.license_plate}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <Car className="w-4 h-4 text-gray-400" />
                  <span className="text-sm">{vehicleTypes.find(t => t.value === vehicle.vehicle_type)?.label}</span>
                </div>
                
                {vehicle.color && (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full border border-gray-300" style={{ backgroundColor: vehicle.color.toLowerCase() }} />
                    <span className="text-sm">{vehicle.color}</span>
                  </div>
                )}
                
                {vehicle.mileage > 0 && (
                  <div className="flex items-center gap-2">
                    <Fuel className="w-4 h-4 text-gray-400" />
                    <span className="text-sm">{vehicle.mileage?.toLocaleString()} km</span>
                  </div>
                )}
                
                {/* Expiration Warnings */}
                <div className="space-y-1">
                  {vehicle.insurance_expiry && isExpiringSoon(vehicle.insurance_expiry) && (
                    <div className="flex items-center gap-2 text-orange-600">
                      <AlertTriangle className="w-4 h-4" />
                      <span className="text-xs">Seguro vence em {Math.ceil((new Date(vehicle.insurance_expiry) - new Date()) / (1000 * 60 * 60 * 24))} dias</span>
                    </div>
                  )}
                  
                  {vehicle.license_expiry && isExpiringSoon(vehicle.license_expiry) && (
                    <div className="flex items-center gap-2 text-orange-600">
                      <AlertTriangle className="w-4 h-4" />
                      <span className="text-xs">Licenciamento vence em {Math.ceil((new Date(vehicle.license_expiry) - new Date()) / (1000 * 60 * 60 * 24))} dias</span>
                    </div>
                  )}
                </div>
                
                <div className="flex justify-between items-center pt-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(vehicle)}
                    className="ds-hover"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Editar
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleArchive(vehicle.id)}
                    className={vehicle.status === 'archived' ? 'bg-green-50 text-green-700 hover:bg-green-100' : ''}
                  >
                    {vehicle.status === 'archived' ? (
                      <>
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Restaurar
                      </>
                    ) : (
                      <>
                        <Archive className="w-4 h-4 mr-2" />
                        Arquivar
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredVehicles.length === 0 && (
          <div className="text-center py-12">
            <Car className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">Nenhum veículo encontrado</p>
            <p className="text-gray-400 text-sm mt-2">
              {searchTerm ? "Tente uma busca diferente" : "Comece adicionando um novo veículo"}
            </p>
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir permanentemente o veículo{" "}
              <strong>{vehicleToDelete?.brand} {vehicleToDelete?.model}</strong>?
              Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Excluir Definitivamente
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}