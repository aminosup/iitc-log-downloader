// ==UserScript==
// @id             iitc-plugin-log-downloader-yanwest-v5@aminosup
// @name           IITC: Log Downloader (Yanwest Pro V5.4.0)
// @category       Utility
// @version        5.4.0
// @description    Adds 'downloader' field to identify the person who fetched the logs.
// @include        https://intel.ingress.com/*
// @grant          none
// ==/UserScript==

(function() {
    'use strict';

    function setup() {
        const downloadLogs = () => {
            const c = window.chat;
            const downloaderName = (window.PLAYER && window.PLAYER.nickname) ? window.PLAYER.nickname : "";
            
            const sources = [
                { data: (c._public || {}).data, channel: "all" },
                { data: (c._faction || {}).data, channel: "faction" },
                { data: (c._alerts || {}).data, channel: "alerts" }
            ].filter(s => s.data && Object.keys(s.data).length > 0);

            if (sources.length === 0) { alert("ログデータが見つかりません。"); return; }

            const mapTeam = (t) => {
                if (t === 'ENLIGHTENED' || t === 1) return 0;
                if (t === 'RESISTANCE' || t === 2) return 1;
                return -1;
            };

            let allLogs = [];
            sources.forEach(src => {
                Object.keys(src.data).forEach(k => {
                    try {
                        const it = src.data[k];
                        const p = it[4] || it;
                        if (!p || !p.markup) return;
                        const fullMsg = p.markup.map(m => m[1].plain).join(' ');
                        let portal = { n: "", lat: 0, lng: 0, team: null };
                        p.markup.forEach(m => {
                            if (m[0] === 'PORTAL') {
                                portal.n = m[1].name; portal.lat = m[1].latE6; portal.lng = m[1].lngE6;
                                portal.team = mapTeam(m[1].team);
                            }
                        });

                        allLogs.push({
                            "downloader": downloaderName, // ログインユーザー名を記録
                            "id": (p.guid || k).toString().replace('.d', ''),
                            "time": new Date(it[0]).toISOString(),
                            "type": fullMsg.includes('captured') ? 1 : (fullMsg.includes('deployed') ? 5 : (fullMsg.includes('linked') ? 6 : 0)),
                            "playerName": it[3] || (p.player ? p.player.name : ""),
                            "playerTeam": mapTeam(p.player ? p.player.team : p.team),
                            "portalName": portal.n,
                            "portalLat": portal.lat,
                            "portalLng": portal.lng,
                            "portalTeam": portal.team,
                            "portalLink": portal.lat ? `https://intel.ingress.com/?ll=${portal.lat/1e6},${portal.lng/1e6}&z=17&pll=${portal.lat/1e6},${portal.lng/1e6}` : "",
                            "msg": fullMsg,
                            "channel": src.channel
                        });
                    } catch(e) {}
                });
            });

            const blob = new Blob([JSON.stringify(allLogs, null, 2)], { type: 'application/json' });
            const a = document.createElement('a');
            a.href = URL.createObjectURL(blob);
            a.download = `ingress_log_v5.4.0_${new Date().getTime()}.json`;
            a.click();
        };

        const inject = () => {
            const tb = document.getElementById('toolbox');
            if (!tb || document.getElementById('ld-btn')) return;
            const btn = document.createElement('a');
            btn.id = 'ld-btn'; btn.innerHTML = '📥 Log Download'; btn.style.cursor = 'pointer';
            btn.onclick = (e) => { e.preventDefault(); downloadLogs(); };
            tb.appendChild(btn);
        };
        inject();
    }
    if (window.iitcLoaded) setup();
    else { if (!window.bootPlugins) window.bootPlugins = []; window.bootPlugins.push(setup); }
})();
