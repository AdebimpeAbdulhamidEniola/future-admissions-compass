import { http, mockDelay, USE_MOCKS } from "@/lib/http";
import { mockUniversities } from "@/mocks/universities";
import { mockCourses } from "@/mocks/courses";
import { mockCatchmentRules, mockRequirements, mockScoringPolicies } from "@/mocks/policies";
import { mockAdminLogs, mockAdminMetrics } from "@/mocks/candidates";
import { mockEvaluationEvents } from "@/mocks/evaluation";
import type {
  AdminLogEntry,
  AdminMetrics,
  AdmissionRequirement,
  CatchmentRule,
  Course,
  EvaluationEvent,
  EvaluationModule,
  EvaluationOutcome,
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

export interface EvaluationEventFilters {
  module?: EvaluationModule;
  outcome?: EvaluationOutcome;
  dateFrom?: string;
  dateTo?: string;
  page: number;
  pageSize: number;
}

export interface EvaluationEventPage {
  items: EvaluationEvent[];
  total: number;
}

export async function listEvaluationEvents(
  filters: EvaluationEventFilters,
): Promise<EvaluationEventPage> {
  if (USE_MOCKS) {
    const filtered = mockEvaluationEvents.filter((e) => {
      if (filters.module && e.module !== filters.module) return false;
      if (filters.outcome && e.outcome !== filters.outcome) return false;
      if (filters.dateFrom && e.timestamp < filters.dateFrom) return false;
      if (filters.dateTo && e.timestamp > filters.dateTo) return false;
      return true;
    });
    const start = (filters.page - 1) * filters.pageSize;
    const items = filtered.slice(start, start + filters.pageSize);
    return mockDelay({ items, total: filtered.length });
  }
  const params = new URLSearchParams();
  if (filters.module) params.set("module", filters.module);
  if (filters.outcome) params.set("outcome", filters.outcome);
  if (filters.dateFrom) params.set("dateFrom", filters.dateFrom);
  if (filters.dateTo) params.set("dateTo", filters.dateTo);
  params.set("page", String(filters.page));
  params.set("pageSize", String(filters.pageSize));
  return http.get<EvaluationEventPage>(`/admin/evaluation-events?${params.toString()}`);
}
