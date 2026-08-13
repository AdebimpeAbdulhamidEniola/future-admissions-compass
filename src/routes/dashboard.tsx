import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  AlertTriangle,
  CheckCircle2,
  ClipboardList,
  Loader2,
  Pencil,
  Sparkles,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { RequireAuth } from "@/components/auth/guards";
import {
  COMPULSORY_UTME_SUBJECT,
  NIGERIA_STATES,
  UTME_ELECTIVE_SUBJECTS,
} from "@/components/assessment/constants";
import { DisclaimerCallout } from "@/components/layout/disclaimer-callout";
import { SiteHeader } from "@/components/layout/site-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAuth } from "@/hooks/use-auth";
import { listAssessments } from "@/lib/api/assessments";
import { getMyProfile, updateMyProfile } from "@/lib/api/candidates";
import { ApiError } from "@/lib/http";
import { cn } from "@/lib/utils";
import type { AssessmentReport, CandidateProfile, CatchmentStatus } from "@/types/domain";

const TITLE = "Your dashboard — PlaceRight";

export const Route = createFileRoute("/dashboard")({
  head: () => ({ meta: [{ title: TITLE }] }),
  component: DashboardRoute,
});

const CATCHMENT_LABEL: Record<CatchmentStatus, string> = {
  MERIT: "Merit",
  CATCHMENT: "Catchment area",
  ELDS: "ELDS",
};

function verdictBadge(report: AssessmentReport) {
  if (!report.verification.eligible) {
    return <Badge variant="ineligible">Not eligible</Badge>;
  }
  if (report.score && !report.score.meetsCutOff) {
    return <Badge variant="caution">Below cut-off</Badge>;
  }
  return <Badge variant="success">Eligible</Badge>;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function DashboardRoute() {
  return (
    <RequireAuth>
      <Dashboard />
    </RequireAuth>
  );
}

function Dashboard() {
  const { user } = useAuth();
  const [editOpen, setEditOpen] = useState(false);

  const profileQuery = useQuery({ queryKey: ["myProfile"], queryFn: getMyProfile, retry: false });
  const assessmentsQuery = useQuery({ queryKey: ["assessments"], queryFn: listAssessments });

  const myAssessments = (assessmentsQuery.data ?? [])
    .filter((r) => r.candidateId === user?.id)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  const mostRecent = myAssessments[0];

  const profile = profileQuery.data;
  const hasProfile = !profileQuery.isError && !!profile;

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <main className="mx-auto w-full max-w-5xl space-y-8 px-4 py-10 sm:py-14">
        <div>
          <h1 className="font-display text-3xl font-semibold text-foreground sm:text-4xl">
            Welcome back, {user?.fullName.split(" ")[0]}
          </h1>
          <p className="mt-2 text-muted-foreground">
            Your profile, your most recent result, and everything you've assessed so far.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            {myAssessments.length === 0 ? (
              <EmptyStateCard />
            ) : (
              mostRecent && <RecentAssessmentCard report={mostRecent} />
            )}

            <PastAssessmentsTable
              assessments={myAssessments}
              isLoading={assessmentsQuery.isPending}
            />
          </div>

          <div className="space-y-6">
            <ProfileSummaryCard
              profile={profile}
              isLoading={profileQuery.isPending}
              hasProfile={hasProfile}
              onEdit={() => setEditOpen(true)}
            />
            <ReadinessPanel profile={profile} onEditProfile={() => setEditOpen(true)} />
          </div>
        </div>

        <DisclaimerCallout />
      </main>

      {profile && <EditProfileSheet profile={profile} open={editOpen} onOpenChange={setEditOpen} />}
    </div>
  );
}

function EmptyStateCard() {
  return (
    <Card className="border-dashed border-border p-8 text-center">
      <ClipboardList className="mx-auto size-8 text-muted-foreground" />
      <h2 className="mt-4 font-display text-lg font-semibold text-foreground">
        You haven't run an assessment yet
      </h2>
      <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
        Enter your UTME score, subjects, and O'Level grades once and see your eligibility, real
        aggregate score, and catchment status for any course.
      </p>
      <Button className="mt-5" asChild>
        <Link to="/assessment/new">
          <Sparkles className="size-4" />
          Start your first assessment
        </Link>
      </Button>
    </Card>
  );
}

