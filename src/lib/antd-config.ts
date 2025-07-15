import { ConfigProvider } from "antd";
import { ThemeConfig } from "antd/es/config-provider/context";

// Configure Ant Design global settings
export const antdConfig = {
  theme: {
    token: {
      colorPrimary: "#f97316", // orange-600
      borderRadius: 8,
      colorLink: "#f97316",
      colorLinkHover: "#ea580c",
    },
    components: {
      Button: {
        borderRadius: 8,
        paddingInline: 16,
      },
      Card: {
        borderRadius: 12,
      },
      Select: {
        borderRadius: 8,
      },
      Input: {
        borderRadius: 8,
      },
    },
  },
  // Disable compatibility warnings
  warning: {
    showWarning: false,
  },
} as const;
