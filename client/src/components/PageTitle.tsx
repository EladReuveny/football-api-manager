type PageTitleProps = {
  title: string;
};

const PageTitle = ({title}: PageTitleProps) => {
  return (
    <h1 className="text-center font-bold text-4xl border-y border-(--color-primary) py-2">
      {title}
    </h1>
  );
};

export default PageTitle;
