import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, Briefcase, Image, Star } from "lucide-react";
import { api } from "@/lib/api";

const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState([
    { title: "Messages", count: 0, icon: MessageSquare, color: "text-accent" },
    { title: "Services", count: 0, icon: Briefcase, color: "text-accent" },
    { title: "Portfolio Items", count: 0, icon: Image, color: "text-accent" },
    { title: "Testimonials", count: 0, icon: Star, color: "text-accent" },
  ]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/admin/login");
      return;
    }

    const fetchStats = async () => {
      try {
        const [messages, services, portfolio, testimonials] = await Promise.all([
          api.get("/api/messages/"),
          api.get("/api/services/"),
          api.get("/api/portfolio/"),
          api.get("/api/testimonials/"),
        ]);

        setStats([
          { title: "Messages", count: messages.length, icon: MessageSquare, color: "text-accent" },
          { title: "Services", count: services.length, icon: Briefcase, color: "text-accent" },
          { title: "Portfolio Items", count: portfolio.length, icon: Image, color: "text-accent" },
          { title: "Testimonials", count: testimonials.length, icon: Star, color: "text-accent" },
        ]);
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
      }
    };

    fetchStats();
  }, [navigate]);

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AdminSidebar />
        <main className="flex-1 p-8 bg-secondary">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
            <p className="text-muted-foreground">Welcome to your admin dashboard</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <Card key={index} className="hover:shadow-gold transition-all duration-300">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </CardTitle>
                  <stat.icon className={stat.color} size={20} />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{stat.count}</div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">No recent activity to display</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    Use the sidebar to manage your content
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Dashboard;
