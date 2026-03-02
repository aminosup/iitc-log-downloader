// ==UserScript==
// @name            IITC plugin: Log Downloader for yanwest
// @category        Info
// @version         0.1.0
// @description     Download Ingress logs (All/Faction) as JSON for analysis tools.
// @id              iitc-plugin-log-downloader-yanwest
// @namespace       https://github.com/h-nis/iitc-log-downloader
// @updateURL       https://github.com/h-nis/iitc-log-downloader/raw/main/LogDownLoader.yanwest.user.js
// @downloadURL     https://github.com/h-nis/iitc-log-downloader/raw/main/LogDownLoader.yanwest.user.js
// @match           https://intel.ingress.com/*
// @grant           none
// ==UserScript==

function wrapper(plugin_info) {
    if (typeof window.plugin !== 'function') window.plugin = function() {};

    window.plugin.logDownloader = function() {};

    window.plugin.logDownloader.download = function() {
        // IITCの内部データから全ログを取得
        const logData = [];
        
        // 全体チャットデータの取得
        if (window.chat && window.chat._all && window.chat._all.data) {
            Object.keys(window.chat._all.data).forEach(guid => {
                const entry = window.chat._all.data[guid];
                logData.push({
                    time: entry[0],
                    playerName: entry[2],
                    msg: entry[3],
                    playerTeam: entry[1] === 'RESISTANCE' ? 1 : 0,
                    channel: 'all',
                    portalName: entry[4] ? entry[4].name : "",
                    portalLat: entry[4] ? entry[4].latE6 : null,
                    portalLng: entry[4] ? entry[4].lngE6 : null
                });
            });
        }

        if (logData.length === 0) {
            alert("ダウンロードできるログがありません。一度チャット欄を開いて読み込んでください。");
            return;
        }

        // JSONとして保存
        const blob = new Blob([JSON.stringify(logData, null, 2)], {type: 'application/json'});
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        const now = new Date();
        const dateStr = now.toISOString().replace(/[:.]/g, '-').slice(0, 19);
        
        a.href = url;
        a.download = `ingress_log_${dateStr}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const setup = function() {
        $('#toolbox').append('<a onclick="window.plugin.logDownloader.download()" title="ログをJSONで保存">📥 Log Download</a>');
    };

    setup.info = plugin_info;
    if (window.iitcLoaded && typeof setup === 'function') setup();
    else if (window.bootPlugins) window.bootPlugins.push(setup);
    else window.addHook('iitcLoaded', setup);
}

const script = document.createElement('script');
const info = {};
if (typeof GM_info !== 'undefined' && GM_info && GM_info.script) info.script = { version: GM_info.script.version, name: GM_info.script.name, description: GM_info.script.description };
script.appendChild(document.createTextNode('(' + wrapper + ')(' + JSON.stringify(info) + ');'));
(document.body || document.head || document.documentElement).appendChild(script);