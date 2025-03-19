/**
 * @typedef {import('nlcst').Root} Root
 * @typedef {import('./filter.js').Options} FilterOptions
 *
 * @typedef {boolean|undefined} NoBinaryOption
 *
 * @typedef {{noBinary: NoBinaryOption}} TextOptions
 *
 * @typedef {{noBinary?: NoBinaryOption} & FilterOptions} OptionsObject
 * @typedef {import('vfile').VFileCompatible} Input
 * @typedef {OptionsObject|string[]|undefined} Options
 */

import {VFile} from 'vfile'
import {unified} from 'unified'
import remarkParse from 'remark-parse'
import remarkGfm from 'remark-gfm'
import remarkFrontmatter from 'remark-frontmatter'
import remarkMdx from 'remark-mdx'
import rehypeParse from 'rehype-parse'
import retextEnglish from 'retext-english'
// @ts-ignore
import retextAntiWoke from 'retext-anti-woke'
import remarkRetext from 'remark-retext'
import rehypeRetext from 'rehype-retext'
import {sort} from 'vfile-sort'
import {filter} from './filter.js'

/** @param {TextOptions} options */
function makeText(options) {
  return unified().use(retextEnglish).use(retextAntiWoke, options)
}

/**
 * Chad’s core.
 *
 * @param {Input} value
 * @param {FilterOptions} options
 * @param {import('unified').Processor<void, Root>} processor
 */
function core(value, options, processor) {
  const file = new VFile(value)
  const tree = processor.use(filter, options).parse(file)

  processor.runSync(tree, file)

  sort(file)

  return file
}

export default markdown

/**
 * Chad (markdown).
 *
 * @param {Input} value
 * @param {Options} [config]
 */
export function markdown(value, config) {
  const options = splitOptions(config)
  return core(
    value,
    options.filter,
    unified()
      .use(remarkParse)
      .use(remarkGfm)
      .use(remarkFrontmatter, ['yaml', 'toml'])
      .use(remarkRetext, makeText(options.text))
  )
}

/**
 * Alex (MDX).
 *
 * @param {Input} value
 * @param {Options} [config]
 */
export function mdx(value, config) {
  const options = splitOptions(config)
  return core(
    value,
    options.filter,
    unified()
      .use(remarkParse)
      .use(remarkMdx)
      .use(remarkRetext, makeText(options.text))
  )
}

/**
 * Alex (HTML).
 *
 * @param {Input} value
 * @param {Options} [config]
 */
export function html(value, config) {
  const options = splitOptions(config)
  return core(
    value,
    options.filter,
    unified().use(rehypeParse).use(rehypeRetext, makeText(options.text))
  )
}

/**
 * Alex (plain text).
 *
 * @param {Input} value
 * @param {Options} [config]
 */
export function text(value, config) {
  const options = splitOptions(config)
  return core(value, options.filter, makeText(options.text))
}

/**
 * @param {Options} options
 */
function splitOptions(options) {
  /** @type {string[]|undefined} */
  let allow
  /** @type {string[]|undefined} */
  let deny
  /** @type {boolean|undefined} */
  let noBinary

  if (Array.isArray(options)) {
    allow = options
  } else if (options) {
    allow = options.allow
    deny = options.deny
    noBinary = options.noBinary
  }

  return {filter: {allow, deny}, text: {noBinary}}
}
