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

    const menu =
        document.querySelector(
            ".menu"
        );


    const navigation =
        document.querySelector(
            ".navigation"
        );


    if (
        !menu ||
        !navigation
    ) {
        return;
    }


    const closeMenu = () => {

        navigation.classList.remove(
            "open"
        );


        menu.setAttribute(
            "aria-expanded",
            "false"
        );

    };


    menu.addEventListener(
        "click",
        () => {

            const isOpen =
                navigation.classList.toggle(
                    "open"
                );


            menu.setAttribute(
                "aria-expanded",
                String(isOpen)
            );

        }
    );


    navigation
        .querySelectorAll(
            "a"
        )
        .forEach(
            link => {

                link.addEventListener(
                    "click",
                    () => {

                        closeMenu();

                    }
                );

            }
        );


    window.addEventListener(
        "resize",
        () => {

            if (
                window.innerWidth > 900
            ) {

                closeMenu();

            }

        }
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