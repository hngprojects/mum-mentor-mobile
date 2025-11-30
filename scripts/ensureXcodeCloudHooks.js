const fs = require('fs');
const path = require('path');

const TARGET_DIR = path.join(__dirname, '..', 'ios', 'ci_scripts');

const templatePath = path.join(__dirname, 'ci_post_clone_template.sh');
const targetPath = path.join(TARGET_DIR, 'ci_post_clone.sh');

/**
 * Ensures the target script exists by copying it from the committed template.
 */
function ensureXcodeCloudHook() {
    // 1. Check if the committed template exists
    if (!fs.existsSync(templatePath)) {
        console.error(`\nERROR: Cannot find template file at ${templatePath}`);
        console.error("Please ensure the template is created and committed to scripts/.\n");
        process.exit(1);
    }

    // 2. Ensure the target directory exists (ios/ci_scripts)
    if (!fs.existsSync(TARGET_DIR)) {
        fs.mkdirSync(TARGET_DIR, {recursive: true});
    }

    // 3. Copy the template to the target location
    try {
        const templateContent = fs.readFileSync(templatePath, 'utf8');
        fs.writeFileSync(targetPath, templateContent);

        // 4. Ensure the file is executable
        fs.chmodSync(targetPath, 0o755);

        console.log(`\nGenerated required Xcode Cloud hook: ${targetPath}`);

    } catch (error) {
        console.error(`\nFailed to generate hook file ${targetPath}:`, error.message);
        process.exit(1);
    }
}

ensureXcodeCloudHook();