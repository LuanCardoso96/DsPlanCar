import { useState, useEffect } from "react";
import { listDocumentos, createDocumento, updateDocumento, deleteDocumento, getVehicles, getPeople } from "@/services/FirestoreService";
import { uploadPdf, deleteFile } from "@/services/StorageService";
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
  FileText,
  Plus,
  Search,
  Edit,
  Trash2,
  Download,
  Upload,
  Calendar,
  Car,
  User
} from "lucide-react";

const documentTypes = [
  { value: "CNH", label: "CNH" },
  { value: "CRLV", label: "CRLV" },
  { value: "Seguro", label: "Seguro" },
  { value: "Manutenção", label: "Manutenção" },
  { value: "Outros", label: "Outros" },
];

export default function Documentos() {
  const [documentos, setDocumentos] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [people, setPeople] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedDocumento, setSelectedDocumento] = useState(null);
  const [documentoToDelete, setDocumentoToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    type: "",
    vehicleId: "",
    personId: "",
    expiresAt: "",
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [documentosData, vehiclesData, peopleData] = await Promise.all([
        listDocumentos(),
        getVehicles(),
        getPeople(),
      ]);
      setDocumentos(documentosData);
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
    
    if (!selectedFile) {
      alert("Por favor, selecione um arquivo PDF.");
      return;
    }

    setIsLoading(true);
    
    try {
      const { path, url } = await uploadPdf(selectedFile, { 
        folder: "documents", 
        prefix: "doc_" 
      });

      const documentoData = {
        ...formData,
        filePath: path,
        fileUrl: url,
        uploadedBy: "current-user-id",
      };

      if (selectedDocumento) {
        if (selectedDocumento.filePath) {
          await deleteFile(selectedDocumento.filePath);
        }
        await updateDocumento(selectedDocumento.id, documentoData);
      } else {
        await createDocumento(documentoData);
      }
      
      loadData();
      setIsDialogOpen(false);
      resetForm();
    } catch (error) {
      console.error("Error saving documento:", error);
      alert("Erro ao salvar documento. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (documento) => {
    setSelectedDocumento(documento);
    setFormData({
      title: documento.title || "",
      type: documento.type || "",
      vehicleId: documento.vehicleId || "",
      personId: documento.personId || "",
      expiresAt: documento.expiresAt ? new Date(documento.expiresAt.seconds * 1000).toISOString().slice(0, 10) : "",
    });
    setSelectedFile(null); // Reset file selection
    setIsDialogOpen(true);
  };

  const handleDeleteClick = (documento) => {
    setDocumentoToDelete(documento);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!documentoToDelete) return;
    
    try {
      if (documentoToDelete.filePath) {
        await deleteFile(documentoToDelete.filePath);
      }
      
      await deleteDocumento(documentoToDelete.id);
      
      loadData();
      setIsDeleteDialogOpen(false);
      setDocumentoToDelete(null);
    } catch (error) {
      console.error("Error deleting documento:", error);
      alert("Erro ao excluir documento. Tente novamente.");
    }
  };

  const handleDownload = (documento) => {
    if (documento.fileUrl) {
      window.open(documento.fileUrl, '_blank');
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      type: "",
      vehicleId: "",
      personId: "",
      expiresAt: "",
    });
    setSelectedFile(null);
    setSelectedDocumento(null);
  };

  const filteredDocumentos = documentos.filter(documento => {
    const matchesSearch = documento.title?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = !typeFilter || typeFilter === "all" || documento.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const getVehicleName = (vehicleId) => {
    const vehicle = vehicles.find(v => v.id === vehicleId);
    return vehicle ? `${vehicle.brand} ${vehicle.model}` : 'Veículo não encontrado';
  };

  const getPersonName = (personId) => {
    const person = people.find(p => p.id === personId);
    return person ? person.name : 'Pessoa não encontrada';
  };

  const getTypeBadge = (type) => {
    const typeConfig = {
      CNH: { className: "bg-blue-100 text-blue-800", label: "CNH" },
      CRLV: { className: "bg-green-100 text-green-800", label: "CRLV" },
      Seguro: { className: "bg-purple-100 text-purple-800", label: "Seguro" },
      Manutenção: { className: "bg-orange-100 text-orange-800", label: "Manutenção" },
      Outros: { className: "bg-gray-100 text-gray-800", label: "Outros" },
    };
    
    const config = typeConfig[type] || typeConfig.Outros;
    return (
      <Badge className={config.className}>
        {config.label}
      </Badge>
    );
  };

  const isExpiringSoon = (expiresAt) => {
    if (!expiresAt) return false;
    const expiryDate = new Date(expiresAt.seconds * 1000);
    const today = new Date();
    const daysUntilExpiry = Math.ceil((expiryDate - today) / (1000 * 60 * 60 * 24));
    return daysUntilExpiry <= 30 && daysUntilExpiry > 0;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Documentos</h1>
          <p className="text-gray-600 mt-1">Gerencie documentos de veículos e pessoas</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="ds-primary text-white shadow-lg hover:shadow-xl transition-all duration-300">
              <Plus className="w-4 h-4 mr-2" />
              Enviar Documento
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {selectedDocumento ? "Editar Documento" : "Enviar Documento"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="title">Título *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  placeholder="Ex: CNH João Silva"
                  required
                />
              </div>

              <div>
                <Label htmlFor="type">Tipo *</Label>
                <Select value={formData.type} onValueChange={(value) => setFormData({...formData, type: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    {documentTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="vehicleId">Veículo (Opcional)</Label>
                  <Select value={formData.vehicleId || "none"} onValueChange={(value) => setFormData({...formData, vehicleId: value === "none" ? null : value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o veículo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Sem veículo específico</SelectItem>
                      {vehicles.map((vehicle) => (
                        <SelectItem key={vehicle.id} value={vehicle.id}>
                          {vehicle.brand} {vehicle.model} - {vehicle.license_plate}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="personId">Pessoa (Opcional)</Label>
                  <Select value={formData.personId || "none"} onValueChange={(value) => setFormData({...formData, personId: value === "none" ? null : value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a pessoa" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Sem pessoa específica</SelectItem>
                      {people.map((person) => (
                        <SelectItem key={person.id} value={person.id}>
                          {person.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="expiresAt">Data de Vencimento (Opcional)</Label>
                <Input
                  id="expiresAt"
                  type="date"
                  value={formData.expiresAt}
                  onChange={(e) => setFormData({...formData, expiresAt: e.target.value})}
                />
              </div>

              <div>
                <Label htmlFor="file">Arquivo PDF *</Label>
                <div className="mt-2">
                  <Input
                    id="file"
                    type="file"
                    accept=".pdf"
                    onChange={(e) => setSelectedFile(e.target.files[0])}
                    required={!selectedDocumento}
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Apenas arquivos PDF são aceitos
                  </p>
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={isLoading} className="ds-primary text-white">
                  {isLoading ? "Salvando..." : selectedDocumento ? "Atualizar" : "Enviar"}
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
                  placeholder="Buscar por título..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filtrar por tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os tipos</SelectItem>
                {documentTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Documentos List */}
      <div className="grid gap-4">
        {isLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
            <p className="text-gray-500 mt-2">Carregando documentos...</p>
          </div>
        ) : filteredDocumentos.length > 0 ? (
          filteredDocumentos.map((documento) => (
            <Card key={documento.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-500 rounded-full flex items-center justify-center">
                      <FileText className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {documento.title}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        {getTypeBadge(documento.type)}
                        {isExpiringSoon(documento.expiresAt) && (
                          <Badge className="bg-red-100 text-red-800">
                            Vencendo em breve
                          </Badge>
                        )}
                      </div>
                      {documento.vehicleId && (
                        <p className="text-sm text-gray-600 mt-1">
                          <Car className="w-4 h-4 inline mr-1" />
                          Veículo: {getVehicleName(documento.vehicleId)}
                        </p>
                      )}
                      {documento.personId && (
                        <p className="text-sm text-gray-600">
                          <User className="w-4 h-4 inline mr-1" />
                          Pessoa: {getPersonName(documento.personId)}
                        </p>
                      )}
                      {documento.expiresAt && (
                        <p className="text-sm text-gray-500">
                          <Calendar className="w-4 h-4 inline mr-1" />
                          Vence em: {new Date(documento.expiresAt.seconds * 1000).toLocaleDateString('pt-BR')}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-sm text-gray-500">
                        Enviado em: {documento.uploadedAt ? new Date(documento.uploadedAt.seconds * 1000).toLocaleDateString('pt-BR') : 'N/A'}
                      </p>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => handleDownload(documento)}
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        <Download className="w-4 h-4 mr-1" />
                        Baixar
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(documento)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDeleteClick(documento)}
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
              <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum documento encontrado</h3>
              <p className="text-gray-500 mb-4">
                {searchTerm || typeFilter 
                  ? "Tente ajustar os filtros de busca." 
                  : "Comece enviando um novo documento."}
              </p>
              {!searchTerm && !typeFilter && (
                <Button onClick={() => setIsDialogOpen(true)} className="ds-primary text-white">
                  <Plus className="w-4 h-4 mr-2" />
                  Enviar Documento
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
            <AlertDialogTitle>Excluir Documento</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este documento? Esta ação não pode ser desfeita e o arquivo será removido permanentemente.
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
