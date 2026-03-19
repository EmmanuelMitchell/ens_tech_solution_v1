import { useNavigate } from "react-router-dom";
import { LogOut, LayoutDashboard, MessageSquare, Briefcase, Image, Star } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { NavLink } from "@/components/NavLink";

const AdminSidebar = () => {
  const navigate = useNavigate();
  const { state } = useSidebar();
  const logoSrc = `${import.meta.env.BASE_URL}eandsfinallogo.png`;

  const menuItems = [
    { title: "Dashboard", url: "/admin/dashboard", icon: LayoutDashboard },
    { title: "Messages", url: "/admin/messages", icon: MessageSquare },
    { title: "Services", url: "/admin/services", icon: Briefcase },
    { title: "Portfolio", url: "/admin/portfolio", icon: Image },
    { title: "Testimonials", url: "/admin/testimonials", icon: Star },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/admin/login");
  };

  return (
    <Sidebar className={state === "collapsed" ? "w-14" : "w-64"} collapsible="icon">
      <div className="p-4 border-b border-sidebar-border flex items-center justify-between">
        {state !== "collapsed" && (
          <div className="flex items-center space-x-2">
            <img src={logoSrc} alt="E&S Tech Solutions" className="w-8 h-8 rounded-lg" loading="lazy" decoding="async" />
            <span className="font-bold text-sidebar-foreground">Admin Panel</span>
          </div>
        )}
        <SidebarTrigger className="ml-auto" />
      </div>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Management</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      className="hover:bg-sidebar-accent hover:text-sidebar-primary transition-colors"
                      activeClassName="bg-sidebar-accent text-sidebar-primary font-medium border-r-2 border-sidebar-primary"
                    >
                      <item.icon size={20} />
                      {state !== "collapsed" && <span className="ml-2">{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={handleLogout} className="hover:bg-destructive/10 text-destructive">
                  <LogOut size={20} />
                  {state !== "collapsed" && <span className="ml-2">Logout</span>}
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

export default AdminSidebar;
