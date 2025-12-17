import axios from "axios";

export function getApiErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    // Sin response suele ser: backend caído, DNS, CORS, timeout, etc.
    if (!error.response) {
      return "No se pudo conectar con el backend (sin respuesta). Revisa URL/puerto y que el backend esté corriendo.";
    }

    const status = error.response.status;
    const data = error.response.data as unknown;

    const backendMessage =
      typeof data === "string"
        ? data
        : (data as any)?.message || (data as any)?.error || (data as any)?.detalle;

    if (status === 401) return "No autorizado (401). Inicia sesión nuevamente.";
    if (status === 403)
      return "Acceso denegado (403). Tu usuario no tiene permisos de admin.";
    if (status === 404)
      return "Ruta no encontrada (404). Revisa que el backend exponga los endpoints esperados.";

    return `Error ${status}${backendMessage ? `: ${backendMessage}` : ""}`;
  }

  if (error instanceof Error) return error.message;
  return "Error desconocido";
}
