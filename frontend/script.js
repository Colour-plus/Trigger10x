/* =========================================================
   TRIGGER10X
   FINAL WEBSITE JAVASCRIPT
   Intro • Navigation • Reveal • Mobile Menu • Enquiry API
   ========================================================= */

"use strict";


/* =========================================================
   INTRO SCREEN
========================================================= */

(() => {

    const introScreen =
        document.getElementById("intro-screen");

    const introVideo =
        document.getElementById("intro-video");

    const introCanvas =
        document.getElementById("intro-canvas");


    if (
        !introScreen ||
        !introVideo ||
        !introCanvas
    ) {
        return;
    }


    const introContext =
        introCanvas.getContext(
            "2d",
            {
                willReadFrequently: true
            }
        );


    let introFrame = null;

    let introSafetyTimer = null;


    /* -----------------------------------------------------
       Render video frame onto transparent canvas
    ----------------------------------------------------- */

    const renderIntroFrame = () => {

        if (
            !introVideo.videoWidth ||
            !introVideo.videoHeight
        ) {

            introFrame =
                requestAnimationFrame(
                    renderIntroFrame
                );

            return;

        }


        if (
            introVideo.duration &&
            introVideo.currentTime >=
                introVideo.duration - 0.35
        ) {

            introFrame =
                requestAnimationFrame(
                    renderIntroFrame
                );

            return;

        }


        if (
            introCanvas.width !==
                introVideo.videoWidth ||
            introCanvas.height !==
                introVideo.videoHeight
        ) {

            introCanvas.width =
                introVideo.videoWidth;

            introCanvas.height =
                introVideo.videoHeight;

        }


        introContext.drawImage(
            introVideo,
            0,
            0,
            introCanvas.width,
            introCanvas.height
        );


        let frame;

        try {

            frame =
                introContext.getImageData(
                    0,
                    0,
                    introCanvas.width,
                    introCanvas.height
                );

        } catch {

            return;

        }


        for (
            let index = 0;
            index < frame.data.length;
            index += 4
        ) {

            const brightness =
                Math.max(
                    frame.data[index],
                    frame.data[index + 1],
                    frame.data[index + 2]
                );


            frame.data[index + 3] =
                brightness < 42
                    ? 0
                    : 255;

        }


        introContext.putImageData(
            frame,
            0,
            0
        );


        introFrame =
            requestAnimationFrame(
                renderIntroFrame
            );

    };


    /* -----------------------------------------------------
       Complete intro
    ----------------------------------------------------- */

    const completeIntro = () => {

        if (
            introScreen.classList.contains(
                "intro-complete"
            )
        ) {
            return;
        }


        clearTimeout(
            introSafetyTimer
        );


        if (introFrame) {

            cancelAnimationFrame(
                introFrame
            );

        }


        introScreen.classList.add(
            "intro-complete"
        );


        window.scrollTo({
            top: 0,
            left: 0,
            behavior: "instant"
        });


        document.body.classList.remove(
            "intro-active"
        );

        const heroHome = document.getElementById("home");
        if (heroHome) {
            heroHome.classList.add("hero-revealed");
        }




        setTimeout(
            () => {

                if (
                    introScreen &&
                    introScreen.parentNode
                ) {

                    introScreen.remove();

                }

            },
            1000
        );

    };


    /* -----------------------------------------------------
       Video events
    ----------------------------------------------------- */

    introVideo.addEventListener(
        "ended",
        completeIntro,
        {
            once: true
        }
    );


    introVideo.addEventListener(
        "error",
        completeIntro,
        {
            once: true
        }
    );


    introVideo.addEventListener(
        "loadeddata",
        () => {

            renderIntroFrame();


            requestAnimationFrame(
                () => {

                    introScreen.classList.add(
                        "intro-ready"
                    );

                }
            );

        },
        {
            once: true
        }
    );


    introVideo.addEventListener(
        "loadedmetadata",
        () => {

            introVideo.playbackRate = 2;


            if (
                Number.isFinite(
                    introVideo.duration
                )
            ) {

                introVideo.currentTime =
                    Math.min(
                        5,
                        introVideo.duration
                    );

            }

        },
        {
            once: true
        }
    );


    /* -----------------------------------------------------
       Start video
    ----------------------------------------------------- */

    introVideo.play().catch(
        () => {

            completeIntro();

        }
    );


    /* -----------------------------------------------------
       Safety fallback
    ----------------------------------------------------- */

    introSafetyTimer =
        setTimeout(
            completeIntro,
            5000
        );

})();






/* =========================================================
   HISTORY / INITIAL SCROLL
========================================================= */

if (
    "scrollRestoration" in history
) {

    history.scrollRestoration =
        "manual";

}


if (
    !window.location.hash
) {

    window.scrollTo(
        0,
        0
    );

}



/* =========================================================
   PROGRESS BAR
========================================================= */

(() => {

    const bar =
        document.querySelector(
            ".progress i"
        );


    if (!bar) {
        return;
    }


    const updateProgress = () => {

        const documentHeight =
            document.documentElement.scrollHeight;


        const viewportHeight =
            window.innerHeight;


        const maximum =
            documentHeight -
            viewportHeight;


        const progress =
            maximum > 0
                ? (
                    window.scrollY /
                    maximum
                ) * 100
                : 0;


        bar.style.width =
            `${Math.min(
                100,
                Math.max(
                    0,
                    progress
                )
            )}%`;

    };


    window.addEventListener(
        "scroll",
        updateProgress,
        {
            passive: true
        }
    );


    window.addEventListener(
        "resize",
        updateProgress
    );


    updateProgress();

})();



/* =========================================================
   REVEAL ANIMATIONS
========================================================= */

