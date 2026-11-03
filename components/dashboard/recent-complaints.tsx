
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  CalendarDays,
  Eye,
  FileText,
  MapPin,
  MoreHorizontal,
  Pencil,
  RefreshCw,
  Search,
  Tag,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";

import {
  getMyComplaintsApi,
  deleteComplaintApi,
} from "@/lib/api";

import { UpdateComplaintDialog } from "@/components/complaints/update-complaint-dialog";
import type { EditableComplaint } from "@/types/complaints/types";
import { DeleteAlertDialog } from "@/components/shared/delete-alert-dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type Complaint = EditableComplaint & {
  status: string;
  createdAt?: string;
  category?: {
    name?: string;
    slug?: string;
  };
};

function getStatusStyles(status: string) {
  switch (status?.toLowerCase()) {
    case "open":
      return "border-blue-500/30 text-blue-600 dark:text-blue-400";
    case "in_progress":
      return "border-amber-500/30 text-amber-600 dark:text-amber-400";
    case "resolved":
      return "border-green-500/30 text-green-600 dark:text-green-400";
    default:
      return "border-border text-muted-foreground";
  }
}

function formatStatus(status: string) {
  return (
    status
      ?.split("_")
      .map(
        (word) => word.charAt(0).toUpperCase() + word.slice(1)
      )
      .join(" ") || "Unknown"
  );
}

