export const lines = (text: string) => text.split('\n').map(it => it.trim()).filter(it => it.length > 0);
export const isLowerCase = (value: string) => {
  const match = value.toLowerCase().match(new RegExp(`${value}`));

  return (match && match?.length > 0) || false;
}