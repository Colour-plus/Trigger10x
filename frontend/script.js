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