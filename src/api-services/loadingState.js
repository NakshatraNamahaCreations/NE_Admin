import axios from "axios";
import { useSyncExternalStore } from "react";

let activeRequests = 0;
const listeners = new Set();

const notify = () => {
  listeners.forEach((listener) => listener());
};

const increment = () => {
  activeRequests += 1;
  notify();
};

const decrement = () => {
  activeRequests = Math.max(0, activeRequests - 1);
  notify();
};

const subscribe = (listener) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

const getSnapshot = () => activeRequests;

export const useApiLoading = () =>
  useSyncExternalStore(subscribe, getSnapshot, getSnapshot);

export const attachLoadingInterceptors = (instance) => {
  instance.interceptors.request.use(
    (config) => {
      increment();
      return config;
    },
    (error) => {
      decrement();
      return Promise.reject(error);
    }
  );

  instance.interceptors.response.use(
    (response) => {
      decrement();
      return response;
    },
    (error) => {
      decrement();
      return Promise.reject(error);
    }
  );
};

attachLoadingInterceptors(axios);
