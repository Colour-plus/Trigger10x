/**
 * SlideCommit Component (Vanilla JS + CSS)
 * Inspired by React Bits <SlideCommit />
 * Provides smooth spring physics, pointer capture drag, squash rebound,
 * audio-haptic feedback, and promise resolution states.
 */

class SlideCommit {
    constructor(element, options = {}) {
        if (!element) return;
        this.el = element;

        // Parse attributes and options
        const ds = element.dataset;
        this.options = {
            label: options.label || ds.label || "Slide to confirm",
            doneLabel: options.doneLabel || ds.doneLabel || "Confirmed",
            errorLabel: options.errorLabel || ds.errorLabel || "Failed",
            onConfirm: options.onConfirm || null,
            onDone: options.onDone || null,
            onError: options.onError || null,
            width: Number(options.width || ds.width || element.offsetWidth || 280),
            height: Number(options.height || ds.height || 56),
            radius: Number(options.radius || ds.radius || 28),
            speed: Number(options.speed || ds.speed || 50),
            returnBounce: 0.38,
            landingDip: 0.026,
            holdMs: Number(options.holdMs || ds.holdMs || 1500),
            disabled: element.hasAttribute("data-disabled"),
            ...options
        };

        this.PAD = 4;
        this.SQUASH_MAX = 0.08;
        this.SQUASH_DIV = 110;
        this.MIN_PENDING = 300;

        this.phase = "idle"; // idle, pending, done, error
        this.held = false;
        this.x = 0;
        this.animFrame = null;
        this.timer = null;
        this.grip = null;
        this.runId = 0;

        this.initDOM();
        this.updateDimensions();
        this.bindEvents();
        this.render(0);
    }

    initDOM() {
        this.el.classList.add("slide-commit");
        this.el.setAttribute("data-phase", "idle");
        if (this.options.disabled) this.el.setAttribute("data-disabled", "");

        const r = Math.min(this.options.radius, this.options.height / 2);
        const gripR = Math.max(0, r - this.PAD);
        const fontSize = Math.min(16, Math.max(12, Math.round(this.options.height * 0.25)));
        const iconSize = Math.round((this.options.height - this.PAD * 2) * 0.42);

        this.el.style.setProperty("--sc-radius", `${r}px`);
        this.el.style.setProperty("--sc-grip-r", `${gripR}px`);
        this.el.style.setProperty("--sc-pad", `${this.PAD}px`);
        this.el.style.setProperty("--sc-font", `${fontSize}px`);
        this.el.style.setProperty("--sc-height", `${this.options.height}px`);
        this.el.style.setProperty("--sc-grip", `${this.options.height - this.PAD * 2}px`);
        this.el.style.width = `${this.options.width}px`;
        this.el.style.height = `${this.options.height}px`;

        this.el.innerHTML = `
            <div class="slide-commit__track">
                <span class="slide-commit__label" aria-hidden="true">
                    <span class="slide-commit__text slide-commit__text--plain">${this.options.label}</span>
                    <span class="slide-commit__text slide-commit__text--error">${this.options.errorLabel}</span>
                </span>
                <div
                    class="slide-commit__capsule"
                    role="slider"
                    tabindex="${this.options.disabled ? -1 : 0}"
                    aria-label="${this.options.label}"
                    aria-valuemin="0"
                    aria-valuemax="100"
                    aria-valuenow="0"
                >
                    <div class="slide-commit__content">
                        <span class="slide-commit__arrow" aria-hidden="true">
                            <svg width="${iconSize}" height="${iconSize}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">
                                <line x1="4" y1="12" x2="20" y2="12"></line>
                                <polyline points="13 5 20 12 13 19"></polyline>
                            </svg>
                        </span>
                        <span class="slide-commit__spin" aria-hidden="true">
                            <svg class="slide-commit__spinner" width="${iconSize}" height="${iconSize}" viewBox="0 0 24 24" aria-hidden="true">
                                <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="2.4" stroke-opacity="0.25"></circle>
                                <path d="M12 3a9 9 0 0 1 9 9" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"></path>
                            </svg>
                        </span>
                        <span class="slide-commit__done" aria-hidden="true">
                            <svg width="${iconSize}" height="${iconSize}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round">
                                <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                            <span>${this.options.doneLabel}</span>
                        </span>
                    </div>
                </div>
                <span class="slide-commit__sr" aria-live="polite"></span>
            </div>
        `;

        this.track = this.el.querySelector(".slide-commit__track");
        this.capsule = this.el.querySelector(".slide-commit__capsule");
        this.content = this.el.querySelector(".slide-commit__content");
        this.labelEl = this.el.querySelector(".slide-commit__label");
        this.arrowEl = this.el.querySelector(".slide-commit__arrow");
        this.spinEl = this.el.querySelector(".slide-commit__spin");
        this.doneEl = this.el.querySelector(".slide-commit__done");
        this.srEl = this.el.querySelector(".slide-commit__sr");
    }

