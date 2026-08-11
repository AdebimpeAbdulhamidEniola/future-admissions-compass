import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { Loader2, UserRound } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { AuthShell } from "@/components/auth/auth-shell";
import { loginSchema, type LoginValues } from "@/lib/validation/auth";
import { login, loginAsDemoCandidate } from "@/lib/api/auth";
import { authStore } from "@/lib/auth-store";
import { ApiError } from "@/lib/http";

const TITLE = "Sign in — PlaceRight admission guidance";
const DESCRIPTION =
  "Sign in to check your UTME eligibility, aggregate score, catchment status and course alternatives.";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const signIn = useMutation({
    mutationFn: (values: LoginValues) => login(values),
    onSuccess: (session) => {
      authStore.setSession(session);
      toast.success(`Welcome back, ${session.user.fullName.split(" ")[0]}`);
      void navigate({ to: "/onboarding" });
    },
    onError: (error) => {
      toast.error(error instanceof ApiError ? error.message : "Something went wrong. Try again.");
    },
  });

  const demo = useMutation({
    mutationFn: loginAsDemoCandidate,
    onSuccess: (session) => {
      authStore.setSession(session);
      toast.success("Signed in as the demo candidate");
      void navigate({ to: "/onboarding" });
    },
    onError: () => toast.error("The demo account could not be loaded. Try again."),
  });

  const busy = signIn.isPending || demo.isPending;

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Sign in to pick up where you left off. Your results and saved assessments stay with your account."
      footer={
        <>
          New here?{" "}
          <Link
            to="/register"
            className="font-medium text-primary underline-offset-4 hover:underline"
          >
            Create an account
          </Link>
        </>
      }
    >
      <Form {...form}>
        <form
          className="space-y-5"
          onSubmit={form.handleSubmit((values) => signIn.mutate(values))}
          noValidate
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email address</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    className="h-12"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="password"
                    autoComplete="current-password"
                    placeholder="••••••••"
                    className="h-12"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="h-12 w-full text-base" disabled={busy}>
            {signIn.isPending ? <Loader2 className="size-4 animate-spin" /> : null}
            Sign in
          </Button>
        </form>
      </Form>

      <div className="my-6 flex items-center gap-3 text-xs text-muted-foreground">
        <span className="h-px flex-1 bg-border" />
        or
        <span className="h-px flex-1 bg-border" />
      </div>

      <Button
        type="button"
        variant="outline"
        className="h-12 w-full text-base"
        disabled={busy}
        onClick={() => demo.mutate()}
      >
        {demo.isPending ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          <UserRound className="size-4" />
        )}
        Continue as demo candidate
      </Button>
      <p className="mt-2 text-xs text-muted-foreground">
        Opens a pre-filled profile (Adebayo Ogunlesi, UTME 286, University of Ibadan) so you can
        walk through the whole system without typing results.
      </p>
    </AuthShell>
  );
}
