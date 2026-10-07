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
       Skip triggers (Button, Click, Keyboard)
    ----------------------------------------------------- */

    const introSkipBtn =
        document.getElementById("intro-skip");

    if (introSkipBtn) {

        introSkipBtn.addEventListener(
            "click",
            (event) => {

                event.stopPropagation();
                completeIntro();

            }
        );

    }

    introScreen.addEventListener(
        "click",
        () => {

            completeIntro();

        }
    );

    const onKeyDismiss = (event) => {

        if (
            event.key === "Escape" ||
            event.key === " "
        ) {

            completeIntro();
            window.removeEventListener(
                "keydown",
                onKeyDismiss
            );

        }

    };

    window.addEventListener(
        "keydown",
        onKeyDismiss
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

    // Dynamically target backend whether on port 5000 or port 5500
    const API_BASE_URL =
        window.location.port === "5000" || (!window.location.port && window.location.protocol.startsWith("http") && !window.location.hostname.includes("localhost"))
            ? ""
            : "http://localhost:5000";


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
    const lineMasks = about.querySelectorAll(".about-line-mask");
    const goldSpine = about.querySelector(".about-gold-spine");

    const leftCol = about.querySelector(".about-left-col");
    const eyebrow = about.querySelector(".about-eyebrow");
    const leadStmt = about.querySelector(".about-lead-statement");
    const narrative = about.querySelector(".about-narrative-body");
    const aboutContent = about.querySelector(".about-content") || about;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        if (leftCol) leftCol.classList.add("is-revealed");
        if (eyebrow) eyebrow.classList.add("is-revealed");
        lineMasks.forEach(mask => mask.classList.add("is-revealed"));
        if (goldSpine) goldSpine.classList.add("is-revealed");
        if (leadStmt) leadStmt.classList.add("is-revealed");
        if (narrative) narrative.classList.add("is-revealed");
        revealItems.forEach(item => item.classList.add("is-revealed"));
        return;
    }

    let isRevealedState = false;
    let revealTimeouts = [];

    function clearRevealTimeouts() {
        revealTimeouts.forEach(t => clearTimeout(t));
        revealTimeouts = [];
    }

    function triggerAboutReveal(forceReset = false) {
        if (forceReset) {
            clearRevealTimeouts();
            isRevealedState = false;
            if (leftCol) leftCol.classList.remove("is-revealed");
            if (eyebrow) eyebrow.classList.remove("is-revealed");
            lineMasks.forEach(mask => mask.classList.remove("is-revealed"));
            if (goldSpine) goldSpine.classList.remove("is-revealed");
            if (leadStmt) leadStmt.classList.remove("is-revealed");
            if (narrative) narrative.classList.remove("is-revealed");
            revealItems.forEach(item => item.classList.remove("is-revealed"));
            return;
        }

        if (isRevealedState) return;
        isRevealedState = true;
        clearRevealTimeouts();

        // Staggered choreography that feels fluid & cinematic
        // Step 1: Left column marker and eyebrow kicker
        revealTimeouts.push(setTimeout(() => {
            if (leftCol) leftCol.classList.add("is-revealed");
            if (eyebrow) eyebrow.classList.add("is-revealed");
        }, 60));

        // Step 2: Headline Line 1 upward roll
        revealTimeouts.push(setTimeout(() => {
            if (lineMasks[0]) lineMasks[0].classList.add("is-revealed");
        }, 160));

        // Step 3: Headline Line 2 upward roll & gold spine drop
        revealTimeouts.push(setTimeout(() => {
            if (lineMasks[1]) lineMasks[1].classList.add("is-revealed");
            if (goldSpine) goldSpine.classList.add("is-revealed");
        }, 320));

        // Step 4: Lead statement glide
        revealTimeouts.push(setTimeout(() => {
            if (leadStmt) leadStmt.classList.add("is-revealed");
        }, 460));

        // Step 5: Narrative body glide
        revealTimeouts.push(setTimeout(() => {
            if (narrative) narrative.classList.add("is-revealed");
        }, 600));
    }

    // IntersectionObserver for About content reveal
    const aboutObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting && entry.intersectionRatio >= 0.18) {
                    triggerAboutReveal(false);
                } else if (!entry.isIntersecting && entry.boundingClientRect.top > 0) {
                    // Reset when user scrolls back above the section so it replays smoothly
                    triggerAboutReveal(true);
                }
            });
        },
        {
            threshold: [0, 0.18, 0.35],
            rootMargin: "0px 0px -40px 0px"
        }
    );
    aboutObserver.observe(aboutContent);

    // Initial check on load in case page is refreshed or opened at About
    const initRect = aboutContent.getBoundingClientRect();
    if (initRect.top < window.innerHeight * 0.75 && initRect.bottom > 100) {
        setTimeout(() => triggerAboutReveal(false), 200);
    }

    // Re-trigger reveal when clicking any About navigation link
    document.querySelectorAll('a[href="#about"]').forEach(link => {
        link.addEventListener("click", () => {
            triggerAboutReveal(true);
            setTimeout(() => triggerAboutReveal(false), 320);
        });
    });

    // Subtle 3D mouse parallax on About section (desktop only)
    if (window.matchMedia("(min-width: 1024px)").matches) {
        about.addEventListener("mousemove", (e) => {
            const rect = about.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;

            const headline = about.querySelector(".about-stylish-headline");
            if (headline) {
                headline.style.transform = `translate3d(${(x * 10).toFixed(1)}px, ${(y * 6).toFixed(1)}px, 0)`;
                headline.style.transition = "transform 0.1s ease-out";
            }
        }, { passive: true });

        about.addEventListener("mouseleave", () => {
            const headline = about.querySelector(".about-stylish-headline");
            if (headline) {
                headline.style.transform = "translate3d(0, 0, 0)";
                headline.style.transition = "transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)";
            }
        });
    }

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
   PROJECTED-SPACE CONCAVE 3D RING GALLERY CONTROLLER ("INDUSTRIES")
   Portrait cards on a 3D ring curling around the viewer.
   Recessed and smallest in the middle; edges curl forward and lean inward.
   Screen gaps are solved in projected space for strictly uniform spacing.
