(function () {
  "use strict";

  // ---- Enquiry form delivery -------------------------------------------
  // Enquiries are sent through Web3Forms (delivered to the email linked to the
  // access key). If the request fails, the visitor's email app opens instead.
  var WEB3FORMS_URL = "https://api.web3forms.com/submit";
  var WEB3FORMS_KEY = "e3856f70-e3c1-4be3-a492-9e25a58d8698";
  var ENQUIRY_EMAIL = "sales@sunchem.co.in";

  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  // ---- Smooth-scroll nav -------------------------------------------------
  var menu = $("#mobileMenu"), iconMenu = $("#iconMenu"), iconClose = $("#iconClose");
  function setMenu(open) {
    menu.classList.toggle("hidden", !open);
    iconMenu.classList.toggle("hidden", open);
    iconClose.classList.toggle("hidden", !open);
  }
  $("#menuToggle").addEventListener("click", function () { setMenu(menu.classList.contains("hidden")); });
  $$("[data-nav]").forEach(function (b) {
    b.addEventListener("click", function () {
      setMenu(false);
      var el = $(b.getAttribute("data-nav"));
      if (el) el.scrollIntoView({ behavior: "smooth" });
    });
  });
  $("#logo").addEventListener("click", function (e) {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  // ---- Header background + hero parallax --------------------------------
  var header = $("#header"), hero = $("#hero"), heroImg = $("#heroImg");
  var scrolledCls = ["backdrop-blur-md", "bg-black/90", "border-b", "border-parchment/10"];
  function onScroll() {
    var scrolled = window.scrollY > 100;
    header.classList.toggle("bg-transparent", !scrolled);
    scrolledCls.forEach(function (c) { header.classList.toggle(c, scrolled); });
    var r = hero.getBoundingClientRect();
    var p = Math.min(1, Math.max(0, -r.top / r.height));
    heroImg.style.transform = "translate3d(0," + (p * 8) + "%,0) scale(" + (1 + p * 0.12) + ")";
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // ---- Reveal on scroll (framer-motion whileInView equivalent) ----------
  var els = $$("[data-rv]");
  els.forEach(function (el) { el.classList.add("rv"); });
  function reveal(el) {
    el.classList.add("in");
    var total = (parseFloat(el.style.getPropertyValue("--d")) || 0) + (parseFloat(el.style.getPropertyValue("--t")) || 0.8);
    setTimeout(function () { el.classList.add("done"); }, total * 1000 + 50);
  }
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { reveal(e.target); io.unobserve(e.target); }
      });
    }, { rootMargin: "0px 0px -80px 0px" });
    els.forEach(function (el) { io.observe(el); });
  } else {
    els.forEach(reveal);
  }

  // ---- Product tabs -------------------------------------------------------
  var activeOn = ["border-parchment", "text-parchment"];
  var activeOff = ["border-transparent", "text-parchment/30", "hover:text-parchment/60"];
  $$(".tab").forEach(function (tab) {
    tab.addEventListener("click", function () {
      $$(".tab").forEach(function (t) {
        var on = t === tab;
        activeOn.forEach(function (c) { t.classList.toggle(c, on); });
        activeOff.forEach(function (c) { t.classList.toggle(c, !on); });
      });
      $$(".panel").forEach(function (p) {
        var on = p.getAttribute("data-panel") === tab.getAttribute("data-tab");
        p.classList.toggle("hidden", !on);
        p.classList.toggle("active", on);
      });
    });
  });

  // ---- Enquire buttons preselect the product -----------------------------
  $$("[data-enquire]").forEach(function (b) {
    b.addEventListener("click", function () {
      $("#product_interest").value = b.getAttribute("data-enquire");
      $("#contact").scrollIntoView({ behavior: "smooth" });
    });
  });

  // ---- Contact form -------------------------------------------------------
  var form = $("#form"), thanks = $("#thanks"), btn = $("#submitBtn");
  function showThanks(on) {
    thanks.classList.toggle("hidden", !on);
    thanks.classList.toggle("flex", on);
    form.classList.toggle("hidden", on);
  }
  $("#again").addEventListener("click", function () { showThanks(false); });
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var d = {};
    ["company_name", "contact_person", "email", "product_interest", "message"].forEach(function (k) { d[k] = form.elements[k].value; });
    function done() { form.reset(); btn.disabled = false; btn.textContent = "Submit Enquiry"; showThanks(true); }
    btn.disabled = true; btn.textContent = "Submitting...";

    var payload = {
      access_key: WEB3FORMS_KEY,
      subject: "Quote Request \u2013 " + d.product_interest,
      from_name: "Sunchem Website",
      company_name: d.company_name,
      contact_person: d.contact_person,
      email: d.email,          // Web3Forms uses this as the reply-to address
      product_interest: d.product_interest,
      message: d.message
    };

    fetch(WEB3FORMS_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Accept": "application/json" },
      body: JSON.stringify(payload)
    })
      .then(function (r) { return r.json().then(function (j) { return { ok: r.ok, json: j }; }); })
      .then(function (res) {
        if (!res.ok || !res.json.success) throw new Error(res.json.message || "Submit failed");
        done();
      })
      .catch(function () {
        var body = "Company: " + d.company_name + "\nContact Person: " + d.contact_person + "\nEmail: " + d.email +
          "\nProduct Interest: " + d.product_interest + "\n\nMessage:\n" + d.message;
        window.location.href = "mailto:" + ENQUIRY_EMAIL + "?subject=" + encodeURIComponent("Quote Request \u2013 " + d.product_interest) + "&body=" + encodeURIComponent(body);
        done();
      });
  });
})();