    updateDimensions() {
        const rect = this.el.getBoundingClientRect();
        const effectiveWidth = rect.width > 0 ? rect.width : this.options.width;
        this.width = effectiveWidth;
        this.height = this.options.height;
        this.GRIP = this.height - this.PAD * 2;
        this.INNER = this.width - this.PAD * 2;
        this.TRAVEL = Math.max(1, this.INNER - this.GRIP);
        this.r = Math.min(this.options.radius, this.height / 2);
        this.gripR = Math.max(0, this.r - this.PAD);
        this.el.style.setProperty("--sc-height", `${this.height}px`);
        this.el.style.setProperty("--sc-grip", `${this.GRIP}px`);
    }

    render(x) {
        if (!this.capsule || !this.content) return;
        const seen = Math.min(this.TRAVEL, Math.max(0, x));
        const edge = seen + this.GRIP;

        // Clip the capsule from right so only dragged area shows
        const clipRight = Math.max(0, this.INNER - edge);
        this.capsule.style.clipPath = `inset(0px ${clipRight}px 0px 0px round ${this.gripR}px)`;

        // Keep content aligned with the dragging grip
        const contentX = (seen + edge) / 2 - this.INNER / 2;
        this.content.style.transform = `translateX(${contentX}px)`;

        // Squash on overshoot return bounce
        if (x < 0) {
            const q = 1 - Math.min(this.SQUASH_MAX, Math.max(0, -x) / this.SQUASH_DIV);
            this.capsule.style.transform = `scale(${q}, ${1 / q})`;
            this.capsule.style.transformOrigin = `${seen}px 50%`;
        } else {
            this.capsule.style.transform = "none";
        }

        // Fade arrow as handle approaches target
        if (this.arrowEl) {
            const arrowProgress = Math.min(1, Math.max(0, 1 - (seen - this.TRAVEL * 0.45) / (this.TRAVEL * 0.45)));
            this.arrowEl.style.opacity = (this.phase === "idle" || this.phase === "error") ? arrowProgress : 0;
        }

        // Wipe track label as handle slides across
        if (this.labelEl) {
            const labelOpacity = Math.min(1, Math.max(0, 1 - seen / (this.TRAVEL * 0.55)));
            this.labelEl.style.opacity = labelOpacity;
        }

        // ARIA value tracking
        const percent = Math.round((seen / this.TRAVEL) * 100);
        this.capsule.setAttribute("aria-valuenow", String(percent));
    }

