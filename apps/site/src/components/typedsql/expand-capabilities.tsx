import { Card, CardContent, Action } from "@prisma/eclipse";

const capabilities = [
  {
    icon: "fa-regular fa-layer-group",
    title: "Works alongside Prisma Schema & Migrate",
    description:
      "TypedSQL complements Prisma Schema and Prisma Migrate. It extends the functionality you're already used to with type-safe SQL queries.",
  },
  {
    icon: "fa-light fa-bolt",
    title: "Use with Prisma Accelerate",
    description:
      "Continue using SQL queries while benefiting from products built for Prisma Client, such as connection pooling and caching provided by Accelerate.",
  },
];

export const ExpandCapabilities = () => {
  return (
    <div className="max-w-[1232px] mx-auto px-4 py-16 md:py-24">
      <div className="text-center mb-10">
        <h2 className="text-foreground-neutral stretch-display text-4xl font-black! font-sans-display mt-0 mb-4">
          Expand your capabilities
        </h2>
        <p className="text-foreground-neutral-weak! text-base max-w-2xl mx-auto">
          Built on Prisma Client, TypedSQL pairs well with all Prisma products and features.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-[900px] mx-auto">
        {capabilities.map((item) => (
          <Card key={item.title} className="p-6!">
            <CardContent className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <Action color="orm" size="4xl" className="bg-background-orm-strong shrink-0">
                  <i className={`text-xl ${item.icon}`} />
                </Action>
                <h3 className="text-foreground-neutral font-sans-display text-lg font-bold m-0">
                  {item.title}
                </h3>
              </div>
              <p className="text-foreground-neutral-weak text-sm m-0">{item.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
