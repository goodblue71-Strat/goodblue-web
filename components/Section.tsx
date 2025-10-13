export default function Section({
  id,
  children,
  className = "",
  narrow = false,
}: {
  id?: string;
  children: React.ReactNode;
  className?: string;
  narrow?: boolean;
}) {
  return (
    <section id={id} className={`py-16 sm:py-20 ${className}`}>
      <div className={`${narrow ? "max-w-3xl" : "max-w-6xl"} mx-auto`}>{children}</div>
    </section>
  );
}