    bindEvents() {
        const onDown = (e) => {
            if (this.options.disabled || this.phase === "pending" || this.phase === "done" || (e.button && e.button !== 0)) {
                return;
            }
            if (this.animFrame) cancelAnimationFrame(this.animFrame);
            this.updateDimensions();

            const rect = this.track.getBoundingClientRect();
            const clientX = e.clientX !== undefined ? e.clientX : (e.touches && e.touches[0] ? e.touches[0].clientX : 0);
            const at = clientX - rect.left - this.PAD;

            this.held = true;
            this.el.setAttribute("data-held", "");
            this.grip = {
                id: e.pointerId,
                grabOffset: at - this.x,
                startX: clientX,
                moved: false,
                hist: [[performance.now(), this.x]]
            };

            try {
                this.track.setPointerCapture(e.pointerId);
            } catch (err) {}

            const onMove = (ev) => {
                if (!this.grip || (ev.pointerId !== undefined && ev.pointerId !== this.grip.id)) return;
                const moveClientX = ev.clientX;
                if (Math.abs(moveClientX - this.grip.startX) > 4) {
                    this.grip.moved = true;
                }

                const trackRect = this.track.getBoundingClientRect();
                const curAt = moveClientX - trackRect.left - this.PAD;
                const nextX = Math.min(this.TRAVEL, Math.max(0, curAt - this.grip.grabOffset));

                this.grip.hist.push([performance.now(), nextX]);
                if (this.grip.hist.length > 5) this.grip.hist.shift();

                this.x = nextX;
                this.render(nextX);
            };

            const onUp = (ev) => {
                if (!this.grip || (ev.pointerId !== undefined && ev.pointerId !== this.grip.id)) return;
                window.removeEventListener("pointermove", onMove);
                window.removeEventListener("pointerup", onUp);
                window.removeEventListener("pointercancel", onUp);

                try {
                    this.track.releasePointerCapture(this.grip.id);
                } catch (err) {}

                this.held = false;
                this.el.removeAttribute("data-held");

                const moved = this.grip.moved;
                const hist = this.grip.hist;
                this.grip = null;

                // Tap without drag -> slide-animate and commit
                if (!moved) {
                    this.slideAndCommit();
                    return;
                }

                // If dragged near the finish line, commit
                if (this.x >= this.TRAVEL * 0.85) {
                    this.commit();
                } else {
                    const vel = this.calcVelocity(hist);
                    this.goHome(vel);
                }
            };

            window.addEventListener("pointermove", onMove);
            window.addEventListener("pointerup", onUp);
            window.addEventListener("pointercancel", onUp);
        };

        this.track.addEventListener("pointerdown", onDown);

        // Keyboard navigation
        this.capsule.addEventListener("keydown", (e) => {
            if (this.options.disabled || this.phase === "pending" || this.phase === "done") return;
            const step = this.TRAVEL / 8;
            if (e.key === "ArrowRight" || e.key === "ArrowUp") {
                e.preventDefault();
                this.x = Math.min(this.TRAVEL, this.x + step);
                this.render(this.x);
                if (this.x >= this.TRAVEL) this.commit();
            } else if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
                e.preventDefault();
                this.x = Math.max(0, this.x - step);
                this.render(this.x);
            } else if (e.key === "End" || e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                this.slideAndCommit();
            } else if (e.key === "Home" || e.key === "Escape") {
                e.preventDefault();
                this.goHome(0);
            }
        });

