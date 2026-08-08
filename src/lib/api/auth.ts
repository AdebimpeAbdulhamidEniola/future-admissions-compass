import { http, mockDelay, mockFailure, USE_MOCKS } from "@/lib/http";
import { DEMO_EMAIL, FAILING_EMAIL, mockAdminSession, mockDemoSession } from "@/mocks/candidates";
import type { AuthSession, AuthUser, LoginPayload, RegisterPayload } from "@/types/domain";
import { authStore } from "@/lib/auth-store";

export async function register(payload: RegisterPayload): Promise<AuthSession> {
  if (USE_MOCKS) {
    if (payload.email.toLowerCase() === FAILING_EMAIL) {
      return mockFailure(409, "An account with this email already exists.", "Conflict");
    }
    return mockDelay<AuthSession>({
      accessToken: `mock.jwt.${payload.email}`,
      user: {
        id: `user-${payload.email}`,
        fullName: payload.fullName,
        email: payload.email,
        phone: payload.phone,
        role: "CANDIDATE",
      },
    });
  }
  return http.post<AuthSession>("/auth/register", payload);
}

export async function login(payload: LoginPayload): Promise<AuthSession> {
  if (USE_MOCKS) {
    const email = payload.email.toLowerCase();
    if (email === FAILING_EMAIL) {
      return mockFailure(401, "Incorrect email or password.", "Unauthorized");
    }
    if (email === mockAdminSession.user.email) return mockDelay(mockAdminSession);
    if (email === DEMO_EMAIL) return mockDelay(mockDemoSession);
    return mockDelay<AuthSession>({
      accessToken: `mock.jwt.${email}`,
      user: {
        id: `user-${email}`,
        fullName: email.split("@")[0] ?? "Candidate",
        email: payload.email,
        role: "CANDIDATE",
      },
    });
  }
  return http.post<AuthSession>("/auth/login", payload);
}

export async function me(): Promise<AuthUser> {
  if (USE_MOCKS) {
    const user = authStore.getUser();
    if (!user) return mockFailure(401, "You are not signed in.", "Unauthorized");
    return mockDelay(user);
  }
  return http.get<AuthUser>("/auth/me");
}

/** Signs in the pre-filled demo candidate (used for project defence walkthroughs). */
export async function loginAsDemoCandidate(): Promise<AuthSession> {
  return login({ email: DEMO_EMAIL, password: "demo-password" });
}

export function logout() {
  authStore.clear();
}