function formatDate(date?: string) {
  if (!date) return "N/A";

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) return "N/A";

  return parsed.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function RecentComplaints() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const [selectedComplaint, setSelectedComplaint] =
    useState<Complaint | null>(null);

  const [complaintToUpdate, setComplaintToUpdate] =
    useState<Complaint | null>(null);

  const [complaintToDelete, setComplaintToDelete] =
    useState<Complaint | null>(null);

  const [deleting, setDeleting] = useState(false);

  const fetchComplaints = useCallback(async () => {
    try {
      setLoading(true);

      const response = await getMyComplaintsApi();

      const data = Array.isArray(response)
        ? response
        : Array.isArray(response?.data)
          ? response.data
          : Array.isArray(response?.data?.data)
            ? response.data.data
            : [];

      setComplaints(data);
    } catch (error) {
      console.error("Failed to fetch complaints:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to load your complaints."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchComplaints();
  }, [fetchComplaints]);

  const filteredComplaints = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return complaints;

    return complaints.filter((complaint) =>
      [
        complaint.title,
        complaint.location,
        complaint.category?.name,
        complaint.status,
        String(complaint.id),
      ].some((value) => value?.toLowerCase().includes(query))
    );
  }, [complaints, search]);

  const handleDelete = async () => {
    if (!complaintToDelete) return;

    try {
      setDeleting(true);

      await deleteComplaintApi(complaintToDelete.id);

      setComplaints((previous) =>
        previous.filter((item) => item.id !== complaintToDelete.id)
      );

      setComplaintToDelete(null);
      toast.success("Complaint deleted successfully.");
    } catch (error) {
      console.error("Failed to delete complaint:", error);

      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to delete complaint."
      );
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <Card className="h-full rounded-2xl shadow-none">
        <CardHeader className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <CardTitle className="text-lg">
              Recent complaints
            </CardTitle>

            <p className="mt-1 text-sm text-muted-foreground">
              Track and manage your submitted complaints.
            </p>
          </div>

          <Link
            href="/student-client/complaints"
            className="inline-flex h-9 items-center justify-center gap-1 rounded-md px-3 text-sm font-medium transition-colors hover:bg-muted"
          >
            View all
            <ArrowUpRight className="size-4" />
          </Link>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Search and refresh */}
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

              <Input
                placeholder="Search your complaints..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                className="pl-9"
              />
            </div>

            <Button
              variant="outline"
              size="icon"
              onClick={() => void fetchComplaints()}
              disabled={loading}
              aria-label="Refresh complaints"
            >
              <RefreshCw
                className={`size-4 ${loading ? "animate-spin" : ""}`}
              />
            </Button>
          </div>

          {/* Complaints table */}
          <div className="overflow-x-auto rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[65px]">ID</TableHead>
                  <TableHead>Complaint</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="hidden whitespace-nowrap md:table-cell">
                    Created
                  </TableHead>
                  <TableHead className="w-[60px] text-right">
                    Action
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="h-32 text-center"
                    >
                      <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                        <RefreshCw className="size-4 animate-spin" />
                        Loading complaints...
                      </div>
                    </TableCell>
                  </TableRow>
                ) : filteredComplaints.length > 0 ? (
                  filteredComplaints.slice(0, 5).map((complaint) => (
                    <TableRow key={complaint.id}>
                      <TableCell className="font-medium">
                        #{complaint.id}
                      </TableCell>

                      <TableCell>
                        <div className="max-w-[220px]">
                          <p className="truncate text-sm font-medium">
                            {complaint.title}
                          </p>

                          <p className="truncate text-xs text-muted-foreground">
                            {complaint.location || "No location"}
                          </p>
                        </div>
                      </TableCell>

                      <TableCell className="text-sm text-muted-foreground">
                        {complaint.category?.name || "Uncategorized"}
                      </TableCell>

                      <TableCell>
                        <Badge
                          variant="outline"
                          className={getStatusStyles(complaint.status)}
                        >
                          {formatStatus(complaint.status)}
                        </Badge>
                      </TableCell>

                      <TableCell className="hidden whitespace-nowrap text-sm text-muted-foreground md:table-cell">
                        {formatDate(complaint.createdAt)}
                      </TableCell>

                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger
                            aria-label="Complaint actions"
                            className="inline-flex size-8 items-center justify-center rounded-md transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                          >
                            <MoreHorizontal className="size-4" />
                          </DropdownMenuTrigger>

                          <DropdownMenuContent
                            align="end"
                            className="min-w-44"
                          >
                            <DropdownMenuItem
                              onClick={() => {
                                setSelectedComplaint(complaint);
                              }}
                            >
                              <Eye className="mr-2 size-4" />
                              View details
                            </DropdownMenuItem>

                              <DropdownMenuItem
                              disabled={
                            !["open", "rejected"].includes(complaint.status.toLowerCase())
                            }
                            onClick={() => setComplaintToUpdate(complaint)}
                              >
                            <Pencil className="mr-2 size-4" />
                                      Update complaint
                            </DropdownMenuItem>

                            <DropdownMenuSeparator />

                            <DropdownMenuItem
                              className="text-destructive focus:text-destructive"
                              onClick={() => {
                                setComplaintToDelete(complaint);
                              }}
                            >
                              <Trash2 className="mr-2 size-4" />
                              Delete complaint
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6}>
                      <div className="flex min-h-48 flex-col items-center justify-center text-center">
                        <div className="rounded-xl border p-3">
                          <FileText className="size-6 text-muted-foreground" />
                        </div>

                        <h3 className="mt-4 font-medium">
                          {search
                            ? "No matching complaints"
                            : "No complaints to show yet"}
                        </h3>

                        <p className="mt-1 text-sm text-muted-foreground">
                          {search
                            ? "Try searching with another keyword."
                            : "Your submitted complaints will appear here."}
                        </p>

                        {!search && (
                          <Link
                            href="/complaints"
                            className="mt-4 inline-flex h-9 items-center justify-center rounded-md border px-4 text-sm font-medium transition-colors hover:bg-muted"
                          >
                            Open my complaints
                          </Link>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {!loading && filteredComplaints.length > 0 && (
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>
                Showing {Math.min(filteredComplaints.length, 5)} of{" "}
                {filteredComplaints.length} matching complaints
              </span>

              <Link
                href="/student-client/complaints"
                className="font-medium text-foreground hover:underline"
              >
                See all complaints
              </Link>
            </div>
          )}
        </CardContent>
      </Card>

      {/* View complaint dialog */}
      <Dialog
        open={selectedComplaint !== null}
        onOpenChange={(open) => {
          if (!open) setSelectedComplaint(null);
        }}
      >
        <DialogContent className="sm:max-w-[480px]">
          <DialogHeader>
            <DialogTitle>Complaint details</DialogTitle>
            <DialogDescription>
              Review the information about your submitted complaint.
            </DialogDescription>
          </DialogHeader>

          {selectedComplaint && (
            <div className="space-y-5">
              <div>
                <p className="text-xs text-muted-foreground">
                  Complaint #{selectedComplaint.id}
                </p>

                <h3 className="mt-1 text-lg font-semibold">
                  {selectedComplaint.title}
                </h3>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <Badge
                  variant="outline"
                  className={getStatusStyles(selectedComplaint.status)}
                >
                  {formatStatus(selectedComplaint.status)}
                </Badge>

                <Badge variant="secondary">
                  {selectedComplaint.category?.name || "Uncategorized"}
                </Badge>
              </div>

              <div className="space-y-3 rounded-lg border p-4">
                <div className="flex items-center gap-3 text-sm">
                  <MapPin className="size-4 shrink-0 text-muted-foreground" />
                  <span>
                    {selectedComplaint.location || "No location provided"}
                  </span>
                </div>

                {selectedComplaint.building && (
                  <div className="flex items-center gap-3 text-sm">
                    <MapPin className="size-4 shrink-0 text-muted-foreground" />
                    <span>{selectedComplaint.building}</span>
                  </div>
                )}

                <div className="flex items-center gap-3 text-sm">
                  <CalendarDays className="size-4 shrink-0 text-muted-foreground" />
                  <span>{formatDate(selectedComplaint.createdAt)}</span>
                </div>

                <div className="flex items-center gap-3 text-sm">
                  <Tag className="size-4 shrink-0 text-muted-foreground" />
                  <span>
                    {selectedComplaint.category?.name || "Uncategorized"}
                  </span>
                </div>
              </div>

              <div>
                <p className="mb-2 text-sm font-medium">
                  Description
                </p>

                <p className="whitespace-pre-wrap break-words text-sm leading-6 text-muted-foreground">
                  {selectedComplaint.description ||
                    "No description available."}
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Update complaint dialog */}
      <UpdateComplaintDialog
  complaint={complaintToUpdate}
  open={complaintToUpdate !== null}
  onOpenChange={(open) => {
    if (!open) setComplaintToUpdate(null);
  }}
  onUpdated={async () => {
    setComplaintToUpdate(null);
    await fetchComplaints();
  }}
/>

      {/* Delete confirmation dialog */}
      <DeleteAlertDialog
        open={complaintToDelete !== null}
        onOpenChange={(open) => {
          if (!open && !deleting) {
            setComplaintToDelete(null);
          }
        }}
        title="Delete complaint?"
        description={
          complaintToDelete
            ? `Are you sure you want to delete complaint #${complaintToDelete.id}, "${complaintToDelete.title}"? This action cannot be undone.`
            : "This action cannot be undone."
        }
        confirmText="Delete complaint"
        isDeleting={deleting}
        onConfirm={handleDelete}
      />
    </>
  );
}
