export type RestResponse<TData = null> = {
  status: number;
  message: string[];
  ok: boolean;
  data: TData;
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
