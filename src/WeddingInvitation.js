import React, {
    useState,
    useEffect,
    useRef,
    useCallback,
} from 'react';

import './Invitation.css';
import couplePhoto from './asset/mohanad.jpeg';

// ======================================================
// Particle / Golden Sparkle Burst Engine
// ======================================================

const ParticleCanvas = ({ trigger }) => {
    const canvasRef = useRef(null);

    useEffect(() => {
        if (!trigger) return;

        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const particles = [];

        const colors = [
            '#d4af37',
            '#f9e8a2',
            '#ffffff',
            '#e6ca85',
            '#aa8214',
            '#e29578',
        ];

        for (let i = 0; i < 90; i++) {
            particles.push({
                x: canvas.width / 2,
                y: canvas.height / 2,
                radius: Math.random() * 4 + 2,
                color: colors[Math.floor(Math.random() * colors.length)],
                vx: (Math.random() - 0.5) * 14,
                vy: (Math.random() - 0.7) * 15,
                alpha: 1,
                decay: Math.random() * 0.014 + 0.007,
            });
        }

        let animationFrame;

        const render = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            let alive = false;

            particles.forEach((particle) => {
                if (particle.alpha > 0) {
                    alive = true;

                    particle.x += particle.vx;
                    particle.y += particle.vy;

                    particle.vy += 0.16;
                    particle.alpha -= particle.decay;

                    ctx.save();

                    ctx.globalAlpha = Math.max(0, particle.alpha);
                    ctx.fillStyle = particle.color;

                    ctx.beginPath();
                    ctx.arc(
                        particle.x,
                        particle.y,
                        particle.radius,
                        0,
                        Math.PI * 2
                    );

                    ctx.fill();
                    ctx.restore();
                }
            });

            if (alive) {
                animationFrame = requestAnimationFrame(render);
            }
        };

        render();

        return () => {
            if (animationFrame) {
                cancelAnimationFrame(animationFrame);
            }
        };
    }, [trigger]);

    return (
        <canvas
            ref={canvasRef}
            className="confetti-canvas"
        />
    );
};

// ======================================================
// Live Countdown Timer
// ======================================================

const Countdown = ({ targetDate }) => {
    const calculateTimeLeft = useCallback(() => {
        const diff =
            +new Date(targetDate) -
            +new Date();

        if (diff <= 0) {
            return {
                days: 0,
                hours: 0,
                minutes: 0,
                seconds: 0,
            };
        }

        return {
            days: Math.floor(
                diff / (1000 * 60 * 60 * 24)
            ),

            hours: Math.floor(
                (diff / (1000 * 60 * 60)) % 24
            ),

            minutes: Math.floor(
                (diff / (1000 * 60)) % 60
            ),

            seconds: Math.floor(
                (diff / 1000) % 60
            ),
        };
    }, [targetDate]);

    const [timeLeft, setTimeLeft] = useState(
        calculateTimeLeft
    );

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);

        return () => {
            clearInterval(timer);
        };
    }, [calculateTimeLeft]);

    return (
        <div className="countdown-container">

            <div className="countdown-box">
                <span className="digit">
                    {String(timeLeft.days).padStart(2, '0')}
                </span>

                <span className="unit">
                    Days
                </span>
            </div>

            <span className="sep">:</span>

            <div className="countdown-box">
                <span className="digit">
                    {String(timeLeft.hours).padStart(2, '0')}
                </span>

                <span className="unit">
                    Hours
                </span>
            </div>

            <span className="sep">:</span>

            <div className="countdown-box">
                <span className="digit">
                    {String(timeLeft.minutes).padStart(2, '0')}
                </span>

                <span className="unit">
                    Mins
                </span>
            </div>

            <span className="sep">:</span>

            <div className="countdown-box">
                <span className="digit">
                    {String(timeLeft.seconds).padStart(2, '0')}
                </span>

                <span className="unit">
                    Secs
                </span>
            </div>

        </div>
    );
};

// ======================================================
// Main Wedding Invitation
// ======================================================

