type Props = {
  children: React.ReactNode;
};

export default function PageContainer({ children }: Props) {
  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      {children}
    </div>
  );
}