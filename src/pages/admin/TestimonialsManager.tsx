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

interface Testimonial {
  id: number;
  name: string;
  company: string;
  content: string;
  rating: number;
  image: string;
}


const TestimonialsManager = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(6);
  const [searchTerm, setSearchTerm] = useState("");
  const [editing, setEditing] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    company: "",
    content: "",
    rating: 5,
    image: "",
  });
  const resolveImage = (src: string) => {
    if (!src) return src;
    if (/^(https?:|data:|blob:)/.test(src)) return src;
    const base = import.meta.env.BASE_URL;
    if (src.startsWith(base)) return src;
    if (src.startsWith("/")) return `${base}${src.slice(1)}`;
    return `${base}${src}`;
  };
  const fallbackAvatar = `${import.meta.env.BASE_URL}eandsfinallogo.png`;

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/admin/login");
      return;
    }
    fetchTestimonials();
  }, [navigate]);

  const fetchTestimonials = async () => {
    try {
      const data = await api.get("/api/testimonials/");
      setTestimonials(Array.isArray(data) ? data as Testimonial[] : [data as Testimonial]);
    } catch (error) {
      console.error("Error fetching testimonials:", error);
      toast({ title: "Failed to load testimonials", variant: "destructive" });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editing) {
        await api.put(`/api/testimonials/${editing}`, formData);
        toast({ title: "Testimonial updated" });
      } else {
        await api.post("/api/testimonials/", formData);
        toast({ title: "Testimonial created" });
      }
      setFormData({ name: "", company: "", content: "", rating: 5, image: "" });
      setEditing(null);
      fetchTestimonials();
    } catch (error) {
      toast({ title: "Error saving testimonial", variant: "destructive" });
    }
  };

  const handleEdit = (testimonial: Testimonial) => {
    setEditing(testimonial.id);
    setFormData({
      name: testimonial.name,
      company: testimonial.company,
      content: testimonial.content,
      rating: testimonial.rating,
      image: testimonial.image || "",
    });
  };

  const handleDelete = async (id: number) => {
    try {
      await api.delete(`/api/testimonials/${id}`);
      setTestimonials(testimonials.filter((t) => t.id !== id));
      toast({ title: "Testimonial deleted" });
    } catch (error) {
      toast({ title: "Error deleting testimonial", variant: "destructive" });
    }
  };

  // Search and Pagination logic
  const filteredTestimonials = testimonials.filter(
    (t) =>
      t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredTestimonials.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentTestimonials = filteredTestimonials.slice(indexOfFirstItem, indexOfLastItem);

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
          <h1 className="text-3xl font-bold mb-8">Manage Testimonials</h1>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search testimonials..."
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
              <CardTitle>{editing ? "Edit Testimonial" : "Add New Testimonial"}</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  placeholder="Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
                <Input
                  placeholder="Company"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  required
                />
                <Textarea
                  placeholder="Testimonial Content"
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  required
                />
                <Input
                  type="number"
                  min="1"
                  max="5"
                  placeholder="Rating (1-5)"
                  value={formData.rating}
                  onChange={(e) => setFormData({ ...formData, rating: parseInt(e.target.value) })}
                  required
                />
                <Input
                  placeholder="Image URL"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
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
                        setFormData({ name: "", company: "", content: "", rating: 5, image: "" });
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
            {currentTestimonials.map((testimonial) => (
              <Card key={testimonial.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-4">
                      {testimonial.image && (
                        <img
                          src={resolveImage(testimonial.image)}
                          alt={testimonial.name}
                          className="w-16 h-16 rounded-full object-cover"
                          loading="lazy"
                          decoding="async"
                          onError={(e) => {
                            e.currentTarget.src = fallbackAvatar;
                          }}
                        />
                      )}
                      <div>
                        <CardTitle>{testimonial.name}</CardTitle>
                        <p className="text-sm text-muted-foreground">{testimonial.company}</p>
                        <p className="text-sm text-accent">Rating: {testimonial.rating}/5</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => handleEdit(testimonial)}>
                        <Edit size={16} />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(testimonial.id)}
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="italic">"{testimonial.content}"</p>
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
            totalItems={filteredTestimonials.length}
          />
        </main>
      </div>
    </SidebarProvider>
  );
};

export default TestimonialsManager;
