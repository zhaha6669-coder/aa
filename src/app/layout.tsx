import type { Metadata } from "next";
import { Inter, Cairo } from "next/font/google"; // Import standard Arabic font
import "./globals.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import AmbientBackground from "../components/AmbientBackground";
import Providers from "../components/Providers";
import { Suspense } from "react";
import FirebaseAnalytics from "../components/FirebaseAnalytics";

const inter = Inter({ subsets: ["latin"], variable: '--font-inter' });
const cairo = Cairo({ subsets: ["arabic"], variable: '--font-cairo' }); // Configure Cairo

export const metadata: Metadata = {
    title: {
        default: "Lumina | Premium Software Agency",
        template: "%s | Lumina"
    },
    description: "Lumina is a top-tier software agency specializing in Web Development, Mobile Apps, and UI/UX Design. We craft digital experiences with precision and elegance.",
    keywords: ["Software Agency", "Web Development", "Mobile Apps", "UI/UX Design", "Next.js", "React", "Digital Transformation", "Lumina"],
    authors: [{ name: "Lumina Team" }],
    creator: "Lumina",
    openGraph: {
        type: "website",
        locale: "en_US",
        url: "https://lumina.agency",
        title: "Lumina | Premium Software Agency",
        description: "Crafting digital experiences with precision and elegance. Start your digital transformation with Lumina.",
        siteName: "Lumina",
        images: [
            {
                url: "/og-image.jpg", // Ensure you have this image in public folder
                width: 1200,
                height: 630,
                alt: "Lumina Software Agency",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "Lumina | Premium Software Agency",
        description: "Crafting digital experiences with precision and elegance.",
        images: ["/og-image.jpg"],
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
        },
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className="dark scroll-smooth">
            <body className={`${inter.variable} ${cairo.variable} font-sans min-h-screen flex flex-col relative bg-[#0f0518] text-white`}>
                {/* AmbientBackground must be absolutely positioned behind content */}
                <AmbientBackground />

                {/* Firebase Analytics */}
                <Suspense fallback={null}>
                    <FirebaseAnalytics />
                </Suspense>

                <Providers>
                    <Header />

                    <main className="flex-grow flex flex-col relative z-10 isolate bg-transparent">
                        {children}
                    </main>

                    <Footer />
                </Providers>
            </body>
        </html>
    );
}
