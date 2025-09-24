#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const DIST_DIR = path.join(__dirname, '..', 'dist');
const REQUIRED_FILES = [
    'keys-ui.umd.js',
    'keys-ui.es.js',
    'keys-ui.min.js',
    'style.css'
];

console.log('🔍 Verifying Keys UI build assets...');

let allValid = true;

// Check if dist directory exists
if (!fs.existsSync(DIST_DIR)) {
    console.error('❌ dist/ directory not found');
    process.exit(1);
}

// Check each required file
for (const file of REQUIRED_FILES) {
    const filePath = path.join(DIST_DIR, file);

    if (!fs.existsSync(filePath)) {
        console.error(`❌ ${file} not found`);
        allValid = false;
        continue;
    }

    const stats = fs.statSync(filePath);
    const sizeKB = Math.round(stats.size / 1024);

    // Basic size validation
    if (stats.size === 0) {
        console.error(`❌ ${file} is empty`);
        allValid = false;
    } else if (file.includes('.js') && sizeKB < 10) {
        console.warn(`⚠️  ${file} seems unusually small (${sizeKB}KB)`);
    } else {
        console.log(`✅ ${file} (${sizeKB}KB)`);
    }
}

// Check JavaScript content
const umdPath = path.join(DIST_DIR, 'keys-ui.umd.js');
if (fs.existsSync(umdPath)) {
    const content = fs.readFileSync(umdPath, 'utf8');

    const requiredExports = ['KeysUI', 'FormActions', 'initializeKeysUI'];
    const missingExports = requiredExports.filter(exp => !content.includes(exp));

    if (missingExports.length > 0) {
        console.error(`❌ Missing exports in UMD build: ${missingExports.join(', ')}`);
        allValid = false;
    } else {
        console.log('✅ JavaScript exports verified');
    }
}

// Check CSS content
const cssPath = path.join(DIST_DIR, 'style.css');
if (fs.existsSync(cssPath)) {
    const cssContent = fs.readFileSync(cssPath, 'utf8');

    if (cssContent.trim().length === 0) {
        console.error('❌ CSS file is empty');
        allValid = false;
    } else {
        console.log('✅ CSS content verified');
    }
}

if (allValid) {
    console.log('\n🎉 All build assets verified successfully!');
    process.exit(0);
} else {
    console.log('\n💥 Build verification failed!');
    process.exit(1);
}