function RecentAssessmentCard({ report }: { report: AssessmentReport }) {
  return (
    <Card className="p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Most recent assessment
          </p>
          <h2 className="mt-1 font-display text-lg font-semibold text-foreground">
            {report.context.courseName}
          </h2>
          <p className="text-sm text-muted-foreground">
            {report.context.universityName} ({report.context.universityCode}) ·{" "}
            {formatDate(report.createdAt)}
          </p>
        </div>
        {verdictBadge(report)}
      </div>

      <div className="mt-4 flex items-center gap-6">
        <div>
          <p className="text-xs text-muted-foreground">Aggregate</p>
          <p className="text-numeral text-3xl font-semibold text-foreground">
            {report.score ? report.score.aggregate.toFixed(1) : "—"}
          </p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Catchment status</p>
          <p className="font-medium text-foreground">{CATCHMENT_LABEL[report.catchment.status]}</p>
        </div>
      </div>

      <Button variant="outline" size="sm" className="mt-4" asChild>
        <Link to="/assessment/$id" params={{ id: report.id }}>
          View full report
        </Link>
      </Button>
    </Card>
  );
}

function PastAssessmentsTable({
  assessments,
  isLoading,
}: {
  assessments: AssessmentReport[];
  isLoading: boolean;
}) {
  if (isLoading) {
    return <Skeleton className="h-48 w-full rounded-xl" />;
  }
  if (assessments.length === 0) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-display text-lg">All your assessments</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>University</TableHead>
                <TableHead>Course</TableHead>
                <TableHead>Verdict</TableHead>
                <TableHead className="text-right">Aggregate</TableHead>
                <TableHead className="w-10">
                  <span className="sr-only">View</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {assessments.map((report) => (
                <TableRow key={report.id}>
                  <TableCell className="text-muted-foreground">
                    {formatDate(report.createdAt)}
                  </TableCell>
                  <TableCell>{report.context.universityCode}</TableCell>
                  <TableCell className="font-medium text-foreground">
                    {report.context.courseName}
                  </TableCell>
                  <TableCell>{verdictBadge(report)}</TableCell>
                  <TableCell className="text-numeral text-right">
                    {report.score ? report.score.aggregate.toFixed(1) : "—"}
                  </TableCell>
                  <TableCell>
                    <Link
                      to="/assessment/$id"
                      params={{ id: report.id }}
                      className="text-sm font-medium text-primary hover:underline"
                    >
                      View
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}

function ProfileSummaryCard({
  profile,
  isLoading,
  hasProfile,
  onEdit,
}: {
  profile: CandidateProfile | undefined;
  isLoading: boolean;
  hasProfile: boolean;
  onEdit: () => void;
}) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="font-display text-lg">Your profile</CardTitle>
          {hasProfile && (
            <Button variant="ghost" size="sm" onClick={onEdit}>
              <Pencil className="size-3.5" />
              Edit
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        ) : !hasProfile || !profile ? (
          <p className="text-sm text-muted-foreground">
            No profile on file yet.{" "}
            <Link to="/assessment/new" className="text-primary underline">
              Start an assessment
            </Link>{" "}
            to create one.
          </p>
        ) : (
          <dl className="space-y-3 text-sm">
            <div className="flex justify-between gap-3">
              <dt className="text-muted-foreground">Name</dt>
              <dd className="font-medium text-foreground">{profile.fullName}</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-muted-foreground">Email</dt>
              <dd className="text-foreground">{profile.email}</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-muted-foreground">State of origin</dt>
              <dd className="text-foreground">{profile.stateOfOrigin}</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-muted-foreground">LGA</dt>
              <dd className="text-foreground">{profile.lga}</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-muted-foreground">UTME score</dt>
              <dd className="text-numeral font-medium text-foreground">{profile.utmeScore}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">UTME subjects</dt>
              <dd className="mt-1 text-foreground">{profile.utmeSubjects.join(", ")}</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-muted-foreground">Post-UTME score</dt>
              <dd className="text-numeral font-medium text-foreground">
                {profile.postUtmeScore ?? "Not recorded"}
              </dd>
            </div>
          </dl>
        )}
      </CardContent>
    </Card>
  );
}

type ReadinessAction = { kind: "edit-profile" } | { kind: "new-assessment" };
type ReadinessItem = { id: string; label: string; met: boolean; action: ReadinessAction };

function getReadinessItems(profile: CandidateProfile): ReadinessItem[] {
  const electiveCount = profile.utmeSubjects.filter((s) => s !== COMPULSORY_UTME_SUBJECT).length;
  return [
    {
      id: "utme-score",
      label: "UTME score on file",
      met: profile.utmeScore > 0,
      action: { kind: "edit-profile" },
    },
    {
      id: "utme-subjects",
      label: "Three UTME elective subjects on file",
      met: electiveCount >= 3,
      action: { kind: "edit-profile" },
    },
    {
      id: "olevel",
      label: "O'Level results on file",
      met: profile.oLevelResults.length > 0,
      action: { kind: "new-assessment" },
    },
    {
      id: "post-utme",
      label: "Post-UTME score recorded (needed for a full aggregate)",
      met: profile.postUtmeScore !== null,
      action: { kind: "edit-profile" },
    },
    {
      id: "target",
      label: "Target university and course selected",
      met: !!profile.targetUniversityId && !!profile.targetCourseId,
      action: { kind: "new-assessment" },
    },
  ];
}

function ReadinessPanel({
  profile,
  onEditProfile,
}: {
  profile: CandidateProfile | undefined;
  onEditProfile: () => void;
}) {
  if (!profile) return null;
  const items = getReadinessItems(profile);
  const outstanding = items.filter((i) => !i.met);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-display text-lg">Assessment readiness</CardTitle>
      </CardHeader>
      <CardContent>
        {outstanding.length === 0 ? (
          <p className="flex items-center gap-2 text-sm text-success">
            <CheckCircle2 className="size-4" />
            Everything's on file — you're ready for a full assessment.
          </p>
        ) : (
          <ul className="space-y-3">
            {items.map((item) => (
              <li key={item.id} className="flex items-start justify-between gap-3 text-sm">
                <span
                  className={cn(
                    "flex items-start gap-2",
                    item.met ? "text-muted-foreground" : "text-foreground",
                  )}
                >
                  {item.met ? (
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-success" />
                  ) : (
                    <AlertTriangle className="mt-0.5 size-4 shrink-0 text-caution" />
                  )}
                  {item.label}
                </span>
                {!item.met &&
                  (item.action.kind === "edit-profile" ? (
                    <Button
                      variant="link"
                      size="sm"
                      className="h-auto shrink-0 p-0"
                      onClick={onEditProfile}
                    >
                      Update
                    </Button>
                  ) : (
                    <Link
                      to="/assessment/new"
                      className="shrink-0 text-sm font-medium text-primary hover:underline"
                    >
                      Update
                    </Link>
                  ))}
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}

const editProfileSchema = z
  .object({
    fullName: z.string().trim().min(2, "Enter your full name"),
    stateOfOrigin: z.string().min(1, "Select a state"),
    lga: z.string().trim().min(2, "Enter your LGA"),
    schoolLocationState: z.string().min(1, "Select a state"),
    utmeScore: z
      .number()
      .finite("Enter your UTME score")
      .int("Score must be a whole number")
      .min(0, "Score cannot be negative")
      .max(400, "Score cannot exceed 400"),
    utmeElective1: z.string().min(1, "Select a subject"),
    utmeElective2: z.string().min(1, "Select a subject"),
    utmeElective3: z.string().min(1, "Select a subject"),
    postUtmeScore: z.number().finite().min(0).max(100).nullable(),
  })
  .superRefine((values, ctx) => {
    const electives = [values.utmeElective1, values.utmeElective2, values.utmeElective3];
    if (new Set(electives).size !== electives.length) {
      ctx.addIssue({
        code: "custom",
        message: "Choose three different subjects",
        path: ["utmeElective2"],
      });
    }
  });

type EditProfileValues = z.infer<typeof editProfileSchema>;

function toFormValues(profile: CandidateProfile): EditProfileValues {
  const [, ...electives] = profile.utmeSubjects;
  return {
    fullName: profile.fullName,
    stateOfOrigin: profile.stateOfOrigin,
    lga: profile.lga,
    schoolLocationState: profile.schoolLocationState,
    utmeScore: profile.utmeScore,
    utmeElective1: electives[0] ?? "",
    utmeElective2: electives[1] ?? "",
    utmeElective3: electives[2] ?? "",
    postUtmeScore: profile.postUtmeScore,
  };
}

function EditProfileSheet({
  profile,
  open,
  onOpenChange,
}: {
  profile: CandidateProfile;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const queryClient = useQueryClient();
  const form = useForm<EditProfileValues>({
    resolver: zodResolver(editProfileSchema),
    defaultValues: toFormValues(profile),
  });

  useEffect(() => {
    if (open) form.reset(toFormValues(profile));
  }, [open, profile, form]);

  const mutation = useMutation({
    mutationFn: (values: EditProfileValues) =>
      updateMyProfile({
        fullName: values.fullName,
        stateOfOrigin: values.stateOfOrigin,
        lga: values.lga,
        schoolLocationState: values.schoolLocationState,
        utmeScore: values.utmeScore,
        utmeSubjects: [
          COMPULSORY_UTME_SUBJECT,
          values.utmeElective1,
          values.utmeElective2,
          values.utmeElective3,
        ],
        postUtmeScore: values.postUtmeScore,
      }),
    onSuccess: (updated) => {
      queryClient.setQueryData(["myProfile"], updated);
      toast.success("Profile updated");
      onOpenChange(false);
    },
    onError: (error) => {
      toast.error(
        error instanceof ApiError ? error.message : "Couldn't update your profile. Try again.",
      );
    },
  });

  const electiveValues = form.watch(["utmeElective1", "utmeElective2", "utmeElective3"]);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full overflow-y-auto sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Edit your profile</SheetTitle>
          <SheetDescription>
            This updates what's on file. Your O'Level results and target course are set per
            assessment via the wizard.
          </SheetDescription>
        </SheetHeader>

        <Form {...form}>
          <form
            className="mt-6 space-y-5"
            onSubmit={form.handleSubmit((values) => mutation.mutate(values))}
          >
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="stateOfOrigin"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>State of origin</FormLabel>
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

            <FormField
              control={form.control}
              name="lga"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>LGA</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="schoolLocationState"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>State where your secondary school was located</FormLabel>
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

            <FormField
              control={form.control}
              name="utmeScore"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>UTME score</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={0}
                      max={400}
                      value={Number.isNaN(field.value) ? "" : field.value}
                      onChange={(event) => field.onChange(event.target.valueAsNumber)}
                      onBlur={field.onBlur}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div>
              <p className="mb-2 text-sm font-medium text-foreground">UTME elective subjects</p>
              <div className="space-y-2">
                {(["utmeElective1", "utmeElective2", "utmeElective3"] as const).map(
                  (name, index) => (
                    <FormField
                      key={name}
                      control={form.control}
                      name={name}
                      render={({ field }) => {
                        const otherValues = electiveValues.filter((_, i) => i !== index);
                        return (
                          <FormItem>
                            <Select value={field.value} onValueChange={field.onChange}>
                              <FormControl>
                                <SelectTrigger className="w-full">
                                  <SelectValue placeholder={`Subject ${index + 2}`} />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {UTME_ELECTIVE_SUBJECTS.map((subject) => (
                                  <SelectItem
                                    key={subject}
                                    value={subject}
                                    disabled={otherValues.includes(subject)}
                                  >
                                    {subject}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        );
                      }}
                    />
                  ),
                )}
              </div>
            </div>

            <FormField
              control={form.control}
              name="postUtmeScore"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Post-UTME score (optional)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={0}
                      max={100}
                      placeholder="0–100"
                      value={field.value === null || Number.isNaN(field.value) ? "" : field.value}
                      onChange={(event) => {
                        const raw = event.target.value;
                        field.onChange(raw === "" ? null : event.target.valueAsNumber);
                      }}
                      onBlur={field.onBlur}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <SheetFooter>
              <Button type="submit" disabled={mutation.isPending}>
                {mutation.isPending && <Loader2 className="size-4 animate-spin" />}
                Save changes
              </Button>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
