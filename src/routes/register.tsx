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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { AuthShell } from "@/components/auth/auth-shell";
import { registerSchema, type RegisterValues } from "@/lib/validation/auth";
import { loginAsDemoCandidate, register as registerAccount } from "@/lib/api/auth";
import { authStore } from "@/lib/auth-store";
import { ApiError } from "@/lib/http";

const TITLE = "Create your account — PlaceRight";
const DESCRIPTION =
  "Create a free account to check whether your UTME results qualify you for your chosen course at six federal universities in Southwest Nigeria.";

export const Route = createFileRoute("/register")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
    ],
  }),
  component: RegisterPage,
});

function RegisterPage() {
  const navigate = useNavigate();
  const form = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { fullName: "", email: "", phone: "", password: "" },
  });

  const createAccount = useMutation({
    mutationFn: (values: RegisterValues) => registerAccount(values),
    onSuccess: (session) => {
      authStore.setSession(session);
      toast.success("Account created. Let's set up your results.");
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

  const busy = createAccount.isPending || demo.isPending;

  return (
    <AuthShell
      title="Create your account"
      subtitle="It takes about a minute. You'll enter your UTME and O'Level results next — nothing is shared with JAMB or any university."
      footer={
        <>
          Already registered?{" "}
          <Link to="/login" className="font-medium text-primary underline-offset-4 hover:underline">
            Sign in instead
          </Link>
        </>
      }
    >
      <Form {...form}>
        <form
          className="space-y-5"
          onSubmit={form.handleSubmit((values) => createAccount.mutate(values))}
          noValidate
        >
          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full name</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    autoComplete="name"
                    placeholder="e.g. Adebayo Ogunlesi"
                    className="h-12"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
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
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone number</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    placeholder="08031234567"
                    className="h-12"
                  />
                </FormControl>
                <FormDescription>Nigerian numbers only — 0803… or +234803…</FormDescription>
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
                    autoComplete="new-password"
                    placeholder="At least 6 characters"
                    className="h-12"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="h-12 w-full text-base" disabled={busy}>
            {createAccount.isPending ? <Loader2 className="size-4 animate-spin" /> : null}
            Create account
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
    </AuthShell>
  );
}
