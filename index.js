document.addEventListener("DOMContentLoaded", function () {
    setupWelcomeSplash();
    setupSidebar();
    setupScrollReveal();
    setupCertificateFilter();
    setupContactForm();
    highlightActiveNav();
});

function setupWelcomeSplash() {
    var splash = document.getElementById("welcome-splash");
    if (!splash) {
        return;
    }

    playWelcomeVoice();

    setTimeout(function () {
        splash.classList.add("hide");
        document.body.classList.remove("splash-active");
    }, 1700);
}

function playWelcomeVoice() {
    if (!("speechSynthesis" in window) || typeof SpeechSynthesisUtterance === "undefined") {
        return;
    }

    try {
        var message = new SpeechSynthesisUtterance("Welcome to my website");
        message.rate = 0.95;
        message.pitch = 1;
        message.volume = 1;
        window.speechSynthesis.cancel();
        window.speechSynthesis.speak(message);
    } catch (error) {
        // Ignore voice errors to avoid blocking page load.
    }
}

function setupSidebar() {
    var hamb = document.getElementById("hamburger");
    var sidebar = document.querySelector(".sidebar");
    var overlay = document.getElementById("sidebar-overlay");

    if (!hamb || !sidebar || !overlay) {
        return;
    }

    overlay.classList.add("hide");

    function updateIcon() {
        var isClosed = sidebar.classList.contains("closed");
        hamb.innerHTML = isClosed ? "&#9776;" : "&times;";

        if (isClosed) {
            overlay.classList.remove("show");
            overlay.classList.add("hide");
        } else {
            overlay.classList.remove("hide");
            overlay.classList.add("show");
        }
    }

    hamb.addEventListener("click", function () {
        sidebar.classList.toggle("closed");
        updateIcon();
    });

    overlay.addEventListener("click", function () {
        sidebar.classList.add("closed");
        updateIcon();
    });

    updateIcon();
}

function setupScrollReveal() {
    var reveals = document.querySelectorAll(".reveal-on-scroll");
    if (!reveals.length || typeof IntersectionObserver === "undefined") {
        return;
    }

    var observer = new IntersectionObserver(
        function (entries, obs) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add("is-visible");
                    obs.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.14 }
    );

    reveals.forEach(function (el) {
        observer.observe(el);
    });
}

function setupCertificateFilter() {
    var filterButtons = document.querySelectorAll(".filter-btn");
    var cards = document.querySelectorAll(".certificate-card[data-category]");

    if (!filterButtons.length || !cards.length) {
        return;
    }

    filterButtons.forEach(function (button) {
        button.addEventListener("click", function () {
            var selected = button.getAttribute("data-filter");

            filterButtons.forEach(function (btn) {
                btn.classList.remove("active");
            });
            button.classList.add("active");

            cards.forEach(function (card) {
                var category = card.getAttribute("data-category");
                card.classList.toggle(
                    "hidden",
                    !(selected === "all" || selected === category)
                );
            });
        });
    });
}

function setupContactForm() {
    var form = document.querySelector(".contact-form-wrapper");
    if (!form) {
        return;
    }

    var status = document.getElementById("form-status");
    form.addEventListener("submit", function (event) {
        event.preventDefault();

        var name = (document.getElementById("name") || {}).value || "";
        var email = (document.getElementById("email") || {}).value || "";
        var subject = (document.getElementById("subject") || {}).value || "";
        var message = (document.getElementById("message") || {}).value || "";

        if (!name.trim() || !email.trim() || !subject.trim() || !message.trim()) {
            setFormStatus(status, "Please complete all fields before sending.", true);
            return;
        }

        var bodyLines = [
            "Name: " + name.trim(),
            "Email: " + email.trim(),
            "",
            message.trim()
        ];
        var mailto =
            "mailto:arunkumarreddyseelam@gmail.com?subject=" +
            encodeURIComponent(subject.trim()) +
            "&body=" +
            encodeURIComponent(bodyLines.join("\n"));

        setFormStatus(status, "Opening your email app to send the message...", false);
        window.location.href = mailto;
    });
}

function setFormStatus(target, message, isError) {
    if (!target) {
        return;
    }
    target.textContent = message;
    target.classList.toggle("error", Boolean(isError));
}

function highlightActiveNav() {
    var current = window.location.pathname.split("/").pop() || "index.html";
    var links = document.querySelectorAll(".sidebar nav a");
    links.forEach(function (link) {
        var href = link.getAttribute("href");
        if (href === current) {
            link.classList.add("active");
        }
    });
}
