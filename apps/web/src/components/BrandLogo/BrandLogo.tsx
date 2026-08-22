import logoUrl from '@/assets/easygenerator-logo.svg';
import { cx } from '@/utils';
import styles from './BrandLogo.module.css';
import type { BrandLogoProps } from './BrandLogo.types';

export default function BrandLogo({ compact = false }: BrandLogoProps) {
  return (
    <img
      className={cx(styles.logo, compact && styles.compact)}
      src={logoUrl}
      alt="Easygenerator"
      width={119}
      height={42}
    />
  );
}
