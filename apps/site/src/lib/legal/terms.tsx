import type { ReactNode } from "react";

export const termsEffectiveDate = "October 12, 2026";

export type TermsSection = {
  title: string;
  content: ReactNode;
};

export const termsSections: TermsSection[] = [
  {
    title: "1. Your Agreement with Prisma",
    content: (
      <>
        <p>
          Your use of the Prisma service is governed by this agreement (the &quot;Terms&quot;).
          &quot;Prisma&quot; means Prisma Data, Inc and its subsidiaries or affiliates involved in
          providing the Prisma Service. The &quot;Prisma Service&quot; means the services Prisma
          makes available through this website, including the website itself, the Prisma Console,
          Prisma Postgres, Prisma Compute, Query Insights, Prisma Studio (including Embeddable
          Prisma Studio as described in Section 19), the Prisma REST API and MCP server, add-ons,
          and any other software or services offered by Prisma, including Beta Services.
        </p>
        <p>
          &quot;Free Tier&quot; refers to the no-cost access tier of the Prisma Services, which
          provides limited usage and features as detailed on the pricing page. Prisma reserves the
          right to modify the scope, availability, and features of the Free Tier at any time without
          prior notice.
        </p>
        <p>
          In order to use the Prisma Services, you must first agree to the Terms. You can agree to
          the Terms by actually using the Prisma Services. You understand and agree that Prisma will
          treat your use of the Prisma Services as acceptance of the Terms from that point onwards.
          Use of the Prisma Services includes provisioning resources through the Prisma
          command-line interface, the Prisma MCP server, or other programmatic means, including
          through an AI agent or other tool acting on your behalf. For example, creating a database
          with <code>npx create-db</code> is a use of the Prisma Services.
        </p>
        <p>
          You may not use the Prisma Services if (a) you are not of legal age to form a binding
          contract with Prisma, or (b) you are a person barred from receiving the Prisma Services
          under the laws of the United States or other countries including the country in which you
          are resident or from which you use the Prisma Services.
        </p>
        <p>
          You acknowledge that any purchases made are not contingent upon the delivery of any future
          functionality or features.
        </p>
        <p>
          Beta Services are provided &quot;as is&quot; and may contain bugs, errors, or other
          issues. They are subject to significant changes during the development period, may be
          modified or discontinued at any time, are not recommended for mission-critical workloads,
          and any data stored during this period may be wiped upon the conclusion of the beta phase.
        </p>
        <p>The following defined terms are used throughout these Terms:</p>
        <ul>
          <li>
            &quot;Application&quot; means any software, code, service, or workload that you develop,
            deploy, or run using the Prisma Services, including applications hosted on Prisma
            Compute.
          </li>
          <li>
            &quot;Content&quot; has the meaning given in Section 5, and comprises &quot;Customer
            Content&quot; (data, code, files, and other materials that you or your end users
            submit to, store in, or process through the Prisma Services, including data stored in
            Prisma Postgres) and &quot;Prisma Content&quot; (materials that Prisma makes available
            through the Prisma Services).
          </li>
          <li>
            &quot;Beta Services&quot; means products, features, or versions labeled Early Access,
            Preview, Beta, Public Beta, Release Candidate, or Experimental.
          </li>
        </ul>
      </>
    ),
  },
  {
    title: "2. Your Account and Use of the Prisma Services",
    content: (
      <>
        <p>
          You must provide accurate and complete registration information any time you register to
          use the Prisma Services. You are responsible for the security of your passwords and for
          any use of your account. If you become aware of any unauthorized use of your password or
          of your account, you agree to notify Prisma immediately.
        </p>
        <p>
          Your use of the Prisma Services must comply with all applicable laws, regulations and
          ordinances, including any laws regarding the export of data or software.
        </p>
        <p>
          You agree not to (a) access the administrative interface of the Prisma Services by any
          means other than through the interface that is provided by Prisma in connection with the
          Prisma Services, unless you have been specifically allowed to do so in a separate
          agreement with Prisma, or (b) engage in any activity that interferes with or disrupts the
          Prisma Services (or the servers and networks which are connected to the Service).
        </p>
        <p>
          You may use the Prisma Services only to develop and run applications on the Prisma
          infrastructure. You may not use the Prisma Services for the purpose of bringing an
          intellectual property infringement claim against Prisma or for the purpose of creating a
          product or service competitive with the Prisma Services.
        </p>
        <p>
          You are responsible for your end users&apos; use of your Applications and for ensuring
          that their use complies with these Terms, including Section 14 (Acceptable Use).
        </p>
      </>
    ),
  },
  {
    title: "3. Service Policies and Privacy",
    content: (
      <>
        <p>
          The Prisma Services shall be subject to the privacy policy. You agree to the use of your
          data in accordance with Prisma&apos;s privacy policies.
        </p>
        <p>
          To the extent that Prisma processes personal data on your behalf in providing the Prisma
          Services, Prisma acts as your processor (or service provider, as applicable), and that
          processing is governed by Prisma&apos;s Data Processing Agreement (the &quot;DPA&quot;),
          which forms part of these Terms. The DPA is available for download from the Compliance
          section of the Prisma Console. In the event of any conflict between these Terms and the
          DPA concerning the processing of personal data, the DPA shall prevail.
        </p>
        <p>
          You agree to protect the privacy and legal rights of the end users of your application.
          You must obtain necessary consents under applicable data protection laws, and provide
          adequate privacy notices disclosing information about end-user data visibility to your
          applications and to Prisma.
        </p>
        <p>
          Usage data from Early Access products may be used to support improvements and bug fixes.
        </p>
      </>
    ),
  },
  {
    title: "4. Fees for Use of the Prisma Services",
    content: (
      <>
        <p>
          Subject to the Terms, the Prisma Services are provided to you without charge up to certain
          limits. Usage over these limits requires your purchase of additional resources or
          services. The pricing for additional resources and services can be found on the Prisma
          pricing page.
        </p>
        <p>
          For all purchased resources and services, Prisma will bill your credit card on a monthly
          basis. Late payments bear interest at the rate of 1.5% per month (or the highest rate
          permitted by law, if less). Charges are exclusive of taxes. You are responsible for paying
          all taxes and government charges. Prisma reserves the right to discontinue service for
          late payment.
        </p>
        <p>
          Any refunds remain at Prisma&apos;s sole discretion and are provided in credit form only.
          Card information may be shared with payment processors and credit agencies.
        </p>
        <p>
          Prisma may change its fees and payment policies by notifying you at least fifteen (15)
          days before the beginning of the billing cycle in which such change will take effect. Free
          Tier and Starter Plan modifications take immediate effect via pricing page updates.
        </p>
        <p>
          You may not create multiple accounts to avoid fees or bypass usage limits. Prisma may
          consolidate accounts or require upgrades in such cases.
        </p>
        <p>
          Annual subscriptions run for 12 months with automatic renewal absent 30-day cancellation
          notice. Annual plans require full upfront payment with no refunds. Reminder emails arrive
          35-45 days before renewal. Cancellation requires notice 30 days before the renewal date.
          Subscription term modifications receive 60 days&apos; email notice.
        </p>
        <p>
          Free Tier access depends on usage limits and feature availability. Prisma may suspend
          abusive users and restrict support or premium features to paid plans.
        </p>
        <p>
          Usage-based services, including Prisma Compute, are billed according to metered usage,
          such as requests, provisioned memory, active CPU time, and outbound bandwidth, at the
          rates on the pricing page. Where a spend limit applies to your account, Prisma may pause
          or restrict your Applications, databases, or other resources when the limit is reached.
          Beta Services may be provided free of charge or at reduced rates, and Prisma may begin
          charging for them by giving you at least fifteen (15) days&apos; notice.
        </p>
        <p>
          Fees for the Prisma Services may also be billed through authorized resellers or
          marketplace partners (for example, Prisma Postgres purchased through Vercel). In such
          cases, the reseller&apos;s payment terms govern billing and payment mechanics, while
          these Terms continue to govern your use of the Prisma Services.
        </p>
      </>
    ),
  },
  {
    title: "5. Content on the Prisma Services and Take Down Obligations",
    content: (
      <>
        <p>
          You understand that all information (such as data files, written text, computer software,
          music, audio files or other sounds, photographs, videos or other images) which you may
          have access to as part of, or through your use of, the Prisma Services are the sole
          responsibility of the person from which such content originated. All such information is
          referred to as the &quot;Content.&quot;
        </p>
        <p>
          Prisma reserves the right (but shall have no obligation) to remove any or all Content from
          the Prisma Services. You agree to immediately take down any Content that violates{" "}
          <a href="#14.-acceptable-use">Section 14 (Acceptable Use)</a>, including pursuant to a
          take down request from Prisma. In the event that you elect not to comply with a request
          from Prisma to take down certain Content, Prisma reserves the right to directly take down
          such Content or to disable Applications. Where required by applicable law, removals of
          Content and disablement of Applications are subject to the statement of reasons described
          in Section 21.
        </p>
        <p>
          You agree that you are solely responsible for (and that Prisma has no responsibility to
          you or to any third party for) the Application or any Content that you create, transmit or
          display while using the Prisma Services and for the consequences of your actions
          (including any loss or damage which Prisma may suffer) by doing so.
        </p>
        <p>
          You agree that Prisma has no responsibility or liability for the deletion or failure to
          store any Content and other communications maintained or transmitted through use of the
          Service. You are solely responsible for securing and backing up your applications and any
          data.
        </p>
      </>
    ),
  },
  {
    title: "6. Proprietary Rights",
    content: (
      <>
        <p>
          You acknowledge and agree that Prisma (or Prisma&apos;s licensors) own all legal right,
          title and interest in and to the Prisma Services, including any intellectual property
          rights which subsist in the Prisma Services (whether those rights happen to be registered
          or not, and wherever in the world those rights may exist).
        </p>
        <p>
          Prisma acknowledges and agrees that it obtains no right, title or interest from you (or
          your licensors) under these Terms in or to any Content or Applications that you create,
          submit, post, transmit or display on, or through, the Prisma Services, including any
          intellectual property rights which subsist in that Content and the Application (whether
          those rights happen to be registered or not, and wherever in the world those rights may
          exist). Unless you have agreed otherwise in writing with Prisma, you agree that you are
          responsible for protecting and enforcing those rights and that Prisma has no obligation to
          do so on your behalf.
        </p>
      </>
    ),
  },
  {
    title: "7. License from Prisma and Restrictions",
    content: (
      <>
        <p>
          Prisma gives you a personal, worldwide, royalty-free, non-assignable and non-exclusive
          license to use the software provided to you by Prisma as part of the Prisma Services as
          provided to you by Prisma. This license is for the sole purpose of enabling you to use and
          enjoy the benefit of the Prisma Services as provided by Prisma, in the manner permitted by
          the Terms.
        </p>
        <p>
          You may not (and you may not permit anyone else to): (a) copy, modify, create a derivative
          work of, reverse engineer, decompile or otherwise attempt to extract the source code of
          the Prisma Services or any part thereof, unless this is expressly permitted or required by
          law, or unless you have been specifically told that you may do so by Prisma, in writing;
          (b) attempt to disable or circumvent any security mechanisms used by the Prisma Services
          or any applications running on the Prisma Services; or (c) use the Prisma Services in any
          manner that would subject Prisma&apos;s intellectual property or technology to any other
          license terms.
        </p>
        <p>
          Open source software licenses for components of the Prisma Services released under an open
          source license constitute separate written agreements. To the limited extent that the open
          source software licenses expressly supersede these Terms, the open source licenses govern
          your agreement with Prisma for the use of the components of the Prisma Services released
          under an open source license.
        </p>
      </>
    ),
  },
  {
    title: "8. License from You",
    content: (
      <>
        <p>
          Prisma claims no ownership or control over any Content or Application. You retain
          copyright and any other rights you already hold in the Content and/or Application, and you
          are responsible for protecting those rights, as appropriate.
        </p>
        <p>
          By submitting, posting or displaying the Content on or through the Prisma Services you
          give Prisma a worldwide, royalty-free, and non-exclusive license to reproduce, adapt,
          modify, translate, publish, publicly perform, publicly display and distribute such Content
          for the sole purpose of enabling Prisma to provide you with the Prisma Services.
        </p>
        <p>
          By adding a collaborator to your Application, you hereby grant to that user a
          non-exclusive, royalty-free, non-transferable license, with no right to sub-license, to
          use, display, perform, reproduce, modify, publish, distribute, list information regarding,
          edit, translate and analyze such Application(s) and Content as permitted by the relevant
          Prisma Services functionality or features for the sole purpose of collaborating on
          development of the Application(s).
        </p>
        <p>
          You may choose to or we may invite you to submit comments or ideas about the Prisma
          Services, including without limitation about how to improve the Prisma Services or our
          products (&quot;Ideas&quot;). By submitting any Idea, you agree that your disclosure is
          gratuitous, unsolicited and without restriction and will not place Prisma under any
          fiduciary or other obligation, and that we are free to use the Idea without any additional
          compensation to you, and/or to disclose the Idea on a non-confidential basis or otherwise
          to anyone.
        </p>
        <p>
          Prisma, in its sole discretion, may use your trade names, trademarks, service marks,
          logos, domain names and other distinctive brand features in presentations, marketing
          materials, customer lists, financial reports and website listings for the purposes of
          advertising and publicizing your use of the Prisma Services.
        </p>
      </>
    ),
  },
  {
    title: "9. Modification and Termination of the Prisma Services",
    content: (
      <>
        <p>
          Prisma is constantly innovating in order to provide the best possible experience for its
          users. You acknowledge and agree that the form and nature of the Prisma Services which
          Prisma provides may change from time to time without prior notice to you, subject to the
          terms in Section 4. Changes to the form and nature of the Prisma Services will be
          effective with respect to all versions of the Prisma Services; examples of changes to the
          form and nature of the Prisma Services include without limitation changes to fee and
          payment policies, security patches, added functionality, and other enhancements.
        </p>
        <p>
          You may terminate these Terms at any time by canceling your account on the Prisma
          Services. You will not receive any refunds if you cancel your account.
        </p>
        <p>
          You agree that Prisma, in its sole discretion and for any or no reason, may terminate your
          account or any part thereof. You agree that any termination of your access to the Prisma
          Services may be without prior notice, and you agree that Prisma will not be liable to you
          or any third party for such termination.
        </p>
        <p>
          Prisma may suspend or disable an Application, a Prisma Compute deployment, a Prisma
          Postgres database, or any other resource provisioned through the Prisma Services that
          violates Section 14 (Acceptable Use), poses a security or operational risk to the Prisma
          Services or to other customers, or exposes Prisma to legal liability. Where required by
          applicable law, Prisma will provide notice and a statement of reasons as described in
          Section 21. Prisma may act immediately and without prior notice where the risk is
          severe, such as child sexual abuse material or
          active attack infrastructure.
        </p>
        <p>
          For Free Tier users, Prisma may discontinue access with reasonable opportunities for
          upgrade or data export. You are solely responsible for exporting your Content prior to
          termination of your account for any reason, provided that if Prisma terminates your
          account, Prisma will provide you a reasonable opportunity to retrieve your Content.
        </p>
        <p>
          Upon any termination of the Prisma Services or your account these Terms will also
          terminate, but Sections 6, 9, 10, 11, 12, 16, 18, and 22 shall continue to be effective
          after these Terms are terminated.
        </p>
      </>
    ),
  },
  {
    title: "10. Exclusion of Warranties",
    content: (
      <>
        <p>
          Nothing in these Terms, including Sections 10 and 11, shall exclude or limit Prisma&apos;s
          warranty or liability for losses which may not be lawfully excluded or limited by
          applicable law.
        </p>
        <p>
          You expressly understand and agree that your use of the Prisma Services is at your sole
          risk and that the Prisma Services are provided &quot;as is&quot; and &quot;as
          available.&quot;
        </p>
        <p>
          Prisma, its subsidiaries and affiliates, and its licensors make no express warranties and
          disclaim all implied warranties regarding the Prisma Services, including implied
          warranties of merchantability, fitness for a particular purpose and non-infringement.
          Without limiting the generality of the foregoing, Prisma, its subsidiaries and affiliates,
          and its licensors do not represent or warrant to you that (a) your use of the Prisma
          Services will meet your requirements, (b) your use of the Prisma Services will be
          uninterrupted, timely, secure or free from error, or (c) data provided through the Prisma
          Services will be accurate.
        </p>
        <p>
          Free Tier users receive no guaranteed support response times, uptime, or feature
          availability. The service is provided &quot;as is&quot; and may be deprioritized during
          periods of high load or maintenance. Beta Services are provided &quot;as is&quot; and
          may have bugs or issues.
        </p>
      </>
    ),
  },
  {
    title: "11. Limitation of Liability",
    content: (
      <>
        <p>
          You expressly understand and agree that Prisma, its subsidiaries and affiliates, and its
          licensors shall not be liable to you for any direct, indirect, incidental, special
          consequential or exemplary damages which may be incurred by you, however caused and under
          any theory of liability. This shall include, but not be limited to, any loss of profit
          (whether incurred directly or indirectly), any loss of goodwill or business reputation,
          any loss of data suffered, cost of procurement of substitute goods or services, or other
          intangible loss.
        </p>
        <p>
          The limitations on Prisma&apos;s liability to you shall apply whether or not Prisma has
          been advised of or should have been aware of the possibility of any such losses arising.
        </p>
        <p>
          Third-party infrastructure provider outages exempt Prisma from liability. Refunds or
          credits do not apply when downtime stems from third-party failures.
        </p>
      </>
    ),
  },
  {
    title: "12. Indemnification",
    content: (
      <p>
        You agree to hold harmless, defend and indemnify Prisma, and its subsidiaries, affiliates,
        officers, agents, employees, advertisers, licensors, suppliers or partners from and against
        any third party claim arising from or in any way related to (a) your breach of the Terms,
        (b) your use of the Prisma Services, (c) your violation of applicable laws, rules or
        regulations in connection with the Prisma Services, or (d) your Content or your Application,
        including any liability or expense arising from all claims, losses, damages (actual and
        consequential), suits, judgments, litigation costs and attorneys&apos; fees, of every kind
        and nature.
      </p>
    ),
  },
  {
    title: "13. Copyright Policy",
    content: (
      <>
        <p>
          It is Prisma&apos;s policy to respond to notices of alleged copyright infringement that
          comply with the United States&apos; Digital Millennium Copyright Act (DMCA) or other
          applicable copyright laws, and to terminate, in appropriate circumstances, the accounts
          of repeat infringers. Prisma reserves the right to remove Content or disable Applications
          upon receiving valid infringement notices.
        </p>
        <p>
          Notices of claimed copyright infringement should be sent to Prisma&apos;s designated
          agent:
        </p>
        <p>
          Copyright Agent
          <br />
          Prisma Data, Inc.
          <br />
          251 Little Falls Drive
          <br />
          Wilmington, New Castle, Delaware 19808
          <br />
          Email: <a href="mailto:abuse@prisma.io">abuse@prisma.io</a>
        </p>
        <p>A copyright infringement notice must include:</p>
        <ul>
          <li>Identification of the copyrighted work claimed to have been infringed</li>
          <li>
            Identification of the material claimed to be infringing and information reasonably
            sufficient to permit Prisma to locate it, such as a URL
          </li>
          <li>
            Your contact information, including your name, address, telephone number, and email
            address
          </li>
          <li>
            A statement that you have a good-faith belief that use of the material in the manner
            complained of is not authorized by the copyright owner, its agent, or the law
          </li>
          <li>
            A statement that the information in the notice is accurate and, under penalty of
            perjury, that you are authorized to act on behalf of the copyright owner
          </li>
          <li>Your physical or electronic signature</li>
        </ul>
        <p>
          If your Content or Application was removed or disabled as a result of an infringement
          notice and you believe this was the result of a mistake or misidentification, you may
          submit a counter-notice to the same contact containing the information required by 17
          U.S.C. § 512(g)(3). Prisma will forward a valid counter-notice to the person who
          submitted the original notice. Unless that person informs Prisma that they have filed an
          action seeking a court order, Prisma may restore the removed material not less than ten
          (10) and not more than fourteen (14) business days after receiving the counter-notice.
        </p>
      </>
    ),
  },
  {
    title: "14. Acceptable Use",
    content: (
      <>
        <p>
          You agree not to use the Prisma Services to host or transmit any content that is unlawful,
          harmful, or otherwise objectionable. Prisma reserves the right to terminate accounts that
          violate this acceptable use policy, which may change at Prisma&apos;s discretion.
        </p>
        <p>Prohibited Content includes, but is not limited to:</p>
        <ul>
          <li>Content that infringes third-party intellectual property</li>
          <li>Excessively profane content</li>
          <li>Content promoting hate, violence, or racial intolerance</li>
          <li>Content advancing hacking or cracking</li>
          <li>Content furthering illegal activity</li>
          <li>Drug paraphernalia content</li>
          <li>Phishing or malicious content</li>
          <li>
            Child sexual abuse material (CSAM) or any content that sexually exploits or endangers
            minors. Prisma applies a zero-tolerance policy and reports apparent child sexual
            exploitation to the relevant authorities
          </li>
          <li>
            Non-consensual intimate imagery, including sexually explicit synthetic or manipulated
            images of real people
          </li>
          <li>Content that promotes or facilitates terrorism or violent extremism</li>
          <li>Any other material that violates criminal laws or third-party rights</li>
        </ul>
        <p>Prohibited Actions include:</p>
        <ul>
          <li>Violating the legal rights of others</li>
          <li>Promoting illegal activity</li>
          <li>
            Using the service for unlawful, invasive, infringing, defamatory, or fraudulent purposes
          </li>
          <li>Intentional distribution of viruses or malware</li>
          <li>Interfering with or disrupting the Prisma Services</li>
          <li>Circumventing security measures</li>
          <li>Generating spam</li>
          <li>
            Cryptocurrency mining or other proof-of-work computation without Prisma&apos;s prior
            written authorization
          </li>
          <li>Operating open proxies, open mail relays, or VPN or Tor exit nodes</li>
          <li>Originating denial-of-service attacks or operating booter or stresser services</li>
          <li>Operating spam infrastructure or sending bulk unsolicited messages</li>
          <li>
            Hosting phishing pages, distributing malware, or operating command-and-control
            infrastructure
          </li>
          <li>Scanning or testing the security of third-party systems without authorization</li>
          <li>
            Abusing bandwidth or egress, such as operating proxy farms or large-scale scraping
            relays
          </li>
          <li>Circumventing usage metering or quotas</li>
          <li>
            Deploying or operating AI systems for practices prohibited by applicable law, such as
            the prohibited AI practices under the EU Artificial Intelligence Act
          </li>
        </ul>
        <p>
          This section applies to Applications deployed on Prisma Compute, to data and files stored
          in Prisma Postgres or elsewhere in the Prisma Services, and to your end users&apos; use of
          your Applications; you are responsible for your end users&apos; compliance. To report a
          violation of this
          section, use the Report Abuse link in the footer of prisma.io or email{" "}
          <a href="mailto:abuse@prisma.io">abuse@prisma.io</a>. Section 21 describes how Prisma
          handles reports.
        </p>
        <p>Beta Services are also subject to these restrictions.</p>
      </>
    ),
  },
  {
    title: "15. Fair Use",
    content: (
      <>
        <p>
          Fair Use guidelines ensure equitable access for all customers, applying to primary account
          holders, administrators, and end-users. Usage limits may apply to API calls, storage, user
          accounts, data processing, request volume, provisioned memory, active CPU time, outbound
          bandwidth, and connection counts to optimize performance.
        </p>
        <p>Prohibited activities include:</p>
        <ul>
          <li>Circumventing account limitations</li>
          <li>Sharing credentials beyond authorized users</li>
          <li>Using the service for illegal purposes</li>
          <li>Deliberately degrading service performance</li>
        </ul>
        <p>
          Automated scripts or bots accessing the Service must be approved in advance and comply
          with our API usage guidelines.
        </p>
        <p>
          Prisma monitors usage to enforce compliance. Enforcement responses may include usage
          discussions, feature limitations, suspension, plan upgrade requirements, and Free Tier
          access restriction or termination for abuse. Repeated or severe violations may result in
          account termination.
        </p>
        <p>
          Policy updates appear on the website and users receive notifications. Questions may be
          directed to <a href="mailto:legal@prisma.io">legal@prisma.io</a>. To report abuse,
          email <a href="mailto:abuse@prisma.io">abuse@prisma.io</a>.
        </p>
      </>
    ),
  },
  {
    title: "16. Other Content",
    content: (
      <>
        <p>
          The Prisma Services may include hyperlinks to other web sites or content or resources.
          Prisma may have no control over any web sites or resources which are provided by companies
          or persons other than Prisma.
        </p>
        <p>
          You acknowledge and agree that Prisma is not responsible for the availability of any such
          external sites or resources, and does not endorse any advertising, products or other
          materials on or available from such web sites or resources.
        </p>
        <p>
          You acknowledge and agree that Prisma is not liable for any loss or damage which may be
          incurred by you as a result of the availability of those external sites or resources, or
          as a result of any reliance placed by you on the completeness, accuracy or existence of
          any advertising, products or other materials on, or available from, such web sites or
          resources.
        </p>
      </>
    ),
  },
  {
    title: "17. Changes to the Terms",
    content: (
      <>
        <p>
          Prisma may make changes to the Terms from time to time. When these changes are made,
          Prisma will make a new copy of these Terms available on this page.
        </p>
        <p>
          You understand and agree that if you use the Prisma Services after the date on which the
          Terms have changed, Prisma will treat your use as acceptance of the updated Terms.
        </p>
        <p>
          If a modification is material, Prisma will provide at least seven (7) days&apos; notice
          before the new terms take effect. What constitutes a material modification will be
          determined at Prisma&apos;s sole discretion. If you do not agree to the modified Terms,
          you should discontinue your use of the Prisma Services.
        </p>
      </>
    ),
  },
  {
    title: "18. General Legal Terms",
    content: (
      <>
        <p>
          The Terms constitute the whole legal agreement between you and Prisma and govern your use
          of the Prisma Services (but excluding any services which Prisma may provide to you under a
          separate written agreement), and completely replace any prior agreements between you and
          Prisma in relation to the Prisma Services.
        </p>
        <p>
          There are no third party beneficiaries to these Terms. The parties are independent
          contractors. The Terms do not create an agency, partnership or joint venture.
        </p>
        <p>
          If Prisma provides you with a translation of the English language version of these Terms,
          the English language version of these Terms will control if there is any conflict.
        </p>
        <p>
          You agree that Prisma may provide you with notices, including those regarding changes to
          the Terms, by email, regular mail, or postings on the Prisma Services. By providing Prisma
          your email address, you consent to our using the email address to send you any notices.
        </p>
        <p>
          You agree that if Prisma does not exercise or enforce any legal right or remedy which is
          contained in the Terms (or which Prisma has the benefit of under any applicable law), this
          will not be taken to be a formal waiver of Prisma&apos;s rights and that those rights or
          remedies will still be available to Prisma.
        </p>
        <p>
          Prisma shall not be liable for failing or delaying performance of its obligations
          resulting from any condition beyond its reasonable control, including but not limited to,
          governmental action, acts of terrorism, earthquake, fire, flood or other acts of God,
          labor conditions, power failures, and Internet disturbances.
        </p>
        <p>
          The Terms, and your relationship with Prisma under the Terms, shall be governed by the
          laws of the State of California without regard to its conflict of laws provisions. You and
          Prisma agree to submit to the exclusive jurisdiction of the courts located within the
          county of Santa Clara, California to resolve any legal matter arising from the Terms.
        </p>
        <p>
          Neither party may assign any of its rights or obligations under these Terms, whether by
          operation of law or otherwise, without the prior written consent of the other party (not
          to be unreasonably withheld).
        </p>
      </>
    ),
  },
  {
    title: "19. Embeddable Prisma Studio",
    content: (
      <>
        <p>
          The free version of Embeddable Prisma Studio is licensed under the Apache 2.0 License and
          may be used in both development and production environments. Prisma branding must remain
          visible in the free version. Removal of branding requires a paid commercial license.
        </p>
        <p>
          Paid versions of Embeddable Prisma Studio require a separate subscription agreement with
          terms distinct from standard Prisma billing.
        </p>
        <p>
          Embeddable Prisma Studio operates as client-side software. Prisma will have no liability
          or responsibility for any loss, corruption, unauthorized disclosure, or misuse of data
          arising from user or end-user misuse.
        </p>
        <p>
          Users bear sole responsibility for regulatory compliance, especially in regulated sectors.
          Prisma disclaims all compliance-related warranties. Users acknowledge that Embeddable
          Prisma Studio is not designed for regulated industries (such as healthcare or finance) and
          assume full compliance responsibility.
        </p>
        <p>
          The free version includes telemetry collection to support service improvements. Repository
          contributors license their contributions under Apache 2.0, granting Prisma usage,
          modification, and distribution rights.
        </p>
      </>
    ),
  },
  {
    title: "20. Hosting Services",
    content: (
      <>
        <p>
          Prisma Compute allows you to deploy and run Applications on infrastructure managed by
          Prisma. You are solely responsible for the code you deploy,
          including its dependencies, security patches and updates, its behavior, and its end users.
          Prisma manages the underlying infrastructure. Prisma has no obligation to monitor, and
          does not endorse, the Applications you deploy or the Content you store, but may act on
          them as described in Sections 9, 14, and 21.
        </p>
        <p>
          Default application URLs, such as subdomains of prisma.build, are provided at
          Prisma&apos;s discretion and may be changed or reclaimed upon termination or suspension
          of your account or Application. By connecting a custom domain, you represent and warrant
          that you own or control that domain. Preview environments, including their Applications
          and databases, may be reclaimed automatically after a period of inactivity, as described
          in the documentation.
        </p>
        <p>
          Prisma Postgres provides managed database services. You control, and are solely
          responsible for, the Customer Content stored in your databases, including any personal
          data of your end users and any consents or notices required to collect and process it.
          Prisma processes personal data contained in Customer Content on your behalf in
          accordance with the DPA described in Section 3.
        </p>
        <p>
          You are responsible for the files and other Customer Content you store using the Prisma
          Services, and for any access you grant to them, including through access keys,
          credentials, and shared or presigned URLs.
        </p>
        <p>
          The Prisma Services are offered from the regions listed in the documentation. Region
          selection determines where your resources are provisioned but does not by itself create a
          data-residency commitment.
        </p>
        <p>
          Prisma may suspend or disable Applications, databases, and other resources as described in
          Section 9. Beta Services used as part of these services are also subject to the Beta
          Services terms in Section 1.
        </p>
      </>
    ),
  },
  {
    title: "21. Reporting Abuse and Illegal Content",
    content: (
      <>
        <p>
          To report abuse, illegal content, or copyright infringement on the Prisma Services, use
          the <a href="mailto:abuse@prisma.io">Report Abuse</a> link in the footer of prisma.io or
          email abuse@prisma.io directly. Anyone may submit a report, whether or not they are a
          Prisma customer.
        </p>
        <p>To help Prisma act on your report, please include:</p>
        <ul>
          <li>
            The location of the content, such as the URL of the Application or resource concerned
          </li>
          <li>
            An explanation of why you believe the content is illegal or violates these Terms
          </li>
          <li>
            Your name and email address, unless the report concerns child sexual abuse material or
            another category for which anonymous reporting is permitted
          </li>
          <li>
            A statement that you believe, in good faith, that the information in your report is
            accurate and complete
          </li>
        </ul>
        <p>
          Where you provide contact details, Prisma will confirm receipt of your report and inform
          you of its decision. Reports are reviewed, and moderation decisions are made, by Prisma
          personnel. Prisma does not currently use automated tools to detect, identify, or act
          against illegal content or content that violates these Terms. If Prisma introduces such
          tools, it will describe them in this Section.
        </p>
        <p>
          When Prisma removes Content or suspends or disables an Application, a Prisma Compute
          deployment, a Prisma Postgres database, any other resource provisioned through the Prisma
          Services, or an account because of illegal content or a violation of Section 14
          (Acceptable Use), Prisma will, where required by applicable law, provide the affected
          user with a statement of the facts and grounds for the decision. You can ask Prisma to
          review a decision by replying to the statement of reasons, and you may also seek redress
          before the courts.
        </p>
        <p>
          Sections 5, 14, and this Section 21 together describe Prisma&apos;s content moderation
          policies for the purposes of applicable law, including the EU Digital Services Act.{" "}
          <a href="mailto:abuse@prisma.io">abuse@prisma.io</a> is Prisma&apos;s single point of
          contact for communications with member state authorities, the European Commission, and
          the European Board for Digital Services, and the point of contact for recipients of the
          service. Communications may be sent in English or German.
        </p>
        <p>
          If Prisma becomes aware of information giving rise to a suspicion that a criminal offense
          involving a threat to the life or safety of a person has taken place, is taking place, or
          is likely to take place, Prisma will promptly inform the relevant law enforcement or
          judicial authorities.
        </p>
        <p>
          Prisma reports apparent child sexual exploitation, including child sexual abuse material,
          to the National Center for Missing &amp; Exploited Children (NCMEC) and to other
          authorities as required by applicable law, including 18 U.S.C. § 2258A.
        </p>
      </>
    ),
  },
  {
    title: "22. Switching and Data Portability",
    content: (
      <>
        <p>
          Exportable data means the Customer Content that you own or control and that you or your
          end users have uploaded to and stored in the Prisma Services. Exportable data does not
          include, and Prisma does not guarantee the export of, Prisma&apos;s own metrics, logs,
          configuration, or infrastructure and service setup details, any other data specific to
          the internal functioning of the Prisma Services, or any intellectual property of Prisma.
          Exportable data also does not include credentials or other secrets that you supply, such
          as environment variable values, which are stored in a form that cannot be retrieved; you
          are responsible for retaining your own copies.
        </p>
        <p>
          You may export your exportable data at any time. Prisma will make it available in a
          structured, commonly used, and machine-readable format and will provide reasonable
          assistance for migrations to another provider or to on-premises infrastructure.
        </p>
        <p>
          Where the EU Data Act applies to your use of the Prisma Services and you ask to switch to
          another provider or to on-premises infrastructure, Prisma will:
        </p>
        <ul>
          <li>
            Start the switching process within a notice period of no more than two (2) months from
            your request
          </li>
          <li>
            Complete the transition within thirty (30) calendar days. If this is technically
            unfeasible, Prisma will tell you within fourteen (14) working days and may extend the
            transition to no more than seven (7) months
          </li>
          <li>
            Keep your exportable data available for retrieval for at least thirty (30) calendar
            days after the transition
          </li>
          <li>
            Erase your exportable data and digital assets after the retrieval period ends,
            provided the switch has been completed successfully
          </li>
        </ul>
        <p>
          Prisma does not impose any termination fee, exit fee, or other charge for terminating
          these Terms or for switching to another provider or to on-premises infrastructure.
          Throughout any switching process, standard service fees continue to apply to your actual
          use of the Prisma Services, including metered usage such as outbound bandwidth, at the
          rates set out on the pricing page. Fees prepaid for a subscription term remain subject to
          Section 4.
        </p>
        <p>
          Notwithstanding the foregoing, where the EU Data Act applies to your use of the Prisma
          Services, data egress charges for data exported as part of a switching process shall be
          charged at cost until 12 January 2027, and from 12 January 2027 Prisma shall not impose
          such charges.
        </p>
      </>
    ),
  },
];
