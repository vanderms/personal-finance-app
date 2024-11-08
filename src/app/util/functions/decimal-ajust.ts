export function decimalAdjust(
  type: 'round' | 'floor' | 'ceil',
  value: number,
  exp: number,
): number {
  const mapper = {
    round: Math.round,
    floor: Math.floor,
    ceil: Math.ceil,
  } as const;

  const operation = mapper[type];

  let digits = [...String(value).split(''), ...new Array(exp).fill('0')];

  const dotIndex = digits.indexOf('.');

  if (dotIndex === -1) {
    return value;
  } else {
    digits = digits.filter((x) => x !== '.');
    digits.splice(dotIndex + 2, 0, '.');
  }

  value = Number(digits.join(''));

  value = operation(value);

  return operation(value) / 10 ** exp;
}
