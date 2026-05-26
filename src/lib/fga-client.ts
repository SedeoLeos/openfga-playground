import { CredentialsMethod, OpenFgaApi } from '@openfga/sdk'
import type { Datasource } from '@/db/schema/datasources'

export function createFgaClient(datasource: Pick<Datasource, 'apiUrl' | 'apiToken'>) {
  return new OpenFgaApi({
    apiUrl: datasource.apiUrl,
    credentials: datasource.apiToken
      ? {
          method: CredentialsMethod.ApiToken,
          config: { token: datasource.apiToken },
        }
      : { method: CredentialsMethod.None },
  })
}

/** Default client — reads from environment variables (standalone mode) */
export const defaultFgaClient = createFgaClient({
  apiUrl: process.env.OPENFGA_API_URL ?? 'http://localhost:8080',
  apiToken: process.env.OPENFGA_API_TOKEN ?? null,
})
