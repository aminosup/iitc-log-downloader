// ==UserScript==
// @id             iitc-plugin-chat-buffer-expander-yanwest@aminosup
// @name           IITC: Chat Buffer Expander (50,000行対応版)
// @category       Utility
// @version        1.2.0
// @namespace      https://github.com/aminosup/iitc-log-downloader
// @description    IITCのチャット保持量を50,000行に拡張し、過去ログを自動取得する機能を追加します。
// @author         yanwest
// @include        https://intel.ingress.com/*
// @grant          none
// @updateURL      https://github.com/aminosup/iitc-log-downloader/raw/main/IITC_Chat_Buffer_Expander.user.js
// @downloadURL    https://github.com/aminosup/iitc-log-downloader/raw/main/IITC_Chat_Buffer_Expander.user.js
// ==/UserScript==

(function() {
    'use strict';

    function setup() {
        // 1. メモリ保持量を 50,000 行に設定
        // ブラウザのメモリ消費が増えるため、PCのスペックに応じて注意してください。
        window.CHAT_MAX_LINES = 50000; 

        const autoFetch = async () => {
            const input = prompt("過去ログを何回遡りますか？\n(1回のリクエストで最大50行程度取得されます)", "100");
            if (!input) return;
            
            const count = parseInt(input);
            if (isNaN(count)) return;

            for (let i = 0; i < count; i++) {
                console.log(`取得中... ${i + 1} / ${count} (目標: 約${count * 50}行)`);
                
                if (window.chat && window.chat.requestPublic) {
                    // true を渡すことで古いログをリクエスト
                    window.chat.requestPublic(true); 
                }
                
                // サーバー負荷と検知回避のため、3.5秒〜5.5秒のランダムな待機時間を設定
                await new Promise(resolve => setTimeout(resolve, 3500 + Math.random() * 2000));
                
                // 読み込みを安定させるため、チャットボックスの表示位置を調整
                const chatBox = document.getElementById('chatall');
                if (chatBox) chatBox.scrollTop = 0;
            }
            alert("自動取得が完了しました。\nLog Downloaderを使用して保存してください。");
        };

        // Toolboxへのボタン設置
        const injectButton = () => {
            const tb = document.getElementById('toolbox');
            if (!tb || document.getElementById('auto-scroll-btn')) return;
            
            const btn = document.createElement('a');
            btn.id = 'auto-scroll-btn';
            btn.innerHTML = '🔄 Auto Fetch (50k)';
            btn.title = '過去ログを自動で読み込みます (最大50,000行)';
            btn.style.cursor = 'pointer';
            btn.onclick = (e) => { e.preventDefault(); autoFetch(); };
            tb.appendChild(btn);
        };

        injectButton();
    }

    // IITCの初期化に合わせて実行
    if (window.iitcLoaded) {
        setup();
    } else {
        if (!window.bootPlugins) window.bootPlugins = [];
        window.bootPlugins.push(setup);
    }
})();
