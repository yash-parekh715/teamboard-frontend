interface Window {
  google: {
    accounts: {
      id: {
        initialize: (config: {
          client_id: string;
          callback: (response: any) => void;
        }) => void;
        prompt: () => void;
        renderButton: (element: HTMLElement, options: any) => void;
      };
    };
  };
}
