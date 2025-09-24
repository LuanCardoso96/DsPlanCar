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
  Users,
  Edit,
  Archive,
  Trash2,
  AlertTriangle,
  Mail,
  Phone,
  Building,
  CreditCard,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { format } from "date-fns";

const licenseCategories = [
  { value: "A", label: "A - Motocicletas" },
  { value: "B", label: "B - Carros" },
  { value: "C", label: "C - Caminhões" },
  { value: "D", label: "D - Ônibus" },
  { value: "E", label: "E - Carretas" },
  { value: "AB", label: "AB - Carros e Motos" },
  { value: "AC", label: "AC - Carros e Caminhões" },
  { value: "AD", label: "AD - Carros e Ônibus" },
  { value: "AE", label: "AE - Carros e Carretas" },
];

const statusColors = {
  active: "bg-green-100 text-green-800",
  inactive: "bg-orange-100 text-orange-800",
  archived: "bg-gray-100 text-gray-800",
};

const statusLabels = {
  active: "Ativo",
  inactive: "Inativo",
  archived: "Arquivado",
};

export default function People() {
  const [people, setPeople] = useState([]);
  const [filteredPeople, setFilteredPeople] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [personToDelete, setPersonToDelete] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    department: "",
    position: "",
    driver_license: "",
    license_category: "",
    license_expiry: "",
    status: "active",
    notes: "",
  });

  const filterPeople = useCallback(() => {
    if (!searchTerm) {
      setFilteredPeople(people);
      return;
    }

    const filtered = people.filter(
      (person) =>
        person.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        person.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        person.department?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        person.position?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredPeople(filtered);
  }, [people, searchTerm]);

  useEffect(() => {
    loadPeople();
    loadCurrentUser();
  }, []);

  useEffect(() => {
    filterPeople();
  }, [filterPeople]);

  const loadCurrentUser = () => {
    // Mock user data
    setCurrentUser({
      full_name: "João Silva",
      email: "joao.silva@empresa.com",
      role: "ADMIN"
    });
  };

  const loadPeople = async () => {
    try {
      const data = await FirestoreService.getPeople();
      setPeople(data);
    } catch (error) {
      console.error("Error loading people:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      if (selectedPerson) {
        await FirestoreService.updatePerson(selectedPerson.id, formData);
      } else {
        await FirestoreService.createPerson(formData);
      }
      
      loadPeople();
      setIsDialogOpen(false);
      resetForm();
    } catch (error) {
      console.error("Error saving person:", error);
      alert("Erro ao salvar funcionário. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (person) => {
    setSelectedPerson(person);
    setFormData(person);
    setIsDialogOpen(true);
  };

  const handleArchive = async (personId) => {
    try {
      const person = people.find(p => p.id === personId);
      await FirestoreService.updatePerson(personId, { 
        ...person, 
        status: person.status === 'archived' ? 'active' : 'archived' 
      });
      loadPeople();
    } catch (error) {
      console.error("Error archiving person:", error);
      alert("Erro ao arquivar funcionário. Tente novamente.");
    }
  };

  const handleDeleteClick = (person) => {
    setPersonToDelete(person);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!personToDelete) return;
    
    try {
      await FirestoreService.deletePerson(personToDelete.id);
      loadPeople();
      setIsDeleteDialogOpen(false);
      setPersonToDelete(null);
    } catch (error) {
      console.error("Error deleting person:", error);
      alert("Erro ao excluir funcionário. Tente novamente.");
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      phone: "",
      department: "",
      position: "",
      driver_license: "",
      license_category: "",
      license_expiry: "",
      status: "active",
      notes: "",
    });
    setSelectedPerson(null);
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
            <h1 className="text-3xl font-bold text-gray-900">Gestão de Funcionários</h1>
            <p className="text-gray-600 mt-1">Gerencie os funcionários habilitados para dirigir</p>
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button 
                className="ds-primary text-white shadow-lg hover:shadow-xl transition-all duration-300"
                onClick={resetForm}
              >
                <Plus className="w-4 h-4 mr-2" />
                Novo Funcionário
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {selectedPerson ? "Editar Funcionário" : "Novo Funcionário"}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Nome Completo *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">E-mail *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Telefone</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      placeholder="(11) 99999-9999"
                    />
                  </div>
                  <div>
                    <Label htmlFor="department">Departamento</Label>
                    <Input
                      id="department"
                      value={formData.department}
                      onChange={(e) => setFormData({...formData, department: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="position">Cargo</Label>
                    <Input
                      id="position"
                      value={formData.position}
                      onChange={(e) => setFormData({...formData, position: e.target.value})}
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
                  <div>
                    <Label htmlFor="driver_license">Número da CNH</Label>
                    <Input
                      id="driver_license"
                      value={formData.driver_license}
                      onChange={(e) => setFormData({...formData, driver_license: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="license_category">Categoria da CNH</Label>
                    <Select
                      value={formData.license_category}
                      onValueChange={(value) => setFormData({...formData, license_category: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecionar categoria" />
                      </SelectTrigger>
                      <SelectContent>
                        {licenseCategories.map((category) => (
                          <SelectItem key={category.value} value={category.value}>
                            {category.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="license_expiry">Vencimento da CNH</Label>
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
                    {isLoading ? "Salvando..." : selectedPerson ? "Atualizar" : "Criar"}
                  </Button>
                  {selectedPerson && (currentUser?.role === "MASTER" || currentUser?.role === "ADMIN") && (
                    <Button
                      type="button"
                      variant="destructive"
                      onClick={() => {
                        setIsDialogOpen(false);
                        handleDeleteClick(selectedPerson);
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
            placeholder="Buscar funcionários..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* People Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPeople.map((person) => (
            <Card key={person.id} className="glass-card border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg font-bold text-gray-900">
                      {person.name}
                    </CardTitle>
                    <p className="text-sm text-gray-500">{person.position}</p>
                  </div>
                  <Badge className={statusColors[person.status]}>
                    {statusLabels[person.status]}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {person.email && (
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <span className="text-sm">{person.email}</span>
                  </div>
                )}
                
                {person.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <span className="text-sm">{person.phone}</span>
                  </div>
                )}
                
                {person.department && (
                  <div className="flex items-center gap-2">
                    <Building className="w-4 h-4 text-gray-400" />
                    <span className="text-sm">{person.department}</span>
                  </div>
                )}
                
                {person.license_category && (
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-gray-400" />
                    <span className="text-sm">CNH: {person.license_category}</span>
                  </div>
                )}
                
                {/* License Expiry Warning */}
                {person.license_expiry && isExpiringSoon(person.license_expiry) && (
                  <div className="flex items-center gap-2 text-orange-600">
                    <AlertTriangle className="w-4 h-4" />
                    <span className="text-xs">CNH vence em {Math.ceil((new Date(person.license_expiry) - new Date()) / (1000 * 60 * 60 * 24))} dias</span>
                  </div>
                )}
                
                <div className="flex justify-between items-center pt-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(person)}
                    className="ds-hover"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Editar
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleArchive(person.id)}
                    className={person.status === 'archived' ? 'bg-green-50 text-green-700 hover:bg-green-100' : ''}
                  >
                    {person.status === 'archived' ? (
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

        {filteredPeople.length === 0 && (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">Nenhum funcionário encontrado</p>
            <p className="text-gray-400 text-sm mt-2">
              {searchTerm ? "Tente uma busca diferente" : "Comece adicionando um novo funcionário"}
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
              Tem certeza que deseja excluir permanentemente o funcionário{" "}
              <strong>{personToDelete?.name}</strong>?
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