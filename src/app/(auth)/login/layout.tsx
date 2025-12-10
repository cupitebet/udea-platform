import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'UDEA - Login',
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
