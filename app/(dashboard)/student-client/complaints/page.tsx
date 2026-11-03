
"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Search,
  RefreshCw,
  MoreHorizontal,
  Eye,
  Pencil,
  Trash2,
  ArrowUpDown,
  MessageSquareText,
  SlidersHorizontal,
} from "lucide-react";

import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import {
  UpdateComplaintDialog,
} from "@/components/complaints/update-complaint-dialog";
import type { EditableComplaint } from "@/types/complaints/types";

import {
  getMyComplaintsApi,
  deleteComplaintApi,
} from "@/lib/api";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

type Complaint = EditableComplaint & {
  id: number;
  title: string;
  description?: string;
  status: string;
  priority?: "low" | "medium" | "high" | "urgent";
  createdAt?: string;
  category?: {
    id?: number;
    name?: string;
    slug?: string;
  };
};

const statusStyles: Record<string, string> = {
  open: "border-blue-500/20 bg-blue-500/10 text-blue-600 dark:text-blue-400",
  in_progress:
    "border-amber-500/20 bg-amber-500/10 text-amber-600 dark:text-amber-400",
  resolved:
    "border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  rejected:
    "border-destructive/20 bg-destructive/10 text-destructive",
};

function formatStatus(status: string) {
  return status.replaceAll("_", " ").replace(/\b\w/g, (char) =>
    char.toUpperCase()
  );
}

function formatDate(date?: string) {
  if (!date) return "—";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) return "—";

  return parsedDate.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatPriority(priority?: string) {
  if (!priority) return "—";
  return priority.charAt(0).toUpperCase() + priority.slice(1);
}

