import { useCallback, useRef } from "react";

export function useAbortController() {
  const abortControllerRef = useRef(null);
  const isAbortedRef = useRef(false);

  const createController = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const controller = new AbortController();
    abortControllerRef.current = controller;
    isAbortedRef.current = false;
    return controller;
  }, []);

  const getController = createController;

  const abort = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      isAbortedRef.current = true;
    }
  }, []);

  const isAborted = useCallback(() => isAbortedRef.current, []);

  const cleanup = useCallback(() => {
    abortControllerRef.current = null;
    isAbortedRef.current = false;
  }, []);

  return { createController, getController, abort, isAborted, cleanup };
}

export function useRequestDedupe() {
  const inFlightRef = useRef(new Map());

  const startRequest = useCallback((key) => {
    if (inFlightRef.current.has(key)) {
      return false;
    }
    inFlightRef.current.set(key, true);
    return true;
  }, []);

  const endRequest = useCallback((key) => {
    inFlightRef.current.delete(key);
  }, []);

  const isInFlight = useCallback((key) => inFlightRef.current.has(key), []);

  return { startRequest, endRequest, isInFlight };
}