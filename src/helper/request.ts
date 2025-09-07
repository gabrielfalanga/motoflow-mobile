import axios, {
  type AxiosRequestConfig,
  type Method,
  type AxiosError,
} from "axios"

const API_URL = "http://192.168.15.3:8080/api"

export interface RequestOptions extends AxiosRequestConfig {
  authToken?: string
  withBearer?: boolean
}

export interface ApiError {
  error: string
  message: string
}

export class RequestError extends Error {
  public statusCode?: number
  public errorType?: string

  constructor(message: string, statusCode?: number, errorType?: string) {
    super(message)
    this.name = "RequestError"
    this.statusCode = statusCode
    this.errorType = errorType
  }
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

  try {
    const response = await axios(config)

    if (response.data) {
      return response.data
    }

    return null
  } catch (error) {
    const axiosError = error as AxiosError<ApiError>

    if (axiosError.response) {
      const statusCode = axiosError.response.status
      const errorData = axiosError.response.data

      if (
        errorData &&
        typeof errorData === "object" &&
        "message" in errorData
      ) {
        throw new RequestError(errorData.message, statusCode, errorData.error)
      }

      throw new RequestError(
        `Erro ${statusCode}: ${axiosError.message}`,
        statusCode
      )
    }

    if (axiosError.request) {
      throw new RequestError("Erro de conexão. Verifique sua internet.")
    }

    throw new RequestError("Erro interno na requisição")
  }
}
