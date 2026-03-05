// ==UserScript==
// @id             iitc-plugin-log-downloader-yanwest-v5-3-0@aminosup
// @name           IITC: Log Downloader (Yanwest Pro V5.3.0)
// @category       Utility
// @version        5.3.0
// @description    Fully compatible with Ingress Log Web v1.6.19. RES=1, ENL=0.
// @include        https://intel.ingress.com/*
// @grant          none
// ==/UserScript==

(function() {
    'use strict';

    function setup() {
        const downloadLogs = () => {
            const c = window.chat;
            if (!c) { alert("IITCが見つかりません。"); return; }

            // データの取得元とチャンネル名の紐付け
            const sources = [
                { data: (c._public || {}).data, channel: "all" },
                { data: (c._faction || {}).data, channel: "faction" },
                { data: (c._alerts || {}).data, channel: "alerts" }
            ].filter(s => s.data && Object.keys(s.data).length > 0);

            if (sources.length === 0) {
                alert("抽出可能なログがありません。COMMをスクロールして読み込ませてください。");
                return;
            }

            // 解析ツール側の定義に完全準拠: 1 = RES (青), 0 = ENL (緑)
            const mapTeam = (t) => {
                if (t === 'RESISTANCE' || t === 1 || t === '1') return 1; 
                if (t === 'ENLIGHTENED' || t === 2 || t === '2') return 0;
                return -1;
            };

            let allLogs = [];
            sources.forEach(src => {
                Object.keys(src.data).forEach(k => {
                    try {
                        const it = src.data[k];
                        const p = it[4] || it; // Plextデータ
                        if (!p || !p.markup) return;
                        
                        // メッセージ本文(msg)の生成
                        const fullMsg = p.markup.map(m => m[1].plain).join(' ');

                        let portal = { n: "", lat: 0, lng: 0, team: null };
                        p.markup.forEach(m => {
                            if (m[0] === 'PORTAL') {
                                portal.n = m[1].name || "";
                                portal.lat = m[1].latE6 || 0;
                                portal.lng = m[1].lngE6 || 0;
                                portal.team = mapTeam(m[1].team);
                            }
                        });

                        allLogs.push({
                            "id": (p.guid || k).toString().replace('.d', ''),
                            "time": new Date(it[0]).toISOString(),
                            // 行動種別の簡易判定
                            "type": fullMsg.includes('captured') ? 1 : (fullMsg.includes('deployed') ? 5 : (fullMsg.includes('linked') ? 6 : 0)),
                            "playerName": it[3] || (p.player ? p.player.name : ""),
                            "playerTeam": mapTeam(p.player ? p.player.team : p.team),
                            "portalName": portal.n,
                            "portalLat": portal.lat,
                            "portalLng": portal.lng,
                            "portalTeam": portal.team,
                            // パスなしの正しいポータルリンク形式
                            "portalLink": portal.lat ? `https://intel.ingress.com/?ll=${portal.lat/1e6},${portal.lng/1e6}&z=17&pll=${portal.lat/1e6},${portal.lng/1e6}` : "",
                            "msg": fullMsg,
                            "channel": src.channel
                        });
                    } catch(e) {}
                });
            });

            if (allLogs.length === 0) {
                alert("有効なデータを抽出できませんでした。");
                return;
            }

            // JSONファイルの書き出し
            const blob = new Blob([JSON.stringify(allLogs, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            const timestamp = new Date().getTime();
            a.href = url;
            a.download = `ingress_full_log_${timestamp}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        };

        // ボタンの設置（リトライ機能付き）
        const injectButton = () => {
            const tb = document.getElementById('toolbox');
            if (!tb) { setTimeout(injectButton, 1000); return; }
            if (document.getElementById('ld-btn')) return;

            const btn = document.createElement('a');
            btn.id = 'ld-btn';
            btn.innerHTML = '📥 Log Download';
            btn.style.cursor = 'pointer';
            btn.title = 'Download Logs for Yanwest Analysis Tool';
            btn.onclick = (e) => { e.preventDefault(); downloadLogs(); };
            tb.appendChild(btn);
        };

        injectButton();
    }

    // IITCのブートサイクルに合わせた初期化
    if (window.iitcLoaded) setup();
    else {
        if (!window.bootPlugins) window.bootPlugins = [];
        window.bootPlugins.push(setup);
    }
})();
