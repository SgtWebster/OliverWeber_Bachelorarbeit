
/**
 * Client
**/

import * as runtime from './runtime/client.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model ParticipantSession
 * 
 */
export type ParticipantSession = $Result.DefaultSelection<Prisma.$ParticipantSessionPayload>

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient({
 *   adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL })
 * })
 * // Fetch zero or more ParticipantSessions
 * const participantSessions = await prisma.participantSession.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://pris.ly/d/client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  const U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient({
   *   adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL })
   * })
   * // Fetch zero or more ParticipantSessions
   * const participantSessions = await prisma.participantSession.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://pris.ly/d/client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/orm/prisma-client/queries/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>

  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.participantSession`: Exposes CRUD operations for the **ParticipantSession** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ParticipantSessions
    * const participantSessions = await prisma.participantSession.findMany()
    * ```
    */
  get participantSession(): Prisma.ParticipantSessionDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 7.8.0
   * Query Engine version: 3c6e192761c0362d496ed980de936e2f3cebcd3a
   */
  export type PrismaVersion = {
    client: string
    engine: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import Bytes = runtime.Bytes
  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    ParticipantSession: 'ParticipantSession'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]



  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "participantSession"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      ParticipantSession: {
        payload: Prisma.$ParticipantSessionPayload<ExtArgs>
        fields: Prisma.ParticipantSessionFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ParticipantSessionFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ParticipantSessionPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ParticipantSessionFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ParticipantSessionPayload>
          }
          findFirst: {
            args: Prisma.ParticipantSessionFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ParticipantSessionPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ParticipantSessionFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ParticipantSessionPayload>
          }
          findMany: {
            args: Prisma.ParticipantSessionFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ParticipantSessionPayload>[]
          }
          create: {
            args: Prisma.ParticipantSessionCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ParticipantSessionPayload>
          }
          createMany: {
            args: Prisma.ParticipantSessionCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ParticipantSessionCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ParticipantSessionPayload>[]
          }
          delete: {
            args: Prisma.ParticipantSessionDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ParticipantSessionPayload>
          }
          update: {
            args: Prisma.ParticipantSessionUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ParticipantSessionPayload>
          }
          deleteMany: {
            args: Prisma.ParticipantSessionDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ParticipantSessionUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ParticipantSessionUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ParticipantSessionPayload>[]
          }
          upsert: {
            args: Prisma.ParticipantSessionUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ParticipantSessionPayload>
          }
          aggregate: {
            args: Prisma.ParticipantSessionAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateParticipantSession>
          }
          groupBy: {
            args: Prisma.ParticipantSessionGroupByArgs<ExtArgs>
            result: $Utils.Optional<ParticipantSessionGroupByOutputType>[]
          }
          count: {
            args: Prisma.ParticipantSessionCountArgs<ExtArgs>
            result: $Utils.Optional<ParticipantSessionCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Shorthand for `emit: 'stdout'`
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events only
     * log: [
     *   { emit: 'event', level: 'query' },
     *   { emit: 'event', level: 'info' },
     *   { emit: 'event', level: 'warn' }
     *   { emit: 'event', level: 'error' }
     * ]
     * 
     * / Emit as events and log to stdout
     * og: [
     *  { emit: 'stdout', level: 'query' },
     *  { emit: 'stdout', level: 'info' },
     *  { emit: 'stdout', level: 'warn' }
     *  { emit: 'stdout', level: 'error' }
     * 
     * ```
     * Read more in our [docs](https://pris.ly/d/logging).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * Instance of a Driver Adapter, e.g., like one provided by `@prisma/adapter-planetscale`
     */
    adapter?: runtime.SqlDriverAdapterFactory
    /**
     * Prisma Accelerate URL allowing the client to connect through Accelerate instead of a direct database.
     */
    accelerateUrl?: string
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
    /**
     * SQL commenter plugins that add metadata to SQL queries as comments.
     * Comments follow the sqlcommenter format: https://google.github.io/sqlcommenter/
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   adapter,
     *   comments: [
     *     traceContext(),
     *     queryInsights(),
     *   ],
     * })
     * ```
     */
    comments?: runtime.SqlCommenterPlugin[]
  }
  export type GlobalOmitConfig = {
    participantSession?: ParticipantSessionOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type CheckIsLogLevel<T> = T extends LogLevel ? T : never;

  export type GetLogType<T> = CheckIsLogLevel<
    T extends LogDefinition ? T['level'] : T
  >;

  export type GetEvents<T extends any[]> = T extends Array<LogLevel | LogDefinition>
    ? GetLogType<T[number]>
    : never;

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */



  /**
   * Models
   */

  /**
   * Model ParticipantSession
   */

  export type AggregateParticipantSession = {
    _count: ParticipantSessionCountAggregateOutputType | null
    _avg: ParticipantSessionAvgAggregateOutputType | null
    _sum: ParticipantSessionSumAggregateOutputType | null
    _min: ParticipantSessionMinAggregateOutputType | null
    _max: ParticipantSessionMaxAggregateOutputType | null
  }

  export type ParticipantSessionAvgAggregateOutputType = {
    socialAdherence: number | null
    compliance: number | null
    mCompetent: number | null
    mReliable: number | null
    mEthical: number | null
    mSincere: number | null
    mBenevolent: number | null
    performanceTrust: number | null
    moralTrust: number | null
    age: number | null
    techAffinity: number | null
    aiExperience: number | null
  }

  export type ParticipantSessionSumAggregateOutputType = {
    socialAdherence: number | null
    compliance: number | null
    mCompetent: number | null
    mReliable: number | null
    mEthical: number | null
    mSincere: number | null
    mBenevolent: number | null
    performanceTrust: number | null
    moralTrust: number | null
    age: number | null
    techAffinity: number | null
    aiExperience: number | null
  }

  export type ParticipantSessionMinAggregateOutputType = {
    id: string | null
    group: string | null
    currentPhase: string | null
    socialAdherence: number | null
    compliance: number | null
    mCompetent: number | null
    mReliable: number | null
    mEthical: number | null
    mSincere: number | null
    mBenevolent: number | null
    performanceTrust: number | null
    moralTrust: number | null
    age: number | null
    gender: string | null
    education: string | null
    techAffinity: number | null
    aiExperience: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ParticipantSessionMaxAggregateOutputType = {
    id: string | null
    group: string | null
    currentPhase: string | null
    socialAdherence: number | null
    compliance: number | null
    mCompetent: number | null
    mReliable: number | null
    mEthical: number | null
    mSincere: number | null
    mBenevolent: number | null
    performanceTrust: number | null
    moralTrust: number | null
    age: number | null
    gender: string | null
    education: string | null
    techAffinity: number | null
    aiExperience: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ParticipantSessionCountAggregateOutputType = {
    id: number
    group: number
    currentPhase: number
    socialAdherence: number
    compliance: number
    mCompetent: number
    mReliable: number
    mEthical: number
    mSincere: number
    mBenevolent: number
    performanceTrust: number
    moralTrust: number
    age: number
    gender: number
    education: number
    techAffinity: number
    aiExperience: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type ParticipantSessionAvgAggregateInputType = {
    socialAdherence?: true
    compliance?: true
    mCompetent?: true
    mReliable?: true
    mEthical?: true
    mSincere?: true
    mBenevolent?: true
    performanceTrust?: true
    moralTrust?: true
    age?: true
    techAffinity?: true
    aiExperience?: true
  }

  export type ParticipantSessionSumAggregateInputType = {
    socialAdherence?: true
    compliance?: true
    mCompetent?: true
    mReliable?: true
    mEthical?: true
    mSincere?: true
    mBenevolent?: true
    performanceTrust?: true
    moralTrust?: true
    age?: true
    techAffinity?: true
    aiExperience?: true
  }

  export type ParticipantSessionMinAggregateInputType = {
    id?: true
    group?: true
    currentPhase?: true
    socialAdherence?: true
    compliance?: true
    mCompetent?: true
    mReliable?: true
    mEthical?: true
    mSincere?: true
    mBenevolent?: true
    performanceTrust?: true
    moralTrust?: true
    age?: true
    gender?: true
    education?: true
    techAffinity?: true
    aiExperience?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ParticipantSessionMaxAggregateInputType = {
    id?: true
    group?: true
    currentPhase?: true
    socialAdherence?: true
    compliance?: true
    mCompetent?: true
    mReliable?: true
    mEthical?: true
    mSincere?: true
    mBenevolent?: true
    performanceTrust?: true
    moralTrust?: true
    age?: true
    gender?: true
    education?: true
    techAffinity?: true
    aiExperience?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ParticipantSessionCountAggregateInputType = {
    id?: true
    group?: true
    currentPhase?: true
    socialAdherence?: true
    compliance?: true
    mCompetent?: true
    mReliable?: true
    mEthical?: true
    mSincere?: true
    mBenevolent?: true
    performanceTrust?: true
    moralTrust?: true
    age?: true
    gender?: true
    education?: true
    techAffinity?: true
    aiExperience?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type ParticipantSessionAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ParticipantSession to aggregate.
     */
    where?: ParticipantSessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ParticipantSessions to fetch.
     */
    orderBy?: ParticipantSessionOrderByWithRelationInput | ParticipantSessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ParticipantSessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ParticipantSessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ParticipantSessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ParticipantSessions
    **/
    _count?: true | ParticipantSessionCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ParticipantSessionAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ParticipantSessionSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ParticipantSessionMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ParticipantSessionMaxAggregateInputType
  }

  export type GetParticipantSessionAggregateType<T extends ParticipantSessionAggregateArgs> = {
        [P in keyof T & keyof AggregateParticipantSession]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateParticipantSession[P]>
      : GetScalarType<T[P], AggregateParticipantSession[P]>
  }




  export type ParticipantSessionGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ParticipantSessionWhereInput
    orderBy?: ParticipantSessionOrderByWithAggregationInput | ParticipantSessionOrderByWithAggregationInput[]
    by: ParticipantSessionScalarFieldEnum[] | ParticipantSessionScalarFieldEnum
    having?: ParticipantSessionScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ParticipantSessionCountAggregateInputType | true
    _avg?: ParticipantSessionAvgAggregateInputType
    _sum?: ParticipantSessionSumAggregateInputType
    _min?: ParticipantSessionMinAggregateInputType
    _max?: ParticipantSessionMaxAggregateInputType
  }

  export type ParticipantSessionGroupByOutputType = {
    id: string
    group: string
    currentPhase: string
    socialAdherence: number | null
    compliance: number | null
    mCompetent: number | null
    mReliable: number | null
    mEthical: number | null
    mSincere: number | null
    mBenevolent: number | null
    performanceTrust: number | null
    moralTrust: number | null
    age: number | null
    gender: string | null
    education: string | null
    techAffinity: number | null
    aiExperience: number | null
    createdAt: Date
    updatedAt: Date
    _count: ParticipantSessionCountAggregateOutputType | null
    _avg: ParticipantSessionAvgAggregateOutputType | null
    _sum: ParticipantSessionSumAggregateOutputType | null
    _min: ParticipantSessionMinAggregateOutputType | null
    _max: ParticipantSessionMaxAggregateOutputType | null
  }

  type GetParticipantSessionGroupByPayload<T extends ParticipantSessionGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ParticipantSessionGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ParticipantSessionGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ParticipantSessionGroupByOutputType[P]>
            : GetScalarType<T[P], ParticipantSessionGroupByOutputType[P]>
        }
      >
    >


  export type ParticipantSessionSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    group?: boolean
    currentPhase?: boolean
    socialAdherence?: boolean
    compliance?: boolean
    mCompetent?: boolean
    mReliable?: boolean
    mEthical?: boolean
    mSincere?: boolean
    mBenevolent?: boolean
    performanceTrust?: boolean
    moralTrust?: boolean
    age?: boolean
    gender?: boolean
    education?: boolean
    techAffinity?: boolean
    aiExperience?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["participantSession"]>

  export type ParticipantSessionSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    group?: boolean
    currentPhase?: boolean
    socialAdherence?: boolean
    compliance?: boolean
    mCompetent?: boolean
    mReliable?: boolean
    mEthical?: boolean
    mSincere?: boolean
    mBenevolent?: boolean
    performanceTrust?: boolean
    moralTrust?: boolean
    age?: boolean
    gender?: boolean
    education?: boolean
    techAffinity?: boolean
    aiExperience?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["participantSession"]>

  export type ParticipantSessionSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    group?: boolean
    currentPhase?: boolean
    socialAdherence?: boolean
    compliance?: boolean
    mCompetent?: boolean
    mReliable?: boolean
    mEthical?: boolean
    mSincere?: boolean
    mBenevolent?: boolean
    performanceTrust?: boolean
    moralTrust?: boolean
    age?: boolean
    gender?: boolean
    education?: boolean
    techAffinity?: boolean
    aiExperience?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["participantSession"]>

  export type ParticipantSessionSelectScalar = {
    id?: boolean
    group?: boolean
    currentPhase?: boolean
    socialAdherence?: boolean
    compliance?: boolean
    mCompetent?: boolean
    mReliable?: boolean
    mEthical?: boolean
    mSincere?: boolean
    mBenevolent?: boolean
    performanceTrust?: boolean
    moralTrust?: boolean
    age?: boolean
    gender?: boolean
    education?: boolean
    techAffinity?: boolean
    aiExperience?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type ParticipantSessionOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "group" | "currentPhase" | "socialAdherence" | "compliance" | "mCompetent" | "mReliable" | "mEthical" | "mSincere" | "mBenevolent" | "performanceTrust" | "moralTrust" | "age" | "gender" | "education" | "techAffinity" | "aiExperience" | "createdAt" | "updatedAt", ExtArgs["result"]["participantSession"]>

  export type $ParticipantSessionPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ParticipantSession"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      group: string
      currentPhase: string
      socialAdherence: number | null
      compliance: number | null
      mCompetent: number | null
      mReliable: number | null
      mEthical: number | null
      mSincere: number | null
      mBenevolent: number | null
      performanceTrust: number | null
      moralTrust: number | null
      age: number | null
      gender: string | null
      education: string | null
      techAffinity: number | null
      aiExperience: number | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["participantSession"]>
    composites: {}
  }

  type ParticipantSessionGetPayload<S extends boolean | null | undefined | ParticipantSessionDefaultArgs> = $Result.GetResult<Prisma.$ParticipantSessionPayload, S>

  type ParticipantSessionCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ParticipantSessionFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ParticipantSessionCountAggregateInputType | true
    }

  export interface ParticipantSessionDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ParticipantSession'], meta: { name: 'ParticipantSession' } }
    /**
     * Find zero or one ParticipantSession that matches the filter.
     * @param {ParticipantSessionFindUniqueArgs} args - Arguments to find a ParticipantSession
     * @example
     * // Get one ParticipantSession
     * const participantSession = await prisma.participantSession.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ParticipantSessionFindUniqueArgs>(args: SelectSubset<T, ParticipantSessionFindUniqueArgs<ExtArgs>>): Prisma__ParticipantSessionClient<$Result.GetResult<Prisma.$ParticipantSessionPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one ParticipantSession that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ParticipantSessionFindUniqueOrThrowArgs} args - Arguments to find a ParticipantSession
     * @example
     * // Get one ParticipantSession
     * const participantSession = await prisma.participantSession.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ParticipantSessionFindUniqueOrThrowArgs>(args: SelectSubset<T, ParticipantSessionFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ParticipantSessionClient<$Result.GetResult<Prisma.$ParticipantSessionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ParticipantSession that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ParticipantSessionFindFirstArgs} args - Arguments to find a ParticipantSession
     * @example
     * // Get one ParticipantSession
     * const participantSession = await prisma.participantSession.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ParticipantSessionFindFirstArgs>(args?: SelectSubset<T, ParticipantSessionFindFirstArgs<ExtArgs>>): Prisma__ParticipantSessionClient<$Result.GetResult<Prisma.$ParticipantSessionPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ParticipantSession that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ParticipantSessionFindFirstOrThrowArgs} args - Arguments to find a ParticipantSession
     * @example
     * // Get one ParticipantSession
     * const participantSession = await prisma.participantSession.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ParticipantSessionFindFirstOrThrowArgs>(args?: SelectSubset<T, ParticipantSessionFindFirstOrThrowArgs<ExtArgs>>): Prisma__ParticipantSessionClient<$Result.GetResult<Prisma.$ParticipantSessionPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more ParticipantSessions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ParticipantSessionFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ParticipantSessions
     * const participantSessions = await prisma.participantSession.findMany()
     * 
     * // Get first 10 ParticipantSessions
     * const participantSessions = await prisma.participantSession.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const participantSessionWithIdOnly = await prisma.participantSession.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ParticipantSessionFindManyArgs>(args?: SelectSubset<T, ParticipantSessionFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ParticipantSessionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a ParticipantSession.
     * @param {ParticipantSessionCreateArgs} args - Arguments to create a ParticipantSession.
     * @example
     * // Create one ParticipantSession
     * const ParticipantSession = await prisma.participantSession.create({
     *   data: {
     *     // ... data to create a ParticipantSession
     *   }
     * })
     * 
     */
    create<T extends ParticipantSessionCreateArgs>(args: SelectSubset<T, ParticipantSessionCreateArgs<ExtArgs>>): Prisma__ParticipantSessionClient<$Result.GetResult<Prisma.$ParticipantSessionPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many ParticipantSessions.
     * @param {ParticipantSessionCreateManyArgs} args - Arguments to create many ParticipantSessions.
     * @example
     * // Create many ParticipantSessions
     * const participantSession = await prisma.participantSession.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ParticipantSessionCreateManyArgs>(args?: SelectSubset<T, ParticipantSessionCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many ParticipantSessions and returns the data saved in the database.
     * @param {ParticipantSessionCreateManyAndReturnArgs} args - Arguments to create many ParticipantSessions.
     * @example
     * // Create many ParticipantSessions
     * const participantSession = await prisma.participantSession.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many ParticipantSessions and only return the `id`
     * const participantSessionWithIdOnly = await prisma.participantSession.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ParticipantSessionCreateManyAndReturnArgs>(args?: SelectSubset<T, ParticipantSessionCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ParticipantSessionPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a ParticipantSession.
     * @param {ParticipantSessionDeleteArgs} args - Arguments to delete one ParticipantSession.
     * @example
     * // Delete one ParticipantSession
     * const ParticipantSession = await prisma.participantSession.delete({
     *   where: {
     *     // ... filter to delete one ParticipantSession
     *   }
     * })
     * 
     */
    delete<T extends ParticipantSessionDeleteArgs>(args: SelectSubset<T, ParticipantSessionDeleteArgs<ExtArgs>>): Prisma__ParticipantSessionClient<$Result.GetResult<Prisma.$ParticipantSessionPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one ParticipantSession.
     * @param {ParticipantSessionUpdateArgs} args - Arguments to update one ParticipantSession.
     * @example
     * // Update one ParticipantSession
     * const participantSession = await prisma.participantSession.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ParticipantSessionUpdateArgs>(args: SelectSubset<T, ParticipantSessionUpdateArgs<ExtArgs>>): Prisma__ParticipantSessionClient<$Result.GetResult<Prisma.$ParticipantSessionPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more ParticipantSessions.
     * @param {ParticipantSessionDeleteManyArgs} args - Arguments to filter ParticipantSessions to delete.
     * @example
     * // Delete a few ParticipantSessions
     * const { count } = await prisma.participantSession.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ParticipantSessionDeleteManyArgs>(args?: SelectSubset<T, ParticipantSessionDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ParticipantSessions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ParticipantSessionUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ParticipantSessions
     * const participantSession = await prisma.participantSession.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ParticipantSessionUpdateManyArgs>(args: SelectSubset<T, ParticipantSessionUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ParticipantSessions and returns the data updated in the database.
     * @param {ParticipantSessionUpdateManyAndReturnArgs} args - Arguments to update many ParticipantSessions.
     * @example
     * // Update many ParticipantSessions
     * const participantSession = await prisma.participantSession.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more ParticipantSessions and only return the `id`
     * const participantSessionWithIdOnly = await prisma.participantSession.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends ParticipantSessionUpdateManyAndReturnArgs>(args: SelectSubset<T, ParticipantSessionUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ParticipantSessionPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one ParticipantSession.
     * @param {ParticipantSessionUpsertArgs} args - Arguments to update or create a ParticipantSession.
     * @example
     * // Update or create a ParticipantSession
     * const participantSession = await prisma.participantSession.upsert({
     *   create: {
     *     // ... data to create a ParticipantSession
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ParticipantSession we want to update
     *   }
     * })
     */
    upsert<T extends ParticipantSessionUpsertArgs>(args: SelectSubset<T, ParticipantSessionUpsertArgs<ExtArgs>>): Prisma__ParticipantSessionClient<$Result.GetResult<Prisma.$ParticipantSessionPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of ParticipantSessions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ParticipantSessionCountArgs} args - Arguments to filter ParticipantSessions to count.
     * @example
     * // Count the number of ParticipantSessions
     * const count = await prisma.participantSession.count({
     *   where: {
     *     // ... the filter for the ParticipantSessions we want to count
     *   }
     * })
    **/
    count<T extends ParticipantSessionCountArgs>(
      args?: Subset<T, ParticipantSessionCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ParticipantSessionCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ParticipantSession.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ParticipantSessionAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ParticipantSessionAggregateArgs>(args: Subset<T, ParticipantSessionAggregateArgs>): Prisma.PrismaPromise<GetParticipantSessionAggregateType<T>>

    /**
     * Group by ParticipantSession.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ParticipantSessionGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ParticipantSessionGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ParticipantSessionGroupByArgs['orderBy'] }
        : { orderBy?: ParticipantSessionGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ParticipantSessionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetParticipantSessionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ParticipantSession model
   */
  readonly fields: ParticipantSessionFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ParticipantSession.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ParticipantSessionClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the ParticipantSession model
   */
  interface ParticipantSessionFieldRefs {
    readonly id: FieldRef<"ParticipantSession", 'String'>
    readonly group: FieldRef<"ParticipantSession", 'String'>
    readonly currentPhase: FieldRef<"ParticipantSession", 'String'>
    readonly socialAdherence: FieldRef<"ParticipantSession", 'Int'>
    readonly compliance: FieldRef<"ParticipantSession", 'Int'>
    readonly mCompetent: FieldRef<"ParticipantSession", 'Int'>
    readonly mReliable: FieldRef<"ParticipantSession", 'Int'>
    readonly mEthical: FieldRef<"ParticipantSession", 'Int'>
    readonly mSincere: FieldRef<"ParticipantSession", 'Int'>
    readonly mBenevolent: FieldRef<"ParticipantSession", 'Int'>
    readonly performanceTrust: FieldRef<"ParticipantSession", 'Float'>
    readonly moralTrust: FieldRef<"ParticipantSession", 'Float'>
    readonly age: FieldRef<"ParticipantSession", 'Int'>
    readonly gender: FieldRef<"ParticipantSession", 'String'>
    readonly education: FieldRef<"ParticipantSession", 'String'>
    readonly techAffinity: FieldRef<"ParticipantSession", 'Int'>
    readonly aiExperience: FieldRef<"ParticipantSession", 'Int'>
    readonly createdAt: FieldRef<"ParticipantSession", 'DateTime'>
    readonly updatedAt: FieldRef<"ParticipantSession", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * ParticipantSession findUnique
   */
  export type ParticipantSessionFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ParticipantSession
     */
    select?: ParticipantSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ParticipantSession
     */
    omit?: ParticipantSessionOmit<ExtArgs> | null
    /**
     * Filter, which ParticipantSession to fetch.
     */
    where: ParticipantSessionWhereUniqueInput
  }

  /**
   * ParticipantSession findUniqueOrThrow
   */
  export type ParticipantSessionFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ParticipantSession
     */
    select?: ParticipantSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ParticipantSession
     */
    omit?: ParticipantSessionOmit<ExtArgs> | null
    /**
     * Filter, which ParticipantSession to fetch.
     */
    where: ParticipantSessionWhereUniqueInput
  }

  /**
   * ParticipantSession findFirst
   */
  export type ParticipantSessionFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ParticipantSession
     */
    select?: ParticipantSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ParticipantSession
     */
    omit?: ParticipantSessionOmit<ExtArgs> | null
    /**
     * Filter, which ParticipantSession to fetch.
     */
    where?: ParticipantSessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ParticipantSessions to fetch.
     */
    orderBy?: ParticipantSessionOrderByWithRelationInput | ParticipantSessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ParticipantSessions.
     */
    cursor?: ParticipantSessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ParticipantSessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ParticipantSessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ParticipantSessions.
     */
    distinct?: ParticipantSessionScalarFieldEnum | ParticipantSessionScalarFieldEnum[]
  }

  /**
   * ParticipantSession findFirstOrThrow
   */
  export type ParticipantSessionFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ParticipantSession
     */
    select?: ParticipantSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ParticipantSession
     */
    omit?: ParticipantSessionOmit<ExtArgs> | null
    /**
     * Filter, which ParticipantSession to fetch.
     */
    where?: ParticipantSessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ParticipantSessions to fetch.
     */
    orderBy?: ParticipantSessionOrderByWithRelationInput | ParticipantSessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ParticipantSessions.
     */
    cursor?: ParticipantSessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ParticipantSessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ParticipantSessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ParticipantSessions.
     */
    distinct?: ParticipantSessionScalarFieldEnum | ParticipantSessionScalarFieldEnum[]
  }

  /**
   * ParticipantSession findMany
   */
  export type ParticipantSessionFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ParticipantSession
     */
    select?: ParticipantSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ParticipantSession
     */
    omit?: ParticipantSessionOmit<ExtArgs> | null
    /**
     * Filter, which ParticipantSessions to fetch.
     */
    where?: ParticipantSessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ParticipantSessions to fetch.
     */
    orderBy?: ParticipantSessionOrderByWithRelationInput | ParticipantSessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ParticipantSessions.
     */
    cursor?: ParticipantSessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ParticipantSessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ParticipantSessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ParticipantSessions.
     */
    distinct?: ParticipantSessionScalarFieldEnum | ParticipantSessionScalarFieldEnum[]
  }

  /**
   * ParticipantSession create
   */
  export type ParticipantSessionCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ParticipantSession
     */
    select?: ParticipantSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ParticipantSession
     */
    omit?: ParticipantSessionOmit<ExtArgs> | null
    /**
     * The data needed to create a ParticipantSession.
     */
    data: XOR<ParticipantSessionCreateInput, ParticipantSessionUncheckedCreateInput>
  }

  /**
   * ParticipantSession createMany
   */
  export type ParticipantSessionCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ParticipantSessions.
     */
    data: ParticipantSessionCreateManyInput | ParticipantSessionCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ParticipantSession createManyAndReturn
   */
  export type ParticipantSessionCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ParticipantSession
     */
    select?: ParticipantSessionSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ParticipantSession
     */
    omit?: ParticipantSessionOmit<ExtArgs> | null
    /**
     * The data used to create many ParticipantSessions.
     */
    data: ParticipantSessionCreateManyInput | ParticipantSessionCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ParticipantSession update
   */
  export type ParticipantSessionUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ParticipantSession
     */
    select?: ParticipantSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ParticipantSession
     */
    omit?: ParticipantSessionOmit<ExtArgs> | null
    /**
     * The data needed to update a ParticipantSession.
     */
    data: XOR<ParticipantSessionUpdateInput, ParticipantSessionUncheckedUpdateInput>
    /**
     * Choose, which ParticipantSession to update.
     */
    where: ParticipantSessionWhereUniqueInput
  }

  /**
   * ParticipantSession updateMany
   */
  export type ParticipantSessionUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ParticipantSessions.
     */
    data: XOR<ParticipantSessionUpdateManyMutationInput, ParticipantSessionUncheckedUpdateManyInput>
    /**
     * Filter which ParticipantSessions to update
     */
    where?: ParticipantSessionWhereInput
    /**
     * Limit how many ParticipantSessions to update.
     */
    limit?: number
  }

  /**
   * ParticipantSession updateManyAndReturn
   */
  export type ParticipantSessionUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ParticipantSession
     */
    select?: ParticipantSessionSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ParticipantSession
     */
    omit?: ParticipantSessionOmit<ExtArgs> | null
    /**
     * The data used to update ParticipantSessions.
     */
    data: XOR<ParticipantSessionUpdateManyMutationInput, ParticipantSessionUncheckedUpdateManyInput>
    /**
     * Filter which ParticipantSessions to update
     */
    where?: ParticipantSessionWhereInput
    /**
     * Limit how many ParticipantSessions to update.
     */
    limit?: number
  }

  /**
   * ParticipantSession upsert
   */
  export type ParticipantSessionUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ParticipantSession
     */
    select?: ParticipantSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ParticipantSession
     */
    omit?: ParticipantSessionOmit<ExtArgs> | null
    /**
     * The filter to search for the ParticipantSession to update in case it exists.
     */
    where: ParticipantSessionWhereUniqueInput
    /**
     * In case the ParticipantSession found by the `where` argument doesn't exist, create a new ParticipantSession with this data.
     */
    create: XOR<ParticipantSessionCreateInput, ParticipantSessionUncheckedCreateInput>
    /**
     * In case the ParticipantSession was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ParticipantSessionUpdateInput, ParticipantSessionUncheckedUpdateInput>
  }

  /**
   * ParticipantSession delete
   */
  export type ParticipantSessionDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ParticipantSession
     */
    select?: ParticipantSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ParticipantSession
     */
    omit?: ParticipantSessionOmit<ExtArgs> | null
    /**
     * Filter which ParticipantSession to delete.
     */
    where: ParticipantSessionWhereUniqueInput
  }

  /**
   * ParticipantSession deleteMany
   */
  export type ParticipantSessionDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ParticipantSessions to delete
     */
    where?: ParticipantSessionWhereInput
    /**
     * Limit how many ParticipantSessions to delete.
     */
    limit?: number
  }

  /**
   * ParticipantSession without action
   */
  export type ParticipantSessionDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ParticipantSession
     */
    select?: ParticipantSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ParticipantSession
     */
    omit?: ParticipantSessionOmit<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const ParticipantSessionScalarFieldEnum: {
    id: 'id',
    group: 'group',
    currentPhase: 'currentPhase',
    socialAdherence: 'socialAdherence',
    compliance: 'compliance',
    mCompetent: 'mCompetent',
    mReliable: 'mReliable',
    mEthical: 'mEthical',
    mSincere: 'mSincere',
    mBenevolent: 'mBenevolent',
    performanceTrust: 'performanceTrust',
    moralTrust: 'moralTrust',
    age: 'age',
    gender: 'gender',
    education: 'education',
    techAffinity: 'techAffinity',
    aiExperience: 'aiExperience',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type ParticipantSessionScalarFieldEnum = (typeof ParticipantSessionScalarFieldEnum)[keyof typeof ParticipantSessionScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    
  /**
   * Deep Input Types
   */


  export type ParticipantSessionWhereInput = {
    AND?: ParticipantSessionWhereInput | ParticipantSessionWhereInput[]
    OR?: ParticipantSessionWhereInput[]
    NOT?: ParticipantSessionWhereInput | ParticipantSessionWhereInput[]
    id?: StringFilter<"ParticipantSession"> | string
    group?: StringFilter<"ParticipantSession"> | string
    currentPhase?: StringFilter<"ParticipantSession"> | string
    socialAdherence?: IntNullableFilter<"ParticipantSession"> | number | null
    compliance?: IntNullableFilter<"ParticipantSession"> | number | null
    mCompetent?: IntNullableFilter<"ParticipantSession"> | number | null
    mReliable?: IntNullableFilter<"ParticipantSession"> | number | null
    mEthical?: IntNullableFilter<"ParticipantSession"> | number | null
    mSincere?: IntNullableFilter<"ParticipantSession"> | number | null
    mBenevolent?: IntNullableFilter<"ParticipantSession"> | number | null
    performanceTrust?: FloatNullableFilter<"ParticipantSession"> | number | null
    moralTrust?: FloatNullableFilter<"ParticipantSession"> | number | null
    age?: IntNullableFilter<"ParticipantSession"> | number | null
    gender?: StringNullableFilter<"ParticipantSession"> | string | null
    education?: StringNullableFilter<"ParticipantSession"> | string | null
    techAffinity?: IntNullableFilter<"ParticipantSession"> | number | null
    aiExperience?: IntNullableFilter<"ParticipantSession"> | number | null
    createdAt?: DateTimeFilter<"ParticipantSession"> | Date | string
    updatedAt?: DateTimeFilter<"ParticipantSession"> | Date | string
  }

  export type ParticipantSessionOrderByWithRelationInput = {
    id?: SortOrder
    group?: SortOrder
    currentPhase?: SortOrder
    socialAdherence?: SortOrderInput | SortOrder
    compliance?: SortOrderInput | SortOrder
    mCompetent?: SortOrderInput | SortOrder
    mReliable?: SortOrderInput | SortOrder
    mEthical?: SortOrderInput | SortOrder
    mSincere?: SortOrderInput | SortOrder
    mBenevolent?: SortOrderInput | SortOrder
    performanceTrust?: SortOrderInput | SortOrder
    moralTrust?: SortOrderInput | SortOrder
    age?: SortOrderInput | SortOrder
    gender?: SortOrderInput | SortOrder
    education?: SortOrderInput | SortOrder
    techAffinity?: SortOrderInput | SortOrder
    aiExperience?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ParticipantSessionWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: ParticipantSessionWhereInput | ParticipantSessionWhereInput[]
    OR?: ParticipantSessionWhereInput[]
    NOT?: ParticipantSessionWhereInput | ParticipantSessionWhereInput[]
    group?: StringFilter<"ParticipantSession"> | string
    currentPhase?: StringFilter<"ParticipantSession"> | string
    socialAdherence?: IntNullableFilter<"ParticipantSession"> | number | null
    compliance?: IntNullableFilter<"ParticipantSession"> | number | null
    mCompetent?: IntNullableFilter<"ParticipantSession"> | number | null
    mReliable?: IntNullableFilter<"ParticipantSession"> | number | null
    mEthical?: IntNullableFilter<"ParticipantSession"> | number | null
    mSincere?: IntNullableFilter<"ParticipantSession"> | number | null
    mBenevolent?: IntNullableFilter<"ParticipantSession"> | number | null
    performanceTrust?: FloatNullableFilter<"ParticipantSession"> | number | null
    moralTrust?: FloatNullableFilter<"ParticipantSession"> | number | null
    age?: IntNullableFilter<"ParticipantSession"> | number | null
    gender?: StringNullableFilter<"ParticipantSession"> | string | null
    education?: StringNullableFilter<"ParticipantSession"> | string | null
    techAffinity?: IntNullableFilter<"ParticipantSession"> | number | null
    aiExperience?: IntNullableFilter<"ParticipantSession"> | number | null
    createdAt?: DateTimeFilter<"ParticipantSession"> | Date | string
    updatedAt?: DateTimeFilter<"ParticipantSession"> | Date | string
  }, "id">

  export type ParticipantSessionOrderByWithAggregationInput = {
    id?: SortOrder
    group?: SortOrder
    currentPhase?: SortOrder
    socialAdherence?: SortOrderInput | SortOrder
    compliance?: SortOrderInput | SortOrder
    mCompetent?: SortOrderInput | SortOrder
    mReliable?: SortOrderInput | SortOrder
    mEthical?: SortOrderInput | SortOrder
    mSincere?: SortOrderInput | SortOrder
    mBenevolent?: SortOrderInput | SortOrder
    performanceTrust?: SortOrderInput | SortOrder
    moralTrust?: SortOrderInput | SortOrder
    age?: SortOrderInput | SortOrder
    gender?: SortOrderInput | SortOrder
    education?: SortOrderInput | SortOrder
    techAffinity?: SortOrderInput | SortOrder
    aiExperience?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: ParticipantSessionCountOrderByAggregateInput
    _avg?: ParticipantSessionAvgOrderByAggregateInput
    _max?: ParticipantSessionMaxOrderByAggregateInput
    _min?: ParticipantSessionMinOrderByAggregateInput
    _sum?: ParticipantSessionSumOrderByAggregateInput
  }

  export type ParticipantSessionScalarWhereWithAggregatesInput = {
    AND?: ParticipantSessionScalarWhereWithAggregatesInput | ParticipantSessionScalarWhereWithAggregatesInput[]
    OR?: ParticipantSessionScalarWhereWithAggregatesInput[]
    NOT?: ParticipantSessionScalarWhereWithAggregatesInput | ParticipantSessionScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"ParticipantSession"> | string
    group?: StringWithAggregatesFilter<"ParticipantSession"> | string
    currentPhase?: StringWithAggregatesFilter<"ParticipantSession"> | string
    socialAdherence?: IntNullableWithAggregatesFilter<"ParticipantSession"> | number | null
    compliance?: IntNullableWithAggregatesFilter<"ParticipantSession"> | number | null
    mCompetent?: IntNullableWithAggregatesFilter<"ParticipantSession"> | number | null
    mReliable?: IntNullableWithAggregatesFilter<"ParticipantSession"> | number | null
    mEthical?: IntNullableWithAggregatesFilter<"ParticipantSession"> | number | null
    mSincere?: IntNullableWithAggregatesFilter<"ParticipantSession"> | number | null
    mBenevolent?: IntNullableWithAggregatesFilter<"ParticipantSession"> | number | null
    performanceTrust?: FloatNullableWithAggregatesFilter<"ParticipantSession"> | number | null
    moralTrust?: FloatNullableWithAggregatesFilter<"ParticipantSession"> | number | null
    age?: IntNullableWithAggregatesFilter<"ParticipantSession"> | number | null
    gender?: StringNullableWithAggregatesFilter<"ParticipantSession"> | string | null
    education?: StringNullableWithAggregatesFilter<"ParticipantSession"> | string | null
    techAffinity?: IntNullableWithAggregatesFilter<"ParticipantSession"> | number | null
    aiExperience?: IntNullableWithAggregatesFilter<"ParticipantSession"> | number | null
    createdAt?: DateTimeWithAggregatesFilter<"ParticipantSession"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"ParticipantSession"> | Date | string
  }

  export type ParticipantSessionCreateInput = {
    id?: string
    group: string
    currentPhase?: string
    socialAdherence?: number | null
    compliance?: number | null
    mCompetent?: number | null
    mReliable?: number | null
    mEthical?: number | null
    mSincere?: number | null
    mBenevolent?: number | null
    performanceTrust?: number | null
    moralTrust?: number | null
    age?: number | null
    gender?: string | null
    education?: string | null
    techAffinity?: number | null
    aiExperience?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ParticipantSessionUncheckedCreateInput = {
    id?: string
    group: string
    currentPhase?: string
    socialAdherence?: number | null
    compliance?: number | null
    mCompetent?: number | null
    mReliable?: number | null
    mEthical?: number | null
    mSincere?: number | null
    mBenevolent?: number | null
    performanceTrust?: number | null
    moralTrust?: number | null
    age?: number | null
    gender?: string | null
    education?: string | null
    techAffinity?: number | null
    aiExperience?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ParticipantSessionUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    group?: StringFieldUpdateOperationsInput | string
    currentPhase?: StringFieldUpdateOperationsInput | string
    socialAdherence?: NullableIntFieldUpdateOperationsInput | number | null
    compliance?: NullableIntFieldUpdateOperationsInput | number | null
    mCompetent?: NullableIntFieldUpdateOperationsInput | number | null
    mReliable?: NullableIntFieldUpdateOperationsInput | number | null
    mEthical?: NullableIntFieldUpdateOperationsInput | number | null
    mSincere?: NullableIntFieldUpdateOperationsInput | number | null
    mBenevolent?: NullableIntFieldUpdateOperationsInput | number | null
    performanceTrust?: NullableFloatFieldUpdateOperationsInput | number | null
    moralTrust?: NullableFloatFieldUpdateOperationsInput | number | null
    age?: NullableIntFieldUpdateOperationsInput | number | null
    gender?: NullableStringFieldUpdateOperationsInput | string | null
    education?: NullableStringFieldUpdateOperationsInput | string | null
    techAffinity?: NullableIntFieldUpdateOperationsInput | number | null
    aiExperience?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ParticipantSessionUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    group?: StringFieldUpdateOperationsInput | string
    currentPhase?: StringFieldUpdateOperationsInput | string
    socialAdherence?: NullableIntFieldUpdateOperationsInput | number | null
    compliance?: NullableIntFieldUpdateOperationsInput | number | null
    mCompetent?: NullableIntFieldUpdateOperationsInput | number | null
    mReliable?: NullableIntFieldUpdateOperationsInput | number | null
    mEthical?: NullableIntFieldUpdateOperationsInput | number | null
    mSincere?: NullableIntFieldUpdateOperationsInput | number | null
    mBenevolent?: NullableIntFieldUpdateOperationsInput | number | null
    performanceTrust?: NullableFloatFieldUpdateOperationsInput | number | null
    moralTrust?: NullableFloatFieldUpdateOperationsInput | number | null
    age?: NullableIntFieldUpdateOperationsInput | number | null
    gender?: NullableStringFieldUpdateOperationsInput | string | null
    education?: NullableStringFieldUpdateOperationsInput | string | null
    techAffinity?: NullableIntFieldUpdateOperationsInput | number | null
    aiExperience?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ParticipantSessionCreateManyInput = {
    id?: string
    group: string
    currentPhase?: string
    socialAdherence?: number | null
    compliance?: number | null
    mCompetent?: number | null
    mReliable?: number | null
    mEthical?: number | null
    mSincere?: number | null
    mBenevolent?: number | null
    performanceTrust?: number | null
    moralTrust?: number | null
    age?: number | null
    gender?: string | null
    education?: string | null
    techAffinity?: number | null
    aiExperience?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ParticipantSessionUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    group?: StringFieldUpdateOperationsInput | string
    currentPhase?: StringFieldUpdateOperationsInput | string
    socialAdherence?: NullableIntFieldUpdateOperationsInput | number | null
    compliance?: NullableIntFieldUpdateOperationsInput | number | null
    mCompetent?: NullableIntFieldUpdateOperationsInput | number | null
    mReliable?: NullableIntFieldUpdateOperationsInput | number | null
    mEthical?: NullableIntFieldUpdateOperationsInput | number | null
    mSincere?: NullableIntFieldUpdateOperationsInput | number | null
    mBenevolent?: NullableIntFieldUpdateOperationsInput | number | null
    performanceTrust?: NullableFloatFieldUpdateOperationsInput | number | null
    moralTrust?: NullableFloatFieldUpdateOperationsInput | number | null
    age?: NullableIntFieldUpdateOperationsInput | number | null
    gender?: NullableStringFieldUpdateOperationsInput | string | null
    education?: NullableStringFieldUpdateOperationsInput | string | null
    techAffinity?: NullableIntFieldUpdateOperationsInput | number | null
    aiExperience?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ParticipantSessionUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    group?: StringFieldUpdateOperationsInput | string
    currentPhase?: StringFieldUpdateOperationsInput | string
    socialAdherence?: NullableIntFieldUpdateOperationsInput | number | null
    compliance?: NullableIntFieldUpdateOperationsInput | number | null
    mCompetent?: NullableIntFieldUpdateOperationsInput | number | null
    mReliable?: NullableIntFieldUpdateOperationsInput | number | null
    mEthical?: NullableIntFieldUpdateOperationsInput | number | null
    mSincere?: NullableIntFieldUpdateOperationsInput | number | null
    mBenevolent?: NullableIntFieldUpdateOperationsInput | number | null
    performanceTrust?: NullableFloatFieldUpdateOperationsInput | number | null
    moralTrust?: NullableFloatFieldUpdateOperationsInput | number | null
    age?: NullableIntFieldUpdateOperationsInput | number | null
    gender?: NullableStringFieldUpdateOperationsInput | string | null
    education?: NullableStringFieldUpdateOperationsInput | string | null
    techAffinity?: NullableIntFieldUpdateOperationsInput | number | null
    aiExperience?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type IntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type FloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type ParticipantSessionCountOrderByAggregateInput = {
    id?: SortOrder
    group?: SortOrder
    currentPhase?: SortOrder
    socialAdherence?: SortOrder
    compliance?: SortOrder
    mCompetent?: SortOrder
    mReliable?: SortOrder
    mEthical?: SortOrder
    mSincere?: SortOrder
    mBenevolent?: SortOrder
    performanceTrust?: SortOrder
    moralTrust?: SortOrder
    age?: SortOrder
    gender?: SortOrder
    education?: SortOrder
    techAffinity?: SortOrder
    aiExperience?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ParticipantSessionAvgOrderByAggregateInput = {
    socialAdherence?: SortOrder
    compliance?: SortOrder
    mCompetent?: SortOrder
    mReliable?: SortOrder
    mEthical?: SortOrder
    mSincere?: SortOrder
    mBenevolent?: SortOrder
    performanceTrust?: SortOrder
    moralTrust?: SortOrder
    age?: SortOrder
    techAffinity?: SortOrder
    aiExperience?: SortOrder
  }

  export type ParticipantSessionMaxOrderByAggregateInput = {
    id?: SortOrder
    group?: SortOrder
    currentPhase?: SortOrder
    socialAdherence?: SortOrder
    compliance?: SortOrder
    mCompetent?: SortOrder
    mReliable?: SortOrder
    mEthical?: SortOrder
    mSincere?: SortOrder
    mBenevolent?: SortOrder
    performanceTrust?: SortOrder
    moralTrust?: SortOrder
    age?: SortOrder
    gender?: SortOrder
    education?: SortOrder
    techAffinity?: SortOrder
    aiExperience?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ParticipantSessionMinOrderByAggregateInput = {
    id?: SortOrder
    group?: SortOrder
    currentPhase?: SortOrder
    socialAdherence?: SortOrder
    compliance?: SortOrder
    mCompetent?: SortOrder
    mReliable?: SortOrder
    mEthical?: SortOrder
    mSincere?: SortOrder
    mBenevolent?: SortOrder
    performanceTrust?: SortOrder
    moralTrust?: SortOrder
    age?: SortOrder
    gender?: SortOrder
    education?: SortOrder
    techAffinity?: SortOrder
    aiExperience?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ParticipantSessionSumOrderByAggregateInput = {
    socialAdherence?: SortOrder
    compliance?: SortOrder
    mCompetent?: SortOrder
    mReliable?: SortOrder
    mEthical?: SortOrder
    mSincere?: SortOrder
    mBenevolent?: SortOrder
    performanceTrust?: SortOrder
    moralTrust?: SortOrder
    age?: SortOrder
    techAffinity?: SortOrder
    aiExperience?: SortOrder
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type IntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type FloatNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedFloatNullableFilter<$PrismaModel>
    _min?: NestedFloatNullableFilter<$PrismaModel>
    _max?: NestedFloatNullableFilter<$PrismaModel>
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type NullableIntFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type NullableFloatFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedFloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedIntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type NestedFloatNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedFloatNullableFilter<$PrismaModel>
    _min?: NestedFloatNullableFilter<$PrismaModel>
    _max?: NestedFloatNullableFilter<$PrismaModel>
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}