========================================================= */

(() => {
    const stage = document.getElementById("curvedStage");
    const ring = document.getElementById("curvedRing");
    if (!stage || !ring) return;

    const cards = Array.from(ring.querySelectorAll(".curved-card"));
    if (!cards.length) return;

    const totalCards = cards.length;
    const hudCount = document.getElementById("curvedHudCount");
    const hudTitle = document.getElementById("curvedHudTitle");
    const prevBtn = document.getElementById("curvedPrevBtn");
    const nextBtn = document.getElementById("curvedNextBtn");
    const dotBtns = Array.from(document.querySelectorAll(".curved-dot"));

    const titles = cards.map(c => c.getAttribute("data-title") || "Industry");

    // Dynamic geometry tuned for strictly uniform screen gaps & concave forward curling
    const getGeometry = () => {
        const w = window.innerWidth;
        if (w <= 480) {
            return { gap: 195, zForward: 140, thetaMax: 24, sMin: 0.85, sMax: 1.04 };
        }
        if (w <= 768) {
            return { gap: 230, zForward: 165, thetaMax: 26, sMin: 0.86, sMax: 1.05 };
        }
        if (w <= 1024) {
            return { gap: 260, zForward: 185, thetaMax: 28, sMin: 0.87, sMax: 1.05 };
        }
        return { gap: 290, zForward: 215, thetaMax: 30, sMin: 0.86, sMax: 1.06 };
    };

    let currentPos = 0;
    let targetPos = 0;
    let activeIndex = 0;
    let animFrame = null;

    // Update HUD counters, title, and active dot
    const updateHUD = (nearestIdx) => {
        if (hudCount) {
            hudCount.textContent = `0${nearestIdx + 1} / 0${totalCards}`;
        }
        if (hudTitle) {
            hudTitle.textContent = titles[nearestIdx];
        }
        dotBtns.forEach((dot, idx) => {
            const isActive = idx === nearestIdx;
            dot.classList.toggle("active", isActive);
            dot.setAttribute("aria-selected", isActive ? "true" : "false");
        });
    };

    // Render cards using Projected-Space Inverse Mapping
    const renderGallery = (pos) => {
        const geo = getGeometry();
        const N = totalCards;

        // Wrap current active index into [0, N-1]
        const nearestIdx = ((Math.round(pos) % N) + N) % N;
        activeIndex = nearestIdx;

        cards.forEach((card, i) => {
            // Signed cyclic delta in range [-N/2, +N/2]
            let delta = ((i - pos) % N + N * 1.5) % N - N / 2;

            // 1. PROJECTED SCREEN-SPACE X:
            // Strictly linear delta * gap ensures constant visual spacing across screen!
            const xProj = delta * geo.gap;

            // 2. CONCAVE 3D RING DEPTH (CURLS FORWARD AROUND VIEWER):
            // Center (delta = 0) is recessed back; flanks sweep forward towards camera
            const absDelta = Math.abs(delta);
            const normX = Math.min(absDelta / (N / 2), 1.0);
            const zVal = Math.pow(normX, 1.45) * geo.zForward;

            // 3. SMALLEST IN THE MIDDLE:
            // Center is compact & focused; edges scale up as they curl forward
            const scale = geo.sMin + (geo.sMax - geo.sMin) * Math.pow(normX, 1.15);

            // 4. LEANING IN AT BOTH EDGES:
            // Left cards (delta < 0) rotate clockwise (+Y); Right cards (delta > 0) rotate counter-clockwise (-Y)
            const sign = delta < 0 ? -1 : (delta > 0 ? 1 : 0);
            const rotY = -sign * geo.thetaMax * Math.pow(normX, 0.85);

            // Subtle vertical amphitheater pitch and roll cant
            const rotX = -3.5;
            const rotZ = -sign * Math.pow(normX, 1.2) * 2;

            // 5. OPACITY / VISIBILITY:
            let opacity = 1;
            if (absDelta > 2.0) {
                opacity = Math.max(0, 1 - (absDelta - 2.0) / 0.8);
            }

            if (opacity <= 0.02) {
                card.style.visibility = "hidden";
                card.style.pointerEvents = "none";
            } else {
                card.style.visibility = "visible";
                card.style.pointerEvents = "auto";
            }

            // Apply 3D composite transform
            card.style.transform = `translate3d(${xProj.toFixed(2)}px, 0, ${zVal.toFixed(2)}px) rotateX(${rotX}deg) rotateY(${rotY.toFixed(2)}deg) rotateZ(${rotZ.toFixed(2)}deg) scale(${scale.toFixed(3)})`;
            card.style.opacity = opacity.toFixed(3);

            // Z-Index ordering so advancing edge cards properly layer with center card
            const isApex = absDelta < 0.45;
            card.style.zIndex = Math.round(100 + zVal);

            card.classList.toggle("active", isApex);
            card.setAttribute("aria-selected", isApex ? "true" : "false");
        });

        updateHUD(nearestIdx);
    };

    // Smooth spring / lerp animation loop
    const animateToTarget = () => {
        const diff = targetPos - currentPos;
        if (Math.abs(diff) > 0.002) {
            currentPos += diff * 0.14; // smooth fluid damping
            renderGallery(currentPos);
            animFrame = requestAnimationFrame(animateToTarget);
        } else {
            currentPos = targetPos;
            renderGallery(currentPos);
            animFrame = null;
        }
    };

    const goToIndex = (idx) => {
        if (animFrame) cancelAnimationFrame(animFrame);
        const N = totalCards;
        const currentNorm = ((currentPos % N) + N) % N;
        let delta = idx - currentNorm;
        if (delta > N / 2) delta -= N;
        if (delta < -N / 2) delta += N;

        targetPos = currentPos + delta;
        animateToTarget();
    };

    // Click direct card to bring it to center
    cards.forEach((card, idx) => {
        card.addEventListener("click", () => {
            if (isDraggingDistance > 8) return; // Prevent click on drag release
            goToIndex(idx);
        });
    });

    // HUD Button Controls
    if (prevBtn) {
        prevBtn.addEventListener("click", () => {
            if (animFrame) cancelAnimationFrame(animFrame);
            targetPos = Math.round(currentPos) - 1;
            animateToTarget();
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener("click", () => {
            if (animFrame) cancelAnimationFrame(animFrame);
            targetPos = Math.round(currentPos) + 1;
            animateToTarget();
        });
    }

    // Dot indicators click
    dotBtns.forEach((dot, idx) => {
        dot.addEventListener("click", () => {
            goToIndex(idx);
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

        // Map drag pixels directly through gap geometry: 1 gap = 1 card index
        const geo = getGeometry();
        const sensitivity = 1 / geo.gap;
        currentPos -= deltaX * sensitivity;
        targetPos = currentPos;

        velocity = -(deltaX / dt) * 16 * sensitivity;
        lastX = currentX;
        lastTime = now;

        renderGallery(currentPos);
    });

    const onPointerRelease = (e) => {
        if (!isPointerDown) return;
        isPointerDown = false;
        stage.classList.remove("is-dragging");
        try {
            stage.releasePointerCapture(e.pointerId);
        } catch (_) {}

        // Inertia momentum with friction damping
        const runInertia = () => {
            if (Math.abs(velocity) > 0.005) {
                velocity *= 0.91;
                currentPos += velocity;
                renderGallery(currentPos);
                animFrame = requestAnimationFrame(runInertia);
            } else {
                targetPos = Math.round(currentPos);
                animateToTarget();
            }
        };

        if (Math.abs(velocity) > 0.02) {
            animFrame = requestAnimationFrame(runInertia);
        } else {
            targetPos = Math.round(currentPos);
            animateToTarget();
        }
    };

    stage.addEventListener("pointerup", onPointerRelease);
    stage.addEventListener("pointercancel", onPointerRelease);

    // Keyboard Navigation
    document.addEventListener("keydown", (e) => {
        const rect = stage.getBoundingClientRect();
        const inView = rect.top < window.innerHeight && rect.bottom > 0;
        if (!inView) return;

        if (e.key === "ArrowLeft") {
            if (animFrame) cancelAnimationFrame(animFrame);
            targetPos = Math.round(currentPos) - 1;
            animateToTarget();
        } else if (e.key === "ArrowRight") {
            if (animFrame) cancelAnimationFrame(animFrame);
            targetPos = Math.round(currentPos) + 1;
            animateToTarget();
        }
    });

    // Mouse Wheel / Trackpad Scroll on Industries Section
    const industriesSection = document.getElementById("industries") || stage;
    let isWheelActive = false;
    let wheelTimer = null;
    let scrollSnapTimer = null;

    industriesSection.addEventListener("wheel", (e) => {
        const delta = Math.abs(e.deltaX) >= Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
        if (Math.abs(delta) < 2) return;

        isWheelActive = true;
        clearTimeout(wheelTimer);
        wheelTimer = setTimeout(() => {
            isWheelActive = false;
        }, 180);

        if (animFrame) cancelAnimationFrame(animFrame);

        const wheelFactor = 0.0024;
        targetPos += delta * wheelFactor;
        currentPos = targetPos;
        renderGallery(currentPos);

        clearTimeout(scrollSnapTimer);
        scrollSnapTimer = setTimeout(() => {
            if (!isPointerDown) {
                targetPos = Math.round(currentPos);
                animateToTarget();
            }
        }, 220);
    }, { passive: true });

    // Global Page Scroll Coupling (gentle turn while user journeys past section)
    let lastScrollY = window.scrollY;
    window.addEventListener("scroll", () => {
        if (window.innerWidth <= 768) return; // Keep mobile touch scrolling clean and unhindered

        const currentScrollY = window.scrollY;
        const deltaY = currentScrollY - lastScrollY;
        lastScrollY = currentScrollY;

        if (isPointerDown || isWheelActive) return;
        if (Math.abs(deltaY) > 180) return;

        const rect = stage.getBoundingClientRect();
        const winH = window.innerHeight || document.documentElement.clientHeight;
        const inView = rect.bottom > 60 && rect.top < winH - 60;
        if (!inView) return;

        if (animFrame) cancelAnimationFrame(animFrame);

        const pageScrollFactor = 0.0016;
        targetPos += deltaY * pageScrollFactor;
        currentPos = targetPos;
        renderGallery(currentPos);

        clearTimeout(scrollSnapTimer);
        scrollSnapTimer = setTimeout(() => {
            if (!isPointerDown && !isWheelActive) {
                targetPos = Math.round(currentPos);
                animateToTarget();
            }
        }, 240);
    }, { passive: true });

    // Window resize recalculation
    window.addEventListener("resize", () => {
        renderGallery(currentPos);
    });

    // Initial render
    renderGallery(0);
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
   INSIGHTS SECTION ANIMATION OBSERVER
   ========================================================= */
(() => {
    const insights = document.getElementById("insights");
    if (!insights) return;

    const masks = insights.querySelectorAll(".insights-line-mask");
    const spine = insights.querySelector(".insights-gold-spine");

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        masks.forEach(m => m.classList.add("is-revealed"));
        if (spine) spine.classList.add("is-revealed");
        return;
    }

    const obs = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                if (spine) spine.classList.add("is-revealed");
                masks.forEach((mask, idx) => {
                    setTimeout(() => mask.classList.add("is-revealed"), 60 + idx * 120);
                });
            }
        });
    }, { threshold: 0.15 });

    obs.observe(insights);
})();

