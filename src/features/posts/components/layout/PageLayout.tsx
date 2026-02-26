type Props = {
  children: React.ReactNode;
};

export default function PageLayout({ children }: Props) {
  return (
    <main className="max-w-2xl mx-auto px-4 py-6">
      {children}
    </main>
  );
}