type SkeletonProps = {
  width?: string | number;
  height?: string | number;
  style?: React.CSSProperties;
};

export default function Skeleton({
  width = "100%",
  height = "16px",
  style = {},
}: SkeletonProps) {
  return (
    <div
      className="skeleton"
      style={{
        width,
        height,
        ...style,
      }}
    />
  );
}