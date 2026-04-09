import { Accordions, Accordion } from "@prisma/eclipse";

export const FooterAccordion = () => {
  return (
    <div className="w-full">
      <Accordions type="single" defaultValue="type-safety">
        <Accordion
          value="type-safety"
          className="[&_button>svg]:text-foreground-neutral"
          title={
            <div className="text-foreground-neutral font-sans-display font-black flex gap-2 items-center">
              <i className="fa-regular fa-message-text" />
              <span>Type-safety</span>
            </div>
          }
        >
          <p className="text-foreground-neutral-weak">
            With Prisma ORM’s first-class TypeScript support, developers benefit
            from compile-time type checking, significantly reducing runtime
            errors. Any changes in the database schema are reflected in the
            code, prompting immediate updates where necessary.
          </p>
        </Accordion>
        <Accordion
          value="security-features"
          className="[&_button>svg]:text-foreground-neutral"
          title={
            <div className="text-foreground-neutral font-sans-display font-black flex gap-2 items-center">
              <i className="fa-regular fa-shield-keyhole" />
              <span>Security features</span>
            </div>
          }
        >
          <p className="text-foreground-neutral-weak">
            Prisma ORM mitigates common security vulnerabilities, such as SQL
            injection, by abstracting raw SQL queries and sanitizing inputs.
            This built-in protection layer adds an additional security safeguard
            for applications.
          </p>
        </Accordion>
        <Accordion
          value="performance-considerations"
          className="[&_button>svg]:text-foreground-neutral"
          title={
            <div className="text-foreground-neutral font-sans-display font-black flex gap-2 items-center">
              <i className="fa-regular fa-chart-line" />
              <span>Performance considerations</span>
            </div>
          }
        >
          <p className="text-foreground-neutral-weak">
            While ORMs add a layer of abstraction, Prisma ORM is optimized to
            generate efficient SQL queries, minimizing performance overhead.
            Techniques such as query batching and selective loading of data
            ensure applications remain responsive and scalable.
          </p>
        </Accordion>
      </Accordions>
    </div>
  );
};
