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
    <header
      className={clsx('bg-gradient-to-b from-black/40 to-black/0', className)}
      id="header"
    >
      <div className="flex items-center py-2 px-3 sm:px-5 sm:py-4">
        <Anchor
          className="logo"
          to={ROUTES.main}
        >
          Finder
        </Anchor>
        <HeaderColorScheme className="ml-auto mr-3 sm:mr-5" />
        <HeaderGithubLink />
      </div>
    </header>
  );
}