(() => {

    const revealElements =
        document.querySelectorAll(
            ".reveal"
        );


    if (
        !revealElements.length
    ) {
        return;
    }


    if (
        window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches
    ) {

        revealElements.forEach(
            element => {

                element.classList.add(
                    "visible"
                );

            }
        );

        return;

    }


    const observer =
        new IntersectionObserver(
            entries => {

                entries.forEach(
                    entry => {

                        if (
                            entry.isIntersecting
                        ) {

                            entry.target.classList.add(
                                "visible"
                            );

                        } else {

                            entry.target.classList.remove(
                                "visible"
                            );

                        }

                    }
                );

            },
            {
                threshold: 0.12
            }
        );


    revealElements.forEach(
        element => {

            observer.observe(
                element
            );

        }
    );

})();



/* =========================================================
   SEQUENTIAL SECTION ANIMATIONS
========================================================= */

(() => {

    const selector = [

        ".kicker",
        "h1",
        "h2",
        ".label",
        ".hero-rule",
        ".hero-actions",
        "p",
        ".service",
        ".card",
        ".insight",
        ".industry-list > div",
        ".hero-stats > div",
        ".contact-btn",
        ".contact small"

    ].join(",");


    const elements =
        document.querySelectorAll(
            "main section[id] " +
            selector
        );


    if (
        !elements.length
    ) {
        return;
    }


    const reducedMotion =
        window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;


    if (reducedMotion) {

        elements.forEach(
            element => {

                element.classList.add(
                    "sequence-visible"
                );

            }
        );

        return;

    }


    const sequenceObserver =
        new IntersectionObserver(
            entries => {

                entries.forEach(
                    entry => {

                        if (
                            entry.isIntersecting
                        ) {

                            entry.target.classList.add(
                                "sequence-visible"
                            );

                        } else {

                            entry.target.classList.remove(
                                "sequence-visible"
                            );

                        }

                    }
                );

            },
            {
                threshold: 0.12,
                rootMargin:
                    "0px 0px -8%"
            }
        );


    document
        .querySelectorAll(
            "main section[id]"
        )
        .forEach(
            section => {

                section
                    .querySelectorAll(
                        selector
                    )
                    .forEach(
                        (
                            element,
                            index
                        ) => {

                            element.classList.add(
                                "sequence-item"
                            );


                            element.style.setProperty(
                                "--sequence-delay",
                                `${Math.min(
                                    index * 0.09,
                                    0.54
                                )}s`
                            );


                            sequenceObserver.observe(
                                element
                            );

                        }
                    );

            }
        );

})();



/* =========================================================
   ACTIVE NAVIGATION
========================================================= */

(() => {

    const sections =
        document.querySelectorAll(
            "main section[id]"
        );


    const links =
        document.querySelectorAll(
            ".navigation a"
        );


    if (
        !sections.length ||
        !links.length
    ) {
        return;
    }


    const updateActiveNavigation =
        () => {

            let current =
                "home";


            const scrollPosition =
                window.scrollY + 250;


            sections.forEach(
                section => {

                    if (
                        scrollPosition >=
                        section.offsetTop
                    ) {

                        current =
                            section.id;

                    }

                }
            );


            links.forEach(
                link => {

                    const href =
                        link.getAttribute(
                            "href"
                        );


                    link.classList.toggle(
                        "active",
                        href ===
                            `#${current}`
                    );

                }
            );

        };


    window.addEventListener(
        "scroll",
        updateActiveNavigation,
        {
            passive: true
        }
    );


    window.addEventListener(
        "resize",
        updateActiveNavigation
    );


    updateActiveNavigation();

})();



/* =========================================================
   MOBILE MENU
========================================================= */

(() => {
    const menu = document.getElementById("mobileMenuBtn") || document.querySelector(".menu");
    const navigation = document.getElementById("mainNavigation") || document.querySelector(".navigation");
    const backdrop = document.getElementById("menuBackdrop") || document.querySelector(".menu-backdrop");

    if (!menu || !navigation) {
        return;
    }

    const openMenu = () => {
        navigation.classList.add("open");
        menu.classList.add("is-open");
        menu.setAttribute("aria-expanded", "true");
        if (backdrop) backdrop.classList.add("is-active");
        document.body.classList.add("menu-open");
    };

    const closeMenu = () => {
        navigation.classList.remove("open");
        menu.classList.remove("is-open");
        menu.setAttribute("aria-expanded", "false");
        if (backdrop) backdrop.classList.remove("is-active");
        document.body.classList.remove("menu-open");
    };

    const toggleMenu = () => {
        if (navigation.classList.contains("open")) {
            closeMenu();
        } else {
            openMenu();
        }
    };

    menu.addEventListener("click", (e) => {
        e.stopPropagation();
        toggleMenu();
    });

    if (backdrop) {
        backdrop.addEventListener("click", closeMenu);
    }

    // Close on any menu link click
    navigation.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", () => {
            closeMenu();
        });
    });

    // Close on click outside
    document.addEventListener("click", (e) => {
        if (
            navigation.classList.contains("open") &&
            !navigation.contains(e.target) &&
            !menu.contains(e.target)
        ) {
            closeMenu();
        }
    });

    // Close on ESC key
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && navigation.classList.contains("open")) {
            closeMenu();
        }
    });

    // Auto-close on resize to desktop
    window.addEventListener(
        "resize",
        () => {
            if (window.innerWidth > 992) {
                closeMenu();
            }
        },
        { passive: true }
    );
})();



/* =========================================================
   SMOOTH ANCHOR NAVIGATION
========================================================= */

(() => {

    const anchorLinks =
        document.querySelectorAll(
            'a[href^="#"]'
        );


    anchorLinks.forEach(
        link => {

            link.addEventListener(
                "click",
                event => {

                    const href =
                        link.getAttribute(
                            "href"
                        );


                    if (
                        !href ||
                        href === "#" ||
                        href === "#contact-form"
                    ) {
                        return;
                    }


                    const target =
                        document.querySelector(
                            href
                        );


                    if (!target) {
                        return;
                    }


                    event.preventDefault();


                    target.scrollIntoView({
                        behavior: "smooth",
                        block: "start"
                    });

                }
            );

        }
    );

})();



