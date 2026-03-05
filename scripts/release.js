import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const packageJson = JSON.parse(fs.readFileSync(path.join(rootDir, 'package.json'), 'utf8'));
const version = packageJson.version;
const tagName = `v${version}`;

function run(command) {
  console.log(`Executing: ${command}`);
  return execSync(command, { encoding: 'utf8' }).trim();
}

try {
  console.log('Extracting release notes from CHANGELOG.md...');
  const changelogPath = path.join(rootDir, 'CHANGELOG.md');
  let releaseNotes = `Release ${tagName}`;

  if (fs.existsSync(changelogPath)) {
    const changelog = fs.readFileSync(changelogPath, 'utf8');
    const versionHeader = `## ${version}`;
    const nextVersionHeader = /## \d+\.\d+\.\d+/g;

    const startIndex = changelog.indexOf(versionHeader);
    if (startIndex !== -1) {
      const contentAfterVersion = changelog.substring(startIndex + versionHeader.length);
      const nextHeaderMatch = nextVersionHeader.exec(contentAfterVersion);
      const endIndex = nextHeaderMatch ? nextHeaderMatch.index : contentAfterVersion.length;
      releaseNotes = contentAfterVersion.substring(0, endIndex).trim();
    }
  }

  console.log('Finding the latest APK in the releases folder...');
  const releasesDir = path.join(rootDir, 'releases');
  let latestApk = null;

  if (fs.existsSync(releasesDir)) {
    const files = fs.readdirSync(releasesDir)
      .filter(file => file.endsWith('.apk'))
      .map(file => ({
        name: file,
        time: fs.statSync(path.join(releasesDir, file)).mtime.getTime()
      }))
      .sort((a, b) => b.time - a.time);

    if (files.length > 0) {
      latestApk = path.join(releasesDir, files[0].name);
    }
  }

  if (!latestApk) {
    console.error('❌ No APK found in the releases folder.');
    process.exit(1);
  }

  console.log(`Using APK: ${latestApk}`);

  console.log(`Creating GitHub release ${tagName}...`);

  try {
    const existingRelease = run(`gh release view ${tagName} --json tagName`);
    if (existingRelease) {
      console.log(`⚠️ Release ${tagName} already exists. Updating...`);
      run(`gh release upload ${tagName} "${latestApk}" --clobber`);
      run(`gh release edit ${tagName} --notes "${releaseNotes}"`);
    }
  } catch (err) {
    run(`gh release create ${tagName} "${latestApk}" --title "Release ${tagName}" --notes "${releaseNotes}"`);
  }

  const releaseUrl = run(`gh release view ${tagName} --json url --template "{{.url}}"`);
  console.log(`\n✨ Successfully created/updated GitHub release: ${releaseUrl}`);

} catch (error) {
  console.error('\n❌ Release failed:', error.message);
  process.exit(1);
}
