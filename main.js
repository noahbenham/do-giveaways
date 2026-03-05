// ==UserScript==
// @name         Enter do816 Giveaways
// @namespace    https://do816.com/giveaways
// @version      2025-03-09
// @description  manually enter Do Network giveaways via a floating button with autofill
// @author       You
// @match        https://do816.com/giveaways*
// @match        https://do816.com/events/*
// @match        *://*/*giveaway*
// @match        *://*/sweepstakes/*
// @match        *://*/contest/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=do816.com
// @grant        GM_openInTab
// ==/UserScript==

(function() {
    'use strict';

    // ========================================
    // PERSONAL INFO - FILL IN YOUR DETAILS
    // ========================================
    const PERSONAL_INFO = {
        firstName: '',
        lastName: '',
        email: '',
        zipCode: '',
        phone: ''
    };
    // ========================================

    const BASE_URL = 'https://do816.com';

    // Function to open links in background tabs
    function openGiveawayLinks() {
        document.querySelectorAll('a.ds-btn-win').forEach(link => {
            let url = link.getAttribute('data-clipboard-goto');
            if (url && !url.startsWith('http')) {
                url = BASE_URL + url;
            }
            if (url) {
                GM_openInTab(url, { active: false });
            }
        });
    }

    // Function to handle DO816 event pages - click button and wait for modal
    function checkAndCloseTab() {
        const entryButton = document.querySelector('a.ds-btn-win');

        // If already entered, close tab
        if (entryButton?.textContent.includes('entries')) {
            console.log('Already entered, closing tab');
            window.close();
            return;
        }

        // Click the button to open the modal
        if (entryButton) {
            console.log('Clicking entry button to open modal...');
            entryButton.click();

            // Wait for modal to appear, then autofill
            setTimeout(() => {
                console.log('Looking for form in modal...');
                tryAutofill();
            }, 1500);
        }
    }

    // AUTOFILL FUNCTIONALITY FOR GIVEAWAY FORMS
    function tryAutofill() {
        console.log('🔍 Searching for form fields...');

        // Find common form field patterns
        const firstNameField = document.querySelector(
            'input[name*="first" i], ' +
            'input[placeholder*="first" i], ' +
            'input[id*="first" i], ' +
            'input[autocomplete="given-name"]'
        );

        const lastNameField = document.querySelector(
            'input[name*="last" i], ' +
            'input[placeholder*="last" i], ' +
            'input[id*="last" i], ' +
            'input[autocomplete="family-name"]'
        );

        const emailField = document.querySelector(
            'input[type="email"], ' +
            'input[name*="email" i], ' +
            'input[placeholder*="email" i]'
        );

        const zipcodeField = document.querySelector(
            'input[name*="zip" i], ' +
            'input[placeholder*="zip" i], ' +
            'input[id*="zip" i], ' +
            'input[autocomplete="postal-code"]'
        );

        const phoneField = document.querySelector(
            'input[type="tel"], ' +
            'input[name*="phone" i], ' +
            'input[name*="mobile" i], ' +
            'input[placeholder*="phone" i]'
        );

        // Check if we found any fields
        const foundFields = [firstNameField, lastNameField, emailField, zipcodeField, phoneField].filter(f => f);
        if (foundFields.length === 0) {
            console.log('⚠️  No form fields found on this page');
            return;
        }

        console.log(`Found ${foundFields.length} form field(s)`);

        // Fill in the fields with hardcoded values
        if (firstNameField && PERSONAL_INFO.firstName) {
            console.log('✅ Filling first name field');
            firstNameField.value = PERSONAL_INFO.firstName;
            firstNameField.dispatchEvent(new Event('input', { bubbles: true }));
            firstNameField.dispatchEvent(new Event('change', { bubbles: true }));
        }

        if (lastNameField && PERSONAL_INFO.lastName) {
            console.log('✅ Filling last name field');
            lastNameField.value = PERSONAL_INFO.lastName;
            lastNameField.dispatchEvent(new Event('input', { bubbles: true }));
            lastNameField.dispatchEvent(new Event('change', { bubbles: true }));
        }

        if (emailField && PERSONAL_INFO.email) {
            console.log('✅ Filling email field');
            emailField.value = PERSONAL_INFO.email;
            emailField.dispatchEvent(new Event('input', { bubbles: true }));
            emailField.dispatchEvent(new Event('change', { bubbles: true }));
        }

        if (zipcodeField && PERSONAL_INFO.zipCode) {
            console.log('✅ Filling zipcode field');
            zipcodeField.value = PERSONAL_INFO.zipCode;
            zipcodeField.dispatchEvent(new Event('input', { bubbles: true }));
            zipcodeField.dispatchEvent(new Event('change', { bubbles: true }));
        }

        if (phoneField && PERSONAL_INFO.phone) {
            console.log('✅ Filling phone field');
            phoneField.value = PERSONAL_INFO.phone;
            phoneField.dispatchEvent(new Event('input', { bubbles: true }));
            phoneField.dispatchEvent(new Event('change', { bubbles: true }));
        }

        // Auto-submit after delay to ensure fields are populated
        console.log('⏳ Waiting for fields to settle, then auto-submitting...');
        setTimeout(() => {
            autoSubmit();
        }, 2000); // Wait 2 seconds then submit

        // Still add button as backup in case auto-submit fails
        addAutoSubmitButton();
    }

    function addAutoSubmitButton() {
        // Create floating button as backup manual trigger
        const button = document.createElement('button');
        button.textContent = '🔄 Auto-Submitting...';
        button.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 999999;
            padding: 15px 25px;
            background: #2196F3;
            color: white;
            border: none;
            border-radius: 8px;
            font-size: 14px;
            font-weight: bold;
            cursor: pointer;
            box-shadow: 0 4px 6px rgba(0,0,0,0.3);
            transition: all 0.3s ease;
            opacity: 0.8;
        `;

        button.onmouseover = () => {
            button.style.opacity = '1';
            button.style.transform = 'scale(1.05)';
        };

        button.onmouseout = () => {
            button.style.opacity = '0.8';
            button.style.transform = 'scale(1)';
        };

        button.onclick = () => {
            console.log('🎯 Manual submit triggered');
            button.textContent = '⚡ Submitting Now...';
            autoSubmit();
        };

        document.body.appendChild(button);
        console.log('✅ Added auto-submit status button (click for manual override)');
    }

    function autoSubmit() {
        // Find submit button
        const submitButton = document.querySelector(
            'button[type="submit"], ' +
            'input[type="submit"], ' +
            'button:contains("Continue"), ' +
            'button:contains("Submit"), ' +
            'button:contains("Enter"), ' +
            'button.btn-primary, ' +
            'button.submit, ' +
            'a.submit'
        ) || Array.from(document.querySelectorAll('button')).find(btn =>
            btn.textContent.match(/continue|submit|enter|next/i)
        );

        if (submitButton) {
            console.log('🎯 Found submit button, clicking...');
            submitButton.click();
            console.log('✅ Form submitted!');

            // If on DO816 events page, close tab after submission
            if (window.location.hostname === 'do816.com' && window.location.pathname.startsWith('/events')) {
                console.log('Closing tab after submission...');
                setTimeout(() => {
                    window.close();
                }, 2000);
            }
        } else {
            console.log('⚠️  Could not find submit button');
            alert('Please click the submit button manually');
        }
    }

    // Function to create a floating button
    function createFloatingButton() {
        const button = document.createElement('button');
        button.innerText = 'Enter Giveaways';
        Object.assign(button.style, {
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            padding: '12px 24px',
            background: '#ff5733',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: 'bold',
            boxShadow: '2px 2px 10px rgba(0, 0, 0, 0.2)',
            transition: 'background 0.3s ease',
            zIndex: '1000'
        });
        button.addEventListener('mouseover', () => button.style.background = '#e04e2c');
        button.addEventListener('mouseout', () => button.style.background = '#ff5733');
        button.addEventListener('click', openGiveawayLinks);
        document.body.appendChild(button);
    }

    // Ensure the page is fully loaded before adding the button
    window.addEventListener('load', function() {
        const hostname = window.location.hostname;
        const pathname = window.location.pathname;

        // DO816 giveaway list page - show button to open all giveaways
        if (hostname === 'do816.com' && pathname.startsWith('/giveaways')) {
            createFloatingButton();
        }
        // DO816 events page - auto-click and close
        else if (hostname === 'do816.com' && pathname.startsWith('/events')) {
            checkAndCloseTab();
        }
        // Any other giveaway/contest/sweepstakes form - enable autofill
        else if (
            pathname.includes('giveaway') ||
            pathname.includes('sweepstakes') ||
            pathname.includes('contest')
        ) {
            console.log('🎯 Giveaway form detected, initializing autofill...');
            setTimeout(() => {
                tryAutofill();
            }, 1000);
        }
    });
})();

