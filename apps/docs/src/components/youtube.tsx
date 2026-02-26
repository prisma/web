type YoutubeProps = {
  videoId: string;
  title?: string;
};

export const Youtube = ({ videoId, title = "YouTube video player" }: YoutubeProps) => {
  return (
    <iframe
      src={`https://www.youtube.com/embed/${videoId}`}
      width="100%"
      style={{ aspectRatio: 16 / 9 }}
      loading="lazy"
      referrerPolicy="strict-origin-when-cross-origin"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
      title={title}
    />
  );
};
