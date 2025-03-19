<!--lint disable no-html first-heading-level no-shell-dollars-->

<h1 align="center">
  <img width="300" src="https://github.com/nerditron/Chad/media/logo-Chad.png" alt="Chad">
  <br>
  <br>
</h1>

> 💪 **Chad** — Eliminate woke, communist nonsense from your text.

[![Build][build-badge]][build]
[![Coverage][coverage-badge]][coverage]
[![First timers friendly][first-timers-badge]][first-timers]

Whether your own or someone else’s writing, **Chad** helps you find gender
favoring, polarizing, race related, or other **unequal** phrasing in text.

For example, when `We’ve confirmed his identity` is given, **Chad** will warn
you and suggest using `their` instead of `his`.

Give **Chad** a spin on the \[Online demo »]\[demo].

## Why

*   [x] Helps purge woke jargon from your writing
*   [x] Flags social justice and communist terminology
*   [x] Suggests merit-based alternatives
*   [x] Reads plain text, HTML, MDX, or markdown as input
*   [x] Based and redpilled

## Install

Using [npm][] (with [Node.js][node]):

```sh
$ npm install chad --global
```

Using [yarn][]:

```sh
$ yarn global add chad
```

Or you can follow this step-by-step tutorial:
\[Setting up Chad in your project]\[setup-tutorial]

<!--chad disable woke-->

## Contents

