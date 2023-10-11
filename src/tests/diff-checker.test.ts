import { strictEqual } from 'assert';
import { DiffChecker } from '../diff-checker';
import { describe } from './test.utils';

export const testDiffChecker = () => {
  void describe('diff-checker', () => {
    strictEqual(
      new DiffChecker().diff('Foo\nBar\nBaz', 'Foo\nBar\nBaz'),
      undefined,
    );
    strictEqual(
      new DiffChecker().diff('Foo\nBar\nBaz', 'Foo\nQux\nBaz'),
      '@@ -1,3 +1,3 @@\n Foo\n-Bar\n+Qux\n Baz\n',
    );
  });
};
