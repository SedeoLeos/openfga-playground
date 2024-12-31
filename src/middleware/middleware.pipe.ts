import { NextRequest, NextResponse } from "next/server";

type MiddlewareHandler = (
  request: NextRequest
) => NextResponse | void | Promise<NextResponse | void>;

interface MiddlewareWithPath {
  paths: string[];
  handler: MiddlewareHandler;
}

export class MiddlewarePipeline {
  private middlewares: MiddlewareWithPath[] = [];

  /*
   *
   *
   *
   *
   */

  use(paths: string[], handler: MiddlewareHandler): MiddlewarePipeline {
    this.middlewares.push({ paths, handler });
    return this;
  }

  async run(request: NextRequest): Promise<NextResponse> {
    for (const { paths, handler } of this.middlewares) {
      // Vérifiez si le middleware doit s'appliquer au chemin actuel
      if (paths.some((path) => request.nextUrl.pathname.startsWith(path))) {
        const result = await handler(request);
        if (result instanceof NextResponse) {
          return result; // Arrêtez l'exécution si une réponse est retournée
        }
      }
    }
    return NextResponse.next(); // Continue si toutes les conditions sont remplies
  }
}