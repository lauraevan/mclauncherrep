/* ============================================================
   launcher.js — UI behaviour for the Minecraft Launcher replica
   ============================================================ */
(function () {
  "use strict";

  /* ------------------------------------------------------------
     GAME INTEGRATION POINT
     --------------------------------------------------------------
     The real game ("novix core 26.1.2") loads into an <iframe> when
     PLAY is pressed. GAME_URL is a LOCAL, bundled file: drop your
     82 MB build in at game/index.html (replacing the placeholder) and
     it loads same-origin — no external host, no CORS, no frame limits.
     See README ("The game") for how to add the large file + host on
     GitHub Pages (githack is unreliable for files this large).
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

  /* ---------------- Mobile drawer ---------------- */
  var sidebar = $(".sidebar"), scrim = $("#sidebarScrim"), menuBtn = $("#menuBtn");
  function setDrawer(open) {
    if (sidebar) sidebar.classList.toggle("open", open);
    if (scrim) scrim.classList.toggle("open", open);
  }
  if (menuBtn) menuBtn.addEventListener("click", function () {
    setDrawer(!(sidebar && sidebar.classList.contains("open")));
  });
  if (scrim) scrim.addEventListener("click", function () { setDrawer(false); });
  /* close the drawer after picking a game/section on mobile */
  $$("#primaryNav .nav-item, .nav-bottom .nav-item").forEach(function (n) {
    n.addEventListener("click", function () { setDrawer(false); });
  });

  /* ---------------- PLAY -> game overlay ---------------- */
  var overlay = $("#gameOverlay");
  var frame = $("#gameFrame");
  var playBtn = $("#playBtn");
  var gameLoading = $("#gameLoading");

  function launchGame() {
    if (gameLoading) gameLoading.style.display = "flex";
    frame.src = GAME_URL;
    overlay.classList.add("open");
    overlay.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }
  function closeGame() {
    overlay.classList.remove("open");
    overlay.setAttribute("aria-hidden", "true");
    frame.src = "about:blank"; /* stop the game / free resources */
    if (gameLoading) gameLoading.style.display = "flex"; /* reset for next launch */
    document.body.style.overflow = "";
  }
  if (frame) frame.addEventListener("load", function () {
    if (frame.src && frame.src.indexOf("about:blank") === -1 && gameLoading) gameLoading.style.display = "none";
  });

  if (playBtn) playBtn.addEventListener("click", launchGame);
  $("#gameBack").addEventListener("click", closeGame);
  var newtab = $("#gameNewtab");
  if (newtab) newtab.addEventListener("click", function () { window.open(GAME_URL, "_blank", "noopener"); });
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
