// ==UserScript==
// @name         Enter do816 Giveaways
// @namespace    https://do816.com/giveaways
// @version      2025-03-09
// @description  manually enter Do Network giveaways via a floating button
// @author       You
// @match        https://do816.com/giveaways*
// @match        https://do816.com/events/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=do816.com
// @grant        GM_openInTab
// ==/UserScript==

(function() {
    'use strict';

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

    // Function to check if the page contains an "entries" button and close it
    function checkAndCloseTab() {
        const entryButton = document.querySelector('a.ds-btn-win');
        if (entryButton?.textContent.includes('entries')) {
            window.close();
        }
        entryButton.click();
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
        if (window.location.pathname.startsWith('/giveaways')) {
            createFloatingButton();
        }

        // Check if the current tab was opened by the script
        if (window.location.pathname.startsWith('/events')) {
            checkAndCloseTab();
        }
    });
})();

