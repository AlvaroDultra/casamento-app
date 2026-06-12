import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/pt-br";

dayjs.extend(relativeTime);
dayjs.locale("pt-br");

/** Ex: "há 5 minutos", "há 2 dias" */
export function timeAgo(date: string): string {
  return dayjs(date).fromNow();
}

/** Ex: "15 de agosto de 2026" */
export function formatWeddingDate(iso: string): string {
  return dayjs(iso).format("DD [de] MMMM [de] YYYY");
}

/** Mensagem de erro vinda da API (ResponseStatusException ou validação de campo) */
export function apiError(err: unknown, fallback = "Algo deu errado"): string {
  const data = (
    err as {
      response?: {
        data?: {
          message?: string;
          errors?: Array<{ defaultMessage?: string }>;
        };
      };
    }
  )?.response?.data;

  // Erro de validação de campo (ex: senha curta) vem no array "errors"
  const fieldMsg = data?.errors?.find((e) => e.defaultMessage)?.defaultMessage;
  if (fieldMsg) return fieldMsg;

  // ResponseStatusException traz a razão em "message" (ignora o genérico de validação)
  if (data?.message && !data.message.startsWith("Validation failed")) {
    return data.message;
  }
  return fallback;
}
