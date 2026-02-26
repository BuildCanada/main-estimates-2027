import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
	title: "2026–27 Main Estimates Dashboard",
	description: "Interactive dashboard exploring Canada's 2026-27 Main Estimates — $502.8B in planned government spending.",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<head>
				<link rel="icon" href="/favicon.svg" type="image/svg+xml"></link>
			</head>
			<body className="antialiased">{children}</body>
		</html>
	);
}
