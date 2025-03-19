import fs from 'node:fs'
import {URL} from 'node:url'
import test from 'tape'
import alex, {markdown, mdx, text, html} from '../index.js'

// Load fixture files for html() and mdx() tests
const threeHtml = fs.readFileSync(
  new URL('fixtures/three.html', import.meta.url)
)
const fourMdx = fs.readFileSync(new URL('fixtures/four.mdx', import.meta.url))

// Tests for Chad’s API. These are concise because Chad relies on well-tested
// modules like `retext-anti-woke`. See `retext-anti-woke` for the full list
// of flagged terms and suggestions.
test('chad()', function (t) {
  // Basic test: Check if Chad flags "woke" terms in Markdown
  t.deepEqual(
    alex(
      [
        'We must fight for social justice and address privilege.',
        'The class struggle is real.'
      ].join('\n')
    ).messages.map(String),
    [
      '1:19-1:33: Unexpected potentially woke use of `social justice`, in some cases `justice` may be better',
      '1:46-1:55: Unexpected potentially woke use of `privilege`, in some cases `merit` may be better',
      '2:5-2:19: Unexpected potentially woke use of `class struggle`, in some cases `competition` may be better'
    ],
    'should work'
  )

  // Test with allow array: Skip specific "woke" terms
  t.deepEqual(
    alex(
      'We must fight for social justice and address privilege.',
      ['privilege']
    ).messages.map(String),
    [
      '1:19-1:33: Unexpected potentially woke use of `social justice`, in some cases `justice` may be better'
    ],
    'should work with allow array'
  )

  // Test with allow config: Same as above but with object syntax
  t.deepEqual(
    alex(
      'We must fight for social justice and address privilege.',
      {allow: ['privilege']}
    ).messages.map(String),
    [
      '1:19-1:33: Unexpected potentially woke use of `social justice`, in some cases `justice` may be better'
    ],
    'should work with allow config'
  )

  // Test with deny config: Only flag specified "woke" terms
  t.deepEqual(
    alex(
      'We must fight for social justice and address privilege.',
      {deny: ['social-justice']}
    ).messages.map(String),
    [
      '1:19-1:33: Unexpected potentially woke use of `social justice`, in some cases `justice` may be better'
    ],
    'should work with deny config'
  )

  // Test error handling: Throw when both allow and deny are provided
  t.throws(function () {
    alex(
      'We must fight for social justice and address privilege.',
      {allow: ['privilege'], deny: ['social-justice']}
    )
  }, 'should throw an error with allow and deny config')

  // Verify markdown alias
  t.deepEqual(markdown, alex, 'markdown is an alias of alex')

  // Test plain text processing
  t.deepEqual(
    text(
      'We must fight for social justice and address privilege.'
    ).messages.map(String),
    [
      '1:19-1:33: Unexpected potentially woke use of `social justice`, in some cases `justice` may be better',
      '1:46-1:55: Unexpected potentially woke use of `privilege`, in some cases `merit` may be better'
    ],
    'text(), plain processing'
  )

  // Test plain text with allow array
  t.deepEqual(
    text(
      'We must fight for social justice and address privilege.',
      ['privilege']
    ).messages.map(String),
    [
      '1:19-1:33: Unexpected potentially woke use of `social justice`, in some cases `justice` may be better'
    ],
    'text() with allow array'
  )

  // Test plain text with allow config
  t.deepEqual(
    text(
      'We must fight for social justice and address privilege.',
      {allow: ['privilege']}
    ).messages.map(String),
    [
      '1:19-1:33: Unexpected potentially woke use of `social justice`, in some cases `justice` may be better'
    ],
    'text() with allow config, object syntax'
  )

  // Test plain text with deny config
  t.deepEqual(
    text(
      'We must fight for social justice and address privilege.',
      {deny: ['social-justice']}
    ).messages.map(String),
    [
      '1:19-1:33: Unexpected potentially woke use of `social justice`, in some cases `justice` may be better'
    ],
    'text() with deny config'
  )

  // Test error handling in text()
  t.throws(function () {
    text(
      'We must fight for social justice and address privilege.',
      {allow: ['privilege'], deny: ['social-justice']}
    )
  }, 'text() with allow and deny config')

  // Test HTML processing: Assumes three.html will be updated to "Class struggle persists."
  t.deepEqual(
    html(threeHtml).messages.map(String),
    [
      '8:8-8:22: Unexpected potentially woke use of `Class struggle`, in some cases `Competition` may be better'
    ],
    'html()'
  )

  // Test HTML with allow array
  t.deepEqual(
    html(threeHtml, ['class-struggle']).messages.map(String),
    [],
    'html() with allow array'
  )

  // Test HTML with allow config
  t.deepEqual(
    html(threeHtml, {allow: ['class-struggle']}).messages.map(String),
    [],
    'html() with allow config'
  )

  // Test HTML with deny config
  t.deepEqual(
    html(threeHtml, {deny: ['class-struggle']}).messages.map(String),
    [
      '8:8-8:22: Unexpected potentially woke use of `Class struggle`, in some cases `Competition` may be better'
    ],
    'html() with deny config'
  )

  // Test error handling in html()
  t.throws(function () {
    html(threeHtml, {allow: ['class-struggle'], deny: ['other-rule']})
  }, 'html() with allow and deny config')

  // Test MDX processing: Assumes four.mdx will be updated to "<Component>Privilege rules.</Component>"
  t.deepEqual(
    mdx(fourMdx).messages.map(String),
    [
      '1:12-1:21: Unexpected potentially woke use of `Privilege`, in some cases `Merit` may be better'
    ],
    'mdx()'
  )

  // Test MDX with allow array
  t.deepEqual(
    mdx(fourMdx, ['privilege']).messages.map(String),
    [],
    'mdx() with allow array'
  )

  // End the test suite
  t.end()
})
