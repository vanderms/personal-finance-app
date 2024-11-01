export const ApiResponses = {
  Unknown: 'request::server::unknown',
  BadRequest: 'request::server::badrequest',
  Ok: 'request::server::ok',
} as const;

export type RestResponse<TData = undefined> = {
  status: number;
  message: string[];
  ok: boolean;
  data?: TData;
};

export const isRestResponse = (value: unknown): value is RestResponse => {
  return (
    value !== null &&
    typeof value === 'object' &&
    'status' in value &&
    typeof value.status === 'number' &&
    'message' in value &&
    'ok' in value &&
    typeof value.ok === 'boolean'
  );
};

