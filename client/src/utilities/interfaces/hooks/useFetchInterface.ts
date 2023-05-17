export interface useFetchInterface {
  url: string;
  type: "get" | "post" | "patch" | "delete";
  body?: object;
}
