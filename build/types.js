/**
 * @typedef {Object} BuildParams
 * @property {boolean} production
 * @property {boolean} modern
 * @property {boolean} analyze
 * */

/**
 * @typedef {Object} BuildMetaItem
 * @property {Object<string, string>} attributes
 * */

/**
 * @typedef {Object} BuildLinkItem
 * @property {string} originalPath
 * @property {Object<string, string>} attributes
 * */

/**
 * @typedef {Object} BuildTagItem
 * @property {string} tagName
 * @property {Object<string, string|boolean>} attributes
 * @property {boolean} voidTag
 * */

/**
 * @typedef {string|'prefetch'|'preload'|'modulepreload'} BuildTagHint
 * */

/**
 * @typedef {Object} BuildTemplateTokensMap
 * @property {string[]} linkTags
 * @property {string[]} prefetchTags
 * @property {string[]} preloadTags
 * @property {string[]} styleTags
 * @property {Record<string, string>} assetsMap
 * @property {Record<string, string[]>} chunksMap
 * @property {string[]} moduleTags
 * @property {string[]} nomoduleTags
 * */

/**
 * @typedef {'linkTags'|'prefetchTags'|'preloadTags'
 *   |'styleTags'|'assetsMap'|'chunksMap'|'moduleTags'
 *   |'nomoduleTags'} BuildTemplateTokenName
 * */

/**
 * @typedef {Record<BuildTemplateTokenName, string>} BuildTemplateTokensStringMap
 * */

/**
 * @typedef {Object} BuildTagItemsGrouped
 * @property {BuildTagItem[]} prefetch
 * @property {BuildTagItem[]} preload
 * @property {BuildTagItem[]} style
 * @property {BuildTagItem[]} module
 * @property {BuildTagItem[]} nomodule
 * */

/**
 * @typedef {Record<string, string[]>} BuildChunkGroups
 * */

/**
 * @typedef {Object} BuildAssetItem
 * @property {string} originalPath
 * @property {string} outputPath
 * */

/**
 * @typedef {Object} BuildCompileResults
 * @property {null | Error} err
 * @property {import('webpack').MultiStats} stats
 * */

/**
 * @typedef {Record<string, string>} BuildTargetsConfig
 * */
