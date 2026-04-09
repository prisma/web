import type { ReactNode } from "react";

export const slaLastUpdated = "March 11, 2024";

type SlaSection = {
  title: string;
  content: ReactNode;
};

export const slaSections: SlaSection[] = [
  {
    title: "1. Commitment to Service",
    content: (
      <>
        <p>
          Prisma commits to maintaining 99.95% monthly uptime for paid plan
          subscribers. The company strives to ensure reliable service access,
          though this guarantee applies only to Pro, Business, and Enterprise
          users.
        </p>
        <p>
          Free Tier and Starter Plan participants are excluded from service
          credits and uptime assurances.
        </p>
      </>
    ),
  },
  {
    title: "2. Glossary of Terms",
    content: (
      <>
        <p>Key definitions used throughout this agreement:</p>
        <ul>
          <li>
            <b>Monthly Uptime Percentage:</b> Continuous 5-minute downtime
            periods divided by total monthly 5-minute periods.
          </li>
          <li>
            <b>Downtime:</b> Exceeds 5% error rate threshold.
          </li>
          <li>
            <b>Downtime Period:</b> One or more consecutive minutes of downtime.
            Intermittent issues under 1 minute are excluded.
          </li>
          <li>
            <b>Error Rate:</b> Valid requests returning HTTP 5XX errors divided
            by total requests (minimum 100 requests).
          </li>
          <li>
            <b>Back-Off Requirements:</b> Mandatory pauses between
            error-triggered requests, starting at 1 second, exponentially
            increasing to 32 seconds maximum.
          </li>
          <li>
            <b>Valid Requests:</b> Requests conforming to documentation that
            normally produce non-error responses.
          </li>
        </ul>
      </>
    ),
  },
  {
    title: "3. Service Credits",
    content: (
      <>
        <p>
          Compensation credits apply to future payments only. Credits are
          non-refundable and non-transferable. The minimum credit threshold is $1
          USD.
        </p>
        <p>Compensation structure:</p>
        <ul>
          <li>
            <b>10% credit</b> for monthly uptime between 99% and 99.95%.
          </li>
          <li>
            <b>25% credit</b> for monthly uptime below 99%.
          </li>
        </ul>
      </>
    ),
  },
  {
    title: "4. Exclusions from Service Commitment",
    content: (
      <>
        <p>
          The SLA does not cover unavailability caused by factors outside
          Prisma&apos;s reasonable control, including but not limited to:
        </p>
        <ul>
          <li>Uncontrollable external factors</li>
          <li>User negligence or misconfiguration</li>
          <li>Third-party service failures</li>
          <li>Actions taken in accordance with Prisma&apos;s policies</li>
          <li>Pre-GA (General Availability) features</li>
        </ul>
        <p>
          Free Tier users receive no uptime guarantees. Starter Plan users lack
          SLA coverage. Early Access or Preview feature users are excluded from
          SLA protections.
        </p>
      </>
    ),
  },
  {
    title: "5. Procedure for Credit Requests and Payments",
    content: (
      <>
        <p>
          To submit an SLA credit request, open a support ticket via the Prisma
          Platform Console with the category &quot;Billing&quot; and the title
          &quot;SLA Credit Request.&quot;
        </p>
        <p>Your request must include:</p>
        <ul>
          <li>Specific downtime dates and times</li>
          <li>Affected service URLs</li>
          <li>Redacted request logs demonstrating the issue</li>
        </ul>
        <p>
          Claims must be submitted within two billing cycles of the incident.
          Credits will be issued within one billing cycle after validation.
        </p>
      </>
    ),
  },
  {
    title: "6. Exclusions",
    content: (
      <p>
        SLA terms apply exclusively to Pro, Business, and Enterprise plan
        subscribers. Free Tier and Starter Plan users are not covered by this
        Service Level Agreement.
      </p>
    ),
  },
];
