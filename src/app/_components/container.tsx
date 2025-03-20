type Props = {
  children?: React.ReactNode;
};

const Container = ({ children }: Props) => {
  return <div className="max-w-1.5xl mx-auto px-5 py-10">{children}</div>;
};

export default Container;
