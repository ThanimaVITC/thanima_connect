'use client';

import { useState, useEffect } from 'react';
import {
  exportSubmissionsAsCsv,
  getSubmissions,
  downloadAllFiles,
} from '@/app/admin/actions';
import type { ApplicationData } from '@/app/schema';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Skeleton } from './ui/skeleton';
import { Download, FileCsv, LogOut } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function AdminDashboard({ onLogout }: { onLogout: () => Promise<void> }) {
  const [submissions, setSubmissions] = useState<ApplicationData[]>([]);
  const [loading, setLoading] = useState(true);
  const [exportingCsv, setExportingCsv] = useState(false);
  const [exportingFiles, setExportingFiles] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    async function fetchSubmissions() {
      try {
        const data = await getSubmissions();
        setSubmissions(data);
      } catch (error) {
        console.error(error);
        toast({
          title: 'Error',
          description: 'Failed to fetch submissions.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    }
    fetchSubmissions();
  }, [toast]);

  const handleExportCsv = async () => {
    setExportingCsv(true);
    try {
      const { content, error } = await exportSubmissionsAsCsv();
      if (error) {
        throw new Error(error);
      }
      const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.setAttribute('download', 'submissions.csv');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error(error);
      toast({
        title: 'Export Failed',
        description: 'Could not export data as CSV.',
        variant: 'destructive',
      });
    } finally {
      setExportingCsv(false);
    }
  };

  const handleDownloadFiles = async () => {
    setExportingFiles(true);
    try {
      const { content, error } = await downloadAllFiles();
       if (error || !content) {
        throw new Error(error || "No files to download.");
      }
      const link = document.createElement('a');
      link.href = `data:application/zip;base64,${content}`;
      link.download = 'resumes.zip';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error: any) {
      console.error(error);
      toast({
        title: 'Download Failed',
        description: error.message || 'Could not download files.',
        variant: 'destructive',
      });
    } finally {
      setExportingFiles(false);
    }
  };

  return (
    <div className="w-full max-w-7xl">
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle className="font-headline text-3xl">
                Admin Dashboard
              </CardTitle>
              <CardDescription>
                View and manage all applications.
              </CardDescription>
            </div>
            <div className="mt-4 flex gap-2 sm:mt-0">
              <Button
                onClick={handleExportCsv}
                disabled={exportingCsv || loading}
              >
                <FileCsv />
                {exportingCsv ? 'Exporting...' : 'Export CSV'}
              </Button>
              <Button
                onClick={handleDownloadFiles}
                disabled={exportingFiles || loading}
              >
                <Download />
                {exportingFiles ? 'Downloading...' : 'Download Files'}
              </Button>
              <form action={onLogout}>
                 <Button variant="outline" type="submit"><LogOut/>Logout</Button>
              </form>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-2">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Reg No</TableHead>
                    <TableHead>Branch & Year</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Primary</TableHead>
                    <TableHead>Secondary</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {submissions.map((submission, index) => (
                    <TableRow key={index}>
                      <TableCell>{submission.name}</TableCell>
                      <TableCell>{submission.regNo}</TableCell>
                      <TableCell>{submission.branchAndYear}</TableCell>
                      <TableCell>{submission.email}</TableCell>
                      <TableCell>{submission.phone}</TableCell>
                      <TableCell>{submission.primaryPreference}</TableCell>
                      <TableCell>{submission.secondaryPreference}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
