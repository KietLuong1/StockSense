/**
 * These are configuration settings for the production environment.
 *
 * Do not include API secrets in this file or anywhere in your JS.
 *
 * https://reactnative.dev/docs/security#storing-sensitive-info
 */
export default {
  API_URL: "CHANGEME",
  AUTH_URL: "http://localhost:8080/api/v1/auth", // loginservice service URL
  WAREHOUSE_URL: "http://localhost:8082/api/v1", // warehouse-svc URL
}
