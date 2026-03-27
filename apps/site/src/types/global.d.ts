declare global {
  interface Window {
    Tally?: {
      loadEmbeds: () => void;
    };
  }
}

export {};
