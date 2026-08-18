import type { Metadata } from "next";
import Image from "next/image";
import { ConsultationForm } from "@/components/consultation-form";
import {
  developmentDrawings,
  developmentTattoos,
} from "@/content/development-media";

export const metadata: Metadata = {
  title: "Consultation Request",
  description:
    "Share your tattoo idea, placement, references, and creative direction with MGM.TATZ.",
};

const consultationSteps = [
  {
    number: "01",
    title: "Connect",
    description:
      "Share the idea, placement, references, and what matters most.",
  },
  {
    number: "02",
    title: "Concept",
    description: "Miles considers composition, scale, and fit for the body.",
  },
  {
    number: "03",
    title: "Review / Design",
    description: "The direction is refined before scheduling moves forward.",
  },
  {
    number: "04",
    title: "Book / Create",
    description: "Scheduling remains a separate next step after review.",
  },
];

export default function ConsultationPage() {
  const tiger = developmentTattoos[0];
  const linework = developmentDrawings[0];
  const link = developmentDrawings[4];

  return (
    <main className="consultation-split">
      <aside className="consultation-sidebar">
        <div className="consultation-sidebar-content">
          <div className="consultation-sidebar-brand" aria-label="MGM.TATZ">
            <span>
              <Image
                src="/client-media/mgm-bird-logo.jpg"
                alt=""
                width={256}
                height={256}
                priority
              />
            </span>
            <div>
              <strong>MGM.TATZ</strong>
              <small>Tattoo artist</small>
            </div>
          </div>

          <section className="consultation-sidebar-intro">
            <p className="kicker ink-kicker">Contact &amp; booking</p>
            <h1>Let&apos;s design something meaningful.</h1>
            <p>
              Miles reviews each submission personally and follows up by email
              when the project details are ready for the next conversation.
            </p>
          </section>

          <div className="consultation-email-note">
            <span aria-hidden="true">✉</span>
            <p>
              <strong>Email is the primary contact channel.</strong>
              Please double-check the address you enter.
            </p>
          </div>

          <section
            className="consultation-process"
            aria-labelledby="process-title"
          >
            <p className="kicker ink-kicker" id="process-title">
              The process
            </p>
            <ol>
              {consultationSteps.map((step) => (
                <li key={step.number}>
                  <span>{step.number}</span>
                  <div>
                    <strong>{step.title}</strong>
                    <p>{step.description}</p>
                  </div>
                </li>
              ))}
            </ol>
          </section>
        </div>

        <Image
          className="consultation-sidebar-art"
          src={tiger.src}
          alt=""
          width={tiger.width}
          height={tiger.height}
          aria-hidden="true"
          sizes="32vw"
        />
      </aside>

      <section className="consultation-panel">
        <Image
          className="consultation-panel-art"
          src={linework.src}
          alt=""
          width={linework.width}
          height={linework.height}
          aria-hidden="true"
          sizes="60vw"
        />
        <div className="consultation-panel-inner">
          <header className="consultation-panel-heading">
            <p className="kicker">Tattoo consultation</p>
            <h2>
              Tell me your idea.
              <br />
              I&apos;ll bring it to life.
            </h2>
            <p>
              The more detail you share, the more considered and meaningful the
              direction can be.
            </p>
          </header>
          <ConsultationForm />
        </div>
        <Image
          className="consultation-panel-art--bottom"
          src={link.src}
          alt=""
          width={link.width}
          height={link.height}
          aria-hidden="true"
          sizes="60vw"
        />
      </section>
    </main>
  );
}
