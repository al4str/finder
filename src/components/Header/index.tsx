import clsx from 'clsx';
import { ROUTES } from '@/helpers/routes';
import { Anchor } from '@/components/UI/Anchor';
import { HeaderColorScheme } from '@/components/Header/ColorScheme';
import { HeaderGithubLink } from '@/components/Header/GithubLink';

interface Props {
  className?: string;
}

export function Header(props: Props): JSX.Element {
  const { className = '' } = props;

  return (
    <header className={clsx('flex items-center', className)}>
      <Anchor
        className="logo"
        to={ROUTES.main}
      >
        Finder
      </Anchor>
      <HeaderColorScheme className="ml-auto mr-1" />
      <HeaderGithubLink />
    </header>
  );
}
