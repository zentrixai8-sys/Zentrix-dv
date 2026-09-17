import React, { useEffect, useRef } from 'react';

const CastAndRenderScrub: React.FC = () => {
  const trackRef = useRef<HTMLDivElement>(null);
  const clipRef = useRef<HTMLVideoElement>(null);
  const bootRef = useRef<HTMLDivElement>(null);
  const bootBarRef = useRef<HTMLElement>(null);
  const bootPctRef = useRef<HTMLParagraphElement>(null);
  const meterRef = useRef<HTMLElement>(null);
  const panelsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 1920×1080, 10.04s, 241 frames, all-intra — every frame is a keyframe, which is why a scroll scrub can land on an exact frame instantly.
    var VIDEO_URL = "https://d2ol7oe51mr4n9.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/45567745-d826-44a2-a5ce-7ef670944e60.mp4";

    var clip = clipRef.current;
    var boot = bootRef.current;
    var bootBar = bootBarRef.current;
    var bootPct = bootPctRef.current;
    var meter = meterRef.current;
    var track = trackRef.current;
    var panels = panelsRef.current ? [].slice.call(panelsRef.current.querySelectorAll<HTMLElement>("[data-panel]")) : [];

    if (!clip || !boot || !bootBar || !bootPct || !meter || !track) return;

    // Cue table: Each panel owns a slice of scroll as [fadeInStart, fadeInEnd, fadeOutStart, fadeOutEnd] in 0..1 page progress.
    // The gaps between one panel's fadeOutEnd and the next's fadeInStart are deliberate dead zones — video only — so two panels are never readable at once.
    var CUES = [
      [0.00, 0.00, 0.15, 0.23],
      [0.35, 0.43, 0.57, 0.65],
      [0.77, 0.85, 1.10, 1.20]
    ];
    var DRIFT = 22; // px of counter-scroll travel per panel

    // Helpers
    function clamp(v: number, a: number, b: number) {
      return Math.min(Math.max(v, a), b);
    }
    function smooth(t: number) {
      return t * t * (3 - 2 * t);
    }
    function ramp(p: number, a: number, b: number) {
      if (b <= a) return p >= b ? 1 : 0;
      return smooth(clamp((p - a) / (b - a), 0, 1));
    }

    // State
    var progress = 0;
    var seekTo = 0;
    var seekAt = 0;
    var duration = 0;
    var ready = false;
    var started = false;
    var attached = false;
    var rafId: number;

    function readScroll() {
      if (!track) return;
      var rect = track.getBoundingClientRect();
      var max = track.offsetHeight - window.innerHeight;
      progress = max > 0 ? clamp(-rect.top / max, 0, 1) : 0;
      if (duration) seekTo = progress * duration;
    }

    function paint() {
      if (meter) {
        meter.style.transform = "scaleX(" + progress + ")";
      }
      for (var i = 0; i < panels.length; i++) {
        var c = CUES[i];
        if (!c) continue;
        var el = panels[i];
        var enter = ramp(progress, c[0], c[1]);
        var leave = ramp(progress, c[2], c[3]);
        var o = enter * (1 - leave);
        var y = (1 - enter) * DRIFT - leave * DRIFT;
        el.style.opacity = o.toString();
        el.style.transform = "translate3d(0," + y + "px,0)";
        el.style.pointerEvents = o > 0.6 ? "auto" : "none";
      }
    }

    function frame() {
      if (ready && duration && clip) {
        var gap = seekTo - seekAt;
        if (Math.abs(gap) > 0.0008) {
          seekAt += gap * 0.115; // easing factor — do not change
          if (clip.readyState >= 2 && !clip.seeking) {
            try { clip.currentTime = seekAt; } catch (e) {}
          }
        }
      }
      paint();
      rafId = requestAnimationFrame(frame);
    }

    function setProgress(f: number) {
      if (bootBar) bootBar.style.transform = "scaleX(" + f + ")";
      if (bootPct) bootPct.textContent = "LOADING " + Math.round(f * 100) + "%";
    }

    function start() {
      if (started) return;
      started = true;
      ready = true;
      if (boot) boot.classList.add("done");
      readScroll();
      seekAt = seekTo;
    }

    function attach(src: string) {
      if (attached || !clip) return;
      attached = true;
      clip.addEventListener("loadedmetadata", function() {
        if (!clip) return;
        duration = clip.duration || 0;
        clip.pause();
        readScroll();
        seekAt = seekTo;
        try { clip.currentTime = seekAt; } catch (e) {}
      });
      clip.addEventListener("loadeddata", start);
      clip.addEventListener("canplaythrough", start);
      clip.addEventListener("error", start);
      clip.src = src;
      clip.load();
      setTimeout(start, 12000); // Stall safety fallback
    }

    // Preload the mp4 as a fully buffered blob first, because seeking inside a buffered blob is near instant while range requests over the network are a slideshow.
    function preload() {
      var controller = typeof AbortController !== "undefined" ? new AbortController() : null;
      var bail = setTimeout(function() {
        if (!attached) {
          if (controller) controller.abort();
          setProgress(1);
          attach(VIDEO_URL);
        }
      }, 15000);

      fetch(VIDEO_URL, { signal: controller ? controller.signal : undefined })
        .then(function(res) {
          if (!res.ok || !res.body) throw new Error("Fetch failed");
          var total = Number(res.headers.get("content-length")) || 0;
          var reader = res.body.getReader();
          var chunks: Uint8Array[] = [];
          var got = 0;

          function pump(): Promise<Blob> {
            return reader.read().then(function(result) {
              if (result.done) {
                return new Blob(chunks, { type: "video/mp4" });
              }
              chunks.push(result.value);
              got += result.value.length;
              setProgress(total ? got / total : Math.min(got / 11e6, 0.95));
              return pump();
            });
          }
          return pump();
        })
        .then(function(blob) {
          clearTimeout(bail);
          setProgress(1);
          attach(URL.createObjectURL(blob));
        })
        .catch(function() {
          clearTimeout(bail);
          setProgress(1);
          attach(VIDEO_URL);
        });
    }

    // iOS will not paint a frame from a video that has never been played, so nudge it once on the first interaction and pause immediately.
    function unlock() {
      if (!clip) return;
      var p = clip.play();
      if (p && p.then) {
        p.then(function() { if (clip) clip.pause(); }).catch(function() {});
      } else {
        clip.pause();
      }
    }
    var unlockEvents = ["touchstart", "pointerdown", "wheel", "keydown"];
    unlockEvents.forEach(function(ev) {
      window.addEventListener(ev, unlock, { once: true, passive: true });
    });

    window.addEventListener("scroll", readScroll, { passive: true });
    window.addEventListener("resize", readScroll);

    readScroll();
    paint();
    preload();
    rafId = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", readScroll);
      window.removeEventListener("resize", readScroll);
      unlockEvents.forEach(function(ev) {
        window.removeEventListener(ev, unlock);
      });
    };
  }, []);

  return (
    <div className="cr-root relative w-full my-12 rounded-[2.5rem] overflow-hidden border border-white/10 shadow-2xl">
      <style>{`
        .cr-root {
          --fg: #0d0c0b;
          --fg-soft: rgba(13,12,11,.64);
          --fg-faint: rgba(13,12,11,.42);
          --shade: #f2f0ec;
          --rule: rgba(13,12,11,.16);
          --ease: cubic-bezier(.22,.61,.36,1);
          --pill-bg: #0a0908;
          --pill-fg: #ffffff;
          font-family: 'Inter Tight', 'Helvetica Neue', Helvetica, Arial, sans-serif;
          font-weight: 400;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
          background: var(--shade);
          color: var(--fg);
        }

        .cr-track {
          position: relative;
          z-index: 1;
          height: 560vh;
          min-height: 3200px;
        }

        .cr-viewport {
          position: sticky;
          top: 0;
          height: 100vh;
          width: 100%;
          overflow: hidden;
          background: var(--shade);
        }

        .cr-root .stage {
          position: absolute;
          inset: 0;
          z-index: 0;
          overflow: hidden;
          background: var(--shade);
        }

        .cr-root .stage video {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 100%;
          height: 100%;
          transform: translate(-50%,-50%) scale(1.02);
          object-fit: cover;
          filter: contrast(1.02);
          will-change: transform;
        }

        .cr-root .veil {
          position: absolute;
          inset: 0;
          pointer-events: none;
          background:
            linear-gradient(to bottom, rgba(242,240,236,.62) 0%, rgba(242,240,236,.12) 22%, rgba(242,240,236,.12) 78%, rgba(242,240,236,.66) 100%),
            radial-gradient(100% 80% at 50% 48%, rgba(242,240,236,0) 0%, rgba(242,240,236,.34) 100%),
            rgba(242,240,236,.20);
        }

        .cr-root .grain {
          position: absolute;
          inset: -50%;
          opacity: .13;
          mix-blend-mode: multiply;
          pointer-events: none;
          background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='140' height='140'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='3'/></filter><rect width='140' height='140' filter='url(%23n)' opacity='.5'/></svg>");
        }

        .cr-root .meter {
          position: absolute;
          top: 0;
          left: 0;
          z-index: 50;
          height: 2px;
          width: 100%;
          transform: scaleX(0);
          transform-origin: 0 50%;
          background: var(--fg);
          opacity: .55;
        }

        .cr-root .chrome {
          position: absolute;
          left: 0;
          right: 0;
          top: 0;
          z-index: 40;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          padding: max(14px, calc(env(safe-area-inset-top, 0px) + 12px)) clamp(16px, 3.4vw, 44px) 14px;
          background: linear-gradient(to bottom, rgba(242,240,236,.94) 0%, rgba(242,240,236,.78) 72%, rgba(242,240,236,0) 100%);
        }

        .cr-root .mark {
          display: flex;
          align-items: center;
          gap: 9px;
          font-size: 15px;
          letter-spacing: -.012em;
          color: var(--fg);
          min-width: 0;
          flex-shrink: 1;
        }

        .cr-root .mark-star {
          opacity: .85;
        }

        .cr-root .nav {
          display: flex;
          align-items: center;
          gap: clamp(14px, 2.4vw, 32px);
          flex-shrink: 0;
        }

        .cr-root .nav a:not(.pill) {
          color: var(--fg);
          text-decoration: none;
          font-size: 14.5px;
          letter-spacing: -.008em;
          opacity: .88;
          transition: opacity .3s var(--ease);
        }

        .cr-root .nav a:not(.pill):hover {
          opacity: 1;
        }

        .cr-root .pill {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          height: 40px;
          padding: 0 21px;
          border-radius: 999px;
          background: var(--pill-bg);
          color: var(--pill-fg);
          font-size: 14.5px;
          font-weight: 500;
          letter-spacing: -.008em;
          text-decoration: none;
          white-space: nowrap;
          opacity: 1;
          border: 1px solid rgba(10,9,8,.12);
          box-shadow: 0 1px 0 rgba(255,255,255,.10) inset;
          -webkit-text-fill-color: var(--pill-fg);
          transition: transform .4s var(--ease), background .3s var(--ease), color .3s var(--ease);
        }

        .cr-root .nav .pill {
          color: #fff;
          -webkit-text-fill-color: #fff;
        }

        .cr-root .pill:hover,
        .cr-root .pill:focus-visible {
          transform: translateY(-2px);
          background: #000;
          color: #fff;
          -webkit-text-fill-color: #fff;
        }

        .cr-root .pill:focus-visible {
          outline: 2px solid var(--fg);
          outline-offset: 2px;
        }

        .cr-root .foot {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          z-index: 40;
          display: flex;
          justify-content: center;
          padding: 14px clamp(16px, 4vw, 24px) max(16px, calc(env(safe-area-inset-bottom, 0px) + 12px));
          font-size: 12px;
          line-height: 1.45;
          letter-spacing: .02em;
          color: var(--fg-faint);
          text-align: center;
          pointer-events: none;
          background: linear-gradient(to top, rgba(242,240,236,.92) 0%, rgba(242,240,236,.72) 72%, rgba(242,240,236,0) 100%);
        }

        .cr-root .panels {
          position: absolute;
          inset: 0;
          z-index: 20;
          pointer-events: none;
        }

        .cr-root .panel {
          position: absolute;
          inset: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: max(104px, calc(env(safe-area-inset-top, 0px) + 88px)) clamp(20px, 5vw, 60px) max(96px, calc(env(safe-area-inset-bottom, 0px) + 80px));
          opacity: 0;
          will-change: opacity, transform;
        }

        .cr-root .eyebrow {
          display: flex;
          align-items: center;
          justify-content: center;
          flex-wrap: wrap;
          gap: 6px 12px;
          font-size: 12.5px;
          letter-spacing: .045em;
          color: var(--fg-soft);
          margin-bottom: clamp(16px,2vw,22px);
          max-width: min(46ch, 100%);
          text-align: center;
        }

        .cr-root h1 {
          font-weight: 400;
          font-size: clamp(34px, 7.1vw, 104px);
          line-height: .98;
          letter-spacing: -.036em;
          max-width: 15ch;
          text-wrap: balance;
          color: var(--fg);
          margin: 0;
        }

        .cr-root .sub {
          margin-top: clamp(18px,2.2vw,28px);
          font-size: clamp(15px,1.28vw,19px);
          line-height: 1.5;
          letter-spacing: -.008em;
          color: var(--fg-soft);
          max-width: min(46ch, 100%);
          text-wrap: pretty;
        }

        .cr-root .cta {
          margin-top: clamp(28px,3.4vw,44px);
          pointer-events: auto;
          width: 100%;
          display: flex;
          justify-content: center;
        }

        .cr-root .cta .pill {
          height: 48px;
          padding: 0 27px;
          font-size: 15px;
          max-width: min(100%, 320px);
        }

        .cr-root .boot {
          position: absolute;
          inset: 0;
          z-index: 90;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 16px;
          background: var(--shade);
          transition: opacity .7s var(--ease), visibility .7s;
        }

        .cr-root .boot.done {
          opacity: 0;
          visibility: hidden;
        }

        .cr-root .boot p {
          font-size: 12.5px;
          letter-spacing: .05em;
          color: var(--fg-faint);
          margin: 0;
        }

        .cr-root .bar {
          width: 150px;
          height: 1px;
          background: var(--rule);
          overflow: hidden;
        }

        .cr-root .bar i {
          display: block;
          height: 100%;
          width: 100%;
          background: var(--fg);
          transform: scaleX(0);
          transform-origin: 0 50%;
        }

        @media (max-width: 900px) {
          .cr-root .veil {
            background:
              linear-gradient(to bottom, rgba(242,240,236,.72) 0%, rgba(242,240,236,.18) 24%, rgba(242,240,236,.18) 76%, rgba(242,240,236,.74) 100%),
              radial-gradient(100% 80% at 50% 48%, rgba(242,240,236,0) 0%, rgba(242,240,236,.40) 100%),
              rgba(242,240,236,.24);
          }
        }

        @media (max-width: 720px) {
          .cr-root .nav a:not(.pill) {
            display: none;
          }
          .cr-root .mark {
            font-size: 14px;
          }
          .cr-root .nav .pill {
            height: 38px;
            padding: 0 16px;
            font-size: 13.5px;
          }
          .cr-root h1 {
            max-width: 12ch;
            font-size: clamp(30px, 9.8vw, 52px);
          }
          .cr-root .sub {
            font-size: 15px;
            max-width: 34ch;
          }
          .cr-root .panel {
            padding: max(92px, calc(env(safe-area-inset-top, 0px) + 76px)) 18px max(88px, calc(env(safe-area-inset-bottom, 0px) + 72px));
          }
          .cr-root .foot {
            font-size: 11px;
            max-width: 34ch;
          }
        }

        @media (max-width: 420px) {
          .cr-root .mark-star {
            display: none;
          }
          .cr-root .nav .pill {
            height: 36px;
            padding: 0 14px;
            font-size: 13px;
          }
          .cr-root h1 {
            max-width: 11ch;
            font-size: clamp(28px, 10.5vw, 40px);
          }
          .cr-root .eyebrow {
            font-size: 11px;
            letter-spacing: .04em;
            max-width: 28ch;
          }
          .cr-root .cta .pill {
            width: 100%;
            max-width: 280px;
            height: 44px;
            padding: 0 20px;
            font-size: 14px;
          }
        }

        @media (max-height: 520px) and (orientation: landscape) {
          .cr-root .panel {
            padding: max(72px, calc(env(safe-area-inset-top, 0px) + 56px)) 24px max(64px, calc(env(safe-area-inset-bottom, 0px) + 48px));
          }
          .cr-root h1 {
            font-size: clamp(28px, 8vh, 44px);
          }
          .cr-root .sub {
            margin-top: 12px;
            font-size: 14px;
          }
          .cr-root .cta {
            margin-top: 16px;
          }
        }
      `}</style>

      <div className="cr-track" ref={trackRef}>
        <div className="cr-viewport">
          {/* 1. Boot preloader */}
          <div className="boot" ref={bootRef} id="boot">
            <div className="bar"><i ref={bootBarRef} id="bootBar"></i></div>
            <p ref={bootPctRef} id="bootPct">LOADING 0%</p>
          </div>

          {/* 2. Background Video Stage */}
          <div className="stage">
            <video ref={clipRef} id="clip" muted playsInline preload="auto" disablePictureInPicture></video>
            <div className="veil"></div>
            <div className="grain"></div>
          </div>

          {/* 3. Progress meter */}
          <i className="meter" ref={meterRef} id="meter"></i>

          {/* 4. Chrome (Header) */}
          <header className="chrome">
            <div className="mark">
              <span className="mark-star" aria-hidden="true">&#10037;</span>&nbsp;Cast &amp; Render
            </div>
            <nav className="nav">
              <a href="#board">Works</a>
              <a href="#visit">About</a>
              <a className="pill" href="#order">Start a brief</a>
            </nav>
          </header>

          {/* 5. Panels */}
          <main className="panels" ref={panelsRef}>
            {/* Panel 1 */}
            <section className="panel" data-panel>
              <div className="eyebrow">Objects studio <span>&middot;</span> No. 112 Render Lane</div>
              <h1 dangerouslySetInnerHTML={{ __html: "Built at four.<br />Out by seven." }}></h1>
              <p className="sub">Six kinds of mesh, one render farm, and a queue that starts before the sun does.</p>
              <div className="cta">
                <a className="pill" href="#board">View the reel</a>
              </div>
            </section>

            {/* Panel 2 */}
            <section className="panel" data-panel>
              <div className="eyebrow">Across the studio</div>
              <h1>Flat, never bent.</h1>
              <p className="sub">The mesh should still be clean when it reaches the viewport. We export to order, never before.</p>
              <div className="cta">
                <a className="pill" href="#visit">Tour our space</a>
              </div>
            </section>

            {/* Panel 3 */}
            <section className="panel" data-panel>
              <div className="eyebrow">The surface</div>
              <h1 dangerouslySetInnerHTML={{ __html: "Smooth enough to<br />hold a light pass." }}></h1>
              <p className="sub">Custom surface shaders whipped every morning, spread to the edge and weighed by the quarter pound.</p>
              <div className="cta">
                <a className="pill" href="#order">Start a brief</a>
              </div>
            </section>
          </main>

          {/* 6. Footer */}
          <footer className="foot">112 Render Lane &nbsp;&middot;&nbsp; Tue–Sun, 9am till sold out</footer>
        </div>
      </div>
    </div>
  );
};

export default CastAndRenderScrub;
