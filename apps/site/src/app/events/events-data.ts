export type Meetup = {
  title: string;
  description: string;
  image: string;
  link: string;
};

export type PastEvent = {
  name: string;
  date: string;
  description: string;
  link: string;
  virtual: boolean;
};

export type SponsoredEvent = {
  name: string;
  image: string;
  link: string;
};

export const meetups: Meetup[] = [
  {
    title: "Berlin Prisma Meetup",
    description:
      "Join with other local engineers to discuss the latest database and API developments and learn more about Prisma best practices.",
    image:
      "https://secure.meetupstatic.com/photos/event/9/9/b/2/clean_498279346.jpeg",
    link: "https://www.meetup.com/Berlin-Prisma-Meetup/",
  },
  {
    title: "TypeScript Berlin Meetup",
    description:
      "For anyone interested in JavaScript frameworks and TypeScript in particular. A Meetup to share knowledge, use cases and solve real problems using technology.",
    image:
      "https://secure.meetupstatic.com/photos/event/8/6/8/b/600_498214443.jpeg",
    link: "https://www.meetup.com/TypeScript-Berlin/",
  },
  {
    title: "GraphQL Berlin Meetup",
    description:
      "A regular meetup of people interested in GraphQL and its ecosystem. We have speakers from all around the globe telling us about the latest developments in the GraphQL world.",
    image:
      "https://secure.meetupstatic.com/photos/event/d/4/5/c/clean_498234364.jpeg",
    link: "https://www.meetup.com/graphql-berlin/",
  },
];

export const sponsoredEvents: SponsoredEvent[] = [
  {
    name: "React Day",
    image: "/icons/confs/react-day.jpeg",
    link: "https://reactday.berlin/",
  },
  {
    name: "Jamstack Conf",
    image: "/icons/confs/jamstack-conf.jpeg",
    link: "https://jamstack.org/conf/",
  },
  {
    name: "Next.js Conf",
    image: "/icons/confs/nextjs-conf.jpeg",
    link: "https://nextjs.org/conf",
  },
  {
    name: "International JavaScript Conference",
    image: "/icons/confs/internationaljs-conf.jpeg",
    link: "https://javascript-conference.com/munich/",
  },
];

export const pastEvents: PastEvent[] = [
  {
    name: "Prisma Day 2022",
    date: "June 15–16, 2022",
    description:
      "Prisma Day was a two-day hybrid event of talks and workshops about modern application development and databases, featuring and led by members of our community.",
    link: "https://www.prisma.io/day",
    virtual: false,
  },
  {
    name: "Serverless Conference",
    date: "November 18, 2021",
    description:
      "Adopting serverless comes with many challenges. During this event, we covered how to implement flexible, scalable, and low-cost solutions from industry leaders.",
    link: "https://www.youtube.com/watch?v=dPfdJyLvS5o&list=PLn2e1F9Rfr6lQzahh7M8NcQpYnlYBHZqe",
    virtual: true,
  },
  {
    name: "Prisma Day 2021",
    date: "June 29–30, 2021",
    description:
      "Prisma Day was a two day event of talks and workshops by members of the Prisma community, on modern application development.",
    link: "https://www.prisma.io/day-2021",
    virtual: false,
  },
  {
    name: "Prisma Enterprise Event",
    date: "March 25, 2021",
    description:
      "An online conference focused on the challenges large companies and enterprises face with the management of application data.",
    link: "https://www.prisma.io/enterprise-event-2021",
    virtual: true,
  },
  {
    name: "Prisma Day 2020",
    date: "June 25–26, 2020",
    description:
      "Prisma Day 2020 was a two day, community-focused online conference on modern application development and databases.",
    link: "https://www.prisma.io/day-2020",
    virtual: true,
  },
  {
    name: "Prisma Day 2019",
    date: "June 19, 2019",
    description:
      "Prisma Day was a one day, single-track conference in Berlin focused on databases and application development.",
    link: "https://www.prisma.io/day-2019",
    virtual: false,
  },
];