export default function WeddingInvitation() {

    const [isOpened, setIsOpened] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);

    const audioRef = useRef(null);

    // ----------------------------------------------------
    // Wedding Configuration
    // ----------------------------------------------------

    const SONG_START_TIME = 37;

    const groomName = 'Mohanad';
    const brideName = 'Rana';

    const targetPhone = '201100819056';

    const eventDateISO =
        '2026-10-02T19:00:00+03:00';

    const venueTitle =
        'نادي الطيران (Aviation Club)';

    const venueSub =
        'Masr El-Gedida, Cairo';

    const mapsUrl =
        'https://maps.google.com/?cid=12214420431787328195&entry=gps';

    // ----------------------------------------------------
    // Audio
    // ----------------------------------------------------

    const nasheedAudioUrl =
        'https://ia801503.us.archive.org/15/items/MaherZainBarakaAllahuLakuma/Maher%20Zain%20-%20Baraka%20Allahu%20Lakuma.mp3#t=37';

    // ----------------------------------------------------
    // Google Calendar
    // ----------------------------------------------------

    const googleCalendarUrl =
        `https://calendar.google.com/calendar/render?action=TEMPLATE` +
        `&text=Wedding+of+${groomName}+%26+${brideName}` +
        `&dates=20261002T160000Z/20261002T220000Z` +
        `&details=Barak+Allahu+Lakuma!+Join+us+in+celebrating+the+wedding+of+Mohanad+and+Rana.` +
        `&location=${encodeURIComponent(
            venueTitle + ', ' + venueSub
        )}`;

    // ----------------------------------------------------
    // WhatsApp
    // ----------------------------------------------------

    const directWhatsAppUrl =
        `https://wa.me/${targetPhone}` +
        `?text=${encodeURIComponent(
            'ألف مبروك لمهند ورنا! 💍✨ بارك الله لكما وبارك عليكما وجمع بينكما في خير 🤍'
        )}`;

    // ====================================================
    // Open Invitation
    // ====================================================

    const handleOpenInvitation = () => {
        setIsOpened(true);
        setIsPlaying(true);

        if (audioRef.current) {
            audioRef.current.currentTime =
                SONG_START_TIME;

            audioRef.current
                .play()
                .catch((error) => {
                    console.log(
                        'Audio autoplay prevented by browser:',
                        error
                    );

                    setIsPlaying(false);
                });
        }
    };

    // ====================================================
    // Toggle Audio
    // ====================================================

    const toggleAudio = () => {
        if (!audioRef.current) return;

        if (isPlaying) {
            audioRef.current.pause();
            setIsPlaying(false);
            return;
        }

        if (
            audioRef.current.currentTime < 1
        ) {
            audioRef.current.currentTime =
                SONG_START_TIME;
        }

        audioRef.current
            .play()
            .then(() => {
                setIsPlaying(true);
            })
            .catch(() => {
                setIsPlaying(false);
            });
    };

    // ====================================================
    // Render
    // ====================================================

    return (
        <div className="mobile-app-wrapper">

            {/* Golden Particle Effect */}

            <ParticleCanvas
                trigger={isOpened}
            />

            {/* ==================================================
          Audio
      ================================================== */}

            <audio
                ref={audioRef}
                src={nasheedAudioUrl}
                loop
                preload="auto"
                onLoadedMetadata={(event) => {
                    if (
                        event.currentTarget.currentTime === 0
                    ) {
                        event.currentTarget.currentTime =
                            SONG_START_TIME;
                    }
                }}
                onEnded={() => {
                    setIsPlaying(false);
                }}
            />

            {/* ==================================================
          Sealed Invitation
      ================================================== */}

            {!isOpened ? (

                <div className="envelope-screen">

                    <div className="ambient-glow" />

                    <div className="envelope-card-sealed">

                        <div className="arabic-bismillah">
                            بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
                        </div>

                        <div className="monogram-emblem">
                            M & R
                        </div>

                        <h2 className="envelope-subtitle">
                            WEDDING INVITATION
                        </h2>

                        <h1 className="envelope-couple">
                            {groomName} & {brideName}
                        </h1>

                        <p className="envelope-dua">
                            « بَارَكَ اللَّهُ لَكُمَا
                            وَبَارَكَ عَلَيْكُمَا »
                        </p>

                        <p className="envelope-date">
                            October 2, 2026
                        </p>

                        <button
                            className="wax-seal-btn"
                            onClick={handleOpenInvitation}
                            type="button"
                        >

                            <div className="wax-seal-inner">

                                <span className="seal-ring">
                                    💍
                                </span>

                                <span className="seal-text">
                                    افتـح الدعـوة
                                </span>

                            </div>

                            <div className="pulse-ring" />

                        </button>

                    </div>

                </div>

            ) : (

                /* ==================================================
                   Main Invitation
                ================================================== */

                <div className="invitation-scroll-container">

                    {/* ==================================================
              Audio Controller
          ================================================== */}

                    <div className="floating-audio-bar">

                        <button
                            className="glass-audio-btn"
                            onClick={toggleAudio}
                            type="button"
                        >

                            <div
                                className={`audio-waves ${isPlaying
                                        ? 'playing'
                                        : ''
                                    }`}
                            >
                                <span />
                                <span />
                                <span />
                                <span />
                            </div>

                            <span>
                                {isPlaying
                                    ? '🎵 بارك الله لكما شغال'
                                    : 'تشغيل الموسيقى'}
                            </span>

                        </button>

                    </div>

                    {/* ==================================================
              Hero Header
          ================================================== */}

                    <header className="royal-header">

                        <div className="royal-crest">
                            ⚜ ✦ ⚜
                        </div>

                        <p className="save-date-tag">
                            SAVE THE DATE
                        </p>

                        <h1 className="hero-couple-title gold-shimmer">

                            {groomName}

                            <span className="ampersand">
                                &amp;
                            </span>

                            {brideName}

                        </h1>

                        <div className="islamic-dua-ribbon">

                            <p className="arabic-main-dua">
                                « بَارَكَ اللَّهُ لَكُمَا
                                وَبَارَكَ عَلَيْكُمَا
                                وَجَمَعَ بَيْنَكُمَا فِي خَيْرٍ »
                            </p>

                        </div>

                        <p className="hero-invitation-text">
                            يتشرف العروسين وعائلاتهما
                            بدعوتكم لمشاركتهما فرحة العمر
                        </p>

                    </header>

                    {/* ==================================================
              Couple Portrait
          ================================================== */}

                    <section
                        className="section-card couple-arch-section"
                    >

                        <div className="gold-arch-border">

                            <div className="arch-inner-image">

                                <img
                                    src={couplePhoto}
                                    alt="Mohanad and Rana"
                                    className="couple-portrait-img"
                                    onError={(event) => {
                                        event.currentTarget.onerror =
                                            null;

                                        event.currentTarget.src =
                                            'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&auto=format&fit=crop&q=80';
                                    }}
                                />

                            </div>

                        </div>

                        <div className="groom-bride-grid">

                            <div className="partner-item">

                                <span className="partner-role">
                                    العريس • Groom
                                </span>

                                <h3 className="partner-name">
                                    {groomName}
                                </h3>

                            </div>

                            <div className="heart-separator">
                                🤍
                            </div>

                            <div className="partner-item">

                                <span className="partner-role">
                                    العروس • Bride
                                </span>

                                <h3 className="partner-name">
                                    {brideName}
                                </h3>

                            </div>

                        </div>

                    </section>

                    {/* ==================================================
              Date & Countdown
          ================================================== */}

                    <section
                        className="section-card celebration-section"
                    >

                        <div className="ornate-tag">
                            موعد حفل الزفاف • THE DATE
                        </div>

                        <div className="wedding-date-hero">

                            <div className="date-col">

                                <span className="date-weekday">
                                    الجمعة • FRIDAY
                                </span>

                                <span className="date-highlight">
                                    02
                                </span>

                                <span className="date-month">
                                    أكتوبر • OCT 2026
                                </span>

                            </div>

                            <div className="divider-line" />

                            <div className="time-col">

                                <span className="time-sub">
                                    الساعة
                                </span>

                                <span className="time-highlight">
                                    07:00
                                </span>

                                <span className="time-period">
                                    مساءً • PM
                                </span>

                            </div>

                        </div>

                        <div className="timer-wrapper">

                            <p className="timer-tagline">
                                ⏳ باقي على ليلة العمر
                            </p>

                            <Countdown
                                targetDate={eventDateISO}
                            />

                        </div>

                        <a
                            href={googleCalendarUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="touch-btn gold-outline-btn"
                        >
                            🗓️ إضافة إلى تقويم الموبايل
                            (Calendar)
                        </a>

                    </section>

                    {/* ==================================================
              Program
          ================================================== */}

                    <section
                        className="section-card timeline-section"
                    >

                        <div className="ornate-tag">
                            برنامج الحفل • PROGRAM
                        </div>

                        <div className="timeline-items">

                            <div className="timeline-row">

                                <span className="tl-time">
                                    07:00 PM
                                </span>

                                <div className="tl-dot" />

                                <div className="tl-desc">

                                    <strong>
                                        Welcome &amp; Guest Arrival
                                    </strong>

                                    <p>
                                        استقبال وضيافة الحضور الكرام
                                    </p>

                                </div>

                            </div>

                            <div className="timeline-row">

                                <span className="tl-time">
                                    08:00 PM
                                </span>

                                <div className="tl-dot" />

                                <div className="tl-desc">

                                    <strong>
                                        Zaffa &amp; Grand Entrance
                                    </strong>

                                    <p>
                                        زفة ودخول العروسين القاعة
                                    </p>

                                </div>

                            </div>

                            <div className="timeline-row">

                                <span className="tl-time">
                                    09:30 PM
                                </span>

                                <div className="tl-dot" />

                                <div className="tl-desc">

                                    <strong>
                                        Dinner &amp; Cake Cutting
                                    </strong>

                                    <p>
                                        العشاء وتورتة الفرح والاحتفال
                                    </p>

                                </div>

                            </div>

                        </div>

                    </section>

                    {/* ==================================================
              Venue
          ================================================== */}

                    <section
                        className="section-card venue-section"
                    >

                        <div className="ornate-tag">
                            مكان الحفل • LOCATION
                        </div>

                        <h3 className="venue-title-text">
                            {venueTitle}
                        </h3>

                        <p className="venue-subtitle-text">
                            {venueSub}
                        </p>

                        <div className="gps-card-preview">

                            <div className="gps-pin-icon">
                                📍
                            </div>

                            <div className="gps-info">

                                <strong>
                                    موقع القاعة على الخريطة
                                </strong>

                                <span>
                                    اضغط لفتح الجي بي اس
                                    والاتجاهات مباشرة
                                </span>

                            </div>

                        </div>

                        <a
                            href={mapsUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="touch-btn primary-gold-btn"
                        >
                            🗺️ فتح اللوكيشن في Google Maps
                        </a>

                    </section>

                    {/* ==================================================
              RSVP / WhatsApp
          ================================================== */}

                    <section
                        className="section-card rsvp-share-section"
                    >

                        <div className="ornate-tag">
                            تهنئة وتأكيد الحضور • RSVP
                        </div>

                        <p className="wishes-desc">
                            شاركونا تهانيكم وأمنياتكم
                            للعروسين عبر واتساب:
                        </p>

                        <a
                            href={directWhatsAppUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="touch-btn whatsapp-btn"
                        >
                            💬 إرسال تهنئة عبر واتساب
                            (01100819056)
                        </a>

                    </section>

                    {/* ==================================================
              Footer
          ================================================== */}

                    <footer className="invitation-footer">

                        <p className="footer-blessing">
                            "وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم
                            مِّنْ أَنفُسِكُمْ أَزْوَاجًا
                            لِّتَسْكُنُوا إِلَيْهَا
                            وَجَعَلَ بَيْنَكُم مَّوَدَّةً
                            وَرَحْمَةً"
                        </p>

                        <div className="footer-monogram-badge">
                            M &amp; R
                        </div>

                        <p className="footer-year">
                            2026 • دامت دياركم عامرة
                            بالأفراح والمسرات
                        </p>

                    </footer>

                </div>
            )}

        </div>
    );
}
