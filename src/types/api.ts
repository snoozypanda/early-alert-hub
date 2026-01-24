export interface BaseApiErrorObject {
  statusCode: number;
  message: string;
  localizedMessage?: string;
  errorName: string;
  details?: Record<string, any>;
  path: string;
  requestId: string;
  timestamp: string;
}

export interface BaseGenericApiResponse<T> {
  meta: Record<string, any>;
  data: T;
}

export interface User {
  id: number;
  name: string;
  username: string;
  roles: string[];
  email: string;
  isAccountDisabled: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuthorOutput {
    id: number;
    name: string;
}

// --- Auth ---

export interface LoginInput {
  username: string;
  password: string; // The user provided password in the request is usually a string
}

export interface RegisterInput {
  name: string;
  username: string;
  password: string;
  email: string;
}

export interface AuthTokenOutput {
  accessToken: string;
  refreshToken: string;
}

// --- Incident ---

export interface Incident {
  id: number;
  title: string;
  description: string;
  status: string; // "pending" | "approved" | "rejected" etc. but API doc says string
  severityLevel: string; // "low" | "medium" | "high" | "critical" etc.
  attachments: string[];
  reportDate: string;
  updatedAt: string;
  reportedBy: AuthorOutput;
  // Extras found in Create/Update payloads that might not be in Output?
  // CreateIncidentInput has latitude/longitude but IncidentOutput doesn't explicitly show them in the text unless I missed it.
  // Wait, the text says:
  // CreateIncidentInput: title, description, latitude, longitude, severityLevel, attachments
  // IncidentOutput: id, title, description, status, severityLevel, attachments, reportDate, updatedAt, reportedBy
  // It seems latitude/longitude might be missing from the output schema provided in the prompt?
  // I will add them as optional just in case, or stick strictly to the prompt.
  // Prompt says: "IncidentOutput { ... }" and does NOT list latitude/longitude.
  // I will strictly follow the provided IncidentOutput schema for the Interface.
}

export interface CreateIncidentInput {
  title: string;
  description: string;
  latitude: number;
  longitude: number;
  severityLevel: string;
  attachments: string[];
}

export interface UpdateIncidentInput {
  status?: string;
  severityLevel?: string;
}

// --- Disaster ---

export interface Disaster {
  id: number;
  title: string;
  description: string;
  severityLevel: string;
  scope: string;
  attachments: string[];
  affectedPopulation: number;
  status: string;
  startDate: string;
  createdAt: string;
  updatedAt: string;
  issuedBy: AuthorOutput;
  verifiedIncident: Incident;
}

export interface CreateDisasterInput {
  disasterID: string;
  scope: string;
  status: string;
  affectedPopulation: number;
  incidentId: string; // Note: Input asks for string, but incident ID is number in IncidentOutput.
                    // The prompt says CreateDisasterInput { incidentId: "string" }
                    // I will type it as string | number to be safe or string if strict.
  attachments: string[];
}

export interface UpdateDisasterInput {
  status?: string;
  scope?: string;
  affectedPopulation?: number;
  attachments?: string[];
}
