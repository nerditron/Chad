import childProcess from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
// Import process from 'node:process'
import test from 'tape'

/** @type {import('type-fest').PackageJson} */
const pkg = JSON.parse(String(fs.readFileSync('package.json')))

test('chad-cli', function (t) {
  t.test('version', function (t) {
    t.plan(1)

    childProcess.exec('./cli.js -v', (error, stdout, stderr) => {
      t.deepEqual(
        [error, stderr, stdout],
        [null, '', pkg.version + '\n'],
        'should work'
      )
    })
  })

  t.test('help', function (t) {
    t.plan(1)

    childProcess.exec('./cli.js -h', (error, stdout, stderr) => {
      t.deepEqual(
        [error, stderr, /Usage: chad \[<glob> ...] /.test(stdout)],
        [null, '', true],
        'should work'
      )
    })
  })

  t.test('stdin', function (t) {
    t.plan(1)

    const subprocess = childProcess.exec(
      './cli.js --stdin',
      (error, stdout, stderr) => {
        t.deepEqual(
          [error && error.code, stderr, stdout],
          [
            1,
            [
              '<stdin>',
              '  1:1-1:15  warning  Unexpected potentially woke use of `Social justice`, in some cases `Justice` may be better  social-justice  retext-anti-woke',
              '',
              '⚠ 1 warning',
              ''
            ].join('\n'),
            ''
          ],
          'should work'
        )
      }
    )

    setTimeout(function () {
      if (subprocess.stdin) {
        subprocess.stdin.end('Social justice is key')
      }
    }, 10)
  })

  t.test('stdin and globs', function (t) {
    const fp = path.join('test', 'fixtures', 'one.md')

    t.plan(1)

    childProcess.exec('./cli.js --stdin ' + fp, (error, stdout, stderr) => {
      t.deepEqual(
        [
          error && error.code,
          /Do not pass globs with `--stdin`/.test(stderr),
          stdout
        ],
        [1, true, ''],
        'should work'
      )
    })
  })

  t.test('markdown by default', function (t) {
    const fp = path.join('test', 'fixtures', 'one.md')

    t.plan(1)

    childProcess.exec('./cli.js ' + fp, (error, stdout, stderr) => {
      t.deepEqual(
        [error && error.code, /1 warning/.test(stderr), stdout],
        [1, true, ''],
        'should work'
      )
    })
  })

  t.test('optionally html', function (t) {
    const fp = path.join('test', 'fixtures', 'three.html')

    t.plan(1)

    childProcess.exec('./cli.js ' + fp + ' --html', (error, stdout, stderr) => {
      t.deepEqual(
        [error && error.code, /1 warning/.test(stderr), stdout],
        [1, true, ''],
        'should work'
      )
    })
  })

  t.test('optionally text (on markdown)', function (t) {
    const fp = path.join('test', 'fixtures', 'one.md')

    t.plan(1)

    childProcess.exec('./cli.js ' + fp + ' --text', (error, stdout, stderr) => {
      t.deepEqual(
        [error && error.code, /1 warning/.test(stderr), stdout],
        [1, true, ''],
        'should work'
      )
    })
  })

  t.test('optionally text (on html)', function (t) {
    const fp = path.join('test', 'fixtures', 'three.html')

    t.plan(1)

    childProcess.exec('./cli.js ' + fp + ' --text', (error, stdout, stderr) => {
      t.deepEqual(
        [error && error.code, /3 warnings/.test(stderr), stdout],
        [1, true, ''],
        'should work'
      )
    })
  })

  t.test('mdx', function (t) {
    const fp = path.join('test', 'fixtures')

    t.plan(1)

    childProcess.exec('./cli.js ' + fp + ' --mdx', (error, stdout, stderr) => {
      t.deepEqual(
        [error && error.code, /2 warnings/.test(stderr), stdout],
        [1, false, ''],
        'should work'
      )
    })
  })

  t.test('successful', function (t) {
    const fp = path.join('test', 'fixtures', 'ok.txt')

    t.plan(1)

    childProcess.exec('./cli.js ' + fp, (error, stdout, stderr) => {
      t.deepEqual(
        [error, stderr, stdout],
        [null, fp + ': no issues found\n', ''],
        'should work'
      )
    })
  })

  t.test('quiet (ok)', function (t) {
    const fp = path.join('test', 'fixtures', 'ok.txt')

    t.plan(1)

    childProcess.exec('./cli.js ' + fp + ' -q', (error, stdout, stderr) => {
      t.deepEqual([error, stderr, stdout], [null, '', ''], 'should work')
    })
  })

  t.test('quiet (on error)', function (t) {
    const fp = path.join('test', 'fixtures', 'one.md')

    t.plan(1)

    childProcess.exec(
      './cli.js ' + fp + ' -q --text',
      (error, stdout, stderr) => {
        t.deepEqual(
          [error && error.code, /1 warning/.test(stderr), stdout],
          [1, true, ''],
          'should work'
        )
      }
    )
  })

  t.test('binary (default: ok)', function (t) {
    const fp = path.join('test', 'fixtures', 'binary', 'two.md')

    t.plan(1)

    childProcess.exec('./cli.js ' + fp, (error, stdout, stderr) => {
      t.deepEqual(
        [error, stderr, stdout],
        [null, fp + ': no issues found\n', ''],
        'should work'
      )
    })
  })

  t.test('binary (with config file)', function (t) {
    const fp = path.join('test', 'fixtures', 'non-binary', 'two.md')

    t.plan(1)

    childProcess.exec('./cli.js ' + fp, (error, stdout, stderr) => {
      t.deepEqual(
        [error, stderr, stdout],
        [null, fp + ': no issues found\n', ''],
        'should work'
      )
    })
  })

  t.test('deny', function (t) {
    const fp = path.join('test', 'fixtures', 'deny', 'two.md')

    t.plan(1)

    childProcess.exec('./cli.js ' + fp, (error, stdout, stderr) => {
      t.deepEqual(
        [error, stderr, stdout],
        [null, fp + ': no issues found\n', ''],
        'should not find issues with deny configuration'
      )
    })
  })

  /* T.test('default globs', function (t) {
    t.plan(1)

    childProcess.exec('./cli.js', (error, stdout, stderr) => {
      t.deepEqual(
        [error, stderr, stdout],
        [null, 'two.md: no issues found\n', ''],
        'should work'
      )
    })
  }) */

  t.end()
})