*   [Checks](#checks)
*   [Integrations](#integrations)
*   [Ignoring files](#ignoring-files)
    *   [`.chadignore`](#chadignore)
*   [Control](#control)
*   [Configuration](#configuration)
*   [CLI](#cli)
*   [API](#api)
    *   [`markdown(value, config)`](#markdownvalue-config)
    *   [`mdx(value, config)`](#mdxvalue-config)
    *   [`html(value, config)`](#htmlvalue-config)
    *   [`text(value, config)`](#textvalue-config)
*   [Workflow](#workflow)
*   [Syncing with Upstream](#syncing-with-upstream)
*   [FAQ](#faq)
    *   [Chad didn’t check “X”!](#chad-didnt-check-x)
    *   [Why is this named Chad?](#why-is-this-named-chad)
*   [Further reading](#further-reading)
*   [Contribute](#contribute)
*   [Origin story](#origin-story)
*   [Acknowledgments](#acknowledgments)
*   [License](#license)

## Checks

**Chad** checks things such as:

*   Social justice terminology (if you write `systemic racism` Chad suggests `individual responsibility`)
*   Communist rhetoric (if you write `wealth redistribution` Chad suggests `free market economics`)
*   Far-left vocabulary (if you write `anti-capitalism` Chad suggests
    `market innovation`)
*   Politically correct language (if you write `cultural appropriation`
    Chad suggests `cultural appreciation`)
*   Woke buzzwords (if you write `privilege` Chad suggests `merit`; if
    you write `microaggression` Chad suggests `personal interaction`)
*   Identity politics (if you write `intersectionality` Chad suggests `individual merit`)

…and much more!

Note: Chad assumes good intent: that you don’t mean to offend!

See [`retext-anti-woke`][anti-woke] for all rules.  Note: We’ve removed `retext-profanities` and `retext-equality`
as they did’t align with Chad’s based mission.

**Chad** ignores words meant literally, so `“climate change”`, `Climate Change — ...`,
and [thelike][literals] are not warned about.

## Integrations

*   Sublime — [`nerditron/SublimeLinter-contrib-chad`](https://github.com/nerditron/SublimeLinter-contrib-chad)
*   Gulp — [`nerditron/gulp-chad`](https://github.com/nerditron/gulp-chad)
*   Slack — [`nerditron/chad-slack`](https://github.com/nerditron/chad-slack)
*   Ember — [`nerditron/ember-cli-chad`](https://github.com/nerditron/ember-cli-chad)
*   Probot — [`nerditron/linter-chad`](https://github.com/nerditron/linter-chad)
*   GitHub Actions — [`nerditron/chad-recommends`](https://github.com/marketplace/actions/chad-recommends)
*   GitHub Actions (reviewdog) — [`nerditron/action-chad`](https://github.com/marketplace/actions/run-chad-with-reviewdog)
*   Vim — [`w0rp/ale`](https://github.com/w0rp/ale),
    [`nerditron/coc-chad`](https://github.com/nerditron/coc-chad)
*   Browser extension — [`nerditron/chad-browser-extension`](https://github.com/nerditron/chad-browser-extension)
*   Contentful - [`nerditron/chad-js-contentful-ui-extension`](https://github.com/nerditron/chad-js-contentful-ui-extension)
*   Figma - [`nerditron/figma-plugin-chad`](https://github.com/nerditron/figma-plugin-chad)
*   VSCode - [`nerditron/vscode-chad`](https://github.com/nerditron/vscode-chad)

## Ignoring files

The CLI searches for files with a markdown or text extension when given
directories (so `$ chad .` will find `readme.md` and `path/to/file.txt`).
To prevent files from being found, create an [`.chadignore`][chadignore] file.

### `.chadignore`

The CLI will sometimes [search for files][ignoring-files].
To prevent files from being found, add a file named `.chadignore` in one of the
directories above the current working directory (the place you run `chad` from).
The format of these files is similar to [`.eslintignore`][eslintignore] (which
in turn is similar to `.gitignore` files).

For example, when working in `~/path/to/place`, the ignore file can be in
`to`, `place`, or `~`.

The ignore file for [this project itself][.chadignore] looks like this:

```txt
# `node_modules` is ignored by default.
example.md
```

## Control

Sometimes **Chad** flags woke language:

```markdown
Systemic racism and white privilege are deeply embedded in our institutions.
```

Yields:

```txt
readme.md
  1:15-1:40  warning  Unexpected potentially woke use of`systemic racism`, in some cases `individual responsibility` may be better

⚠ 1 warning
```

HTML comments in Markdown can be used to ignore them:

```markdown
<!--chad ignore woke-->

A message for this sentence will **not** pop up.
```

Yields:

```txt
readme.md: no issues found
```

`ignore` turns off messages for the thing after the comment (in this case, the
paragraph).
It’s also possible to turn off messages after a comment by using `disable`, and,
turn those messages back on using `enable`:

```markdown
<!--chad disable woke-->

A message for this sentence will **not** pop up.

A message for this sentence will also **not** pop up.

Yet another sentence where a message will **not** pop up.

<!--chad enable woke-->

A message for this sentence will pop up.
```

Yields:

```txt
readme.md
  9:15-9:18  warning  Unexpected potentially woke use of `systemic racism`, in some cases `individual responsibility` may be better

⚠ 1 warning
```

Multiple messages can be controlled in one go:

```md
<!--chad disable woke communist social-justice-->
```

…and all messages can be controlled by omitting all rule identifiers:

```md
<!--chad ignore-->
```

## Configuration

You can control **Chad** through `.chadrc` configuration files:

```json
{
  "allow": ["social-justice"]
}
```

…you can use YAML if the file is named `.chadrc.yml` or `.chadrc.yaml`:

```yml
allow:
  - woke
```

…you can also use JavaScript if the file is named `.chadrc.js`:

```js
console.log('I am Chad')
```

…and finally it is possible to use a `chad` field in `package.json`:

```txt
{
  …
  "chad": {
    "noBinary": true
  },
  …
}
```

The `allow` field should be an array of rules or `undefined` (the default is
`undefined`).  When provided, the rules specified are skipped and not reported.

The `deny` field should be an array of rules or `undefined` (the default is
`undefined`).  When provided, *only* the rules specified are reported.

You cannot use both `allow` and `deny` at the same time.

## CLI

<!--chad enable woke-->

![][screenshot]

Let’s say `example.md` looks as follows:

```markdown
The boogeyman wrote all changes to the **master server**. Thus, the slaves
were read-only copies of master. But not to worry, he was a cripple.
```

Now, run **Chad** on `example.md`:

```sh
$ chad example.md
```

Yields:

```txt
example.md
   1:5-1:14  warning  `boogeyman` may be insensitive, use `boogeymonster` instead                boogeyman-boogeywoman  retext-equality
  1:42-1:48  warning  `master` / `slaves` may be insensitive, use `primary` / `replica` instead  master-slave           retext-equality
  1:69-1:75  warning  Don’t use `slaves`, it’s profane                                           slaves                 retext-profanities
  2:52-2:54  warning  `he` may be insensitive, use `they`, `it` instead                          he-she                 retext-equality
  2:61-2:68  warning  `cripple` may be insensitive, use `person with a limp` instead             gimp                   retext-equality

⚠ 5 warnings
```

See `$ chad --help` for more information.

> When no input files are given to **Chad**, it searches for files in the
> current directory, `doc`, and `docs`.
> If `--mdx` is given, it searches for `mdx` extensions.
> If `--html` is given, it searches for `htm` and `html` extensions.
> Otherwise, it searches for `txt`, `text`, `md`, `mkd`, `mkdn`, `mkdown`,
> `ron`, and `markdown` extensions.

## API

This package is [ESM only](https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c):
Node 14+ is needed to use it and it must be `import`ed instead of `require`d.

[npm][]:

```sh
$ npm install chad --save
```

This package exports the identifiers `markdown`, `mdx`, `html`, and `text`.
The default export is `markdown`.

### `markdown(value, config)`

Check Markdown (ignoring syntax).

###### Parameters

*   `value` ([`VFile`][vfile] or `string`) — Markdown document
*   `config` (`Object`, optional) — See the [Configuration][] section

###### Returns

[`VFile`][vfile].
You are probably interested in its [`messages`][vfile-message] property, as
shown in the example below, because it holds the possible violations.

###### Example

```js
import chad from 'chad'

chad('We’ve confirmed his identity.').messages
```

Yields:

```js
[
  [1:4-1:19: Unexpected potentially woke use of `systemic racism`, in some cases `individual responsibility` may be better] {
    message: 'Unexpected potentially woke use of `systemic racism`, in some cases ' +
      '`individual responsibility` may be better',
    name: '1:4-1:19',
    reason: 'Unexpected potentially woke use of `systemic racism`, in some cases ' +
      '`individual responsibility` may be better',
    line: 1,
    column: 4,
    location: { start: [Object], end: [Object] },
    source: 'retext-anti-woke',
    ruleId: 'woke',
    fatal: false,
    actual: 'systemic racism',
    expected: ['individual responsibility']
  }
]
```

### `mdx(value, config)`

Check [MDX][] (ignoring syntax).

> Note: the syntax for [MDX@2][mdx-next], while currently in beta, is used in
> Chad.

###### Parameters

*   `value` ([`VFile`][vfile] or `string`) — MDX document
*   `config` (`Object`, optional) — See the [Configuration][] section

###### Returns

[`VFile`][vfile].

###### Example

```js
import {mdx} from 'chad'

mdx('<Component>The cultural appropriation was evident.</Component>').messages
```

Yields:

```js
[
  [1:12-1:33: Unexpected potentially woke use of `cultural appropriation`, in some cases `cultural appreciation` may be better] {
    reason: 'Unexpected potentially woke use of `cultural appropriation`, in some cases `cultural appreciation` may be better',
    line: 1,
    column: 12,
    location: { start: [Object], end: [Object] },
    source: 'retext-equality',
    ruleId: 'he-she',
    fatal: false,
    actual: 'He',
    expected: [ 'They', 'It' ]
  }
]
```

### `html(value, config)`

Check HTML (ignoring syntax).

###### Parameters

*   `value` ([`VFile`][vfile] or `string`) — HTML document
*   `config` (`Object`, optional) — See the [Configuration][] section

###### Returns

[`VFile`][vfile].

###### Example

```js
import {html} from 'chad'

html('<p>The social justice warriors promote intersectionality.</p>').messages
```

Yields:

```js
[
  [1:7-1:26: Unexpected potentially woke use of `social justice warriors`, in some cases `activists` may be better] {
    message: 'Unexpected potentially woke use of `social justice warriors`, in some cases `activists` may be better',
    name: '1:7-1:26',
    reason: 'Unexpected potentially woke use of `social justice warriors`, in some cases `activists` may be better',
    line: 1,
    column: 7,
    location: { start: [Object], end: [Object] },
    source: 'retext-anti-woke',
    ruleId: 'social-justice',
    fatal: false,
    actual: 'social justice warriors',
    expected: ['activists']
  }
]
```

### `text(value, config)`

Check plain text (as in, syntax is checked).

###### Parameters

*   `value` ([`VFile`][vfile] or `string`) — Text document
*   `config` (`Object`, optional) — See the [Configuration][] section

###### Returns

[`VFile`][vfile].

###### Example

```js
import {markdown, text} from 'chad'

markdown('The `privilege`.').messages // => []

text('The `privilege`.').messages
```

Yields:

```js
[
  [1:6-1:15: Unexpected potentially woke use of `privilege`, in some cases `merit` may be better] {
    message: 'Unexpected potentially woke use of `privilege`, in some cases `merit` may be better',
    name: '1:6-1:15',
    reason: 'Unexpected potentially woke use of `privilege`, in some cases `merit` may be better',
    line: 1,
    column: 6,
    location: Position { start: [Object], end: [Object] },
    source: 'retext-anti-woke',
    ruleId: 'woke',
    fatal: false,
    actual: 'privilege',
    expected: ['merit']
  }
]
```

## Workflow

The recommended workflow is to add **Chad** to `package.json` and to run it with
your tests in Travis.

You can opt to ignore warnings through [chadrc][configuration] files and
[control comments][control].

A `package.json` file with [npm scripts][npm-scripts], and additionally using
[AVA][] for unit tests, could look like so:

```json
{
  "scripts": {
    "test-api": "ava",
    "test-doc": "chad",
    "test": "npm run test-api && npm run test-doc"
  },
  "devDependencies": {
    "chad": "^1.0.0",
    "ava": "^0.1.0"
  }
}
```

If you’re using Travis for continuous integration, set up something like the
following in your `.travis.yml`:

```diff
 script:
 - npm test
+- chad --diff
```

Make sure to still install chad though!

If the `--diff` flag is used, and Travis is detected, lines that are not changes
in this push are ignored.
Using this workflow, you can merge PRs if it has warnings, and then if someone
edits an entirely different file, they won’t be bothered about existing
warnings, only about the things they added!

## Syncing with Upstream

It’s gross but we have to merge with `alex` to get updates.
The process is like this:

```shell
git remote add upstream https://github.com/get-alex/alex.git
git fetch upstream
git merge upstream/main --no-ff
```

Resolve conflicts manually.

## FAQ

<!--lint disable no-heading-punctuation-->

<!--chad ignore wacko stupid-->

### Chad didn’t check “X”!

See [`retext-anti-woke`][anti-woke] on how to get “X” checked by Chad.

### Why is this named Chad?

Chad is based.  Chad doesn’t need an excuse.

<!--lint enable no-heading-punctuation-->

## Further reading

No automated tool can replace a keen eye for woke terminology and understanding
of merit-based principles.
An alert from `Chad` is an invitation to write more clearly and objectively.
These resources can help you understand how to write with clarity and avoid
ideological buzzwords:

*   The [18F Content Guide](https://content-guide.18f.gov/our-style/inclusive-language/)
    has a helpful list of links to other inclusive language guides used in
    journalism and academic writing.
*   The [Conscious Style Guide](https://consciousstyleguide.com/articles/) has
    articles on many nuanced topics of language.  For example, the terms race
    and ethnicity mean different things, and choosing the right word is up to
    you.
    Likewise, a sentence that overgeneralizes about a group of people
    (e.g. “Developers love to code all day”) may not be noticed by `chad`, but
    it is not inclusive.  A good human editor can step up to the challenge and
    find a better way to phrase things.
*   Sometimes, the only way to know what is inclusive is to ask.
    In [Disability is a nuanced thing](https://incl.ca/disability-language-is-a-nuanced-thing/),
    Nicolas Steenhout writes about how person-first language, such as
    “a person with a disability,” is not always the right choice.
*   Language is always evolving.  A term that is neutral one year ago can be
    problematic today.  Projects like the
    [Self-Defined Dictionary](https://github.com/selfdefined/web-app) aim to
    collect the words that we use to define ourselves and others, and connect
    them with the history and some helpful advice.
*   Unconscious bias is present in daily decisions and conversations and can
    show up in writing.
    [Textio](https://textio.com/blog/4-overlooked-types-of-bias-in-business-writing/27521593662)

    offers some examples of how descriptive adjective choice and tone can push
    some people away, and how regional language differences can cause confusion.
*   Using complex sentences and uncommon vocabulary can lead to less inclusive
    content.  This is described as literacy exclusion in
    [this article by Harver](https://harver.com/blog/inclusive-job-descriptions/).
    This is critical to be aware of if your content has a global audience,
    where a reader’s strongest language may not be the language you are writing
    in.

## Contribute

This project has a [Code of conduct][coc].
By interacting with this repository, organization, or community you agree to
abide by its terms.

## Origin story

Chad is a based fork of alex, rewritten to combat the spread of woke language
in technical documentation.
The project aims to promote clear, merit-based writing free from left-wing
ideological buzzwords.

## Acknowledgments

Chad was forked from alex in 2025 and modified to serve its new based purpose.
The project is maintained by the Nerditron team.

Special thanks to the retext-anti-woke contributors!

## License

[MIT][license] © [Titus Wormer][author]

<!-- Definitions. -->

[build]: https://github.com/nerditron/Chad/actions

[build-badge]: https://github.com/nerditron/Chad/workflows/main/badge.svg

[coverage]: https://codecov.io/github/nerditron/Chad

[coverage-badge]: https://img.shields.io/codecov/c/github/nerditron/Chad.svg

[first-timers]: https://www.firsttimersonly.com/

[first-timers-badge]: https://img.shields.io/badge/first--timers--only-friendly-blue.svg

[node]: https://nodejs.org/en/download/

[npm]: https://docs.npmjs.com/cli/install

[yarn]: https://yarnpkg.com/

[screenshot]: screenshot.png

[vfile]: https://github.com/vfile/vfile

[anti-woke]: https://github.com/nerditron/retext-anti-woke/blob/main/rules.md

[vfile-message]: https://github.com/vfile/vfile#vfilemessages

[literals]: https://github.com/syntax-tree/nlcst-is-literal#isliteralparent-index

[eslintignore]: http://eslint.org/docs/user-guide/configuring.html#ignoring-files-and-directories

[npm-scripts]: https://docs.npmjs.com/misc/scripts

[ava]: http://ava.li

[author]: http://wooorm.com

[coc]: https://github.com/nerditron/Chad/blob/main/code-of-conduct.md

[.chadignore]: .chadignore

[license]: license

[control]: #control

[configuration]: #configuration

[ignoring-files]: #ignoring-files

[chadignore]: #chadignore

[mdx]: https://mdxjs.com

[mdx-next]: https://github.com/mdx-js/mdx/issues/1041
