import assets from "./certificates.generated.json";

/** Discovered from the certificates folder by scripts/sync-certificates.mjs. */
export interface Certification {
  name: string;
  fileName: string;
  format: string;
  image?: string;
  verifyUrl: string;
  issuer?: string;
  date?: string;
}

export const certifications: Certification[] = assets;
