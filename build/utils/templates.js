import fs from 'fs';
import path from 'path';
import {
  ROOT_DIR,
  LINK_ITEMS,
  INJECTABLE_KEY_ASSETS,
  INJECTABLE_KEY_CHUNKS,
} from '../constants.js';
import {
  assetsGetStatsOutput,
  assetsGetItemsCopied,
  assetsGetItemsMap,
  assetsGetItemURLByOriginalPath,
  assetsGetChunkGroups,
  assetsSplitChunkGroups,
  assetsGetScriptString,
} from './assets.js';
import {
  tagsCreateItem,
  tagsItemsToString,
  tagsGetItemsGrouped,
  tagsGenerateItems,
} from './tags.js';
import { htmlMinify } from './html.js';

/**
 * @typedef {import('webpack').Stats} Stats
 * */

/**
 * @typedef {import('webpack').MultiStats} MultiStats
 * */

const DOCUMENT_PATH = path.join(ROOT_DIR, 'src/templates/index.html');

/**
 * @param {Object} params
 * @param {boolean} [params.production=true]
 * @param {MultiStats[]} params.statsList
 * @return {string}
 * */
export function templatesRender(params) {
  const {
    production = true,
    statsList = [],
  } = params;
  const tokensMaps = statsList.map((statsItem) => {
    return templatesGetTokens({ stats: statsItem });
  });
  const combinedTokens = templatesMergeTokensMaps(tokensMaps);
  const tokensStringMap = templatesTokensMapToString(combinedTokens);
  const rawHTML = templatesInjectTokens(tokensStringMap);

  templatesThrowIfUnusedTokensFound(rawHTML);

  return production
    ? htmlMinify(rawHTML)
    : rawHTML;
}

/**
 * @param {Object} params
 * @param {Stats} params.stats
 * @return {BuildTemplateTokensMap}
 * */
function templatesGetTokens(params) {
  const { stats } = params;
  const statsOutput = assetsGetStatsOutput(stats);
  const itemsCopied = assetsGetItemsCopied(statsOutput);
  const chunkGroups = assetsGetChunkGroups(statsOutput);
  const { mainGroup, restGroups } = assetsSplitChunkGroups(chunkGroups);
  const mainItems = tagsGenerateItems(mainGroup);
  const mainItemsGrouped = tagsGetItemsGrouped(mainItems);
  const itemsMap = assetsGetItemsMap(itemsCopied);
  const itemsLinks = templatesGenerateLinkItems(itemsCopied, LINK_ITEMS);
  const itemsPreload = mainItemsGrouped.preload;

  return {
    linkTags: tagsItemsToString(itemsLinks),
    prefetchTags: tagsItemsToString(mainItemsGrouped.prefetch),
    preloadTags: tagsItemsToString(itemsPreload),
    styleTags: tagsItemsToString(mainItemsGrouped.style),
    assetsMap: itemsMap,
    chunksMap: restGroups,
    moduleTags: tagsItemsToString(mainItemsGrouped.module),
    nomoduleTags: tagsItemsToString(mainItemsGrouped.nomodule),
  };
}

/**
 * @param {Array<BuildAssetItem>} assetsItems
 * @param {Array<BuildLinkItem>} linkItems
 * @return {Array<BuildTagItem>}
 * */
function templatesGenerateLinkItems(assetsItems, linkItems) {
  return linkItems.map((metaItem) => {
    return tagsCreateItem('link', {
      ...metaItem.attributes,
      href: assetsGetItemURLByOriginalPath(assetsItems, metaItem.originalPath),
    });
  });
}

/**
 * @param {Array<BuildTemplateTokensMap>} tokensMaps
 * @return {BuildTemplateTokensMap}
 * */
function templatesMergeTokensMaps(tokensMaps) {
  /** @type {BuildTemplateTokensMap} */
  const resultMap = {
    linkTags: [],
    prefetchTags: [],
    preloadTags: [],
    styleTags: [],
    assetsMap: {},
    chunksMap: {},
    moduleTags: [],
    nomoduleTags: [],
  };

  tokensMaps.forEach((tokensMap) => {
    ['linkTags', 'prefetchTags',
      'preloadTags', 'styleTags', 'moduleTags',
      'nomoduleTags'].forEach((name) => {
      /** @type {Array<string>} */
      const tags = tokensMap[name];
      tags.forEach((tag) => {
        if (!resultMap[name].includes(tag)) {
          resultMap[name].push(tag);
        }
      });
    });

    Object
      .entries(tokensMap.assetsMap)
      .forEach(([originalPath, url]) => {
        if (!(originalPath in resultMap.assetsMap)) {
          resultMap.assetsMap[originalPath] = url;
        }
      });

    Object
      .entries(tokensMap.chunksMap)
      .forEach(([chunkName, urls]) => {
        /** @type {Array<string>} */
        const prevURLs = resultMap.chunksMap[chunkName] || [];
        urls.forEach((url) => {
          if (!prevURLs.includes(url)) {
            resultMap.chunksMap[chunkName] = prevURLs.concat([url]);
          }
        });
      });
  });

  return resultMap;
}

/**
 * @param {BuildTemplateTokensMap} tokensMap
 * @return {BuildTemplateTokensStringMap}
 * */
function templatesTokensMapToString(tokensMap) {
  return {
    linkTags: tokensMap.linkTags.join('\n'),
    prefetchTags: tokensMap.prefetchTags.join('\n'),
    preloadTags: tokensMap.preloadTags.join('\n'),
    styleTags: tokensMap.styleTags.join('\n'),
    assetsMap: assetsGetScriptString(INJECTABLE_KEY_ASSETS, tokensMap.assetsMap),
    chunksMap: assetsGetScriptString(INJECTABLE_KEY_CHUNKS, tokensMap.chunksMap),
    moduleTags: tokensMap.moduleTags.join('\n'),
    nomoduleTags: tokensMap.nomoduleTags.join('\n'),
  };
}

/**
 * @param {BuildTemplateTokensStringMap} tokensStringMap
 * @return {string}
 * */
function templatesInjectTokens(tokensStringMap) {
  const templateContent = fs
    .readFileSync(DOCUMENT_PATH)
    .toString();

  return Object
    .entries(tokensStringMap)
    .reduce((result, [name, value]) => {
      return result.replace(`{{${name}}}`, value);
    }, templateContent);
}

/**
 * @param {string} html
 * @return {void}
 * */
function templatesThrowIfUnusedTokensFound(html) {
  const matches = /{{(\w+)}}/i.exec(html);
  if (matches) {
    const tokens = matches
      .slice(1)
      .map((token) => `"${token}"`)
      .join(', ');

    throw new Error(`Unused HTML token(s): ${tokens}`);
  }
}
