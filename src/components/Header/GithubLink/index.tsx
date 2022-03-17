import clsx from 'clsx';
import { Anchor } from '@/components/UI/Anchor';
import Github from '@/components/Icons/github.svg';

interface Props {
  className?: string;
}

export function HeaderGithubLink(props: Props): JSX.Element {
  const { className = '' } = props;

  return (
    <Anchor
      className={clsx('btn btn-blurred', className)}
      type="anchor"
      to="https://github.com/al4str/finder"
      target="_blank"
      rel="noopener nofollow"
    >
      <span className="btn-wrp">
        <Github className="btn-icon" />
      </span>
    </Anchor>
  );
}
