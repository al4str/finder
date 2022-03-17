import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import webpack from 'webpack';
import { ROOT_DIR } from '../../constants.js';

class Definitions {
  constructor() {
    /**
     * @type {Map<string, string>}
     * */
    this.map = new Map();
  }
  /**
   * @param {string} name
   * @param {string} value
   * @return {void}
   * */
  add(name, value) {
    this.map.set(name, value);
  }
  /**
   * @return {void}
   * */
  fromEnvironment() {
    try {
      const envPath = path.join(ROOT_DIR, '.env');
      const envRaw = fs.readFileSync(envPath);
      const envRawDefinitions = dotenv.parse(envRaw);
      Object
        .entries(envRawDefinitions)
        .forEach(([name, value]) => {
          this.map.set(name, value);
        });
    }
    catch (err) {
      // silence
    }
  }
  /**
   * @return {Record<string, string>}
   * */
  toObject() {
    return Array
      .from(this.map)
      .reduce((result, [key, value]) => {
        result[`process.env.${key}`] = JSON.stringify(value);
        return result;
      }, {});
  }
}

/**
 * @param {BuildParams} params
 * */
export async function configGetPluginDotenv(params) {
  const { modern } = params;
  const definitions = new Definitions();
  definitions.fromEnvironment();
  definitions.add('NODE_ENV', process.env.NODE_ENV);
  definitions.add('BROWSERSLIST_ENV', process.env.BROWSERSLIST_ENV);
  definitions.add('BUILD_MODERNITY', modern
    ? 'modern'
    : 'legacy');

  return new webpack.DefinePlugin(definitions.toObject());
}
