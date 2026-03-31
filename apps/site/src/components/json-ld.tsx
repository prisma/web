type JsonLdProps = {
  id: string;
  data: Record<string, unknown> | Array<Record<string, unknown>>;
};

export function JsonLd({ id, data }: JsonLdProps) {
  return (
    <script
      id={id}
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
