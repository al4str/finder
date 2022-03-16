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
      className={clsx(className)}
      id="header"
    >
      <div className="flex items-center py-2 px-3 background-blurred">
        <Anchor
          className="logo"
          to={ROUTES.main}
        >
          Finder
        </Anchor>
        <HeaderColorScheme className="ml-auto mr-1" />
        <HeaderGithubLink />
      </div>
    </header>
  );
}
