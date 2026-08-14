import Image from "next/image";
import {
  developmentDrawings,
  developmentHeroTattoos,
  milesPortrait,
} from "@/content/development-media";

export const dynamic = "force-dynamic";

export default function HomePage() {
  return (
    <>
      <section className="hero dark">
        <div className="hero-copy">
          <p className="kicker">Solo artist</p>
          <h1>Miles</h1>
          <p className="hero-role">Independent tattoo artist</p>
          <div className="ornament-rule" aria-hidden="true">
            <span>✦</span>
          </div>
          <p className="lede">
            Illustrative black-and-grey tattoo work shaped by myth, symbolism,
            nature, and the human experience.
          </p>
          <a className="button" href="#consult">
            Book a consultation <span aria-hidden="true">✦</span>
          </a>
          <p className="location-line">
            <span aria-hidden="true">◇</span> Chicago, Illinois
          </p>
        </div>
        <div className="hero-artworks" aria-label="Selected tattoo work">
          {developmentHeroTattoos.map((item, index) => (
            <figure className={`hero-art-card art-${index + 1}`} key={item.src}>
              <Image
                src={item.src}
                alt={item.alt}
                width={item.width}
                height={item.height}
                priority
                sizes="(max-width: 600px) 50vw, (max-width: 900px) 33vw, 24vw"
                style={{ objectPosition: item.objectPosition }}
              />
              <figcaption>{item.title}</figcaption>
            </figure>
          ))}
        </div>
      </section>
      <section className="drawings-band paper" id="drawings">
        <div className="drawings-intro">
          <p className="kicker ink-kicker">From concept to lasting art</p>
          <h2>Drawn from intention.</h2>
          <div className="paper-rule" aria-hidden="true">
            ✦
          </div>
          <p>
            Sketchbook studies, classical references, and developing concepts
            inform the finished work.
          </p>
          <span className="quiet-link">View more drawings →</span>
        </div>
        <div className="drawing-rail" aria-label="Drawings and studies">
          {developmentDrawings.map((item, index) => (
            <figure
              className={`drawing-card drawing-${index + 1}`}
              key={item.src}
            >
              <Image
                src={item.src}
                alt={item.alt}
                width={item.width}
                height={item.height}
                sizes="(max-width: 600px) 50vw, 20vw"
              />
              <figcaption>{item.title}</figcaption>
            </figure>
          ))}
        </div>
      </section>
      <section className="about-band dark" id="about">
        <div className="artist-image-placeholder">
          <Image
            src={milesPortrait.src}
            alt={milesPortrait.alt}
            width={milesPortrait.width}
            height={milesPortrait.height}
            priority
            sizes="(max-width: 900px) 100vw, 35vw"
            style={{ objectPosition: milesPortrait.objectPosition }}
          />
        </div>
        <div className="about-statement">
          <p className="kicker">About Miles</p>
          <h2>
            Art that connects.
            <br />
            Stories that last.
          </h2>
          <p>
            Artist biography and studio details are pending client approval.
            This space is reserved without inventing experience or claims.
          </p>
        </div>
        <ul className="value-list">
          <li>
            <span aria-hidden="true">✦</span>
            <div>
              <strong>Personal process</strong>
              <p>Project approach forthcoming.</p>
            </div>
          </li>
          <li>
            <span aria-hidden="true">◇</span>
            <div>
              <strong>Intentional practice</strong>
              <p>Artist statement forthcoming.</p>
            </div>
          </li>
          <li>
            <span aria-hidden="true">◌</span>
            <div>
              <strong>Quality first</strong>
              <p>Studio details forthcoming.</p>
            </div>
          </li>
        </ul>
      </section>
      <section className="specialties paper">
        <div className="specialties-title">
          <p className="kicker ink-kicker">Style &amp; focus</p>
          <h2>
            Specialties
            <br />
            &amp; influences
          </h2>
        </div>
        <ul>
          <li>
            <span className="line-icon" aria-hidden="true">
              ◉
            </span>
            <strong>Black &amp; grey</strong>
            <small>Depth, contrast, fine detail</small>
          </li>
          <li>
            <span className="line-icon" aria-hidden="true">
              ✦
            </span>
            <strong>Illustrative</strong>
            <small>Drawing-led composition</small>
          </li>
          <li>
            <span className="line-icon" aria-hidden="true">
              ◇
            </span>
            <strong>Anime / manga</strong>
            <small>Graphic storytelling</small>
          </li>
          <li>
            <span className="line-icon" aria-hidden="true">
              ♜
            </span>
            <strong>Dark fantasy</strong>
            <small>Mythic visual language</small>
          </li>
          <li>
            <span className="line-icon" aria-hidden="true">
              ◎
            </span>
            <strong>Classical</strong>
            <small>Historical references</small>
          </li>
          <li>
            <span className="line-icon" aria-hidden="true">
              △
            </span>
            <strong>Animals &amp; anatomy</strong>
            <small>Organic form studies</small>
          </li>
        </ul>
      </section>
      <section className="info-band dark" id="faq">
        <div>
          <p className="kicker">FAQ</p>
          <h2>Questions? Start here.</h2>
          <p>
            Booking policies will be published after Miles supplies approved
            answers.
          </p>
        </div>
        <div>
          <p className="kicker">Contact &amp; booking</p>
          <h2>Planning a piece?</h2>
          <p>
            Consultation destination and studio contact details forthcoming.
          </p>
        </div>
      </section>
      <section className="process paper" id="process">
        <div className="process-title">
          <p className="kicker ink-kicker">The process</p>
        </div>
        <ol>
          <li>
            <span>01</span>
            <div>
              <strong>Consult</strong>
              <p>Share the idea, placement, scale, and direction.</p>
            </div>
          </li>
          <li>
            <span>02</span>
            <div>
              <strong>Design</strong>
              <p>Creative process details forthcoming.</p>
            </div>
          </li>
          <li>
            <span>03</span>
            <div>
              <strong>Book</strong>
              <p>Booking details forthcoming.</p>
            </div>
          </li>
          <li>
            <span>04</span>
            <div>
              <strong>Create</strong>
              <p>Session details forthcoming.</p>
            </div>
          </li>
        </ol>
      </section>
      <section className="consult" id="consult">
        <p className="kicker">Ready to bring your idea to life?</p>
        <h2>
          <span aria-hidden="true">✦</span> Book a consultation{" "}
          <span aria-hidden="true">✦</span>
        </h2>
        <p>
          Let&apos;s create something meaningful. Consultation link forthcoming.
        </p>
        <span className="button disabled" aria-disabled="true">
          Booking opens here
        </span>
      </section>
    </>
  );
}
