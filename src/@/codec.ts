export type Codec<T> = {
  encode: (value: T) => string;
  decode: (value: string) => T | null;
};

const string: Codec<string> = {
  encode: (value) => value,
  decode: (value) => value,
};

const integer: Codec<number> = {
  encode: (value) => value.toString(),
  decode: (value) => parseInt(value),
};

export const Codec = {
  string,
  integer,
};
