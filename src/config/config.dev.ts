/**
 * These are configuration settings for the dev environment.
 *
 * Do not include API secrets in this file or anywhere in your JS.
 *
 * https://reactnative.dev/docs/security#storing-sensitive-info
 */
export default {
  API_URL: "https://api.rss2json.com/v1/",
  AUTH_URL: "http://localhost:8080/api/v1", // Local loginservice
  WAREHOUSE_URL: "http://localhost:8082/api/v1", // Local warehouse-svc
}
