import localFont from "next/font/local";
import "./globals.css";
import RTKProvider from "@/state/ReduxProvider";
import { UserProvider } from "@auth0/nextjs-auth0/client";
import ReactQueryClientProvider from "@/components/Providers/ReactQueryProvider";
import { MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";
import LoggedInUserProvider from "@/components/Providers/LoggedInUserProvider";
import { Toaster } from "react-hot-toast";
import MainClientLayout from "./clientLayout";
import LoggedInTenantProvider from "@/components/Providers/LoggedInTenantProvider";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

// Metadata for SEO
export const metadata = {
  title: "Fitbinary | All-in-One Gym Management Software",
  description:
    "Fitbinary is a powerful, enterprise-grade gym management system designed to streamline operations, manage memberships, and grow your fitness business effortlessly.",
  keywords:
    "gym management software, fitness software, Fitbinary, membership management, gym billing system, personal trainer software, gym CRM",
  authors: [{ name: "Fitbinary", url: "http://localhost:3000" }],
  creator: "Fitbinary",
  metadataBase: new URL("http://localhost:3000"),
  openGraph: {
    title: "Fitbinary | Enterprise Gym Management Software",
    description:
      "Manage your gym like a pro with Fitbinary's powerful, easy-to-use fitness management system.",
    url: "http://localhost:3000",
    siteName: "Fitbinary",
    images: [
      {
        url: "http://localhost:3000/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Fitbinary Gym Software",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Fitbinary | Gym Management Made Simple",
    description:
      "Fitbinary is a robust platform to manage memberships, billings, trainers, attendance, and more.",
    creator: "@fitbinary",
    images: ["http://localhost:3000/twitter-card.jpg"],
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  themeColor: "#ffffff",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <LoggedInUserProvider>
          <LoggedInTenantProvider>
            <ReactQueryClientProvider>
              <MantineProvider
                withGlobalStyles
                withNormalizeCSS
                theme={{
                  components: {
                    Pagination: {
                      styles: {
                        item: {
                          backgroundColor: "#ffff",
                          color: "white",
                          "&:hover": {
                            backgroundColor: "#ffff",
                          },
                        },
                        active: {
                          backgroundColor: "#ffff",
                          color: "white",
                          fontWeight: "bold",
                        },
                      },
                    },
                  },
                }}
              >
                <RTKProvider>
                  <UserProvider>
                    <Toaster />
                    <MainClientLayout>
                      <div className="w-full">{children}</div>
                    </MainClientLayout>
                  </UserProvider>
                </RTKProvider>
              </MantineProvider>
            </ReactQueryClientProvider>
          </LoggedInTenantProvider>
        </LoggedInUserProvider>
      </body>
    </html>
  );
}
