import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Loader2, Pencil, Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { NIGERIA_STATES } from "@/components/assessment/constants";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { adminUniversities } from "@/lib/api/admin";
import { ApiError } from "@/lib/http";
import type { University } from "@/types/domain";

export const Route = createFileRoute("/admin/universities")({
  component: AdminUniversitiesRoute,
});

const universitySchema = z.object({
  code: z.string().trim().min(2, "Enter a code").max(10, "Keep it short").toUpperCase(),
  name: z.string().trim().min(2, "Enter a name"),
  locationState: z.string().min(1, "Select a state"),
});
type UniversityValues = z.infer<typeof universitySchema>;

function UniversityFormFields({
  control,
}: {
  control: ReturnType<typeof useForm<UniversityValues>>["control"];
}) {
  return (
    <>
      <FormField
        control={control}
        name="code"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Code</FormLabel>
            <FormControl>
              <Input {...field} placeholder="e.g. FUTAB" className="uppercase" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Name</FormLabel>
            <FormControl>
              <Input {...field} placeholder="e.g. Federal University of Technology, Babura" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="locationState"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Location state</FormLabel>
            <Select value={field.value} onValueChange={field.onChange}>
              <FormControl>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select state" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {NIGERIA_STATES.map((state) => (
                  <SelectItem key={state} value={state}>
                    {state}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
}

function UniversityFormDialog({
  university,
  trigger,
}: {
  university?: University;
  trigger: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const isEdit = !!university;

  const form = useForm<UniversityValues>({
    resolver: zodResolver(universitySchema),
    defaultValues: university
      ? { code: university.code, name: university.name, locationState: university.locationState }
      : { code: "", name: "", locationState: "" },
  });

  useEffect(() => {
    if (open) {
      form.reset(
        university
          ? {
              code: university.code,
              name: university.name,
              locationState: university.locationState,
            }
          : { code: "", name: "", locationState: "" },
      );
    }
  }, [open, university, form]);

  const mutation = useMutation({
    mutationFn: (values: UniversityValues) =>
      isEdit
        ? adminUniversities.update(university.id, values as Partial<University>)
        : adminUniversities.create(values as Omit<University, "id">),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "universities"] });
      toast.success(isEdit ? "University updated" : "University added");
      setOpen(false);
    },
    onError: (error) => {
      toast.error(error instanceof ApiError ? error.message : "Couldn't save. Try again.");
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit university" : "Add university"}</DialogTitle>
          <DialogDescription>
            {isEdit ? "Update this university's details." : "Add a new university to the catalog."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form className="space-y-4" onSubmit={form.handleSubmit((v) => mutation.mutate(v))}>
            <UniversityFormFields control={form.control} />
            <DialogFooter>
              <Button type="submit" disabled={mutation.isPending}>
                {mutation.isPending && <Loader2 className="size-4 animate-spin" />}
                Save
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

function DeleteUniversityButton({ university }: { university: University }) {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: () => adminUniversities.remove(university.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "universities"] });
      toast.success("University deleted");
    },
    onError: () => toast.error("Couldn't delete. Try again."),
  });

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="ghost" size="sm">
          <Trash2 className="size-3.5 text-ineligible" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete {university.name}?</AlertDialogTitle>
          <AlertDialogDescription>
            This removes the university from the catalog. Courses, requirements, scoring policies,
            and catchment rules referencing it will no longer resolve. This cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            className="bg-ineligible text-ineligible-foreground hover:bg-ineligible/90"
            onClick={() => mutation.mutate()}
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

function AdminUniversitiesRoute() {
  const query = useQuery({ queryKey: ["admin", "universities"], queryFn: adminUniversities.list });
  const universities = query.data ?? [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-semibold text-foreground">Universities</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {universities.length} in the catalog.
          </p>
        </div>
        <UniversityFormDialog
          trigger={
            <Button size="sm">
              <Plus className="size-4" />
              Add university
            </Button>
          }
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="sr-only">All universities</CardTitle>
        </CardHeader>
        <CardContent>
          {query.isPending ? (
            <Skeleton className="h-64 w-full" />
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Code</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>State</TableHead>
                    <TableHead className="w-24 text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {universities.map((u) => (
                    <TableRow key={u.id}>
                      <TableCell className="font-medium text-foreground">{u.code}</TableCell>
                      <TableCell>{u.name}</TableCell>
                      <TableCell className="text-muted-foreground">{u.locationState}</TableCell>
                      <TableCell className="text-right">
                        <UniversityFormDialog
                          university={u}
                          trigger={
                            <Button variant="ghost" size="sm">
                              <Pencil className="size-3.5" />
                            </Button>
                          }
                        />
                        <DeleteUniversityButton university={u} />
                      </TableCell>
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