export default function ComplaintsPage() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [selectedComplaint, setSelectedComplaint] =
    useState<Complaint | null>(null);
  const [viewOpen, setViewOpen] = useState(false);

  const [editingComplaint, setEditingComplaint] =
    useState<Complaint | null>(null);

  const [deletingComplaint, setDeletingComplaint] =
    useState<Complaint | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchComplaints = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) setRefreshing(true);
      else setLoading(true);

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
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchComplaints();
  }, [fetchComplaints]);

  const filteredComplaints = useMemo(() => {
    return complaints.filter((complaint) => {
      const query = search.toLowerCase();

      const matchesSearch =
        complaint.title.toLowerCase().includes(query) ||
        String(complaint.id).includes(query) ||
        (complaint.category?.name ?? "").toLowerCase().includes(query);

      const matchesStatus =
        statusFilter === "all" ||
        complaint.status.toLowerCase() === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [complaints, search, statusFilter]);

  const handleDelete = async () => {
    if (!deletingComplaint) return;

    try {
      setDeleteLoading(true);
      await deleteComplaintApi(deletingComplaint.id);

      setComplaints((current) =>
        current.filter((item) => item.id !== deletingComplaint.id)
      );

      setDeletingComplaint(null);
    } catch (error) {
      console.error("Failed to delete complaint:", error);
    } finally {
      setDeleteLoading(false);
    }
  };

  const canEdit = (status: string) =>
    ["open", "rejected"].includes(status.toLowerCase());

  return (
    <DashboardLayout>
      <div className="mx-auto w-full space-y-6">
        {/* Page heading */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MessageSquareText className="size-4" />
              <span>Workspace</span>
              <span>/</span>
              <span className="text-foreground">Complaints</span>
            </div>

            <h1 className="text-2xl font-semibold tracking-tight">
              My Complaints
            </h1>

            <p className="text-sm text-muted-foreground">
              View and manage all the complaints you have submitted.
            </p>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => fetchComplaints(true)}
            disabled={refreshing}
            className="w-fit gap-2"
          >
            <RefreshCw
              className={`size-4 shrink-0 ${refreshing ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
        </div>

        <Separator />

        {/* Table section */}
        <div className="overflow-hidden rounded-xl border bg-card">
          {/* Toolbar */}
          <div className="flex flex-col gap-3 border-b p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-semibold">All complaints</h2>
              <Badge variant="secondary" className="rounded-md font-medium">
                {filteredComplaints.length}
              </Badge>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <div className="relative w-full sm:w-[260px]">
                <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search complaints..."
                  className="h-9 pl-9"
                />
              </div>

              <Select
                value={statusFilter}
                //@ts-ignore
                onValueChange={setStatusFilter}
              >
                <SelectTrigger className="h-9 w-full gap-2 sm:w-[160px]">
                  <SlidersHorizontal className="size-4 shrink-0 text-muted-foreground" />
                  <SelectValue placeholder="Filter status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All statuses</SelectItem>
                  <SelectItem value="open">Open</SelectItem>
                  <SelectItem value="in_progress">In progress</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Table */}
          <div className="w-full overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/40 hover:bg-muted/40">
                  <TableHead className="w-[90px] px-5">ID</TableHead>
                  <TableHead className="min-w-[240px] px-5">
                    Complaint
                  </TableHead>
                  <TableHead className="min-w-[150px] px-5">
                    Category
                  </TableHead>
                  <TableHead className="min-w-[110px] px-5">
                    Priority
                  </TableHead>
                  <TableHead className="min-w-[130px] px-5">
                    Status
                  </TableHead>
                  <TableHead className="min-w-[130px] px-5">
                    Created
                  </TableHead>
                  <TableHead className="w-[70px] px-5 text-right">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-40 text-center">
                      <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                        <RefreshCw className="size-4 animate-spin" />
                        Loading complaints...
                      </div>
                    </TableCell>
                  </TableRow>
                ) : filteredComplaints.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-52">
                      <div className="flex flex-col items-center justify-center gap-2 text-center">
                        <div className="flex size-11 items-center justify-center rounded-full bg-muted">
                          <MessageSquareText className="size-5 text-muted-foreground" />
                        </div>
                        <p className="text-sm font-medium">
                          No complaints found
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {search || statusFilter !== "all"
                            ? "Try changing your search or filters."
                            : "Your submitted complaints will appear here."}
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredComplaints.map((complaint) => (
                    <TableRow
                      key={complaint.id}
                      className="group transition-colors"
                    >
                      <TableCell className="px-5 py-4">
                        <span className="font-mono text-xs text-muted-foreground">
                          #{complaint.id}
                        </span>
                      </TableCell>

                      <TableCell className="px-5 py-4">
                        <div className="max-w-[360px] space-y-1">
                          <p className="truncate text-sm font-medium">
                            {complaint.title}
                          </p>
                          <p className="truncate text-xs text-muted-foreground">
                            {complaint.location || "No location provided"}
                          </p>
                        </div>
                      </TableCell>

                      <TableCell className="px-5 py-4">
                        <span className="text-sm text-muted-foreground">
                          {complaint.category?.name || "Uncategorized"}
                        </span>
                      </TableCell>

                      <TableCell className="px-5 py-4">
                        <span className="text-sm">
                          {formatPriority(complaint.priority)}
                        </span>
                      </TableCell>

                      <TableCell className="px-5 py-4">
                        <Badge
                          variant="outline"
                          className={`rounded-md font-medium ${
                            statusStyles[complaint.status.toLowerCase()] ??
                            "border-border bg-muted text-muted-foreground"
                          }`}
                        >
                          <span className="mr-1.5 size-1.5 rounded-full bg-current" />
                          {formatStatus(complaint.status)}
                        </Badge>
                      </TableCell>

                      <TableCell className="px-5 py-4 text-sm text-muted-foreground">
                        {formatDate(complaint.createdAt)}
                      </TableCell>

                      <TableCell className="px-5 py-4 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger
                            className="inline-flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                            aria-label={`Actions for complaint ${complaint.id}`}
                          >
                            <MoreHorizontal className="size-4" />
                          </DropdownMenuTrigger>

                          <DropdownMenuContent align="end" className="w-44">
                            <DropdownMenuItem
                              onClick={() => {
                                setSelectedComplaint(complaint);
                                setViewOpen(true);
                              }}
                              className="gap-2"
                            >
                              <Eye className="size-4 shrink-0" />
                              <span>View details</span>
                            </DropdownMenuItem>

                            <DropdownMenuItem
                              disabled={!canEdit(complaint.status)}
                              onClick={() => setEditingComplaint(complaint)}
                              className="gap-2"
                            >
                              <Pencil className="size-4 shrink-0" />
                              <span>Update complaint</span>
                            </DropdownMenuItem>

                            <DropdownMenuSeparator />

                            <DropdownMenuItem
                              variant="destructive"
                              onClick={() => setDeletingComplaint(complaint)}
                              className="gap-2"
                            >
                              <Trash2 className="size-4 shrink-0" />
                              <span>Delete complaint</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Table footer */}
          {!loading && filteredComplaints.length > 0 && (
            <div className="flex flex-col gap-2 border-t px-4 py-3 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
              <span>
                Showing{" "}
                <span className="font-medium text-foreground">
                  {filteredComplaints.length}
                </span>{" "}
                of{" "}
                <span className="font-medium text-foreground">
                  {complaints.length}
                </span>{" "}
                complaints
              </span>

              {(search || statusFilter !== "all") && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 w-fit px-2 text-xs"
                  onClick={() => {
                    setSearch("");
                    setStatusFilter("all");
                  }}
                >
                  Clear filters
                </Button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* View complaint dialog */}
      <Dialog open={viewOpen} onOpenChange={setViewOpen}>
        <DialogContent className="sm:max-w-[520px]">
          <DialogHeader>
            <DialogTitle>Complaint details</DialogTitle>
            <DialogDescription>
              Review the information submitted with this complaint.
            </DialogDescription>
          </DialogHeader>

          {selectedComplaint && (
            <div className="space-y-4">
              <div>
                <p className="text-xs text-muted-foreground">
                  Complaint #{selectedComplaint.id}
                </p>
                <h3 className="mt-1 text-base font-semibold">
                  {selectedComplaint.title}
                </h3>
              </div>

              <Separator />

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Category</p>
                  <p className="text-sm font-medium">
                    {selectedComplaint.category?.name || "Uncategorized"}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Priority</p>
                  <p className="text-sm font-medium">
                    {formatPriority(selectedComplaint.priority)}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Status</p>
                  <p className="text-sm font-medium">
                    {formatStatus(selectedComplaint.status)}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Created</p>
                  <p className="text-sm font-medium">
                    {formatDate(selectedComplaint.createdAt)}
                  </p>
                </div>
              </div>

              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Location</p>
                <p className="text-sm font-medium">
                  {selectedComplaint.location || "Not provided"}
                </p>
              </div>

              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Description</p>
                <p className="whitespace-pre-wrap text-sm leading-6 text-muted-foreground">
                  {selectedComplaint.description || "No description provided."}
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Update complaint dialog */}
      {editingComplaint && (
        <UpdateComplaintDialog
          complaint={editingComplaint}
          open={!!editingComplaint}
          onOpenChange={(open) => {
            if (!open) setEditingComplaint(null);
          }}
          onUpdated={() => {
            setEditingComplaint(null);
            fetchComplaints(true);
          }}
        />
      )}

      {/* Delete confirmation */}
      <AlertDialog
        open={!!deletingComplaint}
        onOpenChange={(open) => {
          if (!open && !deleteLoading) setDeletingComplaint(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete complaint?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This complaint will be permanently
              deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteLoading}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleteLoading}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteLoading ? "Deleting..." : "Delete complaint"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  );
}
