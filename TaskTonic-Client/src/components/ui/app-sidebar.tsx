/* eslint-disable @typescript-eslint/no-explicit-any */

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Link, useLocation } from "react-router";
import Logo from "@/assets/logo/logo.png";
import { useGetProfileQuery } from "@/redux/features/user/user.api";
import {
  Users,
  FolderKanban,
  CheckSquare,

} from "lucide-react";

const navigationData = {
  navMain: [
    {
      title: "Main",
      items: [

        {
          title: "Tasks",
          url: "/dashboard/tasks",
          icon: CheckSquare,
        },
        {
          title: "Projects",
          url: "/dashboard/projects",
          icon: FolderKanban,
        }
      ],
    },
    {
      title: "Team Management",
      items: [
        {
          title: "Teams",
          url: "/dashboard/teams",
          icon: Users,
        },
        
      ],
    },
   
  ],
};


export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data: userData } = useGetProfileQuery(undefined);
  const location = useLocation();



  const isActiveRoute = (url: string) => {
    if (url === "/dashboard") {
      return location.pathname === "/dashboard";
    }
    return location.pathname.startsWith(url);
  };

  return (
    <Sidebar {...props} className="border-r bg-white">
      <SidebarHeader className="items-center border-b py-4">
        <Link to="/" className="flex items-center">
            <img src={Logo} alt="TasTonic Logo" className="h-32 w-auto" />
          </Link>
      </SidebarHeader>
      
      <SidebarContent className="px-2 py-4">
        {navigationData.navMain.map((group) => (
          <SidebarGroup key={group.title}>
            <SidebarGroupLabel 
              className="text-xs font-semibold uppercase tracking-wider px-3 mb-2"
              style={{ color: "#6b7280" }}
            >
              {group.title}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = isActiveRoute(item.url);
                  
                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton 
                        asChild
                        className={`
                          px-3 py-2 rounded-lg transition-all duration-200
                          ${isActive 
                            ? 'text-white font-medium shadow-sm' 
                            : 'text-gray-700 hover:bg-gray-100'
                          }
                        `}
                        style={isActive ? { backgroundColor: "#4871dc" } : {}}
                      >
                        <Link to={item.url} className="flex items-center gap-3">
                          <Icon className="h-5 w-5" />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter className="border-t p-4">
        {userData?.data && (
          <div className="flex items-center gap-3 px-2">
            <div 
              className="h-10 w-10 rounded-full flex items-center justify-center text-white font-semibold"
              style={{ backgroundColor: "#4871dc" }}
            >
              {userData.data.name
                ? userData.data.name
                    .split(" ")
                    .map((n: any[]) => n[0])
                    .join("")
                    .toUpperCase()
                : userData.data.email?.charAt(0).toUpperCase() || "U"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {userData.data.name || "User"}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {userData.data.email}
              </p>
            </div>
          </div>
        )}
      </SidebarFooter>
      
      <SidebarRail />
    </Sidebar>
  );
}