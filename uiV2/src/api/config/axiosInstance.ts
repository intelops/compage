import Axios, {
  AxiosError,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
  isAxiosError,
} from "axios";

const logOnDev = (message: string) => {
  if (import.meta.env.MODE === "development") {
    console.log(message);
  }
};

export const axios = Axios.create({
  baseURL: "<UPDATE_ME>", // TODO: add the base url or else consume it from the env variable
});

function authRequestInterceptor(
  config: InternalAxiosRequestConfig,
): InternalAxiosRequestConfig {
  const { method, url } = config;
  // Set Headers Here
  // Check Authentication Here
  // Set Loading Start Here
  logOnDev(`🚀 [API] ${method?.toUpperCase()} ${url} | Request`);

  if (method === "get") {
    config.timeout = 15000;
  }
  return config;
}
function authResponseInterceptor(response: AxiosResponse): AxiosResponse {
  const { method, url } = response.config;
  const { status } = response;
  // Set Loading End Here
  // Handle Response Data Here
  // Error Handling When Return Success with Error Code Here
  logOnDev(`🚀 [API] ${method?.toUpperCase()} ${url} | Response ${status}`);

  return response;
}

const onErrorResponse = (error: AxiosError | Error): Promise<AxiosError> => {
  if (isAxiosError(error)) {
    const { message } = error;
    const { method, url } = error.config as AxiosRequestConfig;
    const { statusText, status } = error.response as AxiosResponse ?? {};

    logOnDev(
      `🚨 [API] ${method?.toUpperCase()} ${url} | Error ${status} ${message}`,
    );

    switch (status) {
      case 401: {
        // "Login required"
        break;
      }
      case 403: {
        // "Permission denied"
        break;
      }
      case 404: {
        // "Invalid request"
        break;
      }
      case 500: {
        // "Server error"
        break;
      }
      default: {
        // "Unknown error occurred"
        break;
      }
    }

    if (status === 401) {
      // Delete Token & Go To Login Page if you required.
      sessionStorage.removeItem("token");
    }
  } else {
    logOnDev(`🚨 [API] | Error ${error.message}`);
  }

  return Promise.reject(error);
};
axios.interceptors.request.use(authRequestInterceptor, onErrorResponse);
axios.interceptors.response.use(authResponseInterceptor, onErrorResponse);
