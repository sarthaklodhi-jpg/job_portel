const configuredBaseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

const getLocalAwareBaseUrl = (baseUrl) => {
  try {
    const apiUrl = new URL(baseUrl);
    const browserHost = window.location.hostname;
    const localHosts = ["localhost", "127.0.0.1"];

    if (localHosts.includes(apiUrl.hostname) && localHosts.includes(browserHost)) {
      apiUrl.hostname = browserHost;
      return apiUrl.toString().replace(/\/$/, "");
    }
  } catch {
    return baseUrl;
  }

  return baseUrl;
};

const BASE_URL = getLocalAwareBaseUrl(configuredBaseUrl);

export const USER_API_END_POINT = `${BASE_URL}/api/v1/users`;
export const JOB_API_END_POINT = `${BASE_URL}/api/v1/job`;
export const APPLICATION_API_END_POINT = `${BASE_URL}/api/v1/application`;
export const COMPANY_API_END_POINT = `${BASE_URL}/api/v1/company`;
export const RESUME_API_END_POINT = `${BASE_URL}/api/v1/resume`;
