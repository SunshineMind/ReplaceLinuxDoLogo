// ==UserScript==
// @name         我超爱distorted face哒
// @namespace    http://smjx.cc
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
    // 感谢Gemini修复
    
    // ======== 配置区域：修改这里的图片地址即可 =========
    const NEW_LOGO_SMALL = 'https://linux.do/uploads/default/original/4X/f/6/8/f680d255414881633cc892f3daeacfa57c94ee01.svg';
    const NEW_LOGO_BIG = 'https://linux.do/uploads/default/original/4X/2/2/f/22fd2373f4717b2815ae7c116e1c12c9f6988760.png';
    const NEW_ALT_TEXT = '我超爱distorted face哒';
    // ===================================================

    /** 替换指定 img 元素的图片，并处理其父级 picture/source */
    function replaceLogo(imgEl) {
        if (!imgEl || imgEl.dataset.__logoReplaced === '1') return;

        const isSmall = imgEl.classList.contains('logo-small');
        const isBig = imgEl.classList.contains('logo-big');

        // 确定要替换的图片地址
        let newSrc = isSmall ? NEW_LOGO_SMALL : (isBig ? NEW_LOGO_BIG : null);
        if (!newSrc) return;

        // 1. 处理父级 <picture> 和 <source> 元素 (Discourse Logo)
        const pictureEl = imgEl.closest('picture');
        if (pictureEl) {
            // 查找所有 <source> 元素，并替换它们的 srcset
            // Discourse 通常会用 <source media="(prefers-color-scheme: dark)"> 来设置大 Logo 的深色模式
            pictureEl.querySelectorAll('source').forEach(sourceEl => {
                // 仅替换大 Logo 对应的 source
                if (isBig) {
                    // 对于大 Logo，srcset 应该指向大 Logo 图片
                    sourceEl.srcset = newSrc;
                } else if (isSmall) {
                    // 对于小 Logo，移除 srcset 或确保它不指向大 Logo 图片
                    sourceEl.removeAttribute('srcset');
                }
            });
        }

        // 2. 处理 img 元素本身
        imgEl.src = newSrc;
        imgEl.alt = NEW_ALT_TEXT;
        imgEl.removeAttribute('srcset'); // 移除 img 上的响应式加载
        imgEl.dataset.__logoReplaced = '1';
    }

    /** 查找并替换所有可能的 logo */
    function scanAndReplaceAll() {
        // 选择器保持不变，但逻辑现在可以处理 picture/source 结构
        document.querySelectorAll('#site-logo.logo-small, .logo-small, #site-logo.logo-big, .logo-big').forEach(replaceLogo);
    }

    /** 监听 logo 动态变化（Discourse 是 SPA） */
    const observer = new MutationObserver(() => {
        // 增加延时以确保元素完全渲染，有时 Discourse 样式会在元素出现后短暂修改
        setTimeout(scanAndReplaceAll, 50);
    });

    function startObserver() {
        // 首次替换
        scanAndReplaceAll();

        // 监听 DOM 变化
        observer.observe(document.body || document.documentElement, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['src', 'class', 'id', 'srcset'] // 增加监听 srcset 变化
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', startObserver);
    } else {
        startObserver();
    }
})();