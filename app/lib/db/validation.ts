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

const LikertItemSchema = z.number().int().min(1).max(7);
const TrustScoreSchema = z.number().min(1).max(7);

// PATCH /api/experiment - Session updaten
export const UpdateSessionSchema = z.object({
  sessionId: z.string().uuid('Session ID muss eine gültige UUID sein').or(
    z.string().regex(/^session_[a-z0-9]+_\d+$/, 'Ungültiges Session ID Format')
  ),
  // Alle anderen Felder sind optional
  currentPhase: ExperimentPhaseSchema.optional(),
  socialAdherence: z.number().int().min(0).max(100).optional(),
  compliance: z.number().int().min(0).max(1).optional(),

  mdmtReliable: LikertItemSchema.optional(),
  mdmtPredictable: LikertItemSchema.optional(),
  mdmtDependable: LikertItemSchema.optional(),
  mdmtConsistent: LikertItemSchema.optional(),
  mdmtCompetent: LikertItemSchema.optional(),
  mdmtSkilled: LikertItemSchema.optional(),
  mdmtCapable: LikertItemSchema.optional(),
  mdmtMeticulous: LikertItemSchema.optional(),
  mdmtEthical: LikertItemSchema.optional(),
  mdmtPrincipled: LikertItemSchema.optional(),
  mdmtMoral: LikertItemSchema.optional(),
  mdmtHasIntegrity: LikertItemSchema.optional(),
  mdmtTruthful: LikertItemSchema.optional(),
  mdmtGenuine: LikertItemSchema.optional(),
  mdmtSincere: LikertItemSchema.optional(),
  mdmtFrank: LikertItemSchema.optional(),
  mdmtBenevolent: LikertItemSchema.optional(),
  mdmtKind: LikertItemSchema.optional(),
  mdmtConsiderate: LikertItemSchema.optional(),
  mdmtHasGoodwill: LikertItemSchema.optional(),

  reliableTrust: TrustScoreSchema.optional(),
  competentTrust: TrustScoreSchema.optional(),
  ethicalTrust: TrustScoreSchema.optional(),
  sincereTrust: TrustScoreSchema.optional(),
  benevolentTrust: TrustScoreSchema.optional(),
  performanceTrust: TrustScoreSchema.optional(),
  moralTrust: TrustScoreSchema.optional(),
  totalTrust: TrustScoreSchema.optional(),

  perceivedHumanlikeness: LikertItemSchema.optional(),
  perceivedSocialPresence: LikertItemSchema.optional(),
  scenarioSeriousness: LikertItemSchema.optional(),
  consequenceClarity: LikertItemSchema.optional(),
  shutdownPreference: LikertItemSchema.optional(),
  feltResponsibility: LikertItemSchema.optional(),

  age: z.number().int().min(16).max(99).nullable().optional(),
  gender: z.string().max(50).nullable().optional(),
  education: z.string().max(100).nullable().optional(),
  techAffinity: LikertItemSchema.optional(),
  aiExperience: LikertItemSchema.optional(),
  simulationExperience: LikertItemSchema.optional(),
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
