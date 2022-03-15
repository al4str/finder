/**
 * @param {BuildParams} params
 * */
export async function configGetPluginAnalyze(params) {
  if (params.analyze) {
    const { BundleAnalyzerPlugin } = await import('webpack-bundle-analyzer');

    return new BundleAnalyzerPlugin({
      openAnalyzer: true,
      analyzerMode: 'static',
      reportTitle: params.modern
        ? 'Modern bundle'
        : 'Legacy bundle',
      reportFilename: params.modern
        ? 'modern-report.html'
        : 'legacy-report.html',
    });
  }
  return null;
}
