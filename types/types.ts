export type ActionResponse<T = unknown, F = unknown> = {
  success: boolean,
  message: string,
  data?: T,
  fields?: F,
  error?: object,
}

export const initialState = {
  success: false,
  message: "",
}
