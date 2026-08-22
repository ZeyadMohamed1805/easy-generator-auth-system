import logoUrl from '../assets/easygenerator-logo.svg';

type BrandLogoProps = {
  compact?: boolean;
};

export function BrandLogo({ compact = false }: BrandLogoProps) {
  return (
    <img
      className={compact ? 'brand-logo brand-logo-compact' : 'brand-logo'}
      src={logoUrl}
      alt="Easygenerator"
      width={119}
      height={42}
    />
  );
}
