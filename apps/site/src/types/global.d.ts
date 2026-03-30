declare global {
  interface Window {
    Tally?: {
      loadEmbeds: () => void;
<<<<<<< feat/DR-7738-partners
      openPopup: (formId: string, options?: Record<string, unknown>) => void;
      closePopup: (formId: string) => void;
=======
>>>>>>> main
    };
  }
}

export {};