        // Resize observer to keep width responsive
        if (window.ResizeObserver) {
            const ro = new ResizeObserver(() => {
                if (!this.held && this.phase === "idle") {
                    this.updateDimensions();
                    this.render(0);
                }
            });
            ro.observe(this.el);
        }
    }

    calcVelocity(hist) {
        if (!hist || hist.length < 2) return 0;
        const [t0, x0] = hist[0];
        const [t1, x1] = hist[hist.length - 1];
        const dt = Math.max(1, t1 - t0);
        return ((x1 - x0) / dt) * 1000;
    }

    goHome(velocity = 0) {
        if (this.animFrame) cancelAnimationFrame(this.animFrame);
        let v = Math.min(0, velocity);
        let curX = this.x;
        let lastTime = performance.now();
        const k = 260 + (this.options.speed / 100) * 640;
        const mass = 0.9;
        const critical = 2 * Math.sqrt(k * mass);
        const damping = critical * (1 - this.options.returnBounce);

        const step = (now) => {
            let dt = (now - lastTime) / 1000;
            lastTime = now;
            if (dt > 0.05) dt = 0.05;

            const force = -k * curX;
            const accel = (force - damping * v) / mass;
            v += accel * dt;
            curX += v * dt;
            this.x = curX;
            this.render(curX);

            if (Math.abs(curX) < 0.25 && Math.abs(v) < 2) {
                this.x = 0;
                this.render(0);
                return;
            }
            this.animFrame = requestAnimationFrame(step);
        };
        this.animFrame = requestAnimationFrame(step);
    }

    slideAndCommit() {
        if (this.phase !== "idle") return;
        if (this.animFrame) cancelAnimationFrame(this.animFrame);
        this.updateDimensions();

        let curX = 0;
        let v = 0;
        let lastTime = performance.now();
        const targetX = this.TRAVEL;
        const k = 620;
        const mass = 0.9;
        const critical = 2 * Math.sqrt(k * mass) * 0.92;

        const step = (now) => {
            let dt = (now - lastTime) / 1000;
            lastTime = now;
            if (dt > 0.05) dt = 0.05;

            const force = -k * (curX - targetX);
            const accel = (force - critical * v) / mass;
            v += accel * dt;
            curX += v * dt;
            this.x = curX;
            this.render(curX);

            if (Math.abs(curX - targetX) < 0.6 && Math.abs(v) < 3) {
                this.x = targetX;
                this.render(targetX);
                this.commit();
                return;
            }
            this.animFrame = requestAnimationFrame(step);
        };
        this.animFrame = requestAnimationFrame(step);
    }

    setPhase(phase) {
        this.phase = phase;
        this.el.setAttribute("data-phase", phase);
        if (phase === "pending") {
            this.capsule.setAttribute("aria-busy", "true");
            this.srEl.textContent = "Processing...";
        } else if (phase === "done") {
            this.capsule.removeAttribute("aria-busy");
            this.srEl.textContent = this.options.doneLabel;
        } else if (phase === "error") {
            this.capsule.removeAttribute("aria-busy");
            this.srEl.textContent = this.options.errorLabel;
        } else {
            this.capsule.removeAttribute("aria-busy");
            this.srEl.textContent = "";
        }
    }

    commit() {
        if (this.animFrame) cancelAnimationFrame(this.animFrame);
        clearTimeout(this.timer);
        this.runId += 1;
        const curRun = this.runId;

        this.x = this.TRAVEL;
        this.render(this.TRAVEL);

        let out;
        try {
            out = this.options.onConfirm ? this.options.onConfirm() : null;
        } catch (err) {
            this.reject(err);
            return;
        }

        const isPromise = out && typeof out.then === "function";
        if (!isPromise) {
            this.resolve();
            return;
        }

        this.setPhase("pending");
        const t0 = performance.now();
        out.then(
            () => {
                const wait = Math.max(0, this.MIN_PENDING - (performance.now() - t0));
                setTimeout(() => {
                    if (curRun === this.runId) this.resolve();
                }, wait);
            },
            (reason) => {
                const wait = Math.max(0, this.MIN_PENDING - (performance.now() - t0));
                setTimeout(() => {
                    if (curRun === this.runId) this.reject(reason);
                }, wait);
            }
        );
    }

    resolve() {
        this.setPhase("done");

        if (this.options.landingDip > 0) {
            this.track.animate([
                { transform: "scale(1)" },
                { transform: `scale(${1 - this.options.landingDip})` },
                { transform: "scale(1)" }
            ], {
                duration: 440,
                easing: "cubic-bezier(0.23, 1, 0.32, 1)"
            });
        }

        if (this.options.onDone) this.options.onDone();

        if (this.options.holdMs > 0) {
            this.timer = setTimeout(() => {
                this.settle();
            }, this.options.holdMs);
        }
    }

    reject(reason) {
        this.setPhase("error");
        if (this.options.onError) this.options.onError(reason);

        // Shake animation
        this.track.animate([
            { transform: "translateX(0px)" },
            { transform: "translateX(-5px)" },
            { transform: "translateX(5px)" },
            { transform: "translateX(-3px)" },
            { transform: "translateX(3px)" },
            { transform: "translateX(0px)" }
        ], {
            duration: 450,
            easing: "ease-out"
        });

        setTimeout(() => {
            this.goHome(0);
        }, 320);

        this.timer = setTimeout(() => {
            this.setPhase("idle");
        }, Math.max(this.options.holdMs, 1600));
    }

    settle() {
        this.setPhase("idle");
        this.goHome(0);
    }
}

