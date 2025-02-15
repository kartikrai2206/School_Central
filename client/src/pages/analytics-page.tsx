import { useAuth } from "@/hooks/use-auth";
import { AppShell } from "@/components/layout/app-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Download, Filter, Loader2 } from "lucide-react";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

export default function AnalyticsPage() {
  const { user } = useAuth();
  const [timeRange, setTimeRange] = useState("month");

  const { data: summary, isLoading: isSummaryLoading } = useQuery({
    queryKey: ["/api/analytics/summary"],
  });

  const { data: trends, isLoading: isTrendsLoading } = useQuery({
    queryKey: ["/api/analytics/trends", timeRange],
  });

  const downloadReport = () => {
    // TODO: Implement report download functionality
    console.log("Downloading report...");
  };

  if (user?.role !== "admin") {
    return (
      <AppShell>
        <div className="flex items-center justify-center h-[80vh]">
          <Card>
            <CardContent className="pt-6">
              <p className="text-muted-foreground">You don't have access to this page.</p>
            </CardContent>
          </Card>
        </div>
      </AppShell>
    );
  }

  if (isSummaryLoading || isTrendsLoading) {
    return (
      <AppShell>
        <div className="flex items-center justify-center h-[80vh]">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </AppShell>
    );
  }

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
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader>
              <CardTitle>Total Students</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{summary?.totalStudents}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Average Attendance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{summary?.averageAttendance}%</div>
              <p className="text-muted-foreground">Past 30 days</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Average Grade</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{summary?.averageGrade}%</div>
              <p className="text-muted-foreground">Current semester</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Total Classes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{summary?.totalClasses}</div>
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
                <BarChart data={trends}>
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