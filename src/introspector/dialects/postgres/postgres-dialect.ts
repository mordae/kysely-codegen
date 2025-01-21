import { PostgresDialect as KyselyPostgresDialect } from 'kysely';
import type { CreateKyselyDialectOptions } from '../../dialect';
import { IntrospectorDialect } from '../../dialect';
import { DateParser, DEFAULT_DATE_PARSER } from './date-parser';
import { DEFAULT_NUMERIC_PARSER, NumericParser } from './numeric-parser';
import { DEFAULT_BIGINT_PARSER, BigintParser } from './bigint-parser';
import { PostgresIntrospector } from './postgres-introspector';

type PostgresDialectOptions = {
  dateParser?: DateParser;
  defaultSchemas?: string[];
  domains?: boolean;
  numericParser?: NumericParser;
  bigintParser?: BigintParser;
  partitions?: boolean;
};

export class PostgresIntrospectorDialect extends IntrospectorDialect {
  protected readonly options: PostgresDialectOptions;
  override readonly introspector: PostgresIntrospector;

  constructor(options?: PostgresDialectOptions) {
    super();

    this.introspector = new PostgresIntrospector({
      defaultSchemas: options?.defaultSchemas,
      domains: options?.domains,
      partitions: options?.partitions,
    });
    this.options = {
      dateParser: options?.dateParser ?? DEFAULT_DATE_PARSER,
      defaultSchemas: options?.defaultSchemas,
      domains: options?.domains ?? true,
      numericParser: options?.numericParser ?? DEFAULT_NUMERIC_PARSER,
      bigintParser: options?.bigintParser ?? DEFAULT_BIGINT_PARSER,
    };
  }

  async createKyselyDialect(options: CreateKyselyDialectOptions) {
    const { default: pg } = await import('pg');

    if (this.options.dateParser === DateParser.STRING) {
      pg.types.setTypeParser(1082, (date) => date);
    }

    if (this.options.numericParser === NumericParser.NUMBER) {
      pg.types.setTypeParser(1700, Number);
    } else if (this.options.numericParser === NumericParser.NUMBER_OR_STRING) {
      pg.types.setTypeParser(1700, (value) => {
        const number = Number(value);
        return number > Number.MAX_SAFE_INTEGER ||
          number < Number.MIN_SAFE_INTEGER
          ? value
          : number;
      });
    }

    if (this.options.bigintParser === BigintParser.NUMBER) {
      pg.types.setTypeParser(1700, Number);
    } else if (this.options.bigintParser === BigintParser.NUMBER_OR_STRING) {
      pg.types.setTypeParser(1700, (value) => {
        const number = Number(value);
        return number > Number.MAX_SAFE_INTEGER ||
          number < Number.MIN_SAFE_INTEGER
          ? value
          : number;
      });
    }

    return new KyselyPostgresDialect({
      pool: new pg.Pool({
        connectionString: options.connectionString,
        ssl: options.ssl ? { rejectUnauthorized: false } : false,
      }),
    });
  }
}