/* =========================================================
   BLUEPRINT DRAWER CONTROLLER: BUSINESS SERVICES ARCHITECTURE
   Handles opening/closing of the slide-in architectural
   obsidian glass blueprint drawer from the right edge,
   with dynamic switching between Business Development &
   Business Enhancement service pathways.
========================================================= */
(() => {
    const drawer = document.getElementById("blueprintDrawer");
    const overlay = document.getElementById("blueprintOverlay");
    const closeBtn = document.getElementById("blueprintCloseBtn");
    const triggers = document.querySelectorAll(".blueprint-trigger");
    const ctaBtn = document.getElementById("blueprintCtaBtn");

    if (!drawer || !overlay) return;

    // Domain-specific service blueprint data definitions
    const serviceBlueprints = {
        "business-development": {
            num: "01",
            tag: "CAPABILITIES // 01",
            domain: "BUSINESS DEVELOPMENT",
            title: "Business Development <span>Services.</span>",
            lead: "A disciplined 5-stage strategic engagement model to analyze, structure, and convert market potential into high-velocity commercial growth.",
            footerHeading: "Ready to trigger your next 10X growth phase?",
            footerSub: "Discuss your business development requirements directly with our strategic team.",
            steps: [
                {
                    num: "01",
                    phase: "PHASE 01 // DIAGNOSTIC",
                    title: "Analyse the Business",
                    desc: "We analyse your business, market, customers and opportunities to identify potential areas for growth.",
                    metrics: ["Market Viability", "Customer Segments", "Opportunity Mapping"]
                },
                {
                    num: "02",
                    phase: "PHASE 02 // ARCHITECTURE",
                    title: "Build the Framework",
                    desc: "We create a clear framework that gives direction to the identified opportunities and growth possibilities.",
                    metrics: ["Growth Framework", "Value Horizons", "Resource Allocation"]
                },
                {
                    num: "03",
                    phase: "PHASE 03 // STRATEGY",
                    title: "Develop the Strategies",
                    desc: "We develop practical strategies based on the business goals, opportunities and market potential.",
                    metrics: ["Commercial Roadmaps", "Competitive Edge", "Revenue Streams"]
                },
                {
                    num: "04",
                    phase: "PHASE 04 // ACTIVATION",
                    title: "Idea to Execution",
                    desc: "We turn the strategies into clear ideas and an execution pathway that your team can take forward.",
                    metrics: ["Operational Playbooks", "Actionable Milestones", "Team Workstreams"]
                },
                {
                    num: "05",
                    phase: "PHASE 05 // CLIENT EXECUTION",
                    title: "Execution at Your End",
                    desc: "We provide the ideas, framework and strategic direction; the actual execution is carried out by your team.",
                    metrics: ["Strategic Direction", "Framework & Ideas", "Internal Team Execution"]
                }
            ]
        },
        "business-enhancement": {
            num: "02",
            tag: "CAPABILITIES // 02",
            domain: "BUSINESS ENHANCEMENT",
            title: "Business Enhancement <span>Services.</span>",
            lead: "A comprehensive 5-phase optimization framework to diagnose, fortify, and scale existing operations, customer journeys, and commercial performance.",
            footerHeading: "Ready to elevate your existing business?",
            footerSub: "Discuss your business enhancement goals directly with our strategic team.",
            steps: [
                {
                    num: "01",
                    phase: "PHASE 01 // AUDIT & DIAGNOSTIC",
                    title: "Analyse the Existing Business",
                    desc: "We study your current business, processes, offerings and performance to identify areas that can be improved.",
                    metrics: ["Process Audit", "Performance Review", "Offering Assessment"]
                },
                {
                    num: "02",
                    phase: "PHASE 02 // GAP DISCOVERY",
                    title: "Identify Improvement Opportunities",
                    desc: "We identify gaps, challenges and opportunities that can help strengthen and improve the existing business.",
                    metrics: ["Friction Analysis", "Untapped Potential", "Operational Bottlenecks"]
                },
                {
                    num: "03",
                    phase: "PHASE 03 // STRATEGIC REFINEMENT",
                    title: "Develop Enhancement Strategies",
                    desc: "We create strategies to improve your business model, offerings, customer experience, positioning and overall potential.",
                    metrics: ["Model Innovation", "CX Optimization", "Strategic Positioning"]
                },
                {
                    num: "04",
                    phase: "PHASE 04 // ARCHITECTURE & ROADMAP",
                    title: "Build the Enhancement Framework",
                    desc: "We structure the ideas and strategies into a clear framework that shows what can be improved and how it can be approached.",
                    metrics: ["Enhancement Matrix", "Priority Roadmap", "Structured Playbook"]
                },
                {
                    num: "05",
                    phase: "PHASE 05 // COMPLETE EXECUTION & ROLLOUT",
                    title: "Execution at Our End",
                    desc: "Execution is driven directly at our end — providing full, hands-on support from foundational basics and market opportunity capture to high-impact ads execution, creative campaigns, and continuous operational scaling.",
                    metrics: ["Execution at Our End", "Foundational Basics", "Market Opportunities", "Ads & Campaign Execution"]
                }
            ]
        },
        "strategy-gtm": {
            num: "03",
            tag: "CAPABILITIES // 03",
            domain: "STRATEGY & GTM",
            title: "Strategy & GTM <span>Services.</span>",
            lead: "Turn ambition into a clear market direction, defensible competitive positioning, and a coordinated go-to-market commercial engine.",
            footerHeading: "Ready to launch and scale your go-to-market engine?",
            footerSub: "Discuss your commercial launch strategy directly with our strategic team.",
            steps: [
                {
                    num: "01",
                    phase: "PHASE 01 // INTELLIGENCE & MARKET",
                    title: "Understand the Business & Market",
                    desc: "We analyse your business, target market, customers and competition to establish the right strategic direction.",
                    metrics: ["Business Analysis", "Target Market", "Competitive Direction"]
                },
                {
                    num: "02",
                    phase: "PHASE 02 // POSITIONING",
                    title: "Define the Positioning",
                    desc: "We define how your business, product or service should be positioned and presented to the right audience.",
                    metrics: ["Brand Positioning", "Audience Alignment", "Core Presentation"]
                },
                {
                    num: "03",
                    phase: "PHASE 03 // GTM STRATEGY",
                    title: "Develop the GTM Strategy",
                    desc: "We create the Go-to-Market strategy covering target audience, channels, messaging, customer journey and market approach.",
                    metrics: ["Channel Strategy", "Messaging Framework", "Customer Journey"]
                },
                {
                    num: "04",
                    phase: "PHASE 04 // STRATEGIC ROADMAP",
                    title: "Build the Strategic Roadmap",
                    desc: "We convert the strategy into a clear roadmap with priorities and actionable steps.",
                    metrics: ["Priority Mapping", "Actionable Milestones", "Execution Plan"]
                },
                {
                    num: "05",
                    phase: "PHASE 05 // TEAM EXECUTION",
                    title: "Execution by Our Team",
                    desc: "We take the strategy forward through our team and handle the required execution to bring the plan into action.",
                    metrics: ["Execution by Our Team", "Plan into Action", "Continuous Delivery"]
                }
            ]
        },
        "digital-automation": {
            num: "04",
            tag: "CAPABILITIES // 04",
            domain: "DIGITAL & AUTOMATION",
            title: "Digital & Automation <span>Services.</span>",
            lead: "Build intelligent digital infrastructure, connected workflow automations, and modern customer portals tailored to real business needs.",
            footerHeading: "Ready to automate and modernize your operations?",
            footerSub: "Discuss your automation and system requirements directly with our technical team.",
            steps: [
                {
                    num: "01",
                    phase: "PHASE 01 // WORKFLOW AUTOMATION",
                    title: "Workflow Automation",
                    desc: "Automating repetitive business workflows to reduce manual effort and improve efficiency.",
                    metrics: ["Repetitive Workflows", "Manual Effort Reduction", "Process Efficiency"]
                },
                {
                    num: "02",
                    phase: "PHASE 02 // PRODUCTION AUTOMATION",
                    title: "Production Automation",
                    desc: "Using digital systems and technology to streamline production processes, monitoring and operations.",
                    metrics: ["Digital Systems", "Process Monitoring", "Streamlined Operations"]
                },
                {
                    num: "03",
                    phase: "PHASE 03 // AI-POWERED AUTOMATION",
                    title: "AI-Powered Automation",
                    desc: "Applying AI to automate tasks, improve decision-making and create smarter business processes.",
                    metrics: ["AI Automation", "Smart Decision-Making", "Intelligent Processes"]
                },
                {
                    num: "04",
                    phase: "PHASE 04 // SYSTEM INTEGRATION",
                    title: "System & Software Integration",
                    desc: "Connecting different software, platforms and business systems so they work together seamlessly.",
                    metrics: ["System Integration", "Cross-Platform Sync", "Unified Systems"]
                },
                {
                    num: "05",
                    phase: "PHASE 05 // DIGITAL PLATFORMS & TOOLS",
                    title: "Digital Platforms & Tools",
                    desc: "Designing and implementing digital platforms and tools that support business operations, customers and growth.",
                    metrics: ["Platform Design", "Operational Tools", "Business Growth"]
                },
                {
                    num: "06",
                    phase: "PHASE 06 // DIGITAL TRANSFORMATION",
                    title: "Digital Transformation",
                    desc: "Modernising business processes, systems and operations through technology to create a more efficient and scalable business",
                    metrics: ["Modernised Processes", "Technology Modernisation", "Scalable Business"]
                }
            ]
        },
        "prototyping-systems": {
            num: "05",
            tag: "CAPABILITIES // 05",
            domain: "PROTOTYPING & SYSTEMS",
            title: "Prototyping & Systems <span>Services.</span>",
            lead: "Transform concepts and operating models into functional prototypes, scalable architectures, and production-ready business systems.",
            footerHeading: "Ready to turn ideas into tangible, functioning systems?",
            footerSub: "Discuss your prototyping and systems requirements directly with our engineering team.",
            steps: [
                {
                    num: "01",
                    phase: "PHASE 01 // IDEA TO PROTOTYPE",
                    title: "Idea to Prototype",
                    desc: "We transform your project idea into a prototype that clearly demonstrates how the concept could work.",
                    metrics: ["Concept Proof", "Functional Prototype", "Feasibility Showcase"]
                },
                {
                    num: "02",
                    phase: "PHASE 02 // PROJECT PROTOTYPING",
                    title: "Project Prototyping",
                    desc: "We build visual or interactive prototypes to help explain, present and validate your project before development.",
                    metrics: ["Interactive Models", "Pre-Dev Validation", "Visual Clarification"]
                },
                {
                    num: "03",
                    phase: "PHASE 03 // PRODUCT & PLATFORMS",
                    title: "Product & Platform Prototypes",
                    desc: "We prototype websites, applications, digital platforms and other product concepts.",
                    metrics: ["Web & App UX", "Platform Prototypes", "Product Concepts"]
                },
                {
                    num: "04",
                    phase: "PHASE 04 // BUSINESS SYSTEMS",
                    title: "Business System Prototyping",
                    desc: "We visualise workflows, processes and systems to show how different parts of the business can work together.",
                    metrics: ["Workflow Modeling", "Process Architecture", "System Synergy"]
                },
                {
                    num: "05",
                    phase: "PHASE 05 // CONCEPT VISUALISATION",
                    title: "Concept Visualisation",
                    desc: "We turn complex ideas into clear, understandable prototypes that can be presented to teams, clients, partners or investors.",
                    metrics: ["Stakeholder Alignment", "Investor Pitches", "Concept Clarity"]
                },
                {
                    num: "06",
                    phase: "PHASE 06 // PROTOTYPE TO DEV",
                    title: "Prototype to Development",
                    desc: "Once the concept is validated, the prototype can serve as the foundation for actual development and implementation.",
                    metrics: ["Validated Foundation", "Development Ready", "Full Implementation"]
                }
            ]
        }
    };

    let activeServiceKey = "business-development";
    let previousActiveElement = null;

    const renderServiceBlueprint = (serviceKey) => {
        const data = serviceBlueprints[serviceKey] || serviceBlueprints["business-development"];
        activeServiceKey = serviceKey;
        window.activeBlueprintKey = serviceKey;

        const tagMain = document.getElementById("blueprintTagMain");
        const tagSub = document.getElementById("blueprintTagSub");
        const numWatermark = document.getElementById("blueprintNumWatermark");
        const titleEl = document.getElementById("blueprintDrawerTitle");
        const leadEl = document.getElementById("blueprintLead");
        const timelineEl = document.getElementById("blueprintTimeline");
        const footerHeading = document.getElementById("blueprintFooterHeading");
        const footerSub = document.getElementById("blueprintFooterSub");

        if (tagMain) tagMain.textContent = data.tag;
        if (tagSub) tagSub.textContent = data.domain || "SERVICE FRAMEWORK";
        if (numWatermark) numWatermark.textContent = data.num;
        if (titleEl) titleEl.innerHTML = data.title;
        if (leadEl) leadEl.textContent = data.lead;
        if (footerHeading) footerHeading.textContent = data.footerHeading;
        if (footerSub) footerSub.textContent = data.footerSub;

        // Rebuild timeline steps exclusively for this domain
        if (timelineEl) {
            let html = `
                <div class="blueprint-spine" aria-hidden="true">
                    <div class="blueprint-spine-glow"></div>
                </div>
            `;
            data.steps.forEach((step, idx) => {
                const stepNum = idx + 1;
                const metricsHtml = step.metrics.map(m => `<span class="metric-pill">${m}</span>`).join("");
                html += `
                    <article class="blueprint-step" data-step="${stepNum}">
                        <div class="blueprint-node">
                            <span class="blueprint-node-num">${step.num}</span>
                        </div>
                        <div class="blueprint-card">
                            <div class="blueprint-card-head">
                                <span class="blueprint-phase-pill">${step.phase}</span>
                                <h3>${step.title}</h3>
                            </div>
                            <p>${step.desc}</p>
                            <div class="blueprint-step-metrics">
                                ${metricsHtml}
                            </div>
                        </div>
                    </article>
                `;
            });
            timelineEl.innerHTML = html;
        }
    };

    const openDrawer = (serviceKey = "business-development", e = null) => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        previousActiveElement = document.activeElement;

        // Render exclusively the selected domain's services
        renderServiceBlueprint(serviceKey);

        overlay.classList.add("is-open");
        drawer.classList.add("is-open");
        overlay.setAttribute("aria-hidden", "false");
        drawer.setAttribute("aria-hidden", "false");
        document.body.style.overflow = "hidden";

        // Auto-focus close button for keyboard accessibility
        if (closeBtn) {
            setTimeout(() => closeBtn.focus(), 150);
        }
    };

    const closeDrawer = () => {
        overlay.classList.remove("is-open");
        drawer.classList.remove("is-open");
        overlay.setAttribute("aria-hidden", "true");
        drawer.setAttribute("aria-hidden", "true");
        document.body.style.overflow = "";

        if (previousActiveElement && typeof previousActiveElement.focus === "function") {
            previousActiveElement.focus();
        }
    };

    // Attach trigger clicks (reads exact data-service-key from clicked button)
    triggers.forEach(trigger => {
        trigger.addEventListener("click", (e) => {
            const serviceKey = trigger.getAttribute("data-service-key") || "business-development";
            openDrawer(serviceKey, e);
        });
    });

    if (closeBtn) {
        closeBtn.addEventListener("click", (e) => {
            e.preventDefault();
            e.stopPropagation();
            closeDrawer();
        });
    }

    if (overlay) {
        overlay.addEventListener("click", (e) => {
            e.preventDefault();
            e.stopPropagation();
            closeDrawer();
        });
    }

    if (ctaBtn) {
        ctaBtn.addEventListener("click", () => {
            closeDrawer();
        });
    }

    // Keyboard ESC key
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && drawer.classList.contains("is-open")) {
            closeDrawer();
        }
    });

    // Expose global helper if needed
    window.Trigger10xBlueprint = {
        open: openDrawer,
        close: closeDrawer,
        switchService: renderServiceBlueprint
    };

    /* =========================================================
       OUR APPROACH & WHAT WE DO REVEAL CONTROLLERS
       Consistent with Section 01 (About):
       - Viewport entry reveals
       - Re-trigger on scroll back up
       - Navbar navigation instant trigger
       ========================================================= */

    // APPROACH SECTION CONTROLLER
    const approachSection = document.getElementById("approach");
    if (approachSection) {
        const approachContent = approachSection.querySelector(".approach-content") || approachSection;
        const approachItems = approachSection.querySelectorAll(".approach-reveal-item");
        const approachSpine = approachSection.querySelector(".section-left-col");
        let approachRevealed = false;

        function triggerApproachReveal(forceReset = false) {
            if (forceReset) {
                approachRevealed = false;
                approachItems.forEach(el => el.classList.remove("is-revealed"));
                if (approachSpine) approachSpine.classList.remove("is-revealed");
                return;
            }
            if (approachRevealed) return;
            approachRevealed = true;

            setTimeout(() => {
                if (approachSpine) approachSpine.classList.add("is-revealed");
            }, 60);

            approachItems.forEach((el, idx) => {
                setTimeout(() => el.classList.add("is-revealed"), 100 + idx * 110);
            });
        }

        const approachObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting && entry.intersectionRatio >= 0.15) {
                        triggerApproachReveal(false);
                    } else if (!entry.isIntersecting && entry.boundingClientRect.top > 0) {
                        triggerApproachReveal(true);
                    }
                });
            },
            { threshold: [0, 0.15, 0.3], rootMargin: "0px 0px -40px 0px" }
        );
        approachObserver.observe(approachContent);

        document.querySelectorAll('a[href="#approach"]').forEach(link => {
            link.addEventListener("click", () => {
                triggerApproachReveal(true);
                setTimeout(() => triggerApproachReveal(false), 300);
            });
        });
    }

    // WHAT WE DO / SERVICES SECTION CONTROLLER
    const servicesSection = document.getElementById("services");
    if (servicesSection) {
        const servicesContent = servicesSection.querySelector(".services-content") || servicesSection;
        const servicesItems = servicesSection.querySelectorAll(".services-reveal-item");
        const servicesSpine = servicesSection.querySelector(".section-left-col");
        let servicesRevealed = false;

        function triggerServicesReveal(forceReset = false) {
            if (forceReset) {
                servicesRevealed = false;
                servicesItems.forEach(el => el.classList.remove("is-revealed"));
                if (servicesSpine) servicesSpine.classList.remove("is-revealed");
                return;
            }
            if (servicesRevealed) return;
            servicesRevealed = true;

            setTimeout(() => {
                if (servicesSpine) servicesSpine.classList.add("is-revealed");
            }, 60);

            servicesItems.forEach((el, idx) => {
                setTimeout(() => el.classList.add("is-revealed"), 100 + idx * 110);
            });
        }

        const servicesObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting && entry.intersectionRatio >= 0.15) {
                        triggerServicesReveal(false);
                    } else if (!entry.isIntersecting && entry.boundingClientRect.top > 0) {
                        triggerServicesReveal(true);
                    }
                });
            },
            { threshold: [0, 0.15, 0.3], rootMargin: "0px 0px -40px 0px" }
        );
        servicesObserver.observe(servicesContent);

        document.querySelectorAll('a[href="#services"]').forEach(link => {
            link.addEventListener("click", () => {
                triggerServicesReveal(true);
                setTimeout(() => triggerServicesReveal(false), 300);
            });
        });
    }

    // INDUSTRIES SECTION CONTROLLER (04)
    const industriesSectionEl = document.getElementById("industries");
    if (industriesSectionEl) {
        const industriesContent = industriesSectionEl.querySelector(".industries-content") || industriesSectionEl;
        const industriesItems = industriesSectionEl.querySelectorAll(".industries-reveal-item");
        const industriesSpine = industriesSectionEl.querySelector(".section-left-col");
        let industriesRevealed = false;

        function triggerIndustriesReveal(forceReset = false) {
            if (forceReset) {
                industriesRevealed = false;
                industriesItems.forEach(el => el.classList.remove("is-revealed"));
                if (industriesSpine) industriesSpine.classList.remove("is-revealed");
                return;
            }
            if (industriesRevealed) return;
            industriesRevealed = true;

            setTimeout(() => {
                if (industriesSpine) industriesSpine.classList.add("is-revealed");
            }, 60);

            industriesItems.forEach((el, idx) => {
                setTimeout(() => el.classList.add("is-revealed"), 100 + idx * 110);
            });
        }

        const industriesObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting && entry.intersectionRatio >= 0.15) {
                        triggerIndustriesReveal(false);
                    } else if (!entry.isIntersecting && entry.boundingClientRect.top > 0) {
                        triggerIndustriesReveal(true);
                    }
                });
            },
            { threshold: [0, 0.15, 0.3], rootMargin: "0px 0px -40px 0px" }
        );
        industriesObserver.observe(industriesContent);

        document.querySelectorAll('a[href="#industries"]').forEach(link => {
            link.addEventListener("click", () => {
                triggerIndustriesReveal(true);
                setTimeout(() => triggerIndustriesReveal(false), 300);
            });
        });
    }

    // CONTACT / TURN YOUR POTENTIAL INTO PROGRESS CONTROLLER
    const contactSectionEl = document.getElementById("contact");
    if (contactSectionEl) {
        const contactContent = contactSectionEl.querySelector(".contact-content") || contactSectionEl;
        const contactItems = contactSectionEl.querySelectorAll(".contact-reveal-item");
        let contactRevealed = false;

        function triggerContactReveal(forceReset = false) {
            if (forceReset) {
                contactRevealed = false;
                contactItems.forEach(el => el.classList.remove("is-revealed"));
                return;
            }
            if (contactRevealed) return;
            contactRevealed = true;

            contactItems.forEach((el, idx) => {
                setTimeout(() => el.classList.add("is-revealed"), 100 + idx * 110);
            });
        }

        const contactObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting && entry.intersectionRatio >= 0.15) {
                        triggerContactReveal(false);
                    } else if (!entry.isIntersecting && entry.boundingClientRect.top > 0) {
                        triggerContactReveal(true);
                    }
                });
            },
            { threshold: [0, 0.15, 0.3], rootMargin: "0px 0px -40px 0px" }
        );
        contactObserver.observe(contactContent);

                document.querySelectorAll('a[href="#home"]').forEach(link => {
            link.addEventListener("click", () => {
                const heroHome = document.getElementById("home");
                if (heroHome) {
                    heroHome.classList.remove("hero-revealed");
                    setTimeout(() => heroHome.classList.add("hero-revealed"), 150);
                }
            });
        });

        // Ensure hero is revealed on direct visit or if intro is skipped/hidden
        const heroHomeEl = document.getElementById("home");
        if (heroHomeEl) {
            if (!document.body.classList.contains("intro-active")) {
                heroHomeEl.classList.add("hero-revealed");
            }
            setTimeout(() => heroHomeEl.classList.add("hero-revealed"), 400);
        }

        document.querySelectorAll('a[href="#contact"]').forEach(link => {
            link.addEventListener("click", () => {
                triggerContactReveal(true);
                setTimeout(() => triggerContactReveal(false), 300);
            });
        });
    }

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