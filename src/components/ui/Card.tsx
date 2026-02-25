
type CardProps = {
  children: React.ReactNode;
  className?: string;
};

export default function Card({ children, className = "" }: CardProps) {
  return (
    <div
      className={`bg-white rounded-xl border shadow-sm p-4 ${className}`}
    >
      {children}
    </div>
  );
}