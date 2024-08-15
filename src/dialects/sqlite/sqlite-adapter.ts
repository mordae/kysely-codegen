import { IdentifierNode } from '../../generator/ast/identifier-node';
import { Adapter } from '../../introspector/adapter';

export class SqliteAdapter extends Adapter {
  override readonly defaultScalar = new IdentifierNode('string');
  override readonly scalars = {
    any: new IdentifierNode('unknown'),
    blob: new IdentifierNode('Buffer'),
    boolean: new IdentifierNode('number'),
    integer: new IdentifierNode('number'),
    numeric: new IdentifierNode('number'),
    real: new IdentifierNode('number'),
    text: new IdentifierNode('string'),
  };
}
