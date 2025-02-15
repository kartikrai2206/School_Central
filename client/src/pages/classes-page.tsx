import { useAuth } from "@/hooks/use-auth";
import { AppShell } from "@/components/layout/app-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { FolderPlus, Pencil, Trash2 } from "lucide-react";
import { Class } from "@shared/schema";

export default function ClassesPage() {
  const { user } = useAuth();

  // Will implement this query later when we add the API endpoint
  const { data: classes, isLoading } = useQuery<Class[]>({
    queryKey: ["/api/classes"],
  });

  return (
    <AppShell>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Classes Management</h1>
          {user?.role === "admin" && (
            <Button className="gap-2">
              <FolderPlus className="h-4 w-4" />
              Create Class
            </Button>
          )}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Classes</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Teacher</TableHead>
                  {user?.role === "admin" && (
                    <TableHead className="w-24">Actions</TableHead>
                  )}
                </TableRow>
              </TableHeader>
              <TableBody>
                {classes?.map((class_) => (
                  <TableRow key={class_.id}>
                    <TableCell>{class_.name}</TableCell>
                    <TableCell>{class_.description}</TableCell>
                    <TableCell>{class_.teacherId}</TableCell>
                    {user?.role === "admin" && (
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="icon">
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
