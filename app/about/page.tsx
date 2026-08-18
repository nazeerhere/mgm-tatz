import type { Metadata } from "next";
import Image from "next/image";
import { aboutContent } from "@/content/site-content";
import { milesPortrait } from "@/content/development-media";

export const metadata: Metadata = { title: "About Miles" };

export default function AboutPage() {
  return (
    <section className="support-page about-page dark">
      <header className="support-hero">
        <p className="kicker">About Miles</p>
        <h1>About Miles.</h1>
        <p className="support-lede">{aboutContent.introduction}</p>
      </header>

      <div className="about-page-grid">
        <figure className="about-page-portrait">
          <Image
            src={milesPortrait.src}
            alt={milesPortrait.alt}
            width={milesPortrait.width}
            height={milesPortrait.height}
            priority
            sizes="(max-width: 800px) 100vw, 42vw"
            style={{ objectPosition: milesPortrait.objectPosition }}
          />
        </figure>

        <div className="about-page-details">
          <div className="about-page-statement">
            <p className="kicker">Independent tattoo artist</p>
            <h2>{aboutContent.heading}</h2>
            <p>{aboutContent.biography}</p>
          </div>

          <ul className="about-page-values">
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
        </div>
      </div>
    </section>
  );
}