/* =========================================================
   ENQUIRY MODAL
========================================================= */

(() => {

    const modal =
        document.getElementById(
            "contact-form"
        );


    const triggers =
        document.querySelectorAll(
            ".enquiry-trigger"
        );


    const closeButtons =
        document.querySelectorAll(
            "[data-close-enquiry]"
        );


    if (!modal) {
        return;
    }


    let previousFocusedElement =
        null;


    const openModal = () => {

        previousFocusedElement =
            document.activeElement;


        modal.classList.add(
            "open"
        );


        modal.setAttribute(
            "aria-hidden",
            "false"
        );


        document.body.classList.add(
            "enquiry-open"
        );


        const firstInput =
            modal.querySelector(
                "input, select, textarea, button"
            );


        setTimeout(
            () => {

                if (firstInput) {

                    firstInput.focus();

                }

            },
            250
        );

    };


    const closeModal = () => {

        modal.classList.remove(
            "open"
        );


        modal.setAttribute(
            "aria-hidden",
            "true"
        );


        document.body.classList.remove(
            "enquiry-open"
        );


        if (
            previousFocusedElement &&
            typeof
                previousFocusedElement.focus ===
                "function"
        ) {

            previousFocusedElement.focus();

        }

    };


    triggers.forEach(
        trigger => {

            trigger.addEventListener(
                "click",
                event => {

                    event.preventDefault();

                    openModal();

                }
            );

        }
    );


    closeButtons.forEach(
        button => {

            button.addEventListener(
                "click",
                event => {

                    event.preventDefault();

                    closeModal();

                }
            );

        }
    );


    document.addEventListener(
        "keydown",
        event => {

            if (
                event.key === "Escape" &&
                modal.classList.contains(
                    "open"
                )
            ) {

                closeModal();

            }

        }
    );


    /* -----------------------------------------------------
       Click outside panel
    ----------------------------------------------------- */

    modal.addEventListener(
        "click",
        event => {

            if (
                event.target === modal
            ) {

                closeModal();

            }

        }
    );


})();



/* =========================================================
   ENQUIRY FORM → BACKEND → POSTGRESQL
========================================================= */

(() => {

    const isLocalhost =
        window.location.hostname === "localhost" ||
        window.location.hostname === "127.0.0.1";

    // In local development, points to localhost:5000.
    // When deploying live, update PRODUCTION_API_URL or define window.TRIGGER10X_API_URL.
    const PRODUCTION_API_URL = "https://your-backend-api.onrender.com";

    const API_BASE_URL = isLocalhost
        ? "http://localhost:5000"
        : (window.TRIGGER10X_API_URL || PRODUCTION_API_URL);


    const enquiryForm =
        document.getElementById(
            "enquiryForm"
        );


    if (!enquiryForm) {
        return;
    }


    const submitButton =
        enquiryForm.querySelector(
            'button[type="submit"]'
        );


    const successMessage =
        enquiryForm.querySelector(
            ".form-success"
        );


    const errorMessage =
        enquiryForm.querySelector(
            ".form-error"
        );


    /* -----------------------------------------------------
       Helpers
    ----------------------------------------------------- */

    const showMessage =
        (
            element,
            message
        ) => {

            if (!element) {
                return;
            }


            element.textContent =
                message;


            element.classList.add(
                "visible"
            );

        };


    const hideMessage =
        element => {

            if (!element) {
                return;
            }


            element.textContent =
                "";


            element.classList.remove(
                "visible"
            );

        };


    const setSubmitting =
        isSubmitting => {

            if (!submitButton) {
                return;
            }


            if (
                isSubmitting
            ) {

                submitButton.disabled =
                    true;


                submitButton.dataset.originalText =
                    submitButton.innerHTML;


                submitButton.innerHTML =
                    `
                        SENDING
                        <span>...</span>
                    `;

            } else {

                submitButton.disabled =
                    false;


                submitButton.innerHTML =
                    submitButton.dataset.originalText ||
                    `
                        SEND ENQUIRY
                        <span>→</span>
                    `;

            }

        };


    /* -----------------------------------------------------
       Submit
    ----------------------------------------------------- */

    enquiryForm.addEventListener(
        "submit",
        async event => {

            event.preventDefault();


            hideMessage(
                successMessage
            );


            hideMessage(
                errorMessage
            );


            const formData =
                new FormData(
                    enquiryForm
                );


            const enquiryData = {

                name:
                    String(
                        formData.get(
                            "name"
                        ) || ""
                    ).trim(),


                company:
                    String(
                        formData.get(
                            "company"
                        ) || ""
                    ).trim(),


                phone:
                    String(
                        formData.get(
                            "phone"
                        ) || ""
                    ).trim(),


                email:
                    String(
                        formData.get(
                            "email"
                        ) || ""
                    ).trim(),


                subject:
                    String(
                        formData.get(
                            "subject"
                        ) || ""
                    ).trim(),


                message:
                    String(
                        formData.get(
                            "message"
                        ) || ""
                    ).trim()

            };


            /* -------------------------------------------------
               Required field validation
            ------------------------------------------------- */

            if (
                !enquiryData.name ||
                !enquiryData.phone ||
                !enquiryData.email ||
                !enquiryData.subject
            ) {

                showMessage(
                    errorMessage,
                    "Please complete all required fields."
                );

                return;

            }


            /* -------------------------------------------------
               Email validation
            ------------------------------------------------- */

            const emailPattern =
                /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


            if (
                !emailPattern.test(
                    enquiryData.email
                )
            ) {

                showMessage(
                    errorMessage,
                    "Please enter a valid email address."
                );

                return;

            }


            /* -------------------------------------------------
               Phone basic validation
            ------------------------------------------------- */

            const phoneDigits =
                enquiryData.phone.replace(
                    /\D/g,
                    ""
                );


            if (
                phoneDigits.length < 7
            ) {

                showMessage(
                    errorMessage,
                    "Please enter a valid contact number."
                );

                return;

            }


            setSubmitting(
                true
            );


            try {

                const response =
                    await fetch(
                        `${API_BASE_URL}/api/enquiries`,
                        {
                            method:
                                "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body:
                                JSON.stringify(
                                    enquiryData
                                )
                        }
                    );


                let result = {};


                try {

                    result =
                        await response.json();

                } catch {

                    result = {};

                }


                if (
                    !response.ok
                ) {

                    throw new Error(
                        result.message ||
                        "Unable to submit your enquiry."
                    );

                }


                /* -------------------------------------------------
                   Success
                ------------------------------------------------- */

                enquiryForm.reset();


                showMessage(
                    successMessage,
                    "Thank you for reaching out. Your enquiry has been submitted successfully."
                );


                /* -------------------------------------------------
                   Close modal after a short delay
                ------------------------------------------------- */

                setTimeout(
                    () => {

                        const modal =
                            document.getElementById(
                                "contact-form"
                            );


                        if (
                            modal &&
                            modal.classList.contains(
                                "open"
                            )
                        ) {

                            modal.classList.remove(
                                "open"
                            );


                            modal.setAttribute(
                                "aria-hidden",
                                "true"
                            );


                            document.body.classList.remove(
                                "enquiry-open"
                            );

                        }

                    },
                    3000
                );


            } catch (error) {

                console.error(
                    "TRIGGER10X enquiry submission error:",
                    error
                );


                let message =
                    "Something went wrong. Please try again.";


                if (
                    error &&
                    error.message
                ) {

                    message =
                        error.message;

                }


                if (
                    error instanceof
                        TypeError
                ) {

                    message =
                        "Unable to connect to the TRIGGER10X server. Please make sure the backend is running.";

                }


                showMessage(
                    errorMessage,
                    message
                );


            } finally {

                setSubmitting(
                    false
                );

            }

        }
    );

})();



