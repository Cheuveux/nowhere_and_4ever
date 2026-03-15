import { useEffect, useState } from "react";
import type { Question, StrapiItem } from "./types";
import { FALLBACK, mapStrapi } from "./data";

const STRAPI_URL: string = import.meta.env.VITE_STRAPI_URL ?? "http://localhost:1337";
const API_URL: string = `${STRAPI_URL}/api/quizzes?populate[answer]=*&sort=order:asc`;

export function useQuizQuestions(): { questions: Question[]; loading: boolean } {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(API_URL);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const { data }: { data: StrapiItem[] } = await res.json();
        const mapped = mapStrapi(data);
        setQuestions(mapped.length ? mapped : FALLBACK);
      } catch {
        setQuestions(FALLBACK);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return { questions, loading };
}