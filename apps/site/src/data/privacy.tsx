import type { ReactNode } from "react";

export const privacyLastUpdated = "July 10, 2025";

type PrivacySection = {
  title: string;
  content: ReactNode;
};

export const privacySections: PrivacySection[] = [
  {
    title: "1. Websites Covered",
    content: (
      <p>
        This privacy policy applies to the following Prisma websites:
        prisma.io, console.prisma.io, cloud.prisma.io,
        cloudprojects.prisma.io, optimize.prisma.io, and graph.cool.
      </p>
    ),
  },
  {
    title: "2. Information Collected",
    content: (
      <>
        <p>
          Prisma gathers data from website visitors and service users. Required
          contact details include name, company name, address, phone number, and
          email address. Billing information encompasses credit card details and
          employee count. Optional data covers company revenue and industry
          specifics.
        </p>
        <p>
          Website navigational information includes browser type, IP address,
          and user actions on the site. Embeddable Prisma Studio automatically
          collects application usage patterns, performance metrics, and
          integration metadata.
        </p>
        <p>
          Free Tier accounts provide metadata regarding usage volume and feature
          access for abuse monitoring and optimization. Users wanting Free Tier
          data deletion should contact{" "}
          <a href="mailto:support@prisma.io">support@prisma.io</a>.
        </p>
        <p>
          Free Tier telemetry captures API call frequency, schema size, project
          activities, and integration types — helping prevent abuse while
          maintaining service reliability.
        </p>
      </>
    ),
  },
  {
    title: "3. Use of Information Collected",
    content: (
      <>
        <p>
          Prisma utilizes customer data to deliver and support services. Contact
          forms enable outreach regarding service interest. Marketing efforts
          involve using provided information to discuss services and share
          company updates.
        </p>
        <p>
          Credit card information is used exclusively for financial
          qualification and payment collection. Website navigational data helps
          operate and improve the site while enabling personalization.
        </p>
        <p>
          Embeddable Studio telemetry enhances functionality and stability. Free
          Tier users receive transactional communications about plan limitations
          and feature announcements without opt-out options.
        </p>
      </>
    ),
  },
  {
    title: "4. Website Navigational Information",
    content: (
      <>
        <p>
          Cookies enable meaningful website interactions. Session cookies
          disappear upon browser closure, while persistent cookies remain.
          Encrypted session cookies authenticate logged-in users and are
          required for service use.
        </p>
        <p>
          Persistent cookies store unique identifiers associated with purchased
          services. Web beacons, combined with cookies, track user activity and
          email interactions. Third-party cookies monitor usage analytics and
          advertisement performance across networks.
        </p>
        <p>
          IP addresses track geographic data from visitors. Third-party ad
          networks collect navigational information to deliver targeted
          advertisements based on browsing history.
        </p>
      </>
    ),
  },
  {
    title: "5. Public Forums, Refer a Friend, and Customer Testimonials",
    content: (
      <>
        <p>
          Information shared in forums, bulletin boards, or chat rooms may be
          collected and used by other visitors. Prisma is not responsible for
          voluntarily submitted personal data in public forums.
        </p>
        <p>
          Customer testimonials and names require prior consent before
          publication.
        </p>
      </>
    ),
  },
  {
    title: "6. Sharing of Information Collected",
    content: (
      <>
        <p>
          Data may be shared with service providers, vendors, and partners to
          support services. Joint promotional partners may receive data when
          users express interest in co-offered products. Partners are bound by
          their own privacy policies.
        </p>
        <p>
          Credit card processing involves third-party providers prohibited from
          storing or using billing information beyond payment processing. Prisma
          reserves disclosure rights when legally required.
        </p>
        <p>
          All third parties undergo vetting and must maintain privacy standards
          consistent with the Data Privacy Framework. Prisma complies with DPF
          notice and choice principles; individuals may limit data use by
          contacting{" "}
          <a href="mailto:dpo@prisma.io">dpo@prisma.io</a>. Free Tier abuse
          detection employs automated systems monitoring usage trends.
        </p>
      </>
    ),
  },
  {
    title: "7. International Transfer of Information Collected",
    content: (
      <>
        <p>
          Prisma transfers customer data globally while maintaining Privacy
          Statement compliance. The company certifies adherence to EU-U.S. DPF,
          the UK Extension, and Swiss-U.S. DPF principles regarding personal
          data from those regions.
        </p>
        <p>
          Disputes resolve through relevant authorities and data protection
          authorities. The company commits to cooperating with EU DPAs, UK ICO,
          and Swiss FDPIC regarding unresolved complaints at no cost.
        </p>
      </>
    ),
  },
  {
    title: "8. Human Resource Data and Personal Data",
    content: (
      <>
        <p>
          Prisma cooperates with EU data protection authorities, UK ICO, and
          Swiss FDPIC regarding unresolved HR data complaints. The FTC
          investigates DPF compliance.
        </p>
        <p>
          Partner organizations handling HR and personal data follow equivalent
          legal requirements. Third-party liability limitations apply unless
          legally mandated. Users may contact{" "}
          <a href="mailto:dpo@prisma.io">dpo@prisma.io</a> with questions or to
          limit data use.
        </p>
        <p>
          Binding arbitration is available under DPF Principles conditions.
        </p>
      </>
    ),
  },
  {
    title: "9. Communications Preferences",
    content: (
      <>
        <p>
          Customers manage marketing communications through unsubscribe links in
          emails or by requesting preference changes via{" "}
          <a href="mailto:hello@prisma.io">hello@prisma.io</a>. Transactional
          account emails cannot be opted out.
        </p>
        <p>
          Free Tier users receive periodic plan usage and service change
          messages as part of core service functionality.
        </p>
      </>
    ),
  },
  {
    title: "10. Correcting and Updating Your Information",
    content: (
      <p>
        Account registration changes can be made by logging in at{" "}
        <a href="https://www.prisma.io/">prisma.io</a>. Information access,
        modification, or deletion requests receive responses within 30 days.
      </p>
    ),
  },
  {
    title: "11. Security",
    content: (
      <p>
        Prisma employs administrative, technical, and physical security
        safeguards for customer data protection.
      </p>
    ),
  },
  {
    title: "12. Changes to this Privacy Statement",
    content: (
      <p>
        Prisma reserves the right to modify this privacy policy at any time.
        Free Tier discontinuation may alter data retention practices, with
        reasonable notification and data export opportunities provided.
      </p>
    ),
  },
  {
    title: "13. Regulatory and Compliance Notice",
    content: (
      <p>
        Embeddable Prisma Studio operates as client-side software without
        visibility into end-user environments. Users bear sole responsibility
        for ensuring compliance with applicable laws across healthcare, finance,
        government, and other regulated sectors.
      </p>
    ),
  },
];
