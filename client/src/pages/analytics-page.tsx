import { useAuth } from "@/hooks/use-auth";
import { AppShell } from "@/components/layout/app-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Download, Filter } from "lucide-react";
import { useState } from "react";

// Temporary mock data - will be replaced with real data from API
const mockData = [
  { name: 'Jan', attendance: 85, assignments: 92, grades: 88 },
  { name: 'Feb', attendance: 88, assignments: 85, grades: 90 },
  { name: 'Mar', attendance: 92, assignments: 89, grades: 87 },
  { name: 'Apr', attendance: 90, assignments: 95, grades: 91 },
];

export default function AnalyticsPage() {
  const { user } = useAuth();
  const [timeRange, setTimeRange] = useState("month");

  const downloadReport = () => {
    // TODO: Implement report download functionality
    console.log("Downloading report...");
  };

  return (
    <AppShell>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Analytics & Reports</h1>
          <Button onClick={downloadReport} className="gap-2">
            <Download className="h-4 w-4" />
            Download Report
          </Button>
        </div>

        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Total Students</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">1,234</div>
              <p className="text-muted-foreground">+12% from last month</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Average Attendance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">89%</div>
              <p className="text-muted-foreground">Past 30 days</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Average Grade</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">B+</div>
              <p className="text-muted-foreground">Current semester</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Performance Trends</CardTitle>
              <div className="flex gap-2 items-center">
                <Select defaultValue={timeRange} onValueChange={setTimeRange}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="week">Week</SelectItem>
                    <SelectItem value="month">Month</SelectItem>
                    <SelectItem value="semester">Semester</SelectItem>
                    <SelectItem value="year">Year</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[400px] mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={mockData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="attendance" fill="#1565C0" name="Attendance %" />
                  <Bar dataKey="assignments" fill="#4CAF50" name="Assignments %" />
                  <Bar dataKey="grades" fill="#FF7043" name="Grades %" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
