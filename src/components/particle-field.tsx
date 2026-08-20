export function ParticleField() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {Array.from({ length: 24 }).map((_, index) => (
        <span
          key={index}
          className="particle"
          style={{
            left: `${(index * 17) % 100}%`,
            top: `${(index * 23) % 100}%`,
            animationDelay: `${index * 0.8}s`,
            animationDuration: `${5 + (index % 5)}s`,
          }}
        />
      ))}
    </div>
  );
}
