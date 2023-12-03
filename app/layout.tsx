import type { Metadata } from "next";
import LayoutProvider from "./components/LayoutProvider";
import "./globals.css";

export const metadata: Metadata = {
	title: "PulsePersona Wallet",
	description: "PulsePersona Wallet",
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en">
			<body>
				<LayoutProvider>{children}</LayoutProvider>
			</body>
		</html>
	);
}
