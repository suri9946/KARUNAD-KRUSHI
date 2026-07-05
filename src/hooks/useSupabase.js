import { useState, useEffect, useCallback } from 'react';

/**
 * Custom React hook for fetching and caching database query results.
 * Wraps fetching states (data, loading, error) and supports refetching.
 * Actively bridges local mock queries to future Supabase operations.
 * 
 * @param {Function} queryFn - Function that returns a Promise resolving to query data
 * @param {Array} deps - Dependency array to trigger refetching
 * @returns {Object} { data, loading, error, refetch }
 */
export default function useSupabase(queryFn, deps = []) {
  const [data, setData] = useState(undefined);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await queryFn();
      setData(result);
    } catch (err) {
      console.error('Database query error in useSupabase hook:', err);
      setError(err);
    } finally {
      setLoading(false);
    }
  }, deps);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}
