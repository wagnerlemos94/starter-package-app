export async function handleErrorResponse(response: Response): Promise<never> {
  let errorBody: any = null;
  try {
    errorBody = await response.json();
  } catch (e) {
    console.warn('Não foi possível parsear o corpo de erro como JSON:', e);
  }
  const message = (errorBody && (errorBody.message || errorBody.error)) || response.statusText || `Request failed with status ${response.status}`;
  const err: any = new Error(message);
  err.status = response.status;
  err.body = errorBody;
  throw err;
}

export function normalizeAndRethrow(err: any): never {
  if (err instanceof Error) throw err;
  const e: any = new Error(err?.message || 'Erro na requisição');
  e.status = err?.status;
  e.body = err?.body;
  throw e;
}

export default { handleErrorResponse, normalizeAndRethrow };