/* =========================================================
   HERO BACKGROUND
   Static by design — no continuous parallax.
========================================================= */

(() => {

    const heroBackground =
        document.querySelector(
            ".hero-bg"
        );


    if (!heroBackground) {
        return;
    }


    /* Intentionally static.
       Keeps the existing visual direction
       without unnecessary scroll movement. */

})();



/* =========================================================
   ARC CAROUSEL CONTROLLER (OUR APPROACH)
   Cards ride a large circle with the focused card upright at apex.
   Position and tilt fall out of a single rotation.
   ========================================================= */

(() => {

    const stage = document.getElementById("arcCarouselStage");
    const wheel = document.getElementById("arcCarouselWheel");
    const prevBtn = document.getElementById("arcPrevBtn");
    const nextBtn = document.getElementById("arcNextBtn");
    const stepNum = document.getElementById("arcStepNum");
    const stepName = document.getElementById("arcStepName");
    const dotsContainer = document.getElementById("arcDots");

    if (!stage || !wheel) {
        return;
    }

    const cards = Array.from(wheel.querySelectorAll(".arc-card"));
    const dots = dotsContainer ? Array.from(dotsContainer.querySelectorAll(".arc-dot")) : [];
    const totalCards = cards.length;

    const phaseNames = [
        "IDENTIFY",
        "UNDERSTAND",
        "ANALYSE",
        "STRATEGY",
        "PROTOTYPE",
        "SYSTEM",
        "EXECUTION",
        "SCALE"
    ];

    let currentIndex = 0;
    let isDragging = false;
    let startX = 0;
    let currentDragAngle = 0;
    let baseRotationAngle = 0;

    // Helper: read current responsive step angle from CSS or viewport width
    function getStepAngle() {
        if (window.innerWidth <= 768) {
            return 28;
        }
        if (window.innerWidth <= 1024) {
            return 22;
        }
        return 18;
    }

    function updateCarousel(index, animate = true) {
        // Clamp index between 0 and totalCards - 1
        currentIndex = Math.max(0, Math.min(totalCards - 1, index));
        const stepAngle = getStepAngle();

        // Target rotation: The active card should sit at exactly 0deg (the apex)
        // Since Card i is placed at (i * stepAngle), wheel must rotate by - (i * stepAngle)
        const targetAngle = - (currentIndex * stepAngle);

        if (!animate) {
            wheel.classList.add("is-dragging");
        } else {
            wheel.classList.remove("is-dragging");
        }

        wheel.style.setProperty("--wheel-rotation", `${targetAngle}deg`);
        baseRotationAngle = targetAngle;

        // Update active class on cards
        cards.forEach((card, idx) => {
            if (idx === currentIndex) {
                card.classList.add("active");
                card.setAttribute("aria-current", "true");
            } else {
                card.classList.remove("active");
                card.removeAttribute("aria-current");
            }
        });

        // Update HUD pill
        if (stepNum) {
            stepNum.textContent = String(currentIndex + 1).padStart(2, "0");
        }
        if (stepName) {
            stepName.textContent = phaseNames[currentIndex] || "PHASE";
        }

        // Update dot indicators
        dots.forEach((dot, idx) => {
            if (idx === currentIndex) {
                dot.classList.add("active");
            } else {
                dot.classList.remove("active");
            }
        });

        // Update button disabled states
        if (prevBtn) {
            prevBtn.style.opacity = currentIndex === 0 ? "0.35" : "1";
            prevBtn.style.pointerEvents = currentIndex === 0 ? "none" : "auto";
        }
        if (nextBtn) {
            nextBtn.style.opacity = currentIndex === totalCards - 1 ? "0.35" : "1";
            nextBtn.style.pointerEvents = currentIndex === totalCards - 1 ? "none" : "auto";
        }
    }

    // Click on any card directly to rotate it to apex
    cards.forEach((card) => {
        card.addEventListener("click", () => {
            const idx = parseInt(card.getAttribute("data-index"), 10);
            if (!isNaN(idx)) {
                updateCarousel(idx);
            }
        });
    });

    // Prev / Next button clicks
    if (prevBtn) {
        prevBtn.addEventListener("click", () => {
            if (currentIndex > 0) {
                updateCarousel(currentIndex - 1);
            }
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener("click", () => {
            if (currentIndex < totalCards - 1) {
                updateCarousel(currentIndex + 1);
            }
        });
    }

    // Dot clicks
    dots.forEach((dot) => {
        dot.addEventListener("click", () => {
            const idx = parseInt(dot.getAttribute("data-index"), 10);
            if (!isNaN(idx)) {
                updateCarousel(idx);
            }
        });
    });

    // Touch and Drag Gesture Support
    function handleDragStart(e) {
        isDragging = true;
        startX = e.type.includes("touch") ? e.touches[0].clientX : e.clientX;
        currentDragAngle = baseRotationAngle;
        wheel.classList.add("is-dragging");
    }

    function handleDragMove(e) {
        if (!isDragging) return;
        const currentX = e.type.includes("touch") ? e.touches[0].clientX : e.clientX;
        const deltaX = currentX - startX;

        // Convert horizontal pixels into wheel rotation degrees
        const dragDegree = deltaX / 10;
        const stepAngle = getStepAngle();
        const minAngle = - ((totalCards - 1) * stepAngle) - 8;
        const maxAngle = 8;

        const prospectiveAngle = Math.max(minAngle, Math.min(maxAngle, baseRotationAngle + dragDegree));
        wheel.style.setProperty("--wheel-rotation", `${prospectiveAngle}deg`);
        currentDragAngle = prospectiveAngle;
    }

    function handleDragEnd() {
        if (!isDragging) return;
        isDragging = false;
        wheel.classList.remove("is-dragging");

        const stepAngle = getStepAngle();
        // Determine nearest card index
        const nearestIndex = Math.round(- currentDragAngle / stepAngle);
        updateCarousel(nearestIndex);
    }

    stage.addEventListener("mousedown", handleDragStart);
    window.addEventListener("mousemove", handleDragMove);
    window.addEventListener("mouseup", handleDragEnd);

    stage.addEventListener("touchstart", handleDragStart, { passive: true });
    window.addEventListener("touchmove", handleDragMove, { passive: true });
    window.addEventListener("touchend", handleDragEnd);

    // Mouse wheel scrolling over stage
    let wheelDebounceTimeout = null;
    stage.addEventListener("wheel", (e) => {
        const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
        if (Math.abs(delta) < 25) return;

        if (wheelDebounceTimeout) return;

        if (delta > 0 && currentIndex < totalCards - 1) {
            updateCarousel(currentIndex + 1);
        } else if (delta < 0 && currentIndex > 0) {
            updateCarousel(currentIndex - 1);
        }

        wheelDebounceTimeout = setTimeout(() => {
            wheelDebounceTimeout = null;
        }, 320);
    }, { passive: true });

    // Keyboard support when approach section is in view
    document.addEventListener("keydown", (e) => {
        const rect = stage.getBoundingClientRect();
        const isInView = rect.top < window.innerHeight && rect.bottom > 0;
        if (!isInView) return;

        if (e.key === "ArrowLeft" && currentIndex > 0) {
            updateCarousel(currentIndex - 1);
        } else if (e.key === "ArrowRight" && currentIndex < totalCards - 1) {
            updateCarousel(currentIndex + 1);
        }
    });

    // Window resize handler to recalculate active apex position
    window.addEventListener("resize", () => {
        updateCarousel(currentIndex, false);
    });

    // Initial positioning
    updateCarousel(0, false);

})();



/* =========================================================
   HERO TO ABOUT SCROLL TRANSITION CONTROLLER
   Smooth 60fps parallax depth between the panoramic Hero
   image and the About section, with architectural layer
   elevation, copy float-fade, and staggered editorial reveals.
========================================================= */

(() => {
    const hero = document.getElementById("home") || document.querySelector(".hero");
    const about = document.getElementById("about");
    if (!hero || !about) return;

    const heroBg = hero.querySelector(".hero-bg");
    const heroCopy = hero.querySelector(".hero-copy");
    const aboutBg = about.querySelector(".about-bg");
    const revealItems = about.querySelectorAll(".about-reveal-item");

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        revealItems.forEach(item => item.classList.add("is-revealed"));
        return;
    }


    // IntersectionObserver for the About section content reveal
    const aboutObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    revealItems.forEach((item) => item.classList.add("is-revealed"));
                }
            });
        },
        { threshold: 0.15 }
    );
    aboutObserver.observe(about);

    // High-performance scroll parallax engine
    let ticking = false;

    const onScroll = () => {
        if (!ticking) {
            requestAnimationFrame(updateParallax);
            ticking = true;
        }
    };

    const updateParallax = () => {
        ticking = false;

        const scrollY = window.scrollY || window.pageYOffset;
        const heroHeight = hero.offsetHeight || window.innerHeight;

        // Only compute when within or near the transition boundary (0 to heroHeight * 1.5)
        if (scrollY <= heroHeight * 1.5) {
            const progress = Math.min(1, Math.max(0, scrollY / (heroHeight * 0.85)));

            // 1. Hero background: subtle cinematic downward drift (parallax depth)
            if (heroBg) {
                const bgY = scrollY * 0.32;
                const bgScale = 1.04 + progress * 0.03;
                heroBg.style.transform = `translate3d(0, ${bgY.toFixed(1)}px, 0) scale(${bgScale.toFixed(3)})`;
            }

            // 2. Hero copy: gentle upward float and graceful fade out
            if (heroCopy) {
                const copyY = -scrollY * 0.38;
                const copyOpacity = Math.max(0, 1 - progress * 1.35);
                heroCopy.style.transform = `translate3d(0, ${copyY.toFixed(1)}px, 0)`;
                heroCopy.style.opacity = copyOpacity.toFixed(3);
            }

            // 3. About background: subtle camera settling as it scrolls into view
            if (aboutBg) {
                const aboutRect = about.getBoundingClientRect();
                const windowHeight = window.innerHeight;
                if (aboutRect.top < windowHeight && aboutRect.bottom > 0) {
                    const aboutProgress = 1 - (aboutRect.top / windowHeight);
                    const clampedProgress = Math.min(1, Math.max(0, aboutProgress));
                    const aboutY = (1 - clampedProgress) * 28;
                    const aboutScale = 1.06 - clampedProgress * 0.04;
                    aboutBg.style.transform = `translate3d(0, ${aboutY.toFixed(1)}px, 0) scale(${aboutScale.toFixed(3)})`;
                }
            }
        }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    updateParallax();
})();




