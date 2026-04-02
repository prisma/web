import type { ReactNode } from "react";

export const cocLastUpdated = "August 1, 2024";

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
          Prisma is dedicated to providing a harassment-free experience for
          everyone, regardless of gender, gender identity and expression, age,
          sexual orientation, disability, physical appearance, body size, race,
          ethnicity, religion (or lack thereof), or technology choices. We do not
          tolerate harassment of event participants in any form. Sexual language
          and imagery are not appropriate for any event venue, including talks,
          workshops, parties, Twitter, Slack, and other online media.
        </p>
        <p>
          Event participants violating these rules may be sanctioned or expelled
          from the event without a refund at the discretion of the event
          organizers.
        </p>
      </>
    ),
  },
  {
    title: "The less quick version",
    content: (
      <>
        <p>
          Harassment includes offensive verbal comments related to gender, gender
          identity and expression, age, sexual orientation, disability, physical
          appearance, body size, race, ethnicity, religion, technology choices,
          deliberate intimidation, stalking, following, harassing photography or
          recording, sustained disruption of talks or other events,
          inappropriate physical contact, and unwelcome sexual attention.
        </p>
        <p>
          Participants asked to stop any harassing behavior are expected to
          comply immediately.
        </p>
        <p>
          Sponsors are also subject to the anti-harassment policy. In
          particular, sponsors should not use sexualized images, activities, or
          other material. Booth staff (including volunteers) should not use
          sexualized clothing, uniforms, or costumes, or otherwise create a
          sexualized environment.
        </p>
        <p>
          If a participant engages in harassing behavior, the organizers may take
          any action they deem appropriate, including warning the offender or
          expulsion from the event with no refund.
        </p>
        <p>
          If you are being harassed, notice that someone else is being harassed,
          or have any other concerns, please contact a member of event staff
          immediately. Event staff can be identified by their badges or
          clothing.
        </p>
        <p>
          Event staff will be happy to help participants contact hotel/venue
          security or local law enforcement, provide escorts, or otherwise
          assist those experiencing harassment to feel safe for the duration of
          the event.
        </p>
        <p>
          We expect participants to follow these rules at all Prisma event
          venues and conference-related social gatherings.
        </p>
      </>
    ),
  },
];
