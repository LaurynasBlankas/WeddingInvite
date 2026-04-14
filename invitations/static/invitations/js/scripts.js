/*!
* Start Bootstrap - Clean Blog v6.0.9 (https://startbootstrap.com/theme/clean-blog)
* Copyright 2013-2023 Start Bootstrap
* Licensed under MIT (https://github.com/StartBootstrap/startbootstrap-clean-blog/blob/master/LICENSE)
*/
window.addEventListener('DOMContentLoaded', () => {
    const mainNav = document.getElementById('mainNav');
    const navbarCollapse = document.getElementById('navbarResponsive');
    const dropdownToggles = mainNav.querySelectorAll('.dropdown-toggle');
    const desktopBreakpoint = window.matchMedia('(min-width: 992px)');
    const pendingHashStorageKey = 'pendingScrollHash';

    const syncDropdownState = () => {
        const hasOpenDropdown = mainNav.querySelector('.dropdown-menu.show') !== null;
        mainNav.classList.toggle('has-open-dropdown', hasOpenDropdown);
    };

    const setDesktopMenuHeight = (menu, expanded) => {
        if (!desktopBreakpoint.matches) {
            menu.style.height = '';
            menu.classList.remove('is-transitioning');
            return;
        }

        const startHeight = `${menu.offsetHeight}px`;
        menu.classList.add('is-transitioning');
        menu.style.height = startHeight;

        requestAnimationFrame(() => {
            menu.style.height = expanded ? `${menu.scrollHeight}px` : '0px';
        });
    };

    dropdownToggles.forEach((toggle) => {
        const menu = toggle.nextElementSibling;

        toggle.addEventListener('show.bs.dropdown', syncDropdownState);
        toggle.addEventListener('shown.bs.dropdown', () => {
            if (desktopBreakpoint.matches && menu) {
                setDesktopMenuHeight(menu, true);
            }
            syncDropdownState();
        });
        toggle.addEventListener('hide.bs.dropdown', () => {
            if (desktopBreakpoint.matches && menu) {
                setDesktopMenuHeight(menu, false);
            }
            syncDropdownState();
        });
        toggle.addEventListener('hidden.bs.dropdown', () => {
            if (menu) {
                menu.classList.remove('is-transitioning');
                menu.style.height = desktopBreakpoint.matches ? '0px' : '';
            }
            syncDropdownState();
        });

        if (menu) {
            menu.addEventListener('transitionend', (event) => {
                if (event.propertyName !== 'height' || !desktopBreakpoint.matches) {
                    return;
                }

                if (menu.classList.contains('show')) {
                    menu.style.height = `${menu.scrollHeight}px`;
                } else {
                    menu.classList.remove('is-transitioning');
                    menu.style.height = '0px';
                }
            });
        }
    });

    desktopBreakpoint.addEventListener('change', () => {
        mainNav.querySelectorAll('.dropdown-menu').forEach((menu) => {
            menu.classList.remove('is-transitioning');
            menu.style.height = '';
        });
    });

    if (navbarCollapse) {
        const dropdownItems = navbarCollapse.querySelectorAll('.dropdown-item');
        dropdownItems.forEach((item) => {
            item.addEventListener('click', () => {
                if (desktopBreakpoint.matches) {
                    return;
                }

                const collapseInstance = window.bootstrap?.Collapse.getOrCreateInstance(navbarCollapse);
                collapseInstance?.hide();
            });
        });
    }

    const getNavOffset = () => {
        if (!mainNav) {
            return 0;
        }

        return mainNav.getBoundingClientRect().height;
    };

    const scrollToTarget = (targetId, behavior = 'auto') => {
        const target = document.getElementById(targetId);
        if (!target) {
            return false;
        }

        const targetTop = target.getBoundingClientRect().top + window.scrollY - getNavOffset();
        window.scrollTo({ top: Math.max(targetTop, 0), behavior });
        return true;
    };

    const scrollToRsvpTarget = (targetId, behavior = 'auto') => {
        scrollToTarget(targetId, behavior);
    };

    const scrollToHashTarget = (hash, behavior = 'auto') => {
        if (!hash || hash === '#') {
            return false;
        }

        return scrollToTarget(decodeURIComponent(hash.slice(1)), behavior);
    };

    document.querySelectorAll('[data-rsvp-jump]').forEach((link) => {
        link.addEventListener('click', () => {
            const targetId = link.dataset.rsvpJump;
            if (targetId) {
                window.sessionStorage.setItem('pendingScrollTarget', targetId);
            }
        });
    });

    document.querySelectorAll('[data-about-jump]').forEach((link) => {
        link.addEventListener('click', (event) => {
            const targetId = link.dataset.aboutJump;
            if (!targetId) {
                return;
            }

            const linkUrl = new URL(link.href, window.location.href);
            const samePage = linkUrl.pathname === window.location.pathname && linkUrl.origin === window.location.origin;
            if (samePage) {
                event.preventDefault();
                if (scrollToTarget(targetId, 'smooth')) {
                    window.history.replaceState(null, '', linkUrl.hash);
                }
                return;
            }

            window.sessionStorage.setItem(pendingHashStorageKey, linkUrl.hash);
        });
    });

    syncDropdownState();
    const pendingScrollTarget = window.sessionStorage.getItem('pendingScrollTarget');
    if (pendingScrollTarget) {
        const runPendingScroll = () => scrollToRsvpTarget(pendingScrollTarget);
        runPendingScroll();
        window.setTimeout(runPendingScroll, 150);
        window.sessionStorage.removeItem('pendingScrollTarget');
    }

    const pendingHash = window.sessionStorage.getItem(pendingHashStorageKey);
    if (pendingHash) {
        const runPendingHashScroll = () => scrollToHashTarget(pendingHash);
        runPendingHashScroll();
        window.setTimeout(runPendingHashScroll, 150);
        window.sessionStorage.removeItem(pendingHashStorageKey);
    } else if (window.location.hash) {
        const runHashScroll = () => scrollToHashTarget(window.location.hash);
        runHashScroll();
        window.setTimeout(runHashScroll, 150);
    }

    window.addEventListener('hashchange', () => {
        scrollToHashTarget(window.location.hash);
    });

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const animatedNodes = document.querySelectorAll('[data-animate]');
    const staggerGroups = document.querySelectorAll('[data-stagger]');

    const applyDelay = (element) => {
        const delay = element.dataset.animateDelay;
        if (delay) {
            element.style.transitionDelay = `${delay}ms`;
        }
    };

    animatedNodes.forEach((element) => {
        applyDelay(element);
    });

    staggerGroups.forEach((group) => {
        const animationName = group.dataset.stagger || 'fade-up';
        group.querySelectorAll('[data-animate-child]').forEach((child, index) => {
            if (!child.dataset.animate) {
                child.dataset.animate = animationName;
            }
            if (!child.dataset.animateDelay) {
                child.dataset.animateDelay = String(index * 110);
            }
            applyDelay(child);
        });
    });

    const revealElement = (element) => {
        element.classList.add('is-visible');
    };

    if (prefersReducedMotion) {
        document.body.classList.add('site-ready');
        document.querySelectorAll('[data-animate], [data-animate-child]').forEach(revealElement);
    } else {
        window.requestAnimationFrame(() => {
            document.body.classList.add('site-ready');
        });

        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) {
                    return;
                }

                revealElement(entry.target);
                observer.unobserve(entry.target);
            });
        }, {
            threshold: 0.18,
            rootMargin: '0px 0px -10% 0px',
        });

        document.querySelectorAll('[data-animate], [data-animate-child]').forEach((element) => {
            revealObserver.observe(element);
        });
    }

    const countdownRoot = document.querySelector('[data-countdown-target]');
    if (countdownRoot) {
        const targetDate = new Date(countdownRoot.dataset.countdownTarget);
        const daysElement = document.getElementById('countdown-days');
        const hoursElement = document.getElementById('countdown-hours');
        const minutesElement = document.getElementById('countdown-minutes');
        const secondsElement = document.getElementById('countdown-seconds');

        if (Number.isFinite(targetDate.getTime()) && daysElement && hoursElement && minutesElement && secondsElement) {
            const updateCountdown = () => {
                const now = new Date();
                const remainingMs = Math.max(targetDate.getTime() - now.getTime(), 0);

                const totalSeconds = Math.floor(remainingMs / 1000);
                const days = Math.floor(totalSeconds / 86400);
                const hours = Math.floor((totalSeconds % 86400) / 3600);
                const minutes = Math.floor((totalSeconds % 3600) / 60);
                const seconds = totalSeconds % 60;

                daysElement.textContent = String(days);
                hoursElement.textContent = String(hours).padStart(2, '0');
                minutesElement.textContent = String(minutes).padStart(2, '0');
                secondsElement.textContent = String(seconds).padStart(2, '0');
            };

            updateCountdown();
            window.setInterval(updateCountdown, 1000);
        }
    }

    const rsvpEntryForm = document.getElementById('rsvpEntryForm');
    const rsvpQuestionsSection = document.getElementById('rsvpQuestions');
    const rsvpWizardForm = document.getElementById('rsvpWizardForm');
    const rsvpQuestionCard = document.getElementById('rsvpQuestionCard');
    const rsvpQuestionStep = document.getElementById('rsvpQuestionStep');
    const rsvpQuestionText = document.getElementById('rsvpQuestionText');
    const rsvpQuestionOptions = document.getElementById('rsvpQuestionOptions');
    const rsvpTextEntry = document.getElementById('rsvpTextEntry');
    const rsvpTextInput = document.getElementById('rsvpTextInput');
    const rsvpTextActions = document.getElementById('rsvpTextActions');
    const rsvpGuestGreeting = document.getElementById('rsvpGuestGreeting');
    const rsvpSubmitButton = document.getElementById('rsvpSubmitButton');
    const rsvpBackButton = document.getElementById('rsvpBackButton');
    const rsvpAnotherButton = document.getElementById('rsvpAnotherButton');
    const rsvpGuestName = document.getElementById('rsvpGuestName');
    const rsvpSubmitUrl = rsvpQuestionsSection?.dataset.submitUrl;
    const rsvpTranslationsNode = document.getElementById('rsvp-translations');
    const rsvpTranslations = rsvpTranslationsNode ? JSON.parse(rsvpTranslationsNode.textContent) : {};

    const rsvpQuestions = Array.isArray(rsvpTranslations.questions) ? rsvpTranslations.questions : [];

    const rsvpStorageKey = 'wedding_rsvp_draft';
    const rsvpTransitionMs = 520;
    const rsvpState = {
        name: '',
        answers: {},
        musicDraft: [],
        currentIndex: 0,
        submitted: false,
    };

    const saveRsvpState = () => {
        window.localStorage.setItem(rsvpStorageKey, JSON.stringify(rsvpState));
    };

    const getCookie = (name) => {
        const cookieValue = `; ${document.cookie}`;
        const cookieParts = cookieValue.split(`; ${name}=`);
        if (cookieParts.length !== 2) {
            return '';
        }
        return cookieParts.pop().split(';').shift();
    };

    const loadRsvpState = () => {
        try {
            const rawState = window.localStorage.getItem(rsvpStorageKey);
            if (!rawState) {
                return;
            }

            const parsedState = JSON.parse(rawState);
            rsvpState.name = parsedState.name || '';
            rsvpState.answers = parsedState.answers || {};
            rsvpState.musicDraft = Array.isArray(parsedState.musicDraft) ? parsedState.musicDraft : [];
            rsvpState.submitted = Boolean(parsedState.submitted);
            const answeredCount = rsvpQuestions.filter((question) => Object.prototype.hasOwnProperty.call(rsvpState.answers, question.key)).length;
            rsvpState.currentIndex = Math.min(answeredCount, rsvpQuestions.length - 1);
        } catch {
            window.localStorage.removeItem(rsvpStorageKey);
        }
    };

    const resetRsvpState = () => {
        rsvpState.name = '';
        rsvpState.answers = {};
        rsvpState.musicDraft = [];
        rsvpState.currentIndex = 0;
        rsvpState.submitted = false;
    };

    const getActiveQuestions = () => {
        if (rsvpState.answers.attendance === 'no_ceremony_only') {
            return rsvpQuestions.slice(0, 1);
        }
        return rsvpQuestions;
    };

    const getAnsweredCount = () => getActiveQuestions().filter((question) => Object.prototype.hasOwnProperty.call(rsvpState.answers, question.key)).length;

    const clearTransientQuestionUi = () => {
        if (rsvpTextEntry) {
            rsvpTextEntry.hidden = true;
            rsvpTextEntry.querySelectorAll('.rsvp-song-list').forEach((songList) => songList.remove());
        }
        if (rsvpTextInput) {
            rsvpTextInput.value = '';
            rsvpTextInput.placeholder = '';
        }
        if (rsvpTextActions) {
            rsvpTextActions.innerHTML = '';
        }
    };

    const renderRsvpQuestion = (direction = 'right') => {
        if (!rsvpQuestionsSection || !rsvpQuestionCard || !rsvpQuestionStep || !rsvpQuestionText || !rsvpQuestionOptions || !rsvpSubmitButton || !rsvpBackButton || !rsvpAnotherButton) {
            return;
        }

        const activeQuestions = getActiveQuestions();
        const answeredCount = getAnsweredCount();
        const allAnswered = answeredCount === activeQuestions.length;

        if (rsvpGuestGreeting) {
            if (rsvpState.submitted) {
                rsvpGuestGreeting.textContent = (rsvpTranslations.saved_label || '%(name)s, your RSVP is saved.').replace('%(name)s', rsvpState.name);
            } else {
                rsvpGuestGreeting.textContent = rsvpState.name ? (rsvpTranslations.guest_label || 'Guest: %(name)s').replace('%(name)s', rsvpState.name) : '';
            }
        }

        rsvpBackButton.hidden = rsvpState.submitted || (answeredCount === 0 && !allAnswered);
        rsvpAnotherButton.hidden = !rsvpState.submitted;

        if (allAnswered) {
            rsvpQuestionCard.hidden = true;
            rsvpSubmitButton.hidden = rsvpState.submitted;
            return;
        }

        rsvpQuestionCard.hidden = false;
        rsvpSubmitButton.hidden = true;
        rsvpAnotherButton.hidden = true;

        rsvpState.currentIndex = Math.min(rsvpState.currentIndex, activeQuestions.length - 1);
        const currentQuestion = activeQuestions[rsvpState.currentIndex];
        rsvpQuestionStep.textContent = (rsvpTranslations.question_label || 'Question %(number)s').replace('%(number)s', String(rsvpState.currentIndex + 1));
        rsvpQuestionText.textContent = currentQuestion.question;

        rsvpQuestionOptions.innerHTML = '';
        clearTransientQuestionUi();

        const goToNextQuestion = () => {
            const nextQuestions = getActiveQuestions();
            const answeredNow = nextQuestions.filter((question) => Object.prototype.hasOwnProperty.call(rsvpState.answers, question.key)).length;
            rsvpState.currentIndex = Math.min(answeredNow, Math.max(nextQuestions.length - 1, 0));
            rsvpState.submitted = false;
            saveRsvpState();
            renderRsvpQuestion('right');
        };

        if (currentQuestion.type === 'text' || currentQuestion.type === 'music') {
            if (rsvpTextEntry && rsvpTextInput && rsvpTextActions) {
                rsvpTextEntry.hidden = false;
                rsvpTextInput.placeholder = currentQuestion.placeholder || '';

                if (currentQuestion.type === 'text' && typeof rsvpState.answers[currentQuestion.key] === 'string') {
                    rsvpTextInput.value = rsvpState.answers[currentQuestion.key];
                }

                if (currentQuestion.type === 'music') {
                    const songs = Array.isArray(rsvpState.musicDraft) && rsvpState.musicDraft.length > 0
                        ? rsvpState.musicDraft
                        : (Array.isArray(rsvpState.answers.music) ? rsvpState.answers.music : []);
                    const songList = document.createElement('ul');
                    songList.className = 'rsvp-song-list';
                    songs.forEach((song) => {
                        const listItem = document.createElement('li');
                        listItem.textContent = song;
                        songList.appendChild(listItem);
                    });
                    if (songs.length > 0) {
                        rsvpTextEntry.appendChild(songList);
                    }

                    const addSongButton = document.createElement('button');
                    addSongButton.type = 'button';
                    addSongButton.className = 'rsvp-option';
                    addSongButton.textContent = rsvpTranslations.add_song || 'Add song';
                    addSongButton.addEventListener('click', (event) => {
                        event.preventDefault();
                        const song = rsvpTextInput.value.trim();
                        if (!song) {
                            rsvpTextInput.focus();
                            return;
                        }
                        const existingSongs = Array.isArray(rsvpState.musicDraft) ? rsvpState.musicDraft : [];
                        rsvpState.musicDraft = [...existingSongs, song];
                        rsvpTextInput.value = '';
                        rsvpState.submitted = false;
                        saveRsvpState();
                        renderRsvpQuestion();
                    });

                    const nextButton = document.createElement('button');
                    nextButton.type = 'button';
                    nextButton.className = 'rsvp-option';
                    nextButton.textContent = rsvpTranslations.next || 'Next';
                    nextButton.addEventListener('click', () => {
                        const existingSongs = Array.isArray(rsvpState.musicDraft) ? [...rsvpState.musicDraft] : [];
                        const typedSong = rsvpTextInput.value.trim();
                        if (typedSong) {
                            existingSongs.push(typedSong);
                        }

                        if (existingSongs.length === 0) {
                            existingSongs.push(rsvpTranslations.no_music_requests || 'No music requests');
                        }

                        rsvpState.musicDraft = existingSongs;
                        rsvpState.answers.music = existingSongs;

                        animateRsvpQuestionTransition(() => {
                            goToNextQuestion();
                        }, 'right');
                    });

                    rsvpTextActions.appendChild(addSongButton);
                    rsvpTextActions.appendChild(nextButton);
                } else {
                    currentQuestion.shortcuts.forEach((shortcut) => {
                        const shortcutButton = document.createElement('button');
                        shortcutButton.type = 'button';
                        shortcutButton.className = 'rsvp-option';
                        shortcutButton.textContent = shortcut.label;
                        shortcutButton.addEventListener('click', () => {
                            animateRsvpQuestionTransition(() => {
                                rsvpState.answers[currentQuestion.key] = shortcut.value;
                                goToNextQuestion();
                            }, 'right');
                        });
                        rsvpTextActions.appendChild(shortcutButton);
                    });

                    const nextButton = document.createElement('button');
                    nextButton.type = 'button';
                    nextButton.className = 'rsvp-option';
                    nextButton.textContent = rsvpTranslations.next || 'Next';
                    nextButton.addEventListener('click', () => {
                        const value = rsvpTextInput.value.trim();
                        if (!value) {
                            rsvpTextInput.focus();
                            return;
                        }
                        animateRsvpQuestionTransition(() => {
                            rsvpState.answers[currentQuestion.key] = value;
                            goToNextQuestion();
                        }, 'right');
                    });
                    rsvpTextActions.appendChild(nextButton);
                }
            }
        } else {
            currentQuestion.options.forEach((option) => {
                const optionButton = document.createElement('button');
                optionButton.type = 'button';
                optionButton.className = 'rsvp-option';
                optionButton.textContent = option.label;

                if (rsvpState.answers[currentQuestion.key] === option.value) {
                    optionButton.classList.add('is-selected');
                }

                optionButton.addEventListener('click', () => {
                    animateRsvpQuestionTransition(() => {
                        rsvpState.answers[currentQuestion.key] = option.value;
                        if (currentQuestion.key === 'attendance' && option.value === 'no_ceremony_only') {
                            delete rsvpState.answers.driving;
                            delete rsvpState.answers.food;
                            delete rsvpState.answers.alcohol;
                            delete rsvpState.answers.soft_drinks;
                            delete rsvpState.answers.music;
                        }
                        goToNextQuestion();
                    }, 'right');
                });

                rsvpQuestionOptions.appendChild(optionButton);
            });
        }

        if (direction === 'right') {
            rsvpQuestionCard.classList.add('is-entering-from-right');
        } else if (direction === 'left') {
            rsvpQuestionCard.classList.add('is-entering-from-left');
        }

        window.requestAnimationFrame(() => {
            rsvpQuestionCard.classList.remove('is-entering-from-right', 'is-entering-from-left');
        });
    };

    const animateRsvpQuestionTransition = (onSwitch, direction = 'right') => {
        if (!rsvpQuestionCard) {
            onSwitch();
            return;
        }

        const leavingClass = direction === 'left' ? 'is-leaving-to-right' : 'is-leaving-to-left';
        rsvpQuestionCard.classList.add(leavingClass);

        window.setTimeout(() => {
            rsvpQuestionCard.classList.remove('is-leaving-to-left', 'is-leaving-to-right');
            onSwitch();
        }, rsvpTransitionMs);
    };

    if (rsvpEntryForm && rsvpQuestionsSection && rsvpGuestName) {
        loadRsvpState();

        if (rsvpState.name) {
            rsvpGuestName.value = rsvpState.name;
            rsvpQuestionsSection.hidden = false;
            renderRsvpQuestion('right');
        }

        rsvpEntryForm.addEventListener('submit', (event) => {
            event.preventDefault();
            const guestName = rsvpGuestName.value.trim();
            if (!guestName) {
                rsvpGuestName.focus();
                return;
            }

            rsvpState.answers = {};
            rsvpState.musicDraft = [];
            rsvpState.currentIndex = 0;
            rsvpState.name = guestName;
            rsvpState.submitted = false;
            saveRsvpState();
            rsvpQuestionsSection.hidden = false;
            renderRsvpQuestion('right');
            const questionsTop = rsvpQuestionsSection.getBoundingClientRect().top + window.scrollY - 24;
            window.scrollTo({ top: Math.max(questionsTop, 0), behavior: 'smooth' });
        });
    }

    if (rsvpBackButton) {
        rsvpBackButton.addEventListener('click', () => {
            const answeredKeys = getActiveQuestions()
                .map((question) => question.key)
                .filter((key) => Object.prototype.hasOwnProperty.call(rsvpState.answers, key));

            if (answeredKeys.length === 0) {
                resetRsvpState();
                window.localStorage.removeItem(rsvpStorageKey);
                if (rsvpGuestName) {
                    rsvpGuestName.value = '';
                    rsvpGuestName.focus();
                }
                if (rsvpQuestionsSection) {
                    rsvpQuestionsSection.hidden = true;
                }
                renderRsvpQuestion('left');
                return;
            }

            const lastAnsweredKey = answeredKeys[answeredKeys.length - 1];
            animateRsvpQuestionTransition(() => {
                delete rsvpState.answers[lastAnsweredKey];
                rsvpState.currentIndex = Math.max(answeredKeys.length - 1, 0);
                rsvpState.submitted = false;
                saveRsvpState();
                renderRsvpQuestion('left');
            }, 'left');
        });
    }

    if (rsvpAnotherButton) {
        rsvpAnotherButton.addEventListener('click', () => {
            resetRsvpState();
            window.localStorage.removeItem(rsvpStorageKey);
            if (rsvpGuestName) {
                rsvpGuestName.value = '';
                rsvpGuestName.focus();
            }
            if (rsvpQuestionsSection) {
                rsvpQuestionsSection.hidden = true;
            }
            renderRsvpQuestion('right');
            if (rsvpGuestName) {
                const nameInputTop = rsvpGuestName.getBoundingClientRect().top + window.scrollY - 24;
                window.scrollTo({ top: Math.max(nameInputTop, 0), behavior: 'smooth' });
            }
        });
    }

    if (rsvpWizardForm) {
        rsvpWizardForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            if (!rsvpSubmitUrl) {
                return;
            }

            rsvpSubmitButton.disabled = true;
            rsvpSubmitButton.textContent = rsvpTranslations.submitting || 'Submitting...';

            try {
                const response = await window.fetch(rsvpSubmitUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRFToken': getCookie('csrftoken'),
                    },
                    body: JSON.stringify({
                        guest_name: rsvpState.name,
                        attendance: rsvpState.answers.attendance,
                        driving: rsvpState.answers.driving || '',
                        food: rsvpState.answers.food || '',
                        alcohol: rsvpState.answers.alcohol || '',
                        soft_drinks: rsvpState.answers.soft_drinks || '',
                        music: Array.isArray(rsvpState.answers.music) ? rsvpState.answers.music.join('\n') : (rsvpState.answers.music || ''),
                    }),
                });

                if (!response.ok) {
                    throw new Error('Failed to submit RSVP.');
                }

                rsvpState.submitted = true;
                saveRsvpState();
                renderRsvpQuestion('right');
            } catch {
                rsvpSubmitButton.disabled = false;
                rsvpSubmitButton.textContent = rsvpTranslations.submit_everything || 'Submit everything';
                if (rsvpGuestGreeting) {
                    rsvpGuestGreeting.textContent = rsvpTranslations.submit_error || 'There was a problem saving your RSVP. Please try again.';
                }
                return;
            }

            rsvpSubmitButton.disabled = false;
            rsvpSubmitButton.textContent = rsvpTranslations.submit_everything || 'Submit everything';
        });
    }
});

