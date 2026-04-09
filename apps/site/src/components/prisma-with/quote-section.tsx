import { Quote } from "@prisma-docs/ui/components/quote";

type QuoteSectionData = {
  text: string;
  author: {
    name: string;
    imageUrl: string;
    title: string;
    company: string;
  };
};

export function QuoteSection({ data }: { data: QuoteSectionData }) {
  return (
    <div className="my-12">
      <div className="px-4 md:px-8 py-12 flex flex-col gap-12 mx-auto w-fit">
        <Quote author={data.author} className="max-w-173">
          <p>{data.text}</p>
        </Quote>
      </div>
    </div>
  );
}
