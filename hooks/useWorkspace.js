"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createGeneration, fetchGeneration } from "@/lib/api";
import { toHistoryEntry } from "@/lib/history";

const byDate = (a, b) => new Date(a.createdAt) - new Date(b.createdAt);

/**
 * Owns the data side of the workspace: loaded generations, in-flight
 * (pending) requests, and the history strip. UI state lives in the components.
 */
export function useWorkspace({ initialGenerations, initialHistory, onComplete, onError }) {
  const [generations, setGenerations] = useState(() => [...initialGenerations].sort(byDate));
  const [history, setHistory] = useState(initialHistory);
  const [pending, setPending] = useState([]);
  const [loadingHistoryId, setLoadingHistoryId] = useState(null);

  const controllers = useRef(new Map());
  const params = useRef(new Map());
  const generationsRef = useRef(generations);
  const callbacks = useRef({ onComplete, onError });

  useEffect(() => {
    generationsRef.current = generations;
  }, [generations]);

  useEffect(() => {
    callbacks.current = { onComplete, onError };
  }, [onComplete, onError]);

  const run = useCallback(async (tempId) => {
    const controller = new AbortController();
    controllers.current.set(tempId, controller);

    try {
      const generation = await createGeneration(params.current.get(tempId), {
        signal: controller.signal,
      });
      setPending((items) => items.filter((item) => item.tempId !== tempId));
      setGenerations((items) => [...items, generation].sort(byDate));
      setHistory((items) => [{ ...toHistoryEntry(generation), fresh: true }, ...items]);
      params.current.delete(tempId);
      callbacks.current.onComplete?.(generation);
    } catch (error) {
      if (error.name === "AbortError") {
        setPending((items) => items.filter((item) => item.tempId !== tempId));
        params.current.delete(tempId);
        return;
      }
      setPending((items) =>
        items.map((item) =>
          item.tempId === tempId ? { ...item, status: "error", error: error.message } : item,
        ),
      );
    } finally {
      controllers.current.delete(tempId);
    }
  }, []);

  const generate = useCallback(
    (request) => {
      const tempId = `pending-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
      params.current.set(tempId, request);
      setPending((items) => [...items, { tempId, request, status: "loading", error: null }]);
      run(tempId);
      return tempId;
    },
    [run],
  );

  const retry = useCallback(
    (tempId) => {
      setPending((items) =>
        items.map((item) =>
          item.tempId === tempId ? { ...item, status: "loading", error: null } : item,
        ),
      );
      run(tempId);
    },
    [run],
  );

  const cancel = useCallback((tempId) => {
    controllers.current.get(tempId)?.abort();
  }, []);

  const dismiss = useCallback((tempId) => {
    params.current.delete(tempId);
    setPending((items) => items.filter((item) => item.tempId !== tempId));
  }, []);

  /** Makes sure a generation is in the feed (fetching it if needed). */
  const ensureGeneration = useCallback(async (id) => {
    if (generationsRef.current.some((g) => g.id === id)) return true;

    setLoadingHistoryId(id);
    try {
      const generation = await fetchGeneration(id);
      setGenerations((items) =>
        items.some((g) => g.id === generation.id) ? items : [...items, generation].sort(byDate),
      );
      return true;
    } catch (error) {
      callbacks.current.onError?.(error);
      return false;
    } finally {
      setLoadingHistoryId(null);
    }
  }, []);

  return {
    generations,
    history,
    pending,
    loadingHistoryId,
    isGenerating: pending.some((item) => item.status === "loading"),
    generate,
    retry,
    cancel,
    dismiss,
    ensureGeneration,
  };
}
