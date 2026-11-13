/* EMIFULL mock v2 — shared script */
(function () {
  "use strict";
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const page = document.body.dataset.page || "";
  const isRecruit = document.body.dataset.site === "recruit";

  /* ---------------- 事業 ---------------- */
  const BIZ = {
    gairai: { name: "外来・入院", color: "var(--biz-gairai)" },
    zaitaku: { name: "在宅医療", color: "var(--biz-zaitaku)" },
    biyou: { name: "美容医療", color: "var(--biz-biyou)" },
    kaigo: { name: "介護", color: "var(--biz-kaigo)" },
    shogai: { name: "障がい福祉", color: "var(--biz-shogai)" },
  };

  /* ---------------- 拠り所（現行サイト掲載の施設名より。所在地は名称・沿革からの推定＝要確認） ---------------- */
  const CITIES = {
    umeda:        { name: "大阪市北区（梅田）", pref: "大阪府", lon: 135.498, lat: 34.700, nx: 0, ny: -6, lx: 20, ly: -4, anchor: "start", hq: true },
    shinsaibashi: { name: "大阪市中央区（心斎橋）", pref: "大阪府", lon: 135.501, lat: 34.673, nx: 6, ny: 8, lx: 18, ly: 4, anchor: "start" },
    tadaoka:      { name: "泉北郡忠岡町", pref: "大阪府", lon: 135.401, lat: 34.487, nx: 8, ny: -6, lx: 18, ly: 0, anchor: "start" },
    kishiwada:    { name: "岸和田市", pref: "大阪府", lon: 135.371, lat: 34.460, nx: -6, ny: 7, lx: -16, ly: 6, anchor: "end" },
    amagasaki:    { name: "尼崎市", pref: "兵庫県", lon: 135.416, lat: 34.733, nx: 0, ny: -4, lx: 4, ly: -22, anchor: "start" },
    nishinomiya:  { name: "西宮市", pref: "兵庫県", lon: 135.342, lat: 34.737, nx: -4, ny: 0, lx: -6, ly: -22, anchor: "end", check: true },
    kobe:         { name: "神戸市", pref: "兵庫県", lon: 135.195, lat: 34.690, nx: 0, ny: 0, lx: 0, ly: -23, anchor: "middle", check: true },
    inami:        { name: "加古郡稲美町", pref: "兵庫県", lon: 134.911, lat: 34.749, nx: 8, ny: 0, lx: 0, ly: -23, anchor: "middle" },
    kakogawa:     { name: "加古川市", pref: "兵庫県", lon: 134.841, lat: 34.757, nx: -4, ny: 4, lx: 0, ly: 24, anchor: "middle" },
    tenri:        { name: "天理市", pref: "奈良県", lon: 135.837, lat: 34.597, nx: 0, ny: 0, lx: 0, ly: -19, anchor: "middle" },
  };
  const FAC = [
    ["ただおかメディカルクリニック", "gairai", "tadaoka", "外来・入院（19床）・医療リハビリ"],
    ["ただおかメディカルクリニック 在宅診療部", "zaitaku", "tadaoka", "訪問診療"],
    ["たろうメディカルクリニック 在宅診療部", "zaitaku", "nishinomiya", "訪問診療"],
    ["尼崎ホームケアクリニック", "zaitaku", "amagasaki", "訪問診療"],
    ["神戸ヒロ在宅クリニック", "zaitaku", "kobe", "訪問診療"],
    ["ミセルクリニック 大阪梅田院", "biyou", "umeda", "医療脱毛・美肌治療"],
    ["アートメイクスタジオ 大阪梅田院", "biyou", "umeda", "アートメイク"],
    ["ReVIOSメンズクリニック 大阪梅田院", "biyou", "umeda", "男性専門"],
    ["ReVIOSメンズクリニック 心斎橋院", "biyou", "shinsaibashi", "男性専門"],
    ["ミセルクリニック 岸和田院", "biyou", "kishiwada", "医療脱毛・美肌治療"],
    ["たろうメディカルクリニック 美容皮膚科", "biyou", "nishinomiya", "美容皮膚科"],
    ["通所リハビリセンター", "kaigo", "tadaoka", "通所リハビリ"],
    ["ナーシングホーム忠岡さつき通り", "kaigo", "tadaoka", "サービス付き高齢者向け住宅"],
    ["ヘルパーステーションさつき通り", "kaigo", "tadaoka", "訪問介護"],
    ["訪問看護ステーションさつき通り", "kaigo", "tadaoka", "訪問看護"],
    ["ケアプランセンターさつき通り", "kaigo", "tadaoka", "居宅介護支援"],
    ["エミフル訪問看護ステーション てんり", "kaigo", "tenri", "訪問看護"],
    ["SORATO（UMIE）いなみ", "shogai", "inami", "児童発達支援・放課後等デイ"],
    ["SORATO てんり", "shogai", "tenri", "児童発達支援・放課後等デイ"],
    ["UMIE てんり", "shogai", "tenri", "放課後等デイサービス"],
    ["BLOOM てんり", "shogai", "tenri", "保育所等訪問支援"],
    ["カラダキッズてんり", "shogai", "tenri", "児童発達支援・放課後等デイ"],
    ["Hinodeシェアホーム天理", "shogai", "tenri", "障がい者グループホーム"],
    ["カラダキッズかこがわ", "shogai", "kakogawa", "児童発達支援・放課後等デイ"],
    ["ジョブカレッジかこがわ（BLOOMかこがわ）", "shogai", "kakogawa", "放課後等デイ・保育所等訪問支援"],
    ["Hinodeシェアホーム加古川", "shogai", "kakogawa", "障がい者グループホーム"],
  ].map(([name, biz, city, note]) => ({ name, biz, city, note }));
  const OUTSIDE = [{ name: "アートメイクラボ 恵比寿院", biz: "biyou", area: "東京都渋谷区" }];
  const UNPLACED = ["相談支援NOAH", "就労継続支援A型・B型（のじぎく）"];
  window.EMI = { BIZ, CITIES, FAC };
  $$("[data-fac-count]").forEach((el) => (el.textContent = FAC.length));
  $$("[data-pref-count]").forEach((el) => (el.textContent = FAC.filter((f) => CITIES[f.city].pref === el.dataset.prefCount).length));

  /* ---------------- 求人（ダミー） ---------------- */
  const FACILITIES = {
    central: { name: "ただおかメディカルクリニック", biz: "外来・入院", area: "大阪府" },
    home: { name: "尼崎ホームケアクリニック", biz: "在宅医療", area: "兵庫県" },
    beauty: { name: "ミセルクリニック 大阪梅田院", biz: "美容医療", area: "大阪府" },
    care: { name: "ナーシングホーム忠岡さつき通り", biz: "介護", area: "大阪府" },
    support: { name: "SORATO てんり", biz: "障がい福祉", area: "奈良県" },
  };
  const JOBS = [
    { id: "j01", title: "病棟看護師（外来・入院）", type: "看護師", emp: "正職員", fac: "central", salary: "月給 000,000円〜000,000円", hours: "日勤 8:30〜17:30／夜勤あり", holiday: "4週8休・年間休日000日", img: "ward-team.jpg", isNew: true },
    { id: "j02", title: "訪問診療の同行看護師", type: "看護師", emp: "正職員", fac: "home", salary: "月給 000,000円〜000,000円", hours: "8:45〜17:45（オンコール当番制）", holiday: "土日祝休み", img: "home-outdoor.jpg", isNew: true },
    { id: "j03", title: "美容クリニック看護師", type: "看護師", emp: "パート", fac: "beauty", salary: "時給 0,000円〜", hours: "10:00〜19:00 シフト制", holiday: "シフト制", img: "outpatient.jpg" },
    { id: "j04", title: "在宅医療を担う常勤医師", type: "医師", emp: "正職員", fac: "home", salary: "年俸 経験・能力を考慮し決定", hours: "8:45〜17:45", holiday: "週休2日", img: "young-doctor.jpg" },
    { id: "j05", title: "外来 非常勤医師（週1日〜）", type: "医師", emp: "非常勤", fac: "central", salary: "日給 経験を考慮し決定", hours: "9:00〜17:00", holiday: "曜日応相談", img: "doctor-consult.jpg" },
    { id: "j06", title: "理学療法士（医療リハビリ）", type: "PT/OT/ST", emp: "正職員", fac: "central", salary: "月給 000,000円〜", hours: "8:30〜17:30", holiday: "4週8休", img: "rehab-pt.jpg", isNew: true },
    { id: "j07", title: "作業療法士（児童発達支援）", type: "PT/OT/ST", emp: "正職員", fac: "support", salary: "月給 000,000円〜", hours: "9:00〜18:00", holiday: "日曜・他シフト", img: "disability-care.jpg" },
    { id: "j08", title: "介護職員（サ高住）", type: "介護・福祉職", emp: "正職員", fac: "care", salary: "月給 000,000円〜（資格手当あり）", hours: "シフト制（夜勤あり）", holiday: "月9日〜", img: "care-staff.jpg" },
    { id: "j09", title: "児童指導員", type: "介護・福祉職", emp: "パート", fac: "support", salary: "時給 0,000円〜", hours: "10:00〜18:00 の間で応相談", holiday: "シフト制", img: "wheelchair-talk.jpg" },
    { id: "j10", title: "受付・カウンセラー", type: "医療事務・本部職", emp: "正職員", fac: "beauty", salary: "月給 000,000円〜", hours: "10:00〜19:00（シフト制）", holiday: "月8日〜", img: "lobby.jpg" },
    { id: "j11", title: "本部 採用・広報スタッフ", type: "医療事務・本部職", emp: "正職員", fac: "beauty", salary: "月給 000,000円〜", hours: "9:00〜18:00", holiday: "土日祝休み", img: "team-laptop.jpg" },
  ];
  JOBS.forEach((j) => { j.area = FACILITIES[j.fac].area; j.facName = FACILITIES[j.fac].name; j.biz = FACILITIES[j.fac].biz; });
  const OPTS = { type: ["医師", "看護師", "PT/OT/ST", "介護・福祉職", "医療事務・本部職"], area: ["大阪府", "兵庫県", "奈良県"], emp: ["正職員", "パート", "非常勤"] };
  Object.assign(window.EMI, { JOBS, FACILITIES, OPTS });

  /* ---------------- 水彩フィルタ ---------------- */
  document.body.insertAdjacentHTML("afterbegin", `<svg width="0" height="0" style="position:absolute" aria-hidden="true"><filter id="wc" x="-20%" y="-20%" width="140%" height="140%"><feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves="3" seed="7"/><feDisplacementMap in="SourceGraphic" scale="22"/></filter></svg>`);

  /* ---------------- Header / Drawer ---------------- */
  const corpNav = [["about.html", "EMIFULLについて", "ABOUT"], ["business.html", "事業案内", "BUSINESS"], ["business.html#locations", "グループマップ", "GROUP MAP"], ["index.html#news", "お知らせ", "NEWS"]];
  const recNav = [["recruit.html#people", "人を知る", "PEOPLE"], ["recruit.html#work", "仕事を知る", "WORK"], ["system.html", "制度・働く環境", "SYSTEM"], ["jobs.html", "求人を探す", "JOBS"], ["recruit.html#faq", "採用Q&A", "FAQ"]];
  const nav = isRecruit ? recNav : corpNav;
  const header = $("#site-header");
  /* 法人サイト：浮遊ピル型ヘッダー＋ドロップダウン */
  const CORP_MENU = [
    { label: "EMIFULL<br>について", text: "EMIFULLについて", href: "about.html", en: "ABOUT", child: [["about.html#message", "理事長メッセージ"], ["about.html#pmvv", "理念（PMVV）"], ["about.html#outline", "法人概要"], ["about.html#history", "沿革"], ["about.html#access", "本部アクセス"]] },
    { label: "事業<br>案内", text: "事業案内", href: "business.html", en: "BUSINESS", child: [["business.html#gairai", "外来・入院"], ["business.html#biyou", "美容医療"], ["business.html#zaitaku", "在宅医療"], ["business.html#kaigo", "介護"], ["business.html#shogai", "障がい福祉"]] },
    { label: "グループ<br>マップ", text: "グループマップ", href: "business.html#locations", en: "GROUP MAP", child: [["business.html#locations", "関西のグループマップ"], ["facility.html", "施設詳細（例）"]] },
    { label: "お知らせ", text: "お知らせ", href: "index.html#news", en: "NEWS" },
  ];
  const ICON = {
    pin: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21s-7-6.2-7-11.5A7 7 0 0119 9.5C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/></svg>',
    mail: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3.5 6.5L12 13l8.5-6.5"/></svg>',
    recruit: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="3.5"/><path d="M5 20c.8-3.6 3.6-5.5 7-5.5s6.2 1.9 7 5.5"/></svg>',
    chev: '<svg class="chev" viewBox="0 0 10 10" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M1.5 3.5L5 7l3.5-3.5"/></svg>',
  };
  if (header && !isRecruit) {
    header.outerHTML = `
    <header class="ch">
      <div class="ch__inner">
        <a class="ch__logo" href="index.html" aria-label="EMIFULL トップページ"><img src="img/logo.webp" alt="EMIFULL" width="220" height="37"><span>医療法人社団<br>EMIFULL</span></a>
        <nav class="ch__nav" aria-label="グローバルナビゲーション"><ul>
          ${CORP_MENU.map((m, i) => m.child
            ? `<li class="has-child"><button class="ch__item" type="button" aria-expanded="false" aria-controls="ch-sub-${i}"><span>${m.label}</span>${ICON.chev}</button>
                 <div class="ch__child" id="ch-sub-${i}"><ul><li><a href="${m.href.split("#")[0]}">${m.text} TOP</a></li>${m.child.map(([h, t]) => `<li><a href="${h}">${t}</a></li>`).join("")}</ul></div></li>`
            : `<li><a class="ch__item" href="${m.href}">${m.label}</a></li>`).join("")}
        </ul></nav>
        <div class="ch__btns">
          <a class="ch__btn is-pc" href="business.html#locations">${ICON.pin}グループマップ</a>
          <a class="ch__btn is-pc" href="contact.html">${ICON.mail}お問い合わせ</a>
          <a class="ch__btn ch__btn--recruit" href="recruit.html">${ICON.recruit}採用情報</a>
          <button class="ch__menu menu-btn" type="button" aria-label="メニューを開く" aria-expanded="false" aria-controls="drawer"><span class="bar"></span><span class="bar"></span><span class="lbl">MENU</span></button>
        </div>
      </div>
    </header>
    <div class="drawer" id="drawer" aria-hidden="true">
      <ul>
        <li><a href="index.html"><span>TOP<small>HOME</small></span></a></li>
        ${CORP_MENU.map((m) => `<li><a href="${m.href}"><span>${m.text}<small>${m.en}</small></span></a>${m.child ? `<ul class="drawer-sub">${m.child.map(([h, t]) => `<li><a href="${h}">${t}</a></li>`).join("")}</ul>` : ""}</li>`).join("")}
      </ul>
      <div class="drawer-cta"><a class="btn btn--primary btn--block" href="recruit.html">採用情報を見る</a><a class="btn btn--ghost btn--block" href="contact.html">お問い合わせ</a></div>
    </div>`;
    $$(".ch .has-child").forEach((li) => {
      const b = $(".ch__item", li);
      b.addEventListener("click", () => {
        const open = !li.classList.contains("is-open");
        $$(".ch .has-child").forEach((x) => { x.classList.remove("is-open"); $(".ch__item", x).setAttribute("aria-expanded", "false"); });
        li.classList.toggle("is-open", open); b.setAttribute("aria-expanded", open);
      });
      li.addEventListener("mouseleave", () => { li.classList.remove("is-open"); b.setAttribute("aria-expanded", "false"); });
    });
    document.addEventListener("click", (e) => { if (!e.target.closest(".ch .has-child")) $$(".ch .has-child").forEach((x) => x.classList.remove("is-open")); });
  } else if (header) {
    header.outerHTML = `
    <header class="site-header">
      <div class="container">
        <a class="logo" href="${isRecruit ? "recruit.html" : "index.html"}" aria-label="EMIFULL ${isRecruit ? "採用サイト" : "トップページ"}">
          <img src="img/logo.webp" alt="EMIFULL" width="220" height="37">
          ${isRecruit ? '<span class="tag-recruit">RECRUIT</span>' : '<span class="logo-sub">医療法人社団<br>EMIFULL</span>'}
        </a>
        <nav class="gnav" aria-label="グローバルナビゲーション">${nav.map(([h, t]) => `<a href="${h}">${t}</a>`).join("")}${isRecruit ? '<a href="index.html">法人サイト</a>' : ""}</nav>
        ${isRecruit ? "" : '<a class="btn btn--ghost header-cta header-cta--sub" href="contact.html">お問い合わせ</a>'}
        <a class="btn btn--primary header-cta" href="${isRecruit ? "jobs.html" : "recruit.html"}">${isRecruit ? "求人を探す" : "採用情報"}</a>
        <button class="menu-btn" type="button" aria-label="メニューを開く" aria-expanded="false" aria-controls="drawer"><span></span><span></span><span></span></button>
      </div>
    </header>
    <div class="drawer" id="drawer" aria-hidden="true">
      <ul>${[["index.html", "TOP", "HOME"], ...nav].map(([h, t, e]) => `<li><a href="${h}"><span>${t}<small>${e}</small></span></a></li>`).join("")}</ul>
      <div class="drawer-cta">
        ${isRecruit ? '<a class="btn btn--primary btn--block" href="jobs.html">求人を探す</a><a class="btn btn--ghost btn--block" href="index.html">法人サイトへ</a>'
                    : '<a class="btn btn--primary btn--block" href="recruit.html">採用情報を見る</a><a class="btn btn--ghost btn--block" href="contact.html">お問い合わせ</a>'}
      </div>
    </div>`;
  }
  const menuBtn = $(".menu-btn");
  if (menuBtn) {
    menuBtn.addEventListener("click", () => {
      const open = document.body.classList.toggle("menu-open");
      menuBtn.setAttribute("aria-expanded", open);
      menuBtn.setAttribute("aria-label", open ? "メニューを閉じる" : "メニューを開く");
      $("#drawer").setAttribute("aria-hidden", !open);
    });
    $$("#drawer a").forEach((a) => a.addEventListener("click", () => document.body.classList.remove("menu-open")));
    document.addEventListener("keydown", (e) => { if (e.key === "Escape" && document.body.classList.contains("menu-open")) menuBtn.click(); });
  }

  /* ---------------- Footer ---------------- */
  const footer = $("#site-footer");
  if (footer) {
    footer.outerHTML = `
    <footer class="site-footer">
      <div class="container">
        <div class="foot-top">
          <div>
            <a class="logo" href="index.html"><img src="img/logo.webp" alt="EMIFULL" width="220" height="37"></a>
            <p class="foot-addr"><b>医療法人社団EMIFULL</b><br>〒530-0001<br>大阪府大阪市北区梅田1丁目3-1<br>大阪駅前第一ビル6階</p>
          </div>
          <nav class="foot-cols" aria-label="サイトマップ">
            <div><h4>Corporate</h4><ul><li><a href="index.html">TOP</a></li><li><a href="about.html">EMIFULLについて</a></li><li><a href="about.html#message">理事長メッセージ</a></li><li><a href="about.html#outline">法人概要・沿革</a></li><li><a href="index.html#news">お知らせ</a></li><li><a href="contact.html">お問い合わせ</a></li></ul></div>
            <div><h4>Business</h4><ul><li><a href="business.html#gairai">外来・入院</a></li><li><a href="business.html#biyou">美容医療</a></li><li><a href="business.html#zaitaku">在宅医療</a></li><li><a href="business.html#kaigo">介護</a></li><li><a href="business.html#shogai">障がい福祉</a></li><li><a href="business.html#locations">グループマップ</a></li></ul></div>
            <div><h4>Recruit</h4><ul><li><a href="recruit.html">採用情報</a></li><li><a href="recruit.html#work">部門・職種紹介</a></li><li><a href="interview.html">スタッフインタビュー</a></li><li><a href="recruit.html#data">データで見るEMIFULL</a></li><li><a href="system.html">制度・働く環境</a></li><li><a href="recruit.html#faq">採用Q&amp;A</a></li></ul></div>
          </nav>
        </div>
        <div class="foot-sub"><a href="#">プライバシーポリシー</a><a href="#">応募者情報の取り扱い</a><a href="#">サイトのご利用について</a><a href="https://www.instagram.com/emifull1122/" target="_blank" rel="noopener">Instagram</a><a href="#">YouTube</a></div>
        <p class="copyright">© EMIFULL All Rights Reserved.</p>
      </div>
    </footer>`;
  }

  /* ---------------- Sticky CTA（採用系のみ） ---------------- */
  if (isRecruit && !document.body.hasAttribute("data-no-sticky")) {
    const isJob = page === "job";
    const sc = document.createElement("div");
    sc.className = "sticky-cta";
    sc.innerHTML = (isJob
      ? `<a class="btn btn--primary" href="#apply">応募する</a><a class="btn btn--secondary" href="#apply">見学を申し込む</a>`
      : `<a class="btn btn--primary" href="jobs.html">求人を探す</a><a class="btn btn--secondary" href="#">見学を申し込む</a>`) +
      `<button class="sticky-cta__close" type="button" aria-label="固定ボタンを閉じる">×</button>`;
    document.body.appendChild(sc);
    let closed = false;
    try { closed = sessionStorage.getItem("emi-sticky-closed") === "1"; } catch (e) {}
    sc.querySelector(".sticky-cta__close").addEventListener("click", () => { closed = true; sc.classList.remove("is-show"); try { sessionStorage.setItem("emi-sticky-closed", "1"); } catch (e) {} });
    const onScroll = () => { if (closed) return; const nearBottom = innerHeight + scrollY > document.body.scrollHeight - 260; sc.classList.toggle("is-show", scrollY > 560 && !nearBottom); };
    addEventListener("scroll", onScroll, { passive: true }); onScroll();
  }

  /* ---------------- Mock bar ---------------- */
  const pages = [["grp", "法人サイト"], ["index.html", "法人TOP"], ["about.html", "EMIFULLについて（理事長・PMVV・概要）"], ["business.html", "事業案内・グループマップ"], ["facility.html", "施設詳細"], ["contact.html", "お問い合わせ"],
    ["grp", "採用サイト"], ["recruit.html", "採用TOP"], ["jobs.html", "求人一覧（検索）"], ["job.html?id=j01", "求人詳細"], ["interview.html", "職員インタビュー"], ["system.html", "制度・働く環境"]];
  const bar = document.createElement("div");
  bar.className = "mock-bar";
  const cur = location.pathname.split("/").pop() || "index.html";
  bar.innerHTML = `<button class="mock-bar__toggle" type="button" aria-expanded="false">MOCK ▾</button>
    <div class="mock-bar__panel">${pages.map(([h, t]) => h === "grp" ? `<div class="grp">${t}</div>` : `<a href="${h}"${h.split("?")[0] === cur ? ' aria-current="page"' : ""}>${t}</a>`).join("")}
    <label><input type="checkbox" id="req-toggle"> 要件・注記を表示</label></div>`;
  document.body.appendChild(bar);
  bar.querySelector(".mock-bar__toggle").addEventListener("click", (e) => { const o = bar.classList.toggle("is-open"); e.currentTarget.setAttribute("aria-expanded", o); });
  bar.querySelector("#req-toggle").addEventListener("change", (e) => document.body.classList.toggle("show-req", e.target.checked));

  /* ---------------- Hero: slideshow / video toggle ---------------- */
  $$("[data-video]").forEach((hero) => {
    const btn = $(".video-toggle", hero);
    const slides = $$(".slide", hero);
    const dots = $$(".slide-dots span", hero);
    let idx = 0, timer = null;
    const show = (i) => { slides.forEach((s, k) => s.classList.toggle("is-active", k === i)); dots.forEach((d, k) => d.classList.toggle("is-active", k === i)); };
    const icons = { pause: '<svg viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="5" width="4" height="14" rx="1"/><rect x="14" y="5" width="4" height="14" rx="1"/></svg>', play: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>' };
    const set = (p) => {
      hero.classList.toggle("is-playing", p);
      if (btn) { btn.innerHTML = p ? icons.pause : icons.play; btn.setAttribute("aria-label", p ? "スライドを停止" : "スライドを再生"); }
      clearInterval(timer);
      if (p && slides.length > 1) timer = setInterval(() => { idx = (idx + 1) % slides.length; show(idx); }, 5000);
    };
    if (slides.length) show(0);
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const saveData = navigator.connection && navigator.connection.saveData;
    set(!(reduce || saveData));
    if (btn) btn.addEventListener("click", () => set(!hero.classList.contains("is-playing")));
  });

  /* ---------------- Corporate MV：全面スライド＋円レンズ＋1文字ずつ ---------------- */
  $$("[data-mv]").forEach((mv) => {
    // コピーを1文字ずつspan化
    $$("[data-split]", mv).forEach((el) => {
      let i = 0;
      const walk = (node) => Array.from(node.childNodes).forEach((n) => {
        if (n.nodeType === 3) {
          const frag = document.createDocumentFragment();
          Array.from(n.textContent).forEach((c) => { if (!c.trim()) return; const s = document.createElement("span"); s.className = "ch-s"; s.textContent = c; s.style.animationDelay = (1.0 + i++ * 0.08) + "s"; frag.appendChild(s); });
          n.replaceWith(frag);
        } else if (n.nodeType === 1 && n.tagName !== "BR") walk(n);
      });
      el.setAttribute("aria-label", el.textContent.replace(/\s+/g, ""));
      walk(el);
      $$(".ch-s", el).forEach((s) => s.setAttribute("aria-hidden", "true"));
    });
    const slides = $$(".mv__slide", mv), dots = $$(".mv__dots span", mv), btn = $(".video-toggle", mv);
    let idx = 0, timer = null;
    const show = (i) => { slides.forEach((s, k) => s.classList.toggle("is-active", k === i)); dots.forEach((d, k) => d.classList.toggle("is-active", k === i)); };
    const icons = { pause: '<svg viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="5" width="4" height="14" rx="1"/><rect x="14" y="5" width="4" height="14" rx="1"/></svg>', play: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>' };
    const set = (p) => {
      mv.classList.toggle("is-playing", p);
      btn.innerHTML = p ? icons.pause : icons.play; btn.setAttribute("aria-label", p ? "スライドを停止" : "スライドを再生");
      clearInterval(timer); if (p) timer = setInterval(() => { idx = (idx + 1) % slides.length; show(idx); }, 6000);
    };
    show(0);
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches, saveData = navigator.connection && navigator.connection.saveData;
    set(!(reduce || saveData));
    btn.addEventListener("click", () => set(!mv.classList.contains("is-playing")));
    // 円レンズ：①レンズサイズ（CSSの--lens）まで開く → ②ひと呼吸 → ③画面の約9割がクリアになるまで広がる
    const ring = $(".mv__ring", mv);
    const COVER = 0.9;                          // 最終的にクリアに見せる面積比（1にすると全面クリア）
    const lensR = () => mv.style.getPropertyValue("--lens-px") ? parseFloat(mv.style.getPropertyValue("--lens-px")) : 0;
    const measureLens = () => { const el = document.createElement("div"); el.style.cssText = "position:absolute;visibility:hidden;width:var(--lens)"; mv.appendChild(el); const w = el.offsetWidth; el.remove(); mv.style.setProperty("--lens-px", w + "px"); };
    // 円の中心から、MV面積のCOVER割を覆う半径を数値的に求める（四隅だけがぼけて残る）
    const coverR = () => {
      const W = mv.clientWidth, H = mv.clientHeight, cx = ring.offsetLeft, cy = ring.offsetTop;
      const far = Math.max(Math.hypot(cx, cy), Math.hypot(W - cx, cy), Math.hypot(cx, H - cy), Math.hypot(W - cx, H - cy));
      if (COVER >= 1) return far + 40;
      const N = 48, pts = [];
      for (let i = 0; i < N; i++) for (let j = 0; j < N; j++) pts.push(Math.hypot((i + .5) / N * W - cx, (j + .5) / N * H - cy));
      pts.sort((a, b) => a - b);
      return pts[Math.floor(pts.length * COVER)];
    };
    const setR = (r, f) => { mv.style.setProperty("--r", r.toFixed(1) + "px"); mv.style.setProperty("--f", f.toFixed(1) + "px"); };
    let phase = 0;
    const tween = (from, to, fFrom, fTo, delay, dur, ease, done) => {
      const t0 = performance.now() + delay;
      const step = () => {
        const t = Math.min(1, Math.max(0, (performance.now() - t0) / dur)), e = ease(t);
        setR(from + (to - from) * e, fFrom + (fTo - fFrom) * e);
        if (t < 1) setTimeout(step, 16); else if (done) done();
      };
      setTimeout(step, 16);
    };
    const outCubic = (t) => 1 - Math.pow(1 - t, 3), inOut = (t) => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    measureLens(); setR(0, 1);
    const openLens = () => {
      if (reduce) { phase = 2; setR(coverR(), 120); mv.classList.add("is-open"); return; }
      tween(0, lensR() / 2, 1, 1, 200, 1400, outCubic, () => {
        phase = 1;
        mv.classList.add("is-open");
        tween(lensR() / 2, coverR(), 1, 120, 900, 2200, inOut, () => { phase = 2; });
      });
    };
    addEventListener("resize", () => { measureLens(); if (phase === 2) setR(coverR(), 120); else if (phase === 1) setR(lensR() / 2, 1); });
    setTimeout(() => { mv.classList.add("is-animated"); openLens(); }, 60);
  });

  /* ---------------- LIFE STAGE：0歳〜100歳の節目と、寄り添う事業 ---------------- */
  // アイコンはすべて線画のオリジナル（stroke=currentColor）
  const LI = {
    baby: '<circle cx="16" cy="11" r="6"/><path d="M8 28c0-5 3.6-9 8-9s8 4 8 9"/><path d="M13.5 11.5h.01M18.5 11.5h.01M14 14c1.2 1 2.8 1 4 0"/>',
    blocks: '<rect x="5" y="17" width="10" height="10" rx="1.5"/><rect x="17" y="17" width="10" height="10" rx="1.5"/><rect x="11" y="6" width="10" height="10" rx="1.5"/><path d="M14 11h4M8 22h4M20 22h4"/>',
    bag: '<path d="M8 12c0-4 3.6-7 8-7s8 3 8 7v13a2 2 0 0 1-2 2H10a2 2 0 0 1-2-2z"/><path d="M8 15h16M14 19h4"/>',
    cap: '<path d="M3 12l13-6 13 6-13 6z"/><path d="M9 15v6c0 2 3 4 7 4s7-2 7-4v-6M29 12v7"/>',
    sparkle: '<path d="M16 4c1 6 3 8 9 9-6 1-8 3-9 9-1-6-3-8-9-9 6-1 8-3 9-9z"/><path d="M25 21c.5 2.4 1.4 3.3 3.6 3.6-2.2.4-3.1 1.3-3.6 3.6-.5-2.3-1.4-3.2-3.6-3.6 2.2-.3 3.1-1.2 3.6-3.6z"/>',
    rings: '<circle cx="12" cy="19" r="7"/><circle cx="20" cy="19" r="7"/><path d="M10 9l2-4 2 4"/>',
    bag2: '<rect x="4" y="11" width="24" height="15" rx="2.5"/><path d="M12 11V8a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v3M4 17h24"/>',
    hands: '<path d="M4 20l6-5c1.5-1.2 3.5-1.2 5 0l2 1.6"/><path d="M28 20l-6-5c-1.5-1.2-3.5-1.2-5 0l-5 4c-1 .8-.6 2.4.7 2.4H16"/><path d="M4 20v6h7l5-3h5l7-3"/><path d="M16 4.5c-1.3-1.6-4-1.2-4 1 0 1.8 2.4 3.4 4 4.5 1.6-1.1 4-2.7 4-4.5 0-2.2-2.7-2.6-4-1z"/>',
    sprout: '<path d="M16 28V15"/><path d="M16 17c0-5-4-8-10-8 0 5 4 8 10 8z"/><path d="M16 14c0-4 3-7 9-7 0 4-3 7-9 7z"/><path d="M9 28h14"/>',
    cane: '<circle cx="14" cy="6" r="3"/><path d="M14 10v8l-3 9M14 18l4 9M10 13l4-1 4 3"/><path d="M22 15v12M22 15c0-2 3-2 3 0"/>',
    home: '<path d="M4 15L16 5l12 10"/><path d="M7 13v14h18V13"/><path d="M16 24c-2.5-1.8-4.5-3.3-4.5-5.3 0-2.6 3.2-3.2 4.5-1.3 1.3-1.9 4.5-1.3 4.5 1.3 0 2-2 3.5-4.5 5.3z"/>'
  };
  const LIFE_EV = [
    ["0", "baby", "誕生"], ["3", "blocks", "発達の<br>気づき"], ["6", "bag", "小学校<br>入学"], ["18", "cap", "進学・<br>ひとり立ち"],
    ["25", "sparkle", "自分らしく<br>ありたい"], ["30", "rings", "結婚・<br>出産"], ["45", "bag2", "働きざかりの<br>からだの不調"], ["55", "hands", "親の<br>介護"],
    ["70", "sprout", "セカンド<br>ライフ"], ["85", "cane", "通院が<br>むずかしく"], ["100", "home", "住み慣れた<br>家で"]
  ];
  // [事業キー, 名称, 開始列, 終了列(グリッド線), 中身]
  const LIFE_BIZ = [
    ["shogai", "障がい福祉", 1, 9, "児童発達支援 → 放課後等デイ → 就労支援・グループホーム"],
    ["biyou", "美容医療", 4, 10, "医療脱毛・美肌治療・メンズ・アートメイク"],
    ["gairai", "外来・入院", 1, 12, "整形外科・内科・皮膚科・リハビリ ── 0歳から、すべての世代のかかりつけに"],
    ["kaigo", "介護", 8, 12, "家族の介護から、自分の介護まで"],
    ["zaitaku", "在宅医療", 9, 12, "訪問診療・看取り"]
  ];
  $$("[data-lifemap]").forEach((el) => {
    const pre = el.dataset.lifemap || "#";
    const ev = LIFE_EV.map(([age, ic, label], n) => `<li style="--n:${n + 1}"><svg viewBox="0 0 32 32" aria-hidden="true">${LI[ic]}</svg><span class="lm-age">${age}<small>歳</small></span><span class="lm-ev">${label}</span></li>`).join("");
    const biz = LIFE_BIZ.map(([k, name, s, e, txt], i) => `<a class="lm-bar" href="${pre}${k}" style="--c:var(--biz-${k});--s:${s};--e:${e};--i:${i + 1}"><b>${name}</b><span>${txt}</span></a>`).join("");
    el.innerHTML = `<div class="lm-head"><span class="lm-title">LIFE STAGE</span><span class="lm-sub">0歳から100歳まで、人生の節目に寄り添う</span></div>
      <div class="lm-scroll" tabindex="0" aria-label="ライフステージと事業の対応図（横にスクロールできます）"><div class="lm-inner">
        <ol class="lm-events">${ev}</ol>
        <div class="lm-axis" aria-hidden="true"></div>
        <div class="lm-bars">${biz}</div>
      </div></div>
      `;
  });

  /* ---------------- 関西グループマップ ---------------- */
  const X = (lon) => (lon - 134.74) * 500;
  const Y = (lat) => (34.92 - lat) * 610;
  const pts = (arr) => arr.map(([lo, la]) => `${X(lo).toFixed(1)},${Y(la).toFixed(1)}`).join(" ");
  const WATER = [[134.62,34.76],[134.70,34.76],[134.80,34.73],[134.88,34.70],[134.95,34.68],[135.00,34.65],[135.07,34.64],[135.13,34.65],[135.20,34.68],[135.27,34.71],[135.34,34.72],[135.40,34.70],[135.43,34.67],[135.43,34.62],[135.45,34.58],[135.42,34.52],[135.38,34.47],[135.33,34.42],[135.26,34.37],[135.18,34.33],[135.12,34.30],[135.08,34.26],[135.10,34.20],[134.62,34.20]];
  const AWAJI = [[134.99,34.61],[135.03,34.58],[134.98,34.50],[134.93,34.42],[134.88,34.33],[134.83,34.24],[134.75,34.20],[134.70,34.25],[134.80,34.40],[134.88,34.50],[134.95,34.58]];
  const BIWA = [[135.86,35.12],[135.90,35.05],[135.93,35.00],[135.97,35.02],[136.00,35.08],[136.02,35.12]];
  const BORDERS = [
    [[135.43,34.70],[135.42,34.78],[135.44,34.86],[135.47,34.93],[135.47,35.0],[135.50,35.05]],
    [[135.50,35.05],[135.58,34.98],[135.66,34.92],[135.70,34.85]],
    [[135.70,34.85],[135.67,34.75],[135.65,34.62],[135.68,34.50],[135.66,34.40],[135.60,34.33]],
    [[135.10,34.28],[135.25,34.32],[135.40,34.33],[135.60,34.33]],
    [[135.70,34.85],[135.85,34.75],[136.00,34.72],[136.05,34.72]],
    [[135.50,35.05],[135.40,35.12]],
    [[135.60,34.33],[135.75,34.30],[135.90,34.26],[136.05,34.25]],
  ];
  const PREFS = [["兵庫県", 135.00, 34.86], ["大阪府", 135.56, 34.56], ["奈良県", 135.84, 34.44], ["京都府", 135.60, 34.89], ["和歌山県", 135.36, 34.385]];

  $$("[data-kansai-map]").forEach((root) => {
    const svgWrap = $(".map-holder", root), panel = $(".loc-panel", root), filterEl = $(".map-filter", root), areasEl = $(".loc-areas", root);
    let biz = "all", active = null;
    const facsOf = (c) => FAC.filter((f) => f.city === c && (biz === "all" || f.biz === biz));
    filterEl.innerHTML = [["all", "すべて", "var(--c-text)"], ...Object.entries(BIZ).map(([k, v]) => [k, v.name, v.color])]
      .map(([k, n, c]) => `<button type="button" data-biz="${k}" aria-pressed="${k === "all"}"><i style="background:${c}"></i>${n}</button>`).join("");

    const draw = () => {
      let pins = "";
      Object.entries(CITIES).forEach(([key, c]) => {
        const n = facsOf(key).length, total = FAC.filter((f) => f.city === key).length;
        const x = X(c.lon) + c.nx, y = Y(c.lat) + c.ny;
        const r = 10 + Math.min(total, 8) * 0.9;
        const bizs = [...new Set(FAC.filter((f) => f.city === key).map((f) => f.biz))];
        const ring = bizs.map((b, i) => { const a0 = (i / bizs.length) * Math.PI * 2 - Math.PI / 2, a1 = ((i + 1) / bizs.length) * Math.PI * 2 - Math.PI / 2, R = r + 3.5;
          if (bizs.length === 1) return `<circle cx="${x}" cy="${y}" r="${R}" fill="none" stroke="${BIZ[b].color}" stroke-width="3"/>`;
          return `<path d="M${x + R * Math.cos(a0)},${y + R * Math.sin(a0)} A${R},${R} 0 ${a1 - a0 > Math.PI ? 1 : 0} 1 ${x + R * Math.cos(a1)},${y + R * Math.sin(a1)}" fill="none" stroke="${BIZ[b].color}" stroke-width="3"/>`; }).join("");
        pins += `<g class="pin${n ? "" : " is-dim"}${active === key ? " is-active" : ""}" data-city="${key}" tabindex="0" role="button" aria-label="${c.name}：${n}の拠り所">
          <circle class="halo" cx="${x}" cy="${y}" r="${r + 9}"/>${ring}<circle class="core" cx="${x}" cy="${y}" r="${r}"/><text class="num" x="${x}" y="${y}">${n}</text>
          <text class="city" x="${x + c.lx}" y="${y + c.ly}" text-anchor="${c.anchor}" dominant-baseline="central">${c.name.replace(/（.*）/, "").replace("泉北郡", "").replace("加古郡", "")}${c.hq ? "・本部" : ""}</text></g>`;
      });
      svgWrap.innerHTML = `<svg class="map-svg" viewBox="0 0 600 340" role="img" aria-label="関西のグループマップ（概略図）">
        <rect class="land" x="0" y="0" width="600" height="340" style="stroke:none"/>
        <polygon points="${pts(WATER)}" fill="#d6ecec" stroke="#c9d9d6" stroke-width="1.2"/>
        <polygon class="island" points="${pts(AWAJI)}"/>
        <polygon points="${pts(BIWA)}" fill="#d6ecec"/>
        ${BORDERS.map((b) => `<polyline class="border" points="${pts(b)}"/>`).join("")}
        ${PREFS.map(([n, lo, la]) => `<text class="pref" x="${X(lo)}" y="${Y(la)}" text-anchor="middle">${n}</text>`).join("")}
        <text x="${X(135.22)}" y="${Y(34.55)}" text-anchor="middle" style="font:400 22px var(--font-script);fill:#7fa9ab">Osaka Bay</text>
        ${pins}
      </svg>`;
      $$(".pin", svgWrap).forEach((g) => {
        const go = () => select(g.dataset.city);
        g.addEventListener("click", go);
        g.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); go(); } });
      });
      // エリアボタン
      const prefs = {};
      Object.entries(CITIES).forEach(([k, c]) => { (prefs[c.pref] = prefs[c.pref] || []).push(k); });
      areasEl.innerHTML = Object.entries(prefs).map(([p, ks]) => ks.filter((k) => facsOf(k).length).map((k) =>
        `<button type="button" data-city="${k}" aria-pressed="${active === k}">${p}　${CITIES[k].name}<span>${facsOf(k).length}</span></button>`).join("")).join("");
      $$("button", areasEl).forEach((b) => b.addEventListener("click", () => select(b.dataset.city)));
    };
    const renderPanel = () => {
      if (!active) {
        const list = FAC.filter((f) => biz === "all" || f.biz === biz);
        panel.innerHTML = `<h3>${biz === "all" ? "関西の拠り所" : BIZ[biz].name}<small>${list.length}の拠り所</small></h3>
          <p class="hint">地図のピン、または下の地域を選ぶと、その地域の施設が表示されます。</p>`;
        return;
      }
      const c = CITIES[active], list = facsOf(active);
      panel.innerHTML = `<h3>${c.name}<small>${c.pref}・${list.length}の拠り所</small></h3>
        ${c.hq ? '<p class="hint">法人本部（大阪駅前第一ビル6階）があります。</p>' : ""}
        <ul>${list.map((f) => `<li><i style="background:${BIZ[f.biz].color}"></i><div>${esc(f.name)}${c.check ? '<span class="check">所在地要確認</span>' : ""}<small>${BIZ[f.biz].name}｜${esc(f.note)}</small></div></li>`).join("")}</ul>
        <a class="link-more" href="business.html#${list[0] ? list[0].biz : "gairai"}">この地域の事業を見る</a>`;
    };
    const select = (k) => { active = active === k ? null : k; draw(); renderPanel(); };
    filterEl.addEventListener("click", (e) => {
      const b = e.target.closest("button"); if (!b) return;
      biz = b.dataset.biz; $$("button", filterEl).forEach((x) => x.setAttribute("aria-pressed", x === b));
      if (active && !facsOf(active).length) active = null;
      draw(); renderPanel();
    });
    draw(); renderPanel();
    const out = $(".loc-outside", root);
    if (out) out.textContent = `関西以外：${OUTSIDE.map((o) => `${o.name}（${o.area}）`).join("、")}。所在地確認中：${UNPLACED.join("、")}。`;
  });

  /* ---------------- Business page: facility lists ---------------- */
  $$("[data-fac-list]").forEach((ul) => {
    const b = ul.dataset.facList;
    ul.innerHTML = FAC.filter((f) => f.biz === b).map((f) => `<li><div>${esc(f.name)}<small>${CITIES[f.city].pref} ${CITIES[f.city].name}｜${esc(f.note)}</small></div><a href="facility.html">詳しく ›</a></li>`).join("")
      + OUTSIDE.filter((o) => o.biz === b).map((o) => `<li><div>${esc(o.name)}<small>${o.area}</small></div><a href="#">公式サイト ↗</a></li>`).join("");
  });

  /* ---------------- Select / quick search ---------------- */
  $$(".select").forEach((s) => { const u = () => s.classList.toggle("is-set", !!s.value); s.addEventListener("change", u); u(); });
  $$("form[data-quick]").forEach((f) => f.addEventListener("submit", (e) => {
    e.preventDefault(); const p = new URLSearchParams();
    ["type", "area", "emp"].forEach((k) => { const v = f.elements[k] && f.elements[k].value; if (v) p.set(k, v); });
    location.href = "jobs.html" + (p.toString() ? "?" + p : "");
  }));

  /* ---------------- Job cards ---------------- */
  const jobCard = (j) => `
    <a class="job-card" href="job.html?id=${j.id}">
      <div class="job-card__tags">${j.isNew ? '<span class="tag tag--primary">NEW</span>' : ""}<span class="tag">${esc(j.type)}</span><span class="tag tag--line">${esc(j.emp)}</span></div>
      <h3>${esc(j.title)}</h3>
      <dl><div><dt>勤務地</dt><dd>${esc(j.facName)}／${esc(j.area)}</dd></div><div><dt>給与</dt><dd>${esc(j.salary)}</dd></div></dl>
      <div class="job-card__foot"><span>${esc(j.biz)}</span><b>詳細を見る ›</b></div>
    </a>`;
  window.EMI.jobCard = jobCard;
  $$("[data-latest-jobs]").forEach((el) => {
    const n = +el.dataset.latestJobs || 3, filter = el.dataset.filterType;
    el.innerHTML = JOBS.filter((j) => !filter || j.type === filter || j.fac === filter).slice(0, n).map(jobCard).join("");
  });

  if (page === "jobs") {
    const form = $("#job-filter"), params = new URLSearchParams(location.search);
    const groups = { type: OPTS.type, area: OPTS.area, emp: OPTS.emp, fac: Object.keys(FACILITIES) };
    Object.entries(groups).forEach(([k, opts]) => {
      const sel = params.getAll(k).flatMap((v) => v.split(","));
      $(`[data-chips="${k}"]`, form).innerHTML = opts.map((o) => `<label class="chip"><input type="checkbox" name="${k}" value="${esc(o)}"${sel.includes(o) ? " checked" : ""}><span>${esc(k === "fac" ? FACILITIES[o].name : o)}</span></label>`).join("");
    });
    const out = $("#job-results"), count = $("#result-count"), cond = $("#result-cond");
    const reset = () => { $$("input", form).forEach((i) => (i.checked = false)); render(); };
    const render = () => {
      const st = {}; Object.keys(groups).forEach((k) => (st[k] = $$(`input[name="${k}"]:checked`, form).map((i) => i.value)));
      const hit = JOBS.filter((j) => (!st.type.length || st.type.includes(j.type)) && (!st.area.length || st.area.includes(j.area)) && (!st.emp.length || st.emp.includes(j.emp)) && (!st.fac.length || st.fac.includes(j.fac)));
      const p = new URLSearchParams(); Object.entries(st).forEach(([k, v]) => v.length && p.set(k, v.join(",")));
      history.replaceState(null, "", "jobs.html" + (p.toString() ? "?" + p : ""));
      count.textContent = hit.length;
      const labels = [...st.type, ...st.area, ...st.emp, ...st.fac.map((f) => FACILITIES[f].name)];
      cond.textContent = labels.length ? "条件：" + labels.join("・") : "すべての求人";
      if (hit.length) { out.className = "job-list"; out.innerHTML = hit.map(jobCard).join(""); }
      else {
        const alt = st.type.length ? JOBS.filter((j) => st.type.includes(j.type)) : JOBS;
        out.className = "";
        out.innerHTML = `<div class="zero"><p><b>条件に合う求人が見つかりませんでした。</b><br>条件を減らすか、近い求人をご覧ください。</p><button class="btn btn--ghost" type="button" id="zero-reset">条件をクリア</button></div>
          <h3 style="margin:28px 0 12px;font-size:16px">${st.type.length ? "同じ職種の求人（他エリア）" : "新着の求人"}</h3><div class="job-list">${alt.slice(0, 4).map(jobCard).join("")}</div>`;
        $("#zero-reset").addEventListener("click", reset);
      }
    };
    form.addEventListener("change", render); $("#filter-reset").addEventListener("click", reset); render();
  }
  if (page === "job") {
    const id = new URLSearchParams(location.search).get("id") || "j01";
    const j = JOBS.find((x) => x.id === id) || JOBS[0];
    document.title = j.title + "｜求人詳細｜EMIFULL 採用";
    $$("[data-job]").forEach((el) => (el.textContent = j[el.dataset.job]));
    $$("[data-job-img]").forEach((el) => (el.src = "img/" + j.img));
    const relEl = $("#related-jobs"); if (relEl) relEl.innerHTML = JOBS.filter((x) => x.id !== j.id && (x.type === j.type || x.fac === j.fac)).slice(0, 3).map(jobCard).join("");
  }

  /* ---------------- 動画：クリック後読込 ---------------- */
  $$(".yt-card, .ceo-video").forEach((b) => b.addEventListener("click", () => {
    b.outerHTML = `<div class="ceo-video" style="display:grid;place-items:center;color:#fff;font-size:14px;padding:20px;text-align:center;background:#2c3a40">（モック）ここで動画を読み込みます<br>※クリック後読込で初期表示を軽量化</div>`;
  }));

  /* ---------------- Contact form ---------------- */
  const cf = $("#contact-form");
  if (cf) {
    cf.addEventListener("submit", (e) => {
      e.preventDefault(); let first = null;
      $$("[required]", cf).forEach((el) => {
        const field = el.closest(".field"); let ok = el.type === "checkbox" ? el.checked : !!el.value.trim();
        if (ok && el.type === "email") ok = /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(el.value);
        el.setAttribute("aria-invalid", !ok); field && field.classList.toggle("has-err", !ok);
        if (!ok && !first) first = el;
      });
      if (first) { first.focus(); return; }
      cf.outerHTML = `<div class="zero" role="status"><p style="font-family:var(--font-hand);font-size:24px">送信しました（モック）</p><p>内容を確認のうえ、担当者よりご連絡いたします。</p><a class="btn btn--ghost" href="index.html">TOPへ戻る</a></div>`;
    });
  }

  /* ---------------- 成長グラフ（年間のべ利用者数・ダミー） ---------------- */
  const GROWTH = {
    actual: [[2016, 0.4], [2017, 0.9], [2018, 1.7], [2019, 2.4], [2020, 3.3], [2021, 4.6], [2022, 6.0], [2023, 7.8], [2024, 11.5], [2025, 15.0]],
    plan: [[2025, 15.0], [2026, 17.8], [2027, 20.8], [2028, 23.9], [2029, 27.0], [2030, 30.0]],
    ms: [[2016.0, "2016.01", "たろうメディカルクリニック 開院"], [2017.8, "2017.10", "在宅診療を開始"], [2018.3, "2018.04", "美容医療を開始"],
      [2020.95, "2020.12", "障がい福祉（児童発達支援）を開始"], [2021.85, "2021.11", "医療法人社団EMIFULL 設立"], [2023.1, "2023.02", "尼崎ホームケアクリニック 開院"],
      [2024.45, "2024.06", "医療法人 医敬会と合併。外来・入院・介護が加わる"], [2024.85, "2025.10", "神戸ヒロ在宅クリニック 開院"]],
  };
  const fmt = (v) => (Math.round(v * 10) / 10).toFixed(1).replace(/\.0$/, "");
  function drawGrowth(box) {
    const W = box.clientWidth; if (!W) return;
    const sp = W < 600, H = sp ? 280 : 380;
    const m = { l: sp ? 34 : 48, r: sp ? 18 : 28, t: 36, b: 30 };
    const x0 = 2016, x1 = 2030, yMax = 32;
    const X = (v) => m.l + (v - x0) / (x1 - x0) * (W - m.l - m.r);
    const Y = (v) => H - m.b - v / yMax * (H - m.t - m.b);
    const all = GROWTH.actual.concat(GROWTH.plan.slice(1));
    const at = (yr) => { for (let i = 0; i < all.length - 1; i++) { const [a, va] = all[i], [b, vb] = all[i + 1]; if (yr >= a && yr <= b) return va + (vb - va) * (yr - a) / (b - a); } return all[all.length - 1][1]; };
    const line = (pts) => pts.map(([a, v], i) => (i ? "L" : "M") + X(a).toFixed(1) + "," + Y(v).toFixed(1)).join("");
    const area = (pts) => line(pts) + `L${X(pts[pts.length - 1][0]).toFixed(1)},${Y(0)}L${X(pts[0][0]).toFixed(1)},${Y(0)}Z`;
    const cur = GROWTH.actual[GROWTH.actual.length - 1], end = GROWTH.plan[GROWTH.plan.length - 1];
    let s = `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" aria-hidden="true">
      <defs><linearGradient id="gw-fill" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#e8735a" stop-opacity=".9"/><stop offset="1" stop-color="#e8735a" stop-opacity=".25"/></linearGradient>
      <pattern id="gw-hatch" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="7" height="7" fill="#fbe8e1"/><line x1="0" y1="0" x2="0" y2="7" stroke="#e8735a" stroke-opacity=".35" stroke-width="2"/></pattern></defs>`;
    [0, 10, 20, 30].forEach((v) => { s += `<line class="gw-grid" x1="${m.l}" x2="${W - m.r}" y1="${Y(v)}" y2="${Y(v)}"/><text class="gw-ax" x="${m.l - 8}" y="${Y(v) + 4}" text-anchor="end">${v}${v === 30 ? "万" : ""}</text>`; });
    for (let yr = x0; yr <= x1; yr += sp ? 2 : 1) s += `<text class="gw-ax" x="${X(yr)}" y="${H - 8}" text-anchor="middle">${sp ? "’" + String(yr).slice(2) : yr}</text>`;
    s += `<rect x="${X(cur[0])}" y="${m.t - 20}" width="${X(x1) - X(cur[0])}" height="${Y(0) - m.t + 20}" fill="#f4efe6" opacity=".6"/>`;
    s += `<path d="${area(GROWTH.plan)}" fill="url(#gw-hatch)"/><path d="${area(GROWTH.actual)}" fill="url(#gw-fill)"/>`;
    s += `<path d="${line(GROWTH.actual)}" fill="none" stroke="#c2503a" stroke-width="2"/><path d="${line(GROWTH.plan)}" fill="none" stroke="#c2503a" stroke-width="2" stroke-dasharray="6 5"/>`;
    s += `<text class="gw-zone" x="${(X(cur[0]) + X(x1)) / 2}" y="${sp ? Y(0) - 10 : m.t - 6}" text-anchor="middle">見込み</text>`;
    s += `<line x1="${X(cur[0])}" x2="${X(cur[0])}" y1="${m.t - 20}" y2="${Y(0)}" stroke="#6f6861" stroke-width="1" stroke-dasharray="2 3"/>`;
    GROWTH.ms.forEach(([yr], i) => { const cx = X(yr), cy = Y(at(yr)) - (sp ? 14 : 18); s += `<line x1="${cx}" x2="${cx}" y1="${cy + 8}" y2="${Y(at(yr))}" stroke="#3a3632" stroke-opacity=".35"/><circle cx="${cx}" cy="${cy}" r="${sp ? 8 : 10}" fill="#fff" stroke="#c2503a" stroke-width="1.5"/><text class="gw-ms" x="${cx}" y="${cy + 4}" text-anchor="middle">${i + 1}</text>`; });
    const pin = (a, v, label, cls, below) => { const cx = X(a), cy = Y(v); s += `<circle cx="${cx}" cy="${cy}" r="5" fill="#fff" stroke="#c2503a" stroke-width="2"/><text class="gw-val ${cls}" x="${below ? cx + 10 : cx - 10}" y="${below ? cy + 24 : cy - 12}" text-anchor="${below ? "start" : "end"}">${label}</text>`; };
    pin(cur[0], cur[1], `現在 ${fmt(cur[1])}万人`, "", true);
    pin(end[0], end[1], `${end[0]}年 ${fmt(end[1])}万人`, "is-plan");
    s += `<line class="gw-cross" x1="0" x2="0" y1="${m.t}" y2="${Y(0)}"/><circle class="gw-dot" r="5"/>`;
    s += `<rect class="gw-hit" x="${m.l}" y="0" width="${W - m.l - m.r}" height="${H}" fill="transparent"/></svg><div class="gw-tip" role="status"></div>`;
    box.innerHTML = s;
    const chart = box, svg = box.querySelector("svg"), tip = box.querySelector(".gw-tip"), cross = box.querySelector(".gw-cross"), dot = box.querySelector(".gw-dot");
    const pts = GROWTH.actual.concat(GROWTH.plan.slice(1));
    const move = (ev) => {
      const r = svg.getBoundingClientRect(), px = (ev.touches ? ev.touches[0].clientX : ev.clientX) - r.left;
      let best = pts[0]; pts.forEach((p) => { if (Math.abs(X(p[0]) - px) < Math.abs(X(best[0]) - px)) best = p; });
      const cx = X(best[0]), cy = Y(best[1]), plan = best[0] > cur[0];
      chart.classList.add("is-hover"); cross.setAttribute("x1", cx); cross.setAttribute("x2", cx); dot.setAttribute("cx", cx); dot.setAttribute("cy", cy);
      tip.innerHTML = `<span>${best[0]}年度${plan ? "（見込み）" : ""}</span><b>${fmt(best[1])}<small>万人</small></b>`;
      tip.style.left = Math.min(Math.max(cx, 60), W - 60) + "px"; tip.style.top = Math.max(cy - 62, 0) + "px";
    };
    svg.addEventListener("pointermove", move); svg.addEventListener("pointerdown", move);
    svg.addEventListener("pointerleave", () => chart.classList.remove("is-hover"));
  }
  const growthBoxes = $$("[data-growth-chart]");
  if (growthBoxes.length) {
    const tpl = (id) => `<div class="growth__chart-legend"><span><i class="is-actual"></i>実績</span><span><i class="is-plan"></i>見込み</span><span class="u">単位：万人（年度）</span></div>`;
    growthBoxes.forEach((b) => {
      const chart = document.createElement("div"); chart.className = "growth__svg"; b.before(Object.assign(document.createElement("div"), { innerHTML: tpl() }).firstChild); b.appendChild(chart);
      const ms = document.createElement("ol"); ms.className = "growth__ms";
      ms.innerHTML = GROWTH.ms.map(([, d, t]) => `<li><time>${d}</time>${esc(t)}</li>`).join(""); b.after(ms);
      const tbl = document.createElement("details"); tbl.className = "growth__table";
      tbl.innerHTML = `<summary>数値を表で見る</summary><div class="tbl-wrap"><table class="tbl"><thead><tr><th scope="col">年度</th>${GROWTH.actual.concat(GROWTH.plan.slice(1)).map(([y]) => `<th scope="col">${y}</th>`).join("")}</tr></thead><tbody><tr><th scope="row">のべ利用者数（万人）</th>${GROWTH.actual.concat(GROWTH.plan.slice(1)).map(([y, v]) => `<td>${fmt(v)}${y > 2025 ? "<small>見込</small>" : ""}</td>`).join("")}</tr></tbody></table></div>`;
      ms.after(tbl);
      drawGrowth(chart);
    });
    let rt; addEventListener("resize", () => { clearTimeout(rt); rt = setTimeout(() => $$(".growth__svg").forEach(drawGrowth), 150); });
  }

  /* ---------------- Reveal ---------------- */
  if (/HeadlessChrome|HeadlessEdg/.test(navigator.userAgent)) $$(".reveal").forEach((el) => el.classList.add("is-in"));
  else if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("is-in"); io.unobserve(e.target); } }), { rootMargin: "0px 0px -8% 0px" });
    $$(".reveal").forEach((el) => io.observe(el));
  } else $$(".reveal").forEach((el) => el.classList.add("is-in"));
})();
