export default function AppBackground() {
  return (
    <div className="fixed inset-0 -z-10 h-full w-full bg-background overflow-hidden">
      {/* Bottom Right Accent Glow */}
      <div className="absolute bottom-[-10%] right-[-10%] h-150 w-150 rounded-full bg-accent blur-[120px] opacity-50" />

      {/* Center Subtle Highlight */}
      <div className="absolute top-[20%] left-[30%] h-100 w-200 rounded-full bg-muted blur-[150px] opacity-10" />
    </div>
  );
}
