function Blob({ className = "", style }) {
  return (
    <div
      className={className}
      style={{
        position: "absolute",
        borderRadius: "50%",
        filter: "blur(80px)",
        pointerEvents: "none",
        ...style,
      }}
    />
  );
}

export default Blob;
