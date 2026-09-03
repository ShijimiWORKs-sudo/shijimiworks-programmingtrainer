interface PageHeaderProps {
  title: string;
  eyebrow?: string;
  children?: React.ReactNode;
}

export function PageHeader({ title, eyebrow, children }: PageHeaderProps) {
  return (
    <div className="page-header">
      {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
      <h1>{title}</h1>
      {children ? <div className="page-header-body">{children}</div> : null}
    </div>
  );
}
