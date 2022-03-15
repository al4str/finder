import path from 'path';

/**
 * @typedef {import('@types/babel-core').PluginObj} BabelPluginObj
 * */

/**
 * @typedef {import('@types/babel-core').types} BabelTypes
 * */

/**
 * @typedef {import('@types/babel-core').types.Comment} BabelComment
 * */

/**
 * Traverses AST in search of dynamic `import(...)`.
 * And prepends webpack's magic comment `webpackChunkName: "..."`
 * if there is none.
 *
 * @param {Object} babel
 * @return {BabelPluginObj}
 */
export default function(babel) {
  /** @type {BabelTypes} */
  const t = babel.types;

  return {
    name: 'webpack-chunk-name',
    visitor: {
      CallExpression(nodePath) {
        if (nodePath.node.callee.type !== 'Import') {
          return;
        }
        const [node] = nodePath.node.arguments;
        const comments = node.leadingComments || [];
        if (!hasWebpackChunkNameComment(comments)) {
          const content = ` webpackChunkName: '${getChunkName(node.value)}' `;
          t.addComment(node, 'leading', content, false);
        }
      },
    },
  };
}

/**
 * @param {Array<BabelComment>} comments
 * @return {boolean}
 * */
function hasWebpackChunkNameComment(comments) {
  if (!comments.length) {
    return false;
  }
  return comments.some((comment) => {
    return comment.value.includes('webpackChunkName');
  });
}

/**
 * @param {string} chunkPath
 * @return {string}
 * */
function getChunkName(chunkPath) {
  const parsed = path.parse(chunkPath);
  return parsed
    .dir
    .split(path.sep)
    .concat([parsed.name])
    .map((name) => name.replace(/\W/i, ''))
    .filter(Boolean)
    .join('--');
}
