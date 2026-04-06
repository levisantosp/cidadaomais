import type { Role } from "db";
import { Elysia } from "elysia";
import { auth } from "../auth";
import {
  ForbiddenException,
  UnauthorizedException
} from "../utils/HttpException";

export const authPlugin = new Elysia().mount(auth.handler).macro({
  authorize: (allowed: Role[]) => ({
    async resolve(ctx) {
      const session = await auth.api.getSession({
        headers: ctx.request.headers
      });
      if (!session) {
        throw new UnauthorizedException();
      }

      if (!allowed.includes(session.user.role)) {
        throw new ForbiddenException();
      }

      return {
        user: session.user,
        session: session.session
      };
    }
  })
});

let _schema: ReturnType<typeof auth.api.generateOpenAPISchema>;
const getSchema = async () => (_schema ??= auth.api.generateOpenAPISchema());

export const OpenAPI = {
  getPaths: (prefix = "/auth/api") =>
    getSchema().then(({ paths }) => {
      const reference: typeof paths = Object.create(null);

      for (const path of Object.keys(paths)) {
        const key = prefix + path;
        reference[key] = paths[path];

        for (const method of Object.keys(paths[path])) {
          const operation = (reference[key] as any)[method];

          operation.tags = ["Better Auth"];
        }
      }

      return reference;
    }) as Promise<any>,
  components: getSchema().then(({ components }) => components) as Promise<any>
} as const;
