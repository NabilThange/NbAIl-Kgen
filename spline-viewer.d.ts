declare namespace JSX {
  interface IntrinsicElements {
    'spline-viewer': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & { 
      url?: string;
      events-target?: string;
      'loading-anim-type'?: string;
      // Add other Spline Viewer specific props here if needed
    };
  }
} 