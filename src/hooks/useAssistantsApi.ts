import { useCallback, useEffect, useState } from "react";
import { assistantsService } from "../services/api/assistantsService";
import type {
  AssistantsListParams,
  AssistantsListResponse,
  AssistantDetailResponse,
  CreateAssistantResponse,
  CreateAssistantErrorResponse,
  CreateAssistantFormInput
} from "../types/api/assistants";


export function useAssistants(initialParams: AssistantsListParams = {}) {
  const [params, setParams] = useState<AssistantsListParams>({
    page: 1,
    per_page: 24,
    sort_by: "name",
    sort_order: "asc",
    ...initialParams,
  });

  const [data, setData] = useState<AssistantsListResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await assistantsService.list(params);
      setData(res);
    } catch (e: any) {
      setError(e?.message ?? "Failed to load assistants");
    } finally {
      setLoading(false);
    }
  }, [params]);

  useEffect(() => {
    void load();
  }, [load]);

  const remove = useCallback(
    async (assistantId: number) => {
      await assistantsService.remove(assistantId);

      // If we deleted the last item on the page, go back one page when possible
      const itemsLeft = (data?.items?.length ?? 0) - 1;
      const canGoBack = (params.page ?? 1) > 1;

      if (itemsLeft <= 0 && canGoBack) {
        setParams((p) => ({ ...p, page: (p.page ?? 1) - 1 }));
        return;
      }

      await load();
    },
    [data?.items?.length, load, params.page],
  );

  return {
    params,
    setParams,
    data,
    assistants: data?.items ?? [],
    loading,
    error,
    reload: load,
    remove,
  };
}

export function useAssistantDetail(assistantId: number | null | undefined) {
  const [data, setData] = useState<AssistantDetailResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!assistantId) return;
    setLoading(true);
    setError(null);
    try {
      const res = await assistantsService.getById(assistantId);
      setData(res);
    } catch (e: any) {
      setError(e?.message ?? "Failed to load assistant");
    } finally {
      setLoading(false);
    }
  }, [assistantId]);

  useEffect(() => {
    void load();
  }, [load]);

  return {
    data,
    assistant: data?.assistant ?? null,
    recentCalls: data?.recent_calls ?? [],
    telephonyProvider: data?.telephony_provider ?? null,
    loading,
    error,
    reload: load,
  };
}

export function useSaveAssistant() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const save = useCallback(async (assistantId: number | null, input: CreateAssistantFormInput) => {
    setLoading(true);
    setError(null);

    try {
      if (!assistantId) {
        // create
        return await assistantsService.create(input);
      }

      // update
      await assistantsService.update(assistantId, input);
      return { success: true, assistant_id: assistantId };
    } catch (e: any) {
      setError(e?.message ?? "Failed to save assistant");
      throw e;
    } finally {
      setLoading(false);
    }
  }, []);

  return { save, loading, error, clearError: () => setError(null) };
}