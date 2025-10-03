export interface ISourceOptions {
  background?: {
    color?: {
      value: string;
    };
  };
  fpsLimit?: number;
  interactivity?: any;
  particles?: any;
  detectRetina?: boolean;
}

// Helper function to get optimized particle count based on screen size
const getParticleCount = (baseCount: number, isMobile: boolean = false): number => {
  return isMobile ? Math.floor(baseCount * 0.4) : baseCount;
};

// Helper function to get optimized FPS based on device
const getOptimizedFPS = (isMobile: boolean = false): number => {
  return isMobile ? 30 : 60;
};

export const getBackgroundParticles = (isMobile: boolean = false): ISourceOptions => ({
  background: {
    color: {
      value: "transparent",
    },
  },
  fpsLimit: getOptimizedFPS(isMobile),
  interactivity: {
    events: {
      onClick: {
        enable: !isMobile,
        mode: "push",
      },
      onHover: {
        enable: !isMobile,
        mode: "repulse",
      },
      resize: true,
    },
    modes: {
      push: {
        quantity: isMobile ? 2 : 4,
      },
      repulse: {
        distance: isMobile ? 50 : 100,
        duration: 0.4,
      },
    },
  },
  particles: {
    color: {
      value: ["#667eea", "#764ba2"],
    },
    links: {
      color: "#667eea",
      distance: 150,
      enable: false,
      opacity: 0.3,
      width: 1,
    },
    move: {
      direction: "none",
      enable: true,
      outModes: {
        default: "bounce",
      },
      random: true,
      speed: isMobile ? 0.5 : 1,
      straight: false,
    },
    number: {
      density: {
        enable: true,
        area: 800,
      },
      value: getParticleCount(30, isMobile),
    },
    opacity: {
      value: isMobile ? 0.2 : 0.3,
      random: true,
      animation: {
        enable: !isMobile,
        speed: 1,
        minimumValue: 0.1,
        sync: false,
      },
    },
    shape: {
      type: "circle",
    },
    size: {
      value: { min: 1, max: isMobile ? 2 : 3 },
      random: true,
      animation: {
        enable: !isMobile,
        speed: 2,
        minimumValue: 0.5,
        sync: false,
      },
    },
  },
  detectRetina: true,
});

// Legacy export for backward compatibility
export const backgroundParticles: ISourceOptions = getBackgroundParticles(false);

export const clickParticles: ISourceOptions = {
  background: {
    color: {
      value: "transparent",
    },
  },
  fpsLimit: 60,
  interactivity: {
    events: {
      onClick: {
        enable: true,
        mode: "push",
      },
    },
    modes: {
      push: {
        quantity: 10,
      },
    },
  },
  particles: {
    color: {
      value: ["#ff6b6b", "#4ecdc4", "#45b7d1", "#96ceb4", "#ffeaa7"],
    },
    move: {
      direction: "none",
      enable: true,
      outModes: {
        default: "destroy",
      },
      random: true,
      speed: 3,
      straight: false,
    },
    number: {
      density: {
        enable: false,
        area: 800,
      },
      value: 0,
    },
    opacity: {
      value: 0.8,
      animation: {
        enable: true,
        speed: 2,
        minimumValue: 0,
        sync: false,
      },
    },
    shape: {
      type: ["circle", "star"],
    },
    size: {
      value: { min: 2, max: 8 },
      random: true,
      animation: {
        enable: true,
        speed: 5,
        minimumValue: 0,
        sync: false,
      },
    },
    life: {
      duration: {
        sync: false,
        value: 2,
      },
      count: 1,
    },
  },
  detectRetina: true,
};

export const getSuccessParticles = (isMobile: boolean = false): ISourceOptions => ({
  background: {
    color: {
      value: "transparent",
    },
  },
  fpsLimit: getOptimizedFPS(isMobile),
  particles: {
    color: {
      value: ["#00C851", "#4CAF50"],
    },
    move: {
      direction: "top",
      enable: true,
      outModes: {
        default: "out",
      },
      speed: isMobile ? 1 : 2,
      straight: true,
    },
    number: {
      density: {
        enable: false,
        area: 800,
      },
      value: getParticleCount(50, isMobile),
    },
    opacity: {
      value: isMobile ? 0.5 : 0.7,
      animation: {
        enable: !isMobile,
        speed: 1,
        minimumValue: 0,
        sync: false,
      },
    },
    shape: {
      type: "circle",
    },
    size: {
      value: { min: 1, max: isMobile ? 3 : 4 },
      random: true,
    },
    life: {
      duration: {
        sync: false,
        value: isMobile ? 2 : 3,
      },
      count: 1,
    },
  },
  detectRetina: true,
});

export const successParticles: ISourceOptions = getSuccessParticles(false);

export const getErrorParticles = (isMobile: boolean = false): ISourceOptions => ({
  background: {
    color: {
      value: "transparent",
    },
  },
  fpsLimit: getOptimizedFPS(isMobile),
  particles: {
    color: {
      value: ["#ff4444", "#ff6b6b"],
    },
    move: {
      direction: "none",
      enable: true,
      outModes: {
        default: "bounce",
      },
      random: true,
      speed: isMobile ? 1 : 2,
      straight: false,
    },
    number: {
      density: {
        enable: false,
        area: 800,
      },
      value: getParticleCount(30, isMobile),
    },
    opacity: {
      value: isMobile ? 0.4 : 0.6,
      animation: {
        enable: !isMobile,
        speed: 2,
        minimumValue: 0.1,
        sync: false,
      },
    },
    shape: {
      type: "triangle",
    },
    size: {
      value: { min: 2, max: isMobile ? 4 : 6 },
      random: true,
      animation: {
        enable: !isMobile,
        speed: 3,
        minimumValue: 1,
        sync: false,
      },
    },
    life: {
      duration: {
        sync: false,
        value: isMobile ? 3 : 4,
      },
      count: 1,
    },
  },
  detectRetina: true,
});

export const errorParticles: ISourceOptions = getErrorParticles(false);
