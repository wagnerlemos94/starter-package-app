import { useCallback, useEffect, useRef, useState } from 'react';
import { usePermission } from '@/auth/usePermission';
import { RESOURCE } from '@/auth/resources';
import { IDashboardResponse, useApiDashboard } from '@/hooks/api/dashboard/useApiDashboard';
import { ApiResult } from '@/services/api';

export default function useDashboard() {
  const { hasPermission, isLoading, isAuthenticated } = usePermission();
  const allowed = isAuthenticated && hasPermission(RESOURCE.DASHBOARD, 'VIEW');
  const { list } = useApiDashboard();
  const [items, setItems] = useState<IDashboardResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatedAt, setUpdatedAt] = useState<Date | null>(null);
  const requestId = useRef(0);

  const receive = useCallback((response: ApiResult<IDashboardResponse[]>, current: number) => {
    if (current !== requestId.current) return;
    if (response.success) {
      setItems(response.data);
      setUpdatedAt(new Date());
      setError(null);
    } else setError(response.message);
    setLoading(false);
  }, []);

  const fail = useCallback((current: number) => {
    if (current !== requestId.current) return;
    setError('Não foi possível carregar o dashboard. Tente novamente.');
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!allowed) return;
    const current = ++requestId.current;
    void list().then((response) => receive(response, current)).catch(() => fail(current));
    return () => { requestId.current += 1; };
  }, [allowed, list, receive, fail]);

  const refresh = async () => {
    if (!allowed) return;
    const current = ++requestId.current;
    setLoading(true);
    setError(null);
    try { receive(await list(), current); }
    catch { fail(current); }
  };

  const totals = items.reduce((sum, item) => ({
    total: sum.total + item.total,
    ativos: sum.ativos + item.ativos,
    inativos: sum.inativos + item.inativos,
  }), { total: 0, ativos: 0, inativos: 0 });

  return { items: allowed ? items : [], totals, loading: allowed && loading, error, updatedAt, allowed, isLoading, refresh, hasPermission };
}
