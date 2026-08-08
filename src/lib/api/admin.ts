import { http, mockDelay, USE_MOCKS } from "@/lib/http";
import { mockUniversities } from "@/mocks/universities";
import { mockCourses } from "@/mocks/courses";
import { mockCatchmentRules, mockRequirements, mockScoringPolicies } from "@/mocks/policies";
import { mockAdminLogs, mockAdminMetrics } from "@/mocks/candidates";
import type {
  AdminLogEntry,
  AdminMetrics,
  AdmissionRequirement,
  CatchmentRule,
  Course,
  ScoringPolicy,
  University,
} from "@/types/domain";

type Entity = "universities" | "courses" | "requirements" | "scoring-policies" | "catchment-rules";

const stores: Record<Entity, { id: string }[]> = {
  universities: [...mockUniversities],
  courses: [...mockCourses],
  requirements: [...mockRequirements],
  "scoring-policies": [...mockScoringPolicies],
  "catchment-rules": [...mockCatchmentRules],
};

function crud<T extends { id: string }>(entity: Entity) {
  return {
    list: async (): Promise<T[]> => {
      if (USE_MOCKS) return mockDelay(stores[entity] as T[]);
      return http.get<T[]>(`/admin/${entity}`);
    },
    create: async (payload: Omit<T, "id">): Promise<T> => {
      if (USE_MOCKS) {
        const created = { ...payload, id: `${entity}-${Date.now()}` } as T;
        stores[entity] = [created, ...stores[entity]];
        return mockDelay(created);
      }
      return http.post<T>(`/admin/${entity}`, payload);
    },
    update: async (id: string, payload: Partial<T>): Promise<T> => {
      if (USE_MOCKS) {
        let updated: T | undefined;
        stores[entity] = stores[entity].map((item) => {
          if (item.id !== id) return item;
          updated = { ...(item as T), ...payload };
          return updated;
        });
        return mockDelay(updated as T);
      }
      return http.patch<T>(`/admin/${entity}/${id}`, payload);
    },
    remove: async (id: string): Promise<{ id: string }> => {
      if (USE_MOCKS) {
        stores[entity] = stores[entity].filter((item) => item.id !== id);
        return mockDelay({ id });
      }
      return http.delete<{ id: string }>(`/admin/${entity}/${id}`);
    },
  };
}

export const adminUniversities = crud<University>("universities");
export const adminCourses = crud<Course>("courses");
export const adminRequirements = crud<AdmissionRequirement>("requirements");
export const adminScoringPolicies = crud<ScoringPolicy>("scoring-policies");
export const adminCatchmentRules = crud<CatchmentRule>("catchment-rules");

export async function getMetrics(): Promise<AdminMetrics> {
  if (USE_MOCKS) return mockDelay(mockAdminMetrics);
  return http.get<AdminMetrics>("/admin/metrics");
}

export async function getLogs(): Promise<AdminLogEntry[]> {
  if (USE_MOCKS) return mockDelay(mockAdminLogs);
  return http.get<AdminLogEntry[]>("/admin/logs");
}
