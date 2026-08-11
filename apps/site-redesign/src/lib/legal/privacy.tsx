import type { ReactNode } from "react";

export const privacyLastUpdated = "7th of August, 2026";

type PrivacySection = {
  title: string;
  content: ReactNode;
};

export const privacySections: PrivacySection[] = [
  {
    title: "1. Websites Covered",
    content: (
      <p>
        This privacy policy applies to the following Prisma websites: prisma.io, console.prisma.io,
        cloud.prisma.io, cloudprojects.prisma.io, and graph.cool. It is issued
        by Prisma Data, Inc., which acts as the data controller for personal data described in this
        policy. Questions may be directed to <a href="mailto:dpo@prisma.io">dpo@prisma.io</a>.
      </p>
    ),
  },
  {
    title: "2. Information Collected",
    content: (
      <>
        <p>
          Prisma gathers data from website visitors and service users. Required contact details
          include name, company name, address, phone number, and email address. Billing information
          encompasses credit card details and employee count. Optional data covers company revenue
          and industry specifics.
        </p>
        <p>
          Website navigational information includes browser type, IP address, and user actions on
          the site. Embeddable Prisma Studio automatically collects application usage patterns,
          performance metrics, and integration metadata.
        </p>
        <p>
          Free Tier accounts provide metadata regarding usage volume and feature access for abuse
          monitoring and optimization. Users wanting Free Tier data deletion should contact{" "}
          <a href="mailto:support@prisma.io">support@prisma.io</a>.
        </p>
        <p>
          Free Tier telemetry captures API call frequency, schema size, project activities, and
          integration types — helping prevent abuse while maintaining service reliability.
        </p>
        <p>
          Prisma does not intentionally collect sensitive personal data (such as health data,
          biometric data, or data revealing racial or ethnic origin).
        </p>
      </>
    ),
  },
  {
    title: "3. Use of Information Collected",
    content: (
      <>
        <p>
          Prisma utilizes customer data to deliver and support services. Contact forms enable
          outreach regarding service interest. Marketing efforts involve using provided information
          to discuss services and share company updates.
        </p>
        <p>
          Credit card information is used exclusively for financial qualification and payment
          collection. Website navigational data helps operate and improve the site while enabling
          personalization.
        </p>
        <p>
          Where the GDPR or UK GDPR applies, Prisma processes personal data on the following legal
          bases: performance of a contract (providing the services), legitimate interests (service
          improvement, security, and abuse prevention), consent (marketing communications and
          non-essential cookies), and compliance with legal obligations.
        </p>
        <p>
          Embeddable Studio telemetry enhances functionality and stability. Free Tier users receive
          transactional communications — such as plan limit, security, and service change notices —
          that are part of core service functionality and cannot be opted out of. Marketing
          communications, including feature announcements, always include an opt-out.
        </p>
        <p>
          Prisma uses automated systems to monitor usage trends for abuse detection. Prisma does not
          make decisions producing legal or similarly significant effects about individuals based
          solely on automated processing.
        </p>
      </>
    ),
  },
  {
    title: "4. Cookies and Website Navigational Information",
    content: (
      <>
        <p>
          Cookies enable meaningful website interactions. Session cookies disappear upon browser
          closure, while persistent cookies remain. Encrypted session cookies authenticate logged-in
          users and are required for service use.
        </p>
        <p>
          Persistent cookies store unique identifiers associated with purchased services. Web
          beacons, combined with cookies, track user activity and email interactions. Third-party
          cookies monitor usage analytics and advertisement performance across networks.
        </p>
        <p>
          IP addresses track geographic data from visitors. Third-party ad networks collect
          navigational information to deliver targeted advertisements based on browsing history.
        </p>
        <p>
          Where required by law, non-essential cookies are set only with your consent, and you can
          change your cookie preferences at any time through our cookie settings. You can opt out of
          targeted advertising as described in Section 10, and Prisma honors opt-out preference
          signals such as Global Privacy Control (GPC) as required by applicable law.
        </p>
      </>
    ),
  },
  {
    title: "5. Public Forums, Refer a Friend, and Customer Testimonials",
    content: (
      <>
        <p>
          Information shared in forums, bulletin boards, or chat rooms may be collected and used by
          other visitors. Prisma is not responsible for voluntarily submitted personal data in
          public forums.
        </p>
        <p>Customer testimonials and names require prior consent before publication.</p>
      </>
    ),
  },
  {
    title: "6. Sharing of Information Collected",
    content: (
      <>
        <p>
          Data may be shared with service providers, vendors, and partners to support services.
          Joint promotional partners may receive data when users express interest in co-offered
          products. Partners are bound by their own privacy policies.
        </p>
        <p>
          Credit card processing involves third-party providers prohibited from storing or using
          billing information beyond payment processing.
        </p>
        <p>
          Prisma may be required to disclose personal data in response to lawful requests by public
          authorities, including to meet national security or law enforcement requirements.
        </p>
        <p>
          All third parties undergo vetting and must maintain privacy standards consistent with the
          Data Privacy Framework. Prisma complies with DPF notice and choice principles: you may opt
          out of the disclosure of your personal data to third parties, or its use for a purpose
          materially different from the purpose for which it was collected, by contacting{" "}
          <a href="mailto:dpo@prisma.io">dpo@prisma.io</a>. Free Tier abuse detection employs
          automated systems monitoring usage trends.
        </p>
      </>
    ),
  },
  {
    title: "7. International Transfers and the Data Privacy Framework",
    content: (
      <>
        <p>
          Prisma transfers customer data globally while maintaining compliance with this privacy
          policy. Prisma Data, Inc. complies with the EU-U.S. Data Privacy Framework (EU-U.S. DPF),
          the UK Extension to the EU-U.S. DPF, and the Swiss-U.S. Data Privacy Framework (Swiss-U.S.
          DPF) as set forth by the U.S. Department of Commerce. Prisma Data, Inc. has certified to
          the U.S. Department of Commerce that it adheres to the EU-U.S. DPF Principles with regard
          to the processing of personal data received from the European Union and, under the UK
          Extension, from the United Kingdom (and Gibraltar), and to the Swiss-U.S. DPF Principles
          with regard to personal data received from Switzerland. If there is any conflict between
          the terms in this privacy policy and the DPF Principles, the Principles shall govern. To
          learn more about the Data Privacy Framework program, and to view our certification, please
          visit{" "}
          <a href="https://www.dataprivacyframework.gov/" target="_blank" rel="noreferrer">
            https://www.dataprivacyframework.gov/
          </a>
          .
        </p>
        <p>
          Prisma Data, Inc. is subject to the investigatory and enforcement powers of the U.S.
          Federal Trade Commission (FTC).
        </p>
        <p>
          In compliance with the DPF Principles, Prisma commits to resolve complaints about our
          collection or use of your personal data. Individuals in the EU, UK, or Switzerland with
          inquiries or complaints should first contact{" "}
          <a href="mailto:dpo@prisma.io">dpo@prisma.io</a>. For complaints that cannot be resolved
          directly, Prisma has committed to cooperate and comply with the advice of the panel
          established by the EU data protection authorities (DPAs), the UK Information
          Commissioner&apos;s Office (ICO), and the Swiss Federal Data Protection and Information
          Commissioner (FDPIC). This independent dispute resolution mechanism is available to you at
          no cost. Under certain conditions described in the DPF Principles, you may also invoke
          binding arbitration when other dispute resolution procedures have been exhausted.
        </p>
        <p>
          Prisma remains responsible and liable under the DPF Principles if third-party agents
          processing personal data on its behalf do so in a manner inconsistent with the Principles,
          unless Prisma proves that it is not responsible for the event giving rise to the damage.
        </p>
      </>
    ),
  },
  {
    title: "8. Human Resource Data",
    content: (
      <>
        <p>
          For human resources data transferred from the EU, UK, or Switzerland in the context of an
          employment relationship, Prisma commits to cooperate and comply with the advice of the EU
          data protection authorities, the UK ICO, and the Swiss FDPIC, and to grant the rights
          provided under the DPF Principles.
        </p>
        <p>
          Partner organizations handling HR and personal data follow equivalent legal requirements.
          Team members may contact <a href="mailto:dpo@prisma.io">dpo@prisma.io</a> with questions
          or to limit data use.
        </p>
      </>
    ),
  },
  {
    title: "9. Communications Preferences",
    content: (
      <>
        <p>
          Customers manage marketing communications through unsubscribe links in emails or by
          requesting preference changes via <a href="mailto:hello@prisma.io">hello@prisma.io</a>.
          Transactional account emails cannot be opted out.
        </p>
        <p>
          Free Tier users receive periodic plan usage and service change messages as part of core
          service functionality.
        </p>
      </>
    ),
  },
  {
    title: "10. Your Privacy Rights",
    content: (
      <>
        <p>
          Account registration changes can be made by logging in at{" "}
          <a href="https://www.prisma.io/">prisma.io</a>. You may also request access to,
          correction, or deletion of your personal data by contacting{" "}
          <a href="mailto:dpo@prisma.io">dpo@prisma.io</a>. Requests receive responses within 30
          days, or any shorter period required by applicable law. Individuals covered by the DPF may
          access, correct, amend, or delete personal data we hold about them.
        </p>
        <p>
          Where the GDPR or UK GDPR applies, you additionally have the right to data portability,
          the right to restrict or object to processing, the right to withdraw consent at any time
          without affecting prior processing, and the right to lodge a complaint with your data
          protection supervisory authority.
        </p>
        <p>
          Residents of California and other U.S. states with comprehensive privacy laws have the
          right to know and access the personal information we collect, correct or delete it,
          receive it in a portable format, and opt out of targeted advertising and the sale or
          sharing of personal information. Prisma does not sell personal information for money;
          third-party advertising cookies described in Section 4 may constitute "sharing" under
          California law, and you may opt out via our cookie settings, the Global Privacy Control
          signal, or <a href="mailto:dpo@prisma.io">dpo@prisma.io</a>. We will not discriminate
          against you for exercising your rights, and you may appeal a refused request by replying
          to our decision.
        </p>
      </>
    ),
  },
  {
    title: "11. Data Retention",
    content: (
      <p>
        Prisma retains personal data only for as long as needed to fulfill the purposes described in
        this policy, including providing the services, complying with legal, tax, and accounting
        obligations, resolving disputes, and enforcing agreements. When personal data is no longer
        required, it is deleted or anonymized. Retention periods vary by data category and are
        available on request via <a href="mailto:dpo@prisma.io">dpo@prisma.io</a>.
      </p>
    ),
  },
  {
    title: "12. Children's Privacy",
    content: (
      <p>
        Prisma&apos;s websites and services are not directed at children, and Prisma does not
        knowingly collect personal data from children under 16. If you believe a child has provided
        us personal data, contact <a href="mailto:dpo@prisma.io">dpo@prisma.io</a> and we will
        delete it.
      </p>
    ),
  },
  {
    title: "13. Security",
    content: (
      <p>
        Prisma employs administrative, technical, and physical security safeguards for customer data
        protection.
      </p>
    ),
  },
  {
    title: "14. Changes to this Privacy Statement",
    content: (
      <p>
        Prisma reserves the right to modify this privacy policy at any time. Free Tier
        discontinuation may alter data retention practices, with reasonable notification and data
        export opportunities provided.
      </p>
    ),
  },
  {
    title: "15. Regulatory and Compliance Notice",
    content: (
      <p>
        Embeddable Prisma Studio operates as client-side software without visibility into end-user
        environments. Users bear sole responsibility for ensuring compliance with applicable laws
        across healthcare, finance, government, and other regulated sectors.
      </p>
    ),
  },
];
