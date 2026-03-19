import { api } from "@/lib/api";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Trash2, Edit, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import PaginationControl from "@/components/PaginationControl";

interface PortfolioItem {
  id: number;
  title: string;
  description: string;
  category: string;
  image: string;
  link?: string;
}


const PortfolioManager = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(6);
  const [searchTerm, setSearchTerm] = useState("");
  const [editing, setEditing] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    image: "",
    link: "",
  });
  const resolveImage = (src: string) => {
    if (!src) return src;
    if (/^(https?:|data:|blob:)/.test(src)) return src;
    const base = import.meta.env.BASE_URL;
    if (src.startsWith(base)) return src;
    if (src.startsWith("/")) return `${base}${src.slice(1)}`;
    return `${base}${src}`;
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/admin/login");
      return;
    }
    fetchPortfolio();
  }, [navigate]);

  const fetchPortfolio = async () => {
    try {
      const data = await api.get("/api/portfolio/");
      setItems(Array.isArray(data) ? (data as PortfolioItem[]) : []);
    } catch (error) {
      console.error("Error fetching portfolio:", error);
      toast({ title: "Failed to load portfolio", variant: "destructive" });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editing) {
        await api.put(`/api/portfolio/${editing}`, formData);
        toast({ title: "Portfolio item updated" });
      } else {
        await api.post("/api/portfolio/", formData);
        toast({ title: "Portfolio item created" });
      }
      setFormData({ title: "", description: "", category: "", image: "", link: "" });
      setEditing(null);
      fetchPortfolio();
    } catch (error) {
      toast({ title: "Error saving portfolio item", variant: "destructive" });
    }
  };

  const handleEdit = (item: PortfolioItem) => {
    setEditing(item.id);
    setFormData({
      title: item.title,
      description: item.description,
      category: item.category,
      image: item.image,
      link: item.link || "",
    });
  };

  const handleDelete = async (id: number) => {
    try {
      await api.delete(`/api/portfolio/${id}`);
      setItems(items.filter((i) => i.id !== id));
      toast({ title: "Portfolio item deleted" });
    } catch (error) {
      toast({ title: "Error deleting item", variant: "destructive" });
    }
  };

  // Search and Pagination logic
  const filteredItems = items.filter(
    (item) =>
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);

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
          <h1 className="text-3xl font-bold mb-8">Manage Portfolio</h1>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search portfolio..."
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
              <CardTitle>{editing ? "Edit Portfolio Item" : "Add New Portfolio Item"}</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  placeholder="Title"
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
                  placeholder="Category"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  required
                />
                <Input
                  placeholder="Project URL (optional)"
                  value={formData.link}
                  onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                  type="url"
                />
                <Input
                  placeholder="Image URL"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
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
                        setFormData({ title: "", description: "", category: "", image: "", link: "" });
                      }}
                    >
                      Cancel
                    </Button>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-fade-in">
            {currentItems.map((item) => (
              <Card key={item.id}>
                <div className="h-48 bg-muted">
                  {item.image && (
                    <img src={resolveImage(item.image)} alt={item.title} className="w-full h-full object-cover" loading="lazy" decoding="async" />
                  )}
                </div>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{item.title}</CardTitle>
                      <p className="text-sm text-accent">{item.category}</p>
                      {item.link && (
                        <a
                          href={item.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-blue-600 hover:underline mt-1 inline-block"
                        >
                          View Project →
                        </a>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => handleEdit(item)}>
                        <Edit size={16} />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(item.id)}
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">{item.description}</p>
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
            totalItems={filteredItems.length}
          />
        </main>
      </div>
    </SidebarProvider>
  );
};

export default PortfolioManager;
