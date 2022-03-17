import clsx from 'clsx';
import { Anchor } from '@/components/UI/Anchor';
import styles from './styles.module.css';

interface Props {
  className?: string;
}

export function HeaderGithubLink(props: Props): JSX.Element {
  const { className = '' } = props;

  return (
    <Anchor
      className={clsx('btn btn-flat', className)}
      type="anchor"
      to="https://github.com/al4str/finder"
      target="_blank"
      rel="noopener nofollow"
    >
      <span className="btn-wrp">
        <span className={clsx('btn-icon bg-center bg-no-repeat bg-contain', styles.icon)} />
      </span>
    </Anchor>
  );
}
