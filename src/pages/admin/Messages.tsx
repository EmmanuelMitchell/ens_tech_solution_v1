import { api } from "@/lib/api";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2, Mail, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import PaginationControl from "@/components/PaginationControl";

interface Message {
  id: number;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  createdAt: string;
}

const isRecord = (value: unknown): value is Record<string, unknown> => typeof value === "object" && value !== null;

const isMessage = (value: unknown): value is Message => {
  if (!isRecord(value)) return false;
  if (typeof value.id !== "number") return false;
  if (typeof value.name !== "string") return false;
  if (typeof value.email !== "string") return false;
  if (typeof value.subject !== "string") return false;
  if (typeof value.message !== "string") return false;
  if (typeof value.createdAt !== "string") return false;
  if (value.phone !== undefined && typeof value.phone !== "string") return false;
  return true;
};

const Messages = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchMessages = useCallback(async () => {
    try {
      const data = await api.get("/api/messages/");
      setMessages(Array.isArray(data) ? data.filter(isMessage) : []);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching messages:", error);
      setLoading(false);
      toast({ title: "Failed to load messages", variant: "destructive" });
    }
  }, [toast]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/admin/login");
      return;
    }

    fetchMessages();
  }, [fetchMessages, navigate]);

  const handleDelete = async (id: number) => {
    try {
      await api.delete(`/api/messages/${id}`);
      setMessages(messages.filter((msg) => msg.id !== id));
      toast({ title: "Message deleted successfully" });
    } catch (error) {
      toast({ title: "Error deleting message", variant: "destructive" });
    }
  };

  // Search and Pagination logic
  const filteredMessages = messages.filter(
    (msg) =>
      msg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      msg.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      msg.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      msg.message.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredMessages.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentMessages = filteredMessages.slice(indexOfFirstItem, indexOfLastItem);

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
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Messages</h1>
            <p className="text-muted-foreground">Manage customer inquiries</p>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search messages..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1); // Reset to first page on search
                }}
                className="pl-8 bg-white"
              />
            </div>
          </div>

          {loading ? (
            <p>Loading messages...</p>
          ) : messages.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center text-muted-foreground">
                <Mail className="mx-auto mb-4 text-muted-foreground" size={48} />
                <p>No messages yet</p>
              </CardContent>
            </Card>
          ) : (
            <>
              <div className="space-y-4 animate-fade-in">
                {currentMessages.map((message) => (
                  <Card key={message.id}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">{message.subject}</CardTitle>
                          <p className="text-sm text-muted-foreground mt-1">
                            From: {message.name} ({message.email}) {message.phone && `| Phone: ${message.phone}`}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {new Date(message.createdAt).toLocaleString()}
                          </p>
                        </div>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(message.id)}
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p>{message.message}</p>
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
                totalItems={filteredMessages.length}
              />
            </>
          )}
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Messages;
