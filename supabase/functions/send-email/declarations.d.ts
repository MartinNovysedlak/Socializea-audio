declare module "npm:resend@2.0.0" {
  import { Resend } from "resend";
  export { Resend };
}

declare var Deno: {
  env: {
    get(key: string): string | undefined;
  };
  serve(handler: (request: Request) => Response | Promise<Response>): void;
};