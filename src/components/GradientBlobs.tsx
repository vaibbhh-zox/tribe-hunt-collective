export function GradientBlobs() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div
        className="animate-blob absolute -top-32 -left-20 h-[420px] w-[420px] rounded-full opacity-40 blur-3xl"
        style={{ background: "radial-gradient(circle, oklch(0.72 0.22 340 / 0.7), transparent 70%)" }}
      />
      <div
        className="animate-blob absolute top-1/3 -right-32 h-[520px] w-[520px] rounded-full opacity-30 blur-3xl"
        style={{ background: "radial-gradient(circle, oklch(0.55 0.27 295 / 0.6), transparent 70%)", animationDelay: "5s" }}
      />
      <div
        className="animate-blob absolute bottom-0 left-1/3 h-[380px] w-[380px] rounded-full opacity-25 blur-3xl"
        style={{ background: "radial-gradient(circle, oklch(0.65 0.25 305 / 0.55), transparent 70%)", animationDelay: "10s" }}
      />
      <div
        className="absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage:
            "linear-gradient(oklch(1 0 0) 1px, transparent 1px), linear-gradient(90deg, oklch(1 0 0) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
          maskImage: "radial-gradient(ellipse at center, black 20%, transparent 70%)",
        }}
      />
    </div>
  );
}
