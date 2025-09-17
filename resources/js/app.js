import './bootstrap';
import { initializeKeysUI } from '@packages/keys-ui/resources/js/index.ts';

// Initialize Keys UI components when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initializeKeysUI();
});