window.CopyButton = async function (triggerElement) {
    const trigger = triggerElement instanceof Element
        ? triggerElement
        : document.querySelector('[data-copy-text]');
    if (!trigger) {
        return;
    }

    const feedbackId = trigger.getAttribute('aria-controls');
    const feedback = feedbackId ? document.getElementById(feedbackId) : null;
    const text = trigger.dataset.copyText || '';
    if (!feedback || !text) {
        return;
    }

    const successLabel = feedback.dataset.successLabel || 'Copied';
    const failLabel = feedback.dataset.failLabel || 'Failed';

    const showFeedback = (message) => {
        feedback.textContent = message;
        feedback.classList.add('is-visible');

        window.clearTimeout(feedback.hideTimeout);
        feedback.hideTimeout = window.setTimeout(() => {
            feedback.classList.remove('is-visible');
        }, 1400);
    };

    try {
        if (navigator.clipboard && window.isSecureContext) {
            await navigator.clipboard.writeText(text);
        } else {
            const textArea = document.createElement("textarea");
            textArea.value = text;
            textArea.setAttribute("readonly", "");
            textArea.style.position = "fixed";
            textArea.style.opacity = "0";
            textArea.style.pointerEvents = "none";
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            document.execCommand("copy");
            document.body.removeChild(textArea);
        }

        showFeedback(successLabel);
    } catch (error) {
        console.error("Copy failed:", error);
        showFeedback(failLabel);
    }
};

window.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('[data-copy-text]').forEach((trigger) => {
        trigger.addEventListener('click', () => {
            window.CopyButton(trigger);
        });
    });
});
