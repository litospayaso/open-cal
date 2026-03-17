import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const isWindows = process.platform === 'win32';
const packageJson = JSON.parse(fs.readFileSync(path.join(rootDir, 'package.json'), 'utf8'));
const version = packageJson.version;

function run(command, cwd = rootDir) {
  console.log(`Executing: ${command}`);
  execSync(command, { stdio: 'inherit', cwd });
}

try {
  run('npx cap sync');
  run('node scripts/fix_java_version.js');

  const androidDir = path.join(rootDir, 'android');
  let buildCmd;

  if (isWindows) {
    buildCmd = 'gradlew.bat assembleDebug';
  } else {
    run('chmod +x gradlew', androidDir);
    const sdkPath = path.join(process.env.HOME, 'Android', 'Sdk');
    let javaHome = process.env.JAVA_HOME;
    
    if (javaHome) {
      console.log(`🔍 Current JAVA_HOME: "${javaHome}"`);
    }

    // Validate JAVA_HOME: if it doesn't exist or matches known problematic patterns
    const isInvalidPath = javaHome && (
      !fs.existsSync(javaHome.replace(/['"]/g, '')) || 
      /\/run\/host\//.test(javaHome) || 
      /flatpak/i.test(javaHome)
    );

    if (isInvalidPath) {
      console.log(`⚠️ JAVA_HOME appears to be invalid or a host-level path. Attempting to resolve...`);
      try {
        const resolvedJava = execSync('readlink -f $(which java)', { encoding: 'utf8' }).trim();
        // The resolved path usually ends with /bin/java, we want the home directory
        javaHome = path.dirname(path.dirname(resolvedJava));
        console.log(`✅ Resolved JAVA_HOME to: ${javaHome}`);
      } catch (e) {
        console.warn('⚠️ Could not resolve JAVA_HOME automatically.');
        // Don't set to null here, we might want to try without it if it's really broken
        // but for now let's keep it as is if we can't resolve, or set to null if it's definitely invalid
        if (!fs.existsSync(javaHome.replace(/['"]/g, ''))) {
           javaHome = null;
        }
      }
    }

    if (fs.existsSync(sdkPath)) {
      if (javaHome) {
        buildCmd = `ANDROID_HOME=${sdkPath} JAVA_HOME=${javaHome} ./gradlew assembleDebug`;
      } else {
        buildCmd = `ANDROID_HOME=${sdkPath} ./gradlew assembleDebug`;
      }
    } else {
      buildCmd = './gradlew assembleDebug';
    }
  }

  run(buildCmd, androidDir);

  const releasesDir = path.join(rootDir, 'releases');
  if (!fs.existsSync(releasesDir)) {
    fs.mkdirSync(releasesDir);
  }

  const sourceApk = path.join(androidDir, 'app', 'build', 'outputs', 'apk', 'debug', 'app-debug.apk');
  const destApk = path.join(releasesDir, `Brote-release_${version}.apk`);

  if (fs.existsSync(sourceApk)) {
    fs.copyFileSync(sourceApk, destApk);
    console.log(`\n✨ APK successfully copied to: ${destApk}\n`);
  } else {
    console.error(`\n❌ Could not find source APK at: ${sourceApk}\n`);
    process.exit(1);
  }

} catch (error) {
  console.error('\n❌ Build failed:', error.message);
  process.exit(1);
}
