/* ============================================================
   launcher.js — UI behaviour for the Minecraft Launcher replica
   ============================================================ */
(function () {
  "use strict";

  /* ------------------------------------------------------------
     GAME INTEGRATION POINT
     --------------------------------------------------------------
     The real game ("novix core 26.1.2") is loaded into an <iframe>
     when PLAY is pressed. Point GAME_URL at your build:

       • Local file (default): drop your saved HTML at  game/index.html
       • A subfolder build:     "game/novix/index.html"
       • A live URL:            "https://your-host.example/novix"

     Because the launcher is served over HTTPS on githack, the game
     it loads must also be reachable over HTTPS (a local file in this
     repo works perfectly).
     ------------------------------------------------------------ */
  var GAME_URL = "game/index.html";

  var LABELS = {
    home: "HOME",
    java: "MINECRAFT: JAVA EDITION",
    bedrock: "MINECRAFT: BEDROCK EDITION",
    dungeons2: "MINECRAFT DUNGEONS II",
    dungeons: "MINECRAFT DUNGEONS",
    legends: "MINECRAFT LEGENDS",
    whatsnew: "WHAT'S NEW",
    settings: "SETTINGS"
  };

  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  /* ---------------- Tab switching (Java views) ---------------- */
  function showTab(name) {
    $$(".tab").forEach(function (t) { t.classList.toggle("active", t.dataset.tab === name); });
    $$(".tab-panel").forEach(function (p) { p.classList.toggle("active", p.dataset.panel === name); });
    if (name === "patch" && window.McNews) window.McNews.loadPatch();
    var sa = $(".scroll-area"); if (sa) sa.scrollTop = 0;
  }

  $$(".tab").forEach(function (t) {
    t.addEventListener("click", function () { showTab(t.dataset.tab); });
  });

  /* ---------------- Sidebar view switching ---------------- */
  var tabsEl = $("#tabs");
  var scrollArea = $(".scroll-area");
  var genericView = null;

  function ensureGeneric() {
    if (!genericView) {
      genericView = document.createElement("section");
      genericView.className = "generic-panel";
      genericView.id = "genericView";
      genericView.style.display = "none";
      scrollArea.appendChild(genericView);
    }
    return genericView;
  }

  function selectView(view) {
    $$("#primaryNav .nav-item, .nav-bottom .nav-item").forEach(function (n) {
      n.classList.toggle("active", n.dataset.view === view);
    });
    $("#contentLabel").textContent = LABELS[view] || "MINECRAFT";

    if (view === "java") {
      tabsEl.style.visibility = "visible";
      $$(".tab-panel").forEach(function (p) { p.style.display = ""; });
      if (genericView) genericView.style.display = "none";
      showTab("play");
    } else {
      tabsEl.style.visibility = "hidden";
      $$(".tab-panel").forEach(function (p) { p.classList.remove("active"); p.style.display = "none"; });
      var g = ensureGeneric();
      g.style.display = "block";
      g.innerHTML =
        '<h1>' + (LABELS[view] || "Minecraft") + '</h1>' +
        '<p>This section is a placeholder in the replica.<br>' +
        'The <b>Minecraft: Java Edition</b> tab is the fully built, playable one &mdash; select it to play.</p>';
      scrollArea.scrollTop = 0;
    }
  }

  $$("#primaryNav .nav-item, .nav-bottom .nav-item").forEach(function (n) {
    n.addEventListener("click", function () { selectView(n.dataset.view); });
  });

  /* ---------------- PLAY -> game overlay ---------------- */
  var overlay = $("#gameOverlay");
  var frame = $("#gameFrame");
  var playBtn = $("#playBtn");

  function launchGame() {
    playBtn.textContent = "LAUNCHING…";
    setTimeout(function () {
      frame.src = GAME_URL;
      overlay.classList.add("open");
      overlay.setAttribute("aria-hidden", "false");
      playBtn.textContent = "PLAY";
    }, 350);
  }
  function closeGame() {
    overlay.classList.remove("open");
    overlay.setAttribute("aria-hidden", "true");
    frame.src = "about:blank"; /* stop the game / free resources */
  }

  if (playBtn) playBtn.addEventListener("click", launchGame);
  $("#gameBack").addEventListener("click", closeGame);
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && overlay.classList.contains("open")) closeGame();
  });
  $$(".play-inline").forEach(function (b) { b.addEventListener("click", launchGame); });

  /* ---------------- Small niceties ---------------- */
  var copyBtn = $(".copy-btn");
  if (copyBtn) copyBtn.addEventListener("click", function () {
    var name = "EvanEnderDragon1";
    if (navigator.clipboard) navigator.clipboard.writeText(name).catch(function () {});
    copyBtn.title = "Copied!";
    setTimeout(function () { copyBtn.title = "Copy username"; }, 1200);
  });

  var giftClose = $(".gift-close");
  if (giftClose) giftClose.addEventListener("click", function () {
    var a = $("#giftAd"); if (a) a.style.display = "none";
  });

})();
