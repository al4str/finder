import clsx from 'clsx';
import { HeaderColorScheme } from '@/components/Header/ColorScheme';
import { Anchor } from '@/components/UI/Anchor';
import { ROUTES } from '@/helpers/routes';
import styles from './styles.module.css';

interface Props {
  className?: string;
}

export function Header(props: Props): JSX.Element {
  const { className = '' } = props;

  return (
    <header className={clsx('flex items-center', className)}>
      <Anchor
        className="link text-4xl logo"
        to={ROUTES.main}
      >
        Finder
      </Anchor>
      <HeaderColorScheme className="ml-auto mr-1" />
      <Anchor
        className="btn btn-small btn-flat"
        type="anchor"
        to="https://github.com/al4str/finder"
        target="_blank"
        rel="noopener nofollow"
      >
        <span className="btn-wrp">
          <span className={clsx('btn-icon bg-center bg-no-repeat bg-contain', styles.iconGithub)} />
        </span>
      </Anchor>
    </header>
  );
}
