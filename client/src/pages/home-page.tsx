import { useAuth } from "@/hooks/use-auth";
import { AppShell } from "@/components/layout/app-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function HomePage() {
  const { user } = useAuth();

  return (
    <AppShell>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Welcome, {user?.fullName}</h1>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Role</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="capitalize">{user?.role}</p>
            </CardContent>
          </Card>
          
          {/* Additional cards based on role */}
          {user?.role === "teacher" && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle>Classes</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>View and manage your classes</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Assignments</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Create and grade assignments</p>
                </CardContent>
              </Card>
            </>
          )}
          
          {user?.role === "student" && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle>Grades</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>View your academic progress</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Assignments</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Check your pending assignments</p>
                </CardContent>
              </Card>
            </>
          )}
          
          {user?.role === "admin" && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle>Users</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Manage system users</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Classes</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Organize academic classes</p>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </div>
    </AppShell>
  );
}
