interface SparklineProps {
  values: number[];
  muted?: boolean;
}

export function Sparkline({ values, muted = false }: SparklineProps) {
  const width = 132;
  const height = 42;
  const max = Math.max(...values, 1);
  const min = Math.min(...values, 0);
  const spread = Math.max(max - min, 1);

  const points = values
    .map((value, index) => {
      const x = (index / Math.max(values.length - 1, 1)) * width;
      const y = height - ((value - min) / spread) * (height - 6) - 3;

      return `${x},${y}`;
    })
    .join(" ");

  return (
    <svg
      className={`sparkline ${muted ? "sparkline-muted" : ""}`}
      viewBox={`0 0 ${width} ${height}`}
      aria-hidden="true"
      focusable="false"
    >
      <polyline points={points} />
    </svg>
  );
}
