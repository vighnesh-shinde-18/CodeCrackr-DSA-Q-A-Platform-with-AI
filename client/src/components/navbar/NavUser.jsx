import { useState, useEffect, useCallback, memo } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar,
} from "@/components/ui/sidebar";
import { IconLogout, IconDotsVertical } from "@tabler/icons-react";
import { toast } from "sonner";

const NavUserComponent = () => {
  const { isMobile } = useSidebar();
  const navigate = useNavigate();
  const [user, setUser] = useState({});
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/user/profile`, {
          withCredentials: true,
        });

        const userData = res.data.data;
        setUser({
          email: userData.email,
          username: userData.username,
          avatar: userData.avatar || "",
        });
      } catch (error) {
        console.error("Failed to fetch user profile", error);
        toast.error("Failed to load user");
      }
    };

    fetchData();
  }, [BASE_URL]);

  const handleLogout = useCallback(async () => {
    try {
      await axios.post(`${BASE_URL}/api/auth/logout`, {}, { withCredentials: true });
      setUser({});
      toast.success("Logged out");
      navigate("/login");
    } catch (err) {
      console.error("Error logging out:", err);
      toast.error("Logout failed");
    }
  }, [BASE_URL, navigate]);

  const initials = user.username ? user.username.slice(0, 2).toUpperCase() : "US";

  return (
    <SidebarMenu>
      <SidebarMenuItem className="flex items-center justify-between">
        <SidebarMenuButton size="lg" className="flex-1">
          <Avatar className="h-8 w-8 rounded-lg grayscale">
            <AvatarImage src={user.avatar} alt={user.username || "User"} />
            <AvatarFallback className="rounded-lg">{initials}</AvatarFallback>
          </Avatar>
          <div className="grid flex-1 text-left text-sm leading-tight ml-3">
            <span className="truncate font-medium">{user.username || "Unknown"}</span>
            <span className="text-muted-foreground truncate text-xs">{user.email || ""}</span>
          </div>
        </SidebarMenuButton>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="p-2 hover:bg-muted rounded-md transition">
              <IconDotsVertical className="h-4 w-4" />
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent className="w-40" align="end">
            <DropdownMenuItem onClick={handleLogout}>
              <IconLogout className="mr-2 h-4 w-4" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
};

export const NavUser = memo(NavUserComponent, ); // ✅ named export
