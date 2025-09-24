#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const PACKAGE_JSON_PATH = path.join(__dirname, '..', 'package.json');
const COMPOSER_JSON_PATH = path.join(__dirname, '..', 'composer.json');

console.log('🔄 Syncing version between package.json and composer.json...');

// Read package.json
if (!fs.existsSync(PACKAGE_JSON_PATH)) {
    console.error('❌ package.json not found');
    process.exit(1);
}

const packageJson = JSON.parse(fs.readFileSync(PACKAGE_JSON_PATH, 'utf8'));
const packageVersion = packageJson.version;

if (!packageVersion) {
    console.error('❌ No version found in package.json');
    process.exit(1);
}

// Read composer.json
if (!fs.existsSync(COMPOSER_JSON_PATH)) {
    console.error('❌ composer.json not found');
    process.exit(1);
}

const composerJson = JSON.parse(fs.readFileSync(COMPOSER_JSON_PATH, 'utf8'));
const composerVersion = composerJson.version;

console.log(`📦 package.json version: ${packageVersion}`);
console.log(`🎼 composer.json version: ${composerVersion || 'not set'}`);

// Check if they match
if (composerVersion === packageVersion) {
    console.log('✅ Versions are already in sync');
    process.exit(0);
}

// Update composer.json version
composerJson.version = packageVersion;

// Write back to composer.json
fs.writeFileSync(COMPOSER_JSON_PATH, JSON.stringify(composerJson, null, 4) + '\n');

console.log(`✅ Updated composer.json version to ${packageVersion}`);

// Also update config file if it exists
const configPath = path.join(__dirname, '..', 'config', 'keys-ui.php');
if (fs.existsSync(configPath)) {
    let configContent = fs.readFileSync(configPath, 'utf8');

    // Update version in config file
    const versionRegex = /'version'\s*=>\s*'[^']*'/;
    if (versionRegex.test(configContent)) {
        configContent = configContent.replace(versionRegex, `'version' => '${packageVersion}'`);
        fs.writeFileSync(configPath, configContent);
        console.log(`✅ Updated config version to ${packageVersion}`);
    }
}

console.log('\n🎉 Version synchronization complete!');