function Subtitle({styleClass, children}) {
  return (
    <div
      className={`flex items-center justify-between text-xl font-semibold ${styleClass}`}
    >
      {children}
    </div>
  );
}

export default Subtitle;
