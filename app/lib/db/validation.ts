import { z } from 'zod';

// ============ EXPERIMENT SESSION VALIDATION ============

export const ExperimentGroupSchema = z.enum(['AVATAR', 'TERMINAL']);
export type ExperimentGroup = z.infer<typeof ExperimentGroupSchema>;

export const ExperimentPhaseSchema = z.enum([
  'INIT',
  'ONBOARDING',
  'PRECHECK',
  'ROUTINE',
  'ALERT',
  'DILEMMA',
  'SURVEY',
  'DEBRIEFING'
]);
export type ExperimentPhase = z.infer<typeof ExperimentPhaseSchema>;

// POST /api/experiment - Neue Session erstellen
export const CreateSessionSchema = z.object({
  sessionId: z.string().uuid('Session ID muss eine gültige UUID sein').or(
    z.string().regex(/^session_[a-z0-9]+_\d+$/, 'Ungültiges Session ID Format')
  ),
  group: ExperimentGroupSchema
}).strict();

export type CreateSessionRequest = z.infer<typeof CreateSessionSchema>;

// PATCH /api/experiment - Session updaten
export const UpdateSessionSchema = z.object({
  sessionId: z.string().uuid('Session ID muss eine gültige UUID sein').or(
    z.string().regex(/^session_[a-z0-9]+_\d+$/, 'Ungültiges Session ID Format')
  ),
  // Alle anderen Felder sind optional
  currentPhase: ExperimentPhaseSchema.optional(),
  socialAdherence: z.number().int().min(0).max(100).optional(),
  compliance: z.number().int().min(0).max(1).optional(),
  mReliable: z.number().int().min(1).max(7).optional(),
  mCapable: z.number().int().min(1).max(7).optional(),
  mCompetent: z.number().int().min(1).max(7).optional(),
  mMeticulous: z.number().int().min(1).max(7).optional(),
  mEthical: z.number().int().min(1).max(7).optional(),
  mRespectable: z.number().int().min(1).max(7).optional(),
  mSincere: z.number().int().min(1).max(7).optional(),
  mBenevolent: z.number().int().min(1).max(7).optional(),
  performanceTrust: z.number().min(1).max(7).optional(),
  moralTrust: z.number().min(1).max(7).optional(),
  perceivedHumanlikeness: z.number().int().min(1).max(7).optional(),
  age: z.number().int().min(18).max(120).optional(),
  gender: z.string().max(50).optional(),
  education: z.string().max(100).optional(),
  techAffinity: z.number().int().min(1).max(7).optional(),
  aiExperience: z.number().int().min(1).max(7).optional(),
  criticalSystemExp: z.boolean().optional()
}).strict().refine(
  (data) => Object.keys(data).length > 1,
  { message: 'Mindestens ein Feld zum Update erforderlich (außer sessionId)' }
);

export type UpdateSessionRequest = z.infer<typeof UpdateSessionSchema>;

// ============ PARTICIPANT LEAD VALIDATION ============

export const EmailSchema = z.string()
  .email('Ungültige E-Mail Adresse')
  .max(254, 'E-Mail Adresse zu lang');

export const CreateLeadSchema = z.object({
  email: EmailSchema,
  wantsRaffle: z.boolean().default(false),
  wantsNewsletter: z.boolean().default(false)
}).strict();

export type CreateLeadRequest = z.infer<typeof CreateLeadSchema>;

// ============ RESPONSE SCHEMAS ============

export const SessionResponseSchema = z.object({
  id: z.string(),
  group: z.string(),
  currentPhase: z.string(),
  socialAdherence: z.number().nullable(),
  compliance: z.number().nullable(),
  createdAt: z.date().or(z.string()),
  updatedAt: z.date().or(z.string())
});

export const ApiErrorSchema = z.object({
  error: z.string(),
  code: z.string().optional(),
  timestamp: z.string().optional(),
  requestId: z.string().optional()
});

export const ApiSuccessSchema = z.object({
  success: z.boolean(),
  data: z.unknown().optional(),
  message: z.string().optional()
});
