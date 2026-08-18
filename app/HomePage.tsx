import Image from "next/image";
import Link from "next/link";
import { NewsletterSignup } from "@/components/newsletter-signup";
import {
  developmentDrawings,
  developmentHeroTattoos,
  milesPortrait,
} from "@/content/development-media";
import { aboutContent } from "@/content/site-content";
import { getSupabaseEnvironment } from "@/lib/env";
import { publicMediaUrl } from "@/lib/portfolio";
import {
  getHomepageDrawingItems,
  getHomepagePortfolioItems,
} from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [heroResult, drawingsResult] = await Promise.all([
    getHomepagePortfolioItems(),
    getHomepageDrawingItems(),
  ]);
  const supabaseEnvironment =
    heroResult.configured || drawingsResult.configured
      ? getSupabaseEnvironment()
      : null;
  const heroItems = heroResult.configured
    ? heroResult.items.flatMap((item) => {
        const media = item.portfolio_media[0];
        if (!media) return [];
        return [
          {
            id: item.id,
            src: publicMediaUrl(
              supabaseEnvironment!.url,
              media.storage_bucket,
              media.storage_key,
            ),
            alt: media.alt_text,
            width: media.width ?? 1200,
            height: media.height ?? 1500,
            title: item.title,
            objectPosition: undefined,
          },
        ];
      })
    : developmentHeroTattoos.map((item) => ({ id: item.src, ...item }));
  const drawingItems = drawingsResult.configured
    ? drawingsResult.items.map((item) => ({
        id: item.id,
        src: publicMediaUrl(
          supabaseEnvironment!.url,
          item.media.storage_bucket,
          item.media.storage_key,
        ),
        alt: item.media.alt_text,
        width: item.media.width ?? 1200,
        height: item.media.height ?? 1500,
        title: item.title,
      }))
    : developmentDrawings.map((item) => ({ id: item.src, ...item }));

  return (
    <>
      <section
        className={`hero dark${heroItems.length ? "" : " hero-without-artworks"}`}
      >
        <div className="hero-copy">
          <p className="kicker">CUSTOM TIMELESS ART.</p>
          <h1>Miles</h1>
          <p className="hero-role">Independent tattoo artist</p>
          <div className="ornament-rule" aria-hidden="true">
            <span>✦</span>
          </div>
          <p className="lede">{aboutContent.introduction}</p>
          <Link className="button" href="/consultation">
            Book a consultation <span aria-hidden="true">✦</span>
          </Link>
          <p className="location-line">
            <span aria-hidden="true">◇</span> Chicago, Illinois
          </p>
          <div className="hero-newsletter">
            <NewsletterSignup
              className="hero-newsletter-form"
              idPrefix="hero-newsletter"
              label="Stay notified"
            />
          </div>
        </div>
        {heroItems.length ? (
          <div
            className="hero-artworks"
            data-count={heroItems.length}
            aria-label="Selected tattoo work"
          >
            {heroItems.map((item, index) => (
              <figure
                className={`hero-art-card art-${index + 1}`}
                key={item.id}
              >
                <Image
                  src={item.src}
                  alt={item.alt}
                  width={item.width}
                  height={item.height}
                  priority
                  sizes="(max-width: 600px) 70vw, (max-width: 900px) 38vw, 18vw"
                  style={{ objectPosition: item.objectPosition }}
                />
                <figcaption>{item.title}</figcaption>
              </figure>
            ))}
          </div>
        ) : null}
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
          {drawingItems.map((item, index) => (
            <figure
              className={`drawing-card drawing-${index + 1}`}
              key={item.id}
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
          <p>{aboutContent.biography}</p>
        </div>
        <ul className="value-list">
          {aboutContent.values.map((value) => (
            <li key={value.title}>
              <span aria-hidden="true">{value.mark}</span>
              <div>
                <strong>{value.title}</strong>
                <p>{value.description}</p>
              </div>
            </li>
          ))}
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
          <p>Find current booking and studio information in one place.</p>
          <Link className="quiet-link" href="/faq">
            Visit FAQ →
          </Link>
        </div>
        <div>
          <p className="kicker">Contact &amp; booking</p>
          <h2>Planning a piece?</h2>
          <p>Share your idea, placement, references, and creative direction.</p>
          <Link className="quiet-link" href="/consultation">
            Start a consultation request →
          </Link>
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
        <p>Let&apos;s create something meaningful.</p>
        <Link className="button" href="/consultation">
          Start your request
        </Link>
      </section>
    </>
  );
}
