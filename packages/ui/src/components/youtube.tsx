type YoutubeProps = {
  videoId: string;
  title?: string;
  width?: number | string;
  height?: number | string;
  playerVars?: Record<string, string | number | boolean>;
};

const EMPTY_PLAYER_VARS: Record<string, string | number | boolean> = {};

export const Youtube = ({
  videoId,
  title = "YouTube video player",
  width = "100%",
  height,
  playerVars = EMPTY_PLAYER_VARS,
}: YoutubeProps) => {
  const params = new URLSearchParams();

  Object.entries(playerVars).forEach(([key, value]) => {
    params.set(key, String(value));
  });

  const queryString = params.toString();
  const src = `https://www.youtube.com/embed/${videoId}${queryString ? `?${queryString}` : ""}`;

  return (
    <iframe
      src={src}
      width={width}
      height={height}
      style={height == null ? { aspectRatio: 16 / 9 } : undefined}
      loading="lazy"
      referrerPolicy="strict-origin-when-cross-origin"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
      title={title}
    />
  );
};