/* =========================================================
   SPOTLIGHT CAROUSEL CONTROLLER ("WHAT WE DO")
   Middle card opened out to carry caption; re-crops image
========================================================= */

(() => {
    const rail = document.getElementById("spotlightRail");
    if (!rail) return;

    const cards = Array.from(rail.querySelectorAll(".spotlight-card"));
    const prevBtn = document.getElementById("spotlightPrev");
    const nextBtn = document.getElementById("spotlightNext");
    const stepNumEl = document.getElementById("spotlightStepNum");
    const stepNameEl = document.getElementById("spotlightStepName");
    const dots = Array.from(document.querySelectorAll(".spotlight-dot"));

    if (!cards.length) return;

    const serviceNames = [
        "Business Development",
        "Business Enhancement",
        "Strategy & GTM",
        "Digital & Automation",
        "Prototyping & Systems"
    ];

    // Default to the middle card (index 2: Strategy & GTM)
    let activeIndex = 2;

    const setSpotlight = (index) => {
        if (index < 0) index = 0;
        if (index >= cards.length) index = cards.length - 1;
        activeIndex = index;

        cards.forEach((card, idx) => {
            const isActive = idx === activeIndex;
            card.classList.toggle("active", isActive);
            card.setAttribute("aria-expanded", isActive ? "true" : "false");
        });

        // Update HUD
        if (stepNumEl) {
            stepNumEl.textContent = `0${activeIndex + 1}`;
        }
        if (stepNameEl && serviceNames[activeIndex]) {
            stepNameEl.textContent = serviceNames[activeIndex];
        }

        // Update Dots
        dots.forEach((dot, idx) => {
            dot.classList.toggle("active", idx === activeIndex);
        });

        // On mobile scroll rail into view
        const activeCard = cards[activeIndex];
        if (activeCard && window.innerWidth <= 768) {
            const railLeft = rail.getBoundingClientRect().left;
            const cardLeft = activeCard.getBoundingClientRect().left;
            const scrollOffset = cardLeft - railLeft - (rail.clientWidth / 2) + (activeCard.clientWidth / 2);
            rail.scrollBy({ left: scrollOffset, behavior: "smooth" });
        }
    };

    // Click on card to spotlight it
    cards.forEach((card, index) => {
        card.addEventListener("click", () => {
            if (activeIndex !== index) {
                setSpotlight(index);
            }
        });

        // Keyboard navigation on individual card focus (Enter or Space)
        card.addEventListener("keydown", (e) => {
            if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                setSpotlight(index);
            }
        });
    });
    // Arrow Buttons
    if (prevBtn) {
        prevBtn.addEventListener("click", () => {
            const nextIdx = activeIndex > 0 ? activeIndex - 1 : cards.length - 1;
            setSpotlight(nextIdx);
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener("click", () => {
            const nextIdx = activeIndex < cards.length - 1 ? activeIndex + 1 : 0;
            setSpotlight(nextIdx);
        });
    }

    // Dots
    dots.forEach((dot, idx) => {
        dot.addEventListener("click", () => {
            setSpotlight(idx);
        });
    });

    // Keyboard navigation when services section is in view
    document.addEventListener("keydown", (e) => {
        const rect = rail.getBoundingClientRect();
        const isInView = rect.top < window.innerHeight && rect.bottom > 0;
        if (!isInView) return;

        if (e.key === "ArrowLeft") {
            const nextIdx = activeIndex > 0 ? activeIndex - 1 : cards.length - 1;
            setSpotlight(nextIdx);
        } else if (e.key === "ArrowRight") {
            const nextIdx = activeIndex < cards.length - 1 ? activeIndex + 1 : 0;
            setSpotlight(nextIdx);
        }
    });

    // Touch swipe support on rail
    let touchStartX = 0;
    let touchEndX = 0;

    rail.addEventListener("touchstart", (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    rail.addEventListener("touchend", (e) => {
        touchEndX = e.changedTouches[0].screenX;
        const diff = touchStartX - touchEndX;
        if (Math.abs(diff) > 45) {
            if (diff > 0 && activeIndex < cards.length - 1) {
                setSpotlight(activeIndex + 1);
            } else if (diff < 0 && activeIndex > 0) {
                setSpotlight(activeIndex - 1);
            }
        }
    }, { passive: true });

    // Initialize with middle card
    setSpotlight(2);
})();




/* =========================================================
   3D CYLINDRICAL RING SLIDER CONTROLLER ("INDUSTRIES")
   Interactive 3D cylinder with drag, momentum physics,
   visible far-side cards through gaps, snap-to-card,
   and HUD synchronization.
========================================================= */

(() => {
    const stage = document.getElementById("cylinderStage");
    const ring = document.getElementById("cylinderRing");
    if (!stage || !ring) return;

    const cards = Array.from(ring.querySelectorAll(".cylinder-card"));
    if (!cards.length) return;

    const totalCards = cards.length;
    const stepAngle = 360 / totalCards; // 60 degrees for 6 cards

    const industryNames = cards.map(c => c.getAttribute("data-title") || "Industry");

    // Dynamic radius calculation based on stage width
    const getRadius = () => {
        const w = window.innerWidth;
        if (w <= 600) return 170;
        if (w <= 900) return 215;
        return 260;
    };

    let currentRadius = getRadius();

    // Position cards around 3D ring
    const layoutCards = () => {
        currentRadius = getRadius();
        cards.forEach((card, i) => {
            const baseAngle = i * stepAngle;
            card.style.transform = "rotateY(" + baseAngle + "deg) translateZ(" + currentRadius + "px)";
        });
    };

    layoutCards();
    window.addEventListener("resize", layoutCards);

    let currentRotation = 0;
    let targetRotation = 0;
    let activeIndex = 0;

    const updateRingTransform = (rot) => {
        ring.style.transform = "rotateX(-7deg) rotateY(" + rot + "deg)";
    };

    const updateActiveStates = () => {
        // Calculate which card is closest to front (angle closest to 0 mod 360)
        const normalized = ((-currentRotation % 360) + 360) % 360;
        const nearestIdx = Math.round(normalized / stepAngle) % totalCards;
        activeIndex = nearestIdx;

        cards.forEach((card, i) => {
            const isActive = i === activeIndex;
            card.classList.toggle("active", isActive);
            card.setAttribute("aria-selected", isActive ? "true" : "false");
        });
    };

    // Smooth spring/lerp to target angle
    let animFrame = null;
    const animateToTarget = () => {
        const diff = targetRotation - currentRotation;
        if (Math.abs(diff) > 0.05) {
            currentRotation += diff * 0.12;
            updateRingTransform(currentRotation);
            updateActiveStates();
            animFrame = requestAnimationFrame(animateToTarget);
        } else {
            currentRotation = targetRotation;
            updateRingTransform(currentRotation);
            updateActiveStates();
            animFrame = null;
        }
    };

    const rotateToIndex = (index) => {
        if (animFrame) cancelAnimationFrame(animFrame);
        // Find shortest angular path to target index
        const currentNorm = ((-currentRotation % 360) + 360) % 360;
        const targetNorm = index * stepAngle;
        let delta = currentNorm - targetNorm;
        if (delta > 180) delta -= 360;
        if (delta < -180) delta += 360;

        targetRotation = currentRotation + delta;
        animateToTarget();
    };

    // Direct card click: click any card to spin it to the front
    cards.forEach((card, idx) => {
        card.addEventListener("click", () => {
            if (isDraggingDistance > 8) return; // Ignore clicks resulting from a drag gesture
            rotateToIndex(idx);
        });
    });

    // Pointer Drag & Momentum Physics
    let isPointerDown = false;
    let startX = 0;
    let lastX = 0;
    let lastTime = 0;
    let velocity = 0;
    let isDraggingDistance = 0;

    stage.addEventListener("pointerdown", (e) => {
        isPointerDown = true;
        isDraggingDistance = 0;
        startX = e.clientX;
        lastX = e.clientX;
        lastTime = performance.now();
        velocity = 0;

        if (animFrame) cancelAnimationFrame(animFrame);
        stage.classList.add("is-dragging");
        stage.setPointerCapture(e.pointerId);
    });

    stage.addEventListener("pointermove", (e) => {
        if (!isPointerDown) return;
        const currentX = e.clientX;
        const deltaX = currentX - lastX;
        const now = performance.now();
        const dt = Math.max(1, now - lastTime);

        isDraggingDistance += Math.abs(deltaX);

        // Sensitivity factor: ~0.24 degrees per pixel
        const sensitivity = 0.24;
        currentRotation += deltaX * sensitivity;
        targetRotation = currentRotation;

        velocity = (deltaX / dt) * 14; // pixels per ms to angle velocity
        lastX = currentX;
        lastTime = now;

        updateRingTransform(currentRotation);
        updateActiveStates();
    });

    const onPointerRelease = (e) => {
        if (!isPointerDown) return;
        isPointerDown = false;
        stage.classList.remove("is-dragging");
        try {
            stage.releasePointerCapture(e.pointerId);
        } catch (_) {}

        // Inertia momentum with friction decay
        const runInertia = () => {
            if (Math.abs(velocity) > 0.08) {
                velocity *= 0.92; // Friction damping
                currentRotation += velocity;
                updateRingTransform(currentRotation);
                updateActiveStates();
                animFrame = requestAnimationFrame(runInertia);
            } else {
                // Snap to nearest card
                targetRotation = Math.round(currentRotation / stepAngle) * stepAngle;
                animateToTarget();
            }
        };

        if (Math.abs(velocity) > 0.3) {
            animFrame = requestAnimationFrame(runInertia);
        } else {
            targetRotation = Math.round(currentRotation / stepAngle) * stepAngle;
            animateToTarget();
        }
    };

    stage.addEventListener("pointerup", onPointerRelease);
    stage.addEventListener("pointercancel", onPointerRelease);

    // Keyboard navigation when industries section is in view
    document.addEventListener("keydown", (e) => {
        const rect = stage.getBoundingClientRect();
        const inView = rect.top < window.innerHeight && rect.bottom > 0;
        if (!inView) return;

        if (e.key === "ArrowLeft") {
            if (animFrame) cancelAnimationFrame(animFrame);
            targetRotation = Math.round(currentRotation / stepAngle) * stepAngle + stepAngle;
            animateToTarget();
        } else if (e.key === "ArrowRight") {
            if (animFrame) cancelAnimationFrame(animFrame);
            targetRotation = Math.round(currentRotation / stepAngle) * stepAngle - stepAngle;
            animateToTarget();
        }
    });

    // ---------------------------------------------------------
    // Scroll & Wheel Driven 3D Cylinder Spinning
    // ---------------------------------------------------------
    const industriesSection = document.getElementById("industries") || stage;
    let lastScrollY = window.scrollY;
    let scrollSnapTimer = null;
    let isWheelActive = false;
    let wheelTimer = null;

    // 1. Direct Mouse Wheel / Trackpad Scroll on Industries Section
    industriesSection.addEventListener("wheel", (e) => {
        const delta = Math.abs(e.deltaY) >= Math.abs(e.deltaX) ? e.deltaY : e.deltaX;
        if (Math.abs(delta) < 1) return;

        isWheelActive = true;
        clearTimeout(wheelTimer);
        wheelTimer = setTimeout(() => {
            isWheelActive = false;
        }, 160);

        if (animFrame) cancelAnimationFrame(animFrame);

        // Scroll down (delta > 0) -> rotates forward; scroll up -> rotates back
        const wheelSensitivity = 0.28;
        targetRotation -= delta * wheelSensitivity;
        currentRotation = targetRotation;
        updateRingTransform(currentRotation);
        updateActiveStates();

        // Snap to nearest card when wheel interaction pauses
        clearTimeout(scrollSnapTimer);
        scrollSnapTimer = setTimeout(() => {
            if (!isPointerDown) {
                targetRotation = Math.round(currentRotation / stepAngle) * stepAngle;
                animateToTarget();
            }
        }, 200);
    }, { passive: true });

    // 2. Global Page Scroll Coupling: spins as user scrolls down/up the page through the section
    window.addEventListener("scroll", () => {
        const currentScrollY = window.scrollY;
        const deltaY = currentScrollY - lastScrollY;
        lastScrollY = currentScrollY;

        // Skip if pointer dragging or if direct wheel on section is already driving
        if (isPointerDown || isWheelActive) return;

        // Ignore large jumps (e.g., page navigation, anchor link jumps)
        if (Math.abs(deltaY) > 200) return;

        const rect = stage.getBoundingClientRect();
        const winH = window.innerHeight || document.documentElement.clientHeight;
        const inView = rect.bottom > 40 && rect.top < winH - 40;
        if (!inView) return;

        if (animFrame) cancelAnimationFrame(animFrame);

        // Page scroll sensitivity: ~1 full 360deg spin across viewport journey
        const scrollFactor = 0.26;
        targetRotation -= deltaY * scrollFactor;
        currentRotation = targetRotation;
        updateRingTransform(currentRotation);
        updateActiveStates();

        // Snap to nearest card after scrolling settles
        clearTimeout(scrollSnapTimer);
        scrollSnapTimer = setTimeout(() => {
            if (!isPointerDown && !isWheelActive) {
                targetRotation = Math.round(currentRotation / stepAngle) * stepAngle;
                animateToTarget();
            }
        }, 220);
    }, { passive: true });

    // Initialize position and front card
    updateRingTransform(0);
    updateActiveStates();
})();

/* =========================================================
   STICKY HEADER & DYNAMIC SCROLL SPY
   Follows viewport through all sections & updates active tab
========================================================= */

(() => {
    const siteHeader = document.querySelector("header");
    const allNavLinks = document.querySelectorAll("nav a[href^='#']");

    const sectionIds = [
        "home",
        "about",
        "approach",
        "services",
        "industries",
        "insights",
        "contact"
    ];

    const sections = sectionIds
        .map(id => document.getElementById(id))
        .filter(Boolean);

    if (!siteHeader || sections.length === 0) return;

    let ticking = false;

    const setActiveLink = (targetId) => {
        allNavLinks.forEach(link => {
            const hrefId = (link.getAttribute("href") || "").replace("#", "");
            if (hrefId === targetId) {
                link.classList.add("active");
            } else {
                link.classList.remove("active");
            }
        });
    };

    const updateNavState = () => {
        const scrollY = window.pageYOffset || document.documentElement.scrollTop;

        // 1. Toggle header background on scroll
        if (scrollY > 30) {
            siteHeader.classList.add("is-scrolled");
        } else {
            siteHeader.classList.remove("is-scrolled");
        }

        // 2. Identify active section based on scroll position
        const headerHeight = siteHeader.offsetHeight || 74;
        const triggerPoint = scrollY + headerHeight + 80;

        let currentSectionId = "home";

        // Check each section top to bottom
        for (let i = 0; i < sections.length; i++) {
            const section = sections[i];
            const sectionTop = section.offsetTop;

            if (triggerPoint >= sectionTop) {
                currentSectionId = section.getAttribute("id");
            }
        }

        // Bottom of page override (ensure contact activates when near page end)
        const totalDocHeight = document.documentElement.scrollHeight;
        const viewportHeight = window.innerHeight;
        if (scrollY + viewportHeight >= totalDocHeight - 120) {
            currentSectionId = "contact";
        }

        setActiveLink(currentSectionId);
        ticking = false;
    };

    window.addEventListener("scroll", () => {
        if (!ticking) {
            window.requestAnimationFrame(updateNavState);
            ticking = true;
        }
    }, { passive: true });

    // Initial check on load
    updateNavState();

    // 3. Smooth scroll with header offset compensation on click
    allNavLinks.forEach(link => {
        link.addEventListener("click", (e) => {
            const targetId = (link.getAttribute("href") || "").replace("#", "");
            const targetElement = document.getElementById(targetId);

            if (targetElement) {
                e.preventDefault();
                const headerHeight = siteHeader.offsetHeight || 74;
                const elementTop = targetElement.getBoundingClientRect().top + window.pageYOffset;
                const destination = targetId === "home" ? 0 : Math.max(0, elementTop - headerHeight + 5);

                window.scrollTo({
                    top: destination,
                    behavior: "smooth"
                });

                setActiveLink(targetId);
            }
        });
    });
})();

/* =========================================================
   WINDOW LOAD
========================================================= */

window.addEventListener(
    "load",
    () => {

        /*
         * Give layout-dependent systems a final refresh.
         */

        window.dispatchEvent(
            new Event("resize")
        );

    },
    {
        once: true
    }
);