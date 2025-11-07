// ==UserScript==
// @name         我超爱distorted face哒
// @namespace    http://tampermonkey.net/
// @version      2025-11-07
// @description  将LINUX DO logo替换为distorted face
// @author       Jason
// @match        https://linux.do/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=linux.do
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // 感谢ChatGPT
    // 好表情，爱死了 https://linux.do/uploads/default/original/4X/f/6/8/f680d255414881633cc892f3daeacfa57c94ee01.svg
    // 原logo，大 https://linux.do/uploads/default/original/4X/d/1/4/d146c68151340881c884d95e0da4acdf369258c6.png
    // 原logo，小 https://linux.do/uploads/default/original/4X/c/c/d/ccd8c210609d498cbeb3d5201d4c259348447562.png
    // 上传粗糙的新big logo


    // ======== 配置区域：修改这里的图片地址即可 =========
    const NEW_LOGO_SMALL = 'https://linux.do/uploads/default/original/4X/f/6/8/f680d255414881633cc892f3daeacfa57c94ee01.svg';
    const NEW_LOGO_BIG = 'https://linux.do/uploads/default/original/4X/2/2/f/22fd2373f4717b2815ae7c116e1c12c9f6988760.png';
    const NEW_ALT_TEXT = 'LINUX DO';
    // ===================================================

    /** 替换指定 img 元素的图片 */
    function replaceLogo(imgEl) {
        if (!imgEl || imgEl.dataset.__logoReplaced === '1') return;

        const isSmall = imgEl.classList.contains('logo-small');
        const isBig = imgEl.classList.contains('logo-big');

        // 按 class 替换不同图片
        let newSrc = isSmall ? NEW_LOGO_SMALL : (isBig ? NEW_LOGO_BIG : null);
        if (!newSrc) return;

        imgEl.src = newSrc;
        imgEl.alt = NEW_ALT_TEXT;
        imgEl.removeAttribute('srcset'); // 移除响应式加载
        imgEl.dataset.__logoReplaced = '1';
    }

    /** 查找并替换所有可能的 logo */
    function scanAndReplaceAll() {
        document.querySelectorAll('#site-logo.logo-small, #site-logo.logo-big').forEach(replaceLogo);
    }

    /** 监听 logo 动态变化（Discourse 是 SPA） */
    const observer = new MutationObserver(() => {
        scanAndReplaceAll();
    });

    function startObserver() {
        // 首次替换
        scanAndReplaceAll();

        // 监听 DOM 变化
        observer.observe(document.body || document.documentElement, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['src', 'class', 'id']
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', startObserver);
    } else {
        startObserver();
    }
})();