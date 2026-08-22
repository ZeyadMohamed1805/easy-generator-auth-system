export type PasswordHintsProps = {
  value: string;
};

export type PasswordCheck = {
  id: string;
  label: string;
  test: (value: string) => boolean;
};
