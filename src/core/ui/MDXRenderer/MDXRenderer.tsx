import { getMDXComponent } from 'next-contentlayer/hooks';
type MDXComponents = Record<string, React.ComponentType<any>>;
import styles from './MDXRenderer.module.css';
import Components from './MDXComponents';

function Mdx({
  code,
}: React.PropsWithChildren<{
  code: string;
}>) {
  const Component = getMDXComponent(code);

  return (
    <div className={styles['MDX']}>
      <Component components={Components as unknown as MDXComponents} />
    </div>
  );
}

export default Mdx;