// Global initialization helper
window.SlideCommit = SlideCommit;

// Auto-mount components when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
    // 1. "LET'S TALK" BUTTON IN CONTACT SECTION
    const contactSlideEl = document.getElementById("slideCommitContact");
    if (contactSlideEl) {
        new SlideCommit(contactSlideEl, {
            label: "Slide for Let's Talk",
            doneLabel: "Opening...",
            errorLabel: "Try Again",
            width: 300,
            height: 56,
            radius: 28,
            holdMs: 1200,
            onConfirm: () => {
                return new Promise((resolve) => {
                    setTimeout(() => {
                        const modal = document.getElementById("contact-form");
                        if (modal) {
                            modal.classList.add("open");
                            modal.setAttribute("aria-hidden", "false");
                            document.body.classList.add("enquiry-open");
                            const firstInput = modal.querySelector("input");
                            setTimeout(() => { if (firstInput) firstInput.focus(); }, 250);
                        }
                        resolve();
                    }, 300);
                });
            }
        });
    }

    // 2. "INITIATE ENGAGEMENT" BUTTON IN EXPLORE SERVICES (BLUEPRINT DRAWER)
    const blueprintSlideEl = document.getElementById("slideCommitBlueprint");
    if (blueprintSlideEl) {
        new SlideCommit(blueprintSlideEl, {
            label: "Slide to Initiate",
            doneLabel: "Initiating...",
            errorLabel: "Try Again",
            width: 260,
            height: 50,
            radius: 25,
            holdMs: 1200,
            onConfirm: () => {
                return new Promise((resolve) => {
                    setTimeout(() => {
                        const drawer = document.getElementById("blueprintDrawer");
                        const overlay = document.getElementById("blueprintOverlay");
                        if (drawer) drawer.classList.remove("is-open");
                        if (overlay) overlay.classList.remove("is-open");
                        document.body.style.overflow = "";

                        const modal = document.getElementById("contact-form");
                        if (modal) {
                            const subjectSelect = document.getElementById("subject");
                            const keyMap = {
                                "business-development": "Business Development",
                                "business-enhancement": "Business Enhancement",
                                "strategy-gtm": "Business Strategy",
                                "digital-automation": "Automation",
                                "prototyping-systems": "Prototyping"
                            };
                            const activeKey = window.activeBlueprintKey || "business-development";
                            const targetVal = keyMap[activeKey] || "Business Development";
                            if (subjectSelect) {
                                for (let opt of subjectSelect.options) {
                                    if (opt.value === targetVal) {
                                        subjectSelect.value = targetVal;
                                        break;
                                    }
                                }
                            }

                            modal.classList.add("open");
                            modal.setAttribute("aria-hidden", "false");
                            document.body.classList.add("enquiry-open");
                            const firstInput = modal.querySelector("input");
                            setTimeout(() => { if (firstInput) firstInput.focus(); }, 250);
                        }
                        resolve();
                    }, 300);
                });
            }
        });
    }
});
