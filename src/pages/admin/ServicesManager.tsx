import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Trash2, Edit, Plus, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import PaginationControl from "@/components/PaginationControl";

interface Service {
  id: number;
  title: string;
  description: string;
  icon: string;
}

import { api } from "@/lib/api";

const ServicesManager = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [services, setServices] = useState<Service[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState("");
  const [editing, setEditing] = useState<number | null>(null);
  const [formData, setFormData] = useState({ title: "", description: "", icon: "" });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/admin/login");
      return;
    }
    fetchServices();
  }, [navigate]);

  const fetchServices = async () => {
    try {
      const data = await api.get("/api/services/");
      if (Array.isArray(data)) {
        setServices(data as Service[]);
      } else {
        setServices([data as Service]);
      }
    } catch (error) {
      console.error("Error fetching services:", error);
      toast({ title: "Failed to load services", variant: "destructive" });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editing) {
        await api.put(`/api/services/${editing}`, formData);
        toast({ title: "Service updated" });
      } else {
        await api.post("/api/services/", formData);
        toast({ title: "Service created" });
      }
      setFormData({ title: "", description: "", icon: "" });
      setEditing(null);
      fetchServices();
    } catch (error) {
      toast({ title: "Error saving service", variant: "destructive" });
    }
  };

  const handleEdit = (service: Service) => {
    setEditing(service.id);
    setFormData({ title: service.title, description: service.description, icon: service.icon });
  };

  const handleDelete = async (id: number) => {
    try {
      await api.delete(`/api/services/${id}`);
      setServices(services.filter((s) => s.id !== id));
      toast({ title: "Service deleted" });
    } catch (error) {
      toast({ title: "Error deleting service", variant: "destructive" });
    }
  };

  const filteredServices = services.filter(
    (service) =>
      service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredServices.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentServices = filteredServices.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    const prefersReducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;
    window.scrollTo({ top: 0, behavior: prefersReducedMotion ? "auto" : "smooth" });
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AdminSidebar />
        <main className="flex-1 p-4 sm:p-8 bg-secondary">
          <h1 className="text-3xl font-bold mb-8">Manage Services</h1>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search services..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1); // Reset to first page on search
                }}
                className="pl-8 bg-white"
              />
            </div>
          </div>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>{editing ? "Edit Service" : "Add New Service"}</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  placeholder="Service Title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
                <Textarea
                  placeholder="Description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                />
                <Input
                  placeholder="Icon (e.g., globe, code)"
                  value={formData.icon}
                  onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                  required
                />
                <div className="flex gap-2">
                  <Button type="submit" className="bg-accent hover:bg-accent/90">
                    {editing ? "Update" : "Create"}
                  </Button>
                  {editing && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setEditing(null);
                        setFormData({ title: "", description: "", icon: "" });
                      }}
                    >
                      Cancel
                    </Button>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>

          <div className="space-y-4 animate-fade-in">
            {currentServices.map((service) => (
              <Card key={service.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle>{service.title}</CardTitle>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => handleEdit(service)}>
                        <Edit size={16} />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(service.id)}
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p>{service.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <PaginationControl
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            pageSize={itemsPerPage}
            onPageSizeChange={setItemsPerPage}
            totalItems={filteredServices.length}
          />
        </main>
      </div>
    </SidebarProvider>
  );
};

export default ServicesManager;
