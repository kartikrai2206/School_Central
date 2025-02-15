import { Link } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  BookOpen, 
  Calendar, 
  GraduationCap, 
  LayoutDashboard, 
  LogOut, 
  Users 
} from "lucide-react";

export function AppShell({ children }: { children: React.ReactNode }) {
  const { user, logoutMutation } = useAuth();

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <div className="w-64 bg-card border-r flex flex-col">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-primary">School MS</h1>
        </div>
        
        <nav className="flex-1 px-4 space-y-2">
          <Link href="/">
            <a className="flex items-center space-x-2 p-2 rounded-md hover:bg-accent">
              <LayoutDashboard size={20} />
              <span>Dashboard</span>
            </a>
          </Link>
          
          {user?.role === "admin" && (
            <>
              <Link href="/users">
                <a className="flex items-center space-x-2 p-2 rounded-md hover:bg-accent">
                  <Users size={20} />
                  <span>Users</span>
                </a>
              </Link>
              <Link href="/classes">
                <a className="flex items-center space-x-2 p-2 rounded-md hover:bg-accent">
                  <BookOpen size={20} />
                  <span>Classes</span>
                </a>
              </Link>
            </>
          )}
          
          {user?.role === "teacher" && (
            <>
              <Link href="/attendance">
                <a className="flex items-center space-x-2 p-2 rounded-md hover:bg-accent">
                  <Calendar size={20} />
                  <span>Attendance</span>
                </a>
              </Link>
              <Link href="/grades">
                <a className="flex items-center space-x-2 p-2 rounded-md hover:bg-accent">
                  <GraduationCap size={20} />
                  <span>Grades</span>
                </a>
              </Link>
            </>
          )}
        </nav>
        
        <div className="p-4 border-t">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="w-full justify-start">
                <Avatar className="h-8 w-8 mr-2">
                  <AvatarFallback>{user?.fullName?.[0]}</AvatarFallback>
                </Avatar>
                <span className="truncate">{user?.fullName}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => logoutMutation.mutate()}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1">
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
