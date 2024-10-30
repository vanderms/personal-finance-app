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
