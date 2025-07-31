import { IconLogout, IconDotsVertical } from "@tabler/icons-react";

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
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

export function NavUser() {
  const { isMobile } = useSidebar();
  const navigate = useNavigate();
  const [user, setUser] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userRes = await fetch("http://localhost:5000/api/user/profile", {
          credentials: "include",
        });
        const userData = await userRes.json();
        setUser({
          email: userData.data.email,
          username: userData.data.username,
        });
      } catch (error) {
        console.error("Failed to fetch user profile", error);
      }
    };

    fetchData();
  }, []);

  const handleLogout = async () => {
    try {
      const BASE_URL = import.meta.env.VITE_API_BASE_URL;
      const LOGOUT_URL = `${BASE_URL}/api/auth/logout`;

      const res = await fetch(LOGOUT_URL, {
        method: "POST",
        credentials: "include",
      });

      if (res.ok) {
        setUser({});
        navigate("/login");
      } else {
        console.error("Logout failed");
      }
    } catch (err) {
      console.error("Error logging out:", err);
    }
  };

  const initials = user.username
    ? user.username.slice(0, 2).toUpperCase()
    : "CK";

  return (
    <SidebarMenu>
      <SidebarMenuItem className="flex items-center justify-between">
        <SidebarMenuButton size="lg" className="flex-1">
          <Avatar className="h-8 w-8 rounded-lg grayscale">
            <AvatarImage src={user.avatar} alt={user.username || "User"} />
            <AvatarFallback className="rounded-lg">{initials}</AvatarFallback>
          </Avatar>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-medium">{user.username || "Unknown"}</span>
            <span className="text-muted-foreground truncate text-xs">{user.email || ""}</span>
          </div>
        </SidebarMenuButton>

        {/* Three Dots Dropdown */}
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
}
