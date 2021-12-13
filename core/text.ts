export type Options = { allowBlank?: boolean }

export const lines = (text: string, opts: Options = { allowBlank: false }) => 
  text.split('\n').map(it => it.trim()).filter(it => {
    return (opts.allowBlank) ? true : it.length > 0;
  });

export const isLowerCase = (value: string) => {
  const match = value.toLowerCase().match(new RegExp(`${value}`));

  return (match && match?.length > 0) || false;
}