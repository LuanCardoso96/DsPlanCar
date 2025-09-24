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
  FileText,
  Upload,
  Download,
  Calendar,
  AlertTriangle,
  Eye,
  ExternalLink,
  Car,
  User as UserIcon,
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

const documentTypes = [
  { value: "vehicle_document", label: "Documento do Veículo" },
  { value: "insurance", label: "Seguro" },
  { value: "license", label: "Licenciamento" },
  { value: "maintenance", label: "Manutenção" },
  { value: "contract", label: "Contrato" },
  { value: "other", label: "Outros" },
];

const entityTypes = [
  { value: "vehicle", label: "Veículo" },
  { value: "person", label: "Pessoa" },
  { value: "general", label: "Geral" },
];

const statusColors = {
  valid: "bg-green-100 text-green-800",
  expired: "bg-red-100 text-red-800",
  expiring: "bg-orange-100 text-orange-800",
  pending: "bg-yellow-100 text-yellow-800",
};

const statusLabels = {
  valid: "Válido",
  expired: "Vencido",
  expiring: "Vencendo",
  pending: "Pendente",
};

export default function Documents() {
  const [documents, setDocuments] = useState([]);
  const [filteredDocuments, setFilteredDocuments] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [people, setPeople] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadingFile, setUploadingFile] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    document_type: "other",
    related_entity_type: "general",
    related_entity_id: "",
    file_url: "",
    expiry_date: "",
    issue_date: "",
    status: "valid",
    notes: "",
  });

  const filterDocuments = useCallback(() => {
    if (!searchTerm) {
      setFilteredDocuments(documents);
      return;
    }

    const filtered = documents.filter(
      (document) =>
        document.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        document.notes?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredDocuments(filtered);
  }, [documents, searchTerm]);

  useEffect(() => {
    loadData();
    loadCurrentUser();
  }, []);

  useEffect(() => {
    filterDocuments();
  }, [filterDocuments]);

  const loadCurrentUser = () => {
    setCurrentUser({
      full_name: "João Silva",
      email: "joao.silva@empresa.com",
      role: "ADMIN"
    });
  };

  const loadData = () => {
    // Mock documents data
    const mockDocuments = [
      {
        id: 1,
        title: "Seguro Toyota Corolla",
        document_type: "insurance",
        related_entity_type: "vehicle",
        related_entity_id: 1,
        file_url: "https://example.com/insurance.pdf",
        expiry_date: "2024-12-31",
        issue_date: "2024-01-01",
        status: "valid",
        notes: "Seguro anual",
        created_date: "2024-01-01T00:00:00"
      },
      {
        id: 2,
        title: "Licenciamento Honda Civic",
        document_type: "license",
        related_entity_type: "vehicle",
        related_entity_id: 2,
        file_url: "https://example.com/license.pdf",
        expiry_date: "2024-06-15",
        issue_date: "2024-01-01",
        status: "expiring",
        notes: "",
        created_date: "2024-01-02T00:00:00"
      },
      {
        id: 3,
        title: "CNH João Silva",
        document_type: "other",
        related_entity_type: "person",
        related_entity_id: 1,
        file_url: "https://example.com/cnh.pdf",
        expiry_date: "2024-12-31",
        issue_date: "2020-01-01",
        status: "valid",
        notes: "CNH categoria B",
        created_date: "2024-01-03T00:00:00"
      }
    ];
    setDocuments(mockDocuments);

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

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setUploadingFile(true);
    // Simulate file upload
    setTimeout(() => {
      setFormData({ ...formData, file_url: `https://example.com/${file.name}` });
      setUploadingFile(false);
    }, 1000);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    setTimeout(() => {
      if (selectedDocument) {
        setDocuments(prev => prev.map(d => d.id === selectedDocument.id ? { ...formData, id: selectedDocument.id } : d));
      } else {
        const newDocument = {
          ...formData,
          id: Date.now(),
          created_date: new Date().toISOString()
        };
        setDocuments(prev => [newDocument, ...prev]);
      }
      
      setIsDialogOpen(false);
      resetForm();
      setIsLoading(false);
    }, 1000);
  };

  const handleEdit = (document) => {
    setSelectedDocument(document);
    setFormData({
      ...document,
      expiry_date: document.expiry_date || "",
      issue_date: document.issue_date || "",
    });
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      title: "",
      document_type: "other",
      related_entity_type: "general",
      related_entity_id: "",
      file_url: "",
      expiry_date: "",
      issue_date: "",
      status: "valid",
      notes: "",
    });
    setSelectedDocument(null);
  };

  const getRelatedEntityInfo = (document) => {
    if (document.related_entity_type === "vehicle") {
      const vehicle = vehicles.find(v => v.id === document.related_entity_id);
      return vehicle ? `${vehicle.brand} ${vehicle.model} - ${vehicle.license_plate}` : "Veículo não encontrado";
    } else if (document.related_entity_type === "person") {
      const person = people.find(p => p.id === document.related_entity_id);
      return person ? `${person.name} - ${person.department}` : "Pessoa não encontrada";
    }
    return "Geral";
  };

  const isExpiringSoon = (date) => {
    if (!date) return false;
    const daysUntilExpiry = Math.ceil((new Date(date) - new Date()) / (1000 * 60 * 60 * 24));
    return daysUntilExpiry <= 30 && daysUntilExpiry > 0;
  };

  const updateDocumentStatus = () => {
    setDocuments(prev => prev.map(doc => {
      if (!doc.expiry_date) return doc;
      
      const daysUntilExpiry = Math.ceil((new Date(doc.expiry_date) - new Date()) / (1000 * 60 * 60 * 24));
      
      let status = "valid";
      if (daysUntilExpiry < 0) {
        status = "expired";
      } else if (daysUntilExpiry <= 30) {
        status = "expiring";
      }
      
      return { ...doc, status };
    }));
  };

  useEffect(() => {
    updateDocumentStatus();
  }, []);

  return (
    <div className="p-4 md:p-8 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gestão de Documentos</h1>
            <p className="text-gray-600 mt-1">Gerencie documentos de veículos e funcionários</p>
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button 
                className="ds-primary text-white shadow-lg hover:shadow-xl transition-all duration-300"
                onClick={resetForm}
              >
                <Plus className="w-4 h-4 mr-2" />
                Novo Documento
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {selectedDocument ? "Editar Documento" : "Novo Documento"}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="title">Título *</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="document_type">Tipo de Documento</Label>
                    <Select
                      value={formData.document_type}
                      onValueChange={(value) => setFormData({...formData, document_type: value})}
                    >
                      <SelectTrigger>
                        <SelectValue />
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
                  <div>
                    <Label htmlFor="related_entity_type">Entidade Relacionada</Label>
                    <Select
                      value={formData.related_entity_type}
                      onValueChange={(value) => setFormData({...formData, related_entity_type: value, related_entity_id: ""})}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {entityTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  {formData.related_entity_type !== "general" && (
                    <div>
                      <Label htmlFor="related_entity_id">
                        {formData.related_entity_type === "vehicle" ? "Veículo" : "Pessoa"}
                      </Label>
                      <Select
                        value={formData.related_entity_id}
                        onValueChange={(value) => setFormData({...formData, related_entity_id: value})}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecionar" />
                        </SelectTrigger>
                        <SelectContent>
                          {formData.related_entity_type === "vehicle" 
                            ? vehicles.map((vehicle) => (
                                <SelectItem key={vehicle.id} value={vehicle.id.toString()}>
                                  {vehicle.brand} {vehicle.model} - {vehicle.license_plate}
                                </SelectItem>
                              ))
                            : people.map((person) => (
                                <SelectItem key={person.id} value={person.id.toString()}>
                                  {person.name} - {person.department}
                                </SelectItem>
                              ))
                          }
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                  <div>
                    <Label htmlFor="issue_date">Data de Emissão</Label>
                    <Input
                      id="issue_date"
                      type="date"
                      value={formData.issue_date}
                      onChange={(e) => setFormData({...formData, issue_date: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="expiry_date">Data de Vencimento</Label>
                    <Input
                      id="expiry_date"
                      type="date"
                      value={formData.expiry_date}
                      onChange={(e) => setFormData({...formData, expiry_date: e.target.value})}
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
                  <Label htmlFor="file">Arquivo</Label>
                  <Input
                    id="file"
                    type="file"
                    onChange={handleFileUpload}
                    disabled={uploadingFile}
                  />
                  {uploadingFile && <p className="text-sm text-gray-500 mt-1">Enviando arquivo...</p>}
                  {formData.file_url && (
                    <div className="mt-2 p-2 bg-green-50 rounded">
                      <p className="text-sm text-green-800">Arquivo: {formData.file_url}</p>
                    </div>
                  )}
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
                    {isLoading ? "Salvando..." : selectedDocument ? "Atualizar" : "Criar"}
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
            placeholder="Buscar documentos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Documents Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDocuments.map((document) => (
            <Card key={document.id} className="glass-card border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg font-bold text-gray-900">
                      {document.title}
                    </CardTitle>
                    <p className="text-sm text-gray-500">
                      {documentTypes.find(t => t.value === document.document_type)?.label}
                    </p>
                  </div>
                  <Badge className={statusColors[document.status]}>
                    {statusLabels[document.status]}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                  {document.related_entity_type === "vehicle" ? (
                    <Car className="w-4 h-4 text-gray-400" />
                  ) : document.related_entity_type === "person" ? (
                    <UserIcon className="w-4 h-4 text-gray-400" />
                  ) : (
                    <FileText className="w-4 h-4 text-gray-400" />
                  )}
                  <span className="text-sm">{getRelatedEntityInfo(document)}</span>
                </div>
                
                {document.issue_date && (
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="text-sm">
                      Emitido em {format(new Date(document.issue_date), "dd/MM/yyyy", { locale: ptBR })}
                    </span>
                  </div>
                )}
                
                {document.expiry_date && (
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="text-sm">
                      Vence em {format(new Date(document.expiry_date), "dd/MM/yyyy", { locale: ptBR })}
                    </span>
                  </div>
                )}
                
                {/* Expiry Warning */}
                {document.expiry_date && isExpiringSoon(document.expiry_date) && (
                  <div className="flex items-center gap-2 text-orange-600">
                    <AlertTriangle className="w-4 h-4" />
                    <span className="text-xs">
                      Vence em {Math.ceil((new Date(document.expiry_date) - new Date()) / (1000 * 60 * 60 * 24))} dias
                    </span>
                  </div>
                )}
                
                {document.notes && (
                  <div className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                    {document.notes}
                  </div>
                )}
                
                <div className="flex justify-between items-center pt-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(document)}
                    className="ds-hover"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Editar
                  </Button>
                  
                  {document.file_url && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(document.file_url, '_blank')}
                      className="ds-hover"
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Ver
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredDocuments.length === 0 && (
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">Nenhum documento encontrado</p>
            <p className="text-gray-400 text-sm mt-2">
              {searchTerm ? "Tente uma busca diferente" : "Comece adicionando um novo documento"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}