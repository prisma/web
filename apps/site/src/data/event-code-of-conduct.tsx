import type { ReactNode } from "react";

export const cocLastUpdated = "7th of August, 2026";

export const cocDescription =
  "All attendees, speakers, sponsors, and volunteers at our events and conferences are required to agree to the following code of conduct.";

type CocSection = {
  title: string;
  content: ReactNode;
};

export const cocSections: CocSection[] = [
  {
    title: "The quick version",
    content: (
      <>
        <p>
          Prisma is dedicated to providing a harassment-free experience for everyone, regardless of
          gender, gender identity and expression, age, sexual orientation, disability, physical
          appearance, body size, race, ethnicity, nationality, immigration status, religion (or
          lack thereof), or technology choices. We do not tolerate harassment of event participants
          in any form. Sexual language and imagery are not appropriate for any event venue,
          including talks, workshops, parties, and all event-related online spaces, including
          social media and chat platforms.
        </p>
        <p>
          Event participants violating these rules may be sanctioned or expelled from the event
          without a refund at the discretion of the event organizers.
        </p>
      </>
    ),
  },
  {
    title: "Expected behavior",
    content: (
      <>
        <p>
          We expect all participants to be respectful and considerate of others, to collaborate in
          good faith, and to be mindful of their surroundings and fellow participants. Speak up if
          you notice a dangerous situation, someone in distress, or a violation of this code of
          conduct — even if it seems inconsequential.
        </p>
        <p>
          We expect participants to follow these rules at all Prisma event venues and
          conference-related social gatherings.
        </p>
      </>
    ),
  },
  {
    title: "The less quick version",
    content: (
      <>
        <p>
          Harassment includes offensive verbal comments related to gender, gender identity and
          expression, age, sexual orientation, disability, physical appearance, body size, race,
          ethnicity, nationality, immigration status, religion, technology choices, deliberate
          intimidation, stalking, following, harassing photography or recording, sustained
          disruption of talks or other events, inappropriate physical contact, and unwelcome sexual
          attention.
        </p>
        <p>Participants asked to stop any harassing behavior are expected to comply immediately.</p>
        <p>
          Sponsors are also subject to the anti-harassment policy. In particular, sponsors should
          not use sexualized images, activities, or other material. Booth staff (including
          volunteers) should not use sexualized clothing, uniforms, or costumes, or otherwise create
          a sexualized environment.
        </p>
        <p>
          If a participant engages in harassing behavior, the organizers may take any action they
          deem appropriate, including warning the offender or expulsion from the event with no
          refund.
        </p>
      </>
    ),
  },
  {
    title: "Reporting a problem",
    content: (
      <>
        <p>
          If you are being harassed, notice that someone else is being harassed, or have any other
          concerns, please contact a member of event staff immediately — event staff can be
          identified by their badges or clothing — or email{" "}
          <a href="mailto:conduct@prisma.io">conduct@prisma.io</a>. Reports by email can be made
          before, during, or after an event.
        </p>
        <p>
          All reports are handled with discretion and kept as confidential as possible; details are
          shared only with those who need them to respond. We will not tolerate retaliation against
          anyone who reports a concern in good faith. Reports sent to{" "}
          <a href="mailto:conduct@prisma.io">conduct@prisma.io</a> are acknowledged within 24
          hours.
        </p>
        <p>
          Event staff will be happy to help participants contact hotel/venue security, local law
          enforcement, or local emergency services, provide escorts, or otherwise assist those
          experiencing harassment to feel safe for the duration of the event.
        </p>
      </>
    ),
  },
  {
    title: "Additional event policies",
    content: (
      <>
        <p>
          Weapons are not permitted at any Prisma event venue or event-related social gathering.
        </p>
        <p>
          Where alcohol is served, it is available only to participants of legal drinking age, and
          we expect participants to drink responsibly. Event staff may decline to serve alcohol to
          anyone at their discretion.
        </p>
        <p>
          Be mindful when photographing or recording other participants: ask before taking
          close-up photos of individuals, and respect any request to delete a photo or stop
          recording.
        </p>
      </>
    ),
  },
  {
    title: "Attribution",
    content: (
      <p>
        This code of conduct is adapted from{" "}
        <a href="https://confcodeofconduct.com/" target="_blank" rel="noreferrer">
          confcodeofconduct.com
        </a>
        , licensed under{" "}
        <a
          href="https://creativecommons.org/licenses/by/3.0/deed.en"
          target="_blank"
          rel="noreferrer"
        >
          CC BY 3.0
        </a>
        .
      </p>
    ),
  },
];
