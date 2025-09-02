import axios, { type AxiosRequestConfig, type Method } from "axios"

const API_URL = "http://10.3.33.12:8080/api"

export interface RequestOptions extends AxiosRequestConfig {
  authToken?: string
  withBearer?: boolean
}

export async function request<T>(
  endpoint: string,
  method: Method = "get",
  // biome-ignore lint/suspicious/noExplicitAny: qualquer body
  data?: any,
  options: RequestOptions = {}
): Promise<T | null> {
  const { authToken, withBearer, ...axiosOptions } = options

  const headers = {
    ...(axiosOptions.headers || {}),
  } as Record<string, string>

  if (authToken) {
    headers.Authorization =
      withBearer === false ? authToken : `Bearer ${authToken}`
  }

  const config: AxiosRequestConfig = {
    url: `${API_URL}${endpoint}`,
    method,
    ...axiosOptions,
    headers,
  }

  if (data) {
    config.data = data
  }

  const response = await axios(config)

  if (response.data) {
    return response.data
  }

  return null
}
