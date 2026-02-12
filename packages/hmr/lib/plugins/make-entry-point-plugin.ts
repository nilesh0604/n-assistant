import fs from 'node:fs';
import path from 'node:path';
import type { PluginOption } from 'vite';
import type { OutputOptions, OutputBundle } from 'rollup';

/**
 * make entry point file for content script cache busting
 */
export function makeEntryPointPlugin(): PluginOption {
  const cleanupTargets = new Set<string>();
  const isFirefox = process.env.__FIREFOX__ === 'true';

  return {
    name: 'make-entry-point-plugin',
    generateBundle(options: OutputOptions, bundle: OutputBundle) {
      const outputDir = options.dir;

      if (!outputDir) {
        throw new Error('Output directory not found');
      }

      for (const module of Object.values(bundle)) {
        const moduleInfo = module as any;
        const fileName = path.basename(moduleInfo.fileName);
        const newFileName = fileName.replace('.js', '_dev.js');

        switch (moduleInfo.type) {
          case 'asset':
            if (fileName.endsWith('.map')) {
              cleanupTargets.add(path.resolve(outputDir, fileName));

              const originalFileName = fileName.replace('.map', '');
              const replacedSource = String((moduleInfo as { source: string }).source).replaceAll(originalFileName, newFileName);
              (moduleInfo as { source: string }).source = '';
              fs.writeFileSync(path.resolve(outputDir, newFileName), replacedSource);
              break;
            }
            break;

          case 'chunk': {
            fs.writeFileSync(path.resolve(outputDir, newFileName), (moduleInfo as { code: string }).code);

            if (isFirefox) {
              const contentDirectory = extractContentDir(outputDir);
              (moduleInfo as { code: string }).code = `import(browser.runtime.getURL("${contentDirectory}/${newFileName}"));`;
            } else {
              (moduleInfo as { code: string }).code = `import('./${newFileName}');`;
            }
            break;
          }
        }
      }
    },
    closeBundle() {
      cleanupTargets.forEach(target => {
        fs.unlinkSync(target);
      });
    },
  } as PluginOption;
}

/**
 * Extract content directory from output directory for Firefox
 * @param outputDir
 */
function extractContentDir(outputDir: string) {
  const parts = outputDir.split(path.sep);
  const distIndex = parts.indexOf('dist');

  if (distIndex !== -1 && distIndex < parts.length - 1) {
    return parts.slice(distIndex + 1);
  }

  throw new Error('Output directory does not contain "dist"');
}
