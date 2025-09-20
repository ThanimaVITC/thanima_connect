'use client';

import { useState, useEffect } from 'react';
import {
  exportSubmissionsAsCsv,
  getSubmissions,
  downloadAllFiles,
  deleteSubmission,
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
import { Download, FileSpreadsheet, LogOut, Trash2 } from 'lucide-react';
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
          description: 'Failed to fetch submissions. You may need to log in again.',
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

  const handleDeleteSubmission = async (submissionId: string) => {
    if (!window.confirm('Are you sure you want to delete this submission?')) {
      return;
    }

    try {
      const { success, error } = await deleteSubmission(submissionId);
      if (!success) {
        throw new Error(error);
      }
      
      setSubmissions(submissions.filter(s => s._id !== submissionId));
      toast({
        title: 'Success',
        description: 'Submission deleted successfully',
      });
    } catch (error: any) {
      toast({
        title: 'Delete Failed',
        description: error.message || 'Could not delete submission.',
        variant: 'destructive',
      });
    }
  };

  return (
    <main className="flex min-h-dvh flex-col items-center justify-center p-4 sm:p-8 w-full">
      <div className="w-full max-w-7xl">
        <div className="content-backdrop">
          <Card className="border-0 shadow-none bg-transparent">
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
                  className="button-glow interactive-element"
                >
                  <FileSpreadsheet />
                  {exportingCsv ? 'Exporting...' : 'Export CSV'}
                </Button>
                <Button
                  onClick={handleDownloadFiles}
                  disabled={exportingFiles || loading}
                  className="button-glow interactive-element"
                >
                  <Download />
                  {exportingFiles ? 'Downloading...' : 'Download Files'}
                </Button>
                <form action={onLogout}>
                  <Button variant="outline" type="submit" className="button-glow interactive-element"><LogOut/>Logout</Button>
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
                      <TableHead>S.No</TableHead>
                      <TableHead>Action</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Reg No</TableHead>
                      <TableHead>Branch & Year</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Primary</TableHead>
                      <TableHead>Secondary</TableHead>
                      <TableHead>Tertiary</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {submissions.map((submission, index) => (
                      <TableRow key={index}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>
                          <Button 
                            variant="destructive" 
                            size="sm"
                            onClick={() => handleDeleteSubmission(submission._id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                        <TableCell>{submission.name}</TableCell>
                        <TableCell>{submission.regNo}</TableCell>
                        <TableCell>{submission.branchAndYear}</TableCell>
                        <TableCell>{submission.email}</TableCell>
                        <TableCell>{submission.phone}</TableCell>
                        <TableCell>{submission.primaryPreference}</TableCell>
                        <TableCell>{submission.secondaryPreference}</TableCell>
                        <TableCell>{submission.tertiaryPreference}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
