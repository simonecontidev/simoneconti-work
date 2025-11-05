declare global {
  interface Document {
    startViewTransition?: (updateCallback: () => void) => {
      ready?: Promise<void>;
      finished?: Promise<void>;
      updateCallbackDone?: Promise<void>;
    };
  }
}
export {};